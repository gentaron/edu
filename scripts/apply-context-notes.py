#!/usr/bin/env python3
"""
Apply Physics Consistency Patch ④-⑩ context notes across all EDU repositories.
These are one-line context additions to existing descriptions (not data corrections).
"""

import os
import re

BASE = "/home/z/my-project"
REPOS_DIR = os.path.join(BASE, "_repos")

REPOS = {
    "edu": BASE,
    "e16super": os.path.join(REPOS_DIR, "e16super"),
    "eurekaspace": os.path.join(REPOS_DIR, "eurekaspace"),
}

stats = {"files_modified": 0, "changes": []}


def patch_file(filepath, patches, repo_name):
    """Apply patches to a file."""
    if not os.path.isfile(filepath):
        return
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    original = content
    for old, new, desc in patches:
        if old in content and new not in content:
            content = content.replace(old, new, 1)
            stats["changes"].append(f"  [{repo_name}] {os.path.relpath(filepath, REPOS[repo_name])}: {desc}")
    if content != original:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        stats["files_modified"] += 1


# --- 補正④: 曲率航法にワープ干渉場の文脈を追加 ---
WARP_PATCHES = [
    (
        "現在でも星間貿易の主要な航法方式として広く採用されている。",
        "現在でも星間貿易の主要な航法方式として広く採用されている。なお、曲率航法は時空計量バブルで艦体を運ぶため見かけ上超光速となるが、指向性エネルギー（レーザー/パルス）は平坦時空を直進するため厳密に光速cに縛られ、両陣営とも要衝にワープ干渉場（曲率遮断帯）を展開して直接ワープインを防止するため、長射程の相対論的砲撃が戦略上不可欠となる。",
        "補正④: 曲率航法にワープ干渉場/光速兵器二層構造を追記 (JA)"
    ),
    (
        "It is still widely adopted as the primary navigation method for interstellar trade.",
        "It is still widely adopted as the primary navigation method for interstellar trade. Note that while warp navigation achieves apparent FTL by transporting the hull in a spacetime metric bubble, directed energy weapons (laser/pulse) travel through flat spacetime and are strictly bound by light speed c; both factions deploy warp interference fields (curvature barrier zones) around strongpoints to prevent direct warp-in, making long-range relativistic bombardment strategically essential.",
        "補正④: 曲率航法にワープ干渉場/光速兵器二層構造を追記 (EN)"
    ),
]

# --- 補正⑤: 量子テレポーテーションに役割分担を追記 ---
QT_PATCHES = [
    (
        "転送失敗時の復元技術は量子情報の完全性定理に基づき継続的に改善されている。",
        "転送失敗時の復元技術は量子情報の完全性定理に基づき継続的に改善されている。なお、本技術は物質そのものの移動を担うものではなく、遠隔ノード間で意識データや航法基準位相をエンタングルメント経由で照合する「同期と同定」の情報処理層として機能するものであり、物理的輸送は曲率航法と空間ホール（次元ポータル）が担う。",
        "補正⑤: QTに役割分担（同期と同定）を追記 (JA)"
    ),
    (
        "The recovery technology for transmission failures is continuously being improved based on the completeness theorem of quantum information.",
        "The recovery technology for transmission failures is continuously being improved based on the completeness theorem of quantum information. Note that this technology does not transport matter itself, but functions as an information processing layer for 'synchronization and identification'—using entanglement to verify consciousness data and navigation reference phases between remote nodes. Physical transport is handled by curvature navigation and spatial holes (dimension portals).",
        "補正⑤: QTに役割分担を追記 (EN)"
    ),
]

# --- 補正⑧: 重力崩壊弾頭に次元極地平接続を追記 ---
GRAVITY_PATCHES = [
    (
        "兵器の使用は国際的な非難を浴び、のちに銀河系コンソーシアムによって同種兵器の開発・保有が厳しく制限される条約が締結された。",
        "兵器の使用は国際的な非難を浴び、のちに銀河系コンソーシアムによって同種兵器の開発・保有が厳しく制限される条約が締結された。内部機構としては小型の次元極地平装置を兵器化したもので、標的近傍で空間ホールの喉を強制開放のち即時崩壊させ、モジュライ場／負エネルギーの解放を時空せん断（潮汐応力）として放射する。",
        "補正⑧: 重力崩壊弾頭に次元極地平接続を追記 (JA)"
    ),
    (
        "The use of the weapon drew international condemnation, and later a treaty was signed by the Galactic Consortium strictly limiting the development and possession of similar weapons.",
        "The use of the weapon drew international condemnation, and later a treaty was signed by the Galactic Consortium strictly limiting the development and possession of similar weapons. Internally, it is a miniaturized dimension horizon device weaponized for combat: a spatial hole throat is forcibly opened near the target and then immediately collapsed, radiating moduli field/negative energy release as spacetime shear (tidal stress).",
        "補正⑧: 重力崩壊弾頭に次元極地平接続を追記 (EN)"
    ),
]

