import type { WikiId, WikiEntry } from "@/types"

export const WIKI_TERMS = [{
    id: "コーポラトクラシー" as WikiId,
    name: "コーポラトクラシー",
    nameEn: "Corporatocracy",
    category: "用語",
    subCategory: "歴史・時代",
    description:
      "E16連星系の歴史的統治体制で、国家そのものが企業として機能する政治形態。東暦初期の入植期からパクス・ロンバルディカ期（E205〜E278）にかけて最盛期を迎え、20万以上のコーポラトクラシーがGigapolis全域で競合した。各コーポラトクラシーは独自の軍備・法体系・市民管理を持ち、経済力こそが唯一の権力基盤だった。コーポラタムパブリカ（株式会社共和国）はその頂点に立つコーポラトクラシー連合体で、14兆ドルのGDPを誇り、コーポラトクラシー体制の最も成功した例として歴史に残る。E150年のエル・フォルハウスによるマーストリヒト革命で体制が揺らぎ始め、ZAMLTの台頭（E301年）によりコーポラトクラシー間の覇権争いは5超巨大企業への集約によって終焉を迎えた。しかしZAMLT崩壊後も、A-Registryの階級制度やnトークン経済という遺産はE16文明圏に深く根を下ろし、現在のUECOや銀河系コンソーシアムの枠組みにも影響を与え続けている。コーポラトクラシー時代の競争原理は、現在もグランベルの経済覇争やクレセント地方の勢力ゲームの基層構造として息づいている。\nこのコーポラトクラシーの根底には、国家＝株式会社(D3)の思想的地層が横たわっている。20万の企業国家が競合したこの構造は、民主主義の失敗を前提に国家をCEOが経営する株式会社とするD3の思想の直接的実践であった。nトークン経済は「株主価値」の変奏として機能し、市民は消費者兼投資家としての役割に還元された。",
    descriptionEn:
      "A historical governance system in the E16 star system where the state itself functions as a corporation. It reached its peak during the early settlement period from the beginning of the Eastern calendar to the Pax Lombardica period (E205-E278), with over 200,000 corporatocracies competing across Gigapolis. Each corporatocracy had its own military, legal system, and citizen management, with economic power being the sole basis of authority. The Corporatum Publica (Corporate Republic) was the alliance of corporatocracies at the top, boasting a GDP of 14 trillion dollars and remaining in history as the most successful example of the corporatocracy system. The system began to waver with the Maastricht Revolution led by El Forthaus in E150, and the struggle for dominance among corporatocracies ended with the concentration into five mega-corporations following the rise of ZAMLT in E301. However, even after the collapse of ZAMLT, the legacy of the A-Registry's class system and the n-token economy have taken deep root in the E16 civilization, continuing to influence the frameworks of the current UECO and the Galactic Consortium. The competitive principles of the corporatocracy era still survive as the underlying structure of economic hegemony in Granbel and the power games in the Crescent region.\nAt the core of this corporatocracy lies the ideological stratum of the state = corporation (D3). This structure, where 200,000 corporate states competed, was the direct implementation of the D3 ideology, which presupposed the failure of democracy and treated the state as a corporation managed by a CEO. The n-token economy functioned as a variation of 'shareholder value,' reducing citizens to the role of consumers and investors.",
  },{
    id: "クロニクル・ネーム" as WikiId,
    name: "クロニクル・ネーム",
    nameEn: "Chronicle Name",
    category: "用語",
    subCategory: "技術・概念",
    description:
      "AURALISに伝わる重要な文化的伝統で、初代メンバーの「名」を後継者が世代を超えて継承する制度である。初代Kate Claudiaの「Kate」、初代Lily Steinerの「Lillie Ardent」などの「名」は、単なる呼称ではなく、その名が持つ芸術的・精神的な本質を体現する者にのみ受け継がれる。継承の基準は厳格で、元の名の持ち主と同等の特性、才能、精神を持つと認められた者のみが新しい「名の継承者」となる。この制度はAURALISの「光と音を永遠にする」という理念を具現化するものであり、個人の死によって芸術的遺産が途絶えることを防ぐ文化装置として機能している。名の継承者は元の人物とは別個の存在であるが、AURALISのコミュニティ内では精神的な連続性が重視される。第一世代から第二世代への移行期においてもこの制度は維持され、AURALISのアイデンティティの継続性を支える重要な役割を果たしている。nトークン経済において「名の継承者」は文化的価値の指標として高く評価される。",
    descriptionEn:
      "An important cultural tradition passed down in AURALIS, a system where the 'name' of the founding member is inherited by successors across generations. The 'names' of the first members, such as 'Kate' from the first Kate Claudia and 'Lillie Ardent' from the first Lily Steiner, are not merely titles but are inherited only by those who embody the artistic and spiritual essence of that name. The criteria for inheritance are strict, and only those recognized to possess equivalent characteristics, talents, and spirit to the original name-bearer can become the new 'name inheritor.' This system embodies AURALIS's philosophy of 'making light and sound eternal,' functioning as a cultural device to prevent artistic heritage from being cut off by individual death. The name inheritor is a separate individual from the original person, but spiritual continuity is emphasized within the AURALIS community. This system has been maintained even during the transition from the first to the second generation, playing an important role in supporting the continuity of AURALIS's identity. In the n-token economy, 'name inheritors' are highly valued as indicators of cultural worth.",
  },{
    id: "スティル・アレーナ" as WikiId,
    name: "スティル・アレーナ",
    nameEn: "Steel Arena",
    category: "用語",
    subCategory: "技術・概念",
    description:
      "ネオンコロシアムで行われる戦士決定の儀式で、クレセント大地方における伝統的な武力選抜制度である。ネオンコロシアムはクレセント地方の中心都市に設置された巨大な闘技場で、次元極地平技術を応用した安全装置により、実戦級の戦闘ながら参加者の命を守る仕組みが組み込まれている。スティル・アレーナでは、各国家や組織が代表する戦士たちが独自の戦闘スタイルと技術を披露し、その結果によって軍事的階位や外交的な発言力が決定される。ボグダス・ジャベリンのテクロサス系譜の戦士たちはスティル・アレーナの常連であり、その圧倒的な実力で他国の参加者を圧倒してきた。スティル・アレーナは単なる武力競技ではなく、クレセント地方の国際秩序を維持するための象徴的な儀式として機能し、UECOの監視下で定期的に開催されている。V7とトリニティ・アライアンスの対立が深まる中、スティル・アレーナは両陣営の緊張を緩和する場としての役割も担っている。スティル・アレーナの勝者には特別なnトークン報酬とA-Registry上の名誉階位が与えられる。",
    descriptionEn:
      "A warrior determination ceremony held in the Neon Colosseum, a traditional military selection system in the Crescent region. The Neon Colosseum is a huge arena located in the central cities of the Crescent region, incorporating safety devices using dimensional horizon technology that protect participants' lives while allowing combat at an actual combat level. In the Still Arena, warriors representing various nations and organizations showcase their unique combat styles and techniques, and their results determine military rank and diplomatic influence. The warriors of the Bogdas Javelin's Techlosus lineage are regulars in the Still Arena, overwhelming participants from other countries with their overwhelming strength. The Still Arena is not merely a martial arts competition but functions as a symbolic ceremony to maintain the international order of the Crescent region, regularly held under the supervision of UECO. As the conflict between V7 and the Trinity Alliance deepens, the Still Arena also serves as a venue to ease tensions between the two factions. Winners of the Still Arena receive special n-token rewards and honorary ranks on the A-Registry.",
  },{
    id: "アビサル・ドレイン" as WikiId,
    name: "アビサル・ドレイン",
    nameEn: "Abyssal Drain",
    category: "用語",
    subCategory: "その他",
    description:
      "クレセント地方に埋蔵される貴重な石油資源であり、シンフォニー・オブ・スターズ西大陸のエネルギー安全保障の要。高純度の原油が採掘され、精製後は航空燃料や次元エンジンの補助動力源として利用される。その戦略的価値から各地の軍閥や企業の争奪対象となり、アイリスがクレセントで実行した襲撃作戦はこの資源を巡る大規模な紛争の一端をなす。採掘施設は度重なる戦火で破壊と再建を繰り返してきた。",
    descriptionEn:
      "Valuable petroleum resources buried in the Crescent region, essential for the energy security of the Symphony of Stars Western Continent. High-purity crude oil is extracted and, after refining, used as aviation fuel or an auxiliary power source for dimensional engines. Due to its strategic value, it has become a target of contention for various warlords and corporations, and the raid operation executed by Iris in the Crescent is part of a large-scale conflict over this resource. Mining facilities have been repeatedly destroyed and rebuilt through continuous warfare.",
  },{
    id: "フェルミ音楽" as WikiId,
    name: "フェルミ音楽",
    nameEn: "Fermi Music",
    category: "用語",
    subCategory: "技術・概念",
    description:
      "セリア黄金期（E335〜E370年）に最盛期を迎えた独自の音楽体系。次元極地平の共振現象を音響に応用し、通常の周波数帯を超えた音波を生成することで聴覚だけでなく感情に直接働きかける革新的な音楽を創造した。AURALISの創作理念の源流となり、のちにAURALIS Collectiveが確立する総合芸術運動の基礎を形成した。Poitiersに研究機関と芸術院が集積し、現在でもフェルミ音楽の復興祭が定期的に開催されている。",
    descriptionEn:
      "A unique musical system that reached its peak during the Celian Golden Age (E335-E370). It applied the resonance phenomenon of the dimensional horizon to sound, creating innovative music that directly affects not only hearing but also emotions by generating sound waves beyond normal frequency bands. It became the source of AURALIS's creative philosophy and formed the basis for the comprehensive art movement later established by the AURALIS Collective. Research institutions and art academies accumulated in Poitiers, and today, the Fermi Music Revival Festival is still held regularly.",
  },{
    id: "サイケデリック・コスモロジー" as WikiId,
    name: "サイケデリック・コスモロジー",
    nameEn: "Psychedelic Cosmology",
    category: "用語",
    subCategory: "技術・概念",
    description:
      "テミルタロンが提唱した独自の宇宙論的哲学体系。次元極地平を単なる物理現象ではなく、宇宙の意識的構造の顕現として解釈し、物質世界と精神世界の境界を溶解する宇宙観を構築した。このコスモロジーはテクノ宗教運動の思想的基盤となり、次元階梯パンディクトの構想の原型を提供した。サイケデリックな体験を通じた高次元認識の開拓を重視し、技術啓蒙時代の合理主義に対する重要な対抗思想として機能した。現在でもテンプル・オブ・ホライゾンの教学における根本教義となっている。",
    descriptionEn:
      "A unique cosmological philosophical system proposed by Temirlaton. It interprets the dimensional horizon not merely as a physical phenomenon but as the manifestation of the conscious structure of the universe, constructing a worldview that dissolves the boundary between the material and spiritual worlds. This cosmology became the ideological foundation of the techno-religious movement and provided the prototype for the concept of the dimensional ladder pandict. It emphasized the exploration of higher-dimensional consciousness through psychedelic experiences and functioned as an important counter-ideology against the rationalism of the technological enlightenment era. It remains a fundamental doctrine in the teachings of the Temple of Horizon today.",
  },{
    id: "シギル・アフェクト" as WikiId,
    name: "シギル・アフェクト",
    nameEn: "Sigil Affect",
    category: "用語",
    subCategory: "技術・概念",
    description:
      "ヴェルリット一族（魔女）が代々使用する特殊な印であり、その詳細は多くの謎に包まれている。印を施すことで空間の歪みやエネルギーの流れを操作する効果があるとされ、ヴェルリット一族の戦闘術や呪術の中核技術となっている。シギル・アフェクトを使用した攻撃は通常の物理的防御を容易に貫通し、対象の生体エネルギーに直接干渉する特性を持つ。アイリスがクレセントでヴェルリット一族と交戦した際、この印の技術の脅威を身をもって経験した。印の起源や仕組みについては学術的な解明が進んでいない。",
    descriptionEn:
      "A special mark used by the Verlit family (witches) for generations, whose details are shrouded in many mysteries. It is said that applying this mark has the effect of manipulating spatial distortions and energy flows, and it has become the core technology of the Verlit family's combat and sorcery techniques. Attacks using Sigil Effect can easily pierce normal physical defenses and have the characteristic of directly interfering with the target's bio-energy. When Iris engaged in combat with the Verlit family using Crescent, she personally experienced the threat of this mark's technology. The origin and mechanism of the mark have not been academically elucidated.",
  },{
    id: "ジーン・カタログ" as WikiId,
    name: "ジーン・カタログ",
    nameEn: "Gene Catalogue",
    category: "用語",
    subCategory: "組織・制度",
    description:
      "Eros-7の男性指令省が運用する男性の遺伝情報管理システム。Eros-7の女性主導社会において、男性の社会参加と繁殖を統制する目的で作られた。登録された男性の遺伝情報に基づいて適格性判定と労働配分が行われる仕組みで、多くの男性がこの制度に不満を抱いていた。E525年のマトリカル・リフォーム運動で男女平等化が強く要求され、現在では制度の透明性と公平性の改善が進んでいる。この制度をめぐる論争はEros-7のジェンダー問題を象徴する議論となっている。",
    descriptionEn:
      "A genetic information management system for men operated by the male command authority of Eros-7. Created in the female-dominated society of Eros-7 to control male social participation and reproduction. The system determines eligibility and allocates labor based on the genetic information of registered men, and many men were dissatisfied with this system. In the Matric Reform Movement of E525, strong demands were made for gender equality, and now improvements to the system's transparency and fairness are being made. The controversy surrounding this system has become a symbolic discussion of gender issues on Eros-7.",
  },{
    id: "ヘゲモニー・パラドックス（概要）" as WikiId,
    name: "ヘゲモニー・パラドックス",
    nameEn: "Hegemony Paradox",
    category: "用語",
    subCategory: "用語",
    description:
      "新興大国が台頭する際、現存大国との間に構造的な対立が生じ、戦争が不可避的に勃発するという国際政治理論。古代ギリシャの歴史家トゥキディデスがペロポネソス戦争の分析で提唱した概念を宇宙規模に適用したもの。銀河系コンソーシアムはこの罠の回避を最重要政策目標として掲げ、特にグランベル（経済1位）とティエリア（軍事3位）の関係に危険性を指摘している。かつてのアポロンとSelinopolisの関係も同様の構造だったと分析され、その教訓が現在の外交政策に反映されている。詳細は「ヘゲモニー・パラドックス」（宇宙文明圏）を参照。",
    descriptionEn:
      "A theory of international politics that when emerging great powers rise, structural conflicts arise with existing great powers, making war inevitable. It is an application of the concept proposed by the ancient Greek historian Thucydides in his analysis of the Peloponnesian War to a cosmic scale. The Galactic Consortium lists avoiding this trap as its most important policy goal, and has pointed out dangers in the relationship between Granbel (economic rank 1) and Tierra (military rank 3). The relationship between Apollo and Selinopolis in the past is analyzed to have had a similar structure, and the lessons from that are reflected in current foreign policy. For details, refer to 'Hegemony Paradox' (Cosmic Civilization Sphere).",
  },{
    id: "フェンドラ人" as WikiId,
    name: "フェンドラ人",
    nameEn: "Fendra",
    category: "用語",
    subCategory: "民族集団",
    description:
      "技術革新と工業発展を第一の価値観とする北欧系の移民集団であり、シンフォニー・オブ・スターズに到来した三大移民集団の一つ。寒冷な惑星環境への適応の過程で高度なエンジニアリング技術を発展させ、冶金学や機械工学の分野で際立った貢献を果たした。Gigapolisの化学工業都市Chemはフェンドラ人の技術を基盤に発展した。合理的な思考と効率性を重んじる文化を持ち、技術啓蒙時代の主要な推進勢力の一つとして西大陸の近代化に大きく寄与した。",
    descriptionEn:
      "A Nordic immigrant group that values technological innovation and industrial development as its primary values, and one of the three major immigrant groups that arrived in the Symphony of Stars. In the process of adapting to the harsh planetary environment, they developed advanced engineering technology and made outstanding contributions in the fields of metallurgy and mechanical engineering. The chemical industrial city Chem of Gigapolis developed based on the technology of the Fendran people. They have a culture that values rational thinking and efficiency, and as one of the main driving forces of the Technological Enlightenment era, they greatly contributed to the modernization of the Western Continent.",
  },{
    id: "アーキアン" as WikiId,
    name: "アーキアン",
    nameEn: "Archian",
    category: "用語",
    subCategory: "民族集団",
    description:
      "過酷な惑星環境への適応能力に優れたアジア系の移民集団であり、三大移民集団の一つ。生物学的な環境適応技術と持続可能な農業システムを開発し、当初は不毛とされた地域の開拓に成功した。特に水資源管理と土壌改良技術において卓越した成果を挙げ、シンフォニー・オブ・スターズの食料安全保障の基盤を築いた。文化面では祖先崇拝と自然との調和を重んじる哲学があり、テクノ宗教運動とも共鳴する思想を持つ。西大陸の人口の主要な構成要素の一つである。",
    descriptionEn:
      "An Asian immigrant group with excellent adaptation capabilities to harsh planetary environments, and one of the three major immigrant groups. They developed biological environmental adaptation technologies and sustainable agricultural systems, successfully pioneering areas that were initially considered barren. They achieved outstanding results in water resource management and soil improvement technologies, establishing the foundation for food security in the Symphony of Stars. Culturally, they value ancestor worship and harmony with nature, and have ideas that resonate with the techno-religious movement. They are one of the main components of the Western Continent's population.",
  },{
    id: "ポロンポロ" as WikiId,
    name: "ポロンポロ",
    nameEn: "Polonpolo",
    category: "用語",
    subCategory: "民族集団",
    description:
      "母星の文化遺産と伝統の保存を最優先課題とするオセアニア系の移民集団であり、三大移民集団の一つ。移住に際して膨大な文化資料と言語データを持ち込み、独自の教育システムを通じて次世代への継承に努めた。他の移民集団が技術的適応を追求する中、ポロンポロは精神的・文化的アイデンティティの維持に注力し、音楽、舞踊、口承文芸の分野で豊かな遺産を残している。テクノ文化ルネサンス期には、伝統芸術と次元技術の融合という新たな文化表現を開拓した。",
    descriptionEn:
      "An Oceanian immigrant group that prioritizes the preservation of their home planet's cultural heritage and traditions, and one of the three major immigrant groups. Upon migration, they brought vast cultural materials and linguistic data, and through their unique education system, they endeavored to pass them on to the next generation. While other immigrant groups pursued technological adaptation, Polonpolo focused on maintaining spiritual and cultural identity, leaving a rich legacy in the fields of music, dance, and oral literature. During the Techno-Cultural Renaissance period, they pioneered new forms of cultural expression that fused traditional arts with dimensional technology.",
  },{
    id: "Iris_Worlds" as WikiId,
    name: "アイリス・ワールズ",
    nameEn: "Iris Worlds",
    category: "用語",
    subCategory: "用語",
    description:
      "アイリス物語の公式ウェブサイトであり、ストーリーの全編と関連資料が公開されている。URLはhttps://irisworlds.netlify.app/story。E16系の世界観、登場人物、歴史年表、技術体系などに関する包括的な情報が掲載され、新規読者と既存ファンの両方に向けた情報ハブとして機能している。サイトは随時更新されており、最新のストーリー展開や設定の追加情報が反映されている。",
    descriptionEn:
      "The official website of the Iris Story, where the entire story and related materials are published. The URL is https://irisworlds.netlify.app/story. It contains comprehensive information about the E16 worldview, characters, historical timeline, technological systems, etc., serving as an information hub for both new readers and existing fans. The site is regularly updated to reflect the latest story developments and additional information.",
  },{
    id: "グランベル" as WikiId,
    name: "グランベル",
    nameEn: "Granbell",
    category: "用語",
    subCategory: "宇宙文明",
    description:
      "宇宙ランキング第1位の経済大国。GDP150兆ドルで宇宙全体の約25%を占める。首都はオルダシティ。アポロン・Dominion大戦を傍観し、戦後混乱期に一気に浮上。マルチバース開拓と次元間技術で他文明を圧倒。ティエリアとはヘゲモニー・パラドックスの危険性が指摘される一方、エレシオンとは技術分野で連携。現大統領アルゼン・カーリーンは第一回宇宙連合会合を主催した。初代リーダーはマスター・クインシアスであり、セリア時代を高く評価し後継的な文明として位置づけた。歴代指導者はセリアの遺産を継承する理念を維持し、グランベルの経済的繁栄の精神的基盤を形成してきた。",
    descriptionEn:
      "The number one economic power in the cosmic rankings, accounting for approximately 25% of the entire universe's GDP with 150 trillion dollars. The capital is Alda City. It rose to prominence by observing the Apollo-Dominion War and capitalizing on the post-war chaos period. It overwhelms other civilizations through multiverse exploration and interdimensional technology. While the danger of the Hegemony Paradox with Tiera is pointed out, it cooperates with Elesion in technological fields. Current President Arzen Carline hosted the first United Cosmic Assembly. The first leader was Master Quincius, who highly valued the Celia era and positioned it as a successor civilization. Successive leaders have maintained the philosophy of inheriting Celia's legacy, forming the spiritual foundation of Granbel's economic prosperity.",
    era: "現在",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],

    leaders: [
      {
        id: "アルゼン・カーリーン" as WikiId as WikiId,
        name: "アルゼン・カーリーン",
        nameEn: "Alzen Carine",
        role: "グランベル大統領",
        era: "現在",
      },
      {
        id: "マスター・クインシアス" as WikiId as WikiId,
        name: "マスター・クインシアス",
        nameEn: "Master Quinsias",
        role: "グランベル初期リーダー",
        era: "歴史上",
      },
    ],
  },{
    id: "ティエリア" as WikiId,
    name: "ティエリア",
    nameEn: "Tyeria",
    category: "用語",
    subCategory: "宇宙文明",
    description:
      "宇宙ランキング第3位。軍事技術において宇宙最高峰。圧倒的な艦隊と卓越した戦術力で知られ、宇宙規模の防衛ネットワークを構築。総帥グレイモンド・ハウザーが「軍事力なくして平和は守れない」と主張。近年は軍事技術の輸出を経済基盤として活用。グランベルとの間にヘゲモニー・パラドックスの危険性が指摘されている。歴代総帥の系譜は軍事技術の蓄積とともに受け継がれ、グレイモンド・ハウザーは現実主義的路線を確立した。グランベルとの対話も継続し、ヘゲモニー・パラドックス回避に向けた外交努力を行っている。",
    descriptionEn:
      "Ranked third in the cosmic rankings. Possesses the pinnacle of military technology in the universe. Known for its overwhelming fleet and superior tactical capabilities, it has built a cosmic-scale defense network. Supreme Commander Graymond Houser advocates that 'peace cannot be protected without military power.' In recent years, it has utilized military technology exports as an economic base. The danger of the Hegemony Paradox with Granbel has been pointed out. The lineage of supreme commanders has been passed down along with the accumulation of military technology, and Graymond Houser established a realistic policy. It continues dialogue with Granbel and engages in diplomatic efforts to avoid the Hegemony Paradox.",
    era: "現在",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],

    leaders: [
      {
        id: "グレイモンド・ハウザー" as WikiId as WikiId,
        name: "グレイモンド・ハウザー",
        nameEn: "Greymond Hauser",
        role: "ティエリア総帥",
        era: "現在",
      },
    ],
  },{
    id: "エレシオン" as WikiId,
    name: "エレシオン",
    nameEn: "Elyseon",
    category: "用語",
    subCategory: "宇宙文明",
    description:
      "宇宙ランキング第2位。医療技術と環境再生技術で宇宙をリード。女王リアナ・ソリスの下、平和主義・技術共有推進の外交姿勢で幅広い支持を得る。「生命の維持と再生」を文明の根幹に置き、支配や経済的優位性ではなく技術援助を通じて影響力を行使。第一回宇宙連合会合でティエリアの軍拡に反対した。歴代女王は「生命の維持と再生」を文明の根幹とし、平和主義外交を貫く伝統を受け継ぎ、技術共有推進の伝統は他文明圏からの広範な支持を集めている。",
    descriptionEn:
      "Ranked second in the cosmic rankings. Leads the universe in medical technology and environmental regeneration technology. Under Queen Riana Solis, it has gained broad support with a diplomatic stance promoting pacifism and technology sharing. It places 'the preservation and regeneration of life' at the core of its civilization and exercises influence through technical assistance rather than domination or economic superiority. It opposed Tiera's military expansion at the first United Cosmic Assembly. Successive queens have inherited the tradition of placing 'the preservation and regeneration of life' at the core of their civilization and adhering to pacifist diplomacy, and the tradition of promoting technology sharing has garnered broad support from other civilizations.",
    era: "現在",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],

    leaders: [
      {
        id: "女王リアナ・ソリス" as WikiId as WikiId,
        name: "女王リアナ・ソリス",
        nameEn: "Queen Liana Solis",
        role: "エレシオン女王",
        era: "現在",
      },
    ],
  },{
    id: "ファルージャ" as WikiId,
    name: "ファルージャ",
    nameEn: "Fallujah",
    category: "用語",
    subCategory: "宇宙文明",
    description:
      "宇宙ランキング第4位。経済力では上位勢力に劣るが、文化的影響力と外交力で他の追随を許さない。宇宙中の文明間交流を主導し、対立する勢力間の調停役として機能。評議会代表マドリス・カーネルが「文化の力が宇宙全体を結びつける鍵になる」と主張。歴代代表は文化的外交を重んじ、対立勢力間の調停役として機能してきた。エレシオンの女王リアナ・ソリスとは平和・技術共有の理念で連携し、宇宙外交の穏健派を形成している。",
    descriptionEn:
      "Ranked fourth in the cosmic rankings. While inferior to top powers in economic strength, its cultural influence and diplomatic power are unmatched. It leads inter-civilizational exchanges throughout the universe and functions as a mediator between opposing forces. Council Representative Madris Carnel asserts that 'the power of culture is the key that binds the entire universe together.' Successive representatives have valued cultural diplomacy and have functioned as mediators between opposing forces. It cooperates with Elesion's Queen Riana Solis in the理念 of peace and technology sharing, forming the moderate faction in cosmic diplomacy.",
    era: "現在",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],

    leaders: [
      {
        id: "マドリス・カーネル" as WikiId as WikiId,
        name: "マドリス・カーネル",
        nameEn: "Madrisernel",
        role: "ファルージャ評議会代表",
        era: "現在",
      },
    ],
  },{
    id: "ディオクレニス" as WikiId,
    name: "ディオクレニス",
    nameEn: "Dioclenis",
    category: "用語",
    subCategory: "宇宙文明",
    description:
      "宇宙ランキング第5位。宇宙探査と科学技術研究の最前線。未知の次元や新しい惑星系の開拓を続け、研究成果は他勢力の重要インフラ。科学宰相ネイサン・コリンドがヘゲモニー・パラドックスを科学的に指摘し、対立のエネルギーを共同宇宙探査へ転換する提案を行った。歴代宰相は宇宙探査を国家の使命とし、ヘゲモニー・パラドックス回避のため対立のエネルギーを共同宇宙探査へ転換する提案を継続的に実施している。",
    descriptionEn:
      "Ranked fifth in the cosmic rankings. At the forefront of cosmic exploration and scientific technology research. It continues to explore unknown dimensions and new planetary systems, with its research results serving as important infrastructure for other powers. Science Minister Nathan Corind scientifically pointed out the Hegemony Paradox and proposed converting the energy of conflict into joint cosmic exploration. Successive ministers have considered cosmic exploration as the nation's mission and have continuously proposed converting the energy of conflict into joint cosmic exploration to avoid the Hegemony Paradox.",
    era: "現在",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],

    leaders: [
      {
        id: "ネイサン・コリンド" as WikiId as WikiId,
        name: "ネイサン・コリンド",
        nameEn: "Nathan Corlind",
        role: "ディオクレニス科学宰相",
        era: "現在",
      },
    ],
  },{
    id: "アポロン文明圏" as WikiId,
    name: "アポロン文明圏",
    nameEn: "Apollon",
    category: "用語",
    subCategory: "歴史",
    description:
      "かつて宇宙に名を馳せた巨大文明圏。最盛期GDP125兆ドル。中核惑星アポロン・セントラリスを拠点に、強力な軍事組織「アポロンの騎士団」を擁した。リーダー・ロナン・アーサがセリアに同盟を提案したが拒絶され全面戦争に発展。ヴェノム艦隊に敗れロナンは戦死。大戦後GDP32兆ドルに激減し現在は主要勢力から脱落。",
    descriptionEn:
      "A great civilization that once flourished in space. Its GDP reached 125 trillion dollars at its peak. Based on the core planet Apollo Centralis, it possessed a powerful military organization called the Knights of Apollo. Leader Ronan Arsa proposed an alliance to Seria, but was rejected, leading to all-out war. Defeated by the Venom fleet, Ronan was killed in battle. After the great war, the GDP plummeted to 32 trillion dollars, and it has since fallen from being a major power.",
    era: "歴史上",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],

    leaders: [
      {
        id: "ロナン・アーサ" as WikiId as WikiId,
        name: "ロナン・アーサ",
        nameEn: "Ronan Arthur",
        role: "アポロン文明圏リーダー",
        era: "大戦期",
      },
    ],
  },{
    id: "Selinopolis" as WikiId,
    name: "Selinopolis（ドミニオン）",
    nameEn: "Selinopolis / Dominion",
    category: "用語",
    subCategory: "歴史",
    description:
      "セリア・ドミニクスがGigapolisを掌握後に改名した都市国家。GDP25兆ドルに急成長。次元エネルギー技術の商業化と女性主導社会を確立。超巨大企業Phovosを設立。エヴァトロンと同盟してアポロンと大戦し勝利したがGDPは23兆ドルに激減。戦後エヴァトロンに吸収されセリアは追放。その遺産は現在のE16系に大きな影響を与えている。",
    descriptionEn:
      "The city-state that Seria Dominikus renamed after taking control of Gigapolis. It grew rapidly to a GDP of 25 trillion dollars. Commercialized dimensional energy technology and established a female-led society. Founded the mega-corporation Phovos. Allied with Evatron and won the great war against Apollo, but the GDP plummeted to 23 trillion dollars. After the war, it was absorbed by Evatron and Seria was exiled. Its legacy has had a significant impact on the current E16 system.",
    era: "歴史上",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],

    leaders: [
      {
        id: "セリア・ドミニクス" as WikiId as WikiId,
        name: "セリア・ドミニクス",
        nameEn: "Celia Dminix",
        role: "Selinopolis/Dominion統治者",
        era: "E335〜E370",
      },
    ],
  },{
    id: "宇宙連合会合" as WikiId,
    name: "宇宙連合会合",
    nameEn: "Universal Federation Summit",
    category: "用語",
    subCategory: "歴史",
    description:
      "グランベルの首都オルダシティで開催された第一回宇宙連合会合。アルゼン・カーリーン（共存繁栄）、グレイモンド・ハウザー（軍事力の必要性）、リアナ・ソリス（平和・技術共有）、マドリス・カーネル（文化の力）、ネイサン・コリンド（ヘゲモニー・パラドックス回避・共同探査）が演説。宇宙秩序の構築に向けた対話が始まった。",
    descriptionEn:
      "The first United Nations of Space meeting, held in the capital of Granbel, Oldacity. Speakers included Arsen Karin (coexistence and prosperity), Graymond Hauser (necessity of military power), Liana Solis (peace and technology sharing), Madris Karnel (power of culture), and Nathan Corind (avoiding the hegemony paradox and joint exploration). Dialogue began to build a cosmic order.",
    era: "現在（E528〜）",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },{
    id: "アポロン・Dominion大戦" as WikiId,
    name: "アポロン・Dominion大戦",
    nameEn: "Apollon Dominion War",
    category: "用語",
    subCategory: "戦争・歴史事件",
    description:
      "アポロン文明圏とDominion（セリア率いるSelinopolis）の全面戦争。E370年に宣戦布告。E375年にアポロンがケンタウロスレーザー発射、E378年にセリアがG4ファントムパルスで応戦。E385年にセリアのヴェノム艦隊がアポロン・セントラリスを攻略・爆砕し戦争終結。両文明とも壊滅的損害を受け、宇宙秩序は大きく変容した。なおE400年のエヴァトロンによるGigapolis占領は戦争終結とは別事象である。",
    descriptionEn:
      "The all-out war between the Apollo civilization and Dominion (led by Seria of Selinopolis). War was declared in E370. In E375, Apollo fired the Centaurus Laser, and in E378, Seria responded with the G4 Phantom Pulse. In E385, Seria's Venom fleet captured and shattered Apollo Centralis, ending the war. Both civilizations suffered devastating losses, and the cosmic order was greatly transformed. Note that the occupation of Gigapolis by Evatron in E400 is a separate event from the end of the war.",
    era: "E370〜E385",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },{
    id: "オルダシティ" as WikiId,
    name: "オルダシティ",
    nameEn: "Olda City",
    category: "用語",
    subCategory: "地理",
    description:
      "グランベルの首都。次元間通信技術の発祥地、量子経済の中心地。宇宙で最も発展した都市。オルダ・プライムホールは次元の歪みを利用して設計され数万人収容可能。第一回宇宙連合会合開催地。",
    descriptionEn:
      "The capital of Granbel. The birthplace of interdimensional communication technology and the center of the quantum economy. The most developed city in the universe. The Olda Prime Hall was designed using dimensional distortions and can accommodate tens of thousands of people. Venue for the first United Nations of Space meeting.",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },{
    id: "アポロン・セントラリス" as WikiId,
    name: "アポロン・セントラリス",
    nameEn: "Apollon Centralis",
    category: "用語",
    subCategory: "地理",
    description:
      "アポロン文明圏の中核惑星。全軍事力はここから動員された。アポロン・Dominion大戦の最終局面でセリアのヴェノム艦隊に攻略・爆砕され、アポロン文明圏壊滅の象徴となった。",
    descriptionEn:
      "The core planet of the Apollo civilization. All military forces were mobilized from here. In the final phase of the Apollo-Dominion war, it was captured and shattered by Seria's Venom fleet, becoming a symbol of the destruction of the Apollo civilization.",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },{
    id: "ヘゲモニー・パラドックス" as WikiId,
    name: "ヘゲモニー・パラドックス",
    nameEn: "Hegemony Paradox",
    category: "用語",
    subCategory: "宇宙文明圏",
    description:
      "新興大国と現存大国の間に不可避的に対立が生じる国際関係理論。ディオクレニスのネイサンが提起し、グランベル（経済1位）とティエリア（軍事3位）の関係にこの罠の危険性を指摘。かつてのアポロン・Dominion関係も同様の構造だった。",
    descriptionEn:
      "An international relations theory that inevitably creates conflict between emerging and existing great powers. Proposed by Diocles' Nathan, who pointed out the danger of this trap in the relationship between Granbel (economic rank 1) and Tierra (military rank 3). The former Apollo-Dominion relationship had a similar structure.",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },{
    id: "EVILS" as WikiId,
    name: "イビルス",
    nameEn: "EVILS",
    category: "用語",
    subCategory: "技術・概念",
    description:
      "次元間に存在する超越的生命体群の総称。正式名称は不明であり、「EVILS」はE16文明圏が便宜上付けた呼称である。高次元領域に起源を持ち、物理法則を超越した能力を持つ。リーダーはオメガ＝ユリシス。一部のEVILSはディストーター（Dystroyer）と呼ばれる破壊的な個体であり、物理空間に顕現すると周囲の次元構造を崩壊させる危険性を持つ。ZAMLTの5企業のリーダーたちは虚無の塔（Tower of the Void）でオメガ＝ユリシスと秘密会合を持ち、次元安定化を条件に一定の取引を行ったとされるが、この協力関係は最終的に破綻した。EVILSの存在は次元極地平技術のリスクを象徴するものであり、次元境界へのアクセスがもたらす予期せぬ脅威としてE16文明圏の安全保障上の最大の懸念事項の一つとなっている。E340年のスライム・ウーマン顕現もEVILSの次元的活動との関連が疑われている。",
    descriptionEn:
      "A collective term for transcendent life forms existing between dimensions. The official name is unknown, and 'EVILS' is a term given by the E16 civilization for convenience. Originating from higher-dimensional realms, they possess abilities that transcend physical laws. Their leader is Omega=Ulysses. Some EVILS are called Distorters (Dystroyers), destructive entities that pose a danger of collapsing the dimensional structure of their surroundings when they manifest in physical space. It is said that the leaders of ZAMLT's five companies held a secret meeting with Omega=Ulysses at the Tower of the Void and made a certain deal on the condition of dimensional stabilization, but this cooperative relationship eventually broke down. The existence of EVILS symbolizes the risks of dimensional horizon technology and has become one of the biggest security concerns for the E16 civilization as an unexpected threat brought by access to dimensional boundaries. The manifestation of the Slime Woman in E340 is also suspected to be related to the dimensional activities of EVILS.",

    leaders: [
      {
        id: "オメガ＝ユリシア" as WikiId as WikiId,
        name: "オメガ＝ユリシア",
        nameEn: "Omega=Ulysses",
        role: "EVILSリーダー",
        era: "E318年頃",
      },
    ],
  },{
    id: "term-東暦紀年法" as WikiId,
    name: "東暦紀年法",
    nameEn: "Eastern Calendar System",
    category: "用語",
    subCategory: "社会制度",
    description:
      "E1＝AD3501を元年とするE16文明圏の標準暦法。地球からM104銀河への最初の入植船団がシンフォニー・オブ・スターズに到達した年を基準としている。東暦（E暦）は1年を地球の約1.02年に換算し、シンフォニー・オブ・スターズの自転周期（44時間4分）に基づく独自の月・週・日システムを併用する。暦法の名称はM104銀河が地球から見て東方向に位置することに由来し、入植者たちが故郷との精神的繋がりを保つ意図が込められている。東暦はバーズ帝国の設立（E15年）から銀河系コンソーシアム設立（E520年）に至る全歴史的出来事を記述する絶対的時間基準として機能している。",
    descriptionEn:
      "The standard calendar system of the E16 civilization, with E1=AD3501 as its first year. It is based on the year when the first colonization fleet from Earth reached Symphony of Stars. The Eastern Calendar (E-calendar) converts one year to approximately 1.02 Earth years and uses its own unique month, week, and day system based on the rotation period of Symphony of Stars (44 hours 4 minutes). The name of the calendar originates from the fact that the M104 galaxy is located eastward from Earth's perspective, and includes the intention of the settlers to maintain a spiritual connection with their homeland. The Eastern Calendar functions as an absolute time standard describing all historical events from the establishment of the Birds Empire (E15) to the founding of the Galactic Consortium (E520).",
  },{
    id: "term-E0の定義" as WikiId,
    name: "E0の定義",
    nameEn: "Definition of E0",
    category: "用語",
    subCategory: "歴史",
    description:
      "東暦元年（E0）は地球暦AD3501年に相当し、入植船団がシンフォニー・オブ・スターズに到達した年として定義される。E0以前の期間は「地球期」と呼ばれ、地球から出発した移民集団の数百年にわたる星間航行期間を指す。E0の正確な定義は東暦初期に論争があり、一部の入植者は最初の惑星軌道到達日をE0と主張したが、最終的にシンフォニー・オブ・スターズへの着陸日が採用された。E0はバーズ帝国建国（E15年）の前提条件であり、入植者たちが新たな文明の時間を刻み始めた象徴的な起点である。ティムール・シャーの10次元ホラズム理論もE0年頃に構想された。",
    descriptionEn:
      "Eastern Calendar Year 0 (E0) corresponds to Earth calendar AD3501 and is defined as the year when the colonization fleet reached Symphony of Stars. The period before E0 is called the 'Earth Era,' referring to the centuries-long interstellar navigation period of the immigrant groups that departed from Earth. The exact definition of E0 was controversial in the early Eastern Calendar, with some settlers advocating for the first planetary orbit arrival day as E0, but ultimately the landing day at Symphony of Stars was adopted. E0 is a prerequisite for the founding of the Birds Empire (E15) and serves as a symbolic starting point when settlers began marking the time of a new civilization. Timur Shah's ten-dimensional Khwarazm theory was also conceived around E0.",
  },{
    id: "term-暦変換規則" as WikiId,
    name: "暦変換規則",
    nameEn: "Calendar Conversion Rules",
    category: "用語",
    subCategory: "社会制度",
    description:
      "東暦（E暦）と地球暦（西暦・AD）の間の換算規則で、基本公式は「E年＝AD年−3500」である。東暦E500年は西暦4001年に相当する。ただしシンフォニー・オブ・スターズの自転周期（44時間4分）と公転周期の違いにより、東暦1年は地球の約1.02年に相当し、日単位の正確な換算には補正係数が必要である。E16連星系内の他惑星には独自の暦が併用されており、惑星ビブリオでは学術暦、Eros-7ではマトリカル暦が使用されている。銀河系コンソーシアム設立後は、宇宙文明圏間の共通時間基準を確立するため、グランベル主導で標準宇宙暦の制定が進められている。",
    descriptionEn:
      "The conversion rule between the Eastern Calendar (E-calendar) and Earth calendar (Western calendar/AD), with the basic formula being 'E year = AD year - 3500'. Eastern Calendar E500 corresponds to Western Calendar 4001. However, due to the difference between the rotation period (44 hours 4 minutes) and orbital period of Symphony of Stars, one Eastern Calendar year equals approximately 1.02 Earth years, requiring a correction factor for accurate day-by-day conversion. Other planets in the E16 star system have their own calendars used concurrently: the Academic Calendar on Planet Vibrio and the Matric Calendar on Eros-7. After the founding of the Galactic Consortium, the development of a Standard Universal Calendar has been promoted under Granbel's leadership to establish a common time standard between space civilizations.",
  },{
    id: "term-A籍制度" as WikiId,
    name: "A籍制度",
    nameEn: "A-Registry System",
    category: "用語",
    subCategory: "社会制度",
    description:
      "E16連星系の包括的な市民身分証明・階級管理制度で、旅券機能と社会的地位の指標を兼ね備えている。A籍はZ1（最高位・政治指導者クラス）からZ50（最低位・無国籍相当）までの階級があり、各階級は居住区域のアクセス権、nトークンの取引限度額、公的サービスの利用範囲、宇宙港利用の優先度などを規定する。バーズ帝国期に原型が構想され、パクス・ロンバルディカ期に企業の従業員管理システムとして整備、ZAMLT期には社会階級の固定化装置として悪用された。ネオクラン同盟とUECOの下で階級緩和が進められているが、格差の完全解消には至っていない。惑星ビブリオのアカデミアに最高等級記録館が置かれ、全市民データのバックアップを保管している。",
    descriptionEn:
      "A comprehensive citizenship and class management system in the E16 star system, serving both as a passport and an indicator of social status. Class A ranges from Z1 (highest rank - political leadership class) to Z50 (lowest rank - stateless equivalent), with each class regulating access to residential areas, transaction limits for n-tokens, scope of public service usage, and priority of spaceport use. Its prototype was conceived during the Birds Empire period, developed as an employee management system for corporations during the Pax Lombardica period, and abused as a device for class固化 during the ZAMLT period. Class relaxation has progressed under the Neo-Clan Alliance and UECO, but complete elimination of disparities has not been achieved. The highest-level record archive is located at Academia on Planet Vibrio, storing backup data for all citizens.",
  },{
    id: "term-nトークン経済" as WikiId,
    name: "nトークン経済",
    nameEn: "n-Token Economy",
    category: "用語",
    subCategory: "経済",
    description:
      "E16連星系の基軸通貨制度で、セリア黄金期に確立されたnトークンを中心に運用されている経済システム。最大の特徴は物質的資産だけでなく、文化的貢献、知識の共有、芸術的創造活動、社会的奉仕も経済的価値として評価・換金できる点にある。フェルミ音楽の演奏、次元極地平技術の研究、医療サービスの提供などもnトークンで報酬を受け取ることができる。ZAMLT期にはnトークンの集中化が進み不平等を拡大したが、UECO統合後は分散型台帳技術の導入で透明性が向上した。ロレンツィオ国際大学が算出する「文化・知識指数」を基準に定期調整され、E16文明圏独自の価値観を反映した革新的な経済モデルとして宇宙中から注目されている。",
    descriptionEn:
      "An economic system centered on n-tokens established during the Celian Golden Age in the E16 star system's base currency system. Its greatest feature is that not only material assets but also cultural contributions, knowledge sharing, artistic creative activities, and social service can be evaluated and monetized as economic value. Rewards can be received in n-tokens for performing Fermi music, researching dimensional horizon technology, providing medical services, etc. During the ZAMLT era, the concentration of n-tokens progressed and widened inequality, but after UECO integration, transparency improved with the introduction of distributed ledger technology. It is periodically adjusted based on the 'Culture-Knowledge Index' calculated by the Lorenzo International University, and as an innovative economic model reflecting the unique values of the E16 civilization zone, it is attracting attention throughout the universe.",
  },{
    id: "term-ギガポリス通貨システム" as WikiId,
    name: "ギガポリス通貨システム",
    nameEn: "Gigapolis Currency System",
    category: "用語",
    subCategory: "経済",
    description:
      "GigapolisにおいてE150年のマーストリヒト革命で完全自由経済が宣言されて以降、急速に発展した複雑な金融・通貨システム。ギガポリスではnトークンのほか、企業独自の社内通貨、地区限定の地域通貨、 clandestine marketsで流通する地下通貨など多層的な通貨体系が併存している。E301年のZAMLT設立により金融システムが一元化されたが、ZAMLT崩壊後は再び多層化が進んだ。テクノ文化ルネサンス期にはブロックチェーン技術を応用した分散型決済システムが導入され、サウス・マーケットを中心に活発なnトークン経済が展開されている。マーケット・コアの取引所を通じたギガポリスと他惑星間の通貨換換はリアルタイムで行われ、E16連星系の金融安定に直結している。",
    descriptionEn:
      "A complex financial and currency system that developed rapidly in Gigapolis after the complete free economy was declared in the Maastricht Revolution of E150. In Gigapolis, a multi-layered currency system coexists, including n-tokens, company-specific internal currencies, region-limited local currencies, and underground currencies circulating in clandestine markets. With the establishment of ZAMLT in E301, the financial system was centralized, but after ZAMLT's collapse, multi-layering progressed again. During the Techno Cultural Renaissance period, a distributed payment system using blockchain technology was introduced, and an active n-token economy is developing centered around the South Market. Currency exchange between Gigapolis and other planets through the exchanges in Market Core is conducted in real time, directly linking to the financial stability of the E16 star system.",
  },{
    id: "term-レア度分類" as WikiId,
    name: "レア度分類",
    nameEn: "Rarity Classification System",
    category: "用語",
    subCategory: "社会制度",
    description:
      "E16文明圏で広く使用されるアイテム・能力・人物の希少性評価システム。レア度はCommon（コモン）、Uncommon（アンコモン）、Rare（レア）、Epic（エピック）、Legendary（レジェンダリー）、Mythic（ミシック）の6段階に分類され、各段階はnトークンでの取引価格やA-Registryの特権に直接影響する。スティル・アレーナの出場資格やIRISランキングの算定にもレア度が考慮され、社会的評価の重要な指標となっている。レア度の判定基準はUECOが管理する中央評価委員会によって定期的に見直され、新技術の普及や社会構造の変化に応じて調整される。AURALISのメンバーの多くはLegendary以上のレア度を持ち、アルファ・ケインやジェンはMythicに分類されている。",
    descriptionEn:
      "A rarity evaluation system for items, abilities, and characters widely used in the E16 civilization zone. Rarity is classified into six levels: Common, Uncommon, Rare, Epic, Legendary, and Mythic, with each level directly affecting trading prices in n-tokens and privileges in the A-Registry. Rarity is also considered for qualification in the Still Arena and calculation of the IRIS ranking, serving as an important indicator of social evaluation. The criteria for determining rarity are regularly reviewed by the Central Evaluation Committee managed by UECO and adjusted according to the popularization of new technologies and changes in social structure. Many members of AURALIS have a rarity of Legendary or higher, and Alpha Cain and Jen are classified as Mythic.",
  },{
    id: "term-戦闘力指数" as WikiId,
    name: "戦闘力指数",
    nameEn: "Combat Power Index",
    category: "用語",
    subCategory: "社会制度",
    description:
      "E16文明圏で個人の戦闘能力を数値化した指標で、IRISランキングシステムの基礎データとして使用される。戦闘力指数は筋力、反応速度、次元操作能力、戦術的判断力、装備品の性能などの複合要素をAI評価システムによって算出し、0〜999のスケールで表示される。900以上を「Tier 1（神格級）」、500〜899を「Tier 2（上位級）」、100〜499を「Tier 3（中堅級）」、100未満を「Tier 4（一般級）」に分類する。アルファ・ケインはギガポリス解放戦時に計測不能の指数を記録し、ジェンはLv938+として現在も最高水準を維持している。戦闘力指数はスティル・アレーナの出場資格審査と軍事組織の人材配置に不可欠な指標であり、UECOの安全保障政策の中核データとなっている。",
    descriptionEn:
      "A metric that quantifies an individual's combat ability in the E16 civilization zone, used as fundamental data for the IRIS ranking system. The combat power index is calculated by an AI evaluation system based on composite elements such as physical strength, reaction speed, dimensional manipulation ability, tactical judgment, and equipment performance, displayed on a scale of 0-999. Those with 900 or above are classified as 'Tier 1 (Divine Level)', 500-899 as 'Tier 2 (High Level)', 100-499 as 'Tier 3 (Mid Level)', and below 100 as 'Tier 4 (General Level)'. Alpha Cain recorded an immeasurable index during the Gigapolis Liberation War, and Jen maintains the current highest level at Lv938+. The combat power index is an essential metric for qualification review in the Still Arena and personnel allocation in military organizations, forming core data in UECO's security policy.",
  },{
    id: "term-IRISランキングシステム" as WikiId,
    name: "IRISランキングシステム",
    nameEn: "IRIS Ranking System",
    category: "用語",
    subCategory: "社会制度",
    description:
      "E16文明圏の戦闘員・能力者の実力を格付けする公式ランキングシステムで、ヒーローエージェンシーによって管理されている。IRISランキングは戦闘力指数を基礎としつつ、実戦での勝敗記録、ミッションの達成度、社会的貢献度などの多角的な評価要素を組み合わせて総合順位を決定する。現在のランキング1位はアイリス、2位はフィオナ、3位はマリーナ・ボビン、4位はセバスチャン・ヴァレリウス、5位はカスチーナ・テンペストである。ランキング上位者には特別なnトークン報酬とA-Registry上の名誉階位が与えられ、軍事的・外交的な発言力にも直結する。ランキングの改定は四半期ごとに行われ、スティル・アレーナの結果が大きな影響を与える。銀河系コンソーシアム設立後は宇宙文明圏全体へのランキング拡張が検討されている。",
    descriptionEn:
      "An official ranking system that rates the strength of combatants and ability users in the E16 civilization zone, managed by the Hero Agency. The IRIS ranking is based on the combat power index but combines multifaceted evaluation elements such as win-loss records in actual combat, mission achievement, and social contribution to determine the overall ranking. The current ranking is: 1st place Iris, 2nd Fiona, 3rd Marina Bobbin, 4th Sebastian Valerius, 5th Castina Tempest. Top-ranking individuals receive special n-token rewards and honorary ranks in the A-Registry, which directly relates to military and diplomatic influence. The ranking is revised quarterly, with results from the Still Arena having a significant impact. After the establishment of the Galactic Consortium, expansion of the ranking to the entire cosmic civilization zone is being considered.",
  },{
    id: "term-IRIS世界観" as WikiId,
    name: "IRIS世界観",
    nameEn: "IRIS Worldview",
    category: "用語",
    subCategory: "歴史",
    description:
      "アイリスを主人公とする一連の物語が描くE16文明圏の世界的視点で、クレセント大地方を中心に展開する政治的・軍事的な群像劇である。IRIS世界観はV7とトリニティ・アライアンスの対立構造、シルバー・ヴェノムとアルファ・ヴェノムの暗躍、フィオナの裏切りなど、クレセント地方における複雑な権力ゲームを体系的に描いている。アイリスのランキング1位への道のり、シルバー・ヴェノムへの捕囚（E510年）と再救出（E519年）、トリニティ・アライアンス指導者への転身という叙事は、E16文明圏における「個人の力と運命」のテーマを体現している。IRIS世界観は公式サイトIris Worldsで全編が公開されている。",
    descriptionEn:
      "A global perspective of the E16 civilization zone depicted in a series of stories featuring Iris as the protagonist, a political and military ensemble drama centered in the Crescent Great Region. The IRIS worldview systematically portrays the complex power games in the Crescent Region, including the confrontational structure between V7 and the Trinity Alliance, the covert activities of Silver Venom and Alpha Venom, and Fiona's betrayal. The narrative of Iris's journey to the top ranking, her capture by Silver Venom (E510) and subsequent rescue (E519), and her transformation into the leader of the Trinity Alliance embodies the theme of 'individual power and destiny' in the E16 civilization zone. The complete IRIS worldview is available on the official website Iris Worlds.",
  },{
    id: "term-セリア黄金期の社会制度" as WikiId,
    name: "セリア黄金期の社会制度",
    nameEn: "Social System of Celia Golden Age",
    category: "用語",
    subCategory: "歴史",
    description:
      "E335年からE370年のセリア黄金期に確立された独特の社会統治体制。セリア・ドミニクスはZAMLTを打倒した後、超巨大企業Phovosを設立して次元エネルギー技術の商業化を推進し、GDP25兆ドル規模の経済基盤を構築した。この社会制度の最大の特徴は「文化と経済の融合」であり、フェルミ音楽の演奏やAURALISの芸術活動がnトークンで評価され、文化的貢献が直接経済的報酬に結びつく画期的な仕組みであった。セリアは女性主導社会の原型も構築し、主要な意思決定機関に女性が多数を占める体制を確立した。この社会制度はAURALIS第一世代の最盛期を支え、E16文明圏の文化的アイデンティティの基盤となったが、過剰な楽観主義とZAMLTの台頭によって急速に崩れていった。",
    descriptionEn:
      "A unique social governance system established during the Celian Golden Age from E335 to E370. After overthrowing ZAMLT, Celia Dominikus founded the mega-corporation Phovos to promote the commercialization of dimensional energy technology, building an economic foundation with a GDP of 25 trillion dollars. The greatest feature of this social system was the 'fusion of culture and economy,' where Fermi music performances and AURALIS artistic activities were evaluated in n-tokens, creating a groundbreaking mechanism where cultural contributions directly linked to economic rewards. Celia also established the prototype of a female-led society, ensuring that women formed the majority in key decision-making bodies. This social system supported the peak of the first generation of AURALIS and became the foundation of the cultural identity of the E16 civilization sphere, but it rapidly collapsed due to excessive optimism and the rise of ZAMLT.",
  },{
    id: "term-エヴァトロン体制の法体系" as WikiId,
    name: "エヴァトロン体制の法体系",
    nameEn: "Evatron Legal System",
    category: "用語",
    subCategory: "法規",
    description:
      "E400年からE475年のエヴァトロン支配期にGigapolisおよび西大陸全域に適用された独裁的法体系。エヴァトロンの初代リーダー・グリム・ダルゴスが制定したこの法体系は、市民の基本的人権を大幅に制限し、表現の自由、集会の自由、移動の自由を厳しく規制した。特にAURALISを弾圧し、芸術・文化活動を「秩序を乱す反社会的行為」として法的に禁止した点が最も批判を浴びている。極秘部隊Σ-Unitの設立を法的に正当化する特別法も整備され、精神操作研究と生体改造実験を法的灰色地帯で実施した。テリアン反乱（E400〜E470年）はこの法体系に対する大規模な市民の抵抗であり、E475年の崩壊後はネオクラン同盟主導で民主的な法改革が実施された。",
    descriptionEn:
      "A dictatorial legal system applied to Gigapolis and the entire Western Continent during the Evatron rule from E400 to E475. Established by Evatron's first leader, Grimm Dargos, this legal system significantly restricted citizens' basic human rights and strictly regulated freedom of expression, assembly, and movement. It is most criticized for its suppression of AURALIS and the legal prohibition of artistic and cultural activities as 'socially disruptive acts that disturb order.' Special laws were also established to legally justify the formation of the secret unit Σ-Unit, conducting mental manipulation research and biological modification experiments in a legal gray area. The Terian Rebellion (E400-E470) was a large-scale citizen resistance against this legal system, and after its collapse in E475, democratic legal reforms were implemented under the leadership of the Neo-Clan Alliance.",
  },{
    id: "term-ポスト・エヴァトロン秩序" as WikiId,
    name: "ポスト・エヴァトロン秩序",
    nameEn: "Post-Evatron Order",
    category: "用語",
    subCategory: "歴史",
    description:
      "E475年のエヴァトロン崩壊後に形成された新しい政治・社会秩序の総称。ポスト・エヴァトロン秩序はエヴァトロンの独裁的支配の教訓から、分散統治、市民参加型政治、人権の尊重を基本原理としている。ネオクラン同盟の設立（E325年〜）が思想的基盤となり、UECOの星間経済協同組合が経済的框架を提供し、テクノ文化ルネサンス（E475〜E500年）が文化的基盤を形成した。この秩序はA-Registryの階級制度の緩和、nトークン経済の民主化、次元極地平技術の民用化という三本の柱で支えられている。しかしシルバー・ヴェノムやアルファ・ヴェノムの出現は、ポスト・エヴァトロン秩序の脆弱性を露呈し、V7とトリニティ・アライアンスの対立構造という新たな課題をもたらしている。",
    descriptionEn:
      "A general term for the new political and social order formed after the collapse of Evatron in E475. The Post-Evratron Order, drawing lessons from Evatron's dictatorial rule, is based on the fundamental principles of decentralized governance, citizen-participatory politics, and respect for human rights. The establishment of the Neo-Clan Alliance (E325-) provided the ideological foundation, the UECO Interspace Economic Cooperative provided the economic framework, and the Technocultural Renaissance (E475-E500) formed the cultural foundation. This order is supported by three pillars: the mitigation of the A-Registry class system, the democratization of the n-token economy, and the civilian use of dimensional horizon technology. However, the emergence of Silver Venom and Alpha Venom exposed the vulnerabilities of the Post-Evratron Order, bringing new challenges in the form of the confrontation structure between V7 and the Trinity Alliance.",
  },{
    id: "term-E16の度量衡" as WikiId,
    name: "E16の度量衡",
    nameEn: "E16 Weights and Measures",
    category: "用語",
    subCategory: "文化",
    description:
      "E16連星系で使用される独自の度量衡システム。シンフォニー・オブ・スターズの表面重力（0.92G）と自転周期（44時間4分）を基準に定義されており、地球の度量衡とは微妙に異なる。長さの基本単位は「スタンダード（Std）」で地球のメートルの約1.04倍に相当し、質量の基本単位は「グラビ（Gv）」で地球のキログラムの約0.96倍である。通貨単位はnトークンで、1nT（ナノ・トークン）が最小単位である。E16連星系統一後も一部の惑星で地球の度量衡が併用されていたが、パクス・ロンバルディカ期に完全に統一された。銀河系コンソーシアム設立後は、他宇宙文明圏との取引のために換算レートが標準化されている。",
    descriptionEn:
      "A unique system of measurement used in the E16 star system. Defined based on the surface gravity (0.92G) and rotation period (44 hours 4 minutes) of the Symphony of Stars, it subtly differs from Earth's measurement system. The basic unit of length is the 'Standard (Std)', equivalent to approximately 1.04 times Earth's meter, and the basic unit of mass is the 'Gravi (Gv)', equivalent to approximately 0.96 times Earth's kilogram. The currency unit is the n-token, with 1nT (nano-token) being the smallest unit. After the unification of the E16 star system, Earth's measurement system was still used in some planets, but it was completely unified during the Pax Lombardica period. After the establishment of the Galactic Consortium, conversion rates have been standardized for transactions with other cosmic civilization spheres.",
  },{
    id: "term-言語体系" as WikiId,
    name: "言語体系",
    nameEn: "Language System of E16",
    category: "用語",
    subCategory: "文化",
    description:
      "E16文明圏で使用される多層的な言語体系。共通語として「東暦標準語（E16コモン）」が広く使用され、地球の英語・日本語・中国語を基底にした混合言語である。各惑星や地域には独自の言語や方言が存在し、ビブリオでは学術用語を多用した「アカデミア語」、Eros-7では女性主導社会特有の敬語体系を含む「マトリカル語」が日常的に使用されている。フェルミ音楽の歌詞は独特の詩的言語で記述され、AURALISの「名の継承」儀式では古い形式的言語が使用される。テクノ文化ルネサンス期にはOffenbach種との意思疎通のために次元共鳴言語の研究が進められ、感情や感覚を直接伝達する新たなコミュニケーション手段として注目されている。",
    descriptionEn:
      "A multilayered language system used in the E16 civilization sphere. 'East Calendar Standard Language (E16 Common)' is widely used as a common language, a hybrid language based on English, Japanese, and Chinese from Earth. Each planet and region has its own languages and dialects; in Biblio, 'Academia Language' with many academic terms is used, and on Eros-7, 'Matric Language' with a unique honorific system characteristic of a female-led society is used in daily life. Lyrics for Fermi music are written in a unique poetic language, and in AURALIS's 'Name Inheritance' ceremony, an archaic formal language is used. During the Technocultural Renaissance, research on dimensional resonance language was advanced for communication with the Offenbach species, and it is gaining attention as a new means of communication that directly conveys emotions and sensations.",
  },{
    id: "term-教育制度" as WikiId,
    name: "教育制度",
    nameEn: "Education System of E16",
    category: "用語",
    subCategory: "文化",
    description:
      "E16連星系の多層的な教育制度で、A-Registryの階級と密接に連動している。基礎教育（6〜15歳）は全市民に無償で提供され、その後はA-Registryの階級に応じて中等教育・高等教育へのアクセスが異なる。Z1〜Z10の高階級市民は惑星ビブリオのロレンツィオ国際大学やグランベルのオルダシティ・アカデミーへの優先入学権を持ち、Z30以下の低階級市民は地域の職業訓練校に限定される傾向がある。ネオクラン同盟とUECOの下で教育の機会均等化が進められ、テクノ文化ルネサンス期には次元ホールを通じた遠隔教育システムが導入された。E514年にミナ・エウレカ・エルンストがロレンツィオ国際大学AI学部に入学した際、低階級出身からの最高学府への合格は大きな話題となった。",
    descriptionEn:
      "A multilayered education system in the E16 star system, closely linked to the A-Registry class system. Basic education (6-15 years) is provided free of charge to all citizens, after which access to secondary and higher education varies according to A-Registry class. High-class citizens (Z1-Z10) have priority admission rights to Lorenzo International University on the planet Biblio or Old City Academy on Grabel, while low-class citizens (Z30 and below) tend to be limited to regional vocational training schools. Under the Neo-Clan Alliance and UECO, educational equalization has progressed, and during the Technocultural Renaissance, a distance education system through dimensional halls was introduced. When Mina Eureka Ernst entered the AI department of Lorenzo International University in E514, her admission to the highest educational institution from a low-class background became a major topic.",
  },{
    id: "term-芸術・文化運動" as WikiId,
    name: "芸術・文化運動",
    nameEn: "Art and Cultural Movements of E16",
    category: "用語",
    subCategory: "文化",
    description:
      "E16文明圏で興隆した主要な芸術・文化運動の歴史。テクノ宗教運動（E80年頃〜）を嚆矢とし、テミルタロンのサイケデリック・コスモロジーを思想的基盤に次元極地平を芸術的表現の素材とした。セリア黄金期（E335〜E370年）にはフェルミ音楽が最盛期を迎え、AURALIS第一世代が「光と音を永遠にする」理念のもとで総合芸術運動を展開した。エヴァトロン弾圧期（E400〜E475年）には地下芸術運動として「闇のアリア」と呼ばれる抵抗芸術が生まれた。テクノ文化ルネサンス（E475〜E500年）には次元極地平技術の民用化が新たな芸術表現の可能性を開き、AURALIS第二世代（E522年〜）はフェルミ音楽の現代的再解釈とOffenbach種との共創芸術を生み出している。これらの運動はE16文明圏の文化的アイデンティティの基盤を形成している。",
    descriptionEn:
      "History of major art and cultural movements that flourished in the E16 civilization zone. Beginning with the Techno-Religious Movement (around E80), with Timirtaron's psychedelic cosmology as its ideological foundation, it used dimensional horizons as artistic expression. During the Celia Golden Age (E335-E370), Fermi music reached its peak, and the first generation of AURALIS launched a comprehensive art movement under the philosophy of 'making light and sound eternal.' During the Evatron suppression period (E400-E475), a resistance art called 'Dark Aria' emerged as an underground art movement. During the Techno-Cultural Renaissance (E75-E500), the civilian use of dimensional horizon technology opened new possibilities for artistic expression, and the second generation of AURALIS (E522-) has created modern reinterpretations of Fermi music and collaborative art with the Offenbach species. These movements form the foundation of the cultural identity of the E16 civilization zone.",
  },{
    id: "term-宗教観・世界観" as WikiId,
    name: "宗教観・世界観",
    nameEn: "Religious and Worldview of E16",
    category: "用語",
    subCategory: "文化",
    description:
      "E16文明圏における多様な宗教的・哲学的信念の総体。最大の宗教勢力はエレシュ信仰で、次元境界領を神聖視しヴェズレルを聖地とする。テクノ宗教運動はテミルタロンが提唱した次元極地平の神聖視を基盤とし、テンプル・オブ・ホライゾンを拠点にTroyane周辺に信者を集めている。ファティマ連邦は宗教的・哲学的自由を重んじる多元主義的な精神を国家理念とし、複数の信仰が共存する社会を形成している。フェルミ音楽の精神論的解釈も quasi-religious な世界観として機能し、AURALISの「光と音を永遠にする」という理念は一部の信者にとって宗教的な意味合いを持つ。グランベルとディオクレニスは世俗主義的傾向が強いが、エレシオンは「生命の維持と再生」を quasi-religious な理念として掲げている。",
    descriptionEn:
      "The totality of diverse religious and philosophical beliefs in the E16 civilization zone. The largest religious force is Eresh faith, which venerates dimensional border regions and considers Vezler a sacred land. The Techno-Religious Movement is based on Timirtaron's advocacy of the sanctity of dimensional horizons, gathering believers around Troyane with the Temple of Horizon as its base. The Fatima Federation values religious and philosophical freedom as a national philosophy, forming a society where multiple beliefs coexist. The spiritual interpretation of Fermi music also functions as a quasi-religious worldview, and AURALIS's philosophy of 'making light and sound eternal' has religious significance for some believers. Granbel and Dioclenis have strong secular tendencies, while Elesion promotes 'maintenance and regeneration of life' as a quasi-religious philosophy.",
  },{
    id: "term-料理・食文化" as WikiId,
    name: "料理・食文化",
    nameEn: "Cuisine and Food Culture of E16",
    category: "用語",
    subCategory: "文化",
    description:
      "E16文明圏で発展した多様な食文化。シンフォニー・オブ・スターズの自生植物と地球から持ち込まれた作物の交配により、地球の料理を基盤にしながら独自の進化を遂げた。クレセント大地方ではミエルテンガ湖の淡水魚料理、ブルーローズ平原の穀物料理、ヴェルミリオン渓谷の峡谷野菜が名物である。テクノ文化ルネサンス期にはホライゾン・ゲートを通じた異星食材の流通が始まり、ファルージャの砂漠料理、エレシオンの健康食、グランベルの融合料理などがE16連星系全域で楽しめるようになった。ビブリオのアカデミアでは「食の哲学」という学際的研究分野が設立され、食文化を通じた文明間の理解促進が模索されている。サウス・マーケットの海上市場は異星食材が集まる美食の聖地として知られている。",
    descriptionEn:
      "Diverse food culture developed in the E16 civilization zone. Through crossbreeding of self-propagating plants from Symphony of Stars and crops brought from Earth, it evolved uniquely while based on Earth's cuisine. In the Crescent Great Region, freshwater fish dishes from Miertenga Lake, grain dishes from Blue Rose Plain, and canyon vegetables from Vermilion Valley are specialties. During the Techno-Cultural Renaissance, the circulation of alien ingredients through Horizon Gates began, and dishes such as Faruja's desert cuisine, Elesion's health food, and Granbel's fusion cuisine became available throughout the E16 star system. At the Acadia of Biblio, an interdisciplinary research field called 'Philosophy of Food' was established, seeking to promote inter-civilizational understanding through food culture. The South Market is known as a holy place for gourmet food where alien ingredients gather.",
  },{
    id: "term-祝祭・記念日" as WikiId,
    name: "祝祭・記念日",
    nameEn: "Festivals and Memorial Days of E16",
    category: "用語",
    subCategory: "文化",
    description:
      "E16文明圏で祝われる主要な祝祭と記念日。最も重要なのは「入植記念日（E0のシンフォニー・オブ・スターズ到達を記念）」で、全星系で一斉に祝われる最大の祝祭である。その他、ギガポリスの復帰記念日（E475年エヴァトロン崩壊を記念）、セリア黄金期記念日（E335年セリア・ドミニクスによる黄金期開始を記念）、テクノ文化ルネサンス記念日（E475年技術開放を記念）が主要な星系規模の祝祭である。クレセント地方独自の祝祭にはブルーローズの「青い花祭り」、ファルージャの「砂漠の星間フェスティバル」、Poitiersの「フェルミ音楽復興祭」がある。AURALIS第二世代の設立記念日（E522年）はE16文明圏の文化復興の象徴として若年層に広く支持されている。",
    descriptionEn:
      "Major festivals and commemorations celebrated in the E16 civilization zone. The most important is 'Settlement Day (commemorating the arrival at Symphony of Stars in E0)', the largest festival celebrated simultaneously across the entire star system. Other major system-wide festivals include the Return of Gigapolis Day (commemorating the collapse of Evatron in E475), Celia Golden Age Day (commemorating the start of the golden age by Celia Dominicus in E335), and Techno-Cultural Renaissance Day (commemorating technological openness in E475). Local festivals unique to the Crescent Region include Blue Rose's 'Blue Flower Festival,' Faruja's 'Desert Intergalactic Festival,' and Poitiers's 'Fermi Music Revival Festival.' The founding anniversary of the second generation of AURALIS (E522) is widely supported by younger generations as a symbol of the cultural renaissance of the E16 civilization zone.",
  },{
    id: "term-惑星間条約" as WikiId,
    name: "惑星間条約",
    nameEn: "Interplanetary Treaties",
    category: "用語",
    subCategory: "法規",
    description:
      "E16連星系内の複数惑星・国家間で締結された条約群の総称。最も重要な条約はE151年の新ヘルシンキ宣言に基づく「惑星連邦構想条約」で、複数の惑星文明が平等な立場で参加する統合体制の枠組みを規定している。その他、「次元兵器制限条約（E288年、メルディア戦争の教訓から）」「リーチ・ドレイン管理条約（E400年、スライム危機の教訓から）」「A-Registry改革条約（E490年、ネオクラン同盟主導）」が重要な惑星間条約である。銀河系コンソーシアム設立（E520年）後は、E16連星系外の宇宙文明圏との条約締結も進められ、「ヘゲモニー・パラドックス回避条約」がグランベルとティエリア間の軍縮を規定している。",
    descriptionEn:
      "Collective term for treaties concluded between multiple planets and nations within the E16 star system. The most important treaty is the 'Planetary Federation Concept Treaty' based on the New Helsinki Declaration of E151, which stipulates a framework for an integrated system where multiple planetary civilizations participate on equal footing. Other important interplanetary treaties include the 'Dimensional Weapon Limitation Treaty (E288, learned from the Meldia War),' 'Reach Drain Management Treaty (E400, learned from the Slime Crisis),' and 'A- Reform Treaty (E490, led by Neo-Clan Alliance).' After the establishment of the Galaxy Consortium (E520), treaties with cosmic civilization zones outside the E16 star system have been concluded, with the 'Hegemony Paradox Avoidance Treaty' stipulating disarmament between Granbel and Tieria.",
  },{
    id: "term-銀河系コンソーシアム" as WikiId,
    name: "銀河系コンソーシアム",
    nameEn: "Galactic Consortium",
    category: "用語",
    subCategory: "法規",
    description:
      "E495年からE500年にかけて設立された宇宙規模の統合的ガバナンス組織で、M104銀河全域の平和と安定維持を目的としている。ネオクラン同盟、UECO、ヒーローエージェンシーの三大勢力を統合して誕生し、グランベル（経済1位）とティエリア（軍事3位）の共同議長体制で運営されている。最大の課題であるヘゲモニー・パラドックスの回避を最重要政策目標とし、対立する勢力間の調停と軍縮を推進している。E524年の諸世界連邦サミットを主催し、宇宙規模の外交協議を実現した。E530年の次元ブリッジ完成後は宇宙文明圏間の交流拡大に伴う新たな法規整備を進めている。エレシオンの平和主義とディオクレニスの科学的アプローチを政策の両輪としている。",
    descriptionEn:
      "A galaxy-scale integrated governance organization established from E495 to E500, aimed at maintaining peace and stability throughout the M104 galaxy. Born from the integration of three major forces: the Neo-Clan Alliance, UECO, and Hero Agencies, it is operated under a co-chairmanship system of Granbel (economic #1) and Tieria (military #3). Avoiding the Hegemony Paradox, its greatest challenge, is its most important policy goal, promoting mediation and disarmament between opposing forces. It hosted the United Worlds Federal Summit in E524, realizing galaxy-scale diplomatic consultations. After the completion of the Dimensional Bridge in E530, it has been advancing new legal regulations accompanying the expansion of exchanges between cosmic civilization zones. It balances Elesion's pacifism and Dioclenis's scientific approach as the two pillars of its policy.",
  },{
    id: "term-通商路の定義" as WikiId,
    name: "通商路の定義",
    nameEn: "Definition of Trade Routes",
    category: "用語",
    subCategory: "経済",
    description:
      "E16文明圏における惑星間・星系間の商業取引ルートの定義と管理規則。主要な通商路はシンフォニー・オブ・スターズを中心に放射状に広がり、惑星ビブリオへの学術ルート、Eros-7へのエネルギールート、ガイア・リングへの資源ルートが四大動脈を形成している。テクノ文化ルネサンス期にホライゾン・ゲートの民生化が進み、従来の宇宙船航行ルートに加えて次元ホール経由の即時物流が可能となった。通商路の安全はUECOと銀河系コンソーシアムの合同部隊が担当し、海賊行為や密輸への取り締まりを行っている。プロキオ・ネクサスを中心とする宇宙規模の貿易ルートとの接続もE520年以降本格化している。通商路の定義はnトークン経済システムと不可分であり、物流コストの低減がE16文明圏全体の経済発展に直結している。",
    descriptionEn:
      "Definition and management regulations for interplanetary and interstellar commercial trade routes in the E16 civilization sphere. The main trade routes radiate from the Symphony of Stars as the center, forming four major arteries: academic routes to the planet Biblio, energy routes to Eros-7, and resource routes to the Gaia Ring. During the Techno-Cultural Renaissance period, the civilian use of Horizon Gates advanced, making instant logistics through dimensional holes possible in addition to traditional spaceship navigation routes. The security of trade routes is handled by joint forces of UECO and the Galactic Consortium, cracking down on piracy and smuggling. Connections with universe-scale trade routes centered on Proxio Nexus have been fully developed since E520. The definition of trade routes is inseparable from the n-token economic system, and reducing logistics costs directly contributes to the economic development of the entire E16 civilization sphere.",
  },{
    id: "term-犯罪と刑罰体系" as WikiId,
    name: "犯罪と刑罰体系",
    nameEn: "Crime and Punishment System",
    category: "用語",
    subCategory: "法規",
    description:
      "E16文明圏の犯罪と刑罰に関する法体系。エヴァトロン体制下では犯罪の定義が拡大解釈され、芸術活動や政治的批判も処罰の対象となったが、ポスト・エヴァトロン秩序の下で大幅に見直された。現在の犯罪体系は「A-Registryへの侵害」「nトークンの不正操作」「次元技術の無許可使用」「暴力犯罪」「テロ活動」を主要犯罪類型として規定している。刑罰はA-Registryの階級低下、nトークンの没収、強制労働、宇宙刑務所への収監、極端な場合には次元流刑が科される。シルバー・ヴェノムやアルファ・ヴェノムの活動は「宇宙規模のテロ犯罪」と定義され、銀河系コンソーシアムの国際刑事裁判所の管轄に属する。テリアン反乱の参加者に対するエヴァトロン時代の不当な処刑は、現在の人権改革的議論の対象となっている。",
    descriptionEn:
      "Legal system concerning crime and punishment in the E16 civilization sphere. Under the Evatron regime, the definition of crime was broadly interpreted, and artistic activities and political criticism became punishable offenses, but were significantly reviewed under the post-Evatron order. The current crime system defines 'infringement on the A-Registry', 'illegal manipulation of n-tokens', 'unauthorized use of dimensional technology', 'violent crimes', and 'terrorist activities' as major crime types. Punishments include demotion in the A-Registry, confiscation of n-tokens, forced labor, imprisonment in space penitentiaries, and in extreme cases, dimensional exile. Activities of Silver Venom and Alpha Venom are defined as 'cos-scale terrorist crimes' and fall under the jurisdiction of the International Criminal Court of the Galactic Consortium. The unjust executions of participants in the Terrian Rebellion during the Evatron era have become the subject of current human rights reform discussions.",
  },{
    id: "term-特許・知的財産制度" as WikiId,
    name: "特許・知的財産制度",
    nameEn: "Patent and Intellectual Property System",
    category: "用語",
    subCategory: "法規",
    description:
      "E16文明圏における発明・芸術的創造物の知的財産権を保護する法制度。セリア黄金期にAURALISの創作活動を保護するために原型が構築され、フェルミ音楽の楽曲や次元極地平技術の特許が最初の対象となった。現在の特許制度はUECOの管轄下で運営され、特許の有効期間は標準で50年（nトークン報酬の持続可能な期間）に設定されている。特許登録は惑星ビブリオのアカデミアにある国際特許庁で一元管理され、次元符号化技術による改ざん防止システムが導入されている。テクノ文化ルネサンス期には技術の民主化と知的財産権保護のバランスが大きな議論となり、重要な基礎技術の「オープンソース化」が進んだ分野もある。クアンタ・ラボ（E545年設立）の研究もこの制度の下で保護されている。",
    descriptionEn:
      "Legal system protecting intellectual property rights for inventions and artistic creations in the E16 civilization sphere. Its prototype was constructed during the Cerean Golden Age to protect the creative activities of AURALIS, with Fermi music songs and patents for dimensional horizon technology becoming the first subjects. The current patent system is operated under the jurisdiction of UECO, with a standard patent validity period of 50 years (the sustainable period of n-token rewards). Patent registration is centrally managed at the International Patent Office in Academia on planet Biblio, with an anti-tampering system using dimensional coding technology introduced. During the Techno-Cultural Renaissance period, balancing technological democratization with intellectual property protection became a major topic, with some fields advancing the 'open-sourcing' of important basic technologies. Research by Quanta Lab (established in E545) is also protected under this system.",
  },{
    id: "term-環境保護法" as WikiId,
    name: "環境保護法",
    nameEn: "Environmental Protection Law of E16",
    category: "用語",
    subCategory: "法規",
    description:
      "E16文明圏においてシンフォニー・オブ・スターズおよび各植民地惑星の生態系保全を目的として制定された包括的な環境法規体系。スライム危機（E380〜E400年）におけるリーチ・ドレインの大量発生という教訓から、テクノ文化ルネサンス期（E475〜E500年）にネオクラン同盟主導で整備された。この法律は惑星資源の採掘制限、廃棄物の次元分解処理の義務化、生態系モニタリングの常時実施、外来生物種の輸入規制などを定めている。特にアイアン・シンジケートをはじめとする資源採掘企業に対する排出基準は厳格で、違反企業にはnトークン資産の凍結と操業停止の罰則が適用される。Eros-7の搾取エネルギー抽出活動に対する国際的な規制もこの法体系に基づいている。銀河系コンソーシアム設立後は、他宇宙文明圏との環境基準の調和化が進められている。",
    descriptionEn:
      "Comprehensive environmental legal system established in the E16 civilization sphere to preserve the ecosystems of the Symphony of Stars and various colony planets. Learning from the lesson of the Slime Crisis (E380-E400) where Reach Drains massively proliferated, it was developed under the leadership of the Neo-Clan Alliance during the Techno-Cultural Renaissance period (E475-E500). This law stipulates restrictions on planetary resource extraction, mandatory dimensional decomposition of waste, constant implementation of ecosystem monitoring, and import regulations for alien species. Emission standards for resource extraction companies, including the Iron Syndicate, are particularly strict, with penalties of freezing n-token assets and operational suspension applied to violating companies. International regulations on the exploitative energy extraction activities of Eros-7 are also based on this legal system. After the establishment of the Galactic Consortium, harmonization of environmental standards with other cosmic civilization spheres has been promoted.",
  },{
    id: "term-報道自由" as WikiId,
    name: "報道自由",
    nameEn: "Freedom of Press in E16",
    category: "用語",
    subCategory: "文化",
    description:
      "E16文明圏における報道・表現の自由を保障する制度的枠組み。エヴァトロン支配期（E400〜E475年）には厳しく制限されていたが、崩壊後にネオクラン同盟主導で言論自由復興法が制定された。現在の報道自由はUECO憲章第7条で保障され、独立メディア機関の設立権、取材の自由、編集権の独立性が法的に認められている。ただし次元兵器の機密情報と軍事作戦の詳細については「国家安全例外条項」が適用され、報道制限が可能とされている。GigapolisのLilleを中心にニューメディア産業が急成長しており、次元ホログラム報道やリアルタイム戦況中継が市民の情報源として不可欠となっている。クレセント地方ではV7とトリニティ・アライアンスのプロパガンダ合戦の中で報道の中立性が重大な課題となっている。",
    descriptionEn:
      "Institutional framework guaranteeing freedom of press and expression in the E16 civilization sphere. It was severely restricted during the Evatron rule period (E400-E475), but after its collapse, the Freedom of Speech Revival Law was formulated under the leadership of the Neo-Clan Alliance. Current press freedom is guaranteed by Article 7 of the UECO Charter, with the right to establish independent media agencies, freedom of reporting, and editorial independence legally recognized. However, regarding confidential information on dimensional weapons and details of military operations, the 'national security exception clause' applies, allowing for press restrictions. The new media industry is rapidly growing centered around Lille in Gigapolis, with dimensional hologram reporting and real-time battle situation broadcasts becoming indispensable sources of information for citizens. In the Crescent region, the neutrality of reporting has become a major issue amidst the propaganda war between V7 and the Trinity Alliance.",
  },{
    id: "term-スポーツ競技" as WikiId,
    name: "スポーツ競技",
    nameEn: "Sports and Athletic Competitions of E16",
    category: "用語",
    subCategory: "文化",
    description:
      "E16文明圏で愛好される各種スポーツ・競技活動の総称。シンフォニー・オブ・スターズの表面重力（0.92G）と自転周期（44時間4分）という惑星環境に適応して独自に発展した競技が多い。最も人気のあるのはネオンコロシアムで開催されるスティル・アレーナだが、それ以外にも次元スキー（アイアン・シンジケートの山岳地帯で行われる）、ゼロGバスケット（Gigapolisのテック・コリドー地区発祥）、プラズマランニング（西大陸の広大平原を利用したマラソン競技）などが広く愛好されている。テクノ文化ルネサンス期以降は、次元極地平技術を応用した「次元格闘技」や「空間アクロバティクス」といった新競技も誕生した。各競技の大会はnトークン賞金が設定され、プロ選手として活動する者も増加している。銀河系コンソーシアム主導で宇宙文明圏間スポーツ交流が始まっており、グランベルのマルチバース・ゲームズが最も権威ある国際大会として知られている。",
    descriptionEn:
      "General term for various sports and competitive activities popular in the E16 civilization sphere. Many competitions have independently developed to adapt to the planetary environment of the Symphony of Stars, with its surface gravity (0.92G) and rotation period (44 hours 4 minutes). The most popular is the Still Arena held at the Neon Colosseum, but other widely enjoyed activities include dimensional skiing (held in the mountainous regions of the Iron Syndicate), zero-G basketball (originating in the Tech Corridor district of Gigapolis), and plasma running (a marathon competition utilizing the vast plains of the Western Continent). Since the Techno-Cultural Renaissance period, new competitions such as 'dimensional martial arts' and 'spatial acrobatics' applying dimensional horizon technology have also emerged. N-token prize money is set for competitions in each sport, and the number of professional athletes is increasing. Under the leadership of the Galactic Consortium, sports exchanges between cosmic civilization spheres have begun, with the Multiverse Games of Granbel being known as the most prestigious international competition.",
  },] as const satisfies readonly WikiEntry[]
