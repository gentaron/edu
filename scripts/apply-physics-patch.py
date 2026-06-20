#!/usr/bin/env python3
"""
Apply Physics Consistency Patch across all EDU repositories.

This script:
1. Copies physics-canon-patch.txt to each repo
2. Applies data corrections (補正①②) to all .ts data files
3. Applies subject corrections (補正③) where needed
4. Adds context notes (補正④-⑩) where appropriate

Repos: edu, e16super, eurekaspace, edutext, webportal
"""

import os
import re
import shutil
from pathlib import Path

# Base paths
BASE = "/home/z/my-project"
REPOS_DIR = os.path.join(BASE, "_repos")
PATCH_FILE = os.path.join(BASE, "physics-canon-patch.txt")

# All repo paths
REPOS = {
    "edu": BASE,
    "e16super": os.path.join(REPOS_DIR, "e16super"),
    "eurekaspace": os.path.join(REPOS_DIR, "eurekaspace"),
    "edutext": os.path.join(REPOS_DIR, "edutext"),
    "webportal": os.path.join(REPOS_DIR, "webportal"),
}

# Stats tracking
stats = {"files_modified": 0, "repos_modified": set(), "changes": []}


def apply_patch_to_file(filepath, patches, repo_name):
    """Apply a list of (old, new) replacement pairs to a file."""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    original = content
    for old, new, desc in patches:
        if old in content:
            content = content.replace(old, new)
            stats["changes"].append(f"  [{repo_name}] {os.path.relpath(filepath, REPOS[repo_name])}: {desc}")

    if content != original:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        stats["files_modified"] += 1
        stats["repos_modified"].add(repo_name)
        return True
    return False


def copy_patch_file(repo_path, repo_name):
    """Copy physics-canon-patch.txt to repo root."""
    dest = os.path.join(repo_path, "physics-canon-patch.txt")
    if os.path.abspath(PATCH_FILE) == os.path.abspath(dest):
        stats["changes"].append(f"  [{repo_name}] physics-canon-patch.txt は既に配置済み (同一パス)")
        stats["repos_modified"].add(repo_name)
        return
    shutil.copy2(PATCH_FILE, dest)
    stats["changes"].append(f"  [{repo_name}] physics-canon-patch.txt を配置")
    stats["repos_modified"].add(repo_name)


def get_patches_for_timeline_data():
    """Patches for src/lib/timeline-data.ts (補正①②③)"""
    return [
        # 補正①: 連星間隔 0.8AU → 約12AU
        (
            "質量1.2太陽質量）と伴星Eb16（スペクトル型M3、質量0.4太陽質量）が0.8AUの楕円軌道で安定した重力場を形成",
            "質量約0.80太陽質量）と伴星Eb16（スペクトル型M3、質量0.4太陽質量）が約12AUの長楕円軌道（離心率0.2前後）で安定した重力場を形成",
            "補正①②: 連星間隔0.8AU→12AU, 質量1.2→0.80 (JA)"
        ),
        (
            "mass 1.2 solar masses) and companion star Eb16 (spectral type M3, mass 0.4 solar masses) form a stable gravitational field in a 0.8AU elliptical orbit",
            "mass approximately 0.80 solar masses) and companion star Eb16 (spectral type M3, mass 0.4 solar masses) form a stable gravitational field in an approximately 12AU long elliptical orbit (eccentricity ~0.2)",
            "補正①②: 連星間隔0.8AU→12AU, 質量1.2→0.80 (EN)"
        ),
    ]


