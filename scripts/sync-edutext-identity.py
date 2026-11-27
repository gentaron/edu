#!/usr/bin/env python3
"""Build src/app/wiki/state/identity.json from gentaron/edutext character-names tables.

Identity (aliases, formal names, nicknames) comes only from edutext. Wiki entries are linked
to registry IDs by (1) a unique alias match, or (2) an explicit override below that cites the
edutext passage confirming the same person. Anything else is a different person.
Usage: python3 scripts/sync-edutext-identity.py ../edutext
"""
import json, re, subprocess, sys, collections, pathlib

EDUTEXT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "../edutext")
OUT = pathlib.Path(__file__).resolve().parent.parent / "src/app/wiki/state/identity.json"
WIKI_DUMP = pathlib.Path(sys.argv[2]) if len(sys.argv) > 2 else None

# Same-person links that names alone cannot decide. Each cites the edutext evidence.
OVERRIDES = {
    "Diana": (["C095"], "DianaWorld.txt: Diana is the Wonder Woman of the story; wiki: first Wonder Woman"),
    "グエ": (["C012"], "character-names and character-birthdays: Gue C012 and Tina C013 have separate IDs, names and birthdays"),
    "弦太郎": (["C008"], "character-names: C008 ゲンタロウ, given name 弦太郎 (Gentaroworld.txt)"),
    "Kate Claudia": (["C003"], "character-names: C003 first-generation Katherine Claudia Patton, founder era"),
    "Kate Patton": (["C004"], "character-names: C004 second-generation Katherine Eleanor Patton (E522+)"),
    "ミナ・エウレカ・エルンスト": (["C002"], "character-names: C002 user-specified formal name Wilhelmina Eureka Ernest (Mina)"),
    "ガレス": (["C018"], "IRIS_1.txt: ガレス・ヴァンダール of Bogdas Javelin"),
    "ワドリナ": (["C024"], "IRIS_2.txt: ワドリナ・レヴェルズ of Bogdas Javelin"),
    "ゴルディロックス": (["C041"], "IRIS_3.txt: Alpha Venom operative ゴルディロックス・チューン"),
    "カタリナ": (["C043"], "IRIS_3.txt: Alpha Venom combatant カタリナ・カール"),
    "女王リアナ・ソリス": (["C122"], "nebura.txt: リアナ・ソリス"),
    "マスター・クインシアス": (["C134"], "nebura.txt: Master Quinsias of Granbell"),
    "アレン": (["C101"], "nebura.txt: アレン, CEO of Strawberry (アレン・クロフォード)"),
}

def table(name):
    rows = {}
    for line in (EDUTEXT / name).read_text(encoding="utf-8").splitlines():
        if re.match(r"\| C\d+ ", line):
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            rows[cells[0]] = cells
    return rows

def formal(name, pattern):
    out = collections.defaultdict(list)
    for line in (EDUTEXT / name).read_text(encoding="utf-8").splitlines():
        m = re.match(pattern, line.strip())
        if m:
            out[m[1]] += [m[2].strip(), m[3].strip()]
    return out

def norm(s):
    return re.sub(r"[\s・·\-‐－=＝_（）()／/「」\"'.,，、]", "", s).lower()

jp, en = table("character-names_JP.txt"), table("character-names_EN.txt")
fj = formal("character-names_JP.txt", r"(C\d+)\s+正式名：(.+?) / (.+)$")
fe = formal("character-names_EN.txt", r"(C\d+)\s+Formal name: (.+?) / (.+)$")
dash = lambda x: "" if x in ("—", "-", "") else x
people = {}
for cid, r in jp.items():
    e = en.get(cid, r)
    call = r[1]
    names = {call, re.sub(r"（.*?）|\(.*?\)", "", call), *fj.get(cid, []), *fe.get(cid, [])}
    for first, mid, nick, last in [(r[2], r[3], r[4], r[5]), (e[2], e[3], e[4], e[5])]:
        first, mid, nick, last = map(dash, (first, mid, nick, last))
        if first and last:
            names |= {first + "・" + last, last + first, first + " " + last}
        elif first:
            names.add(first)
        if nick:
            names |= {nick + "・" + last, nick + " " + last} if last else {nick}
    people[cid] = {
        "call": call, "first": dash(r[2]), "nickname": dash(r[4]), "last": dash(r[5]),
        "firstEn": dash(e[2]), "nicknameEn": dash(e[4]), "lastEn": dash(e[5]),
        "aliases": sorted(n for n in names if n and n != "—"),
    }

alias = collections.defaultdict(set)
for cid, p in people.items():
    for n in p["aliases"]:
        alias[norm(n)].add(cid)

wiki = {}
if WIKI_DUMP:
    for e in json.loads(WIKI_DUMP.read_text()):
        if e["id"] in OVERRIDES:
            ids, note = OVERRIDES[e["id"]]
            wiki[e["id"]] = {"ids": ids, "method": "evidence", "note": note}
            continue
        hit = set()
        for k in (e["id"], e["name"], e.get("nameEn") or ""):
            if k:
                hit |= alias.get(norm(k), set()) | alias.get(norm(re.sub(r"（.*?）|\(.*?\)", "", k)), set())
        if len(hit) == 1:
            wiki[e["id"]] = {"ids": sorted(hit), "method": "alias"}
        elif len(hit) > 1:
            sys.exit(f"ambiguous wiki entry {e['id']}: {sorted(hit)} — add an OVERRIDE with evidence")

owner = collections.Counter(c for v in wiki.values() for c in v["ids"])
dup = [c for c, n in owner.items() if n > 1]
if dup:
    sys.exit(f"registry IDs claimed by several wiki entries: {dup}")

rev = subprocess.run(["git", "-C", str(EDUTEXT), "rev-parse", "HEAD"], capture_output=True, text=True).stdout.strip()
OUT.write_text(json.dumps({"source": "gentaron/edutext@" + rev, "people": people, "wiki": wiki}, ensure_ascii=False, separators=(",", ":")))
print(f"{len(people)} people, {len(wiki)} wiki links -> {OUT}")
