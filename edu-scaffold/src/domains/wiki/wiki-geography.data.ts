import type { WikiId, WikiEntry } from "@/types"

export const WIKI_GEOGRAPHY = [{
    id: "E16連星系" as WikiId,
    name: "E16連星系",
    nameEn: "E16 Binary System",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "M104銀河（ソンブレロ銀河）のハロー領域に位置する連星系で、シンフォニー・オブ・スターズをはじめとする居住可能惑星を擁するE16文明圏の母星系である。主星Ea16はスペクトル型F5の黄白色巨星で、伴星Eb16はスペクトル型M3の赤色矮星であり、両星の軌道共鳴によって安定したハビタブルゾーンが形成されている。連星系全体の年齢は約62億年と推定され、豊富な重元素を含むため惑星形成が活発だった。E16連星系は東暦以前から航行可能な距離にあり、初期入植船団が到達して以来、銀河ハローにおける最重要の交通・交易拠点として発展を遂げてきた。",
    descriptionEn:
      "Located in the halo region of the M104 Galaxy (Sombrero Galaxy), this binary star system is the mother system of the E16 civilization zone, which harbors habitable planets including Symphony of Stars. The primary star Ea16 is a yellow-white giant of spectral type F5, while its companion Eb16 is a red dwarf of spectral type M3. The orbital resonance between the two stars creates a stable habitable zone. The estimated age of the binary system is approximately 6.2 billion years, and it contains abundant heavy elements, leading to active planet formation. The E16 binary system has been within navigable distance since before the Eastern Calendar, and since the arrival of the initial colonization fleet, it has developed into the most important transportation and trade hub in the galactic halo.",
  },{
    id: "Ea16" as WikiId,
    name: "イーエー16",
    nameEn: "Ea16",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "E16連星系の主星で、スペクトル型F5の黄白色巨星。質量は1.2太陽質量で、表面温度は約6,500K、光度は太陽の約3.2倍に達する。シンフォニー・オブ・スターズを含む内側惑星群に安定した光熱を供給しており、そのハビタブルゾーンは地球型惑星の居住に最適な条件を備えている。伴星Eb16との平均軌道間距離は約120AUで、両星の重力相互作用が連星系内の小天体軌道を安定化させている。東暦初期の天文学者たちはEa16の安定性を星系入植の決定的根拠とした。",
    descriptionEn:
      "The primary star of the E16 binary system, a yellow-white giant of spectral type F5. It has a mass of 1.2 solar masses, a surface temperature of approximately 6,500K, and a luminosity reaching about 3.2 times that of the Sun. It provides stable light and heat to the inner planets, including Symphony of Stars, with its habitable zone offering optimal conditions for Earth-type planets. The average orbital distance from its companion Eb16 is about 120 AU, and the gravitational interaction between the two stars stabilizes the orbits of small bodies within the system. Eastern Calendar-era astronomers considered the stability of Ea16 as the decisive basis for system colonization.",
  },{
    id: "Eb16" as WikiId,
    name: "イービー16",
    nameEn: "Eb16",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "E16連星系の伴星で、スペクトル型M3の赤色矮星。質量は0.4太陽質量、表面温度は約3,400Kであり、主星Ea16から平均約120AUの距離を公転している。Eb16自体のハビタブルゾーンは極めて狭いが、潮汐加熱を受ける可能性のある衛星系が存在すると推測されている。赤色矮星特有の長寿命（推定数千億年）により、主星が赤色巨星へ進化した後も連星系全体の重力バランスを維持する役割を果たすと予測されている。スライム危機期にはEb16の放射変動がリーチ・ドレインの遺伝子変異を誘発した可能性が指摘されている。",
    descriptionEn:
      "The companion star of the E16 binary system, a red dwarf of spectral type M3. It has a mass of 0.4 solar masses, a surface temperature of approximately 3,400K, and orbits at an average distance of about 120 AU from the primary star Ea16. While Eb16's own habitable zone is extremely narrow, it is theorized that satellite systems exist that may experience tidal heating. Due to the red dwarf's characteristic long lifespan (estimated at hundreds of billions of years), it is predicted to play a role in maintaining the gravitational balance of the entire binary system even after the primary star evolves into a red giant. During the Slime Crisis period, it has been suggested that radiation fluctuations from Eb16 may have induced genetic mutations in the Reach Drain.",
  },{
    id: "シンフォニー・オブ・スターズ" as WikiId,
    name: "シンフォニー・オブ・スターズ",
    nameEn: "Symphony of Stars",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "E16連星系の中心惑星で、主星Ea16のハビタブルゾーン内に位置する人類殖民の母星。自転周期は44時間4分、表面重力は0.92Gと地球よりやや軽く、住民の身体特性や建築様式に独自の進化をもたらした。惑星表面の約68%が水で覆われ、4つの大陸と多数の島嶼からなる。東暦元年に最初の入植船団が到達して以来、クレセント大地方をはじめとする各大陸に文明が興隆し、バーズ帝国からUECOに至る星系統治の歴史の舞台となった。惑星名「シンフォニー・オブ・スターズ」は、初期入植者が Ea16とEb16の連星の光が大気で屈折して放つ万華鏡のような夜空に因んで名付けた。",
    descriptionEn:
      "The central planet of the E16 binary system and the mother planet of human colonization, located within the habitable zone of the primary star Ea16. Its rotation period is 44 hours and 4 minutes, and its surface gravity is 0.92G, slightly lighter than Earth's, leading to unique evolutionary developments in the physical characteristics and architectural styles of its inhabitants. Approximately 68% of the planet's surface is covered by water, consisting of four continents and numerous islands. Since the arrival of the first colonization fleet in Eastern Calendar Year 1, civilizations have flourished across the continents, beginning with the Crescent Great Region, making it the stage for the history of system governance from the Birds Empire to UECO. The planet name \"Symphony of Stars\" was given by early settlers due to the kaleidoscopic night sky created by the refraction of light from the binary stars Ea16 and Eb16 in the atmosphere.",
  },{
    id: "Eros-7" as WikiId,
    name: "エロス7",
    nameEn: "Eros-7",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "E16連星系外縁に位置する第7惑星。表面重力は1.1Gとやや強く、薄い酸素大気を持つため地表での活動には呼吸補助装置が必要な区域が多い。独特な生態系を持ち、とりわけ性的エネルギーを吸収するリーチ・ドレインの原生地として知られ、この生物群の制御不能な増殖がE380年からのスライム危機を引き起こす端緒となった。女性主導のマトリカル社会が形成されており、政治・経済・軍事の主要ポストの大部分を女性が占める。この社会的構造はリーチ・ドレインの脅威への適応として発展した側面もあり、女性の身体特性がリーチ・ドレインに対する耐性に優れているという生態学的仮説も存在する。Eros-7の植民地は星系全体において独自の文化圏を形成し、特に生命倫理と生殖技術の分野で先進的な研究成果を生み出している。歴代指導者はリリス・ヴェイン（E0頃、リーチ・ドレイン制御技術開発）に始まり、シルヴィア・クロウ（E97〜E101、リーチ・ドレイン危機収束・男性指令省設立）が続いた。その後、マトリカル・カウンシルによる集団指導体制が評議会運営を担い、E525年のマトリカル・リフォーム運動ではアヤカ・リン、ガロ、ゼナが改革を主導した。\nこのEros-7の根底には、倫理の解除(D4)と脱人間化(D5)の思想的地層が横たわっている。生命倫理の極限実験場としてのEros-7は、既存の道徳的禁忌を突破した研究が行われたD4の実践的現場である。リーチ・ドレインなどの新種の創造は、「人間の形にこだわらない」というD5の思想を生物学的領域に拡張した結果であり、人権の定義を根本から問い直す倫理的境界線となっている。",
    descriptionEn:
      "The seventh planet located in the outer reaches of the E16 binary system. Its surface gravity is 1.1G, somewhat stronger than Earth's, and it has a thin oxygen atmosphere, requiring respiratory assistance in many surface areas. It possesses a unique ecosystem and is known as the native habitat of the Reach Drain, which absorbs sexual energy. The uncontrolled proliferation of this organism triggered the Slime Crisis starting in E380. A matriarchal society has formed where women occupy most of the key positions in politics, economy, and military. This social structure developed partly as an adaptation to the Reach Drain threat, and there exists an ecological hypothesis that women's physical characteristics provide superior resistance to the Reach Drain. The Eros-7 colony has formed its own cultural zone within the system, particularly producing advanced research in the fields of bioethics and reproductive technology. Its successive leaders began with Lilith Vane (around E0, developer of Reach Drain control technology), followed by Sylvia Crow (E97-E101, who managed the Reach Drain crisis and established the Male Directive Office). Subsequently, a collective leadership system under the Matriarchal Council took over the administration of the council, and in the Matriarchal Reform Movement of E525, Ayaka Rin, Gallo, and Zena led the reforms.",

    leaders: [
      {
        id: "リリス・ヴェイン" as WikiId as WikiId,
        name: "リリス・ヴェイン",
        nameEn: "Lilith Vaine",
        role: "Eros-7初期女性リーダー",
        era: "E0頃",
      },
      {
        id: "シルヴィア・クロウ" as WikiId as WikiId,
        name: "シルヴィア・クロウ",
        nameEn: "Sylvia Crow",
        role: "Eros-7女性リーダー",
        era: "E97〜E101",
      },
      {
        id: "カーラ・ヴェルム" as WikiId as WikiId,
        name: "カーラ・ヴェルム",
        nameEn: "Cara Verm",
        role: "スクイーズ・アビス立案者",
        era: "E380〜E505",
      },
    ],
  },{
    id: "惑星ビブリオ" as WikiId,
    name: "惑星ビブリオ",
    nameEn: "Planet Biblio",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "E16連星系内に位置する学術都市惑星で、星系最高の知的水準を誇る研究拠点である。惑星全体が学術機関と研究施設によって構成され、中でもロレンツィオ国際大学は次元極地平理論やApolonium物理学の研究拠点として名高い。惑星ビブリオにはA-Registryの最高等級記録館も置かれており、E16文明圏の全歴史文書と市民データのバックアップが保管されている。テクノ文化ルネサンス期には、ペルセポネ計画の理論的基盤がこの惑星の研究者たちによって構築された。常時数万人の研究者と学生が居住し、学術の自由と知識の共有を最高理念として掲げる特別自治区として運営されている。",
    descriptionEn:
      "An academic city planet located within the E16 binary system, boasting the highest intellectual level in the system as a research hub. The entire planet is composed of academic institutions and research facilities, among which the Lorenz International University is renowned as a research center for dimensional pole theory and Apolonon physics. The planet Biblio also houses the highest-level archive of the A-Registry, where all historical documents and citizen data of the E16 civilization zone are backed up. During the Techno-Cultural Renaissance period, the theoretical foundation of the Persephone Project was constructed by researchers on this planet. It is constantly inhabited by tens of thousands of researchers and students and operates as a special autonomous region that upholds academic freedom and knowledge sharing as its highest ideals.",
  },{
    id: "惑星Solaris" as WikiId,
    name: "惑星Solaris",
    nameEn: "Planet Solaris",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "Ninny Offenbachの原初個体が離脱した惑星として知られる。Offenbach種の集団意識が最初に自律的な個体を生み出した場所であり、個と集合体の分岐点としてE16文明圏の哲学・倫理学において極めて重要な意義を持つ。惑星自体は寒冷な岩石惑星で、地表の大部分が氷結したメタンと窒素の平原に覆われているが、地下深部にはOffenbach種の生態系を支える熱源が存在する。Solarisの名称は、原初個体が集団意識から離脱する際に放った光エネルギーの放出現象に由来する。この惑星の研究はOffenbach種の社会構造理解に不可欠であり、AURALIS第二世代の設立理念にも影響を与えた。",
    descriptionEn:
      "Known as the planet from which the original Ninny Offenbach individual departed. This is where the collective consciousness of the Offenbach species first produced an autonomous individual, serving as a branching point between the individual and the collective, holding extremely significant meaning in the philosophy and ethics of the E16 civilization zone. The planet itself is a cold rocky world, with most of its surface covered by frozen plains of methane and nitrogen, but deep underground exists a heat source that supports the Offenbach species' ecosystem. The name Solaris originates from the phenomenon of light energy emission when the original individual departed from the collective consciousness. Research on this planet is essential for understanding the social structure of the Offenbach species and has also influenced the founding philosophy of the AURALIS second generation.",
  },{
    id: "M104銀河" as WikiId,
    name: "M104銀河",
    nameEn: "M104 Galaxy",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "M104銀河（ソンブレロ銀河）は、地球から約3,100万光年の距離に位置する棒渦巻銀河である。E16連星系はこの銀河のハロー領域外縁に位置し、銀河中心部の活発な星形成領域からは遠く離れた穏やかな環境にある。ソンブレロ銀河の名称は、地球側からの観測で銀河の塵の帯がメキシコのソンブレロ帽に似ていることに由来するが、E16連星系側から見た銀河の形状は全く異なる。銀河ハロー領域に位置するため、E16連星系は銀河中心の強烈な放射線から保護されており、文明の発展に適した環境を提供している。M104銀河内には他にも入植可能な星系が複数確認されているが、E16連星系の戦略的重要性と歴史的経緯から、他領域の本格的開発はUECO統合後まで遅れた。",
    descriptionEn:
      "The M104 Galaxy (Sombrero Galaxy) is a barred spiral galaxy located approximately 31 million light-years from Earth. The E16 binary system is located on the outer edge of this galaxy's halo region, in a calm environment far from the active star-forming regions of the galactic center. The name Sombrero Galaxy comes from the resemblance of the galaxy's dust band to a Mexican sombrero when viewed from Earth, but the galaxy's appearance is completely different when viewed from the E16 binary system. Due to its position in the galactic halo, the E16 binary system is protected from the intense radiation of the galactic center, providing an environment suitable for the development of civilization. Several other habitable star systems have been confirmed within the M104 Galaxy, but due to the strategic importance and historical background of the E16 binary system, the full-scale development of other regions was delayed until after UECO integration.",
  },{
    id: "ノスタルジア・コロニー" as WikiId,
    name: "ノスタルジア・コロニー",
    nameEn: "Nostalgia Colony",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "E16連星系外縁に建設された初期植民地の一つで、ミナ・エウレカの出生地として知られる。ノスタルジア・コロニーはE300年頃に建設され、初期入植者たちが地球の生活様式を懐かしみながら維持しようとしたことからこの名が付けられた。コロニーの建築様式や社会制度は地球の20世紀末〜21世紀初頭の文化を模倣しており、他の植民地とは異なるレトロな景観を持つ。E509年にアルファ・ヴェノムの急襲を受け、大規模な破壊と住民の犠牲を出した。この襲撃はミナ・エウレカの人生を決定的に変え、後に彼女がGenesis Vaultを通じて反ヴェノム活動の情報発信を行う動機となった。現在コロニーの一部は復興しているが、襲撃の痕跡は記念施設として保存されている。",
    descriptionEn:
      "One of the early colonies constructed on the outer rim of the E16 star system, known as the birthplace of Mina Eureka. The Nostalgia Colony was established around E300, named so because early settlers attempted to maintain Earth's lifestyle while reminiscing about it. The colony's architectural style and social system mimic the culture of late 20th to early 21st century Earth, giving it a retroscopic landscape distinct from other colonies. In E509, it was attacked by Alpha Venom, resulting in massive destruction and civilian casualties. This attack decisively changed Mina Eureka's life and later became her motivation to disseminate anti-Venom activities through the Genesis Vault. While parts of the colony have been rebuilt, traces of the attack are preserved as memorial facilities.",
  },{
    id: "クレセント大地方" as WikiId,
    name: "クレセント大地方",
    nameEn: "Crescent Region",
    category: "地理",
    subCategory: "クレセント地方",
    description:
      "シンフォニー・オブ・スターズの東大陸に位置する広大な地域で、E16連星系における政治・経済・軍事の最重要拠点の一つである。クレセント大地方にはヴァーミリオン、ブルーローズ、ミエルテンガ、クロセヴィア、SSレンジ、アイアン・シンジケート、SUDOM、ファティマ連邦、スターク三国など、複数の国家と勢力が混在しており、複雑な国際関係を形成している。地名は大陸の三日月のような弧状の地形に由来する。東暦初期の入植以来、豊かな資源と戦略的な位置により争奪の的となってきた歴史を持つ。テクノ文化ルネサンス期以降、ホライゾン・ゲートによる他地域との交通が整備されたことで経済的重要性はさらに増大し、V7やトリニティ・アライアンスなどの軍事同盟の舞台となっている。クレセント大地方の国家間の緊張と協力のバランスは、E16連星系全体の安定に直結すると言われている。",
    descriptionEn:
      "A vast region located on the eastern continent of the Symphony of Stars, serving as one of the most important political, economic, and military hubs in the E16 star system. The Crescent Greatlands is a complex mix of nations and powers including Vermilion, Blue Rose, Miertenga, Crosevia, SS Range, Iron Syndicate, SUDOM, Fatima Federation, and Stark Triumvirate, forming intricate international relations. The name derives from the crescent-moon-like arc of the continent's terrain. Since early colonization in the Eastern calendar, its history has been marked by conflict due to rich resources and strategic positioning. Following the Techno-Cultural Renaissance, the development of transportation through Horizon Gates further increased its economic importance, making it a stage for military alliances like V7 and the Trinity Alliance. The balance of tension and cooperation among the Crescent Greatlands nations is said to directly affect the stability of the entire E16 star system.",
  },{
    id: "ヴァーミリオン" as WikiId,
    name: "ヴァーミリオン",
    nameEn: "Vermillion",
    category: "地理",
    subCategory: "クレセント地方",
    description:
      "ドミニオン・ヴァーミリオンとして知られるクレセント大地方の有力国家で、アイリスの母国である。歴史的にセリア黄金期の文化的遺産を色濃く受け継いでおり、フェルミ音楽の伝統的な演奏形式やAURALISの哲学を国家の文化的基盤としている。ヴァーミリオンは豊かな鉱物資源と農業生産力を背景に経済的な繁栄を誇り、クレセント地方における旧来の秩序を代表する存在である。しかしエヴァトロンの介入による支配時代を経て、国家のアイデンティティと主権回復をめぐる葛藤が続いている。トリニティ・アライアンスの結成メンバーとして軍事的にも重要な役割を果たしており、クレセント地方の地政学的均衡の要として機能している。赤色を基調とした国旗と国家建築は、ヴァーミリオン（朱色）の名に由来する。",
    descriptionEn:
      "A powerful nation of the Crescent Greatlands known as the Dominion of Vermilion, and the motherland of Iris. It has historically inherited the cultural heritage of the Celia Golden Age, with traditional Fermi music performance forms and AURALIS philosophy forming the nation's cultural foundation. Vermilion boasts economic prosperity backed by rich mineral resources and agricultural productivity, representing the established order of the Crescent region. However, after an era of domination by Evatron, the nation continues to grapple with conflicts over national identity and sovereignty recovery. As a founding member of the Trinity Alliance, it plays a crucial military role and functions as a key to the geopolitical balance of the Crescent region. The nation's red-themed flag and architecture derive from its name, Vermilion (cinnabar red).",

    leaders: [
      {
        id: "アザゼル" as WikiId as WikiId,
        name: "アザゼル・ヘクトパス",
        nameEn: "Azazel Hectopass",
        role: "ヴァーミリオン元首脳",
        era: "?〜E480頃",
      },
    ],
  },{
    id: "ブルーローズ" as WikiId,
    name: "ブルーローズ",
    nameEn: "Blue Rose",
    category: "地理",
    subCategory: "クレセント地方",
    description:
      "フィオナが統率するクレセント地方の国家で、V7（Vital Seven）連合の中心的な役割を果たしている。ブルーローズはテクノ文化ルネサンス期の理念を最も純粋に受け継いだ国家と評され、次元極地平技術の研究開発と文化的な開放性を国家的特色としている。フィオナのリーダーシップの下、V7の設立（E515年）を主導し、クレセント地方の7カ国連合の枠組みを構築した。国家名はブルーローズ（青い薔薇）に由来し、不可能とされていた空間技術の民用化を実現した象徴としてこの名が選ばれた。多国籍の研究者や芸術家を受け入れる開放的な政策により、クレセント地方における文化・技術のハブとして機能している。アルファ・ヴェノムやシルバー・ヴェノムの脅威に対してはV7を通じて集団防衛の姿勢をとっている。",
    descriptionEn:
      "A nation in the Crescent region led by Fiona, serving as the central role in the V7 (Vital Seven) coalition. Blue Rose is regarded as the nation that most purely inherits the ideals of the Techno-Cultural Renaissance period, with dimensional horizon technology research and cultural openness as its national characteristics. Under Fiona's leadership, she spearheaded the establishment of V7 (E515) and constructed the framework for the seven-nation alliance in the Crescent region. The nation's name derives from Blue Rose, chosen as a symbol for achieving the civilian application of space technology, once considered impossible. With its open policy accepting multinational researchers and artists, it functions as a cultural and technological hub in the Crescent region. Against threats from Alpha and Silver Venom, it maintains a collective defense posture through V7.",

    leaders: [
      {
        id: "フィオナ" as WikiId as WikiId,
        name: "フィオナ",
        nameEn: "Klaus Fiona",
        role: "ブルーローズ統率者",
        era: "E490〜",
      },
    ],
  },{
    id: "ミエルテンガ" as WikiId,
    name: "ミエルテンガ",
    nameEn: "Mielteunga",
    category: "地理",
    subCategory: "クレセント地方",
    description:
      "マリーナ・ボビンが総統を務めるクレセント地方の国家で、軍事力と産業基盤に強みを持つ。ミエルテンガはスライム危機後の復興期に急速に発展し、リーチ・ドレイン対策のために構築された生物工学産業が国家経済の中核となっている。マリーナ・ボビンの強力なリーダーシップの下、国家全体が効率的な統治体制を築き上げ、クレセント地方における軍事的影響力を拡大してきた。トリニティ・アライアンスの結成メンバーとしてヴァーミリオンやボグダス・ジャベリンと軍事同盟を結んでおり、V7に対抗する勢力の中心として機能している。ミエルテンガの軍事技術はEros-7のマトリカル社会が開発した生物学的技術を応用した独自のもので、他国には公開されていない機密が多い。国家の名前は古い入植者の母語に由来すると言われるが、詳細は不明である。",
    descriptionEn:
      "A nation in the Crescent region led by Supreme Marina Bobin, with strengths in military power and industrial base. Miertenga developed rapidly during the recovery period after the Slime Crisis, with biotechnology industries established to counter Reach Drain becoming the core of the national economy. Under Marina Bobin's strong leadership, the nation has built an efficient governance system and expanded its military influence in the Crescent region. As a founding member of the Trinity Alliance, it has formed military alliances with Vermilion and Bogdas Javelin, functioning as the center of forces opposing V7. Miertenga's military technology is a unique application of biological technology developed by the Matriscal society of Eros-7, with many undisclosed secrets not shared with other nations. The nation's name is said to derive from the ancient language of early settlers, though details remain unknown.",

    leaders: [
      {
        id: "マリーナ・ボビン" as WikiId as WikiId,
        name: "マリーナ・ボビン",
        nameEn: "Marina Bobbin",
        role: "ミエルテンガ総統",
        era: "E515〜",
      },
    ],
  },{
    id: "クロセヴィア" as WikiId,
    name: "クロセヴィア",
    nameEn: "Crosevia",
    category: "地理",
    subCategory: "クレセント地方",
    description:
      "カスチーナ・テンペストが首脳を務めるクレセント地方の国家で、気象制御技術と環境工学に特化した先進的な国家である。クロセヴィアはシンフォニー・オブ・スターズ特有の複雑な気象システムを制御する技術を長年研究してきており、この技術は農業生産の安定化や自然災害の防止に大きく貢献している。カスチーナ・テンペストは「テンペスト（嵐）」の名にふさわしく、気象操作を戦略的資源として活用する外交手腕で知られる。クロセヴィアはV7の加盟国でありながら、トリニティ・アライアンスとの関係構築にも努めるなど、柔軟な外交姿勢を維持している。国家の主要輸出品には気象制御装置と環境モニタリングシステムがあり、E16連星系内の他の植民地にも広く輸出されている。",
    descriptionEn:
      "An advanced nation in the Crescent region led by Castina Tempest, specializing in weather control technology and environmental engineering. Crosevia has long researched technology to control the complex weather systems unique to the Symphony of Stars, which greatly contributes to stabilizing agricultural production and preventing natural disasters. True to her name \"Tempest,\" Castina Tempest is known for her diplomatic skill that utilizes weather manipulation as a strategic resource. While a member of V7, Crosevia also strives to build relations with the Trinity Alliance, maintaining a flexible diplomatic stance. The nation's main exports include weather control devices and environmental monitoring systems, widely exported to other colonies in the E16 star system.",

    leaders: [
      {
        id: "カスチーナ・テンペスト" as WikiId as WikiId,
        name: "カスチーナ・テンペスト",
        nameEn: "Castina Tempest",
        role: "クロセヴィア首脳",
        era: "E515〜",
      },
    ],
  },{
    id: "SSレンジ" as WikiId,
    name: "SSレンジ",
    nameEn: "SS Range",
    category: "地理",
    subCategory: "クレセント地方",
    description:
      "アイク・ロペスが首脳を務めるクレセント地方の国家で、情報通信技術とサイバーセキュリティ分野においてE16連星系随一の技術力を誇る。SSレンジ（Super Signal Range）の名称は、同国が開発した超長距離量子通信システムに由来し、この技術はE16連星系内の全惑星間通信インフラの基盤となっている。アイク・ロペスは元情報技術者であり、国家経営にもデータ駆動型の手法を導入して行政効率の最大化を図っている。SSレンジはV7の加盟国で、主に情報戦と通信インフラの防衛を担当している。ホライゾン・ゲートの安定化制御にもSSレンジの通信技術が不可欠であり、テクノ文化ルネサンス期の技術開放政策を技術面から支えた立役者でもある。国家の人口は比較的少ないが、高密度な都市部に知的労働者が集中する独特の社会構造を持つ。",
    descriptionEn:
      "A nation in the Crescent region led by Chief Ike Lopez, boasting the most advanced information technology and cybersecurity capabilities in the E16 star system. The name SS Range (Super Signal Range) derives from the ultra-long-range quantum communication system developed by the nation, which forms the basis of all interplanetary communication infrastructure in the E16 star system. An information technologist by background, Ike Lopez has introduced data-driven methods into national administration to maximize efficiency. SS Range is a member of V7, primarily responsible for information warfare and defense of communication infrastructure. SS Range's communication technology is indispensable for stabilizing Horizon Gates, making it a key supporter of the technological openness policy of the Techno-Cultural Renaissance period. While the nation's population is relatively small, it has a unique social structure with knowledge workers concentrated in high-density urban areas.",

    leaders: [
      {
        id: "アイク・ロペス" as WikiId as WikiId,
        name: "アイク・ロペス",
        nameEn: "Ike Lopez",
        role: "SSレンジ首脳",
        era: "E515〜",
      },
    ],
  },{
    id: "アイアン・シンジケート" as WikiId,
    name: "アイアン・シンジケート",
    nameEn: "Iron Syndicate",
    category: "地理",
    subCategory: "クレセント地方",
    description:
      "レイド・カキザキが首脳を務めるクレセント地方の国家で、重工業と資源採掘を基盤とする強力な経済国家である。アイアン・シンジケート（鉄のシンジケート）の名称通り、国家経済の大部分を金属資源の採掘・精錬・加工産業が占めており、シンフォニー・オブ・スターズの建設資材の大部分を供給している。レイド・カキザキは実業家出身の首脳で、企業家的な手法で国家を統治し、他国との貿易を通じて経済的影響力を拡大している。アイアン・シンジケートはV7の加盟国であり、軍事装備の製造も担うことから防衛面でも重要な役割を果たしている。国家の工業地帯は昼夜を問わず稼働し、特徴的な赤い煙を上げる精錬所の風景はクレセント地方の象徴的な光景の一つとなっている。環境問題に対する批判も存在するが、近年はテクノ文化ルネサンス期の技術を応用したクリーン生産への転換が進められている。",
    descriptionEn:
      "A nation in the Crescent region led by Chief Raid Kizaki, a powerful economic nation based on heavy industry and resource extraction. True to its name, the Iron Syndicate, the majority of its national economy consists of mining, refining, and processing metal resources, supplying most of the construction materials for the Symphony of Stars. Raid Kizaki, a business leader by background, governs the nation with corporate methods, expanding economic influence through trade with other nations. As a member of V7, the Iron Syndicate also manufactures military equipment, playing an important role in defense. The nation's industrial zones operate day and night, with the sight of refineries emitting characteristic red smoke becoming one of the iconic landscapes of the Crescent region. While facing criticism for environmental issues, recent years have seen a shift toward clean production applying technologies from the Techno-Cultural Renaissance period.",

    leaders: [
      {
        id: "レイド・カキザキ" as WikiId as WikiId,
        name: "レイド・カキザキ",
        nameEn: "Raid Kakizaki",
        role: "アイアン・シンジケート首脳",
        era: "E515〜",
      },
    ],
  },{
    id: "SUDOM" as WikiId,
    name: "スードム",
    nameEn: "SUDOM",
    category: "地理",
    subCategory: "クレセント地方",
    description:
      "クレセント大地方に位置する国家で、独自の文化的アイデンティティと高度な医療技術で知られる。SUDOMは東暦初期の入植計画において、特定の医療研究目的で設立された特別植民地を起源に持つ。この歴史的経緯から、国家は遺伝子医療、再生医療、神経科学の分野でE16文明圏の最先端を走っており、特にスライム危機以降のリーチ・ドレイン対策医療において多大な貢献を果たした。SUDOMはV7の加盟国であり、同盟の医療支援と疫学調査を担当している。またnトークン経済において、医療サービスの提供が高く評価される仕組みを確立しており、他国の医療制度にも影響を与えている。国家名の由来は入植初期の研究コードに基づくと言われるが、公式な語源は明らかにされていない。",
    descriptionEn:
      "A nation located in the Crescent Great Region, known for its unique cultural identity and advanced medical technology. SUDOM traces its origins to a special colony established during the early Eastern Calendar colonization project for specific medical research purposes. Due to this historical background, the nation leads the E16 civilization in the fields of genetic medicine, regenerative medicine, and neuroscience, making significant contributions particularly in Reach Drain countermeasures after the Slime Crisis. SUDOM is a member of V7 and is responsible for the alliance's medical support and epidemiological investigations. Additionally, it has established a highly valued system for providing medical services in the n-token economy, influencing the healthcare systems of other countries. The origin of the nation's name is said to be based on a research code from the early colonization period, though the official etymology has not been disclosed.",

    leaders: [
      {
        id: "セルヴァ・ドーン" as WikiId as WikiId,
        name: "セルヴァ・ドーン",
        nameEn: "Selva Dawn",
        role: "SUDOM初代医療総裁",
        era: "E480〜",
      },
    ],
  },{
    id: "ファティマ連邦" as WikiId,
    name: "ファティマ連邦",
    nameEn: "Fatima Federation",
    category: "地理",
    subCategory: "クレセント地方",
    description:
      "クレセント大地方に位置する連邦制国家で、複数の自治州が緩やかな連合を形成している。ファティマ連邦は宗教的・哲学的自由を重んじる文化で知られ、E16文明圏における多元的な思想交流の拠点として機能している。連邦を構成する各自治州は独自の法体系と教育制度を持ち、連邦政府は外交と防衛のみを管轄する最小限の統治構造を採用している。この分散型の統治モデルはネオクラン同盟の理念と共鳴し、ファティマ連邦は同盟の熱心な支持者である。また、フェルミ音楽の精神論的な側面を深く研究する学派があり、AURALISのメンバーも多数輩出している。ファティマ連邦はV7には加盟していないが、非同盟中立の立場を取りながらもクレセント地方の平和維持に積極的に関与している。",
    descriptionEn:
      "A federal nation located in the Crescent Great Region, composed of multiple autonomous states forming a loose federation. The Fatima Federation is known for its culture that values religious and philosophical freedom, serving as a hub for diverse intellectual exchange within the E16 civilization. Each autonomous state comprising the federation has its own legal system and education system, while the federal government adopts a minimal governance structure overseeing only foreign affairs and defense. This decentralized governance model resonates with the ideals of the Neo-Clan Alliance, and the Fatima Federation is a staunch supporter of the alliance. Additionally, it has a school of thought that deeply studies the spiritual aspects of Fermi music, and has produced many members of AURALIS. While not a member of V7, the Fatima Federation maintains a non-aligned neutral stance while actively participating in maintaining peace in the Crescent region.",

    leaders: [
      {
        id: "ハシーム・ファティマ" as WikiId as WikiId,
        name: "ハシーム・ファティマ",
        nameEn: "Hashim Fatima",
        role: "ファティマ連邦初代連邦議長",
        era: "E400〜",
      },
    ],
  },{
    id: "スターク三国" as WikiId,
    name: "スターク三国",
    nameEn: "Stark Triad Nations",
    category: "地理",
    subCategory: "クレセント地方",
    description:
      "クレセント大地方の北部に位置する三つの国家からなる国家群で、歴史的に強固な相互防衛同盟を維持している。スターク三国の名称は「厳格な（stark）」外交姿勢に由来し、他の勢力への依存を避け、自立的な安全保障体制を維持することを国家理念としている。三国はそれぞれ軍事、経済、外交に特化しており、相互補完的な関係で連合の強靭性を確保している。V7やトリニティ・アライアンスのいずれにも属さない独自の立場を維持し、クレセント地方における第三勢力としての役割を果たしている。スターク三国の軍事力は質量ともに高く評価されており、その中立的な立場からクレセント地方の紛争調停において重要な役割を担うことが多い。東暦初期のバーズ帝国崩壊後に三国の原型が形成され、長い歴史の中で独特の連合文化を育んできた。",
    descriptionEn:
      "A cluster of three nations located in the northern part of the Crescent Great Region, historically maintaining a strong mutual defense alliance. The name \"Stark Triumvirate\" derives from its \"stark\" diplomatic posture, with the national philosophy of avoiding dependence on other powers and maintaining an independent security system. The three nations specialize respectively in military, economic, and affairs, ensuring the resilience of their alliance through complementary relationships. They maintain their own independent position, belonging to neither V7 nor the Trinity Alliance, serving as a third force in the Crescent region. The military power of the Stark Triumvirate is highly regarded in both quality and quantity, and due to its neutral stance, it often plays an important role in mediating conflicts in the Crescent region. The prototype of the three nations was formed after the collapse of the Bartz Empire in the early Eastern Calendar, and over a long history, they have developed a unique alliance culture.",

    leaders: [
      {
        id: "トリスタン・スターク" as WikiId as WikiId,
        name: "トリスタン・スターク",
        nameEn: "Tristan Stark",
        role: "スターク三国軍事理事長",
        era: "E480〜",
      },
    ],
  },{
    id: "ネオンコロシアム" as WikiId,
    name: "ネオンコロシアム",
    nameEn: "Neon Colosseum",
    category: "地理",
    subCategory: "その他",
    description:
      "Gigapolis最大の闘技場であり、シンフォニー・オブ・スターズ西大陸における最大級のエンターテインメント施設。年間を通じてスティル・アレーナが開催され、世界中から参加者が集まる。闘技場のネオン照明が夜間に輝く姿はGigapolisのシンボル的一景として広く知られ、文化イベントや音楽フェスティバルの会場としても機能する。観客席は最大50万人を収容可能で、次元ホログラム技術による臨場感のある中継システムを完備。",
    descriptionEn:
      "Gigapolis's largest arena and one of the largest entertainment facilities in the Symphony of Stars Western Continent. The Still Arena is held throughout the year, attracting participants from all over the world. The neon lights of the arena shining at night are widely known as a symbolic sight of Gigapolis, and it also functions as a venue for cultural events and music festivals. The spectator stands can accommodate up to 500,000 people and are equipped with an immersive broadcasting system using dimensional hologram technology.",
  },{
    id: "Abrivo" as WikiId,
    name: "アブリーヴォ",
    nameEn: "Abrivo",
    category: "地理",
    subCategory: "西大陸都市",
    description:
      "Gigapolis圏の交易都市。シンフォニー・オブ・スターズ西大陸の物流ハブとして機能し、各地からの原材料と製品を中継する活気ある港湾都市。エル・フォルハウスのマーストリヒト革命後は自由貿易の拠点として発展した。",
    descriptionEn:
      "A trading city in the Gigapolis sphere. It functions as a logistics hub for the Symphony of Stars Western Continent, a vibrant port city that relays raw materials and products from various regions. After the Maastricht Revolution in El Forlhaus, it developed as a center for free trade.",
  },{
    id: "Ronve" as WikiId,
    name: "ロンヴ",
    nameEn: "Ronve",
    category: "地理",
    subCategory: "西大陸都市",
    description:
      "Gigapolis圏の城塞都市。西大陸の北部に位置し、ロンバルディア戦争（E88〜E98年）の際には前線基地として機能した堅固な防衛都市。現在でも要塞跡と軍事博物館が残り、テクロサス系譜の軍事伝統を伝える。",
    descriptionEn:
      "A fortress city in the Gigapolis sphere. Located in the northern part of the Western Continent, it was a solid defensive city that functioned as a front-line base during the Lombardia War (E88-E98). Today, fortress ruins and a military museum remain, preserving the military tradition of the Teclosus lineage.",
  },{
    id: "Lille" as WikiId,
    name: "リール",
    nameEn: "Lille",
    category: "地理",
    subCategory: "西大陸都市",
    description:
      "Gigapolis圏の通信・情報都市。西大陸の通信ネットワークの中継拠点として機能し、次元極地平技術の民生利用の試験地としても知られる。テクノ文化ルネサンス（E475〜E500）以降は新しいメディア産業の拠点として急成長している。",
    descriptionEn:
      "A communications and information city in the Gigapolis sphere. It functions as a relay point for the Western Continent's communication network and is also known as a testing ground for civilian use of dimensional horizon technology. Since the Techno Cultural Renaissance (E475-E500), it has grown rapidly as a center for the new media industry.",
  },{
    id: "Valoria" as WikiId,
    name: "ヴァロリア",
    nameEn: "Valoria",
    category: "地理",
    subCategory: "西大陸都市",
    description:
      "Gigapolis圏南部の戦略的要衝に位置する都市。壮麗なValoria宮殿を擁し、E319年にLv938+の実力者Jenがこの宮殿を掌握して以降、彼女を中心とするValoria連合圏の中核拠点として機能している。ZAMLT崩壊後の権力真空期にJenが西大陸の安定を確立した拠点でもあり、現在でも新ZAMLT期における主要な政治・軍事拠点として重要な役割を果たす。宮殿の地下には古代の次元兵器遺構が眠ると伝えられている。",
    descriptionEn:
      "A city located at a strategic crossroads in southern Gigapolis. It boasts the magnificent Valoria Palace, and since E319 when the Lv938+ powerhouse Jen took control of this palace, it has functioned as the core base of the Valoria Alliance centered around her. It was also a base where Jen established stability in the Western Continent during the power vacuum after the collapse of ZAMLT, and it still plays an important role as a major political and military base in the new ZAMLT era. It is said that ancient dimensional weapon ruins sleep beneath the palace.",
  },{
    id: "Persepolis" as WikiId,
    name: "ペルセポリス",
    nameEn: "Persepolis",
    category: "地理",
    subCategory: "西大陸都市",
    description:
      "Gigapolis圏の宇宙港都市。西大陸最大の宇宙港を擁し、惑星間交易と移民の中継地として機能する。ティムール・シャーの移民団が最初に到着した地の一つであり、異星文化の融合が進む国際色豊かな都市。",
    descriptionEn:
      "A spaceport city in the Gigapolis sphere. It boasts the largest spaceport on the Western Continent and functions as a relay point for interplanetary trade and immigration. It was one of the first places reached by Timur Shah's immigrant group, making it an internationally rich city where alien cultures continue to blend.",
  },{
    id: "Selinopolis（西大陸都市）" as WikiId,
    name: "セリノポリス",
    nameEn: "Selinopolis",
    category: "地理",
    subCategory: "西大陸都市",
    description:
      "Gigapolisの旧称の一つ。セリア・ドミニクスがZAMLTを打倒し、Gigapolisを掌握した後にSelinopolisと改名した。セリアは超巨大企業Phovosを設立して次元エネルギー技術の商業化を推進し、都市をGDP25兆ドル規模に急成長させた。しかしアポロン・Dominion大戦後、エヴァトロンに吸収されセリアは追放された。現在はGigapolisの名称に戻っているが、歴史的経緯から「Selinopolis（ドミニオン）」として別項目でも詳述される。詳細は用語「Selinopolis（ドミニオン）」を参照。",
    descriptionEn:
      "One of the former names of Gigapolis. After Celia Dominicus overthrew ZAMLT and took control of Gigapolis, she renamed it Selinopolis. Celia established the hyper-megacorporation Phovos to commercialize dimensional energy technology, rapidly growing the city to a GDP of 25 trillion dollars. However, after the Apollo-Dominion War, it was absorbed by Evatron and Celia was exiled. Although it has since reverted to the name Gigapolis, due to its historical significance, it is also detailed as a separate entry under \"Selinopolis (Dominion).\" For details, refer to the term \"Selinopolis (Dominion).\"",
  },{
    id: "エヴァポリス" as WikiId,
    name: "エヴァポリス",
    nameEn: "Evapolis",
    category: "地理",
    subCategory: "西大陸都市",
    description:
      "Gigapolisのエヴァトロン支配時代（E400〜E475年）における強制的な改名都市名。エヴァトロンが自らの権威を都市の名称に刻印する意図で改名を実施したが、市民の間では古き良きGigapolisの名で呼び続ける抵抗運動が根強く存在した。E475年のエヴァトロン崩壊後、市民の総意により即座にGigapolisの名称が復帰。この改名と復帰の歴史は、都市の自治と市民の尊厳を取り戻した象徴的出来事として現在でも語り継がれ、毎年復帰記念日が祝われている。",
    descriptionEn:
      "The forced renaming of Gigapolis during the Evatron domination era (E400-E475). Evatron renamed the city to imprint its own authority upon its name, but a strong resistance movement continued to call it the beloved name of Gigapolis among the citizens. After the collapse of Evatron in E475, the name Gigapolis was immediately restored by popular will. This history of renaming and restoration is still told today as a symbolic event of the city's regained autonomy and citizens' dignity, and the Restoration Anniversary is celebrated every year.",
  },{
    id: "パラトン" as WikiId,
    name: "パラトン",
    nameEn: "Palaton",
    category: "地理",
    subCategory: "西大陸都市",
    description:
      "E6年に形成されたシンフォニー・オブ・スターズ西大陸における最初期の都市圏であり、現在のGigapolis圏の直接的な原型。地球からの移民集団が到着した直後に建設され、当初は数千人の小規模な居住区に過ぎなかった。しかし技術啓蒙時代に人口が爆発的に増加し、周辺都市と統合してメガロポリスへと成長。パラトンの城壁遺構の一部は現在でもGigapolis歴史地区に保存され、西大陸文明の起原を示す重要な文化財として指定されている。",
    descriptionEn:
      "The earliest urban area in the Symphony of Stars on the Western Continent, formed in E6, and the direct prototype of the current Gigapolis sphere. It was constructed immediately after the arrival of immigrant groups from Earth, initially a small residential area of only a few thousand people. However, during the Age of Enlightenment, the population exploded, and it grew into a megalopolis through integration with surrounding cities. Part of the Paraton wall ruins is still preserved in the Gigapolis historical district and designated as an important cultural asset marking the origin of Western Continent civilization.",
  },{
    id: "地下街" as WikiId,
    name: "地下街",
    nameEn: "Underground City",
    category: "地理",
    subCategory: "西大陸都市",
    description:
      "Gigapolisの地下深くに広がる複雑な地下構造体であり、複数の階層からなる独自の都市空間を形成している。上層部は商業施設と倉庫、中層部はインフラ設備と旧居住区が配置され、最深部はTina/Gueが実効支配する独自の統治領域となっている。アンダーグリッドとも接続しており、スライム危機時には巨大なスライムの巣が形成されるなど、表の都市とは全く異なる生態系が存在する。最深部の正確な構造は未だ完全には解明されていない。",
    descriptionEn:
      "A complex underground structure extending deep beneath Gigapolis, forming a unique urban space with multiple levels. The upper levels house commercial facilities and warehouses, the middle levels contain infrastructure and old residential areas, and the deepest level forms a self-governing territory effectively controlled by Tina/Gue. It is also connected to the Undergrid, and during the Slime Crisis, it forms giant slime nests, hosting a completely different ecosystem from the surface city. The exact structure of the deepest levels has yet to be fully elucidated.",
  },{
    id: "ネオンクレーター宮殿" as WikiId,
    name: "ネオンクレーター宮殿",
    nameEn: "Neon Crater Palace",
    category: "地理",
    subCategory: "施設・建造物",
    description:
      "Eros-7の絶対的シンボルにして、惑星の政治・軍事的中枢が収まる巨大宮殿。初期建設時は高さ800メートル・100階建ての構造であったが、ZAMLT期に至り高さ1.5キロメートル・200階建てへと大拡張され、その威容は惑星 orbit からも視認可能となった。内部には統治会議場、軍司令部、搾取研究施設が配置され、Eros-7の独裁体制の象徴として機能。カーラ・ヴェルムのスクイーズ・アビス建設後は搾取エネルギーの管理中枢ともなった。現在では一部が市民に開放され、歴史博物館としても活用されている。",
    descriptionEn:
      "The absolute symbol of Eros-7 and the colossal palace housing the planet's political and military nerve center. Initially constructed as an 800-meter tall, 100-story structure, it was massively expanded during the ZAMLT era to 1.5 kilometers tall and 200 stories, making its majestic form visible even from planetary orbit. It houses governance conference halls, military command centers, and exploitation research facilities, functioning as a symbol of Eros-7's dictatorship. After the construction of Carla Verm's Squeeze Abyss, it also became the control center for exploitation energy. Currently, parts of it are open to the public and utilized as a historical museum.",
  },{
    id: "スクイーズ・アビス" as WikiId,
    name: "スクイーズ・アビス",
    nameEn: "Squeeze Abyss",
    category: "地理",
    subCategory: "施設・建造物",
    description:
      "Eros-7の地下560階に構築された巨大な搾取施設。カーラ・ヴェルムが設計・建設を指揮し、惑星の地殻深部から搾取エネルギーを抽出するために建造された。施設の最深部では搾取プラズマ弾の量産が行われ、その破壊力は周辺惑星をも脅かす規模に達した。極度の過酷労働環境のもとで数千人の労働者が動員され、シャドウ・ユニオンの抵抗運動の主な標的となった。現在は大部分が封鎖されているが、一部のレベルで再利用計画が進んでいる。",
    descriptionEn:
      "A colossal exploitation facility constructed 560 levels deep beneath Eros-7. Designed and constructed under the direction of Carla Verm, it was built to extract exploitation energy from the deep crust of the planet. At its deepest levels, mass production of exploitation plasma bombs was carried out, their destructive power reaching a scale that threatened neighboring planets. Thousands of workers were mobilized under extremely harsh working conditions, making it a primary target for the resistance movement of the Shadow Union. Although most of it is now sealed off, plans for partial reuse are underway in some levels.",
  },{
    id: "アンダーグリッド" as WikiId,
    name: "アンダーグリッド",
    nameEn: "Undergrid",
    category: "地理",
    subCategory: "施設・建造物",
    description:
      "Gigapolisの地下全体に張り巡らされた広大なネットワークインフラであり、エネルギー供給、通信、物流の動脈として機能する複数階層の地下構造体。スライム危機の際には地下の湿潤環境を好む巨大スライムの巣が形成され、Gigapolisのインフラに深刻な被害をもたらした。アヤカ・リンが先陣を切って制圧作戦を実行し、危機の収束に貢献。現在では安全対策が大幅に強化され、一部は観光用トンネルとしても整備されている。地下街とも接続し、Gigapolisの地下世界の重要な構成要素となっている。",
    descriptionEn:
      "A vast network infrastructure spanning the entire underground of Gigapolis, a multi-level underground structure functioning as the artery for energy supply, communications, and logistics. During the Slime Crisis, giant slime nests that thrive in the underground humid environment formed, causing severe damage to Gigapolis's infrastructure. Ayaka Rin led the suppression operation, contributing to the resolution of the crisis. Safety measures have since been significantly strengthened, and parts of it have been developed as tourist tunnels. It is also connected to the underground shopping district, becoming an important component of Gigapolis's underground world.",
  },{
    id: "セントラル・タワー" as WikiId,
    name: "セントラル・タワー",
    nameEn: "Central Tower",
    category: "地理",
    subCategory: "施設・建造物",
    description:
      "Gigapolisの中心部に聳え立つ象徴的な超高層タワーであり、西大陸の政治と商業の中心地。E150年のマーストリヒト革命の際、革命指導者エル・フォルハウスがこのタワーを武力占拠し、完全自由経済体制への移行を宣言した歴史的舞台。以来、政変や権力交代のたびに占拠と奪還が繰り返されてきた。E524年には諸世界連邦サミットの主会場として使用され、宇宙規模の外交協議の場となった。タワー最上層のオブザベーションデッキからはGigapolis全土を見渡すことができる。",
    descriptionEn:
      "The iconic super-skyscraper towering at the heart of Gigapolis, the political and commercial center of the Western Continent. During the Maastricht Revolution of E150, revolutionary leader El Forhaus forcibly occupied this tower and declared the transition to a completely free economic system, making it a historic stage. Since then, it has been repeatedly occupied and recaptured during each coup and power transition. In E524, it was used as the main venue for the Interstellar Federal Summit, becoming a venue for interstellar-scale diplomatic negotiations. From the observation deck on the top floor, the entire expanse of Gigapolis can be overlooked.",
  },{
    id: "オアシス・ハウス" as WikiId,
    name: "オアシス・ハウス",
    nameEn: "Oasis House",
    category: "地理",
    subCategory: "施設・建造物",
    description:
      "レイラ・ヴィレル・ノヴァがスライム危機時に前線拠点として使用した場所。Gigapolis地下街の中部エリアに位置し、元々は旧時代の防空シェルターとして建設された構造物を転用した臨時作戦本部。レイラはここを拠点にナノファイバーブーツや強化グローブを駆使してスライム討伐作戦を指揮し、プラズマカノンによる大規模焼却作戦の立案も行った。危機後は戦災記念施設として保存され、内部にはレイラの装備品のレプリカとスライム危機の記録アーカイブが展示されている。",
    descriptionEn:
      "The location used by Leila Viller Nova as a forward base during the Slime Crisis. Located in the central area of Gigapolis's underground city, it was originally a temporary operational command center repurposed from an air-raid shelter structure from the old era. From this base, Leila commanded the Slime Extermination Operation utilizing nano-fiber boots and reinforced gloves, and also planned the large-scale incineration operation using plasma cannons. After the crisis, it was preserved as a war memorial facility, with replicas of Leila's equipment and archives of the Slime Crisis on display inside.",
  },{
    id: "ロレンツィオ国際大学" as WikiId,
    name: "ロレンツィオ国際大学",
    nameEn: "Lorenzio International University",
    category: "地理",
    subCategory: "施設・建造物",
    description:
      "惑星ビブリオに設立された宇宙規模の最高学府にして学術研究の中心。次元物理学、量子情報科学、異種文明学などの最先端分野で宇宙トップクラスの研究実績を誇る。E514年に天才少女ミナがAI学部に入学し、在学中から画期的な研究成果を発表して学界に衝撃を与えた。キャンパスは惑星の北半球に広がり、複数の惑星から集まった留学生が学ぶ国際色豊かな環境。卒業生には銀河系コンソーシアムの要職につく者も多く、次世代の指導者育成機関として重要な役割を担っている。",
    descriptionEn:
      "The highest institution of learning established on the planet Biblio and the center of academic research. It boasts top-tier research achievements in cutting-edge fields such as dimensional physics, quantum information science, and xenocivilization studies. In E514, the prodigy Mina enrolled in the AI department and published groundbreaking research findings while still a student, causing a shock in the academic world. The campus spreads across the northern hemisphere of the planet, creating an international environment where students from multiple planets study. Many graduates hold key positions in the Galactic Consortium, and it plays an important role as an institution for nurturing the next generation of leaders.",
  },{
    id: "ヴェズレル" as WikiId,
    name: "ヴェズレル",
    nameEn: "Vezrel",
    category: "地理",
    subCategory: "宇宙拠点",
    description:
      "エレシュ信仰の中枢拠点であり、サンクチュアリを擁する惑星系。エレシュ教義において「真理の星」と呼ばれ、次元境界領に最も近い位置に浮かぶ特異な惑星系である。ヴェズレルの地表には、自然発生した結晶構造体が点在し、これらはエレシュの教義において「次元の言葉」と解釈され、オラクルの予言解釈に用いられている。惑星系全体が強い精神波的エネルギーに包まれており、非信者であってもヴェズレルに到達すると独特の精神的感応を経験するとされる。エレシュの研究機関が惑星系内に設けられており、宗教と科学の融合研究の最前線基地として機能している。ヴェズレルの経済は巡礼者による宗教産業が中心だが、近年はエレシュの精神的影響力を求めて他文明圏からの寄付や投資も増加している。",
    descriptionEn:
      "The central hub of the Elesh faith and a planetary system that houses a sanctuary. Known as the \"Star of Truth\" in Elesh doctrine, it is a unique planetary system floating in a position closest to the dimensional boundary realm. The surface of Vezrel is dotted with naturally occurring crystal structures, which are interpreted in Elesh doctrine as \"Words of the Dimension\" and are used in the interpretation of Oracle prophecies. The entire planetary system is enveloped in strong psychotropic energy, and it is said that even non-believers experience a unique spiritual resonance upon reaching Vezrel. Elesh research institutions are established within the planetary system, functioning as a frontline base for the fusion of religion and science. Vezrel's economy is centered on religious industries from pilgrims, but in recent years, donations and investments from other civilizations seeking Elesh's spiritual influence have been increasing.",
  },{
    id: "プロキオ・ネクサス" as WikiId,
    name: "プロキオ・ネクサス",
    nameEn: "Prokio Nexus",
    category: "地理",
    subCategory: "宇宙拠点",
    description:
      "プロキオの中核拠点であり、宇宙最大の交易ハブとして機能する惑星系。全宇宙の貿易ルートが交差する交通の要衝に位置し、数百の恒星系間航路が接続している。プロキオ・ネクサスには巨大な宇宙港と取引所が設けられ、あらゆる資源・技術・文化財が日々取引されている。プロキオの商工会議長の本部もこの惑星系に置かれ、宇宙規模の貿易ルートの管理と運営の中枢となっている。惑星系内の物流インフラは宇宙随一の効率を誇り、プロキオの技術部門が開発した超高速輸送システムにより、他文明圏に比べて物流コストが圧倒的に低い。プロキオ・ネクサスの経済活動は宇宙全体の物価と通貨の安定に直結しており、ここでの取引価格が宇宙の基準価格となっているため、プロキオの経済動向は全文明圏に波及する。エレシオンの医療物資やティエリアの軍事技術、グランベルの消費財がここで中継され、各勢力の経済はプロキオ・ネクサスを通じて相互に依存している。",
    descriptionEn:
      "The central hub of Prokio and a planetary system that functions as the universe's largest trading hub. Located at a transportation crossroads where trade routes from the entire universe intersect, it is connected to hundreds of interstellar routes. Prokio Nexus features a massive spaceport and exchange where all kinds of resources, technologies, and cultural artifacts are traded daily. The headquarters of the Prokio Chamber of Commerce is also located in this planetary system, serving as the center for the management and operation of interstellar trade routes. The logistics infrastructure within the planetary system boasts unparalleled efficiency in the universe, and thanks to the ultra-high-speed transportation system developed by Prokio's technical department, logistics costs are overwhelmingly low compared to other civilizations. The economic activities of Prokio Nexus directly affect the stability of prices and currencies across the universe, as transaction prices here become the standard prices for the cosmos, making Prokio's economic trends ripple across all civilizations. Medical supplies from Elesion, military technology from Tierra, and consumer goods from Granbel are relayed here, and the economies of each faction are mutually dependent through Prokio Nexus.",
  },{
    id: "ロースター・コア" as WikiId,
    name: "ロースター・コア",
    nameEn: "Roastar Core",
    category: "地理",
    subCategory: "宇宙拠点",
    description:
      "ロースターの中核拠点であり、次元間通信技術と量子ネットワークの研究・開発拠点として機能する惑星系。ロースター・コアには宇宙最大の量子コンピューティングセンターが設置されており、次元間通信に必要な膨大なデータ処理をリアルタイムで行っている。また、次元の歪みを監視する早期警戒システムの中枢もここに置かれており、次元境界の不安定化を検知すると全宇宙の関連機関に警報を発する機能を持つ。ロースター・コアの通信インフラは宇宙全体に張り巡らされており、グランベルの量子経済システム、エレシオンの医療データネットワーク、ティエリアの軍事通信網、ファルージャの文化交流プラットフォーム、ディオクレニスの探査データ送信など、あらゆる文明圏の通信がロースター・コアを経由している。このため、ロースター・コアの安全性と安定性は宇宙全体の通信インフラの命運を握っていると言える。",
    descriptionEn:
      "The central hub of Roster and a planetary system that functions as a research and development center for interdimensional communication technology and quantum networks. The largest quantum computing center in the universe is installed in Roster Core, performing real-time processing of the vast data required for interdimensional communication. Additionally, the central early warning system that monitors dimensional distortions is also located here, possessing the function of alerting all relevant agencies across the universe when instability in the dimensional boundary is detected. The communication infrastructure of Roster Core is spread throughout the universe, and communications from all civilizations pass through Roster Core, including Granbel's quantum economic system, Elesion's medical data network, Tierra's military communication network, Faluja's cultural exchange platform, and Diocrenis's exploration data transmission. Therefore, it can be said that the safety and stability of Roster Core hold the fate of the universe's entire communication infrastructure.",
  },{
    id: "次元の塔" as WikiId,
    name: "次元の塔",
    nameEn: "Dimensional Tower",
    category: "地理",
    subCategory: "施設・建造物",
    description:
      "ZAMLT本社の最深部に建造された特異な構造体で、ZAMLTの最終兵器として機能した。塔内部にはカタリスト・コアが設置されており、次元境界のエネルギーを直接操作する能力を持つ。アルファ・ケインとテクロサスの連合軍はZAMLTの本社最深处にあるこの次元の塔への侵入を最終目標とし、カタリスト・コアの破壊を試みた。塔の構造自体が次元境界の不安定領域に接続されており、通常の物理法則が適用されない特異空間となっている。最終決戦ではオメガ＝ユリシス（EVILSのリーダー）もこの次元の塔に出現し、アルファ・ケインの伴共役能力との激突が繰り広げられた。次元の塔の崩壊はZAMLTの終焉を象徴的に示す出来事であり、コーポラトクラシー時代の終わりを告げる象徴となった。",
    descriptionEn:
      "A unique structure built in the deepest part of the ZAMLT headquarters, functioning as ZAMLT's ultimate weapon. The Catalyst Core is installed inside the tower, possessing the ability to directly manipulate the energy of the dimensional boundary. The joint forces of Alpha Cain and Techrosus made the invasion of this dimensional tower in the deepest part of ZAMLT's headquarters their ultimate goal, attempting to destroy the Catalyst Core. The tower's structure itself is connected to an unstable area of the dimensional boundary, forming a singular space where normal physical laws do not apply. In the final battle, Omega=Ulysses (leader of EVILS) also appeared in this dimensional tower, and a fierce clash with Alpha Cain's conjugate ability unfolded. The collapse of the dimensional tower symbolically marked the end of ZAMLT and became a symbol announcing the end of the corporatocracy era.",
  },{
    id: "次元の塔（ZAMLT本社）" as WikiId,
    name: "シルバープラント",
    nameEn: "Silver Plant",
    category: "地理",
    subCategory: "施設・建造物",
    description:
      "ZAMLTの重要施設の一つで、次元エネルギーの精製と兵器生産を行う工場プラント。テクロサスとの全面戦争において、アルファ・ケインとクロノ・ヴァーレント率いるテクロサス部隊による浸透作戦の標的となった。シルバープラント攻略戦では、リンダがプロトコルXのエネルギーコアを安定化させるために自らを犠牲にするという悲劇的な決断を下した。彼女の犠牲はZAMLTに対する抵抗運動の転換点となり、アルファ・ケインの決意を固めさせた。シルバープラントの名は、プラントから放出される銀色の次元エネルギー光輝に由来する。ZAMLT崩壊後、シルバープラントの遺構は「シルバー・ヴェノム」の名称の由来となったという説があり、暗黒組織の歴史的起点として研究されている。",
    descriptionEn:
      "One of ZAMLT's important facilities, a factory plant that refines dimensional energy and produces weapons. During the all-out war with Techrosus, it became the target of an infiltration operation by Techrosus forces led by Alpha Cain and Chrono Valerent. In the Silver Plant assault battle, Linda made the tragic decision to sacrifice herself to stabilize the energy core of Protocol X. Her sacrifice became a turning point in the resistance movement against ZAMLT and solidified Alpha Cain's resolve. The name \"Silver Plant\" derives from the silver-colored dimensional energy radiance emitted from the plant. After ZAMLT's collapse, there is a theory that the ruins of the Silver Plant became the origin of the name \"Silver Venom,\" and it is studied as the historical starting point of the dark organization.",
  },{
    id: "ギガポリス" as WikiId,
    name: "ギガポリス",
    nameEn: "Gigapolis",
    category: "地理",
    subCategory: "西大陸都市",
    description:
      "シンフォニー・オブ・スターズ西大陸最大の都市であり、E16連星系の政治・経済・文化の中心地。惑星全土を覆う巨大都市で、20万以上のコーポラトクラシーが競い合い、GDP14京ドルに達する経済の中心地。南部的テスラ地区は労働者層の居住区であり、アルファ・ケインもここで育った。中心部の大広場ではスティル・アレーナが開催され、ZAMLT本部がホログラムと光の層で覆われた塔として君臨した。外周部には虚無の塔が秘密裏に建造され、次元の特異点としてEVILSとの秘密会合に利用された。E6年のパラトンを起源に、技術啓蒙時代の人口爆発とコーポラトクラシー体制のコーポラタムパブリカ期の経済成長を経てメガロポリスへと発展。E150年のマーストリヒト革命でエル・フォルハウスがセントラル・タワーを占拠し自由経済を宣言。E301年にZAMLTの本社が置かれ経済覇権の象徴となったが、E318年のギガポリス解放戦でアルファ・ケインが解放。E335年セリア・ドミニクスによる黄金期を経てSelinopolisと改名。アポロン・Dominion大戦後エヴァトロンに吸収されエヴァポリスと強制改名。E475年エヴァトロン崩壊後Gigapolisに復帰。現在はValoria連合圏の下で安定した都市運営が続いている。地下街最深部はTina/Gueが支配。",
    descriptionEn:
      "Symphony of Stars, the largest metropolis on the Western Continent and the political, economic, and cultural center of the E16 star system. A megalopolis covering the entire planet, it's an economic hub where over 200,000 corporatocracies compete, reaching a GDP of 140 quadrillion dollars. The southern Tesla District is a residential area for the working class, where Alpha Kane was also raised. In the central plaza, the Still Arena is held, and the ZAMLT headquarters looms as a tower enveloped in holograms and layers of light. In the outer perimeter, the Tower of Emptiness was secretly constructed and used as a dimensional singularity for secret meetings with EVILS. Originating from the Paraton of E16, it developed into a megalopolis through the population explosion of the Enlightenment Era and the economic growth of the Corporate Republic's Corporatum Publica period. During the Maastricht Revolution of E150, El Forhaus occupied the Central Tower and declared free economy. In E301, ZAMLT established its headquarters, becoming a symbol of economic hegemony, but in E318, during the Gigapolis Liberation War, it was liberated by Alpha Kane. After the golden age led by Celia Dominicus in E335, it was renamed Selinopolis. After the Apollo Dominion War, it was absorbed by Evatron and forcibly renamed Evapolis. Following Evatron's collapse in E475, it returned to Gigapolis. Currently, stable urban administration continues under the Valoria Alliance Zone. The deepest part of the underground district is ruled by Tina/Gue.",
  },{
    id: "Poitiers" as WikiId,
    name: "Poitiers",
    nameEn: "Poitiers",
    category: "地理",
    subCategory: "西大陸都市",
    description:
      "Gigapolis圏の文化・学術都市。フェルミ音楽の研究機関と芸術院が集積する「音の都」。セリア黄金期にはAURALISの創作活動の拠点として機能し、フェルミ音楽の理論体系化が進められた。現在でもフェルミ音楽の復興祭が定期的に開催され、E16文明圏の音楽文化の中心地として機能している。",
    descriptionEn:
      "A cultural and academic city in the Gigapolis sphere. The \"City of Sound\" where institutions researching Fermi music and art academies are concentrated. During Celia's golden age, it served as a base for AURALIS's creative activities, advancing the theoretical systemization of Fermi music. Even now, the Fermi music revival festival is held regularly, functioning as the center of musical culture in the E16 civilization sphere.",
  },{
    id: "Chem" as WikiId,
    name: "Chem",
    nameEn: "Chem",
    category: "地理",
    subCategory: "西大陸都市",
    description:
      "Gigapolis圏の化学工業都市。フェンドラ人の冶金・化学技術を基盤に発展し、ZAMLT期にはトロン・コーポレーションの生産拠点として機能した。スライム危機後は環境浄化技術への転換が進み、クリーン生産のモデル都市として再編されている。",
    descriptionEn:
      "A chemical industrial city in the Gigapolis sphere. Developed based on the metallurgical and chemical technologies of the Fendran people, during the ZAMLT era it functioned as a production base for the Thorne Corporation. After the Slime Crisis, it has been transitioning to environmental purification technologies and is being reorganized as a model city for clean production.",
  },{
    id: "Troyane" as WikiId,
    name: "Troyane",
    nameEn: "Troyane",
    category: "地理",
    subCategory: "西大陸都市",
    description:
      "Gigapolis圏の宗教都市。テクノ宗教運動の聖地であり、テンプル・オブ・ホライゾンとテミルタロンのゆかりの地。バーズ帝国時代の遺構が残り、軍事史研究の重要拠点。サイケデリック・コスモロジーの修行施設が周辺に立ち並ぶ。",
    descriptionEn:
      "A religious city in the Gigapolis sphere. A holy land for the Techno-religious movement and the land associated with the Temple of Horizon and Temirlaton. Remnants of the Bird Empire era remain, making it an important base for military history research. Psychedelic Cosmology training facilities stand in the surrounding area.",
  },{
    id: "テスラ地区" as WikiId,
    name: "テスラ地区",
    nameEn: "Tesla District",
    category: "地理",
    subCategory: "西大陸都市",
    description:
      "Gigapolis南部に位置する労働者層の居住区。ZAMLT支配下ではA-Registryの低階級市民が密集し、深刻な貧困と権利制限に苦しんだ地域である。アルファ・ケインもこの地区で育ち、スティル・アレーナへの参加を経てZAMLTに対する反乱を主導する原動力となった。テスラ地区の過酷な生活環境は、シャドウ・リベリオン結成の直接的な要因であり、ZAMLT期の社会格差を象徴する地域として歴史に記録されている。ギガポリス解放戦後も低所得層の居住区として機能しているが、テクノ文化ルネサンス期以降は徐々に再開発が進んでいる。",
    descriptionEn:
      "A residential area for the working class located in southern Gigapolis. Under ZAMLT rule, low-class citizens of the A-Registry were densely packed, a region that suffered severe poverty and rights restrictions. Alpha Kane was also raised in this district, and after participating in the Still Arena, it became the driving force leading the rebellion against ZAMLT. The harsh living environment of the Tesla District was a direct cause for the formation of the Shadow Rebellion and is recorded in history as a region symbolizing the social inequality of the ZAMLT era. Even after the Gigapolis Liberation War, it continues to function as a residential area for low-income groups, but redevelopment has gradually progressed since the Techno-Cultural Renaissance period.",
  },{
    id: "大広場" as WikiId,
    name: "大広場",
    nameEn: "Grand Square",
    category: "地理",
    subCategory: "施設・建造物",
    description:
      "Gigapolis中心部に位置する広大な広場であり、スティル・アレーナが開催される伝統的な闘技場である。ネオンコロシアムとしても知られ、次元極地平技術を応用した安全装置により実戦級の戦闘ながら参加者の命を守る仕組みが組み込まれている。各国家や組織が代表する戦士たちが独自の戦闘スタイルと技術を披露し、その結果によって軍事的階位や外交的な発言力が決定される。ボグダス・ジャベリンのテクロサス系譜の戦士たちは常連であり、その圧倒的な実力で他国の参加者を圧倒してきた。V7とトリニティ・アライアンスの対立が深まる中、大広場でのスティル・アレーナは両陣営の緊張を緩和する場としての役割も担っている。観客席は最大50万人を収容可能で、次元ホログラム技術による臨場感のある中継システムを完備。",
    descriptionEn:
      "A vast plaza located in the center of Gigapolis, a traditional colosseum where the Still Arena is held. Also known as the Neon Colosseum, it incorporates safety devices applying dimensional pole technology, allowing实战-level combat while protecting participants' lives. Warriors representing various nations and organizations showcase their unique combat styles and techniques, with results determining military rank and diplomatic influence. Warriors of the Bogdas Javelin's Techlosus lineage are regulars, overwhelming participants from other countries with their overwhelming strength. As the conflict between V7 and the Trinity Alliance deepens, the Still Arena in the grand plaza also serves as a venue to ease tensions between the two factions. The spectator seats can accommodate up to 500,000 people and are equipped with an immersive broadcasting system using dimensional hologram technology.",
  },{
    id: "ZAMLT本部" as WikiId,
    name: "ZAMLT本部",
    nameEn: "ZAMLT Headquarters",
    category: "地理",
    subCategory: "施設・建造物",
    description:
      "Gigapolis中心部に聳え立つZAMLTの本拠地。ホログラムと光の層で覆われた壮麗な外観を持ち、最上階には「アイヴォリールーム（象牙の間）」と呼ばれる最高決議室が設置されていた。楕円形の巨大テーブルを中心にZAMLT5社のリーダーたちが着席し、E16連星系の経済と政治を動かす極秘の意思決定が行われた。本社最深部には次元の塔（Dimensional Tower）とカタリスト・コアが建造され、ZAMLTの次元技術の核心が隠されていた。E318年のギガポリス解放戦でアルファ・ケインによって占拠され、ZAMLTの資産の30%が低階層コミュニティに移転される歴史的転換点となった。現在はZAMLT期の遺構として保存され、一部は歴史博物館として活用されている。",
    descriptionEn:
      "ZAMLT's headquarters standing in the center of Gigapolis. It has a magnificent exterior enveloped in holograms and layers of light, with the top floor featuring the \"Ivory Room,\" the highest decision-making chamber. Around an enormous elliptical table, the leaders of ZAMLT's five corporations sat, making secret decisions that moved the economy and politics of the E16 star system. In the deepest part of the headquarters, the Dimensional Tower and Catalyst Core were constructed, hiding the core of ZAMLT's dimensional technology. During the Gigapolis Liberation War in E318, it was occupied by Alpha Kane, becoming a historic turning point where 30% of ZAMLT's assets were transferred to low-level communities. Currently preserved as a relic of the ZAMLT era, part of it is utilized as a history museum.",
  },{
    id: "虚無の塔" as WikiId,
    name: "虚無の塔",
    nameEn: "Tower of Void",
    category: "地理",
    subCategory: "施設・建造物",
    description:
      "Gigapolis外周部に秘密裏に建造された次元の特異点を内包する塔。ZAMLT5社のトップとEVILSのリーダーであるオメガ＝ユリシスが秘密会合を持った場所であり、次元の塔を通じた取引が行われた。EVILSは通常の物理法則を超越した存在であり、虚無の塔はその次元間接触の唯一の安定ポイントとして機能した。次元の荒野での最終決戦では、アルファ・ケインが伴共役（Ban-Kyōyaku）能力によってオメガ＝ユリシスを次元の繊維に封印し、EDU宇宙論における次元干渉の限界と可能性を示す出来事となった。虚無の塔の正確な位置と構造はZAMLTの最高機密であり、崩壊後も完全な解明には至っていない。",
    descriptionEn:
      "A tower secretly constructed in the outer perimeter of Gigapolis, containing a dimensional singularity. It was where the leaders of ZAMLT's five corporations and Omega=Ullysis, the leader of EVILS, held secret meetings, and transactions were conducted through the Tower of Dimensions. EVILS were beings that transcended normal physical laws, and the Tower of Emptiness functioned as the only stable point for their interdimensional contact. In the final battle in the dimensional wilderness, Alpha Kane used his Ban-Kyōyaku ability to seal Omega=Ullysis in the dimensional fabric, an event that demonstrated the limits and possibilities of dimensional interference in EDU cosmology. The exact location and structure of the Tower of Emptiness were ZAMLT's top secret, and even after its collapse, it has not been completely elucidated.",
  },{
    id: "シルバープラント" as WikiId,
    name: "シルバープラント",
    nameEn: "Silver Plant",
    category: "地理",
    subCategory: "施設・建造物",
    description:
      "ZAMLTの最重要軍事施設であり、地上10階・地下10階の複雑な構造を持つ巨大複合体。プロトコルXのエネルギーコアが保管され、ZAMLTの次元技術と軍事力の核心が集約されていた。アルファ・ケインとテクロサスの戦士たちによるシルバープラント攻略戦は、ギガポリス解放戦の転換点となった決戦である。ルレンツ・コーポレーションの研究員リンダが、プロトコルXのエネルギーコアの暴走を安定化させるために自らを犠牲にした悲劇の舞台でもある。リンダの自己犠牲はシャドウ・リベオンの士気を大きく高め、ZAMLT内部でも反体制感情の広がる転換点となった。崩壊後は一部が解体されたが、地下構造の大部分は未踏査のまま残されている。",
    descriptionEn:
      "The most important military facility of ZAMLT, a massive complex with a complex structure of 10 floors above ground and 10 floors below. The energy core of Protocol X was stored here, and the core of ZAMLT's dimensional technology and military power was concentrated. The Silver Plant assault by Alpha Kane and the warriors of Texus was the decisive battle that became the turning point of the Gigapolis Liberation War. It was also the tragic stage where Linda, a researcher of the Lorentz Corporation, sacrificed herself to stabilize the runaway energy core of Protocol X. Linda's self-sacrifice greatly boosted the morale of the Shadow Rebellion and became a turning point that spread anti-establishment sentiment even within ZAMLT. After its collapse, part of it was dismantled, but most of the underground structure remains unexplored.",
  },{
    id: "geo-ビブリオ第2衛星ルナ" as WikiId,
    name: "ビブリオ第2衛星ルナ",
    nameEn: "Luna — Second Moon of Biblio",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "惑星ビブリオの第2衛星で、ビブリオの夜空に最も明るく輝く銀白色の天体である。直径は約2,800キロメートルで、表面には酸素含有鉱物の豊富な鉱脈が確認されており、E16連星系における重要な資源採掘拠点として機能している。ルナにはE80年頃に最初の観測基地が建設され、技術啓蒙時代には大規模な鉱業コロニーが建設された。現在では惑星ビブリオのロレンツィオ国際大学の天体物理学観測所が設置され、Ea16およびEb16の活動監視を行っている。ルナの名は地球の月に因んでおり、初期入植者の郷愁を反映した命名である。ビブリオとルナの間は定期的なシャトル輸送が運行し、学術研究者と鉱業技術者の行き来が盛んである。",
    descriptionEn:
      "The second satellite of the planet Biblio, the brightest silvery celestial body in Biblio's night sky. With a diameter of approximately 2,800 kilometers, its surface contains rich veins of oxygen-containing minerals, functioning as an important resource extraction base in the E16 binary star system. The first observation base was constructed on Luna around E80, and during the Enlightenment Era, a large-scale mining colony was built. Currently, the astrophysics observatory of the Lorenz International University of the planet Biblio is installed here, monitoring the activities of Ea16 and Eb16. The name Luna is derived from Earth's moon, reflecting the nostalgia of the early settlers. Regular shuttle services operate between Biblio and Luna, with academic researchers and mining technicians frequently traveling between them.",
  },{
    id: "geo-Solaris第3衛星ヘリオス" as WikiId,
    name: "Solaris第3衛星ヘリオス",
    nameEn: "Helios — Third Moon of Solaris",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "惑星Solarisの第3衛星で、Offenbach種の生態系を支える熱源の一つとして重要な役割を果たしている。ヘリオスの地表には活発な地熱活動が存在し、地表温度は摂氏200度を超える区域が広がる極端な環境を形成している。この熱エネルギーは潮汐加熱によってもたらされ、Solaris地下のOffenbach種コロニーに必要な熱源を間接的に供給している。ヘリオスの軌道はSolarisに対して楕円形であり、近日点通過時の地熱活動はOffenbach種の繁殖サイクルと同期していると仮説が立てられている。E16文明圏ではヘリオスをOffenbach種の「生命の炉」と呼び、この衛星の研究がOffenbach種理解の鍵と見なされている。Ninny Offenbachの原初個体が離脱した際のエネルギー放出はヘリオスの地熱活動に影響を与えた可能性がある。",
    descriptionEn:
      "The third satellite of the planet Solaris, playing a vital role as one of the heat sources supporting the ecosystem of the Offenbach species. Helios's surface has active geothermal activity, forming an extreme environment where surface temperatures exceed 200°C over wide areas. This thermal energy is brought about by tidal heating, indirectly supplying the heat source needed by the Offenbach species colony beneath Solaris. Helios's orbit is elliptical relative to Solaris, and it is hypothesized that the geothermal activity at perihelion passage synchronizes with the reproductive cycle of the Offenbach species. In the E16 civilization sphere, Helios is called the \"furnace of life\" for the Offenbach species, and research on this satellite is considered key to understanding the Offenbach species. The energy release when Ninny Offenbach's original individual departed may have affected Helios's geothermal activity.",
  },{
    id: "geo-E16第4惑星クリオ" as WikiId,
    name: "E16第4惑星クリオ",
    nameEn: "Clio — Fourth Planet of E16",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "E16連星系の第4軌道に位置する大型ガス惑星で、木星型惑星に分類される。直径はシンフォニー・オブ・スターズの約4.5倍に達し、主成分は水素とヘリウムである。クリオの大気層には豊富なヘリウム3が含まれており、核融合エネルギーの燃料供給源としてE16連星系のエネルギー安全保障に不可欠な存在となっている。クリオには63個の既知衛星が存在し、そのうち12個は直径500キロメートル以上の大型衛星である。E150年のギガポリス建設開始と同時に大規模なヘリウム3採掘施設がクリオ上層大気に建設され、現在では数十万人の作業員が浮遊プラットフォームで活動している。クリオの名はギリシャ神話の記録の女神ムーサに因み、歴史的記録を重んじるE16文明圏の精神を反映している。",
    descriptionEn:
      "A large gas planet located in the 4th orbit of the E16 binary star system, classified as a Jupiter-type planet. Its diameter reaches about 4.5 times that of the Symphony of Stars, and its main components are hydrogen and helium. The atmosphere of Clio contains abundant helium-3, making it an indispensable existence for the energy security of the E16 binary star system as a fuel supply source for fusion energy. Clio has 63 known satellites, 12 of which are large satellites with a diameter of 500 kilometers or more. Along with the start of Gigapolis construction in E150, large-scale helium-3 mining facilities were constructed in Clio's upper atmosphere, and now hundreds of thousands of workers operate on floating platforms. The name Clio is derived from the goddess of record in Greek mythology, reflecting the spirit of the E16 civilization sphere that values historical records.",
  },{
    id: "geo-E16第5惑星テラ・ノヴァ" as WikiId,
    name: "E16第5惑星テラ・ノヴァ",
    nameEn: "Terra Nova — Fifth Planet of E16",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "E16連星系の第5軌道に位置する氷の巨星で、海王星型惑星に分類される。テラ・ノヴァ（新しい大地）の名称は、入植初期に居住可能惑星として期待されたが、実際は表面温度が摂氏マイナス200度に達する極寒の世界であることが判明したという歴史的経緯に由来する。しかしテラ・ノヴァの厚い氷層の下には液体の水の海が存在すると推測され、未知の微生物生態系の可能性が指摘されている。E400年頃にエヴァトロンがテラ・ノヴァの地下海に極秘の軍事研究基地を建設したとされる噂があり、現在もUECOによる調査が続いている。テラ・ノヴァのリング構造は青白色のメタンベースの氷で構成され、E16連星系内で最も美しい天体の一つとして天文学者に親しまれている。",
    descriptionEn:
      "An ice giant located in the 5th orbit of the E16 binary star system, classified as a Neptune-type planet. The name Terra Nova (New Earth) originates from the historical background that it was expected to be a habitable planet in the early settlement period, but it turned out to be an extremely cold world with surface temperatures reaching -200°C. However, it is speculated that beneath Terra Nova's thick ice layers there are seas of liquid water, and the possibility of unknown microbial ecosystems has been pointed out. It is rumored that Evatron secretly built a military research base in the underground ocean of Terra Nova around E400, and investigations by UECO continue to this day. The ring structure of Terra Nova is composed of blue-white methane-based ice, and it is beloved by astronomers as one of the most beautiful celestial bodies in the E16 binary star system.",
  },{
    id: "geo-E16小惑星帯ガイア・リング" as WikiId,
    name: "E16小惑星帯ガイア・リング",
    nameEn: "Gaia Ring — E16 Asteroid Belt",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "E16連星系の第5惑星テラ・ノヴァと第6惑星の軌道間に広がる広大な小惑星帯で、数十万個の小天体が密集している。ガイア・リング（大地の輪）の名称は、これらの小天体に豊富なレアメタルと水資源が含まれ、E16文明圏の資源供給の要であることに由来する。小惑星帯の一部にはE60年頃から採掘コロニーが建設され、暗黒時代を生き抜いた入植者たちが資源採掘で生計を立てていた。現在ではアステロイド・マイニング・プラットフォームが複数稼働し、レアメタルの採掘量はE16連星系の年間消費量の約30%を賄っている。ガイア・リング内の通信中継ステーションはSSレンジの技術によって管理され、小惑星帯の安全な航行を支援している。",
    descriptionEn:
      "A vast asteroid belt stretching between the orbits of the 5th planet Terra Nova and the 6th planet in the E16 binary star system, where hundreds of thousands of small celestial bodies are densely packed. The name Gaia Ring (Ring of the Earth) comes from the fact that these small bodies contain abundant rare metals and water resources, making them a vital resource supply for the E16 civilization sphere. Mining colonies began to be constructed in parts of the asteroid belt around E60, and settlers who survived the Dark Ages made a living by resource extraction. Currently, multiple Asteroid Mining Platforms are in operation, and the amount of rare metals mined accounts for about 30% of the annual consumption of the E16 binary star system. Communication relay stations within the Gaia Ring are managed by SS Range technology, supporting safe navigation through the asteroid belt.",
  },{
    id: "geo-ビブリオ首都アカデミア" as WikiId,
    name: "ビブリオ首都アカデミア",
    nameEn: "Academia — Capital of Biblio",
    category: "地理",
    subCategory: "都市",
    description:
      "惑星ビブリオの首都にして、E16連星系における学術研究の最高峰都市。アカデミア市内にはロレンツィオ国際大学の本部キャンパスをはじめ、200以上の研究機関と50以上の図書館が集中している。都市の建築様式は古代ギリシャのアカデメイアを模しており、白大理石の柱廊と広大な中庭が特徴的である。A-Registryの最高等級記録館もアカデミアに置かれ、E16文明圏の全歴史文書と市民データのバックアップが厳重に保管されている。常時約50万人の研究者と学生が居住し、知識の自由な流通と学際的な研究協力を都市運営の最高理念として掲げている。テクノ文化ルネサンス期には次元極地平技術の民用化研究拠点として機能し、ホライゾン・ゲートの安定化制御技術はアカデミアで開発された。",
    descriptionEn:
      "The capital of the planet Biblio and the pinnacle city of academic research in the E16 binary star system. Academia City houses the main campus of the Lorenz International University, as well as over 200 research institutions and more than 50 libraries. The city's architectural style imitates the ancient Greek Academy, characterized by white marble colonnades and vast courtyards. The highest-level archive of the A-Registry is also located in Academia, where all historical documents and citizen data of the E16 civilization sphere are strictly preserved. Approximately 500,000 researchers and students reside here at all times, and the city's highest ideals are the free flow of knowledge and interdisciplinary research cooperation. During the Techno-Cultural Renaissance, it functioned as a research base for the civilian application of dimensional horizon technology, and the stabilization control technology for Horizon Gates was developed in Academia.",
  },{
    id: "geo-ビブリオ港町ポート・ロレンツィオ" as WikiId,
    name: "ビブリオ港町ポート・ロレンツィオ",
    nameEn: "Port Lorenzio — Harbor Town of Biblio",
    category: "地理",
    subCategory: "都市",
    description:
      "惑星ビブリオ最大の宇宙港都市で、星系間交通の主要拠点として機能する。ポート・ロレンツィオはビブリオの南半球に位置し、年間数万隻の宇宙船が寄港するE16連星系有数の物流ハブである。都市名はロレンツィオ国際大学の創設者に因んでいる。港湾地区には巨大なドッキングベイと貨物処理施設が広がり、学術資材や研究機器の輸送が日々行われている。またポート・ロレンツィオは異星文化の交流拠点でもあり、グランベルやティエリアなど他文明圏からの研究者受け入れ施設が整備されている。市内の「知識の市場」では稀有な文献や研究データが取引され、学術的価値を持つ情報の流通拠点として知られている。",
    descriptionEn:
      "The largest spaceport city on the planet Biblio, functioning as a major hub for interstellar transportation. Port Lorenzio is located in the southern hemisphere of Biblio and is one of the few logistics hubs in the E16 binary star system where tens of thousands of spaceships dock annually. The city is named after the founder of the Lorenz International University. The harbor area features enormous docking bays and cargo handling facilities, where academic materials and research equipment are transported daily. Port Lorenzio is also a hub for interstellar cultural exchange, with facilities to receive researchers from other civilization spheres such as Granbel and Tierra. The \"Market of Knowledge\" in the city is known as a trading place for rare literature and research data, serving as a distribution point for information with academic value.",
  },{
    id: "geo-Solaris首都ソーラ・シティ" as WikiId,
    name: "Solaris首都ソーラ・シティ",
    nameEn: "Solar City — Capital of Solaris",
    category: "地理",
    subCategory: "都市",
    description:
      "惑星Solarisの地下に建設された唯一の恒久都市で、Offenbach種の集合意識との接触拠点として機能している。ソーラ・シティの人口は約2万人で、大部分がOffenbach種の研究者と人類の倫理学者で構成されている。都市の中心には「離脱のモニュメント」と呼ばれる記念碑が建てられ、Ninny Offenbachの原初個体が集合意識から独立した歴史的瞬間を記念している。ソーラ・シティのエネルギー供給は衛星ヘリオスの地熱発電に依存し、地下深部の熱導管システムによって都市全体に暖房と電力が提供されている。都市は厳格な環境保護区域に指定されており、Offenbach種の生態系への影響を最小限に抑える設計が採用されている。",
    descriptionEn:
      "The sole permanent city constructed beneath the planet Solaris, functioning as a contact point with the collective consciousness of the Offenbach species. Solar City has a population of approximately 20,000, mostly consisting of Offenbach researchers and human ethicists. At the city's center stands the \"Monument of Departure,\" commemorating the historical moment when Ninny Offenbach's original individual became independent from the collective consciousness. Solar City's energy supply relies on geothermal power from the satellite Helios, with heating and electricity provided to the entire city through a deep underground heat conduction system. The city is designated as a strict environmental protection zone, employing designs that minimize impact on the Offenbach species' ecosystem.",
  },{
    id: "geo-Solaris工業都市フォージ・タウン" as WikiId,
    name: "Solaris工業都市フォージ・タウン",
    nameEn: "Forge Town — Industrial City of Solaris",
    category: "地理",
    subCategory: "都市",
    description:
      "惑星Solarisの地下熱源を利用した大規模な工業都市で、特殊合金とセラミック材料の製造拠点として機能している。フォージ・タウン（鍛冶の町）は地熱エネルギーを直接工業プロセスに利用することができ、従来の工業都市に比べてエネルギーコストが大幅に低い。都市の工業地帯では、E16連星系の軍事装備や宇宙船の部品製造の約20%を担っており、アイアン・シンジケートとも競合する生産能力を持つ。Offenbach種の熱耐性技術を応用した特殊な溶接・鍛造技術が発達しており、極端な温度条件に耐える超耐熱材料の生産で星系一の技術力を誇る。労働者の大部分はシンフォニー・オブ・スターズからの移住者であるが、Offenbach種との協働生産も一部導入されている。",
    descriptionEn:
      "A massive industrial city utilizing the underground heat sources of the planet Solaris, functioning as a manufacturing hub for special alloys and ceramic materials. Forge Town can utilize geothermal energy directly in industrial processes, resulting in significantly lower energy costs compared to traditional industrial cities. The city's industrial zone handles approximately 20% of the military equipment and spaceship parts manufacturing for the E16 star system, possessing production capabilities that compete with the Iron Syndicate. Specialized welding and forging technologies, applying the heat resistance technology of the Offenbach species, have developed, boasting the star system's foremost technical capability in producing ultra-heat-resistant materials that withstand extreme temperature conditions. While most workers are immigrants from the Symphony of Stars, some collaborative production with the Offenbach species has also been introduced.",
  },{
    id: "geo-エレシオン聖都ヒエロポリス" as WikiId,
    name: "エレシオン聖都ヒエロポリス",
    nameEn: "Hieropolis — Holy City of Elyseon",
    category: "地理",
    subCategory: "都市",
    description:
      "エレシオンの首都にして「生命の聖都」と呼ばれる医療・宗教の中心都市。ヒエロポリス（聖なる都市）はエレシオンの第1大陸に位置し、女王リアナ・ソリスの王宮とエレシオン最高医療評議会の本部が置かれている。都市の中心には「生命の大聖堂」が聳え立ち、エレシオンの「生命の維持と再生」の理念を象徴している。ヒエロポリスは宇宙最高水準の医療施設を擁し、再生医療、遺伝子治療、寿命延長技術の研究拠点として他文明圏からも治療目的で訪れる者が絶えない。都市の建築は白と金を基調とし、エレシオンの平和主義と技術共有の理念を反映した清潔で秩序ある都市景観を持つ。フェルミ音楽の精神論的解釈を深く研究する学派もヒエロポリスに拠点を置いている。",
    descriptionEn:
      "The capital of Elesion and a medical and religious center city known as the \"Holy City of Life.\" Hieropolis is located on the first continent of Elesion, housing Queen Riana Solis's palace and the headquarters of the Elesion Supreme Medical Council. At the city's center stands the \"Cathedral of Life,\" symbolizing Elesion's philosophy of \"Life Maintenance and Regeneration.\" Hieropolis possesses the highest standard of medical facilities in the cosmos, serving as a research hub for regenerative medicine, genetic therapy, and life extension technology, attracting visitors from other civilizations for treatment purposes. The city's architecture is based on white and gold, reflecting Elesion's philosophy of pacifism and technological sharing with a clean and orderly urban landscape. A school deeply studying the philosophical interpretation of Fermi music also has its base in Hieropolis.",
  },{
    id: "geo-グランベル商都マーケット・コア" as WikiId,
    name: "グランベル商都マーケット・コア",
    nameEn: "Market Core — Commercial Capital of Granbell",
    category: "地理",
    subCategory: "都市",
    description:
      "グランベル最大の商業都市にして宇宙経済の心臓部。マーケット・コアはグランベルの首都オルダシティの隣接区域に位置し、宇宙最大の取引所と金融センターを擁する。日々数百兆nトークン相当の取引が行われ、宇宙全体の物価と通貨の基準価格がここで決定される。マーケット・コアの中央には「グランベル・エクスチェンジ」と呼ばれる超巨大取引所があり、グランベルの量子経済システムを通じてリアルタイムで全文明圏の市場と接続している。都市のスカイラインは次元間通信アンテナとホログラム広告で埋め尽くされ、昼夜を問わず活気に満ちている。GDP150兆ドルのグランベル経済を支える中核都市であり、銀河系コンソーシアムの経済政策の実行拠点でもある。",
    descriptionEn:
      "The largest commercial city of Granbell and the heart of the cosmic economy. Market Core is located in the adjacent area of Granbell's capital, Oldacity, housing the universe's largest exchange and financial center. Transactions worth hundreds of trillions of n-tokens take place daily, with the standard prices for goods and currencies across the cosmos determined here. At the center of Market Core stands the \"Granbell Exchange,\" a super-huge exchange that connects in real-time with markets of all civilizations through Granbell's quantum economic system. The city's skyline is filled with interdimensional communication antennas and holographic advertisements, bustling with activity day and night. As the core city supporting Granbell's economy with a GDP of 150 trillion dollars, it is also the execution base for the economic policies of the Galactic Consortium.",
  },{
    id: "geo-ディオクレニス首都ノウス" as WikiId,
    name: "ディオクレニス首都ノウス",
    nameEn: "Nous — Capital of Dioclenis",
    category: "地理",
    subCategory: "都市",
    description:
      "ディオクレニスの首都にして宇宙探査と科学技術研究の中心都市。ノウス（知性）の名称通り、知識の探求を最高の都市理念として掲げ、科学宰相ネイサン・コリンドの研究拠点が置かれている。都市全体が巨大な研究キャンパスのような構造を持ち、天文学、次元物理学、異種文明学の最先端施設が集中している。ノウスの中央には「無限の図書館」と呼ばれる次元記憶貯蔵施設があり、宇宙のあらゆる分野の知識が次元符号化されて保存されている。ディオクレニスの探査船団の発進基地もノウスに隣接し、新たな惑星系への探査ミッションが常時企画されている。ヘゲモニー・パラドックス回避のため、対立のエネルギーを共同宇宙探査へ転換する提案の発信地でもある。",
    descriptionEn:
      "The capital of Dioclenis and a center city for cosmic exploration and scientific and technological research. True to its name, Nous (Knowledge), it upholds the pursuit of knowledge as its highest urban ideal, housing the research base of Science Minister Nathan Corrin. The entire city has the structure of a massive research campus, with cutting-edge facilities in astronomy, dimensional physics, and xenocivilization studies concentrated at its center. At the heart of Nous stands the \"Library of Infinity,\" a dimensional memory storage facility where knowledge from all fields of the cosmos is preserved through dimensional encoding. The launch base for Dioclenis's exploration fleet is also adjacent to Nous, with new planetary system exploration missions constantly being planned. It is also the origin of proposals to convert the energy of conflict into joint cosmic exploration, in order to avoid the Hegemony Paradox.",
  },{
    id: "geo-ティレリア海上都市フローティング・ハーバー" as WikiId,
    name: "ティレリア海上都市フローティング・ハーバー",
    nameEn: "Floating Harbor — Ocean City of Tyeria",
    category: "地理",
    subCategory: "都市",
    description:
      "ティレリア最大の軍港都市で、宇宙最大の艦隊母港として機能する。フローティング・ハーバー（浮遊する港）はティレリアの第3大陸の沖合に建設された巨大な海上都市であり、数千隻の軍艦を停泊させることができる。都市の構造は数百の浮遊プラットフォームで構成され、波浪と潮汐に応じて動的に位置を調整する独自の安定化システムを採用している。ティエリア総帥グレイモンド・ハウザーの軍事司令部の一部がフローティング・ハーバーに置かれ、艦隊の運用指揮と軍事技術の輸出管理が行われている。都市の防御は宇宙随一の防衛システムで守られ、他勢力の軍事的脅威から艦隊を保護している。軍事技術の輸出を経済基盤とするティエリアにとって、フローティング・ハーバーは国家の生命線である。",
    descriptionEn:
      "The largest military port city of Tilleria and the universe's largest fleet home port. Floating Harbor is a massive maritime city constructed off the coast of Tilleria's third continent, capable of docking thousands of warships. The city's structure consists of hundreds of floating platforms, employing a unique stabilization system that dynamically adjusts positions in response to waves and tides. Part of the military command of Tilleria's Supreme Commander Graymond Hauser is located in Floating Harbor, where fleet operations and military technology export management are conducted. The city is protected by the cosmos's foremost defense system, safeguarding the fleet from military threats from other powers. For Tilleria, which exports military technology as its economic foundation, Floating Harbor is the nation's lifeline.",
  },{
    id: "geo-ファルージャ砂漠都市オアシス・ハブ" as WikiId,
    name: "ファルージャ砂漠都市オアシス・ハブ",
    nameEn: "Oasis Hub — Desert City of Fallujah",
    category: "地理",
    subCategory: "都市",
    description:
      "ファルージャの首都にして宇宙有数の文化交流都市。オアシス・ハブはファルージャ最大の砂漠の中央に位置する緑地都市であり、高度な水資源管理技術によって砂漠の真ん中に豊かな生態系を創出している。都市の中心には「文化の泉」と呼ばれる広大な公園があり、全宇宙からの芸術家、音楽家、外交官が集う交流の場となっている。ファルージャ評議会代表マドリス・カーネルの外交拠点もオアシス・ハブに置かれ、対立する勢力間の調停の場として頻繁に使用されている。オアシス・ハブはフェルミ音楽の精神論的解釈と宇宙の多元的な芸術表現の融合拠点としても知られ、毎年「砂漠の星間フェスティバル」が開催されて宇宙中から観光客を集めている。",
    descriptionEn:
      "The capital of Faluja and one of the cosmos's foremost cultural exchange cities. Oasis Hub is a green city located in the center of Faluja's largest desert, creating a rich ecosystem in the middle of the desert through advanced water resource management technology. At the city's center lies the vast \"Cultural Spring\" park, which has become a gathering place for artists, musicians, and diplomats from across the cosmos. The diplomatic base of Faluja Council Representative Madris Carnell is also located in Oasis Hub, frequently used as a venue for mediating between opposing forces. Oasis Hub is also known as a fusion hub for the philosophical interpretation of Fermi music and the diverse artistic expressions of the cosmos, hosting the annual \"Desert Intersellar Festival\" that attracts tourists from across the universe.",
  },{
    id: "geo-ギガポリス第8区画イーストエンド" as WikiId,
    name: "ギガポリス第8区画イーストエンド",
    nameEn: "East End — District 8 of Gigapolis",
    category: "地理",
    subCategory: "都市",
    description:
      "Gigapolis東部に位置する第8区画で、新興産業と多国籍企業の拠点として機能している。イーストエンドはテクノ文化ルネサンス期に急速に発展した比較的新しい地区で、次元極地平技術を応用したスタートアップ企業が多数集積している。地区の建築はガラスと次元ホログラムを多用した未来的なデザインで統一され、Gigapolisの他地区とは異なる国際的な景観を持つ。イーストエンドにはリミナル・フォージの拠点も置かれており、ミナ・エウレカ・エルンストのAI研究活動の舞台となっている。V7とトリニティ・アライアンスの情報戦の最前線でもあり、SSレンジの通信中継施設とシルバー・ヴェノムの潜入工作が交錯する緊張の地域である。第8区画の住民は他地区に比べて若年層が多く、革新的な文化の発信地として注目されている。",
    descriptionEn:
      "District 8, located in eastern Gigapolis, functioning as a hub for emerging industries and multinational corporations. East End is a relatively new district that developed rapidly during the Techno Cultural Renaissance period, with numerous startup companies applying dimensional polar horizon technology. The district's architecture is unified with a futuristic design using extensive glass and dimensional holograms, possessing an international landscape distinct from other areas of Gigapolis. East End also houses the base of Liminal Forge, serving as the stage for AI research activities by Mina Eureka Ernst. It is also the frontline of the information war between V7 and the Trinity Alliance, where SS Range's communication relay facilities and Silver Venom's infiltration operations intersect in a tense region. The residents of District 8 are younger compared to other districts, and it is gaining attention as a source of innovative culture.",
  },{
    id: "geo-ウェスト・エンド" as WikiId,
    name: "ウェスト・エンド",
    nameEn: "West End",
    category: "地理",
    subCategory: "都市",
    description:
      "Gigapolis西部に位置する高級住宅・商業地区で、A-Registryの高階級市民が居住するE16連星系屈指の富裕地域である。ウェスト・エンドの建築は古典主義と次元技術を融合した壮麗なデザインで統一され、大企業の本社ビルや高級商業施設が林立している。地区の中心には「ウェスト・ガーデン」と呼ばれる広大な庭園都市があり、人工的に制御された四季折々の景観が楽しめる。ZAMLT期には5大企業の幹部邸宅が集中し、経済覇権の象徴的な地区であった。エヴァトロン支配期には軍の将校宿舎として接収されたが、崩壊後は民間に返還され再開発が進んだ。現在ではグランベル系企業の駐在員や銀河系コンソーシアムの外交官が多く居住し、国際色豊かな地区となっている。",
    descriptionEn:
      "A high-end residential and commercial district located in western Gigapolis, it is one of the wealthiest regions in the E16 star system, home to high-class citizens of the A-Registry. The architecture of West End is unified in a magnificent design that blends classicism with dimensional technology, with corporate headquarters and luxury commercial facilities standing in abundance. At the center of the district lies \"West Garden,\" a vast garden city where artificially controlled seasonal landscapes can be enjoyed. During the ZAMLT era, it was concentrated with the mansions of the five major corporations' executives, serving as a symbolic district of economic hegemony. During the Evatron dominion period, it was requisitioned as military officer quarters, but after the collapse, it was returned to civilian hands and redevelopment progressed. Currently, it is home to many resident employees of Granbel system corporations and diplomats from the Galactic Consortium, making it a district rich in international character.",
  },{
    id: "geo-ノース・サイド" as WikiId,
    name: "ノース・サイド",
    nameEn: "North Side",
    category: "地理",
    subCategory: "都市",
    description:
      "Gigapolis北部に位置する軍事・防衛地区で、テクロサス系譜の歴史的な根拠地である。ノース・サイドはロンバルディア戦争（E88〜E98年）の際に前線基地として機能し、城塞都市ロンヴと連携して北からの侵入に備えた。現在でも軍事博物館と旧要塞跡が残り、テクロサス系譜の軍事伝統を伝える地域として機能している。ボグダス・ジャベリンのセバスチャン・ヴァレリウスはノース・サイドに師団本部を置き、V7とトリニティ・アライアンスの冷戦期には最前線防衛拠点として機能した。地区の住民には軍人と退役軍人が多く、テクロサス系譜の戦闘訓練施設が複数存在する。ノース・サイドの北端には旧帝国時代の城壁が残り、Gigapolis最古の構造物の一つとして文化財指定されている。",
    descriptionEn:
      "A military and defense district located in northern Gigapolis, it is the historical stronghold of the Teclosas lineage. North Side functioned as a frontline base during the Lombardia War (E88-E98), coordinating with the fortress city of Ronve to defend against northern incursions. Even now, military museums and old fortress ruins remain, serving as a region that preserves the military tradition of the Teclosas lineage. Bogdas Javelin's Sebastian Valerius established his division headquarters in North Side, and during the Cold War between V7 and the Trinity Alliance, it functioned as a frontline defense stronghold. The district's residents include many soldiers and veterans, and multiple combat training facilities of the Teclosas lineage exist. At the northern tip of North Side, the city walls of the old imperial era remain, designated as a cultural asset as one of Gigapolis' oldest structures.",
  },{
    id: "geo-サウス・マーケット" as WikiId,
    name: "サウス・マーケット",
    nameEn: "South Market",
    category: "地理",
    subCategory: "都市",
    description:
      "Gigapolis南部に位置する大規模な商業・市場地区で、西大陸の物流と流通の心臓部として機能している。サウス・マーケットには数千の店舗と市場が密集し、食料、衣料、電子機器、武器まであらゆる商品が取引されている。E150年のマーストリヒト革命後の自由経済化で急速に発展し、現在ではGigapolisのGDPの約15%をこの地区単独で産出している。サウス・マーケットはnトークンの現実経済での使用が最も活発な地区であり、文化的貢献や知識の共有も取引対象となる独特な市場文化が根付いている。スライム危機時にはサウス・マーケットの地下倉庫にスライムの巣が形成され、アンダーグリッド経由での制圧作戦が展開された。現在は安全対策が強化され、テクノ文化ルネサンスの恩恵を受けてホログラム広告と次元ホール接続ロビーが整備されている。",
    descriptionEn:
      "A large-scale commercial and market district located in southern Gigapolis, functioning as the heart of logistics and distribution for the western continent. South Market has thousands of shops and markets densely packed, with all kinds of goods traded from food, clothing, electronics, to weapons. It developed rapidly after the liberalization of the free economy following the Maastricht Revolution in E150, and now this single district generates approximately 15% of Gigapolis' GDP. South Market is the district where the use of n-tokens in the real economy is most active, with a unique market culture rooted in cultural contributions and knowledge sharing also becoming trading objects. During the Slime Crisis, slimes formed nests in the underground warehouses of South Market, and a suppression operation via the Undergrid was launched. Currently, safety measures have been strengthened, and it has benefited from the Techno-Cultural Renaissance, with holographic advertisements and dimensional hall connection lobbies being installed.",
  },{
    id: "geo-テック・コリドー" as WikiId,
    name: "テック・コリドー",
    nameEn: "Tech Corridor",
    category: "地理",
    subCategory: "都市",
    description:
      "Gigapolis中心部から東部に延びる技術産業ベルトで、E16連星系の技術革新の最先端拠点である。テック・コリドーには次元極地平技術、量子計算、ナノテクノロジー、AI開発などのハイテク企業と研究機関が密集している。ZAMLT期にはトロン・コーポレーションの研究開発拠点がテック・コリドーの中心に位置し、次元エネルギーの兵器化が進められていた。ギガポリス解放戦後は平和利用の技術開発に転換し、テクノ文化ルネサンス期には次元ホールの民用化プロジェクトがテック・コリドーで実現した。現在ではリミナル・フォージやクアンタ・ラボなど新世代の研究機関が進出し、E530年の次元ブリッジ完成に向けた基礎研究が行われている。テック・コリドーの住民の約70%が技術系の専門職であり、E16連星系で最も学歴水準の高い地区である。",
    descriptionEn:
      "A technology industry belt extending from the center of Gigapolis to the east, it is the forefront of technological innovation in the E16 star system. Tech Corridor is densely packed with high-tech companies and research institutions in dimensional pole technology, quantum computing, nanotechnology, AI development, and more. During the ZAMLT era, Tron Corporation's R&D hub was located at the center of Tech Corridor, where the weaponization of dimensional energy was advanced. After the Gigapolis Liberation War, it shifted to peaceful technology development, and during the Techno-Cultural Renaissance, the civilian use project for dimensional halls was realized in Tech Corridor. Currently, new-generation research institutions like Liminal Forge and Quanta Lab have moved in, and basic research is being conducted toward the completion of the Dimensional Bridge in E530. Approximately 70% of Tech Corridor's residents are technical professionals, making it the district with the highest educational level in the E16 star system.",
  },{
    id: "geo-アート・ディストリクト" as WikiId,
    name: "アート・ディストリクト",
    nameEn: "Art District",
    category: "地理",
    subCategory: "都市",
    description:
      "Gigapolis西部に位置する芸術・文化地区で、セリア黄金期の遺産を受け継ぐE16連星系の文化の中心地である。アート・ディストリクトには美術館、劇場、音楽ホール、アトリエが密集し、フェルミ音楽の演奏会とAURALISの創作活動の拠点として機能している。セリア黄金期（E335〜E370年）にはAURALIS第一世代のメンバーがこの地区に居住し、「光と音を永遠にする」という理念を街の至る所に表現した。エヴァトロン支配期には多くの芸術施設が閉鎖されたが、テクノ文化ルネサンス期に復興し、AURALIS第二世代の活動拠点となった。地区の建築は音響的調和を重視した設計で統一され、建物の壁面が楽器のように音を共鳴させる特徴的な構造を持つ。Poitiersに隣接し、両地区を合わせて「文化回廊」と呼ばれている。",
    descriptionEn:
      "An art and cultural district located in western Gigapolis, it is the cultural center of the E16 star system, inheriting the legacy of the Celia Golden Age. Art District is densely packed with art museums, theaters, concert halls, and ateliers, functioning as a base for Fermi music concerts and AURALIS creative activities. During the Celia Golden Age (E335-E370), the first generation of AURALIS members lived in this district, expressing the philosophy of \"making light and sound eternal\" throughout the city. During the Evatron dominion period, many art facilities were closed, but they were revived during the Techno-Cultural Renaissance, becoming a base for the activities of the second generation of AURALIS. The district's architecture is unified in a design that emphasizes acoustic harmony, with a distinctive structure where building walls resonate like musical instruments. It borders Poitiers, and the two districts together are called the \"Cultural Corridor.\"",
  },{
    id: "geo-ポート・ディストリクト" as WikiId,
    name: "ポート・ディストリクト",
    nameEn: "Port District",
    category: "地理",
    subCategory: "都市",
    description:
      "Gigapolis西部に位置する港湾地区で、シンフォニー・オブ・スターズの海上物流の主要拠点として機能している。ポート・ディストリクトはアブリーヴォとPersepolisと共に西大陸の物流トライアングルを形成し、惑星内輸送と惑星間輸送の結節点として重要な役割を果たしている。地区には巨大なドッキングベイとコンテナヤードが広がり、年間数千万トンの貨物が取り扱われている。テクノ文化ルネサンス期にはホライゾン・ゲート接続ターミナルが整備され、惑星ビブリオや他の植民地との直接物流ルートが確立された。ポート・ディストリクトの海上市場は新鮮な海産物が取引される名所であり、異星の食材もホライゾン・ゲート経由で毎日届けられている。スライム危機後は港湾施設の海底構造に残存するスライム駆除が長期プロジェクトとして続いている。",
    descriptionEn:
      "A harbor district located in western Gigapolis, functioning as the main hub for Symphony of Stars' maritime logistics. Port District forms a logistics triangle with Abrivo and Persepolis for the western continent, playing an important role as a junction for intra-planetary and inter-planetary transport. The district features vast docking bays and container yards, handling tens of millions of tons of cargo annually. During the Techno-Cultural Renaissance, the Horizon Gate connection terminal was established, establishing direct logistics routes with the planet Biblio and other colonies. Port District's sea market is a famous spot for trading fresh seafood, and ingredients from other planets are delivered daily via the Horizon Gate. After the Slime Crisis, the removal of remaining slimes from the harbor facility's underwater structure continues as a long-term project.",
  },{
    id: "geo-クレセント山脈" as WikiId,
    name: "クレセント山脈",
    nameEn: "Crescent Mountain Range",
    category: "地理",
    subCategory: "自然地形",
    description:
      "クレセント大地方の東部に南北に延びる壮大な山脈で、大陸の三日月型地形の外縁を形成している。最高峰は標高8,400メートルに達し、シンフォニー・オブ・スターズにおける最高地点の一つである。クレセント山脈には豊富な鉱物資源が埋蔵されており、アイアン・シンジケートの主要採掘拠点が山脈中腹に点在している。山脈の東側斜面は急峻で、西側斜面は緩やかな草原が広がる非対称な地形が特徴的である。テリアン反乱（E400〜E470年）の際には山岳地帯がエリオス・ウォルドのゲリラ戦の拠点として機能し、エヴァトロン軍の制圧を長期間阻んだ。現在では山脈の北端にSSレンジの通信中継施設が建設され、クレセント地方全域の通信ネットワークを支えている。登山とスキーを楽しむ観光地としても人気がある。",
    descriptionEn:
      "A magnificent mountain range running north-south in the eastern part of the Crescent Great Territory, forming the outer edge of the continent's crescent-shaped terrain. Its highest peak reaches 8,400 meters, making it one of the highest points in the Symphony of Stars. The Crescent Mountains are rich in mineral resources, with major mining outposts of the Iron Syndicate scattered across the mountainside. The terrain is characterized by its asymmetry, with steep eastern slopes and gentle western slopes stretching into grasslands. During the Terrian Rebellion (E400-E470), the mountainous area functioned as a base for Elios Wald's guerrilla warfare, long resisting Evatron army suppression. Currently, a communication relay facility of the SS Range has been constructed at the northern end of the mountains, supporting the communication network of the entire Crescent region. It is also a popular tourist destination for mountaineering and skiing.",
  },{
    id: "geo-ヴェルミリオン渓谷" as WikiId,
    name: "ヴェルミリオン渓谷",
    nameEn: "Vermillion Valley",
    category: "地理",
    subCategory: "自然地形",
    description:
      "ヴァーミリオン国家の中央を南北に貫く壮大な渓谷で、赤色の岩壁が特徴的な景観を作り出している。ヴェルミリオン渓谷はクレセント山脈の浸食によって形成されたV字谷で、最大深度は1,200メートルに達する。渓谷の底にはヴェルミリオン川が流れ、周辺の農業地帯に豊かな灌漑水を供給している。渓谷の赤い岩壁は夕陽に照らされて燃えるような朱色に輝き、国家名「ヴァーミリオン（朱色）」の由来となった。フェルミ音楽の伝統的な野外演奏会は渓谷の音響効果を活用して開催され、岩壁が自然の残響板として機能する。ヴァーミリオンの国家建築は渓谷の赤色を基調とし、岩壁の素材をそのまま使用した構造物が多く見られる。エヴァトロン支配期には渓谷の洞窟に地下抵抗組織の隠れ家が築かれ、テリアン反乱との連携拠点となった。",
    descriptionEn:
      "A magnificent canyon running north-south through the center of the Vermillion Nation, creating a distinctive landscape with its red rock walls. Vermillion Canyon is a V-shaped valley formed by the erosion of the Crescent Mountains, with a maximum depth of 1,200 meters. The Vermillion River flows through the canyon floor, supplying rich irrigation water to the surrounding agricultural areas. The canyon's red rock walls glow with a fiery vermilion color when illuminated by the setting sun, which became the origin of the nation's name \"Vermillion (vermilion).\" Traditional outdoor concerts of Fermi music are held utilizing the canyon's acoustic effects, with the rock walls functioning as natural resonating boards. The national architecture of Vermillion is based on the canyon's red color, and many structures are seen using the rock wall material directly. During the Evatron dominion period, caves in the canyon housed underground resistance organizations, becoming a coordinating base with the Terrian Rebellion.",
  },{
    id: "geo-ブルーローズ平原" as WikiId,
    name: "ブルーローズ平原",
    nameEn: "Blue Rose Plains",
    category: "地理",
    subCategory: "自然地形",
    description:
      "ブルーローズ国家の大部分を覆う広大な平原地帯で、クレセント大地方最大の農業生産地である。ブルーローズ平原の土壌はシンフォニー・オブ・スターズ特有の青い鉱物を含み、雨季には一面に青い花が咲き乱れることから「ブルーローズ（青い薔薇）」の名が付けられた。平原には高度な農業自動化システムが導入され、クレセント地方の食料需要の約40%をこの平原で賄っている。平原の北端にはフィオナがV7設立（E515年）を宣言した「自由の丘」があり、ブルーローズの国家独立の象徴として史跡に指定されている。テクノ文化ルネサンス期には平原に次元極地平技術の実証実験場が建設され、ホライゾン・ゲートの安定化制御の試験が行われた。平原の西側はヴェルミリオン渓谷に接し、両国の国境には緩衝地帯が設定されている。",
    descriptionEn:
      "The vast plain that covers most of the Blue Rose Nation, Crescent's largest agricultural production area. The soil of the Blue Rose Plain contains the unique blue minerals of the Symphony of Stars, and during the rainy season, blue flowers bloom across its entire surface, giving it the name \"Blue Rose.\" Advanced agricultural automation systems have been introduced to the plain, which supplies approximately 40% of the food demand for the Crescent region. At the northern end of the plain stands \"Freedom Hill,\" where Fiona declared the founding of V7 (E515), now designated as a historical site symbolizing Blue Rose's national independence. During the Techno-Cultural Renaissance, a dimensional polar plateau experimental facility was constructed on the plain, where stabilization control tests for the Horizon Gate were conducted. The western side of the plain borders the Vermillion Valley, with a buffer zone established between the two nations.",
  },{
    id: "geo-クロセヴィア密林" as WikiId,
    name: "クロセヴィア密林",
    nameEn: "Crosevia Dense Forest",
    category: "地理",
    subCategory: "自然地形",
    description:
      "クロセヴィア国家の南部に広がる熱帯密林で、クレセント大地方最大の原生林である。クロセヴィア密林は特有の複雑な気象システムを内包し、局地的な暴風雨を頻繁に発生させることから気象制御技術の研究フィールドとして利用されてきた。密林にはシンフォニー・オブ・スターズ固有の動植物が多数生息し、中には医薬品の原料となる希少植物も含まれている。SUDOMの医療研究者が密林の植物探索を定期的に実施し、新薬の開発に貢献している。密林の深部には未踏査の区域が広がり、スライム危機時には変異したリーチ・ドレインの隠れ家となった可能性が指摘されている。カスチーナ・テンペストは密林の気象観測データを基に気象制御技術を開発し、クロセヴィアの国家的特色を形成した。",
    descriptionEn:
      "A tropical rainforest spreading across the southern part of the Crosevia Nation, Crescent's largest primary forest. The Crosevia Rainforest contains a unique complex weather system that frequently causes localized storms, making it a research field for weather control technology. Numerous unique flora and fauna of the Symphony of Stars inhabit the rainforest, including rare plants used as pharmaceutical ingredients. SUDOM medical researchers regularly conduct plant exploration in the rainforest, contributing to new drug development. Unexplored areas extend deep into the rainforest, and it has been suggested that during the Slime Crisis, it may have served as a hiding place for mutated Leech-Drains. Castina Tempest developed weather control technology based on the rainforest's meteorological observation data, forming a national characteristic of Crosevia.",
  },{
    id: "geo-SSレンジ通信山" as WikiId,
    name: "SSレンジ通信山",
    nameEn: "SS Range Signal Mountain",
    category: "地理",
    subCategory: "自然地形",
    description:
      "SSレンジ国家の中心に聳える標高3,200メートルの山で、E16連星系最大の通信施設が山頂に建設されている。通信山の地質は磁性鉱物を豊富に含む特殊な岩石で構成され、自然の電磁波増幅効果を持つ。この特性を利用してアイク・ロペスの技術チームが超長距離量子通信システムの基幹アンテナを山頂に構築し、E16連星系全域の通信インフラの基盤を確立した。通信山の中腹にはSSレンジの研究施設とデータセンターが階層状に配置され、量子暗号通信の開発とサイバーセキュリティ研究が行われている。山頂のアンテナ群は夜間に青白い光を放ち、クレセント大地方のランドマークとしても機能している。V7の情報戦において通信山は最重要防衛対象であり、多重のサイバー防壁で厳重に守られている。",
    descriptionEn:
      "A mountain with an elevation of 3,200 meters, standing at the center of the SS Range Nation, with the E16 star system's largest communication facility constructed at its summit. The geology of Communication Mountain consists of special rocks rich in magnetic minerals, possessing a natural electromagnetic wave amplification effect. Utilizing this characteristic, Ike Lopez's technical team constructed the main antenna for an ultra-long-range quantum communication system at the summit, establishing the foundation for the communication infrastructure across the entire E16 star system. Research facilities and data centers of SS Range are hierarchically arranged on the mountainside of Communication Mountain, where quantum cryptographic communication development and cybersecurity research are conducted. The antenna array at the summit emits a pale blue light at night, also functioning as a landmark for the Crescent region. In V7's information warfare, Communication Mountain is the most critical defense target, strictly protected by multiple cyber defense walls.",
  },{
    id: "geo-アイアン峡谷" as WikiId,
    name: "アイアン峡谷",
    nameEn: "Iron Canyon",
    category: "地理",
    subCategory: "自然地形",
    description:
      "アイアン・シンジケート国家の東部に位置する大規模な峡谷で、豊富な鉄鉱石とレアメタルの鉱脈が地表に露出している。アイアン峡谷の岩壁は酸化鉄を多量に含む赤褐色の地層で構成され、夕陽に照らされて溶鉄のような光沢を放つことからこの名が付けられた。峡谷内にはE60年の暗黒時代以来の採掘遺構が残り、初期入植者たちが手作業で掘り進めた坑道が迷路のように張り巡らされている。レイド・カキザキは峡谷の現代的な採掘拠点化を推進し、最新の自動化採掘システムを導入して生産性を飛躍的に向上させた。峡谷の地下深部には未発見の鉱脈が存在すると推測され、探査プロジェクトが継続中である。スライム危機時には峡谷の地下坑道にスライムが侵入し、採掘作業の一時停止を余儀なくされたが、現在は浄化が完了している。",
    descriptionEn:
      "A massive canyon located in the eastern part of the Iron Syndicate Nation, where rich iron ore and rare metal veins are exposed on the surface. The canyon walls of Iron Canyon are composed of ferric oxide-rich strata in reddish-brown, which shine with a molten iron-like luster when illuminated by the setting sun, giving it its name. Mining ruins dating back to the Dark Age of E60 remain in the canyon, with tunnels hand-dug by early settlers forming a labyrinthine network. Raid Kakizaki promoted the modern development of the canyon as a mining hub, introducing advanced automated mining systems to dramatically increase productivity. It is speculated that undiscovered veins exist deep within the canyon, and exploration projects are ongoing. During the Slime Crisis, slimes invaded the underground tunnels of the canyon, forcing a temporary halt to mining operations, but purification has now been completed.",
  },{
    id: "geo-ミエルテンガ湖" as WikiId,
    name: "ミエルテンガ湖",
    nameEn: "Lake Mielteunga",
    category: "地理",
    subCategory: "自然地形",
    description:
      "ミエルテンガ国家の中心部に位置するE16連星系最大の淡水湖で、面積は約45,000平方キロメートルに達する。ミエルテンガ湖はクレセント山脈の雪解け水と地下水脈によって涵養され、周辺の農業地帯と工業地帯に重要な水資源を供給している。湖には固有の淡水魚類が多数生息し、漁業も地域経済の一部を担っている。マリーナ・ボビンの政権は湖の水資源管理に重点を置き、水質浄化と水量維持のための大規模プロジェクトを実施した。湖岸にはミエルテンガの主要都市が点在し、国家の人口の約60%が湖の周辺50キロメートル以内に居住している。テリアン反乱期には湖の沼地帯がゲリラ戦の自然な防御陣地として機能した。現在は湖畔に大規模な公園とレクリエーション施設が整備され、クレセント地方の観光地としても人気がある。",
    descriptionEn:
      "The largest freshwater lake in the E16 star system, located in the central part of the Mieltenka Nation, with an area of approximately 45,000 square kilometers. Lake Mieltenka is fed by snowmelt from the Crescent Mountains and groundwater systems, supplying important water resources to surrounding agricultural and industrial zones. Numerous unique freshwater fish species inhabit the lake, and fishing also contributes to the regional economy. The administration of Marina Bobin focused on water resource management of the lake, implementing large-scale projects for water purification and water volume maintenance. Major cities of Mieltenga are scattered along the lake shores, with approximately 60% of the nation's population living within 50 kilometers of the lake. During the Terrian Rebellion period, the marshy areas of the lake functioned as natural defensive positions for guerrilla warfare. Currently, large-scale parks and recreational facilities have been developed along the lake shores, making it a popular tourist destination in the Crescent region.",
  },{
    id: "geo-ファールージャ砂漠" as WikiId,
    name: "ファールージャ砂漠",
    nameEn: "Faruja Desert",
    category: "地理",
    subCategory: "自然地形",
    description:
      "クレセント大地方の南西部に広がる広大な砂漠で、昼夜の温度差が摂氏60度に達する過酷な環境である。ファールージャ砂漠の地下には古代の水脈が存在し、オアシス・ハブの水資源管理技術によって生活用水が確保されている。砂漠の砂は特殊な珪素化合物を含み、一部区域では砂嵐時に静電気放電が発生することで知られる。この現象はファールージャの砂漠を航行する際の危険要因であると同時に、静電気エネルギーの採取可能性も指摘されている。ファルージャ社の創業地であり、ミカエル・ガブリエリの一族は砂漠の資源採掘で財を成した。砂漠の中央には「沈黙の塔」と呼ばれる自然の岩石構造物が聳え立ち、数千年前の隕石衝突の跡であると推測されている。",
    descriptionEn:
      "A vast desert stretching across the southwestern part of the Crescent region, an extremely harsh environment where the temperature difference between day and night reaches 60 degrees Celsius. Ancient water veins exist beneath the Farooj Desert, with domestic water resources secured through the water management technology of Oasis Hub. The sand of the desert contains special silicon compounds, and in some areas, static discharge is known to occur during sandstorms. This phenomenon is both a danger factor when navigating the Farooj Desert and has also been pointed out as a possibility for static energy extraction. It is the birthplace of the Farooja Corporation, and the family of Michael Gabrieli amassed wealth through resource extraction in the desert. In the center of the desert stands a natural rock structure called the \"Tower of Silence,\" believed to be the trace of a meteorite collision thousands of years ago.",
  },{
    id: "geo-E16軌道ステーション・オメガ" as WikiId,
    name: "E16軌道ステーション・オメガ",
    nameEn: "E16 Orbital Station Omega",
    category: "地理",
    subCategory: "宇宙構造物",
    description:
      "シンフォニー・オブ・スターズの低軌道に建設されたE16連星系最大の宇宙ステーションで、常時10万人以上の人員が滞在する宇宙都市である。軌道ステーション・オメガはE200年にパクス・ロンバルディカ期の企業連合によって建設が開始され、E260年に現在の規模に達した。ステーション内には居住区、商業区、工業区、研究区が階層状に配置され、惑星間航行の主要ハブとして機能している。E524年の諸世界連邦サミットの際にはオメガの国際会議場が使用され、宇宙規模の外交協議の場となった。ステーションの外壁には大規模な太陽光パネルと次元エネルギー発生装置が設置され、ステーション全体の電力を自給している。UECOの星間経済協同組合の管理下にあり、入出港管理と安全保障を担当している。",
    descriptionEn:
      "The largest space station in the E16 star system, constructed in low orbit of the Symphony of Stars, a space city with over 100,000 personnel stationed at all times. Orbital Station Omega began construction in E200 by a corporate consortium during the Pax Lombardica period, reaching its current scale in E260. The station has residential, commercial, industrial, and research areas hierarchically arranged, functioning as a major hub for interplanetary navigation. During the E524 Interstellar Federal Summit, Omega's international conference hall was used, becoming a venue for diplomatic negotiations on a cosmic scale. Large-scale solar panels and dimensional energy generation devices are installed on the station's outer walls, supplying the entire station's electricity independently. It is under the management of the UECO Interstellar Economic Cooperative, which handles port entry/exit management and security.",
  },{
    id: "geo-エロス・ステーション" as WikiId,
    name: "エロス・ステーション",
    nameEn: "Eros Station",
    category: "地理",
    subCategory: "宇宙構造物",
    description:
      "Eros-7の周回軌道に建設された中継ステーションで、Eros-7と他惑星間の物流と人の移動の拠点として機能している。エロス・ステーションはEros-7の女性主導社会の要塞としての側面も持ち、惑星への入出国管理と安全検査が厳格に実施されている。ステーション内には男性指令省の出張所があり、入国する男性のA-Registryの階級確認と労働配分が行われる。E525年のマトリカル・リフォーム運動により、入国手続きの男女平等化が進み、以前に比べて大幅に緩和された。ステーションにはスクイーズ・アビスから抽出される搾取エネルギーの積出施設も併設され、エネルギー資源の惑星間取引の拠点となっている。現在ではマトリカル・カウンシルとUECOの共同管理下で運営されている。",
    descriptionEn:
      "A relay station constructed in the orbit of Eros-7, functioning as a hub for logistics and human movement between Eros-7 and other planets. Eros Station also serves as a fortress for Eros-7's female-dominated society, with strict implementation of entry and exit management and security inspections for the planet. A branch office of the Male Directive Department is located within the station, where the rank confirmation and labor allocation of entering males from the A-Registry are conducted. Due to the Matric Reform Movement of E525, the equalization of entry procedures between men and women has progressed, significantly relaxed compared to the past. The station is also equipped with facilities for loading extracted exploitation energy from Squeeze Abyss, becoming a hub for interplanetary trading of energy resources. It is currently operated under the joint management of the Matric Council and UECO.",
  },{
    id: "geo-アステロイド・マイニング・プラットフォーム" as WikiId,
    name: "アステロイド・マイニング・プラットフォーム",
    nameEn: "Asteroid Mining Platform",
    category: "地理",
    subCategory: "宇宙構造物",
    description:
      "E16小惑星帯ガイア・リングに建設された一連の浮遊採掘プラットフォームで、レアメタルと希少資源の宇宙採掘を大規模に行っている。プラットフォームは複数の自律型ドローンと有人採掘ユニットで構成され、小惑星の表面から鉱物を採掘・精製してE16連星系全域に供給している。ガイア・リングのプラットフォームはE60年の暗黒時代に最初の草創期拠点が建設され、過酷な環境で生き抜いた初期入植者の精神を受け継ぐ「開拓者のコロニー」として独自の文化を育んできた。アイアン・シンジケートが主要な運営権を持ち、採掘量の管理と品質保証を行っている。テクノ文化ルネサンス期には最新の自動化技術が導入され、危険な有人作業の大部分がドローンに代替された。プラットフォーム間の移動は小型シャトルで行われ、緊急時にはホライゾン・ゲートによる脱出ルートも確保されている。",
    descriptionEn:
      "A series of floating mining platforms constructed in the E16 asteroid belt's Gaia Ring, conducting large-scale cosmic mining of rare metals and scarce resources. The platforms consist of multiple autonomous drones and manned mining units, extracting and refining minerals from asteroid surfaces to supply throughout the E16 binary star system. The Gaia Ring platforms had their first pioneering base constructed during the E60 Dark Age, developing a unique culture as \"Pioneer Colonies\" inheriting the spirit of early settlers who survived the harsh environment. The Iron Syndicate holds primary operational rights, managing extraction volumes and quality assurance. During the Techno-Cultural Renaissance, the latest automation technologies were introduced, with drones replacing most dangerous manned operations. Movement between platforms is conducted via small shuttles, with Horizon Gate escape routes secured for emergencies.",
  },{
    id: "geo-次元ブリッジ・ターミナル" as WikiId,
    name: "次元ブリッジ・ターミナル",
    nameEn: "Dimensional Bridge Terminal",
    category: "地理",
    subCategory: "宇宙構造物",
    description:
      "E530年に完成した次元ブリッジの惑星間接続ターミナルで、シンフォニー・オブ・スターズの軌道上に建設されたE16文明圏最大の次元技術施設である。次元ブリッジ・ターミナルは次元極地平を安定化して他星系への大規模な移動を可能にする画期的な構造物であり、E16連星系とグランベル、ティエリア、エレシオンなどの宇宙文明圏を直接接続している。ターミナルの中心には直径500メートルの次元ホール・ゲートが設置され、同時に数千人の移動と数千トンの貨物輸送を処理できる。建設はテック・コリドーの研究機関群が主導し、惑星ビブリオの理論的基盤とSSレンジの通信制御技術を統合して実現した。次元ブリッジの完成はE16文明圏の歴史的転換点であり、宇宙規模の交流と協力を飛躍的に拡大した。ターミナルの警備は銀河系コンソーシアムの合同部隊が担当している。",
    descriptionEn:
      "The interplanetary connection terminal for the dimension bridge, completed in E530, and the largest dimensional technology facility in the E16 civilization sphere, constructed in orbit of the Symphony of Stars. The dimension bridge terminal is a revolutionary structure that stabilizes the dimensional horizon to enable large-scale movement to other star systems, directly connecting the E16 binary star system with cosmic spheres such as Granbel, Tieria, and Elesion. A 500-meter diameter dimensional hole gate is installed at the terminal's center, capable of processing the movement of thousands of people and thousands of tons of cargo simultaneously. Construction was led by research institutions of the Tech Corridor, integrating theoretical foundations from planet Biblio and communication control technology from the SS Range. The completion of the dimension bridge marked a historical turning point for the E16 civilization sphere, dramatically expanding cosmic-scale exchange and cooperation. Terminal security is handled by joint forces of the Galactic Consortium.",
  },{
    id: "geo-宇宙港スペースポート" as WikiId,
    name: "宇宙港スペースポート",
    nameEn: "Spaceport — E16 Interplanetary Spaceport",
    category: "地理",
    subCategory: "宇宙構造物",
    description:
      "シンフォニー・オブ・スターズとE16連星系内の各惑星・コロニーを結ぶ惑星間宇宙港で、西大陸のPersepolisと惑星ビブリオのポート・ロレンツィオを主要ハブとして運営されている。宇宙港スペースポートは年間数万隻の宇宙船を処理し、旅客・貨物の双方を扱うE16連星系最大の交通インフラである。スペースポートの税関エリアではA-Registryの確認と入国審査が行われ、セキュリティはUECOの合同部隊が担当している。テクノ文化ルネサンス期にはホライゾン・ゲート接続ターミナルが併設され、従来の宇宙船航行と次元ホール移動の両方が利用可能となった。宇宙港周辺にはホテル、レストラン、通商施設が立ち並び、事実上の国際都市として機能している。アルファ・ヴェノムのテロ活動警戒区域にも指定されており、厳重なセキュリティプロトコルが適用されている。",
    descriptionEn:
      "An interplanetary spaceport connecting the Symphony of Stars with various planets and colonies within the E16 binary star system, operated with major hubs at Persepolis on the Western Continent and Port Lorenzo on planet Biblio. The spaceport handles tens of thousands of spacecraft annually and is the largest transportation infrastructure in the E16 binary star system, serving both passengers and cargo. Customs areas at the spaceport conduct A-Registry verification and immigration inspections, with security handled by joint forces of the UECO. During the Techno-Cultural Renaissance, a Horizon Gate connection terminal was added, making both traditional spacecraft navigation and dimensional hole travel available. Hotels, restaurants, and commercial facilities surround the spaceport, functioning effectively as an international city. It is also designated as a high-alert zone for Alpha Venom terrorist activities, with strict security protocols applied.",
  },] as const satisfies readonly WikiEntry[]
