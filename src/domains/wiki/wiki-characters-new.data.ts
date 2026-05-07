import type { WikiId, WikiEntry } from "../../types"

export const WIKI_CHARACTERS_NEW = [{
    id: "マルクス・アウレリウス" as WikiId,
    name: "マルクス・アウレリウス",
    nameEn: "Marcus Aurelius",
    category: "キャラクター",
    subCategory: "バーズ帝国",
    description:
      "バーズ帝国初期の元老院議長であり、E0年からE35年にかけて帝国の立法基盤を確立した政治家。移民船団の到着直後、混沌とする入植地において法典編纂と市民権の付与ルールを整備し、後の帝国議会制度の原型を構築した。その博愛的な統治方針は「バーズの哲人王」と称され、ティムール・シャーと並ぶE0年代の二大指導者として記憶されている。マルクス法典は現在でもEDU法体系の根幹を成しており、その影響力は星域全体に及んでいる。",
    descriptionEn:
      "The inaugural Senate Chairman of the early Barz Empire, who established the legislative foundation of the empire from E0 to E35. Immediately following the arrival of the immigrant fleet, he organized the compilation of codes and rules for granting citizenship amid the chaos of the settlements, constructing the prototype for the later Imperial parliamentary system. His benevolent governance earned him the title 'The Philosopher King of Barz,' and he is remembered as one of the two great leaders of the E0s alongside Timur Shah. The Marcus Code still forms the cornerstone of the EDU legal system, its influence extending across the entire star sector.",
    era: "E0〜E35",
    affiliation: "バーズ帝国元老院",
    tier: "Tier 3",
  },{
    id: "イサベラ・コルネリウス" as WikiId,
    name: "イサベラ・コルネリウス",
    nameEn: "Isabella Cornelius",
    category: "キャラクター",
    subCategory: "バーズ帝国",
    description:
      "バーズ帝国初代外務大臣としてE5年からE40年まで活動し、他の入植船団との外交関係構築に尽力した女性政治家。交渉術と語学力に優れ、初期の星域間条約の締結を主導した。特にE15年のファランクス設立に先立ち、テクロサス系軍事組織との協定締結に重要な役割を果たした。彼女の外交路線は「コルネリウス外交」として後世に継承され、バーズ帝国の柔軟な対外政策の基礎を築いた。",
    descriptionEn:
      "A female politician who served as the first Foreign Minister of the Barz Empire from E5 to E40, dedicating herself to establishing diplomatic relations with other immigrant fleets. Excelling in negotiation and linguistic skills, she led the conclusion of early interstellar treaties. Particularly crucial was her role in negotiating with the Teklosas military organizations prior to the founding of Phalanx in E15. Her diplomatic policy was inherited by later generations as the 'Cornelius Doctrine,' establishing the foundation for the Barz Empire's flexible foreign policy.",
    era: "E5〜E40",
    affiliation: "バーズ帝国外務省",
    tier: "Tier 3",
  },{
    id: "ガイウス・セプティムス" as WikiId,
    name: "ガイウス・セプティムス",
    nameEn: "Gaius Septimus",
    category: "キャラクター",
    subCategory: "バーズ帝国",
    description:
      "バーズ帝国初期の軍事総司令官としてE2年からE45年まで帝国軍の創設と拡充を担った武人。ファランクスの初期編成においてテクロサス軍事教範の導入を推進し、帝国軍の戦闘体系を確立した。E20年の辺境防衛戦では未熟な兵士を率いて小惑星帯の海賊を撃退し、帝国の安全を確保した。厳格な軍規と同時に兵士への配慮も忘れず、将兵からの信頼は極めて厚かった。その軍事的遺産は後のテクロサス三頭政治改編にも影響を与えた。",
    descriptionEn:
      "A military commander who served as Supreme Commander of the Barz Empire from E2 to E45, responsible for the creation and expansion of the Imperial military. He promoted the adoption of Teklosas military doctrine in the early formation of Phalanx, establishing the combat system of the Imperial military. In the E20 Border Defense War, he led inexperienced soldiers to repel pirates in the asteroid belt, securing the empire's safety. While maintaining strict military discipline, he never forgot consideration for his soldiers, earning him immense trust from his officers and men. His military legacy also influenced the later Teklosas Triumvirate reorganization.",
    era: "E2〜E45",
    affiliation: "バーズ帝国軍",
    tier: "Tier 3",
  },{
    id: "レックス・ドラコ" as WikiId,
    name: "レックス・ドラコ",
    nameEn: "Rex Draco",
    category: "キャラクター",
    subCategory: "バーズ帝国",
    description:
      "バーズ帝国初期の探検家であり、E8年からE50年にかけて未開星域の調査と入植地の選定を行った冒険家。「竜の星」と呼ばれる第3セクターの発見者であり、その過酷な環境下での生存術とNavigation技術は伝説化している。彼が作成した星図「ドラコ・アトラス」は後のギガポリス建設において重要な参考資料となり、E150年のマーストリヒト革命にも間接的な影響を与えた。E50年の最後の探検行で消息不明となったが、彼の足跡は現在でも入植者たちに語り継がれている。",
    descriptionEn:
      "An explorer of the early Barz Empire who surveyed uncharted star sectors and selected settlement sites from E8 to E50. He was the discoverer of Sector 3, known as 'Dragon's Star,' and his survival techniques and Navigation skills in its harsh environment have become legendary. The star chart he created, 'Draco Atlas,' became an important reference for the later construction of Gigapolis and indirectly influenced the Maastricht Revolution of E150. He disappeared during his final expedition in E50, but his footsteps are still recounted by settlers to this day.",
    era: "E8〜E50",
    affiliation: "バーズ帝国探検局",
    tier: "Tier 3",
  },{
    id: "ヴァレリア・トルクアタ" as WikiId,
    name: "ヴァレリア・トルクアタ",
    nameEn: "Valeria Torquata",
    category: "キャラクター",
    subCategory: "バーズ帝国",
    description:
      "バーズ帝国初代法務大臣としてE10年からE48年まで在任し、帝国の司法制度を設計した法律家。マルクス・アウレリウスの法典を基に、市民裁判制度と刑事手続きの整備を主導した。特に「トルクアタの三原則」と呼ばれる罪刑法定主義・弁護権保障・適正手続の原則は、現在のEDU司法体系にも受け継がれている。厳格だつ正義感の強い性格で知られ、帝国初期の腐敗防止にも大きな役割を果たした。",
    descriptionEn:
      "A lawyer who served as the first Minister of Justice of the Barz Empire from E10 to E48, designing the empire's judicial system. Building upon the Marcus Aurelius Code, he led the establishment of citizen trial systems and criminal procedures. Particularly, the 'Three Principles of Torquata'—the principle of legality, the right to counsel, and due process—are still inherited in the current EDU judicial system. Known for his strict sense of justice, he played a major role in preventing corruption during the early empire.",
    era: "E10〜E48",
    affiliation: "バーズ帝国法務省",
    tier: "Tier 3",
  },{
    id: "プロフェッサー・クイントゥス" as WikiId,
    name: "プロフェッサー・クイントゥス",
    nameEn: "Professor Quintus",
    category: "キャラクター",
    subCategory: "バーズ帝国",
    description:
      "バーズ帝国アカデミー初代学長としてE3年からE50年まで科学研究と教育の振興に尽くした学者。物理学と数学の権威であり、ティムール・シャーの10次元ホラズム理論の初期検証を行った数少ない科学者の一人。彼が設立した帝国アカデミーは後のギガポリス大学の前身となり、EDU全体の学問発展に多大な影響を与えた。E40年にはペルセポネ・プロジェクトの科学的顧問も務め、仮想多元宇宙の理論的基礎構築に寄与した。",
    descriptionEn:
      "A scholar who served as the first Chancellor of the Barz Empire Academy from E3 to E50, dedicating himself to promoting scientific research and education. An authority in physics and mathematics, he was one of the few scientists who conducted initial verification of Timur Shah's ten-dimensional Horazm theory. The Empire Academy he founded later became the predecessor of Gigapolis University, greatly influencing the academic development of the entire EDU. In E40, he also served as scientific advisor to the Persephone Project, contributing to the theoretical construction of the virtual multiverse.",
    era: "E3〜E50",
    affiliation: "バーズ帝国アカデミー",
    tier: "Tier 3",
  },{
    id: "ドクター・オクタヴィア" as WikiId,
    name: "ドクター・オクタヴィア",
    nameEn: "Doctor Octavia",
    category: "キャラクター",
    subCategory: "バーズ帝国",
    description:
      "バーズ帝国初代保健衛生大臣としてE5年からE47年まで在任し、入植者の医療・公衆衛生体制を構築した医師。宇宙放射線への対策と感染症予防の基礎研究を主導し、入植初期の死亡率を大幅に低下させた。E25年に発見された異星微生物に対する研究も先駆的であり、その成果はのちのスライム・ウーマン顕現（E340）への学術的対応に間接的に役立った。人道主義的な医療哲学は「オクタヴィア宣言」として現在も医療従事者に継承されている。",
    descriptionEn:
      "A physician who served as the first Minister of Health and Sanitation of the Barz Empire from E5 to E47, constructing medical and public health systems for settlers. He led fundamental research on countermeasures against cosmic radiation and infectious disease prevention, significantly reducing mortality rates during the early settlement period. His pioneering research on alien microbes discovered in E25 also indirectly contributed to the academic response to the manifestation of Slime Woman (E340). His humanitarian medical philosophy is still carried on by medical practitioners today as the 'Octavia Declaration.'",
    era: "E5〜E47",
    affiliation: "バーズ帝国保健衛生省",
    tier: "Tier 3",
  },{
    id: "ヴェル・ナイアード" as WikiId,
    name: "ヴェル・ナイアード",
    nameEn: "Vel Naiad",
    category: "キャラクター",
    subCategory: "バーズ帝国",
    description:
      "バーズ帝国初期の農業技術者としてE6年からE49年まで活動し、過酷な宇宙環境下での食糧生産システムを開発した実践的技術者。水耕栽培と人工光合成技術の融合により、入植地の食糧自給率を飛躍的に向上させた。「緑の魔術師」と呼ばれ、彼女の開発した「ナイアード・ファーム」システムは後のEros-7における食糧生産にも応用された。農業改革の功績によりE35年に帝国最高科学賞を受賞。",
    descriptionEn:
      "A practical engineer who worked as an agricultural technician in the early Barz Empire from E6 to E49, developing food production systems in the harsh space environment. By integrating hydroponics and artificial photosynthesis technology, he dramatically improved the food self-sufficiency rate of the settlements. Called the 'Green Magician,' the 'Naiad Farm' system he developed was later applied to food production in Eros-7. For his contributions to agricultural reform, he received the Empire's highest science award in E35.",
    era: "E6〜E49",
    affiliation: "バーズ帝国農業局",
    tier: "Tier 3",
  },{
    id: "カイ・アシュフォード" as WikiId,
    name: "カイ・アシュフォード",
    nameEn: "Kai Ashford",
    category: "キャラクター",
    subCategory: "バーズ帝国",
    description:
      "バーズ帝国初期の通信技術者としてE12年からE50年まで星間通信ネットワークの構築に従事したエンジニア。長距離通信の安定化と暗号化技術の開発において先駆的な業績を残し、初期の帝国通信網「アシュフォード・リンク」の設計者となった。彼の開発した通信プロトコルは後のSSレンジの通信インフラにも影響を与え、クレセント地方の通信網の基礎を築いた。E45年には小惑星帯中継ステーションの建設も指揮した。",
    descriptionEn:
      "An engineer who engaged in constructing the interstellar communication network from E12 to E50 in the early Barz Empire. He made pioneering achievements in stabilizing long-distance communication and developing encryption technology, becoming the designer of the early Imperial communication network, the 'Ashford Link.' The communication protocols he developed later influenced the communication infrastructure of SS Range and laid the foundation for the communication network in Crescent Region. In E45, he also commanded the construction of the asteroid belt relay station.",
    era: "E12〜E50",
    affiliation: "バーズ帝国通信省",
    tier: "Tier 3",
  },{
    id: "ソル・ブレイズ" as WikiId,
    name: "ソル・ブレイズ",
    nameEn: "Sol Blaze",
    category: "キャラクター",
    subCategory: "バーズ帝国",
    description:
      "バーズ帝国初期のエネルギー技術者としてE8年からE50年まで星間航行用エンジンの改良に取り組んだ天才技術者。太陽風を推進力に変換する「ブレイズ・エンジン」の概念設計を行い、入植船団の航行速度を向上させた。E30年には新型融合炉のプロトタイプを開発し、バーズ帝国のエネルギー安全保障に貢献。その技術的野心は後にテクロサスの軍事技術開発やファールージャ社の次元極地平技術への道を開いたと評されている。",
    descriptionEn:
      "A genius technician who worked on improving interstellar engines from E8 to E50 in the early Barz Empire. He conceptualized the 'Blaze Engine,' which converts solar wind into propulsion force, increasing the speed of the immigrant fleet. In E30, he developed a prototype of a new fusion reactor, contributing to the energy security of the Barz Empire. His technical ambition is said to have paved the way for later Teklosas military technology development and Farooja Corporation's dimensional horizon technology.",
    era: "E8〜E50",
    affiliation: "バーズ帝国エネルギー局",
    tier: "Tier 3",
  },{
    id: "ルナ・サバイバー" as WikiId,
    name: "ルナ・サバイバー",
    nameEn: "Luna Survivor",
    category: "キャラクター",
    subCategory: "バーズ帝国",
    description:
      "バーズ帝国初期の入植船団生き残りであり、E0年の着陸事故から生還した伝説的な生存者。事故の際、乗組員の避難を指揮し、彼女の機転と判断力が多数の命を救ったとされる。事故後は入植地の建設リーダーとして活躍し、E15年までに初期居住区の基礎インフラを完成させた。「月の生存者」という異名は着陸事故が月面基地で起きたことに由来し、彼女の不屈の精神はバーズ帝国の建国神話の中核をなしている。",
    descriptionEn:
      "A survivor of the immigrant fleet of the early Barz Empire and a legendary survivor who escaped the landing accident of E0. During the accident, she is said to have directed the evacuation of crew members, with her quick thinking and judgment saving many lives. After the accident, she served as a construction leader for the settlement, completing the basic infrastructure of the initial residential area by E15. Her nickname, 'The Survivor of the Moon,' derives from the fact that the landing accident occurred at a lunar base, and her indomitable spirit forms the core of the founding myth of the Barz Empire.",
    era: "E0〜E30",
    affiliation: "バーズ帝国入植船団",
    tier: "Tier 3",
  },{
    id: "リック・ウォーデン" as WikiId,
    name: "リック・ウォーデン",
    nameEn: "Rick Warden",
    category: "キャラクター",
    subCategory: "バーズ帝国",
    description:
      "バーズ帝国初期の建設技術者としてE2年からE48年まで入植地のインフラ整備を指揮した土木技師。セントラル・タワーの初期設計に携わり、後のギガポリス建設期におけるメガタワー構想の先駆けとなった。E20年の「ウォーデン大惨事」と呼ばれる居住区崩壊事故では、自らの危険を顧みず救助活動を指揮し、多数の命を救った。その献身的な姿勢は「ウォーデン精神」として建設労働者の理想とされ、現在でも記念施設にその名が刻まれている。",
    descriptionEn:
      "A civil engineer who directed the infrastructure development of settlements from E2 to E48 in the early Barz Empire. He was involved in the initial design of Central Tower, becoming a precursor to the Megatower concept during the later construction period of Gigapolis. During the 'Warden Catastrophe' of E20, a residential area collapse accident, he personally directed rescue operations without regard for his own safety, saving many lives. His selfless attitude is idealized by construction workers as the 'Warden Spirit,' and his name is still engraved in commemorative facilities today.",
    era: "E2〜E48",
    affiliation: "バーズ帝国建設局",
    tier: "Tier 3",
  },{
    id: "キャプテン・ノヴァ" as WikiId,
    name: "キャプテン・ノヴァ",
    nameEn: "Captain Nova",
    category: "キャラクター",
    subCategory: "第一移民期",
    description:
      "第二波移民船団の総隊長としてE50年からE120年まで活動し、新たな入植地の開拓と移民団の護衛を担った宇宙船長。バーズ帝国期の初期入植地から西大陸への拡張ルートを開拓し、その航海記録はのちのギガポリス建設の地理的基礎となった。E80年の異常宇宙線バーストの際には船団を巧みに回避し、全船の生存を実現した英雄的航海士。ノヴァ・ルートと呼ばれる彼の開拓航路は現在でも主要な星間航路として利用されている。",
    descriptionEn:
      "As the commander of the Second Wave Immigration Fleet from E50 to E120, this space captain spearheaded the colonization of new settlements and protected immigrant convoys. He pioneered the expansion route from the early Barss Empire settlements to the Western Continent, with his navigational records forming the geographical foundation for later Gigapolis construction. During the anomalous cosmic ray burst in E80, he skillfully maneuvered the fleet to avoid disaster, ensuring the survival of all ships—a heroic feat of navigation. His开拓 route, known as the Nova Route, remains a major interstellar thoroughfare to this day.",
    era: "E50〜E120",
    affiliation: "第二波移民船団",
    tier: "Tier 3",
  },{
    id: "ナビゲーター・セイラ" as WikiId,
    name: "ナビゲーター・セイラ",
    nameEn: "Navigator Seira",
    category: "キャラクター",
    subCategory: "第一移民期",
    description:
      "第二波移民船団の主席航法士としてキャプテン・ノヴァの右腕を務めた天文学者。E55年からE115年にかけて、未踏の星域の天文観測と航路計算を担当し、船団の安全な航行を支えた。E70年に発見したセイラ・ネビュラは彼女の名に因んで命名され、その美しい星雲は後のEros-7建設計画に影響を与えた。精密な計算能力と直感的なNavigationセンスで知られ、船団の乗組員から「星を讀む女」と呼ばれた。",
    descriptionEn:
      "As the chief navigator of the Second Wave Immigration Fleet and the right hand to Captain Nova, this astronomer served from E55 to E115, responsible for astronomical observations and route calculations in uncharted star systems that ensured the fleet's safe passage. The Seira Nebula, discovered by her in E70, was named in her honor, and its beauty influenced later the Eros-7 construction project. Renowned for her precise calculations and intuitive navigation sense, she was called 'the star-reading woman' by the fleet's crew.",
    era: "E55〜E115",
    affiliation: "第二波移民船団",
    tier: "Tier 3",
  },{
    id: "エンジニア・ボルト" as WikiId,
    name: "エンジニア・ボルト",
    nameEn: "Engineer Bolt",
    category: "キャラクター",
    subCategory: "第一移民期",
    description:
      "第二波移民船団の主席機関士としてE50年からE125年まで船団の全船舶のメンテナンスと改良を担当した技術者。旧式化した移民船のエンジンを独自に改造し、航行速度の向上と燃費の改善を実現した。E90年に開発した「ボルト式推進器」は標準規格として広く採用され、後のテクロサス艦隊にも影響を与えた。また、E110年の船団分裂危機では技術的な解決策を提示し、船団の統一を維持した実務家。",
    descriptionEn:
      "As the chief engineer of the Second Wave Immigration Fleet from E50 to E125, this technician oversaw the maintenance and improvement of all fleet vessels. He independently retrofitted outdated immigrant ship engines, achieving increased speed and improved fuel efficiency. The 'Bolt-type Thruster' he developed in E90 was widely adopted as a standard specification, influencing later Technorus fleet designs. During the fleet crisis of E110, he presented technical solutions that maintained the fleet's unity—a pragmatic leader in times of crisis.",
    era: "E50〜E125",
    affiliation: "第二波移民船団",
    tier: "Tier 3",
  },{
    id: "科学官・アリス" as WikiId,
    name: "科学官・アリス",
    nameEn: "Science Officer Alice",
    category: "キャラクター",
    subCategory: "第一移民期",
    description:
      "第二波移民船団の首席科学官としてE52年からE130年まで船団内の研究活動を統括した科学者。異星植物の植生調査と鉱物資源の分析において先駆的な業績を残し、入植地選定の科学的根拠を提供した。E95年に発見したアリス鉱石は強力なエネルギー源として後の重工業発展に貢献した。彼女の膨大な研究ノートは「アリス・アーカイブ」として現在もEDU最大の学術データベースの一部をなしている。",
    descriptionEn:
      "As the chief science officer of the Second Wave Immigration Fleet from E52 to E130, this scientist coordinated all research activities within the fleet. She made pioneering achievements in extraterrestrial vegetation surveys and mineral resource analysis, providing scientific foundations for settlement selection. The Iris Ore she discovered in E95 contributed to later heavy industrial development as a powerful energy source. Her extensive research notebooks, known as the 'Alice Archive,' remain part of EDU's largest academic database.",
    era: "E52〜E130",
    affiliation: "第二波移民船団",
    tier: "Tier 3",
  },{
    id: "医療官・ヘイズ" as WikiId,
    name: "医療官・ヘイズ",
    nameEn: "Medical Officer Haze",
    category: "キャラクター",
    subCategory: "第一移民期",
    description:
      "第二波移民船団の首席医療官としてE50年からE128年まで船団の全医療を統括した医師。長期間の宇宙航行に伴う健康問題の解決に取り組み、宇宙放射線障害の治療法を確立した。E100年の伝染病発生時には隔離措置と予防接種の徹底によりパンデミックを回避し、数千人の命を救った。ドクター・オクタヴィアの医療哲学を継承しつつ、船上医療の新たな標準を確立した医療の先駆者。",
    descriptionEn:
      "As the chief medical officer of the Second Wave Immigration Fleet from E50 to E128, this physician oversaw all medical operations. She addressed health issues associated with long-duration space travel and established treatments for cosmic radiation sickness. During the epidemic of E100, she implemented quarantine measures and widespread vaccinations, preventing a pandemic and saving thousands of lives. While inheriting the medical philosophy of Doctor Octavia, she established new standards for shipboard medicine—a pioneer in space medicine.",
    era: "E50〜E128",
    affiliation: "第二波移民船団",
    tier: "Tier 3",
  },{
    id: "ゴヴァナー・キーン" as WikiId,
    name: "ゴヴァナー・キーン",
    nameEn: "Governor Keen",
    category: "キャラクター",
    subCategory: "第一移民期",
    description:
      "第一移民期における西大陸初代総督としてE60年からE110年まで在任し、入植地の行政制度を確立した政治家。マルクス・アウレリウスの法典を基に移民地独自の自治制度を設計し、地方議会の創設と選挙制度の導入を推進した。E85年の農業危機では食糧配給制度を整備し、入植者の生活安定に尽力した。彼の行政手腕は「キーン方式」として後のギガポリス自治体制にも影響を与え、市民参加型政治の先駆者として評価されている。",
    descriptionEn:
      "As the first Governor of the Western Continent during the First Immigration Period, serving from E60 to E110, this politician established the settlement's administrative system. Based on the code of Marcus Aurelius, he designed a unique autonomous system for the colony, promoting the creation of local councils and electoral systems. During the agricultural crisis of E85, he established food distribution systems to stabilize settlers' lives. His administrative methods, known as the 'Keen System,' influenced later Gigapolis governance structures, and he is evaluated as a pioneer in participatory politics.",
    era: "E60〜E110",
    affiliation: "西大陸入植地政府",
    tier: "Tier 3",
  },{
    id: "メイヤー・ストーン" as WikiId,
    name: "メイヤー・ストーン",
    nameEn: "Mayor Stone",
    category: "キャラクター",
    subCategory: "第一移民期",
    description:
      "第一移民期における西大陸第2居住区の初代市長としてE70年からE135年まで在任し、都市計画と住宅建設を推進した行政官。グリッド状の街区設計と公共施設の体系的配置を導入し、後のギガポリス都市計画の基礎を築いた。E100年には最初の上層居住区の建設を決定し、メガタワー構想の初期段階を形作った。頑固だが実直な性格で、「石の市長」の異名通り、堅実な市政運営で市民から厚い信頼を得た。",
    descriptionEn:
      "As the first mayor of the Western Continent's Second Residential District from E70 to E135, this administrator promoted urban planning and housing construction. He introduced grid-based block designs and systematic placement of public facilities, laying the foundation for later Gigapolis urban planning. In E100, he decided on the construction of the first upper residential districts, shaping the initial phase of the Megatower concept. Though stubborn and upright, he earned deep public trust through solid municipal administration, earning the nickname 'the Stone Mayor.'",
    era: "E70〜E135",
    affiliation: "西大陸第2居住区",
    tier: "Tier 3",
  },{
    id: "シェリフ・ブラス" as WikiId,
    name: "シェリフ・ブラス",
    nameEn: "Sheriff Brass",
    category: "キャラクター",
    subCategory: "第一移民期",
    description:
      "第一移民期における西大陸の初代保安官としてE65年からE125年まで入植地の治安維持を担った法執行官。未開地における犯罪防止と紛争解決において独自の法と秩序を確立した。E90年の「ブラスの銃撃戦」と呼ばれる武装集団との対峙は伝説化し、入植地の治安維持の象徴となった。警察組織の原型を構築し、その保安官制度は後のテリアン反乱軍との対立構造にも間接的な影響を与えた。",
    descriptionEn:
      "As the first Sheriff of the Western Continent during the First Immigration Period from E65 to E125, this law enforcement officer maintained settlement security. He established unique laws and orders for crime prevention and dispute resolution in uncharted territories. The confrontation with armed groups in E90, known as the 'Brass Gunfight,' became legendary and symbolized the maintenance of settlement security. He built the prototype of the police organization, and his sheriff system indirectly influenced the later conflict structure with the Terrion Rebellion Army.",
    era: "E65〜E125",
    affiliation: "西大陸保安局",
    tier: "Tier 3",
  },{
    id: "エルダー・ウィロー" as WikiId,
    name: "エルダー・ウィロー",
    nameEn: "Elder Willow",
    category: "キャラクター",
    subCategory: "第一移民期",
    description:
      "第一移民期における入植者の精神的指導者としてE55年からE140年まで活動した宗教家・哲学者。宇宙への移住という未曽有の体験に対する人々の不安を受け止め、新しい精神性の構築を試みた。E75年に設立した「ウィローの集会所」は後の宗教・思想の自由の象徴となり、多様な信仰が共存するEDU文化の基盤を築いた。彼女の教えは「木のように根を張り、枝を広げよ」という言葉に集約され、現在でも入植者の子孫に語り継がれている。",
    descriptionEn:
      "As the spiritual leader of settlers during the First Immigration Period from E55 to E140, this religious philosopher addressed people's anxieties about the unprecedented experience of space migration, attempting to construct a new spirituality. The 'Willow Gathering' he established in E75 became a symbol of later religious and ideological freedom, building the foundation for EDU's culture where diverse beliefs coexist. His teachings are summarized in the words 'Grow roots like a tree and spread branches,' a wisdom still passed down to descendants of settlers today.",
    era: "E55〜E140",
    affiliation: "入植者精神共同体",
    tier: "Tier 3",
  },{
    id: "コマンダー・アーチャー" as WikiId,
    name: "コマンダー・アーチャー",
    nameEn: "Commander Archer",
    category: "キャラクター",
    subCategory: "第一移民期",
    description:
      "第一移民期における西大陸防衛部隊の初代司令官としてE60年からE130年まで在外の脅威から入植地を防衛した軍人。ガイウス・セプティムスの軍事教範を継承しつつ、宇宙環境に適応した防衛戦術を開発した。E95年の小惑星海賊襲撃では少数の防衛部隊で大規模な攻撃を撃退し、その戦術は「アーチャー戦法」として後世に伝えられた。テクロサスの軍事組織との連携も構築し、西大陸防衛の基盤を確立した武人。",
    descriptionEn:
      "As the first Commander of the Western Continent Defense Force from E60 to E130, this military officer defended the settlement from external threats. While inheriting the military doctrines of Gaius Septimus, he developed defense tactics adapted to the space environment. During the asteroid pirate raid in E95, he repelled a large-scale attack with a small defense force, a tactic later known as the 'Archer Method' and passed down through generations. He also built cooperation with Technorus military organizations, establishing the foundation for Western Continent defense—a warrior of great strategic vision.",
    era: "E60〜E130",
    affiliation: "西大陸防衛部隊",
    tier: "Tier 3",
  },{
    id: "アドミラル・フロスト" as WikiId,
    name: "アドミラル・フロスト",
    nameEn: "Admiral Frost",
    category: "キャラクター",
    subCategory: "第一移民期",
    description:
      "第一移民期における移民船団護衛艦隊の総司令官としてE55年からE135年まで星域の安全を確保した提督。冷徹な判断力と卓越した艦隊指揮能力で知られ、E75年の「氷河の戦い」と呼ばれる宇宙海戦では圧倒的な敵勢力を打ち破った。艦隊編成の改革により機動力を重視した新しい海戦ドクトリンを確立し、後のテクロサス艦隊運用に多大な影響を与えた。「氷の提督」の異名はその冷静沈着な指揮スタイルに由来する。",
    descriptionEn:
      "As the Commander-in-Chief of the Immigration Fleet Escort Fleet from E55 to E135, this admiral ensured security in the star system. Known for his cold judgment and exceptional fleet command capabilities, he defeated overwhelming enemy forces in the 'Battle of the Glaciers' in E75, a cosmic space battle. Through fleet reorganization, he established a new naval doctrine emphasizing mobility, greatly influencing later Technorus fleet operations. His nickname 'The Ice Admiral' derives from his calm and composed command style.",
    era: "E55〜E135",
    affiliation: "移民船団護衛艦隊",
    tier: "Tier 3",
  },{
    id: "ジェネラル・テラ" as WikiId,
    name: "ジェネラル・テラ",
    nameEn: "General Terra",
    category: "キャラクター",
    subCategory: "第一移民期",
    description:
      "第一移民期における地上防衛軍の初代総司令官としてE62年からE132年まで入植地周辺の地上戦力を統括した将軍。未開地の地形を活用した防御陣地の構築において類まれな才能を発揮し、E88年の辺境異星生物の大群襲来を撃退した。彼が構築した防衛ライン「テラ・ウォール」は後の都市防衛システムの原型となった。兵士教育にも力を入れ、彼の軍学校からは多くの優秀な将校が巣立った。",
    descriptionEn:
      "As the first Commander-in-Chief of the Ground Defense Force from E62 to E132, this general commanded ground forces around the settlement. He demonstrated extraordinary talent in constructing defensive positions utilizing uncharted terrain, repelling the massive swarm of border alien creatures in E88. The defense line he built, the 'Terra Wall,' became the prototype for later urban defense systems. He also focused on soldier education, and many excellent officers graduated from his military academy.",
    era: "E62〜E132",
    affiliation: "西大陸地上防衛軍",
    tier: "Tier 3",
  },{
    id: "アルキテクト・ゼン" as WikiId,
    name: "アルキテクト・ゼン",
    nameEn: "Architect Zen",
    category: "キャラクター",
    subCategory: "ギガポリス建設期",
    description:
      "ギガポリス建設期の主任建築家であり、E155年からE250年にかけてメガタワーの設計と建設を主導した伝説的な建築家。エル・フォルハウスのマーストリヒト革命（E150）の直後に台頭し、自由経済体制下における都市計画の総監督として活動した。彼の設計したメガタワー構想は垂直都市の概念を具現化し、西大陸の天際線を劇的に変貌させた。E200年に完成した第1メガタワーはEDU建築史上最も偉大な構造物の一つとして評価されている。",
    descriptionEn:
      "The chief architect during the Gigapolis construction period, a legendary architect who led the design and construction of megatowers from E155 to E250. Rising immediately after the Maastricht Revolution of El Forhaus (E150), he served as the supervisor of urban planning under the free economic system. His megatower designs materialized the concept of vertical cities, dramatically transforming the skyline of the Western Continent. The first megatower, completed in E200, is regarded as one of the greatest structures in EDU architectural history.",
    era: "E155〜E250",
    affiliation: "ギガポリス建設委員会",
    tier: "Tier 3",
  },{
    id: "デザイナー・ルナ" as WikiId,
    name: "デザイナー・ルナ",
    nameEn: "Designer Luna",
    category: "キャラクター",
    subCategory: "ギガポリス建設期",
    description:
      "ギガポリス建設期の環境デザイナーとしてE160年からE245年まで都市の景観と居住環境の設計を担当した芸術家。アルキテクト・ゼンの構造設計に対し、人間味のある居住空間の創造を追求し、公園・広場・緑地帯の配置を計画した。E180年に提唱した「緑のギガポリス」構想は、都市と自然の調和を目指す先進的な環境計画として高く評価された。その美学はのちのセリア黄金期におけるAURALISの文化的基盤にも影響を与えた。",
    descriptionEn:
      "An environmental designer who served as the artist in charge of the city's landscape and living environment design from E160 to E245 during the Gigapolis construction period. Pursuing the creation of human-centered living spaces in contrast to Architect Zen's structural designs, he planned the layout of parks, plazas, and green zones. His 'Green Gigapolis' concept, proposed in E180, was highly acclaimed as an advanced environmental plan aiming for harmony between city and nature. His aesthetics later influenced the cultural foundation of AURALIS during the Cerean Golden Age.",
    era: "E160〜E245",
    affiliation: "ギガポリス環境設計局",
    tier: "Tier 3",
  },{
    id: "エンジニア・ピラー" as WikiId,
    name: "エンジニア・ピラー",
    nameEn: "Engineer Pillar",
    category: "キャラクター",
    subCategory: "ギガポリス建設期",
    description:
      "ギガポリス建設期の構造エンジニアとしてE158年からE248年までメガタワーの構造計算と安全性確保を担当した技術者。超高層建築物の耐震・耐風・耐宇宙線設計の分野で先駆的な業績を残し、数多くの技術的課題を解決した。E190年の大嵐ではメガタワーの構造的完全性を証明し、都市建設への信頼を確立した。彼が開発した「ピラー式基礎工法」は現在でも大型構造物の建設に用いられている。",
    descriptionEn:
      "A structural engineer who served as the technical specialist in charge of megatower structural calculations and safety assurance from E158 to E248 during the Gigapolis construction period. He made pioneering achievements in the fields of seismic, wind resistance, and cosmic ray design for ultra-high-rise buildings, solving numerous technical challenges. During the Great Storm of E190, he proved the structural integrity of the megatowers, establishing confidence in urban construction. The 'Pillar Foundation Method' he developed is still used in the construction of large structures today.",
    era: "E158〜E248",
    affiliation: "ギガポリス建設委員会",
    tier: "Tier 3",
  },{
    id: "プランナー・アクア" as WikiId,
    name: "プランナー・アクア",
    nameEn: "Planner Aqua",
    category: "キャラクター",
    subCategory: "ギガポリス建設期",
    description:
      "ギガポリス建設期の水資源計画担当者としてE162年からE240年まで都市の水循環システムの設計と管理を担当した都市計画家。閉鎖環境での水のリサイクルと浄化システムを確立し、大規模都市における水資源の安定供給を実現した。E185年に完成した「アクア・リング」と呼ばれる循環水路システムは、都市の美観と機能性を両立した画期的なインフラとして評価されている。後のテリアン反乱軍が掲げた市民の生活権要求にも通じる、生活基盤整備の先駆者。",
    descriptionEn:
      "An urban planner who served as the water resources planner from E162 to E240 during the Gigapolis construction period, designing and managing the city's water circulation system. He established water recycling and purification systems in a closed environment, achieving stable water supply for the massive city. The 'Aqua Ring' circulation waterway system, completed in E185, is evaluated as a groundbreaking infrastructure that balanced both aesthetics and functionality of the city. A pioneer in infrastructure development whose philosophy resonated with the Terrian Rebellion's demands for citizens' right to livelihood.",
    era: "E162〜E240",
    affiliation: "ギガポリス水資源局",
    tier: "Tier 3",
  },{
    id: "エコノミスト・ゴールド" as WikiId,
    name: "エコノミスト・ゴールド",
    nameEn: "Economist Gold",
    category: "キャラクター",
    subCategory: "ギガポリス建設期",
    description:
      "ギガポリス建設期の首席経済官としてE155年からE255年まで都市の経済政策を立案した経済学者。エル・フォルハウスの完全自由経済体制の理論的支柱となり、市場原理に基づく都市運営のモデルを構築した。E180年に導入したゴールド標準通貨制度はのちのnトークン経済の先駆けとなった。また、都市間貿易の促進と税制改革も推進し、ギガポリスを星域最大の経済都市へと成長させた経済の建筑师。",
    descriptionEn:
      "The chief economic officer who formulated the city's economic policies from E155 to E255 during the Gigapolis construction period. He became the theoretical pillar of El Forhaus's complete free economic system, constructing a model for city operations based on market principles. The gold standard currency system he introduced in E180 became the precursor to later n-token economies. He also promoted inter-city trade and tax reforms, growing Gigapolis into the largest economic city in the star sector—the architect of the economy.",
    era: "E155〜E255",
    affiliation: "ギガポリス経済委員会",
    tier: "Tier 3",
  },{
    id: "バンカー・シルバー" as WikiId,
    name: "バンカー・シルバー",
    nameEn: "Banker Silver",
    category: "キャラクター",
    subCategory: "ギガポリス建設期",
    description:
      "ギガポリス建設期の銀行家としてE160年からE250年まで都市の金融システムの構築に従事した金融業者。初代ギガポリス中央銀行の設立メンバーであり、信用創造と資金調達のメカニズムを確立した。E195年に創設したシルバー銀行は後の金融帝国の基盤となり、ギガポリスの経済的影響力の拡大に寄与した。エコノミスト・ゴールドの経済政策を金融面から支え、都市の急成長を可能にした資金の供給者。",
    descriptionEn:
      "A financier who engaged in building the city's financial system from E160 to E250 during the Gigapolis construction period. A founding member of the first Gigapolis Central Bank, he established mechanisms for credit creation and fundraising. The Silver Bank he founded in E195 became the foundation for later financial empires, contributing to the expansion of Gigapolis's economic influence. He supported Economist Gold's economic policies from a financial perspective, serving as the capital provider that enabled the city's rapid growth.",
    era: "E160〜E250",
    affiliation: "シルバー銀行",
    tier: "Tier 3",
  },{
    id: "トレーダー・ブロンズ" as WikiId,
    name: "トレーダー・ブロンズ",
    nameEn: "Trader Bronze",
    category: "キャラクター",
    subCategory: "ギガポリス建設期",
    description:
      "ギガポリス建設期の大商人としてE165年からE248年まで星域間貿易を展開した実業家。希少資源と技術製品の取引において類まれな商才を発揮し、ギガポリスを交易の中心地へと発展させた。E190年に確立した「ブロンズ交易路」は7つの星系を結ぶ大規模な商業ネットワークであり、クレセント地方との交易の基礎となった。商業倫理の確立にも努め、自立的な商人ギルドの創設も主導した。",
    descriptionEn:
      "A great merchant who operated interstellar trade from E165 to E248 during the Gigapolis construction period. He demonstrated extraordinary business acumen in trading rare resources and technological products, developing Gigapolis into a center of commerce. The 'Bronze Trade Routes' he established in E190 formed a massive commercial network connecting seven star systems, becoming the foundation for trade with the Crescent Region. He also worked to establish commercial ethics and led the creation of independent merchant guilds.",
    era: "E165〜E248",
    affiliation: "ブロンズ商会",
    tier: "Tier 3",
  },{
    id: "チーフ・グリズリー" as WikiId,
    name: "チーフ・グリズリー",
    nameEn: "Chief Grizzly",
    category: "キャラクター",
    subCategory: "ギガポリス建設期",
    description:
      "ギガポリス建設期の労働組合初代委員長としてE170年からE245年まで建設労働者の権利保護と労働環境の改善に尽くした労働運動家。メガタワー建設の現場で働く労働者の劣悪な環境に抗議し、労働安全基準と賃金体系の確立を勝ち取った。E200年の大ストライキでは労働者の要求を貫き、ギガポリス建設の進行に一定の制約を課した。その不屈の闘志は「グリズリーの咆哮」として労働運動の象徴となった。",
    descriptionEn:
      "The first chairman of the labor union during the Gigapolis construction period, who dedicated himself from E170 to E245 to protecting workers' rights and improving labor conditions. He protested against the poor conditions of workers at megatower construction sites and successfully established labor safety standards and wage systems. During the Great Strike of E200, he persisted in workers' demands, imposing certain constraints on the progress of Gigapolis construction. His unyielding fighting spirit became known as the 'Grizzly's Roar,' symbolizing the labor movement.",
    era: "E170〜E245",
    affiliation: "ギガポリス労働組合",
    tier: "Tier 3",
  },{
    id: "エルダー・イーグル" as WikiId,
    name: "エルダー・イーグル",
    nameEn: "Elder Eagle",
    category: "キャラクター",
    subCategory: "ギガポリス建設期",
    description:
      "ギガポリス建設期における先住派住民の長老としてE150年からE230年まで活動し、急速な都市化の中で伝統文化の維持に努めた精神的指導者。エルダー・ウィローの教えを継承し、新しい都市環境におけるコミュニティの絆を保つため、地域ごとの集会所と祭りの伝統を維持した。E210年には都市計画への先住民参加の権利を確保し、多様な文化が共存するギガポリスの基盤を築いた。その先見性はのちのAURALISの多文化理念にも通じる。",
    descriptionEn:
      "A spiritual leader who served as the elder of the indigenous residents from E150 to E230 during the Gigapolis construction period, striving to maintain traditional culture amidst rapid urbanization. Inheriting the teachings of Elder Willow, he maintained community bonds in the new urban environment by preserving the traditions of local meeting places and festivals. In E210, he secured the right for indigenous participation in urban planning, laying the foundation for a Gigapolis where diverse cultures coexist. His foresight connects to the multicultural philosophy of later AURALIS.",
    era: "E150〜E230",
    affiliation: "先住派住民評議会",
    tier: "Tier 3",
  },{
    id: "シャーマン・フォックス" as WikiId,
    name: "シャーマン・フォックス",
    nameEn: "Shaman Fox",
    category: "キャラクター",
    subCategory: "ギガポリス建設期",
    description:
      "ギガポリス建設期における異星環境の研究と民間療法の専門家としてE165年からE240年まで活動した民俗学者・治療師。入植前に存在した異星生態系の知識を体系化し、未知の薬用植物の発見と応用に尽力した。E195年に発見した「フォックス・ハーブ」は鎮痛効果があり、医療資源の乏しい建設期において多くの労働者を救った。古代の伝承と近代科学の融合を図る異色の存在として、知的遺産の保存者としても評価されている。",
    descriptionEn:
      "A folklorist and healer who specialized in extraterrestrial environment research and folk medicine from E165 to E240 during the Gigapolis construction period. He systematized knowledge of the alien ecosystem that existed before colonization and dedicated himself to discovering and applying unknown medicinal plants. The 'Fox Herb' he discovered in E195 had pain-relieving effects and saved many workers during the construction period when medical resources were scarce. As a unique figure who fused ancient traditions with modern science, he is also evaluated as a preserver of intellectual heritage.",
    era: "E165〜E240",
    affiliation: "異星生態研究会",
    tier: "Tier 3",
  },{
    id: "チーフ・ドラゴン" as WikiId,
    name: "チーフ・ドラゴン",
    nameEn: "Chief Dragon",
    category: "キャラクター",
    subCategory: "ギガポリス建設期",
    description:
      "ギガポリス建設期の重工業協会初代会長としてE168年からE242年まで都市の産業基盤の構築を主導した実業家。鉄鋼・機械・電子部品の生産体制を整備し、メガタワー建設に必要な資材の安定供給を実現した。E205年に創設したドラゴン重工は後のアイアン・シンジケートの萌芽となり、クレセント地方の重工業発展の先駆けとなった。強引な手法も多用したが、その実行力はギガポリスの急速な近代化を支えた。",
    descriptionEn:
      "The first chairman of the Heavy Industry Association who led the construction of the city's industrial foundation from E168 to E242 during the Gigapolis construction period. He established production systems for steel, machinery, and electronic components, ensuring stable supply of materials necessary for megatower construction. Dragon Heavy Industries, which he founded in E205, became the precursor to later Iron Syndicates and a pioneer in the heavy industry development of the Crescent Region. Although he frequently employed aggressive methods, his execution power supported the rapid modernization of Gigapolis.",
    era: "E168〜E242",
    affiliation: "ギガポリス重工業協会",
    tier: "Tier 3",
  },{
    id: "エルダー・タイガー" as WikiId,
    name: "エルダー・タイガー",
    nameEn: "Elder Tiger",
    category: "キャラクター",
    subCategory: "ギガポリス建設期",
    description:
      "ギガポリス建設期の法学者としてE175年からE252年まで都市法の整備と司法制度改革に尽くした法律家。バーズ帝国期の法典を現代の都市環境に適合する形で改訂し、商法・労働法・建築法の体系化を主導した。E220年に制定した「タイガー法典」は都市法の集大成として評価され、後のZAMLT期の法体系にも影響を与えた。厳正な法解釈で知られ、建設期の混乱する都市環境に法的秩序をもたらした。",
    descriptionEn:
      "A jurist who dedicated himself from E175 to E252 to urban law development and judicial reform during the Gigapolis construction period. He revised the legal codes of the Bird Empire era to adapt to the modern urban environment, leading the systematization of commercial, labor, and construction law. The 'Tiger Code' enacted in E220 was evaluated as the culmination of urban law and influenced the legal systems of the later ZAMLT period. Known for his strict legal interpretations, he brought legal order to the chaotic urban environment of the construction period.",
    era: "E175〜E252",
    affiliation: "ギガポリス法務局",
    tier: "Tier 3",
  },{
    id: "シャーマン・スネーク" as WikiId,
    name: "シャーマン・スネーク",
    nameEn: "Shaman Snake",
    category: "キャラクター",
    subCategory: "ギガポリス建設期",
    description:
      "ギガポリス建設期の地下世界の案内人としてE172年からE235年まで地下空間の探査と開発に従事した探検家。都市の地下構造の解明と地下水脈の発見において重要な役割を果たし、のちの地下街建設の基礎となった。E210年に発見した大規模な地下空洞は「スネーク・ケイブ」として命名され、後のTina/Gueが支配する地下街の一部となった。蛇のような機知と洞察力で未知の地下世界を解読した、ギガポリスの「地下の開拓者」。",
    descriptionEn:
      "An explorer who served as a guide to the underworld during the construction of Gigapolis from E172 to E235, engaged in the exploration and development of underground spaces. Played a crucial role in deciphering the city's underground structure and discovering groundwater veins, laying the foundation for later underground street construction. The massive underground cavity discovered in E210 was named 'Snake Cave' and later became part of the underground street ruled by Tina/Gue. With snake-like wit and insight, he deciphered the unknown underground world, earning the title of 'Underground Pioneer' of Gigapolis.",
    era: "E172〜E235",
    affiliation: "地下探査協会",
    tier: "Tier 3",
  },{
    id: "コマンダー・ヴェルミリオン守備隊長" as WikiId,
    name: "ヴェルミリオン守備隊長",
    nameEn: "Commander of Vermilion Defense",
    category: "キャラクター",
    subCategory: "クレセント拡充",
    description:
      "E300年からE380年までヴァーミリオンの国境守備隊を統率した軍人。クレセント地方における初期の防衛ライン構築の指導者であり、後のヴァーミリオン諜報機関の基盤を築いた。テクロサス系譜の軍事教範をヴァーミリオンの地理的特徴に適合させ、独自の防衛戦術を確立した。E350年の辺境紛争では巧みな防御戦で侵略を退け、ヴァーミリオンの軍事的威信を確立した。アザゼル・ヘクトパスに先立つヴァーミリオン軍事力の基礎を築いた武人。",
    descriptionEn:
      "A military commander who led the Vermilion border defense forces from E300 to E380. He was the leader in constructing early defensive lines in the Crescent region and laid the foundation for the later Vermilion intelligence agency. He adapted the Teklos military doctrine to Vermilion's geographical characteristics, establishing unique defensive tactics. During the border conflict of E350, he repelled invasion with skillful defensive maneuvers, establishing Vermilion's military prestige. A warrior who built the foundation of Vermilion's military power that would later be succeeded by Azazel Hectopas.",
    era: "E300〜E380",
    affiliation: "ヴァーミリオン守備隊",
    tier: "Tier 3",
  },{
    id: "コマンダー・ブルーローズ衛兵長" as WikiId,
    name: "ブルーローズ衛兵長",
    nameEn: "Commander of Blue Rose Guard",
    category: "キャラクター",
    subCategory: "クレセント拡充",
    description:
      "E305年からE385年までブルーローズの王室衛兵隊を統率した近衛軍の指揮官。国家の中枢を守る精鋭部隊の編成と訓練において卓越した手腕を発揮し、ブルーローズの政治的安定に寄与した。E355年の内部騒乱では速やかに事態を鎮圧し、国家の存続を守った。後のフィオナやヨニックが率いるブルーローズ軍の原型となる衛兵隊制度を確立し、その規律ある軍事文化は現在まで受け継がれている。",
    descriptionEn:
      "A commander of the royal guard who led the Blue Rose royal guard from E305 to E385. Demonstrated exceptional skill in organizing and training the elite force that protected the nation's core, contributing to Blue Rose's political stability. During the internal unrest of E355, he quickly suppressed the situation, preserving the nation's existence. He established the guard system that would later become the model for the Blue Rose military led by Fiona and Yonic, and his disciplined military culture continues to be inherited to this day.",
    era: "E305〜E385",
    affiliation: "ブルーローズ衛兵隊",
    tier: "Tier 3",
  },{
    id: "コマンダー・SSレンジ警備隊長" as WikiId,
    name: "SSレンジ警備隊長",
    nameEn: "Commander of SS Range Security",
    category: "キャラクター",
    subCategory: "クレセント拡充",
    description:
      "E310年からE390年までSSレンジの交易拠点警備隊を統率した治安官。クレセント地方の交易路の安全確保と密輸取締りにおいて重要な役割を果たし、後のアイク・ロペスが支配するSSレンジ通信網の物理的安全基盤を築いた。E360年の大規模海賊襲撃では港湾防衛を指揮し、交易ルートの維持に成功した。交易と通信の安全を確保する実務的アプローチはSSレンジの組織文化に深く刻まれている。",
    descriptionEn:
      "A lawman who commanded the SS Range trading post security forces from E310 to E390. Played a vital role in ensuring the security of trade routes and combating smuggling in the Crescent region, building the physical security foundation for the SS Range communication network later dominated by Ike Lopez. During the large-scale pirate raid of E360, he commanded harbor defense and succeeded in maintaining trade routes. His practical approach to ensuring security for trade and communications is deeply embedded in SS Range's organizational culture.",
    era: "E310〜E390",
    affiliation: "SSレンジ警備隊",
    tier: "Tier 3",
  },{
    id: "コマンダー・アイアン・シンジケート軍事顧問" as WikiId,
    name: "アイアン・シンジケート軍事顧問",
    nameEn: "Iron Syndicate Military Advisor",
    category: "キャラクター",
    subCategory: "クレセント拡充",
    description:
      "E315年からE395年までアイアン・シンジケートの軍事顧問を務め、重工業地帯の防衛と軍需生産の両面で指導的役割を果たした軍人。工業施設の防衛に特化した戦術を開発し、生産拠点の安全確保と軍事物資の効率的供給を両立させた。E370年には兵器試験場の設立も指揮し、アイアン・シンジケートを軍需大国への道筋をつけた。後のレイド・カキザキの軍事産業政策の先駆けとなる実践的軍事技術者。",
    descriptionEn:
      "A military officer who served as military advisor to the Iron Syndicate from E315 to E395, playing a leading role in both the defense of industrial zones and military production. Developed tactics specialized in defending industrial facilities, successfully balancing the security of production bases with efficient supply of military materials. In E370, he also commanded the establishment of a weapons testing ground, paving the way for the Iron Syndicate to become a military-industrial powerhouse. A practical military engineer who pioneered the military-industrial policies later pursued by Raid Kakizaki.",
    era: "E315〜E395",
    affiliation: "アイアン・シンジケート",
    tier: "Tier 3",
  },{
    id: "コマンダー・クロセヴィア防衛長" as WikiId,
    name: "クロセヴィア防衛長",
    nameEn: "Commander of Crocevia Defense",
    category: "キャラクター",
    subCategory: "クレセント拡充",
    description:
      "E308年からE388年までクロセヴィアの軍事防衛を統括した防衛長。クレセント地方の中核国家としてのクロセヴィアの安全保障体制を構築し、周辺国との軍事的均衡の維持に尽力した。E365年の三国境界紛争では外交的解決と軍事的威圧の適切な組み合わせにより全面戦争を回避した。後のカスチーナ・テンペストが継承する独自路線の軍事的基盤を築き、クロセヴィアの防衛ドクトリンを確立した戦略家。",
    descriptionEn:
      "A defense chief who oversaw Crosevia's military defense from E308 to E388. Built the security system for Crosevia as a core nation in the Crescent region and worked to maintain military balance with neighboring countries. During the tri-border conflict of E365, he avoided full-scale war through an appropriate combination of diplomatic solutions and military pressure. A strategist who built the unique military foundation later inherited by Castina Tempest and established Crosevia's defense doctrine.",
    era: "E308〜E388",
    affiliation: "クロセヴィア防衛軍",
    tier: "Tier 3",
  },{
    id: "コマンダー・ミエルテンガ護衛隊長" as WikiId,
    name: "ミエルテンガ護衛隊長",
    nameEn: "Commander of Mieltenga Escort",
    category: "キャラクター",
    subCategory: "クレセント拡充",
    description:
      "E312年からE392年までミエルテンガの要人護衛隊を統率した近衛指揮官。外交官と政府要人の安全確保において高度な専門性を発揮し、暗殺や誘拐の未然防止に功績を残した。E375年のクレセント首脳会議では参加各国首脳の警護を指揮し、テロ未遂事件の阻止に成功した。後のマリーナ・ボビン政権下のミエルテンガ情報網の原型となる精密な警護システムを構築した。",
    descriptionEn:
      "A guard commander who led Miertenga's VIP protection unit from E312 to E392. Demonstrated high expertise in ensuring the safety of diplomats and government officials, achieving remarkable success in preventing assassinations and kidnappings. During the Crescent summit conference in E375, he commanded security for participating heads of state and successfully prevented a terrorist attempt. Built the sophisticated protection system that would later become the prototype for Miertenga's intelligence network under the Marina Bobbin administration.",
    era: "E312〜E392",
    affiliation: "ミエルテンガ護衛隊",
    tier: "Tier 3",
  },{
    id: "コマンダー・ファールージャ社軍事部長" as WikiId,
    name: "ファールージャ社軍事部長",
    nameEn: "Faruja Corp Military Director",
    category: "キャラクター",
    subCategory: "クレセント拡充",
    description:
      "E320年からE398年までファールージャ社の軍事部門を統括した企業の軍事責任者。民間企業としてのファールージャ社に軍事部門を創設し、次元極地平技術の軍事応用の基礎を築いた。E380年には最初の次元兵器のプロトタイプ開発を指揮し、企業の軍事的影響力の拡大に寄与した。後のミカエル・ガブリエリが率いるファールージャ社の「第8の力」への道を開いた、企業と軍事の融合の先駆者。",
    descriptionEn:
      "A corporate military executive who oversaw Farooja Corporation's military division from E320 to E398. Established a military division within the civilian Farooja Corporation and laid the foundation for military applications of dimensional polar technology. In E380, he commanded the development of the first prototype dimensional weapon, contributing to the expansion of the corporation's military influence. A pioneer in the fusion of corporate and military interests who paved the way for Farooja Corporation's 'Eighth Power' under the leadership of Michael Gabriel.",
    era: "E320〜E398",
    affiliation: "ファールージャ社軍事部門",
    tier: "Tier 3",
  },{
    id: "ドクター・ヴェルミリオン主席研究員" as WikiId,
    name: "ヴェルミリオン主席研究員",
    nameEn: "Chief Researcher of Vermilion",
    category: "キャラクター",
    subCategory: "クレセント拡充",
    description:
      "E302年からE385年までヴァーミリオンの科学研究機関で主席研究員を務めた科学者。諜報活動に必要な技術開発において先駆的な業績を残し、盗聴装置・暗号解読器・変装技術などの革新をもたらした。E350年には「ヴェルミリオン・プロトコル」と呼ばれる情報セキュリティ規格を策定し、組織の情報戦能力を飛躍的に向上させた。後のアイリスが駆使するブルーワイヤやウォーター・オーブの技術的基盤を築いたとされる。",
    descriptionEn:
      "A scientist who served as chief researcher at Vermilion's scientific research institution from E302 to E385. Achieved pioneering results in developing technologies necessary for intelligence activities, bringing innovations such as eavesdropping devices, codebreakers, and disguise techniques. In E350, he formulated the 'Vermilion Protocol,' an information security standard that dramatically enhanced the organization's information warfare capabilities. Is believed to have laid the technical foundation for Bluewire and Water Orb later wielded by Iris.",
    era: "E302〜E385",
    affiliation: "ヴァーミリオン研究機関",
    tier: "Tier 3",
  },{
    id: "ドクター・ブルーローズ技術顧問" as WikiId,
    name: "ブルーローズ技術顧問",
    nameEn: "Blue Rose Technical Advisor",
    category: "キャラクター",
    subCategory: "クレセント拡充",
    description:
      "E306年からE388年までブルーローズ政府の技術顧問を務めた技術官僚。都市インフラの近代化と通信技術の向上において中心的な役割を果たし、国家の技術的競争力を強化した。E365年には大規模通信網の整備計画を策定し、国内の情報伝達速度を劇的に改善した。その技術遺産はのちのブルーローズがV7で果たす役割の基盤となり、軍事的通信の安定性にも貢献している。",
    descriptionEn:
      "A technical bureaucrat who served as technical advisor to the Blue Rose government from E306 to E388. Played a central role in modernizing urban infrastructure and improving communication technology, strengthening the nation's technological competitiveness. In E365, he formulated a plan for large-scale communication network development, dramatically improving domestic information transmission speed. His technological legacy became the foundation for Blue Rose's role in V7 and also contributed to the stability of military communications.",
    era: "E306〜E388",
    affiliation: "ブルーローズ技術省",
    tier: "Tier 3",
  },{
    id: "ドクター・SSレンジ通信研究員" as WikiId,
    name: "SSレンジ通信研究員",
    nameEn: "SS Range Communication Researcher",
    category: "キャラクター",
    subCategory: "クレセント拡充",
    description:
      "E310年からE392年までSSレンジ通信研究所で長距離通信技術の研究に従事した通信技術者。クレセント地方全域をカバーする通信ネットワークの技術的基盤を構築し、情報伝達の遅延問題を解決した。E370年に開発した「レンジ・リレー」技術は中継拠点不要の長距離通信を実現し、交易・軍事・外交の各分野に革命をもたらした。後のSSレンジがV7で経済的影響力を行使する基盤技術を創出した。",
    descriptionEn:
      "A communications engineer who engaged in long-distance communication technology research at the SS Range Communications Institute from E310 to E392. Built the technical foundation for a communication network covering the entire Crescent region, solving the problem of information transmission delays. The 'Range Relay' technology developed in E370 achieved long-distance communication without relay stations, bringing revolution to trade, military, and diplomatic fields. Created the fundamental technology that would later allow SS Range to exercise economic influence through V7.",
    era: "E310〜E392",
    affiliation: "SSレンジ通信研究所",
    tier: "Tier 3",
  },{
    id: "ドクター・アイアン・シンジケート材料学者" as WikiId,
    name: "アイアン・シンジケート材料学者",
    nameEn: "Iron Syndicate Materials Scientist",
    category: "キャラクター",
    subCategory: "クレセント拡充",
    description:
      "E315年からE396年までアイアン・シンジケートで新素材の研究開発に従事した材料科学者。超高強度合金と耐熱素材の開発において画期的な成果を上げ、重工業製品の性能と耐久性を飛躍的に向上させた。E375年に発見した「シンジケート・スチール」は艦船の装甲材として広く採用され、軍事技術の進歩に多大な影響を与えた。後のレイド・カキザキの軍需生産体制を支える基礎技術の創出者。",
    descriptionEn:
      "A materials scientist who engaged in research and development of new materials at the Iron Syndicate from E315 to E396. Achieved groundbreaking results in developing ultra-high-strength alloys and heat-resistant materials, dramatically improving the performance and durability of heavy industrial products. The 'Syndicate Steel' discovered in E375 was widely adopted as armor material for warships, greatly influencing the advancement of military technology. The creator of the fundamental technologies that would support Raid Kakizaki's military production system.",
    era: "E315〜E396",
    affiliation: "アイアン・シンジケート研究所",
    tier: "Tier 3",
  },{
    id: "ドクター・クロセヴィア生物学者" as WikiId,
    name: "クロセヴィア生物学者",
    nameEn: "Crocevia Biologist",
    category: "キャラクター",
    subCategory: "クレセント拡充",
    description:
      "E308年からE390年までクロセヴィアで異星生態系の研究に従事した生物学者。クレセント地方特有の動植物の分類と生態調査において先駆的な業績を残し、農業・医療・環境保護の各分野に貢献した。E360年に発見した薬用菌類は重篤な感染症の治療に効果があり、多くの命を救った。E340年のスライム・ウーマン顕現の際にも科学的分析を試み、異次元生物の理解に重要なデータを提供した。",
    descriptionEn:
      "A biologist who engaged in extraterrestrial ecosystem research in Crosevia from E308 to E390. They made pioneering achievements in classifying and surveying the unique flora and fauna of the Crescent region, contributing to the fields of agriculture, medicine, and environmental conservation. The medicinal fungi they discovered in E360 proved effective in treating severe infectious diseases, saving countless lives. During the manifestation of the Slime Woman in E340, they attempted scientific analysis, providing crucial data for understanding interdimensional beings.",
    era: "E308〜E390",
    affiliation: "クロセヴィア生物学研究所",
    tier: "Tier 3",
  },{
    id: "ドクター・ミエルテンガ医務官" as WikiId,
    name: "ミエルテンガ医務官",
    nameEn: "Mieltenga Medical Officer",
    category: "キャラクター",
    subCategory: "クレセント拡充",
    description:
      "E312年からE395年までミエルテンガの軍医・衛生管理を担当した医務官。軍隊の健康管理と戦地医療の体制を整備し、負傷者の生存率を大幅に向上させた。E370年の大規模疫病発生時には迅速な対応措置を講じ、感染の拡大を防いだ。軍医としてだけでなく、一般市民の医療アクセスの改善にも努め、ミエルテンガの公衆衛生基盤を確立した。ドクター・オクタヴィアの医療哲学をクレセント大陸に広めた継承者。",
    descriptionEn:
      "A medical officer who served as the military physician and sanitation administrator of Mielternga from E312 to E395. They established systems for military health management and battlefield medicine, significantly increasing the survival rate of the wounded. During the large-scale epidemic in E370, they implemented rapid response measures to prevent the spread of infection. Not only as a military physician but also as an advocate for improving medical access for civilians, they established the public health foundation of Mielternga. A successor who spread Doctor Octavia's medical philosophy across the Crescent continent.",
    era: "E312〜E395",
    affiliation: "ミエルテンガ軍医部",
    tier: "Tier 3",
  },{
    id: "ドクター・ファールージャ社次元物理学者" as WikiId,
    name: "ファールージャ社次元物理学者",
    nameEn: "Faruja Corp Dimensional Physicist",
    category: "キャラクター",
    subCategory: "クレセント拡充",
    description:
      "E325年からE399年までファールージャ社で次元物理学の研究に従事した理論物理学者。ティムール・シャーの10次元ホラズム理論を実用化する研究を推進し、次元極地平技術の理論的基礎を構築した。E385年に発表した「ファールージャ次元方程式」は次元間移動の数学的框架を提供し、後の軍事・民生両面への応用の扉を開いた。その理論的業績はミカエル・ガブリエリの企業戦略の根幹を支え、クレセントの技術競争に決定的な影響を与えた。",
    descriptionEn:
      "A theoretical physicist who worked on dimensional physics research at Farulja Corporation from E325 to E399. They advanced research to implement Timur Shah's ten-dimensional Horazm theory, constructing the theoretical foundation of dimensional polar horizon technology. The 'Farulja Dimensional Equation' published in E385 provided the mathematical framework for interdimensional travel, opening doors to subsequent applications in both military and civilian sectors. Their theoretical achievements supported the core of Michael Gabrieli's corporate strategy and decisively influenced Crescent's technological competition.",
    era: "E325〜E399",
    affiliation: "ファールージャ社研究所",
    tier: "Tier 3",
  },{
    id: "リベリオン・リーダー・アッシュ" as WikiId,
    name: "リベリオン・リーダー・アッシュ",
    nameEn: "Rebellion Leader Ash",
    category: "キャラクター",
    subCategory: "クレセント拡充",
    description:
      "E350年からE400年までクレセント地方の反体制運動を指導した革命家。各国家の圧政的な統治体制に対して武装闘争を組織し、都市部の貧困層から広範な支持を集めた。アルファ・ケインのシャドウ・リベリオン（E318〜）に触発されたとも言われ、クレセント版の解放運動として展開。E380年の大規模蜂起では都市を一時的に制圧したが、鎮圧後に消息不明となった。その理想主義的な闘争はのちのテリアン反乱軍やアルファ・ヴェノムの思想的源泉の一つとなった。",
    descriptionEn:
      "A revolutionary who led anti-establishment movements in the Crescent region from E350 to E400. They organized armed struggles against the oppressive governance of various nations, garnering broad support from the urban poor. It is said they were inspired by Alpha Cain's Shadow Rebellion (E318-), developing as a Crescent version of the liberation movement. In the large-scale uprising of E380, they temporarily controlled urban areas but disappeared after suppression. Their idealistic struggle became one of the ideological sources for later Terian rebel forces and Alpha Venom.",
    era: "E350〜E400",
    affiliation: "クレセント反体制連合",
    tier: "Tier 3",
  },{
    id: "レジスタンス・コマンダー・フレイム" as WikiId,
    name: "レジスタンス・コマンダー・フレイム",
    nameEn: "Resistance Commander Flame",
    category: "キャラクター",
    subCategory: "クレセント拡充",
    description:
      "E355年からE405年までクレセント地方で活動したレジスタンス運動の軍事指揮官。リベリオン・リーダー・アッシュの右腕として実戦部隊の編成と作戦の実行を担い、政府軍との市街戦で数々の戦果を上げた。ゲリラ戦術の専門家として知られ、正規軍を相手に劣勢な戦力で有効な打撃を与え続けた。E395年の「紅蓮の夜」と呼ばれる作戦では、都市の兵器庫を占拠し、反体制勢力の戦力を大幅に強化した。その戦術はのちのシャドウ・リベリオンにも影響を与えたとされる。",
    descriptionEn:
      "A military commander of the resistance movement active in the Crescent region from E355 to E405. As the right-hand man of Rebellion Leader Ash, they commanded the formation of combat units and execution of operations, achieving numerous victories against government forces in urban warfare. Known as a specialist in guerrilla tactics, they continued to deliver effective blows against regular forces despite being outnumbered. In the operation known as 'Night of Crimson Lotus' in E395, they seized the city's arsenal, significantly strengthening the anti-establishment forces. Their tactics are said to have influenced later Shadow Rebellions.",
    era: "E355〜E405",
    affiliation: "クレセント反体制連合",
    tier: "Tier 3",
  },{
    id: "アンダーグラウンド・フィクサー・シャドウ" as WikiId,
    name: "アンダーグラウンド・フィクサー・シャドウ",
    nameEn: "Underground Fixer Shadow",
    category: "キャラクター",
    subCategory: "クレセント拡充",
    description:
      "E345年からE410年までクレセント地方の地下経済を操る裏の調整者として活動した謎の人物。反体制運動への資金提供と武器供給を行い、表と裏の両面でクレセント政治に影響を与えた。正体不明の点が多く、複数の国家の情報機関が追跡を試みたが、その実態は現在も明らかではない。後のTina/Gueの地下支配と類似した暗躍ぶりから、両者に何らかの関連があった可能性が指摘されている。地下世界の「影の支配者」として、クレセントの暗部史に深い刻印を残した。",
    descriptionEn:
      "A mysterious figure who operated as an underground coordinator controlling the underground economy of the Crescent region from E345 to E410. They provided funding and weapons to anti-establishment movements, influencing Crescent politics from both visible and hidden fronts. Much about their identity remains unknown, with multiple intelligence agencies attempting to track them without success. Their covert activities, similar to the later underground rule of Tina/Gue, have led to speculation of a connection between them. As the 'Shadow Ruler' of the underworld, they left a deep mark on the hidden history of the Crescent.",
    era: "E345〜E410",
    affiliation: "地下経済ネットワーク",
    tier: "Tier 3",
  },{
    id: "フリーダム・ファイター・ストーム" as WikiId,
    name: "フリーダム・ファイター・ストーム",
    nameEn: "Freedom Fighter Storm",
    category: "キャラクター",
    subCategory: "クレセント拡充",
    description:
      "E360年からE408年までクレセント地方で情報活動を展開した自由闘争家。政府の不正情報を暴露し、市民の意識覚醒を促すプロパガンダ活動において卓越した手腕を発揮した。E385年に創刊した地下新聞「ストーム」は反体制運動の広報媒体として広く読まれ、言論の自由を求める声を代弁した。E398年の大弾圧時に逮捕・投獄されたが、その獄中からのメッセージは人々に自由への希望を与え続けた。",
    descriptionEn:
      "A freedom fighter who conducted information operations in the Crescent region from E360 to E408. They demonstrated exceptional skill in exposing government misinformation and propaganda campaigns aimed at raising public awareness. The underground newspaper 'Storm', which they founded in E385, was widely read as a publicity medium for anti-establishment movements, giving voice to calls for freedom of speech. Arrested and imprisoned during the great suppression in E398, their messages from prison continued to give people hope for freedom.",
    era: "E360〜E408",
    affiliation: "クレセント言論自由同盟",
    tier: "Tier 3",
  },{
    id: "ネイト・クロス" as WikiId,
    name: "ネイト・クロス",
    nameEn: "Nate Cross",
    category: "キャラクター",
    subCategory: "クレセント拡充",
    description:
      "E370年からE420年までクレセント地方で活動した傭兵団「クロス・カンパニー」の創設者。戦闘経験豊富な傭兵を組織化し、各国政府や企業からの依頼に応じて軍事支援を提供した。政治的立场に縛られない実利主義的な姿勢で、V7設立前のクレセント情勢において複雑な役割を果たした。E400年のエヴァトロン支配期にはテリアン反乱軍への武器供給も行い、エリオス・ウォルドの抵抗運動を裏で支援したとされる。",
    descriptionEn:
      "The founder of the mercenary company 'Cross Company', active in the Crescent region from E370 to E420. They organized experienced mercenaries, providing military support in response to requests from various governments and corporations. With their pragmatic, non-partisan stance, they played a complex role in the pre-V7 situation of the Crescent. During the Evatron domination period in E400, they are said to have supplied weapons to the Terian rebel forces and secretly supported Elios Wald's resistance movement.",
    era: "E370〜E420",
    affiliation: "クロス・カンパニー",
    tier: "Tier 3",
  },{
    id: "セラ・ムーンライト" as WikiId,
    name: "セラ・ムーンライト",
    nameEn: "Cera Moonlight",
    category: "キャラクター",
    subCategory: "クレセント拡充",
    description:
      "E375年からE425年までクレセント地方で活動した女性外交官・平和運動家。紛争解決と和平交渉において傑出した能力を発揮し、E390年の三国境界紛争の停戦交渉では中立の調停者として重要な役割を果たした。その後もクレセント各国間の対話の推進に努め、のちのV7設立（E515）に至る協力体制の萌芽を育てた。「月光の調停者」として知られ、平和的な問題解決の象徴として現在でも語り継がれている。",
    descriptionEn:
      "A female diplomat and peace activist active in the Crescent region from E375 to E425. They demonstrated outstanding abilities in conflict resolution and peace negotiations, playing a crucial role as a neutral mediator in the armistice negotiations for the tri-border conflict in E390. Thereafter, they promoted dialogue among the nations of the Crescent, nurturing the seeds of the cooperative system that would lead to the establishment of V7 in E515. Known as the 'Moonlight Mediator', they are still spoken of today as a symbol of peaceful problem resolution.",
    era: "E375〜E425",
    affiliation: "クレセント平和推進協会",
    tier: "Tier 3",
  },{
    id: "レン・ブラックウッド" as WikiId,
    name: "レン・ブラックウッド",
    nameEn: "Ren Blackwood",
    category: "キャラクター",
    subCategory: "クレセント拡充",
    description:
      "E380年からE430年までクレセント地方で活動した情報屋・諜報師。複数の国家の情報機関と取引を行い、クレセント政治の裏側で暗躍した。E400年のエヴァトロン支配期には地下抵抗運動への情報支援を行い、E475年のシルバー・ヴェノム結成の際にも裏で糸を引いたとされる。マスター・ヴェノムとの関連も指摘されており、クレセント暗部の歴史において決定的な役割を果たした裏方の存在。その情報網はのちのシルバー・ヴェノム・アルファ・ヴェノムの基盤となった可能性がある。",
    descriptionEn:
      "An information broker and spy active in the Crescent region from E380 to E430. They conducted transactions with multiple intelligence agencies, operating in the shadows behind Crescent politics. During the Evatron domination period in E400, they provided information support to the underground resistance movement, and are also said to have pulled strings behind the formation of Silver Venom in E475. Their connection to Master Venom has also been pointed out, making them a decisive behind-the-scenes figure in the hidden history of the Crescent. Their information network may have become the foundation for later Silver Venom and Alpha Venom.",
    era: "E380〜E430",
    affiliation: "独立情報屋",
    tier: "Tier 3",
  },{
    id: "キャプテン・テクロサス第1支隊" as WikiId,
    name: "第1支隊キャプテン",
    nameEn: "Captain of Tekrosus 1st Division",
    category: "キャラクター",
    subCategory: "テクロサス",
    description:
      "E350年からE420年までテクロサス第1支隊を統率した軍人。テクロサス系譜（E15ファランクス → E295三頭政治改編 → E470東方支隊）の中核戦力である第1支隊の指揮官として、クレセント地方の安全保障に従事した。E380年の辺境大戦では先鋒として敵陣の突破に成功し、テクロサスの軍事的威信を高めた。後のボグダス・ジャベリンが継承するテクロサス戦闘教範の完成者であり、セバスチャン・ヴァレリウスの先代にあたる。",
    descriptionEn:
      "A military officer who commanded the First Detachment of Teclosas from E350 to E420. As the commander of the First Detachment, a core force within the Teclosas lineage (E15 Phalanx → E295 Triumvirate Reorganization → E470 Eastern Detachment), they were engaged in the security of the Crescent region. In the Border War of E380, they succeeded as a vanguard in breaking through enemy lines, enhancing the military prestige of Teclosas. The one who perfected the Teclosas combat doctrine later inherited by Bogdas Javelin, and the predecessor of Sebastian Valerius.",
    era: "E350〜E420",
    affiliation: "テクロサス第1支隊",
    tier: "Tier 3",
  },{
    id: "キャプテン・テクロサス第2支隊" as WikiId,
    name: "第2支隊キャプテン",
    nameEn: "Captain of Tekrosus 2nd Division",
    category: "キャラクター",
    subCategory: "テクロサス",
    description:
      "E355年からE425年までテクロサス第2支隊を統率した軍人。防御戦闘のエキスパートとして知られ、クレセント地方の要塞防衛において類まれな能力を発揮した。E390年の大規模侵攻作戦では3ヶ月にわたり要塞を維持し、敵の攻撃を撃退し続けた。その防御戦術は「不動の第2」として軍内部で伝説化し、のちのワドリナの盾役に通じるテクロサス防衛戦術の伝統を確立した。",
    descriptionEn:
      "A military officer who commanded the Second Detachment of Teclosas from E355 to E425. Known as an expert in defensive combat, they demonstrated extraordinary abilities in fortress defense across the Crescent region. In the large-scale invasion operation of E390, they maintained a fortress for three consecutive months, continuously repelling enemy attacks. Their defensive tactics became legendary within the military as 'The Immovable Second', establishing the tradition of Teclosas defensive tactics that would later connect to the role of Wadrina's Shield.",
    era: "E355〜E425",
    affiliation: "テクロサス第2支隊",
    tier: "Tier 3",
  },{
    id: "キャプテン・テクロサス第3支隊" as WikiId,
    name: "第3支隊キャプテン",
    nameEn: "Captain of Tekrosus 3rd Division",
    category: "キャラクター",
    subCategory: "テクロサス",
    description:
      "E360年からE430年までテクロサス第3支隊を統率した軍人。機動戦と奇襲作戦の専門家として知られ、少ない戦力で最大の戦果を上げる戦術において卓越していた。E395年の「夜の槍作戦」では、敵の補給線を単独部隊で切断し、戦局を一変させた。第3支隊はテクロサスの「影の牙」として恐れられ、その機動的な戦闘スタイルはのちのホワイトノイズやミユシャリの諜報・偵察活動の先駆けとなった。",
    descriptionEn:
      "A military commander who led the Third Detachment of Teklosus from E360 to E430. Known as a specialist in mobile warfare and surprise operations, he excelled in tactics that achieved maximum results with minimal forces. In the 'Night's Spear Operation' of E395, he single-handedly severed enemy supply lines with a small unit, completely reversing the course of the battle. The Third Detachment was feared as the 'Shadow Fang' of Teklosus, and their mobile combat style pioneered the intelligence and reconnaissance activities of later groups like White Noise and Miyushari.",
    era: "E360〜E430",
    affiliation: "テクロサス第3支隊",
    tier: "Tier 3",
  },{
    id: "キャプテン・テクロサス東方支隊" as WikiId,
    name: "東方支隊キャプテン",
    nameEn: "Captain of Tekrosus Eastern Division",
    category: "キャラクター",
    subCategory: "テクロサス",
    description:
      "E400年からE480年までテクロサス東方支隊を統率した軍人。E470年のクレセント大地方常駐に先立ち、東方支隊の再編と展開を指揮した指導者。エリオス・ウォルドの処刑（E470）に衝撃を受け、テクロサスのクレセント関与を強化する決断を下した。セバスチャン・ヴァレリウスの直接の前任者であり、ボグダス・ジャベリンへの移行をスムーズに行った。E490年のセバスチャンのヴァーミリオン恒久駐在開始の基盤を築いた。",
    descriptionEn:
      "A military commander who led the Eastern Detachment of Teklosus from E400 to E480. Prior to the permanent deployment to the Crescent Region in E470, he led the reorganization and deployment of the Eastern Detachment. Shocked by the execution of Elios Wald in E470, he made the decision to strengthen Teklosus' involvement in Crescent affairs. He was the direct predecessor of Sebastian Valerius and facilitated a smooth transition to Bogdas Javelin. He laid the foundation for Sebastian's permanent Vermillion residency beginning in E490.",
    era: "E400〜E480",
    affiliation: "テクロサス東方支隊",
    tier: "Tier 3",
  },{
    id: "キャプテン・テクロサス特殊部隊" as WikiId,
    name: "特殊部隊キャプテン",
    nameEn: "Captain of Tekrosus Special Forces",
    category: "キャラクター",
    subCategory: "テクロサス",
    description:
      "E365年からE440年までテクロサス特殊部隊を統率した特殊作戦の専門家。通常の軍事作戦では対処不可能な極秘任務を遂行し、各国の情報機関と協力してクレセント地方の治安維持に貢献した。E410年の「ゼロ・アワー作戦」では、大量破壊兵器の移送を阻止し、クレセント全域に及ぶ惨事を回避した。特殊部隊の訓練プログラムを体系化し、テクロサス最強の精鋭部隊としての評価を確立した。その戦術遺産はボグダス・ジャベリンの全メンバーに色濃く受け継がれている。",
    descriptionEn:
      "A special operations specialist who commanded the Teklosus Special Forces from E365 to E440. He carried out top-secret missions that conventional military operations could not handle, cooperating with intelligence agencies from various nations to maintain security in the Crescent Region. In the 'Zero Hour Operation' of E410, he prevented the transfer of weapons of mass destruction, avoiding a catastrophe that would have affected the entire Crescent Region. He systematized the training program for the Special Forces, establishing their reputation as Teklosus' elite force. His tactical legacy is strongly carried on by all members of Bogdas Javelin.",
    era: "E365〜E440",
    affiliation: "テクロサス特殊部隊",
    tier: "Tier 3",
  },{
    id: "リサーチャー・アルファ" as WikiId,
    name: "リサーチャー・アルファ",
    nameEn: "Researcher Alpha",
    category: "キャラクター",
    subCategory: "テクロサス",
    description:
      "E370年からE450年までテクロサス研究所で次元物理学の基礎研究に従事した首席研究員。ファールージャ社の次元物理学者とは独立に次元理論を研究し、異なるアプローチから次元間相互作用の解明を進めた。E410年に発表した「アルファ次元モデル」は、ペルセポネ事故（E340）の科学的分析に新たな視点を提供した。テクロサス独自の技術開発の方向性を決定づけた理論的基盤の構築者である。",
    descriptionEn:
      "Chief researcher at the Teklosus Institute who engaged in fundamental research in dimensional physics from E370 to E450. Independently of physicists from Faruja Corporation, he researched dimensional theory and made progress in understanding interdimensional interactions through different approaches. His 'Alpha Dimension Model,' published in E410, provided new perspectives for the scientific analysis of the Persephone Incident (E340). He was the architect of the theoretical foundation that determined the direction of Teklosus' unique technological development.",
    era: "E370〜E450",
    affiliation: "テクロサス研究所",
    tier: "Tier 3",
  },{
    id: "リサーチャー・ベータ" as WikiId,
    name: "リサーチャー・ベータ",
    nameEn: "Researcher Beta",
    category: "キャラクター",
    subCategory: "テクロサス",
    description:
      "E375年からE455年までテクロサス研究所で通信技術と暗号理論の研究に従事した研究員。軍事通信の安全性向上において画期的な成果を残し、敵の通信傍受を防ぐ新暗号方式を開発した。E420年に完成した「ベータ暗号」は解読不可能と評され、テクロサスの情報戦能力を飛躍的に強化した。後のイルミーゼの電子戦技術の先駆けとなる通信セキュリティ技術の確立者。",
    descriptionEn:
      "A researcher at the Teklosus Institute who worked on communication technology and cryptography from E375 to E455. He achieved groundbreaking results in improving the security of military communications, developing new encryption methods to prevent enemy eavesdropping. The 'Beta Cipher,' completed in E420, was deemed unbreakable and dramatically enhanced Teklosus' information warfare capabilities. He established communication security technologies that would later influence the electronic warfare technologies of Ilumize.",
    era: "E375〜E455",
    affiliation: "テクロサス研究所",
    tier: "Tier 3",
  },{
    id: "リサーチャー・ガンマ" as WikiId,
    name: "リサーチャー・ガンマ",
    nameEn: "Researcher Gamma",
    category: "キャラクター",
    subCategory: "テクロサス",
    description:
      "E380年からE460年までテクロサス研究所でエネルギー兵器の研究開発に従事した兵器技術者。従来の兵器とは異なる原理に基づく新型エネルギー兵器の開発を推進し、テクロサスの軍事的優位性の技術的基盤を強化した。E430年に完成した「ガンマ・ブラスター」のプロトタイプは、のちのレイラ・ヴィレル・ノヴァが使用するプラズマカノンの技術的先祖にあたる。兵器技術と倫理のジレンマに取り組みながら研究を続けた、テクロサス技術陣の良心。",
    descriptionEn:
      "A weapons engineer at the Teklosus Institute who worked on the research and development of energy weapons from E380 to E460. He promoted the development of new energy weapons based on principles different from conventional weapons, strengthening the technological foundation of Teklosus' military superiority. The prototype of the 'Gamma Blaster,' completed in E430, was the technological ancestor of the plasma cannon later used by Leila Virel Nova. While grappling with the dilemma between weapons technology and ethics, he continued his research, serving as the conscience of the Teklosus technical team.",
    era: "E380〜E460",
    affiliation: "テクロサス研究所",
    tier: "Tier 3",
  },{
    id: "レジスタンス・ワン" as WikiId,
    name: "レジスタンス・ワン",
    nameEn: "Resistance One",
    category: "キャラクター",
    subCategory: "テクロサス",
    description:
      "E420年からE480年までテクロサス内部で反体制活動を行った一号人物。テクロサスの軍国主義的傾向に異議を唱え、軍の民主化と市民軍事の転換を主張した。E450年のテクロサス内部クーデター未遂事件では計画の情報を外部に漏らし、流血の事態を回避した。その行動はテクロサスの組織文化に深い亀裂を入れ、後の東方支隊の独立動向に影響を与えた。コードネーム「ワン」は、単独で抗議を始めたことに由来する。",
    descriptionEn:
      "The leading figure in anti-establishment activities within Teklosus from E420 to E480. He objected to Teklosus' militaristic tendencies, advocating for military democratization and the transition to a citizen military. In the failed Teklosus internal coup of E450, he leaked information about the plot to the outside, avoiding a bloody situation. His actions created deep divisions in Teklosus' organizational culture and influenced later independence movements of the Eastern Detachment. His codename 'One' originated from his decision to protest alone.",
    era: "E420〜E480",
    affiliation: "テクロサス内部反体制派",
    tier: "Tier 3",
  },{
    id: "レジスタンス・ツー" as WikiId,
    name: "レジスタンス・ツー",
    nameEn: "Resistance Two",
    category: "キャラクター",
    subCategory: "テクロサス",
    description:
      "E425年からE485年までテクロサス内部で活動したレジスタンス・ワンの協力者。情報収集と組織の拡大を担い、テクロサス内の反体制派のネットワークを構築した。E460年には軍内部の人権侵害を内部告発し、国際的な非難を浴びせた。レジスタンス・ワンの逮捕後も活動を継続し、組織の存続を図った。その献身的な活動は、後のシャドウ・リベリオンの理念にも共鳴する軍事組織改革の草分け的存在。",
    descriptionEn:
      "A collaborator of Resistance One who operated within Teklosus from E425 to E485. He was responsible for information gathering and organizational expansion, building a network of anti-establishment factions within Teklosus. In E460, he exposed human rights violations within the military, drawing international condemnation. He continued his activities even after the arrest of Resistance One, working to ensure the organization's survival. His dedicated efforts made him a pioneering figure in military organizational reform whose ideals resonated with later Shadow Rebellion movements.",
    era: "E425〜E485",
    affiliation: "テクロサス内部反体制派",
    tier: "Tier 3",
  },{
    id: "レジスタンス・スリー" as WikiId,
    name: "レジスタンス・スリー",
    nameEn: "Resistance Three",
    category: "キャラクター",
    subCategory: "テクロサス",
    description:
      "E430年からE490年までテクロサス内部で活動した反体制派の技術担当。テクロサスの機密情報へのアクセス権を利用して、軍事機密の保護と透明性の両立を模索した。E465年に開発した内部監視システムの迂回ツールは、反体制派の安全な通信を可能にした。レジスタンス・ツーの情報網と連携し、テクロサス内部の民主化運動を技術面から支えた。後のボグダス・ジャベリンの電子戦能力にも間接的な影響を与えた。",
    descriptionEn:
      "The technical officer of the anti-establishment faction within Teklosus from E430 to E490. Using his access to Teklosus' classified information, he sought to balance military secrecy with transparency. In E465, he developed a tool to bypass internal surveillance systems, enabling secure communication for the anti-establishment faction. He coordinated with Resistance Two's information network, supporting the democratization movement within Teklosus from a technical perspective. His work also indirectly influenced the electronic warfare capabilities of later Bogdas Javelin.",
    era: "E430〜E490",
    affiliation: "テクロサス内部反体制派",
    tier: "Tier 3",
  },{
    id: "レジスタンス・フォー" as WikiId,
    name: "レジスタンス・フォー",
    nameEn: "Resistance Four",
    category: "キャラクター",
    subCategory: "テクロサス",
    description:
      "E435年からE495年までテクロサス内部で活動した反体制派の外交担当。テクロサス外部の民主主義勢力との連携を構築し、国際社会へのテクロサス批判の拡散を図った。E470年にはクレセント大地方の民主化運動との接触を確立し、テクロサス東方支隊のクレセント常駐を後押しした。四人のレジスタンス中最後まで自由の身であり、E495年に自らの意思でテクロサスを離脱。その後の動向は不明だが、自由のために戦い続けたと伝えられている。",
    descriptionEn:
      "The diplomatic officer of the anti-establishment faction within Teklosus from E435 to E495. He built connections with democratic forces outside Teklosus, aiming to spread criticism of Teklosus in the international community. In E470, he established contact with the democratization movement in the Crescent Region, supporting the permanent deployment of the Teklosus Eastern Detachment there. He was the last of the four Resistances to remain free, voluntarily leaving Teklosus in E495. His subsequent whereabouts are unknown, but it is said that he continued to fight for freedom.",
    era: "E435〜E495",
    affiliation: "テクロサス内部反体制派",
    tier: "Tier 3",
  },{
    id: "ステーション・マスター・オルビット" as WikiId,
    name: "ステーション・マスター・オルビット",
    nameEn: "Station Master Orbit",
    category: "キャラクター",
    subCategory: "Eros-7",
    description:
      "E300年からE420年までEros-7宇宙ステーションの初代ステーション・マスターを務めた管理者。宇宙ステーションの建設計画の立案から完成までを統括し、人類初の軌道上居住空間の実現に尽力した。E310年のステーション完成時には「宇宙への扉を開いた男」として広く称賛された。閉鎖環境の管理と居住者の生活維持において卓越した能力を発揮し、Eros-7を安全で自立した宇宙都市へと成長させた。彼の運営方針は「オルビット・スタンダード」として後のステーション管理の規範となった。",
    descriptionEn:
      "An administrator who served as the first Station Master of Eros-7 Space Station from E300 to E420. He oversaw the planning and completion of the space station's construction, dedicating himself to realizing humanity's first orbital living space. Upon the station's completion in E310, he was widely praised as 'the man who opened the door to space.' He demonstrated exceptional abilities in managing the closed environment and maintaining residents' well-being, growing Eros-7 into a safe and self-sufficient space city. His operational policies became the 'Orbit Standard,' serving as the norm for later station management.",
    era: "E300〜E420",
    affiliation: "Eros-7ステーション管理局",
    tier: "Tier 3",
  },{
    id: "オペレーター・コスモ" as WikiId,
    name: "オペレーター・コスモ",
    nameEn: "Operator Cosmo",
    category: "キャラクター",
    subCategory: "Eros-7",
    description:
      "E305年からE430年までEros-7の中枢制御システムの運用を担当したオペレーター。ステーションの生命維持・通信・航行の各システムの統合管理において、類まれなる状況判断力で幾度もの危機を回避した。E340年の太陽フレア緊急事態では、適切なシールド操作で居住区を守り抜いた。E380年に開発した自動制御プロトコルはEros-7の安全性を飛躍的に向上させ、後のパイオニアたちの宇宙探査活動の基盤技術となった。",
    descriptionEn:
      "An operator who managed the central control system of Eros-7 from E305 to E430. Through his extraordinary judgment in the integrated management of the station's life support, communications, and navigation systems, he avoided numerous crises. During the solar flare emergency of E340, he properly shielded the residential areas, protecting them from harm. The automatic control protocol he developed in E380 dramatically improved Eros-7's safety, becoming foundational technology for the space exploration activities of later Pioneers.",
    era: "E305〜E430",
    affiliation: "Eros-7中枢制御室",
    tier: "Tier 3",
  },{
    id: "エンジニア・スター" as WikiId,
    name: "エンジニア・スター",
    nameEn: "Engineer Star",
    category: "キャラクター",
    subCategory: "Eros-7",
    description:
      "E308年からE435年までEros-7のインフラ維持を担当した主席エンジニア。宇宙環境下での設備保守と新規建設において先駆的な技術を開発し、ステーションの拡張と機能向上に寄与した。E350年には第2居住モジュールの設計と建設を指揮し、Eros-7の収容能力を倍増させた。宇宙空間での作業効率を高める特殊ツールの発明も多数行い、その技術的遺産は現在の宇宙建設の標準手法として受け継がれている。",
    descriptionEn:
      "Chief Engineer who maintained Eros-7's infrastructure from E308 to E435. Pioneered groundbreaking techniques for equipment maintenance and new construction in space environments, contributing to the station's expansion and enhanced functionality. In E350, commanded the design and construction of the second habitat module, doubling Eros-7's capacity. Also invented numerous specialized tools to improve work efficiency in space, whose technical legacy continues as standard methods in modern space construction.",
    era: "E308〜E435",
    affiliation: "Eros-7技術部門",
    tier: "Tier 3",
  },{
    id: "マイナー・ディープ" as WikiId,
    name: "マイナー・ディープ",
    nameEn: "Miner Deep",
    category: "キャラクター",
    subCategory: "Eros-7",
    description:
      "E320年からE480年までEros-7周辺の小惑星帯で資源採掘に従事した鉱夫。深層鉱脈の発見と採掘技術の革新において指導的役割を果たし、Eros-7の資源自給体制を確立した。E380年に発見したディープ鉱脈はEDU最大のレアメタル鉱床であり、クレセント地方の重工業発展に不可欠な資源を供給した。危険な採掘現場で常に先頭に立ち、「深淵の探求者」として労働者たちから深い敬意を集めた。",
    descriptionEn:
      "Miner who worked in the asteroid belt around Eros-7 from E320 to E480, extracting resources. Played a leading role in discovering deep mineral veins and innovating mining techniques, establishing Eros-7's self-sufficient resource system. The deep mineral vein discovered in E380 became EDU's largest rare metal deposit, supplying essential resources for the industrial development of the Crescent region. Always at the forefront of dangerous mining sites, he earned deep respect from workers as the 'Abyss Explorer.'",
    era: "E320〜E480",
    affiliation: "Eros-7採掘局",
    tier: "Tier 3",
  },{
    id: "マイナー・コア" as WikiId,
    name: "マイナー・コア",
    nameEn: "Miner Core",
    category: "キャラクター",
    subCategory: "Eros-7",
    description:
      "E325年からE475年までEros-7周辺の資源採掘において鉱石の精製と品質管理を担当した技術者。採掘された原鉱石から高純度の金属材料を抽出する精製プロセスの改良において画期的な成果を上げた。E370年に開発した「コア式精製法」は効率と品質の両面で従来法を大幅に上回り、Eros-7の産業的価値を飛躍的に高めた。アイアン・シンジケートへの材料供給の技術的基盤を築いた重要人物。",
    descriptionEn:
      "Technician responsible for ore refining and quality control in Eros-7's resource extraction operations from E325 to E475. Achieved groundbreaking results in refining processes that extracted high-purity metal ores from raw minerals. The 'Core Refining Method' developed in E370 far surpassed conventional methods in both efficiency and quality, dramatically increasing Eros-7's industrial value. A key figure who established the technical foundation for material supply to the Iron Syndicate.",
    era: "E325〜E475",
    affiliation: "Eros-7精製所",
    tier: "Tier 3",
  },{
    id: "マイナー・クラスト" as WikiId,
    name: "マイナー・クラスト",
    nameEn: "Miner Crust",
    category: "キャラクター",
    subCategory: "Eros-7",
    description:
      "E330年からE470年までEros-7周辺の地表・地殻探査に従事した地質学者。小惑星の地質構造の解明と鉱脈の予測において卓越した能力を発揮し、新たな採掘地点の発見に大きく貢献した。E365年に作成した「クラスト地質図」はEros-7周辺の資源分布を正確に示し、採掘計画の効率化に決定的な役割を果たした。地質学的知見と探査技術の融合により、Eros-7を星域最大の資源地帯の一つに押し上げた。",
    descriptionEn:
      "Geologist who conducted surface and crustal surveys around Eros-7 from E330 to E470. Demonstrated exceptional abilities in analyzing asteroid geological structures and predicting mineral veins, significantly contributing to the discovery of new mining sites. The 'Crust Geological Map' created in E365 accurately depicted resource distribution around Eros-7, playing a decisive role in optimizing mining plans. Through the fusion of geological knowledge and exploration techniques, elevated Eros-7 to one of the sector's largest resource zones.",
    era: "E330〜E470",
    affiliation: "Eros-7地質調査団",
    tier: "Tier 3",
  },{
    id: "パイオニア・フロンティア" as WikiId,
    name: "パイオニア・フロンティア",
    nameEn: "Pioneer Frontier",
    category: "キャラクター",
    subCategory: "Eros-7",
    description:
      "E400年からE510年までEros-7を拠点に未知の星域の探査を主導した宇宙探検家。Eros-7からさらに遠方の領域への探査ルートを開拓し、新たな資源地と居住可能領域の発見に尽力した。E450年の「フロンティア遠征」では7つの新惑星を発見し、EDUの活動領域を大幅に拡大した。その探査精神と冒険心は「最後のパイオニア」として称えられ、新世界編（E520〜）の開拓者たちに精神的な影響を与えた。",
    descriptionEn:
      "Space explorer who led expeditions into uncharted star systems with Eros-7 as a base from E400 to E510. Pioneered exploration routes to regions beyond Eros-7, dedicating efforts to discovering new resource deposits and habitable areas. During the 'Frontier Expedition' in E450, discovered seven new planets, significantly expanding EDU's sphere of operations. His spirit of exploration and adventure is celebrated as that of the 'Last Pioneer,' exerting spiritual influence on the pioneers of the New World Era (E520-).",
    era: "E400〜E510",
    affiliation: "Eros-7探査隊",
    tier: "Tier 3",
  },{
    id: "パイオニア・ホライズン" as WikiId,
    name: "パイオニア・ホライズン",
    nameEn: "Pioneer Horizon",
    category: "キャラクター",
    subCategory: "Eros-7",
    description:
      "E410年からE515年までEros-7の遠方通信網の構築に従事した通信技術者。パイオニア・フロンティアの探査活動を通信面から支援し、未知領域との通信を可能にする中継システムを構築した。E460年に設置した「ホライズン・リレー」は、それまで不可能とされていた超長距離通信を実現し、EDUの情報ネットワークを飛躍的に拡大した。Eros-7からクレセント大地方への高速通信路の確立にも貢献し、地域間の情報格差の解消に尽力した。",
    descriptionEn:
      "Communications technician who constructed Eros-7's long-distance communication network from E410 to E515. Supported Pioneer Frontier exploration activities through communications infrastructure, building relay systems that enabled communication with unknown regions. The 'Horizon Relay' installed in E460 achieved ultra-long-distance communication previously deemed impossible, dramatically expanding EDU's information network. Also contributed to establishing high-speed communication routes from Eros-7 to the Greater Crescent Region, working to eliminate information disparities between regions.",
    era: "E410〜E515",
    affiliation: "Eros-7通信部門",
    tier: "Tier 3",
  },{
    id: "パイオニア・ネビュラ" as WikiId,
    name: "パイオニア・ネビュラ",
    nameEn: "Pioneer Nebula",
    category: "キャラクター",
    subCategory: "Eros-7",
    description:
      "E415年からE518年までEros-7で異星環境の生態系調査に従事した宇宙生物学者。パイオニア・フロンティアが発見した新惑星の生態系を体系的に調査し、多様な異星生物の記録と分類を行った。E470年に発見した共生型微生物群は、地球外生命の存在を示す決定的な証拠として学界に衝撃を与えた。その研究は異星環境での農業と医療への応用も視野に入れ、新世界における人類の生存基盤を科学的に裏付けた。",
    descriptionEn:
      "Astrobiologist who studied extraterrestrial ecosystems on Eros-7 from E415 to E518. Systematically investigated the ecosystems of new planets discovered by the Pioneer Frontier, documenting and classifying diverse alien organisms. The symbiotic microbial community discovered in E470 sent shockwaves through the academic community as definitive evidence of extraterrestrial life. Her research also considered applications for agriculture and medicine in extraterrestrial environments, providing scientific validation for humanity's survival foundation in the New World.",
    era: "E415〜E518",
    affiliation: "Eros-7生物研究所",
    tier: "Tier 3",
  },{
    id: "パイオニア・オーロラ" as WikiId,
    name: "パイオニア・オーロラ",
    nameEn: "Pioneer Aurora",
    category: "キャラクター",
    subCategory: "Eros-7",
    description:
      "E420年からE520年までEros-7で新天地への移住計画を主導した開拓者。パイオニア・フロンティアが発見した居住可能惑星への入植プロジェクトを策定し、移住の logistics とインフラ建設の計画を立案した。E490年に発表した「オーロラ計画」は、数千人の入植者を新惑星へ送る野心的な構想であり、新世界編（E520〜）における本格的な開拓の青写真となった。E520年には自ら第一陣の入植者としてEros-7を出発し、新たな時代の幕開けを告げた。",
    descriptionEn:
      "Pioneer who led resettlement plans to new worlds from E415 to E520 on Eros-7. Formulated settlement projects for habitable planets discovered by the Pioneer Frontier, planning logistics and infrastructure construction for migration. The 'Aurora Plan' announced in E490 was an ambitious vision to send thousands of settlers to new planets, becoming the blueprint for full-scale colonization in the New World Era (E520-). In E520, departed Eros-7 as part of the first wave of settlers, heralding the dawn of a new era.",
    era: "E420〜E520",
    affiliation: "Eros-7開拓局",
    tier: "Tier 3",
  },{
    id: "副官・クリムゾン" as WikiId,
    name: "副官・クリムゾン",
    nameEn: "Vice Commander Crimson",
    category: "キャラクター",
    subCategory: "Shadow Rebellion",
    description:
      "E450年から現在までシャドウ・リベリオンの副官として活動し、アルファ・ケインに次ぐNo.2の地位を占める実行部隊の指揮官。E450年代の反乱再興期において組織の実働部隊を再編成し、ZAMLT崩壊後のギガポリス情勢において影響力を維持した。赤い戦闘服がトレードマークの「深紅の副官」として知られ、前線指揮と組織運営の両面でアルファ・ケインを補佐した。E500年以降は表舞台から退き、リベリオンの基盤維持に注力しているとされる。",
    descriptionEn:
      "Operations commander who has served as the Shadow Rebellion's second-in-command since E450, holding the position second only to Alpha Kane. Reorganized the organization's operational forces during the rebellion's resurgence in the E450s, maintaining influence in the Gigapolis situation following ZAMLT's collapse. Known as the 'Crimson Adjutant' for his trademark red combat uniform, he assisted Alpha Kane in both frontline command and organizational operations. Since E500, has reportedly retreated from public view, focusing on maintaining the rebellion's foundation.",
    era: "E450〜現在",
    affiliation: "シャドウ・リベリオン",
    tier: "Tier 3",
  },{
    id: "副官・サファイア" as WikiId,
    name: "副官・サファイア",
    nameEn: "Vice Commander Sapphire",
    category: "キャラクター",
    subCategory: "Shadow Rebellion",
    description:
      "E460年から現在までシャドウ・リベリオンの情報部門を統括する副官。情報収集・分析・工作活動において卓越した能力を発揮し、組織の「目と耳」として機能している。E480年代にはクレセント地方への情報網の拡張を主導し、シルバー・ヴェノムやアルファ・ヴェノムの動向把握に貢献した。冷静沈着な分析力で知られ、感情に流されない客観的判断で組織の意思決定を支える。クリムゾンの前線指揮と対照的な、裏方の要として不可欠な存在。",
    descriptionEn:
      "Intelligence officer who has commanded the Shadow Rebellion's intelligence division since E460. Demonstrates exceptional abilities in intelligence gathering, analysis, and covert operations, serving as the organization's 'eyes and ears.' Led the expansion of the intelligence network into the Crescent Region during the E480s, contributing to monitoring the activities of Silver Venom and Alpha Venom. Known for calm analytical abilities and objective judgments free from emotion, supporting the organization's decision-making. An indispensable figure behind the scenes, contrasting with Crimson's frontline command.",
    era: "E460〜現在",
    affiliation: "シャドウ・リベリオン",
    tier: "Tier 3",
  },{
    id: "副官・エメラルド" as WikiId,
    name: "副官・エメラルド",
    nameEn: "Vice Commander Emerald",
    category: "キャラクター",
    subCategory: "Shadow Rebellion",
    description:
      "E465年から現在までシャドウ・リベリオンの後方支援部門を統括する副官。兵站管理・武器調達・安全な隠れ家の確保など、組織の維持に不可欠な実務を一手に引き受けている。E475年のエヴァトロン崩壊後には、旧ZAMLT施設の再利用とリベリオン拠点の整備を主導した。実務能力に優れ、複雑な logistics を最適化する手腕は組織内部で「エメラルドの魔法」と称されている。表舞台に立つことは少ないが、リベリオンの存続に最も不可欠な人物。",
    descriptionEn:
      "Logistics officer who has commanded the Shadow Rebellion's support division since E465. Single-handedly manages all essential operations for the organization's maintenance, including supply chain management, weapons acquisition, and securing safe hideouts. Led the repurposing of former ZAMLT facilities and the development of rebel bases following Evatron's collapse in E475. Praised for exceptional practical skills and optimizing complex logistics, known within the organization as the 'Emerald Magic.' Though rarely in the spotlight, is the most essential figure for the rebellion's survival.",
    era: "E465〜現在",
    affiliation: "シャドウ・リベリオン",
    tier: "Tier 3",
  },{
    id: "セル・リーダー・ノース" as WikiId,
    name: "セル・リーダー・ノース",
    nameEn: "Cell Leader North",
    category: "キャラクター",
    subCategory: "Shadow Rebellion",
    description:
      "E470年から現在までシャドウ・リベリオンの北部方面のセル・リーダーとして活動している現場指揮官。ギガポリス北部地区を拠点に小規模な独立細胞を指揮し、ZAMLT残党やエヴァトロン勢力への抵抗を継続している。E400年代のテリアン反乱軍の精神を受け継ぎ、市民の自由回復を旗印に活動している。北部の複雑な地形を活用したゲリラ戦術を得意とし、正規軍を翻弄し続けている。",
    descriptionEn:
      "Field commander who has served as the Shadow Rebellion's Northern Sector cell leader since E470. Commands small independent cells based in the northern regions of Gigapolis, continuing resistance against ZAMLT remnants and Evatron forces. Carries on the spirit of the Terian Rebellion forces from the E400s, operating under the banner of restoring citizen freedom. Excels in guerrilla tactics that utilize the complex terrain of the northern regions, consistently confounding regular army forces.",
    era: "E470〜現在",
    affiliation: "シャドウ・リベリオン北部セル",
    tier: "Tier 3",
  },{
    id: "セル・リーダー・サウス" as WikiId,
    name: "セル・リーダー・サウス",
    nameEn: "Cell Leader South",
    category: "キャラクター",
    subCategory: "Shadow Rebellion",
    description:
      "E472年から現在までシャドウ・リベリオンの南部方面のセル・リーダーとして活動している現場指揮官。ギガポリス南部の地下街を拠点に、Tina/Gueの地下世界とも複雑な関係を築きながら活動している。南部の商業エリアを利用した資金調達と情報収集において独特のネットワークを構築した。ノースとは異なる都市型ゲリラ戦術を駆使し、都市の地下構造を熟知した戦闘で敵を翻弄する。",
    descriptionEn:
      "A field commander serving as the Southern Sector Cell Leader of the Shadow Rebellion from E472 to the present. Operating from the underground streets of southern Gigapolis, they have cultivated complex relationships with Tina/Gue's underworld while building a unique network for fundraising and intelligence gathering through commercial areas in the south. Employing urban guerrilla tactics distinct from those of North, they confound enemies through combat leveraging their intimate knowledge of the city's underground structures.",
    era: "E472〜現在",
    affiliation: "シャドウ・リベリオン南部セル",
    tier: "Tier 3",
  },{
    id: "セル・リーダー・イースト" as WikiId,
    name: "セル・リーダー・イースト",
    nameEn: "Cell Leader East",
    category: "キャラクター",
    subCategory: "Shadow Rebellion",
    description:
      "E475年から現在までシャドウ・リベリオンの東部方面のセル・リーダーとして活動している現場指揮官。クレセント地方への連絡ルートの維持と情報の中継において重要な役割を果たしている。ボグダス・ジャベリン（テクロサス東方支隊の後継）との非公式な連携も構築し、東西の抵抗運動の架け橋として機能している。東部の国境地域における密輸ルートの管理も担当し、リベリオンの物流を支える実務家。",
    descriptionEn:
      "A field commander serving as the Eastern Sector Cell Leader of the Shadow Rebellion from E475 to the present. Plays a crucial role in maintaining contact routes to the Crescent Region and relaying information. Has also built informal cooperation with Bogdas Javelin (successor to the Technosus Eastern Detachment), functioning as a bridge between eastern and western resistance movements. Also manages smuggling routes in border regions of the east, serving as the logistical backbone of the Rebellion.",
    era: "E475〜現在",
    affiliation: "シャドウ・リベリオン東部セル",
    tier: "Tier 3",
  },{
    id: "セル・リーダー・ウエスト" as WikiId,
    name: "セル・リーダー・ウエスト",
    nameEn: "Cell Leader West",
    category: "キャラクター",
    subCategory: "Shadow Rebellion",
    description:
      "E478年から現在までシャドウ・リベリオンの西部方面のセル・リーダーとして活動している現場指揮官。Valoria連合圏（ジェンの支配地域）との境界付近で活動し、リベリオンの西方戦線を維持している。ジェンの勢力との直接的衝突を避けつつ、独自の展開でリベリオンの影響力の拡大を図る pragmatic な指揮官。西部の山岳地帯を利用した訓練キャンプの運営も担当し、次世代のリベリオン戦士の育成に尽力している。",
    descriptionEn:
      "A field commander serving as the Western Sector Cell Leader of the Shadow Rebellion from E478 to the present. Operates near the border with the Valorian Alliance Zone (Jen's territory), maintaining the Rebellion's western front. A pragmatic commander who avoids direct confrontation with Jen's forces while working to expand the Rebellion's influence through independent initiatives. Also oversees training camps in western mountainous regions, dedicating themselves to cultivating the next generation of Rebellion warriors.",
    era: "E478〜現在",
    affiliation: "シャドウ・リベリオン西部セル",
    tier: "Tier 3",
  },{
    id: "デザーター・レイ" as WikiId,
    name: "デザーター・レイ",
    nameEn: "Deserter Ray",
    category: "キャラクター",
    subCategory: "Shadow Rebellion",
    description:
      "E490年に正規軍を脱走してシャドウ・リベリオンに参加した元軍人。元テクロサス第2支隊の下級士官であり、軍の内部情報と戦術をリベリオンにもたらした。脱走の動機は軍の民主化要求に賛同したためとされ、レジスタンス・ワンらの反体制運動の影響を受けている。テクロサスの軍事教範を熟知する戦術家であり、リベリオンの戦闘力強化に貢献した。「裏切者」という烙印を背負いながらも、信念に従って自由のために戦うことを選んだ複雑な人物。",
    descriptionEn:
      "A former military officer who deserted the regular army in E490 to join the Shadow Rebellion. A former junior officer of the Technosus 2nd Detachment who brought military intelligence and tactics to the Rebellion. Their desertion is said to stem from their support for the military's democratization demands, influenced by anti-establishment movements like Resistance One. A tactician well-versed in Technosus military doctrine who has contributed to strengthening the Rebellion's combat capability. A complex character who bears the stigma of 'traitor' but chooses to fight for freedom according to their convictions.",
    era: "E490〜現在",
    affiliation: "シャドウ・リベリオン",
    tier: "Tier 3",
  },{
    id: "デザーター・ミスト" as WikiId,
    name: "デザーター・ミスト",
    nameEn: "Deserter Mist",
    category: "キャラクター",
    subCategory: "Shadow Rebellion",
    description:
      "E495年にエヴァトロン残党の部隊から脱走してシャドウ・リベリオンに参加した元兵士。エヴァトロン支配期（E400〜E475）の末期に徴兵され、残酷な軍事訓練を受けたが、組織の崩壊とともに離反した。エヴァトロンの戦術と装備の知識をリベリオンに提供し、かつての同志たちの戦闘パターンの分析に貢献した。「霧のように姿を消した」という異名の通り、脱走の経緯には謎が多く、一部では二重スパイの可能性も囁かれている。",
    descriptionEn:
      "A former soldier who deserted from the remnants of the Evatron forces in E495 to join the Shadow Rebellion. Conscripted during the final days of Evatron rule (E400-E475), they received brutal military training but defected along with the organization's collapse. Provided the Rebellion with knowledge of Evatron tactics and equipment, contributing to analyzing combat patterns of former comrades. As their nickname 'disappearing like mist' suggests, their circumstances of desertion remain mysterious, with some whispering about the possibility of being a double agent.",
    era: "E495〜現在",
    affiliation: "シャドウ・リベリオン",
    tier: "Tier 3",
  },{
    id: "ルナ・ノヴァ三世" as WikiId,
    name: "ルナ・ノヴァ三世",
    nameEn: "Luna Nova III",
    category: "キャラクター",
    subCategory: "新世界編",
    description:
      "E520年の新世界開拓期に台頭した新世代の指導者。バーズ帝国期のルナ・サバイバーの血統を引くとされ、その不屈の精神を受け継いでいる。E520年のオーロラ計画に第三世代のリーダーとして参加し、新惑星での入植地建設の陣頭指揮を執った。AURALIS Collective第二世代（E522発足）とも協調関係を築き、新世界における文化と芸術の振興を掲げる。E525年には新世界評議会の初代議長に就任し、多世界協調体制の構築に挑む新時代の象徴的人物。",
    descriptionEn:
      "A new-generation leader who emerged during the New World colonization period of E520. Said to be descended from the bloodline of Luna Survivors from the Bartz Empire era, inheriting their indomitable spirit. Participated in the Aurora Project in E520 as the third-generation leader, commanding the construction of settlements on the new planet. Built cooperative relationships with the AURALIS Collective's second generation (established E522), advocating for the promotion of culture and art in the New World. Became the first chairman of the New World Council in E525, emerging as a symbolic figure of the new era challenging the construction of a multi-world coordination system.",
    era: "E520〜現在",
    affiliation: "新世界評議会",
    tier: "Tier 2",
  },{
    id: "カイ・エコー" as WikiId,
    name: "カイ・エコー",
    nameEn: "Kai Echo",
    category: "キャラクター",
    subCategory: "新世界編",
    description:
      "E520年の新世界開拓期に現れた新世代の技術者。バーズ帝国期のカイ・アシュフォードの通信技術の系譜を受け継ぎ、新世界と旧世界を結ぶ超長距離通信システムの開発を主導した。E523年に完成した「エコー・リンク」は、Eros-7から新惑星までのリアルタイム通信を実現し、EDU全体の情報ネットワークを統合する画期的な技術となった。技術と人類の進歩を結びつけるビジョンを持ち、新世界における科学技術の発展方向を決定づけるキーパーソン。",
    descriptionEn:
      "A new-generation engineer who appeared during the New World colonization period of E520. Inheriting the lineage of Kai Ashford's communication technology from the Bartz Empire era, they led the development of ultra-long-range communication systems connecting the New World and the Old World. The 'Echo Link' completed in E523 achieved real-time communication from Eros-7 to the new planet, becoming a groundbreaking technology that integrated the information networks across the entire EDU. Possessing a vision that connects technology with human progress, they are a key figure determining the direction of scientific and technological development in the New World.",
    era: "E520〜現在",
    affiliation: "新世界通信公社",
    tier: "Tier 2",
  },{
    id: "ミラ・レゾナンス" as WikiId,
    name: "ミラ・レゾナンス",
    nameEn: "Mira Resonance",
    category: "キャラクター",
    subCategory: "新世界編",
    description:
      "E522年のAURALIS Collective第二世代発足と同時に新世界支部の代表として活動を開始した芸術家。「光と音」の理念を新世界に広める使命を帯び、入植地でのパフォーマンスと芸術教育を通じて文化的基盤の構築に尽力した。レイラ・ヴィレル・ノヴァ（Pink Voltage）の精神的後継者として、芸術を通じた社会変革を掲げる。E525年には新世界初の大規模芸術祭「レゾナンス・フェスト」を開催し、多様な文化の交歓の場を創出した。",
    descriptionEn:
      "An artist who began activities as the representative of the New World branch upon the establishment of the AURALIS Collective's second generation in E522. Bearing the mission to spread the philosophy of 'light and sound' in the New World, they dedicated themselves to building a cultural foundation through performances and art education in settlements. As the spiritual successor of Leila Virel Nova (Pink Voltage), they advocate for social transformation through art. In E525, they hosted the New World's first large-scale arts festival, 'Resonance Fest,' creating a space for cultural exchange among diverse cultures.",
    era: "E522〜現在",
    affiliation: "AURALIS Collective第二世代 / 新世界支部",
    tier: "Tier 2",
  },{
    id: "ソル・ハーモニー" as WikiId,
    name: "ソル・ハーモニー",
    nameEn: "Sol Harmony",
    category: "キャラクター",
    subCategory: "新世界編",
    description:
      "E521年に新世界で発見された先住知的生命体との第一次接触を担当した外交官・言語学者。異種族間のコミュニケーションの構築において類まれな能力を発揮し、入植者と先住民の平和的な共存関係の確立に貢献した。E524年に策定した「ハーモニー協定」は、両種族の権利と義務を定めた画期的な条約であり、EDU史において初めて地球外知的生命体との公式協定となった。異文化理解と平和的共生の象徴として、新世界編の最重要人物の一人。",
    descriptionEn:
      "A diplomat and linguist who handled first contact with indigenous intelligent life forms discovered in the New World in E521. Demonstrated extraordinary abilities in building communication between different species, contributing to establishing peaceful coexistence between settlers and indigenous peoples. The 'Harmony Accord' formulated in E524 was a groundbreaking treaty defining the rights and obligations of both species, becoming the first official agreement with extraterrestrial intelligent life in EDU history. As a symbol of cross-cultural understanding and peaceful coexistence, they rank among the most important figures in the New World saga.",
    era: "E521〜現在",
    affiliation: "新世界評議会 / 異種族外交局",
    tier: "Tier 2",
  },{
    id: "ネイ・フューチャー" as WikiId,
    name: "ネイ・フューチャー",
    nameEn: "Ney Future",
    category: "キャラクター",
    subCategory: "新世界編",
    description:
      "E520年の新世界開拓期にEros-7から派遣された次世代の行政官。新世界での行政システムの構築と法制度の整備を担当し、オールドワールドの経験を新環境に適応させた。E524年に制定した「新世界基本法」は、旧世界の法体系と新環境の現実を融合させた革新的な法典である。ヴァレリア・トルクアタとエルダー・タイガーの法的遺産を継承しつつ、先住民の権利も保護する包括的な法制度を確立した法の新世代。",
    descriptionEn:
      "A next-generation administrator dispatched from Eros-7 to the New World during the colonization period of E520. Responsible for constructing the administrative system and legal framework of the New World, adapting Old World experience to the new environment. The 'New World Fundamental Law' enacted in E524 was an innovative legal code that merged the legal systems of the Old World with the realities of the new environment. While inheriting the legal legacy of Valeria Torquata and Elder Tiger, they established a comprehensive legal system that also protected the rights of indigenous peoples—a new generation of law.",
    era: "E520〜現在",
    affiliation: "新世界評議会 / 法務局",
    tier: "Tier 2",
  },{
    id: "ビューロクラット・アルファ" as WikiId,
    name: "ビューロクラット・アルファ",
    nameEn: "Bureaucrat Alpha",
    category: "キャラクター",
    subCategory: "新世界編",
    description:
      "E522年に新世界評議会の行政局次官として就任した行政官。新世界の官僚制度の設計と運営を担当し、入植地の効率的な行政サービスの提供に尽力した。オールドワールドの行政経験を基に、新環境に適した行政手続きの簡素化と効率化を推進した。E525年の行政改革では4人のビューロクラットの協調体制を構築し、新世界行政の四本柱として機能している。特に財政管理と予算配分において卓越した手腕を発揮している。",
    descriptionEn:
      "An administrator who took office as Deputy Director of the Administrative Bureau of the New World Council in E522. Responsible for designing and operating the New World's bureaucratic system, striving to provide efficient administrative services to settlements. Based on administrative experience from the Old World, they promoted simplification and efficiency of administrative procedures suitable for the new environment. In the E525 administrative reform, they built a coordinated system of four bureaucrats, functioning as the four pillars of New World administration. Particularly excelling in financial management and budget allocation.",
    era: "E522〜現在",
    affiliation: "新世界評議会行政局",
    tier: "Tier 3",
  },{
    id: "ビューロクラット・ベータ" as WikiId,
    name: "ビューロクラット・ベータ",
    nameEn: "Bureaucrat Beta",
    category: "キャラクター",
    subCategory: "新世界編",
    description:
      "E523年に新世界評議会の治安局次官として就任した行政官。新世界における治安維持と法執行体制の構築を担当した。オールドワールドの治安機関の経験と新世界の独自の課題を分析し、コミュニティ重視の治安モデルを策定した。先住民との摩擦の防止にも注力し、文化的配慮を取り入れた法執行ガイドラインを作成した。シェリフ・ブラスの保安官制度とエリオス・ウォルドの市民権思想の両方を継承する新しい治安の形。",
    descriptionEn:
      "An administrator who took office as Deputy Director of the Public Safety Bureau of the New World Council in E523. Responsible for maintaining public order and constructing law enforcement systems in the New World. Analyzed experiences from Old World law enforcement agencies and the unique challenges of the New World, formulating a community-focused policing model. Focused on preventing friction with indigenous peoples and created culturally sensitive law enforcement guidelines. A new form of public safety that inherits both Sheriff Brass's sheriff system and Erios Wald's citizenship ideas.",
    era: "E523〜現在",
    affiliation: "新世界評議会治安局",
    tier: "Tier 3",
  },{
    id: "ビューロクラット・ガンマ" as WikiId,
    name: "ビューロクラット・ガンマ",
    nameEn: "Bureaucrat Gamma",
    category: "キャラクター",
    subCategory: "新世界編",
    description:
      "E522年に新世界評議会の産業局次官として就任した行政官。新世界における産業基盤の構築と経済発展の計画を担当した。オールドワールドの産業経験を活かしつつ、新環境の資源特性に適した産業政策を立案した。E524年に策定した「新世界産業基本計画」は、農業・鉱業・製造業のバランスの取れた発展を目指す包括的な青写真である。エコノミスト・ゴールドとチーフ・ドラゴンの経済・産業思想を新世界で実現する実務家。",
    descriptionEn:
      "An administrator who assumed the position of Vice-Director of the Bureau of Industry for the New World Council in E522. They were responsible for establishing the industrial foundation of the New World and planning its economic development. Leveraging industrial experience from the Old World, they formulated industrial policies suited to the resource characteristics of the new environment. The 'New World Industrial Basic Plan' formulated in E524 serves as a comprehensive blueprint aiming for balanced development in agriculture, mining, and manufacturing. A practitioner who realized the economic and industrial philosophies of Economist Gold and Chief Dragon in the New World.",
    era: "E522〜現在",
    affiliation: "新世界評議会産業局",
    tier: "Tier 3",
  },{
    id: "ビューロクラット・デルタ" as WikiId,
    name: "ビューロクラット・デルタ",
    nameEn: "Bureaucrat Delta",
    category: "キャラクター",
    subCategory: "新世界編",
    description:
      "E523年に新世界評議会の外務局次官として就任した行政官。新世界とオールドワールド（ギガポリス・クレセント・Eros-7）との外交関係の構築を担当した。複数の政治勢力との並行交渉において卓越した外交手腕を発揮し、新世界の国際的地位の確立に貢献した。E525年のV7・トリニティ・アライアンス双方との外交協定締結にも関与し、新世界の中立性と独立性の保障に尽力した。イサベラ・コルネリウスの外交路線の新世代における継承者。",
    descriptionEn:
      "An administrator who assumed the position of Vice-Director of the Bureau of Foreign Affairs for the New World Council in E523. They were tasked with establishing diplomatic relations between the New World and the Old World (Gigapolis Crescent Eros-7). Demonstrating exceptional diplomatic skills in parallel negotiations with multiple political forces, they contributed to establishing the New World's international standing. They also participated in the conclusion of diplomatic agreements with both the V7 and Trinity Alliance in E525, striving to guarantee the neutrality and independence of the New World. A successor to Isabella Cornelius' diplomatic approach in the new generation.",
    era: "E523〜現在",
    affiliation: "新世界評議会外務局",
    tier: "Tier 3",
  },{
    id: "テクニシャン・クオンタム" as WikiId,
    name: "テクニシャン・クオンタム",
    nameEn: "Technician Quantum",
    category: "キャラクター",
    subCategory: "新世界編",
    description:
      "E520年に新世界で最先端技術の実装を担当した技術者。ファールージャ社の次元極地平技術を新世界のインフラに応用し、次世代の通信・輸送・エネルギーシステムを構築した。E524年に新世界で初めて次元ゲートのプロトタイプを稼働させ、惑星間輸送の革命をもたらした。ドクター・ファールージャ社次元物理学者の理論的成果を実用化する橋渡し役であり、新世界の技術的優位性の確立に決定的な役割を果たした。",
    descriptionEn:
      "An engineer responsible for implementing cutting-edge technology in the New World in E520. They applied Farooja Corporation's dimensional horizon technology to New World infrastructure, constructing next-generation communication, transportation, and energy systems. In E524, they successfully operated the first prototype of a dimensional gate in the New World, revolutionizing interplanetary transport. Serving as a bridge to practicalize the theoretical achievements of Dr. Farooja Corporation's dimensional physicists, they played a decisive role in establishing the New World's technological superiority.",
    era: "E520〜現在",
    affiliation: "新世界技術開発局",
    tier: "Tier 3",
  },{
    id: "テクニシャン・テンポラル" as WikiId,
    name: "テクニシャン・テンポラル",
    nameEn: "Technician Temporal",
    category: "キャラクター",
    subCategory: "新世界編",
    description:
      "E521年に新世界で時間制御技術の研究に着手した特殊技術者。ティムール・シャーの10次元ホラズム理論の時間軸コンポーネントに着目し、局所的な時間操作の可能性を探求している。E525年に実施した「テンポラル実験」は、極小範囲での時間遅延を成功させ、理論の実証に一歩前進した。この技術が実用化されれば、通信の遅延問題の根本的解決や歴史の検証など、EDU社会に計り知れない影響を与える可能性がある。",
    descriptionEn:
      "A special technician who began research on time control technology in the New World in E521. Focusing on the temporal axis component of Timur Shah's 10-dimensional Horazm theory, they are exploring the possibilities of localized time manipulation. The 'Temporal Experiment' conducted in E525 successfully achieved time delay in a minimal range, taking a step forward in theoretical verification. If this technology is commercialized, it could potentially have immeasurable impacts on EDU society, including fundamental solutions to communication delay issues and historical verification.",
    era: "E521〜現在",
    affiliation: "新世界技術開発局 / 時間研究所",
    tier: "Tier 3",
  },{
    id: "テクニシャン・ディメンション" as WikiId,
    name: "テクニシャン・ディメンション",
    nameEn: "Technician Dimension",
    category: "キャラクター",
    subCategory: "新世界編",
    description:
      "E522年に新世界で次元安定化技術の実装を担当した技術者。次元極地平の不安定性による副次的影響（E340年のスライム・ウーマン顕現など）の再発防止に取り組んでいる。E524年に開発した「ディメンション・スタビライザー」は、次元境界の微小な揺らぎを検知して自動補正するシステムであり、新世界の安全性確保に不可欠な技術となった。ファールージャ社次元物理学者の理論的警告に基づき、技術の安全な利用を追求する慎重な研究者。",
    descriptionEn:
      "An engineer responsible for implementing dimensional stabilization technology in the New World in E522. They are working to prevent recurrence of secondary effects caused by the instability of the dimensional horizon, such as the manifestation of Slime Woman in E340. The 'Dimension Stabilizer' developed in E524 is a system that detects and automatically corrects minute fluctuations in dimensional boundaries, becoming an indispensable technology for ensuring New World security. A cautious researcher who pursues the safe use of technology based on theoretical warnings from Farooja Corporation's dimensional physicists.",
    era: "E522〜現在",
    affiliation: "新世界技術開発局 / 次元研究所",
    tier: "Tier 3",
  },{
    id: "アンバサダー・グランベル" as WikiId,
    name: "アンバサダー・グランベル",
    nameEn: "Ambassador Granbel",
    category: "キャラクター",
    subCategory: "新世界編",
    description:
      "E520年に新世界からオールドワールド（ギガポリス・Valoria連合圏）への初代大使として任命された外交官。ジェン主導のValoria連合圏との友好関係の構築に尽力し、E523年に「グランベル・ヴァレリア協定」を締結した。西大陸の長い歴史的背景を理解するベテラン外交官であり、新旧世界の架け橋として機能している。セリア・ドミニクスの外交遺産を継承し、新世界に西大陸の文化的影響を波及させる平和的使者。",
    descriptionEn:
      "A diplomat appointed as the first ambassador from the New World to the Old World (Gigapolis Valoria Federation Zone) in E520. They worked diligently to build friendly relations with the Valoria Federation Zone under Jen's leadership and concluded the 'Granbel Valeria Agreement' in E523. A veteran diplomat who understands the long historical background of the Western Continent, serving as a bridge between the old and new worlds. They inherit Celia Dominic's diplomatic legacy and function as a peaceful messenger spreading the cultural influence of the Western Continent to the New World.",
    era: "E520〜現在",
    affiliation: "新世界評議会 / 駐Valoria大使",
    tier: "Tier 3",
  },{
    id: "アンバサダー・ディオクレニス" as WikiId,
    name: "アンバサダー・ディオクレニス",
    nameEn: "Ambassador Dioclenis",
    category: "キャラクター",
    subCategory: "新世界編",
    description:
      "E521年に新世界からクレセント大地方への初代大使として任命された外交官。トリニティ・アライアンスとV7の二大陣営の間で微妙な外交バランスを維持しながら、新世界の中立性を確保している。アイリスやマリーナ・ボビンといったクレセントの強力な指導者たちとの交渉において、柔軟かつ堅実な対応で信頼を獲得した。E525年のV7・トリニティ対立の激化に際し、新世界の中立地帯としての地位を守るため精力的な外交活動を展開している。",
    descriptionEn:
      "A diplomat appointed as the first ambassador from the New World to the Crescent Region in E521. While maintaining a delicate diplomatic balance between the two major blocs of the Trinity Alliance and V7, they ensure the neutrality of the New World. Through negotiations with powerful Crescent leaders such as Iris and Marina Bobin, they have gained trust with flexible and steady responses. Amid the intensifying V7-Trinity confrontation in E525, they are actively engaged in diplomatic activities to protect the New World's status as a neutral zone.",
    era: "E521〜現在",
    affiliation: "新世界評議会 / 駐クレセント大使",
    tier: "Tier 3",
  },{
    id: "アンバサダー・エレシオン" as WikiId,
    name: "アンバサダー・エレシオン",
    nameEn: "Ambassador Erecion",
    category: "キャラクター",
    subCategory: "新世界編",
    description:
      "E522年に新世界からEros-7への初代大使として任命された外交官。Eros-7のパイオニアたちとの関係強化と資源供給協定の締結において中心的な役割を果たした。Eros-7から新世界への資源輸送と技術移転の円滑化を図り、両地域の相互依存関係を深めた。パイオニア・オーロラの開拓精神を受け継ぐ積極的な外交姿勢で知られ、Eros-7を新世界発展の重要なパートナーとして位置づけた。",
    descriptionEn:
      "A diplomat appointed as the first ambassador from the New World to Eros-7 in E522. They played a central role in strengthening relations with Eros-7's pioneers and concluding resource supply agreements. They facilitated the smooth transport of resources and technology transfer from Eros-7 to the New World, deepening the interdependence between the two regions. Known for their proactive diplomatic approach that inherits the pioneering spirit of Pioneer Aurora, they positioned Eros-7 as an important partner in the New World's development.",
    era: "E522〜現在",
    affiliation: "新世界評議会 / 駐Eros-7大使",
    tier: "Tier 3",
  },{
    id: "アンバサダー・ファルージャ" as WikiId,
    name: "アンバサダー・ファルージャ",
    nameEn: "Ambassador Faruja",
    category: "キャラクター",
    subCategory: "新世界編",
    description:
      "E523年に新世界からファールージャ社への初代大使として任命された外交官。企業外交という特殊な分野において、ミカエル・ガブリエリとの直接交渉を通じて次元技術の民間移転協定を結んだ。E524年の「ファルージャ・テクノロジー協定」により、新世界における次元極地平技術の民生利用が可能となった。企業の利益と新世界の公共的利益のバランスを取る高度な外交手腕を発揮し、新世界の技術的飛躍に貢献した。",
    descriptionEn:
      "A diplomat appointed as the first ambassador from the New World to Farooja Corporation in E523. In this specialized field of corporate diplomacy, they concluded a civil technology transfer agreement through direct negotiations with Michael Gabrieli. The 'Farooja Technology Agreement' of E524 enabled the civilian use of dimensional horizon technology in the New World. They demonstrated advanced diplomatic skills by balancing corporate interests with the public interests of the New World, contributing to its technological leap.",
    era: "E523〜現在",
    affiliation: "新世界評議会 / 駐ファールージャ社大使",
    tier: "Tier 3",
  },{
    id: "アンバサダー・ティレリア" as WikiId,
    name: "アンバサダー・ティレリア",
    nameEn: "Ambassador Tirelia",
    category: "キャラクター",
    subCategory: "新世界編",
    description:
      "E524年に新世界から先住知的生命体への初代大使として任命された特命全権大使。ソル・ハーモニーが構築した異種族間コミュニケーションの基盤の上に、より深い相互理解と協力関係の構築に取り組んでいる。E525年に先住民評議会との間で「ティレリア文化交流協定」を締結し、双方の文化・科学・芸術の交流を促進する枠組みを確立した。異種族間外交の先駆者として、EDU史上最もユニークな外交ポストを担う新世代の調停者。",
    descriptionEn:
      "A special ambassador plenipotentiary appointed as the first ambassador from the New World to the indigenous intelligent lifeforms in E524. Building on the foundation for interspecies communication established by Sol Harmony, they are working to build deeper mutual understanding and cooperative relationships. In E525, they concluded the 'Tireria Cultural Exchange Agreement' with the Indigenous Peoples Council, establishing a framework to promote cultural, scientific, and artistic exchange between both parties. As a pioneer in interspecies diplomacy, they hold the most unique diplomatic post in EDU history, serving as a mediator of the new generation.",
    era: "E524〜現在",
    affiliation: "新世界評議会 / 先住民外交特命大使",
    tier: "Tier 3",
  },] as const satisfies readonly WikiEntry[]