# --- 補正⑨: リーチ・ドレインに熱力学保存則を追記 ---
DRAIN_PATCHES_JA = [
    (
        "とりわけ性的エネルギーを吸収するリーチ・ドレインの原生地として知られ、",
        "とりわけ性的エネルギーを吸収するリーチ・ドレインの原生地として知られ（※正確には宿主の代謝エネルギーをバイオ電気として収奪する寄生体であり、神経内分泌的興奮状態を誘発して代謝収率を高めることで効率的に搾取する。エネルギー源は宿主の食物摂取であり、熱力学第一法則は破らない）、",
        "補正⑨: リーチ・ドレインに熱力学保存則を追記 (wiki-geo JA)"
    ),
]

DRAIN_PATCHES_EN = [
    (
        "which absorbs sexual energy. The uncontrolled",
        "which absorbs sexual energy (※physically: a parasite that extracts metabolic energy as bioelectricity from hosts, inducing neuroendocrine arousal states to increase metabolic yield; the energy source is the host's food intake, preserving the first law of thermodynamics). The uncontrolled",
        "補正⑨: リーチ・ドレインに熱力学保存則を追記 (wiki-geo EN)"
    ),
]

# Different pattern for geography.data.ts and terminology
DRAIN_PATCHES_JA2 = [
    (
        "とりわけ性的エネルギーを吸収するリーチ・ドレインの原生地として知られ、",
        "とりわけ性的エネルギーを吸収するリーチ・ドレインの原生地として知られ（※正確には宿主の代謝エネルギーをバイオ電気として収奪する寄生体であり、神経内分泌的興奮状態を誘発して代謝収率を高めることで効率的に搾取する。エネルギー源は宿主の食物摂取であり、熱力学第一法則は破らない）、",
        "補正⑨: リーチ・ドレインに熱力学保存則を追記 (geo/term JA)"
    ),
]


def process_repo(repo_path, repo_name):
    """Process a single repo's data files."""
    src = os.path.join(repo_path, "src")
    if not os.path.isdir(src):
        return

    # wiki-technology.data.ts: 補正④⑤⑧
    tech_wiki = os.path.join(src, "domains", "wiki", "wiki-technology.data.ts")
    if os.path.isfile(tech_wiki):
        patch_file(tech_wiki, WARP_PATCHES, repo_name)
        patch_file(tech_wiki, QT_PATCHES, repo_name)
        patch_file(tech_wiki, GRAVITY_PATCHES, repo_name)

    # technology.data.ts: same patches
    tech = os.path.join(src, "domains", "wiki", "technology.data.ts")
    if os.path.isfile(tech):
        patch_file(tech, WARP_PATCHES, repo_name)
        patch_file(tech, QT_PATCHES, repo_name)
        patch_file(tech, GRAVITY_PATCHES, repo_name)

    # wiki-geography.data.ts: 補正⑨
    wiki_geo = os.path.join(src, "domains", "wiki", "wiki-geography.data.ts")
    if os.path.isfile(wiki_geo):
        patch_file(wiki_geo, DRAIN_PATCHES_JA, repo_name)
        patch_file(wiki_geo, DRAIN_PATCHES_EN, repo_name)

    # geography.data.ts: 補正⑨
    geo = os.path.join(src, "domains", "wiki", "geography.data.ts")
    if os.path.isfile(geo):
        patch_file(geo, DRAIN_PATCHES_JA2, repo_name)

    # terminology-geography.ts: 補正⑨
    term_geo = os.path.join(src, "domains", "wiki", "terminology-geography.ts")
    if os.path.isfile(term_geo):
        patch_file(term_geo, DRAIN_PATCHES_JA2, repo_name)


def main():
    print("=" * 60)
    print("物理整合補正パッチ ④-⑩ 文脈追記 適用開始")
    print("=" * 60)

    for repo_name, repo_path in REPOS.items():
        print(f"\n--- {repo_name} ---")
        process_repo(repo_path, repo_name)

    print(f"\n{'=' * 60}")
    print(f"完了: {stats['files_modified']} ファイル修正")
    print("=" * 60)
    if stats["changes"]:
        print("\n変更一覧:")
        for c in stats["changes"]:
            print(c)
    else:
        print("\n（新しい変更なし - edu は既に手動適用済み）")


if __name__ == "__main__":
    main()