def get_patches_for_wiki_geography():
    """Patches for wiki-geography.data.ts and geography.data.ts (補正①②)"""
    return [
        # Fix the E16連星系 description: F5→K2V
        (
            "主星Ea16はスペクトル型F5の黄白色巨星で、伴星Eb16はスペクトル型M3の赤色矮星であり",
            "主星Ea16はスペクトル型K2Vの橙色主系列星で、伴星Eb16はスペクトル型M3の赤色矮星であり",
            "補正②: Ea16 F5黄白色巨星→K2V橙色主系列星 (E16連星系JA)"
        ),
        (
            "The primary star Ea16 is a yellow-white giant of spectral type F5, while its companion Eb16 is a red dwarf of spectral type M3",
            "The primary star Ea16 is an orange main-sequence star of spectral type K2V, while its companion Eb16 is a red dwarf of spectral type M3",
            "補正②: Ea16 F5 yellow-white giant→K2V orange main-sequence (E16連星系EN)"
        ),
        # Fix Ea16 individual entry: F5→K2V, 1.2→0.80, 6500K→4900K, 3.2→0.4, 120AU→12AU, 黄白色巨星→橙色主系列星
        (
            "E16連星系の主星で、スペクトル型F5の黄白色巨星。質量は1.2太陽質量で、表面温度は約6,500K、光度は太陽の約3.2倍に達する。シンフォニー・オブ・スターズを含む内側惑星群に安定した光熱を供給しており、そのハビタブルゾーンは地球型惑星の居住に最適な条件を備えている。伴星Eb16との平均軌道間距離は約120AUで、両星の重力相互作用が連星系内の小天体軌道を安定化させている。東暦初期の天文学者たちはEa16の安定性を星系入植の決定的根拠とした。",
            "E16連星系の主星で、スペクトル型K2Vの橙色主系列星。質量は約0.80太陽質量で、表面温度は約4,900K、光度は約0.4太陽光度である。シンフォニー・オブ・スターズを含む内側惑星群に安定した光熱を供給しており、そのハビタブルゾーンは地球型惑星の居住に最適な条件を備えている。伴星Eb16との平均軌道間距離は約12AU（離心率0.2前後の長楕円）で、両星の重力相互作用が連星系内の小天体軌道を安定化させている。金属量が低い古い恒星（ハロー集団）であり、東暦初期の天文学者たちはEa16の安定性を星系入植の決定的根拠とした。",
            "補正①②: Ea16個別項目 F5→K2V, 1.2→0.80, 6500K→4900K, 3.2→0.4, 120AU→12AU, ハロー集団付与 (JA)"
        ),
        (
            "The primary star of the E16 binary system, a yellow-white giant of spectral type F5. It has a mass of 1.2 solar masses, a surface temperature of approximately 6,500K, and a luminosity reaching about 3.2 times that of the Sun. It provides stable light and heat to the inner planets, including Symphony of Stars, with its habitable zone offering optimal conditions for Earth-type planets. The average orbital distance from its companion Eb16 is about 120 AU, and the gravitational interaction between the two stars stabilizes the orbits of small bodies within the system. Eastern Calendar-era astronomers considered the stability of Ea16 as the decisive basis for system colonization.",
            "The primary star of the E16 binary system, an orange main-sequence star of spectral type K2V. It has a mass of approximately 0.80 solar masses, a surface temperature of approximately 4,900K, and a luminosity of about 0.4 times that of the Sun. It provides stable light and heat to the inner planets, including Symphony of Stars, with its habitable zone offering optimal conditions for Earth-type planets. The average orbital distance from its companion Eb16 is about 12 AU (long elliptical orbit with eccentricity ~0.2), and the gravitational interaction between the two stars stabilizes the orbits of small bodies within the system. A metal-poor old star (halo population), Eastern Calendar-era astronomers considered the stability of Ea16 as the decisive basis for system colonization.",
            "補正①②: Ea16個別項目 F5→K2V, 1.2→0.80, 6500K→4900K, 3.2→0.4, 120AU→12AU, halo population (EN)"
        ),
        # Fix Eb16: 120AU→12AU
        (
            "主星Ea16から平均約120AUの距離を公転している",
            "主星Ea16から平均約12AUの距離を公転している（離心率0.2前後の長楕円軌道）",
            "補正①: Eb16 120AU→12AU (JA)"
        ),
        (
            "from its primary Ea16 at an average distance of about 120 AU",
            "from its primary Ea16 at an average distance of about 12 AU (long elliptical orbit with eccentricity ~0.2)",
            "補正①: Eb16 120AU→12AU (EN)"
        ),
    ]


