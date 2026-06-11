/* ─── timeline-data.ts — extracted from page.tsx ─── */

export type TlEv = { text: string; textEn: string; loc?: string }

export const locColor: Record<string, string> = {
  "シンフォニー・オブ・スターズ": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Gigapolis: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "Eros-7": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  惑星Solaris: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  惑星ビブリオ: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "ノスタルジア・コロニー": "bg-rose-500/20 text-rose-300 border-rose-500/30",
  西大陸: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "東大陸・クレセント": "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  M104銀河: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  E16星系: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  地球: "bg-green-500/20 text-green-300 border-green-500/30",
  AD2026地球: "bg-green-500/20 text-green-300 border-green-500/30",
  ヴァーミリオン: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  ブルーローズ: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  ミエルテンガ: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  グランベル: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  エレシオン: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  ティエリア: "bg-red-500/20 text-red-300 border-red-500/30",
  ファルージャ: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  ディオクレニス: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  ヴァルカン帝国: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  アポロン文明圏: "bg-orange-500/20 text-orange-300 border-orange-500/30",
}

export const e = (text: string, textEn: string, loc?: string): TlEv => ({ text, textEn, loc })

export const TIMELINE_DATA: {
  period: string
  periodEn: string
  range: string
  rangeEn: string
  color: string
  borderColor: string
  events: TlEv[]
}[] = [
  {
    period: "前史 (Pre-E1)",
    periodEn: "Pre-History (Pre-E1)",
    range: "AD 3500以前 — 宇宙的文脈",
    rangeEn: "Before AD 3500 — Cosmic Context",
    color: "text-edu-accent",
    borderColor: "border-edu-accent/30",
    events: [
      e(
        "【天文背景】E16連星系はM104銀河（ソンブレロ銀河）のハロー領域に位置。主星Ea16（スペクトル型K2、質量1.2太陽質量）と伴星Eb16（スペクトル型M3、質量0.4太陽質量）が0.8AUの楕円軌道で安定した重力場を形成",
        "[Astronomical Background] The E16 binary system is located in the halo region of the M104 Galaxy (Sombrero Galaxy). The primary star Ea16 (spectral type K2, mass 1.2 solar masses) and companion star Eb16 (spectral type M3, mass 0.4 solar masses) form a stable gravitational field in a 0.8AU elliptical orbit",
        "E16星系"
      ),
      e(
        "【星系構造】E16星系には中心惑星「星々の交響曲（Symphony of Stars）」を含む7惑星と数十の小惑星帯が存在。Symphony of StarsはEa16のハビタブルゾーン内に位置し、平均表面温度15℃、重力0.92G、自転周期44時間4分",
        '[System Structure] The E16 system contains 7 planets including the central planet "Symphony of Stars" and dozens of asteroid belts. Symphony of Stars lies within Ea16\'s habitable zone with an average surface temperature of 15°C, gravity 0.92G, and rotation period of 44 hours 4 minutes',
        "E16星系"
      ),
      e(
        "【Eros-7】E16外縁惑星。重力1.1G、薄い酸素大気（酸素濃度12%）、頻繁な電磁嵐。初期植民の試練の地。のちにリーチ・ドレイン（Leechdrain）流入により女性主導のマトリカル社会が形成される",
        "[Eros-7] E16 outer rim planet. Gravity 1.1G, thin oxygen atmosphere (12% O₂), frequent electromagnetic storms. A testing ground for early colonization. Later formed a female-led matriarchal society due to Leechdrain influx",
        "Eros-7"
      ),
      e(
        "【大移民ルート】地球は人口過剰と資源枯渇に直面。曲率航法と量子テレポーテーションにより、アンドロメダ → レオ → セクスタンス → さんかく → E16連星系の中継ルートを経由して移住開始",
        "[Great Migration Route] Earth faced overpopulation and resource depletion. Using warp navigation and quantum teleportation, migration began via the relay route: Andromeda → Leo → Sextans → Triangulum → E16 binary system",
        "地球"
      ),
      e(
        "【3移民集団】フェンドラ人（技術志向の北欧系）、アーキアン（環境適応に優れたアジア系）、ポロンポロ（文化保存を重視するオセアニア系）からなる多様な移民団",
        "[Three Migration Groups] A diverse migrant population composed of Fendra (tech-oriented Nordic descent), Archians (environmentally adaptive Asian descent), and Polonpolo (culture-preserving Oceanian descent)"
      ),
      e(
        "【宇宙文明圏の起源】M104銀河全域に8つの主要文明圏が存在。アポロン文明圏とドミニオン（セリア・ドミニクス率いるSelinopolis）が最強の二大巨頭として覇権を競い、第三位にグランベルが控える構造。ヴァルカン帝国はアポロン文明圏の衛星国家として存在",
        "[Origins of Cosmic Civilizations] 8 major civilization zones exist across the M104 Galaxy. The Apollo Dominion and Dominion (Selinopolis led by Celia Dominicus) compete for supremacy as the two strongest powers, with Grandel in third place. The Vulcan Empire exists as a satellite state of the Apollo civilization zone",
        "M104銀河"
      ),
      e(
        "E0 (AD3500): 第一陣1,000名がシンフォニー・オブ・スターズに到着",
        "E0 (AD3500): First wave of 1,000 settlers arrives at Symphony of Stars",
        "シンフォニー・オブ・スターズ"
      ),
      e(
        "【ティムール・シャー】移民団のリーダー。10次元ホラズム理論の提唱者。仮想多元宇宙「ペルセポネ」を設計 — ニューロリンク・インターフェースと量子演算コアで移民が意識をアップロードし過酷環境を克服",
        '[Timur Shah] Leader of the migration group. Proposer of the 10-Dimension Horazm Theory. Designed the virtual multiverse "Persephone" — enabling settlers to upload consciousness via neuralink interfaces and quantum computing cores to overcome harsh environments',
        "シンフォニー・オブ・スターズ"
      ),
    ],
  },
  {
    period: "第一期 E1〜E200",
    periodEn: "Period 1: E1–E200",
    range: "入植・帝国・繁栄・革命",
    rangeEn: "Colonization, Empires, Prosperity, Revolution",
    color: "text-edu-accent2",
    borderColor: "border-edu-accent2/30",
    events: [
      e(
        "E1: 定住開始。Clan（Gig-community）組織。A-Registry（旅券）の萌芽",
        "E1: Settlement begins. Clan (Gig-community) organization established. A-Registry (passport) system萌芽",
        "シンフォニー・オブ・スターズ"
      ),
      e(
        "E6: 第一繁栄期。パラトン等の初期都市圏形成",
        "E6: First prosperity period. Early urban zones like Palaton formed",
        "シンフォニー・オブ・スターズ"
      ),
      e(
        "【Eros-7】E0年以降: 星間貿易でリーチ・ドレイン（Leechdrain）流入 — 性的エネルギーを吸収し男性の生殖機能を抑制。女性リーダー・リリス・ヴェインが制御技術を開発しバイオリアクターでエネルギー化",
        "[Eros-7] Post-E0: Leechdrain influx via interstellar trade — absorbs sexual energy and suppresses male reproductive function. Female leader Lilith Vain developed control technology and converted it into energy via bioreactors",
        "Eros-7"
      ),
      e(
        "E14: エルトナ戦争 — 前衛意識 vs 原始意識。人種的緊張の起源",
        "E14: The Eltna War — Vanguard consciousness vs. Primitive consciousness. Origins of racial tensions",
        "シンフォニー・オブ・スターズ"
      ),
      e(
        "【ヴァルカン帝国】シトラセレス皇帝が28歳で即位。人口400万の帝国を統べる。厳格な掟の下、妻エレジアとの関係が帝国の象徴となる。ヴァルカン帝国はアポロン文明圏の友好国としてM104銀河の辺境に位置",
        "[Vulcan Empire] Emperor Citraeeres ascends to the throne at age 28. Rules an empire of 4 million. Under strict codes, his relationship with wife Elegia becomes the empire's symbol. The Vulcan Empire is positioned on the frontier of the M104 Galaxy as a friendly state of the Apollo civilization zone",
        "ヴァルカン帝国"
      ),
      e(
        "E15〜E61: バーズ帝国成立 — 軍閥ファランクス（のちのテクロサスの前身）が星系統一",
        "E15–E61: Birds Empire founded — Warlord Phalanx (predecessor of Tekrosas) unifies the star system",
        "シンフォニー・オブ・スターズ"
      ),
      e(
        "E62〜E77: アフター戦争・チョンクォン戦争 → テラン朝共和制へ移行",
        "E62–E77: After War & Chonkwon War → Transition to Terran Republic",
        "シンフォニー・オブ・スターズ"
      ),
      e(
        "E78〜E80: 第二繁栄期。人口4,000万。A-Registry 155階層整備",
        "E78–E80: Second prosperity period. Population 40 million. A-Registry expanded to 155 tiers",
        "Gigapolis"
      ),
      e(
        "【技術啓蒙時代 E80〜E90】バイオエンジニアリング爆発的進化。セル・ウィーヴ（放射線耐性・長寿命化）一般化。人口約5,000万人に達し、ギガポリスの原型形成",
        "[Technology Enlightenment Era E80–E90] Explosive bioengineering evolution. Cell Weave (radiation resistance & life extension) becomes widespread. Population reaches ~50 million; prototype of Gigapolis takes shape",
        "Gigapolis"
      ),
      e(
        "【次元極地平】ブラックホール理論を応用した「Dimension Horizon」開発 — 量子重力場で高次元空間にアクセス。ホライゾン・ゲート（安定した次元間ポータル）を通じ仮想多元宇宙を構築",
        '[Dimension Horizon] Development of "Dimension Horizon" applying black hole theory — accessing higher-dimensional space via quantum gravity fields. Virtual multiverse constructed through Horizon Gates (stable inter-dimensional portals)',
        "Gigapolis"
      ),
      e(
        "【テクノ宗教運動】次元極地平を「宇宙の意志」と神聖視。テンプル・オブ・ホライゾン建設。物理学者テミルタロンがサイケデリック・コスモロジーを提唱し次元階梯パンディクトの原型を構想",
        '[Techno-Religious Movement] Dimension Horizon revered as "Will of the Universe." Temple of Horizon constructed. Physicist Temirtalon proposes Psychedelic Cosmology and envisions the prototype of the Pandict Dimension Ladder',
        "Gigapolis"
      ),
      e(
        "【ペルセポネ進化】テミルタロン指導の下、オルタ・フィールドとして再構築 — クオリア・コア（感情のデジタル化）により仮想空間で実体験に近い感覚を獲得",
        "[Persephone Evolution] Under Temirtalon's guidance, reconstructed as the Altera Field — Qualia Core (digitization of emotions) enables near-real sensory experiences in virtual space",
        "Gigapolis"
      ),
      e("E88〜E98: ロンバルディア戦争", "E88–E98: Lombardia War", "M104銀河"),
      e(
        "【Eros-7 E97〜E101】リーチ・ドレインの異常増殖による危機 — 男性労働者の80%感染、エネルギー枯渇症蔓延。女性リーダー・シルヴィア・クロウがエスパー能力（テレパシー・エネルギー操作）で収束",
        "[Eros-7 E97–E101] Crisis from abnormal Leechdrain proliferation — 80% of male workers infected, energy depletion syndrome spreads. Female leader Sylvia Crow contains it using esper abilities (telepathy & energy manipulation)",
        "Eros-7"
      ),
      e(
        "E97〜E101: 第三繁栄期（第一文化主義）— 人口1億2,000万。コーポラタムパブリカ（コーポラトクラシー）とA籍制度誕生。nトークン経済確立。ネオンコロシアムでスティル・アレーナ開始",
        "E97–E101: Third prosperity period (First Culturalism) — Population 120 million. Corporatum Publica (Corporatocracy) and A-Registry system established. n-token economy established. Still Arena begins at Neon Colosseum",
        "Gigapolis"
      ),
      e(
        "【Eros-7】シルヴィア・クロウが男性指令省を設立しジーン・カタログ運用開始。ネオンクレーター宮殿（高さ800m、100階建て）建設",
        "[Eros-7] Sylvia Crow establishes the Male Directive Bureau and begins operating the Gene Catalog. Neon Crater Palace (800m tall, 100 floors) constructed",
        "Eros-7"
      ),
      e(
        "E108〜E114: クワンナラ革命 — 分権化・Clan復権",
        "E108–E114: Kwannara Revolution — Decentralization and restoration of Clan rights",
        "シンフォニー・オブ・スターズ"
      ),
      e(
        "E150: マーストリヒト革命 — エル・フォルハウス（通称「新時代のルーキー」）がギガポリスのセントラル・タワーを占拠。完全自由経済確立。コーポラタムパブリカ正式成立",
        'E150: Maastricht Revolution — El Folhaus (aka "Rookie of the New Era") seizes Gigapolis\'s Central Tower. Complete free economy established. Corporatum Publica formally established',
        "Gigapolis"
      ),
      e(
        "E151: 新ヘルシンキ宣言 — 惑星連邦構想提案。アリア・ソルが次元極地平を活用した星間議会を構想",
        "E151: New Helsinki Declaration — Planetary federation proposal. Aria Sol envisions an interstellar council utilizing Dimension Horizon",
        "Gigapolis"
      ),
      e(
        "E153〜E201: 第四繁栄期 — 人口3億突破。ギガポリスGDP14京nトークン。次元技術で星間通信遅延0.01秒未満。平均寿命150年に延長",
        "E153–E201: Fourth prosperity period — Population exceeds 300 million. Gigapolis GDP: 14 quadrillion n-tokens. Interstellar communication latency below 0.01 seconds via dimension tech. Average lifespan extended to 150 years",
        "Gigapolis"
      ),
      e(
        "E208: コーラの疫病 — アンドロメダ系移民の遺伝子に特異的に作用するウイルス。人口の15%（約4,500万人）死亡。シャドウ・リベリオン（低階層反乱組織）結成の契機",
        "E208: The Cora Plague — A virus that specifically targets Andromeda-descended immigrant genes. 15% of population (~45 million) killed. Catalyst for the formation of the Shadow Rebellion (lower-tier resistance organization)",
        "Gigapolis"
      ),
      e(
        "【グランベルの台頭】マルチバース開拓技術を駆使し、アポロン・ドミニオン大戦を傍観。次元間エネルギー源の独占により経済力を急拡大させ、宇宙第二位から首位への足場を固める",
        "[Grandel's Rise] Leveraging multiverse pioneering technology, observed the Apollo-Dominion War. Rapidly expanded economic power through monopoly of inter-dimensional energy sources, establishing a foothold from #2 to #1 in the cosmos",
        "グランベル"
      ),
      e(
        "【ティエリアの軍事拡大】宇宙最強の軍事力と防衛ネットワークを基盤に独立勢力として台頭。軍事技術輸出を経済基盤として活用し始める",
        "[Tiria's Military Expansion] Rises as an independent power based on the cosmos's strongest military force and defense network. Begins utilizing military technology exports as an economic foundation",
        "ティエリア"
      ),
    ],
  },
  {
    period: "第二期 E200〜E320",
    periodEn: "Period 2: E200–E320",
    range: "パクス・ロンバルディカ・ZAMLT・アルファ・ケイン",
    rangeEn: "Pax Lombardica, ZAMLT, Alpha Kane",
    color: "text-edu-accent2",
    borderColor: "border-edu-accent2/30",
    events: [
      e(
        "【パクス・ロンバルディカ E205〜E278】コーポラタムパブリカが経済と政治を完全掌握。ギガポリス経済規模は年間5京nトークンに達するも、A籍制度の硬直化で格差が極端化。シャドウ・リベリオン活発化",
        "[Pax Lombardica E205–E278] Corporatum Publica seizes complete economic and political control. Gigapolis economic scale reaches 5 quadrillion n-tokens annually, but A-Registry rigidification causes extreme inequality. Shadow Rebellion becomes active",
        "Gigapolis"
      ),
      e(
        "E260〜E280: Diana（初代Wonder Woman）台頭",
        "E260–E280: Rise of Diana (first Wonder Woman)",
        "西大陸"
      ),
      e(
        "E270: AURALIS Proto創設（Diana時代の文化的恩恵の下で前身組織発足）",
        "E270: AURALIS Proto founded (predecessor organization established under the cultural legacy of Diana's era)",
        "西大陸"
      ),
      e(
        "【5大文明圏の胎動】アポロン・ドミニオン大戦の激化により、M104銀河の多極化が加速。エレシオンが医療技術で台頭、ファルージャが文化的影響力を拡大、ディオクレニスが宇宙探査に着手。グランベルは依然経済2位",
        "[5 Major Civilization Zones Emerging] The intensification of the Apollo-Dominion War accelerates M104 Galaxy multipolarity. Elecion rises through medical technology, Faluja expands cultural influence, Dioclenis begins space exploration. Grandel remains #2 economically",
        "M104銀河"
      ),
      e(
        "E275〜E288: メルディア戦争 — ロンバルディア帝国 vs セクスタス連合（M104銀河周辺勢力）。次元兵器投入でロンバルディア勝利。第五次繁栄を招く",
        "E275–E288: Merdia War — Lombardia Empire vs. Sextus Alliance (M104 Galaxy peripheral powers). Lombardia wins with dimensional weapons. Triggers the Fifth Prosperity",
        "M104銀河"
      ),
      e(
        "E289〜E300: 第五次繁栄 — 人口4億に達し、メガタワーは高さ3kmに拡張。ディメンション・ブリッジ（恒久的星間ポータル）でM104銀河全体との貿易を10倍に拡大",
        "E289–E300: Fifth Prosperity — Population reaches 400 million, Mega Towers expanded to 3km tall. Dimension Bridges (permanent interstellar portals) expand trade with entire M104 Galaxy by 10x",
        "Gigapolis"
      ),
      e(
        "【Eros-7】ZAMLTと戦略的提携を結び搾取技術が企業化。搾取触手・搾取ヒル・搾取バクテリアを標準化。ネオンクレーター宮殿は1.5km・200階に拡張。年間1兆nトークンの経済規模に",
        "[Eros-7] Strategic partnership with ZAMLT corporatizes extraction technology. Extraction tentacles, leeches, and bacteria standardized. Neon Crater Palace expanded to 1.5km / 200 floors. Annual economic scale: 1 trillion n-tokens",
        "Eros-7"
      ),
      e(
        "E290: AURALIS Collective第一世代正式組織化 — Kate Claudia・Lily Steinerを中心とする少人数集団",
        "E290: AURALIS Collective 1st Generation formally organized — A small group centered on Kate Claudia and Lily Steiner",
        "西大陸"
      ),
      e(
        "【ZAMLT E301〜E318】5超巨大コーポラトクラシーの統合体として誕生。企業数1億超。オムニバス・エンジンでnトークン取引の95%を掌握。A籍制度をZ1〜Z50に再編、非従業員は事実上奴隷階級へ",
        "[ZAMLT E301–E318] Born as an integration of 5 super-giant corporatocracies. Over 100 million companies. Omnibus Engine controls 95% of n-token transactions. A-Registry reorganized into Z1–Z50; non-employees effectively become slave class",
        "Gigapolis"
      ),
      e(
        "【Eros-7 ZAMLT期】男性指令省とZAMLTクロマ・アーカイブ統合。搾取セッション1日3回に増加。シャドウ・ユニオンがナノハッキング技術でバイオリアクター妨害活動を展開",
        "[Eros-7 ZAMLT Era] Male Directive Bureau merged with ZAMLT Chroma Archive. Extraction sessions increased to 3/day. Shadow Union launches bio-reactor sabotage using nano-hacking technology",
        "Eros-7"
      ),
      e(
        "E318: アルファ・ケイン覚醒 — スティル・アレーナの元チャンピオン。シャドウ・リベリオンのリーダーとしてZAMLTオムニバス・エンジンにハッキング。ギガポリス解放戦でメガタワーを占拠、資産30%を地域コミュニティに譲渡",
        "E318: Alpha Kane Awakens — Former Still Arena champion. As Shadow Rebellion leader, hacks the ZAMLT Omnibus Engine. Seizes Mega Towers during the Gigapolis Liberation War, transfers 30% of assets to local communities",
        "Gigapolis"
      ),
      e(
        "【シトラセレス皇帝の失踪】ヴァルカン帝国の皇帝が忽然として姿を消す。帝国の掟を破る謎の女集団の関与が噂される。ヴァルカン帝国は後継者問題で混乱に陥り、のちに周辺文明圏に吸収され歴史から姿を消す",
        "[Disappearance of Emperor Citraeeres] The Vulcan Empire's emperor vanishes suddenly. Involvement of a mysterious women's group that broke imperial codes is rumored. The Vulcan Empire falls into succession chaos and is later absorbed by neighboring civilizations, disappearing from history",
        "ヴァルカン帝国"
      ),
      e(
        "E318 (同時): Eros-7のアビス・チェンバーでシャドウ・ユニオンによる小規模反乱発生。搾取ヒル1,000体破壊事件",
        "E318 (simultaneous): Small-scale Shadow Union rebellion at Eros-7's Abyss Chamber. 1,000 extraction leeches destroyed",
        "Eros-7"
      ),
    ],
  },
  {
    period: "第三期 E319〜E400",
    periodEn: "Period 3: E319–E400",
    range: "セリア黄金期・ネオクラン同盟・スライム危機",
    rangeEn: "Celia's Golden Age, Neo-Clan Alliance, Slime Crisis",
    color: "text-green-400",
    borderColor: "border-green-400/30",
    events: [
      e(
        "E319: 新ZAMLT期の余波。Jen（Lv938+）がValoria宮殿を掌握。現在もValoria連合圏を主導",
        "E319: Aftermath of the New ZAMLT era. Jen (Lv938+) seizes Valoria Palace. Still leads the Valoria Alliance",
        "西大陸"
      ),
      e(
        "E320〜E340: ネオクラン同盟が分散統治モデルを拡大。地域クラン結成、オムニバス・エンジンのローカル版でnトークンの地域内循環開始。クラン・フォーラム（E325年設立）で低階層の声を可視化",
        "E320–E340: Neo-Clan Alliance expands decentralized governance model. Regional clans formed; local Omnibus Engine versions enable intra-regional n-token circulation. Clan Forum (est. E325) makes lower-tier voices visible",
        "Gigapolis"
      ),
      e(
        "E325: レイラ・ヴィレル・ノヴァ（Pink Voltage）がAURALISに参加。弦太郎（Lv569）がAURALIS周辺に登場",
        "E325: Layla Villere Nova (Pink Voltage) joins AURALIS. Gentarou (Lv569) appears around AURALIS",
        "西大陸"
      ),
      e(
        "Ninny Offenbach原初個体 — Alpha Kane時代のGigapolisに存在。のちにKaneと袂を分かち別惑星（惑星Solaris）へ離脱 → クローン継承で遺伝子が世代を超えて継承",
        "Ninny Offenbach original entity — Existed in Gigapolis during Alpha Kane's era. Later parted ways with Kane and departed for another planet (Planet Solaris) → Genes inherited across generations via clone succession",
        "惑星Solaris"
      ),
      e(
        "【Eros-7】ガロ（後のアヤカ・リンの盟友）がシャドウ・ユニオンの指導者に。E330年のヒル破壊事件（搾取ヒル1,000体破壊）後、マトリカル・カウンシルが搾取抑制剤で鎮圧",
        "[Eros-7] Galo (later ally of Ayaka Rin) becomes Shadow Union leader. After the E330 Hill Destruction Incident (1,000 extraction leeches destroyed), the Matriarchal Council suppresses them with extraction inhibitors",
        "Eros-7"
      ),
      e(
        "E335〜E370: セリア・ドミニクスがZAMLTを倒しSelinopolis改名。セリア黄金期 — フェルミ音楽・nトークン経済・AURALISすべての頂点に到達",
        "E335–E370: Celia Dominicus defeats ZAMLT and renames to Selinopolis. Celia's Golden Age — Fermi music, n-token economy, and AURALIS all reach their zenith",
        "Gigapolis"
      ),
      e(
        "E340: Slime Woman出現（ペルセポネ仮想宇宙実験の事故で高次元世界から顕現）。特定の個人（Jun）との間に特異な相互作用が発生。Tier 1アクティブ現役最強格として約200年にわたり存在し続ける",
        "E340: Slime Woman appears (manifested from higher dimensions due to a Persephone virtual universe experiment accident). Unique interactions occur with a specific individual (Jun). Exists for approximately 200 years as one of the strongest active Tier 1 entities",
        "Gigapolis"
      ),
      e(
        "【ジュンの遭遇】33歳の無職男性ジュンが自宅でスライム状の高次元生命体と遭遇。Slime Womanがジュンの部屋に侵入し美しい女性の姿に変身。この接触はペルセポネ実験の次元断絶を通じた高次元存在の顕現と解析される。EDU宇宙論において「人間と高次元存在の共存可能性」を示す重要な事例",
        "[Jun's Encounter] 33-year-old unemployed man Jun encounters a slime-like higher-dimensional entity at home. Slime Woman invades Jun's room and transforms into a beautiful woman. This contact is analyzed as a manifestation of a higher-dimensional entity through a Persephone experiment's dimensional severance. An important case demonstrating \"possibility of human-higher-dimensional coexistence\" in EDU cosmology",
        "Gigapolis"
      ),
      e(
        "E350: 第五次繁栄フェスティバル開催 — スティル・アレーナとホロアート融合。ネオンコロシアム視聴率95%。シャドウ・リベリオンの反体制ホログラムがアンダーグリッドで話題に",
        "E350: Fifth Prosperity Festival held — Still Arena merged with holo-art. Neon Colosseum viewership 95%. Shadow Rebellion's anti-establishment holograms become trending topic on the Undergrid",
        "Gigapolis"
      ),
      e(
        "【ディオクレニスの宇宙探査】次元技術を応用した宇宙共同探査プロジェクトを立ち上げ。異文明圏との接触を開始し、M104銀河の多様な文明の実態を体系的に記録し始める",
        "[Dioclenis Space Exploration] Launches a joint space exploration project utilizing dimension technology. Begins contacting alien civilization zones and systematically documenting the diverse civilizations of the M104 Galaxy",
        "ディオクレニス"
      ),
      e(
        "E365頃: セリアがエヴァトロンと同盟締結、GDP81京ドル達成、都市名をDominionへ改称",
        "Circa E365: Celia forms alliance with Evatron, achieves GDP of 81 quadrillion dollars, renames city to Dominion",
        "Gigapolis"
      ),
      e(
        "E370: アポロン・ドミニオン大戦宣戦布告 — アポロン文明圏（ロナン・アーサ）とドミニオン（セリア・ドミニクス）の全面戦争。セリアへの同盟提案拒絶が端緒",
        "E370: Apollo-Dominion War Declaration — Total war between the Apollo civilization zone (Ronan Arthur) and the Dominion (Celia Dominicus). Triggered by Celia's rejection of alliance proposal",
        "M104銀河"
      ),
      e(
        "E375: アポロンがケンタウロスレーザー発射（到達まで2.6年）",
        "E375: Apollo fires Centaurus Laser (2.6 years to reach target)",
        "M104銀河"
      ),
      e(
        "E378: セリアがG4ファントムパルスで応戦（到達まで2.3年）",
        "E378: Celia responds with G4 Phantom Pulse (2.3 years to reach target)",
        "M104銀河"
      ),
      e(
        "E385: セリアのヴェノム艦隊がアポロン・セントラリスを崩壊 → 戦争終結",
        "E385: Celia's Venom Fleet collapses Apollo Centralis → War ends",
        "M104銀河"
      ),
      e(
        "【アポロン・ドミニオン大戦と5大文明圏】アポロン文明圏とドミニオンの激突はM104銀河全体に波及。グランベルは大戦を意図的に傍観し経済的台頭の足場に。ティエリアは防衛技術輸出で軍事力を拡大。エレシオンは戦傷者治療で名声を確立。ファルージャは外交調停で存在感を示す。大戦後の権力真空が5大文明圏の台頭を決定づける",
        "[Apollo-Dominion War and 5 Major Civilizations] The collision between the Apollo civilization zone and Dominion reverberates across the entire M104 Galaxy. Grandel deliberately observes the war as a springboard for economic rise. Tiria expands military power via defense tech exports. Elecion establishes reputation through war casualty treatment. Faluja demonstrates presence through diplomatic mediation. The post-war power vacuum cements the rise of the 5 Major Civilization Zones",
        "M104銀河"
      ),
      e(
        "【スライム危機 E380〜E400】ZAMLT時代の過剰バイオエンジニアリング実験が原因でリーチ・ドレインが遺伝子変異しスライム形態に進化。ギガポリスの地下インフラに侵入、エネルギー供給70%停止、人口20%（約8,000万人）避難",
        "[Slime Crisis E380–E400] Excessive bioengineering experiments from the ZAMLT era cause Leechdrain to genetically mutate into slime form. Invades Gigapolis underground infrastructure, stops 70% of energy supply, 20% of population (~80 million) evacuated",
        "Gigapolis"
      ),
      e(
        "【レイラの英雄的活躍】レイラ・ヴィレル・ノヴァ — 低階層（A120）出身のサイバネティック強化戦士。ナノファイバーブーツ・強化グローブ（100tパンチ力）装備。オアシス・ハウスを拠点にプラズマカノンでスライム焼却、感染拡大30%抑制。認知度96%・勝率92%",
        "[Layla's Heroic Deeds] Layla Villere Nova — Cybernetically enhanced warrior from the lower tier (A120). Equipped with nanofiber boots and enhanced gloves (100t punch force). Based at Oasis House, burns slimes with plasma cannons, suppressing infection spread by 30%. 96% recognition rate, 92% win rate",
        "Gigapolis"
      ),
      e(
        "【アヤカ・リンの活躍】Lv.842の搾精生物専門ハンター。ビキニバリア・カウパー波を駆使しアンダーグリッド深部でスライムの巣を破壊。オルタ・フィールド経由で全市民に戦闘記録中継",
        "[Ayaka Rin's Deeds] Lv.842 extraction creature specialist hunter. Wielding Bikini Barrier and Couper Wave, destroys slime nests in the depths of the Undergrid. Broadcasts combat footage to all citizens via Altera Field",
        "Gigapolis"
      ),
      e(
        "E400: スライム危機終息。AURALISはエヴァトロンの文化弾圧により解体 — Kate Claudia・Lily Steinerは逆捕・消息不明。レイラは冷凍保存（実力による特別措置。サイバネティクスによる長命ではない）",
        "E400: Slime Crisis ends. AURALIS dismantled due to Evatron's cultural suppression — Kate Claudia and Lily Steiner captured, whereabouts unknown. Layla placed in cryogenic preservation (special measure due to her abilities, not due to cybernetic longevity)",
        "Gigapolis"
      ),
      e(
        "【グランベル首位確定】アポロン・ドミニオン大戦後の混乱期に一気に浮上。GDP150兆ドルを達成し宇宙最大の経済圏に。マスター・クインシアスが「次元を超える力が、この手に」と宣言",
        '[Grandel Secures #1] Surges during the post-Apollo-Dominion War chaos. Achieves GDP of 150 trillion dollars, becoming the cosmos\'s largest economy. Master Quincias declares: "The power to transcend dimensions is in my hands"',
        "グランベル"
      ),
      e(
        "【ティエリア第3位に】軍事技術輸出で経済基盤を拡大。グレイモンド・ハウザー総帥が「軍事力なくして平和は守れない」と主張。エレシオンのリアナ女王と対立",
        '[Tiria Reaches #3] Expands economic foundation via military tech exports. Supreme Commander Graymond Hauser asserts: "Peace cannot be maintained without military power." Conflicts with Queen Liana of Elecion',
        "ティエリア"
      ),
      e(
        "E400 (同時): エヴァトロンがGigapolisを支配しエヴァポリスに改名（エヴァトロン側の一方的名称に過ぎない）。Tina/Gueが地下街最深部を実効支配開始",
        "E400 (simultaneous): Evatron takes control of Gigapolis and renames it Evapolis (merely Evatron's unilateral designation). Tina/Gue begin effective control of the deepest underground levels",
        "Gigapolis"
      ),
      e(
        "【Eros-7 E380〜E400】スライム危機がEros-7にも波及。カーラ・ヴェルムがスクイーズ・アビス（560階地下搾取施設）を建設。搾取プラズマ弾（スライムエネルギー凝縮破壊兵器）を生産",
        "[Eros-7 E380–E400] Slime Crisis spreads to Eros-7. Carla Verm builds the Squeeze Abyss (560-floor underground extraction facility). Produces extraction plasma bombs (slime energy condensation destruction weapons)",
        "Eros-7"
      ),
    ],
  },
  {
    period: "第四期 E400〜E475",
    periodEn: "Period 4: E400–E475",
    range: "エヴァトロン支配・テリアン反乱",
    rangeEn: "Evatron Rule, Terian Rebellion",
    color: "text-red-400",
    borderColor: "border-red-400/30",
    events: [
      e(
        "E400〜E450: エヴァトロンがGigapolisを支配しエヴァポリスに改名（ただしこの名称はエヴァトロン側の一方的なものに過ぎない）。AURALISは地下活動へ",
        "E400–E450: Evatron rules Gigapolis and renames it Evapolis (however, this is merely Evatron's unilateral designation). AURALIS goes underground",
        "Gigapolis"
      ),
      e(
        "Kate Claudia・Lily Steinerは逆捕・消息不明。レイラはその実力ゆえの特別措置で冷凍保存",
        "Kate Claudia and Lily Steiner captured, whereabouts unknown. Layla placed in cryogenic preservation as a special measure due to her abilities",
        "Gigapolis"
      ),
      e(
        "E420: エヴァトロン軍極秘Σ-Unit設立 — 精神操作・生体改造技術。のちのAlpha Venomの起源（整合性原則③）",
        "E420: Evatron military secretly establishes Σ-Unit — mind control and bio-modification technology. The origin of the later Alpha Venom (Consistency Principle ③)",
        "Gigapolis"
      ),
      e(
        "【テリアン反乱】テリアン反乱軍の指導者エリオス・ウォルドがエヴァトロンに抵抗",
        "[Terian Rebellion] Terian rebel leader Elios Wald resists Evatron",
        "Gigapolis"
      ),
      e(
        "E470: エリオス・ウォルド処刑。テクロサス東方支隊がクレセント大地方に常駐開始",
        "E470: Elios Wald executed. Tekrosas Eastern Detachment begins permanent stationing in the Crescent continent region",
        "東大陸・クレセント"
      ),
      e(
        "E475: エヴァポリス廃墟化。エヴァトロン崩壊",
        "E475: Evapolis reduced to ruins. Evatron collapses",
        "Gigapolis"
      ),
      e(
        "【Eros-7】E475年: カーラ・ヴェルムのスクイーズ・アビスが搾取プラズマ弾を大量生産しEros-7の軍事力を強化。シャドウ・ユニオンの抵抗がさらに激化",
        "[Eros-7] E475: Carla Verm's Squeeze Abyss mass-produces extraction plasma bombs, strengthening Eros-7's military power. Shadow Union resistance intensifies further",
        "Eros-7"
      ),
      e(
        "E475 (同時): エヴァトロン崩壊後、Σ-Unit残党が「シルバー・ヴェノム」として独立 → のち「アルファ・ヴェノム」と「ゴールデン・ヴェノム」に分派",
        'E475 (simultaneous): After Evatron\'s collapse, Σ-Unit remnants become independent as "Silver Venom" → Later splits into "Alpha Venom" and "Golden Venom"',
        "M104銀河"
      ),
      e(
        "【エヴァトロン第14位に転落】かつてのドミニオン支配力から大幅後退。セリアンズの地下活動が継続。グランベルの支援を受けた兵器でセリアンズを鎮圧した経緯もあり、グランベルの影響下に",
        "[Evatron Falls to #14] Massive retreat from former Dominion-level power. Celian underground activities continue. Under Grandel's influence, as Grandel-supplied weapons were used to suppress Celians",
        "M104銀河"
      ),
      e(
        "【カステリア・グレンヴェルトの顕現】グランベル出身の次元跳躍能力者。マルチバース技術により異次元（地球AD2026年の日本・美咲が丘高校）に転移。金髪蒼眼、浮遊能力、睡眠操作能力を持つ。セバストレスと呼ばれる人物と関係あり。グランベルの次元間偵察計画の一環とも、独自の次元跳躍事故ともされる",
        "[Castelia Glenvelt's Manifestation] A dimension-leaping ability user from Grandel. Transferred to another dimension (Japan AD2026, Misakigaoka High School) via multiverse technology. Has blonde hair, blue eyes, levitation, and sleep manipulation abilities. Connected to someone called Sebastress. May be part of Grandel's inter-dimensional reconnaissance plan, or an independent dimensional leap accident",
        "グランベル"
      ),
      e(
        "【アイリスの台頭 E480〜E495】ヴァーミリオン裏路地でストリートギャングとの戦闘を経て、同国諜報機関にスカウト。ブルーワイヤとウォーター・オーブの戦闘術を習得し、急速に頭角を現す",
        "[Iris's Rise E480–E495] After fighting street gangs in Vermillion's back alleys, scouted by the nation's intelligence agency. Masters Blue Wire and Water Orb combat techniques, rapidly rising to prominence",
        "ヴァーミリオン"
      ),
      e(
        "【シルバー・ヴェノムの暗躍 E485〜】シルバー・ヴェノムがクレセント地方に浸透。レオン（幹部）率いる部隊がヴァーミリオン周辺で活動開始。アイリスとシルバー・ヴェノムの長期にわたる対立の始まり",
        "[Silver Venom's Shadowy Operations E485–] Silver Venom infiltrates the Crescent region. Units led by Leon (executive) begin operating around Vermillion. Beginning of the long-standing conflict between Iris and Silver Venom",
        "東大陸・クレセント"
      ),
      e(
        "テクロサス系譜: E15ファランクス → E295三頭政治改編 → E470東方支隊クレセント常駐 → E490頃ボグダス・ジャベリン（セバスチャン・ヴァレリウス率、IRIS 4位）がヴァーミリオンに恒久駐在",
        "Tekrosas Lineage: E15 Phalanx → E295 Triumvirate reorganization → E470 Eastern Detachment permanent Crescent stationing → Circa E490 Bogdas Javelin (led by Sebastian Valerius, IRIS #4) permanently stationed in Vermillion",
        "東大陸・クレセント"
      ),
      e(
        "【アイリスとボグダス・ジャベリン E490〜】アイリスがボグダス・ジャベリン（セバスチャン・ヴァレリウス、ガレス、ミユシャリ等）と協力関係を構築。ヴァーミリオン諜報機関での地位を確立し、ウィリー（パートナー）と共に各地の脅威に対処",
        "[Iris and Bogdas Javelin E490–] Iris builds cooperative relationship with Bogdas Javelin (Sebastian Valerius, Gales, Miyushari, etc.). Establishes position in Vermillion intelligence agency, handling various threats alongside Willie (partner)",
        "ヴァーミリオン"
      ),
      e(
        "東大陸クレセント大地方の主要国家体制確立 — ヴァーミリオン(アイリス/IRIS1位)・ブルーローズ(フィオナ/V7/2位)・ミエルテンガ(マリーナ/3位)・テクロサス(BJ/4位)・クロセヴィア(カスチーナ/5位)",
        "Major national system established in the Eastern Continent's Crescent region — Vermillion (Iris/IRIS #1) · Blue Rose (Fiona/V7/#2) · Mieltenga (Marina/#3) · Tekrosas (BJ/#4) · Crosevia (Castina/#5)",
        "東大陸・クレセント"
      ),
    ],
  },
  {
    period: "第五期 E475〜E528",
    periodEn: "Period 5: E475–E528",
    range: "テクノ文化ルネサンス・現代",
    rangeEn: "Techno-Cultural Renaissance, Present Day",
    color: "text-cyan-400",
    borderColor: "border-cyan-400/30",
    events: [
      e(
        "【テクノ文化ルネサンス E475〜E500】次元極地平技術の民主化と文化融合。ネオンコロシアムがアートと技術の祭典に進化。レイラの戦績がホログラム展示で不朽の名声を獲得",
        "[Techno-Cultural Renaissance E475–E500] Democratization of Dimension Horizon technology and cultural fusion. Neon Colosseum evolves into an art and technology festival. Layla's battle records achieve immortal fame through hologram exhibitions",
        "Gigapolis"
      ),
      e(
        "E490頃: ボグダス・ジャベリンがヴァーミリオンに恒久駐在",
        "Circa E490: Bogdas Javelin permanently stationed in Vermillion",
        "東大陸・クレセント"
      ),
      e(
        "【アイリスの諜報機関昇進 E495〜E505】アビサル・ドレイン襲撃作戦等でシルバー・ヴェノムに対する成果を上げ、ヴァーミリオン諜報機関の実力者に。エレナ（元本部長）の後継として機関長に昇進",
        "[Iris's Intelligence Agency Rise E495–E505] Achieves results against Silver Venom through operations like the Abyss Drain raid, becoming a power within Vermillion intelligence. Promoted to Agency Director as successor to Elena (former chief)",
        "ヴァーミリオン"
      ),
      e(
        "E495〜E500: ネオクラン同盟がUECO（星間経済協同組合）・ヒーローエージェンシーと統合し銀河系コンソーシアム設立。ヘゲモニー・パラドックス回避を志向",
        "E495–E500: Neo-Clan Alliance integrates with UECO (Interstellar Economic Cooperative) and Hero Agency to establish the Galactic Consortium. Aims to avoid the Hegemony Paradox",
        "M104銀河"
      ),
      e(
        "【第一回宇宙連合会合】グランベルの首都オルダシティで開催。アルゼン・カーリーン大統領「争いを超え、共存と繁栄の道を見つけることが次世代への責任」。ネイサン・コリンドがヘゲモニー・パラドックスを提起。ティエリア・エレシオン間の対立が表面化",
        '[1st United Cosmic Assembly] Held in Grandel\'s capital, Aldacity. President Arzen Carleen: "Finding the path beyond conflict toward coexistence and prosperity is our responsibility to the next generation." Nathan Corind raises the Hegemony Paradox. Tiria-Elecion conflict surfaces',
        "M104銀河"
      ),
      e(
        "E499: ミナ・エウレカ・アーネスト誕生（ノスタルジア・コロニー。父:エンジニア、母:歴史記録官）",
        "E499: Mina Eureka Ernst born (Nostalgia Colony. Father: engineer, mother: historical records officer)",
        "ノスタルジア・コロニー"
      ),
      e(
        "E505: Eros-7でスクイーズ・アビス解体。搾取技術を医療・クリーンエネルギー用途に転換。搾取バクテリアがナノメディシン（遺伝子修復剤）として再設計",
        "E505: Squeeze Abyss dismantled on Eros-7. Extraction technology converted to medical and clean energy applications. Extraction bacteria redesigned as nano-medicine (gene repair agents)",
        "Eros-7"
      ),
      e(
        "E509: Alpha Venomのノスタルジア・コロニー攻撃 — 「重力崩壊弾頭」の閃光が10歳のミナに「戦略への目覚め」をもたらす。難民船で脱出",
        'E509: Alpha Venom attacks Nostalgia Colony — The flash of a "Gravitational Collapse Warhead" brings "strategic awakening" to 10-year-old Mina. Evacuates on a refugee ship',
        "ノスタルジア・コロニー"
      ),
      e(
        "【アイリスのシルバー・ヴェノムとの激突 E508〜E515】レオン率いるシルバー・ヴェノム部隊との複数回の戦闘。アイリスはブルーワイヤとウォーター・オーブで応戦。ヴェルリット一族（シギル・アフェクト使いの魔女）との遭遇も",
        "[Iris's Fierce Clashes with Silver Venom E508–E515] Multiple battles against Silver Venom units led by Leon. Iris fights back with Blue Wire and Water Orb. Also encounters the Verlit family (witches who wield Sigil Affect)",
        "ヴァーミリオン"
      ),
      e(
        "E510: シルバー・ヴェノムによるアイリス拉致事件 — レオンとマスター・ヴェノムの策によりアイリスが捕縛。ボグダス・ジャベリン（セバスチャン・ガレス）とクラウス・フィオナ（ファールージャ社COO）の連携による救出作戦",
        "E510: Iris abduction by Silver Venom — Iris captured through schemes by Leon and Master Venom. Rescue operation through cooperation between Bogdas Javelin (Sebastian Gales) and Klaus Fiona (Faluja Corp COO)",
        "東大陸・クレセント"
      ),
      e(
        "E512: アイリス救出後、フィオナとの協力関係が深化。ヴィヴィエッタ（四楓院ヴィヴィエッタ）の救出作戦にも成功。V7（Vital Seven）7カ国連合の設立準備が始まる",
        "E512: After Iris's rescue, cooperative relationship with Fiona deepens. Successful rescue operation for Vivieta (Shihoin Vivieta). Preparation begins for establishing V7 (Vital Seven) 7-nation alliance",
        "ブルーローズ"
      ),
      e(
        "E514: ミナ、学術都市惑星「ビブリオ」のロレンツィオ国際大学AI学部入学（15歳）。文明崩壊予測モデルを研究",
        'E514: Mina enrolls (age 15) in the AI Department of Lorenzio International University on the academic city planet "Biblio." Researches civilization collapse prediction models',
        "惑星ビブリオ"
      ),
      e(
        "【V7設立とクレセントの政治激変 E515〜E520】Vital Seven（ヴァーミリオン・ブルーローズ・ミエルテンガ・クロセヴィア・SSレンジ・アイアン・シンジケート・ファティマ連邦）正式設立。フィオナが急先鋒として外交を主導",
        "[V7 Establishment and Crescent Political Upheaval E515–E520] Vital Seven (Vermillion, Blue Rose, Mieltenga, Crosevia, SS Range, Iron Syndicate, Fatima Federation) formally established. Fiona leads diplomacy as vanguard",
        "東大陸・クレセント"
      ),
      e(
        "E518: アルファ・ヴェノムの台頭 — シルバー・ヴェノム残党を吸収し大幅に勢力拡大。イズミ（両性具有のリーダー）・ボブリスティ・ギル・カタリナ・ゴルディロックスらが活動活発化。アイリスに対する新たな脅威",
        "E518: Alpha Venom's Rise — Absorbs Silver Venom remnants, massively expanding power. Izumi (intersex leader), Boblisty, Gil, Catalina, Goldirox, and others become increasingly active. A new threat to Iris",
        "東大陸・クレセント"
      ),
      e(
        "E519: アルファ・ヴェノムによるアイリス再拉致事件。イズミの指揮下でアイリスが捕縛されるも、ボグダス・ジャベリンの決死の救出作戦により奪還。この事件がクレセント政治の転換点となる",
        "E519: Second Iris abduction by Alpha Venom. Iris captured under Izumi's command, but recovered through Bogdas Javelin's desperate rescue operation. This incident becomes a turning point in Crescent politics",
        "東大陸・クレセント"
      ),
      e(
        "【トリニティ・アライアンス結成 E520】アイリスがミエルテンガ首脳に就任（フィオナの推薦による）。ヴァーミリオン・ミエルテンガ・ボグダス・ジャベリンを核とした3勢力連合「トリニティ・アライアンス」発足。クレセントはV7 vs トリニティの二大陣営へ",
        '[Trinity Alliance Formation E520] Iris assumes leadership of Mieltenga (upon Fiona\'s recommendation). The 3-faction alliance "Trinity Alliance" launches, centered on Vermillion, Mieltenga, and Bogdas Javelin. Crescent splits into V7 vs. Trinity camps',
        "ミエルテンガ"
      ),
      e(
        "E521: ミナ卒業（22歳）。放浪開始。Genesis Vault前身ブログ開設。ボグダス・ジャベリンに参加",
        "E521: Mina graduates (age 22). Begins wandering. Starts the predecessor blog to Genesis Vault. Joins Bogdas Javelin",
        "惑星ビブリオ"
      ),
      e(
        "【次元階梯パンディクト全4層構造】Tier Ω（高次元世界: フン8次元/ササン9次元/ホラズム10次元/ティムール11次元）→ Tier Σ（ペルセポネ仮想宇宙）→ Tier Ε（E16通常次元）→ Tier Δ（AD2026地球）",
        "[Pandict Dimension Ladder — Full 4-Layer Structure] Tier Ω (Higher Dimensional World: Huns 8-D/Sasan 9-D/Horazm 10-D/Timur 11-D) → Tier Σ (Persephone Virtual Universe) → Tier Ε (E16 Normal Dimension) → Tier Δ (AD2026 Earth)",
        "E16星系"
      ),
      e(
        "E522: AURALIS第二世代正式発足 — Kate Patton・Lillie Ardent・レイラ（冷凍保存から復活・ミナと同年齢外見）・ミナ・Ninny Offenbachの5名。弦太郎（Lv569）もAURALIS関連活動を継続",
        "E522: AURALIS 2nd Generation formally launched — 5 members: Kate Patton, Lillie Ardent, Layla (revived from cryogenic preservation, appears same age as Mina), Mina, and Ninny Offenbach. Gentarou (Lv569) also continues AURALIS-related activities",
        "西大陸"
      ),
      e(
        "【ミューのダンジョン探検】Dioclenis文明圏の探査プログラムに参加したレベル607（上限1000）の英雄ミューが、異常空間「エロティック・トラップ・ダンジョン」の探検記録を残す。サキュバスやLust Leech等の高次元生命体との遭遇を記録し、ディオクレニスの宇宙生物学に多大な貢献",
        "[Mew's Dungeon Exploration] Mew, a Level 607 (cap 1000) hero participating in the Dioclenis civilization's exploration program, leaves exploration records of an anomalous space called the \"Erotic Trap Dungeon.\" Records encounters with higher-dimensional life forms including succubi and Lust Leeches, making major contributions to Dioclenis xenobiology",
        "ディオクレニス"
      ),
      e(
        "【5大文明圏とE16の統合】グランベル主導の宇宙経済協力機構（UECO）にE16代表も参加。ギガポリスのnトークン経済とグランベルの量子経済が連携。エレシオンの医療技術がE16に導入され、平均寿命がさらに延長。ティエリアの防衛ネットワークがE16星系の防衛にも貢献",
        "[5 Major Civilizations and E16 Integration] E16 representatives also join the Grandel-led UECO. Gigapolis's n-token economy links with Grandel's quantum economy. Elecion's medical technology introduced to E16, further extending average lifespans. Tiria's defense network also contributes to E16 system defense",
        "M104銀河"
      ),
      e(
        "E524: 諸世界連邦サミット — ギガポリスのセントラル・タワーで開催。星間平和協定締結。ミナ参加。地球AD2026情報に初接触。ナシゴレン初体験（サミット会場屋台）",
        "E524: Inter-World Federation Summit — Held at Gigapolis's Central Tower. Interstellar peace agreement signed. Mina attends. First contact with AD2026 Earth information. First nasi goreng experience (summit venue food stall)",
        "Gigapolis"
      ),
      e(
        "【Eros-7 E525】アヤカ・リンの介入 — ガロ（シャドウ・ユニオン男性リーダー）・ゼナ（女性商人）と同盟を結びマトリカル・リフォーム運動を組織。労働時間短縮・ジーン・カタログ男女平等化",
        "[Eros-7 E525] Ayaka Rin's intervention — Forms alliance with Galo (Shadow Union male leader) and Zena (female merchant), organizing the Matriarchal Reform Movement. Shortened working hours; Gene Catalog gender equalization",
        "Eros-7"
      ),
      e(
        "E525: リミナル・フォージ立ち上げ — ApoloniumとDimension Horizon技術を組み合わせたクロノキャスト（Chronocast）。E528年の芸術を地球AD2026年のインターネット上に放送開始",
        "E525: Liminal Forge launched — Chronocast combining Apolonium and Dimension Horizon technology. Begins broadcasting E528 art onto AD2026 Earth's internet",
        "西大陸"
      ),
      e(
        "【フィオナの裏切り E523〜E525】ブルーローズ統率者フィオナがアルファ・ヴェノムと内通していることが発覚。マリーナ・ボビン（ミエルテンガ総統）との共謀も判明。トリニティ・アライアンス内部に激震",
        "[Fiona's Betrayal E523–E525] Blue Rose leader Fiona discovered to be colluding with Alpha Venom. Conspiracy with Marina Bobin (Mieltenga President) also revealed. Sends shockwaves through the Trinity Alliance",
        "東大陸・クレセント"
      ),
      e(
        "【V7 vs トリニティ 冷戦期 E525〜E528】フィオナの裏切りを機にV7とトリニティの対立が激化。レヴィリア・サーペンティナ（シルバー・ヴェノム幹部）の動向も不透明。アイリスはトリニティ指導者としてクレセント全域の安定を模索",
        "[V7 vs. Trinity Cold War E525–E528] V7-Trinity conflict intensifies following Fiona's betrayal. Revilia Serpentia (Silver Venom executive) movements remain unclear. Iris seeks stability across all of Crescent as Trinity leader",
        "東大陸・クレセント"
      ),
      e(
        "E528: 現在 — Genesis Vault 2,000本突破。EDU統合版Wiki（整合性5原則・確定修正3点）準拠。アイリスは引き続きトリニティ・アライアンス指導者として、フィオナ・アルファ・ヴェノムとの対峙を続ける",
        "E528: Present — Genesis Vault exceeds 2,000 articles. EDU Integrated Wiki (Consistency 5 Principles, 3 Confirmed Amendments) compliant. Iris continues as Trinity Alliance leader, confronting Fiona and Alpha Venom",
        "E16星系"
      ),
      e(
        "カステリア・グレンヴェルト・シトラ・セレス・ミュー・ジュンなど、EDU世界の多様な個人の物語が記録されている。特にジュンとSlime Womanの物語は、高次元存在と人間の接触というEDU宇宙論において重要なテーマを扱う",
        "Stories of diverse individuals in the EDU world are recorded, including Castelia Glenvelt, Citra Cerese, Mew, Jun, and others. In particular, the story of Jun and Slime Woman addresses the important theme in EDU cosmology of contact between higher-dimensional beings and humans",
        "E16星系"
      ),
    ],
  },
]