def get_patches_for_terminology_geography():
    """Patches for terminology-geography.ts (補正①②)"""
    return [
        # Ea16 individual entry
        (
            "E16連星系の主星で、スペクトル型F5の黄白色巨星。質量は1.2太陽質量で、表面温度は約6,500K、光度は太陽の約3.2倍に達する。シンフォニー・オブ・スターズを含む内側惑星群に安定した光熱を供給しており、そのハビタブルゾーンは地球型惑星の居住に最適な条件を備えている。伴星Eb16との平均軌道間距離は約120AUで、両星の重力相互作用が連星系内の小天体軌道を安定化させている。東暦初期の天文学者たちはEa16の安定性を星系入植の決定的根拠とした。",
            "E16連星系の主星で、スペクトル型K2Vの橙色主系列星。質量は約0.80太陽質量で、表面温度は約4,900K、光度は約0.4太陽光度である。シンフォニー・オブ・スターズを含む内側惑星群に安定した光熱を供給しており、そのハビタブルゾーンは地球型惑星の居住に最適な条件を備えている。伴星Eb16との平均軌道間距離は約12AU（離心率0.2前後の長楕円）で、両星の重力相互作用が連星系内の小天体軌道を安定化させている。金属量が低い古い恒星（ハロー集団）であり、東暦初期の天文学者たちはEa16の安定性を星系入植の決定的根拠とした。",
            "補正①②: Ea16 F5→K2V全項目補正 (terminology-geo JA)"
        ),
        # Eb16
        (
            "主星Ea16から平均約120AUの距離を公転している",
            "主星Ea16から平均約12AUの距離を公転している（離心率0.2前後の長楕円軌道）",
            "補正①: Eb16 120AU→12AU (terminology-geo JA)"
        ),
        # E16連星系 system entry F5→K2V
        (
            "主星Ea16はスペクトル型F5の黄白色巨星で、伴星Eb16はスペクトル型M3の赤色矮星であり",
            "主星Ea16はスペクトル型K2Vの橙色主系列星で、伴星Eb16はスペクトル型M3の赤色矮星であり",
            "補正②: E16連星系 F5→K2V (terminology-geo JA)"
        ),
    ]


def get_patches_for_planets():
    """Patches for src/data/planets.ts (e16super only, 補正②)"""
    return [
        (
            "スペクトル型K2、質量1.2太陽質量",
            "スペクトル型K2V、質量約0.80太陽質量",
            "補正②: planets.ts K2→K2V, 1.2→0.80"
        ),
    ]


def find_and_patch_files(repo_path, repo_name):
    """Find all files needing patches and apply them."""
    src_dir = os.path.join(repo_path, "src")
    if not os.path.isdir(src_dir):
        print(f"  [{repo_name}] No src/ directory, skipping data patches")
        return

    # 1. timeline-data.ts
    timeline = os.path.join(src_dir, "lib", "timeline-data.ts")
    if os.path.isfile(timeline):
        apply_patch_to_file(timeline, get_patches_for_timeline_data(), repo_name)

    # 2. wiki-geography.data.ts
    wiki_geo = os.path.join(src_dir, "domains", "wiki", "wiki-geography.data.ts")
    if os.path.isfile(wiki_geo):
        apply_patch_to_file(wiki_geo, get_patches_for_wiki_geography(), repo_name)

    # 3. geography.data.ts
    geo = os.path.join(src_dir, "domains", "wiki", "geography.data.ts")
    if os.path.isfile(geo):
        apply_patch_to_file(geo, get_patches_for_wiki_geography(), repo_name)

    # 4. terminology-geography.ts
    term_geo = os.path.join(src_dir, "domains", "wiki", "terminology-geography.ts")
    if os.path.isfile(term_geo):
        apply_patch_to_file(term_geo, get_patches_for_terminology_geography(), repo_name)

    # 5. planets.ts (e16super specific)
    planets = os.path.join(src_dir, "data", "planets.ts")
    if os.path.isfile(planets):
        apply_patch_to_file(planets, get_patches_for_planets(), repo_name)


def main():
    print("=" * 60)
    print("物理整合補正パッチ 適用開始")
    print("=" * 60)

    for repo_name, repo_path in REPOS.items():
        print(f"\n--- {repo_name} ({repo_path}) ---")
        if not os.path.isdir(repo_path):
            print(f"  SKIP: directory not found")
            continue

        # Copy patch file
        copy_patch_file(repo_path, repo_name)

        # Apply data corrections
        find_and_patch_files(repo_path, repo_name)

    # Summary
    print("\n" + "=" * 60)
    print(f"適用完了: {stats['files_modified']} ファイル修正, {len(stats['repos_modified'])} リポジトリ対象")
    print("=" * 60)
    if stats["changes"]:
        print("\n変更一覧:")
        for c in stats["changes"]:
            print(c)


if __name__ == "__main__":
    main()