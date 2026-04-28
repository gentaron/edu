type Category = "キャラクター" | "用語" | "組織" | "地理" | "技術" | "歴史"

interface SourceLink {
  url: string
  label: string
}

interface WikiEntry {
  id: string
  name: string
  nameEn?: string
  category: Category
  subCategory?: string
  description: string
  era?: string
  affiliation?: string
  tier?: string
  image?: string
  sourceLinks?: SourceLink[]
}

/* ═══════════════════════════════════════════════════════════════
   WIKI DATA — CHARACTERS
   ═══════════════════════════════════════════════════════════════ */

const CHARACTERS: WikiEntry[] = [
  /* Gigapolis/West Continent */
  {
    id: "Diana",
    name: "ディアナ",
    nameEn: "Diana",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "初代Wonder Woman。E260〜E280年に台頭し、AURALIS Protoの文化的恩恵をシンフォニー・オブ・スターズ全土にもたらした伝説的人物。その圧倒的な存在感と人々を鼓舞する力は、のちのAURALIS Collective創設者たちに深い影響を与え、EDU史上最も愛される英雄の一人として語り継がれている。",
    era: "E260〜E280",
    affiliation: "Gigapolis西大陸",
    tier: "神格・歴史的人物",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Diana.png",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/DianaWorld.txt",
        label: "Diana's Story",
      },
    ],
  },
  {
    id: "Jen",
    name: "ジェン",
    nameEn: "Jen",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "Lv938+。E319年にValoria宮殿を掌握し、ZAMLT崩壊後の権力真空を埋める形で台頭。現在もValoria連合圏を主導する現役最強格の一人。Alpha Kaneのギガポリス解放戦に触発されたとも言われ、新ZAMLT期の混乱を鎮め西大陸の安定を確立した。EDU現代において最古参のTier 1アクティブ勢力として、セリア黄金期の記憶を持つ数少ない存在。",
    era: "E319〜現在",
    affiliation: "Valoria連合圏",
    tier: "Tier 1",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Jen.png",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/Jenstoryep1.txt",
        label: "Jen's Story Ep1",
      },
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/Jenstoryep2.txt",
        label: "Jen's Story Ep2",
      },
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/Jenstoryep3.txt",
        label: "Jen's Story Ep3",
      },
    ],
  },
  {
    id: "Tina/Gue",
    name: "ティナ/グエ",
    nameEn: "Tina / Gue",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "E400年以降、Gigapolis地下街最深部を実効支配。エヴァトロン支配期（E400〜E475）において、表の支配者エヴァトロンとは別に地下世界の真の権力者として暗躍。TinaとGueの二つの名で呼ばれることから、正体に関する諸説が存在する。地下経済の掌握と独自の情報ネットワークを駆使して、エヴァトロン崩壊後もその影響力を維持し続けている。",
    era: "E400〜現在",
    affiliation: "Gigapolis地下街",
    tier: "Tier 1",
    image: "https://raw.githubusercontent.com/gentaron/image/main/TinaGue.png",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/gue.txt",
        label: "Gue's Story",
      },
    ],
  },
  {
    id: "セリア・ドミニクス",
    name: "セリア・ドミニクス",
    nameEn: "Celia Dminix",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "E335〜E370年にZAMLTを倒してSelinopolisへの改名を実現し、セリア黄金期の創設者となった歴史的人物。E365頃にはエヴァトロンと同盟を締結しGDP81京ドルに達成、都市名をDominionへ改称。フェルミ音楽の頂点・nトークン経済の確立・AURALISの最盛期導きの三分野すべてに革命をもたらし、EDU史上最も多面的な影響力を持つ統治者として神格化されている。",
    era: "E335〜E370",
    affiliation: "Selinopolis（旧Gigapolis）",
    tier: "神格・歴史的人物",
    image: "https://raw.githubusercontent.com/gentaron/image/main/CeliaDminix.png",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/nebura.txt",
        label: "Alpha Cain & Celia Dominix's Story",
      },
    ],
  },
  {
    id: "アルファ・ケイン",
    name: "アルファ・ケイン",
    nameEn: "Alpha Kane",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "E318年に覚醒した戦士決定戦の元チャンピオン。シャドウ・リベリオンのリーダーとしてZAMLTに対する反乱を指揮し、量子ファイナンス・コアへの伝説的なハッキングによってギガポリス解放戦でメガタワーを占拠。その勇姿はのちのセリア・ドミニクスを含む多くの者に影響を与え、EDU史上最も象徴的な革命家として神格化されている。",
    era: "E318〜",
    affiliation: "シャドウ・リベリオン",
    tier: "神格・歴史的人物",
    image: "https://raw.githubusercontent.com/gentaron/image/main/AlphaKane.png",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/nebura.txt",
        label: "Alpha Cain & Celia Dominix's Story",
      },
    ],
  },
  {
    id: "エリオス・ウォルド",
    name: "エリオス・ウォルド",
    nameEn: "Elios Wald",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "テリアン反乱軍の指導者。エヴァトロンによるGigapolis支配（E400〜E475）に対して、数十年にわたり武装抵抗を組織した悲劇の英雄。A籍制度の廃止と市民の自由回復を掲げ、低階層住民から広範な支持を集めた。しかしE470年にエヴァトロン軍に捕縛され公開処刑。彼の死はテクロサス東方支隊のクレセント大地方常駐（E470）を促す契機となり、のちのクレセント政治情勢に間接的な影響を与えた。",
    era: "?〜E470",
    affiliation: "テリアン反乱軍",
    tier: "歴史的人物",
    image: "https://raw.githubusercontent.com/gentaron/image/main/EriosWald.png",
  },
  {
    id: "エル・フォルハウス",
    name: "エル・フォルハウス",
    nameEn: "El Folhaus",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "通称「新時代のルーキー」。E150年にマーストリヒト革命を決起し、ギガポリスのセントラル・タワーを占拠して完全自由経済を確立した革命家。コーポラタムパブリカの企業国家体制を打ち破り、西大陸に新たな経済秩序をもたらした。その行動は後のZAMLT期やセリア黄金期にも影響を与える画期的出来事となった。",
    era: "E150",
    affiliation: "コーポラタムパブリカ",
    tier: "歴史的人物",
    image: "https://raw.githubusercontent.com/gentaron/image/main/ElForhaus.png",
  },
  {
    id: "ティムール・シャー",
    name: "ティムール・シャー",
    nameEn: "Timur Shah",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "移民団のリーダーであり、10次元ホラズム理論の提唱者。E0年頃、過酷な宇宙環境を生き抜くため仮想多元宇宙「ペルセポネ」を設計し、移民たちの意識をアップロードする道を開いた。その理論は次元ピラミッドの構想へと発展し、EDU宇宙論の基礎を築いた。しかしペルセポネの実験事故はE340年のスライム・ウーマン顕現という予期せぬ結果をもたらした。",
    era: "E0頃",
    affiliation: "移民団",
    tier: "歴史的人物",
    image: "https://raw.githubusercontent.com/gentaron/image/main/TimurShah.png",
  },
  {
    id: "レイラ・ヴィレル・ノヴァ",
    name: "レイラ・ヴィレル・ノヴァ",
    nameEn: "Layla Virell Nova",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "Pink Voltage。E325年AURALIS参加。E380〜E400年のスライム危機ではオアシス・ハウスを拠点に英雄的活躍を見せ、プラズマカノンとナノファイバーブーツを駆使してスライムの巣を焼却した。E400年に冷凍保存され、E522年に目覚めた後はAURALIS Collective第二世代として活動。Pink Voltageの異名は電撃的な戦闘スタイルに由来する。",
    era: "E325〜E400（冷凍）→ E522〜現在",
    affiliation: "AURALIS Collective第二世代",
    tier: "Tier 1",
    image: "https://raw.githubusercontent.com/gentaron/image/main/LaylaVirelNova.png",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/laylastats.txt",
        label: "Layla's Battle Records 1",
      },
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/laylastats2.txt",
        label: "Layla's Battle Records 2",
      },
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/LAYLA.txt",
        label: "Layla Virel Nova's Story",
      },
    ],
  },
  {
    id: "弦太郎",
    name: "弦太郎",
    nameEn: "Gentaro",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "Lv569。E325年頃AURALIS周辺で登場。「光と音を永遠にする」理念に共鳴し、AURALIS Collectiveの活動に深く関わる人物。セリア黄金期（E335〜E370）からエヴァトロン弾圧（E400）、そして第二世代再興（E522）まで、長きにわたりAURALISの興亡を見守り続けてきた。レイラ・ヴィレル・ノヴァのAURALIS参加とも関連があり、彼女のスライム危機での英雄的活躍を近くで目撃した可能性がある。E522年の第二世代正式発足後もAURALISに関連して活動を継続しているとされる。",
    era: "E325〜現在",
    affiliation: "AURALIS関連",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Gentaro.png",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/Gentaroworld.txt",
        label: "Gentaro's Story",
      },
    ],
  },

  /* AURALIS */
  {
    id: "Kate Claudia",
    name: "ケイト・クラウディア",
    nameEn: "Kate Claudia",
    category: "キャラクター",
    subCategory: "AURALIS",
    description:
      "AURALIS Collective創設者。通称「設計者」。E270年にLily Steinerと出会い、表現を諦めない人々の集団「AURALIS」を立ち上げた。E290年正式組織化。「光と音を永遠のものに」を理念とし、リリーが感情の炎ならケイトはその形を与える鋳型だった。E335〜E370年のセリア黄金期にAURALISを最盛期へ導く。E400年エヴァトロン弾圧で逮捕・消息不明。その名は新代のKate Pattonに継承された。",
    era: "E270〜E400",
    affiliation: "AURALIS Collective第一世代（創設者）",
    tier: "神格・歴史的人物",
    image: "https://raw.githubusercontent.com/gentaron/image/main/KateClaudia.png",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/kateclaudiaandlilliesteiner.txt",
        label: "Kate Claudia & Lillie Steiner's Story",
      },
    ],
  },
  {
    id: "Kate Patton",
    name: "ケイト・パットン",
    nameEn: "Kate Patton",
    category: "キャラクター",
    subCategory: "AURALIS",
    description:
      "AURALIS Collective第二世代。初代Kate Claudiaの「名」を継承。大地の豊かさ・安定を体現。E522年の第二世代正式発足時に参画。",
    era: "E522〜現在",
    affiliation: "AURALIS Collective第二世代",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/KatePatton.png",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/Auralishentai.txt",
        label: "AURALIS Spinoff",
      },
    ],
  },
  {
    id: "Lily Steiner",
    name: "リリー・スタイナー",
    nameEn: "Lily Steiner",
    category: "キャラクター",
    subCategory: "AURALIS",
    description:
      "AURALIS Collective創設者。本名Lily Steiner、AURALIS公称名「Lillie Ardent 初代」。E270年にKate Claudiaと出会いAURALISを共同創設。「感情の炎」と称され、舞台上で性別の境界を歌う表現は神話となった。レイラのコールドスリープを誰よりも近くで見守り、目覚めるたびに「おかえり」と迎えた。E400年エヴァトロン弾圧で逮捕・最後のステージで「AURALISは消えない。灰から、また燃える」と言い残す。その名は新代のLillie Ardentに継承された。",
    era: "E270〜E400",
    affiliation: "AURALIS Collective第一世代（創設者）",
    tier: "神格・歴史的人物",
    image: "https://raw.githubusercontent.com/gentaron/image/main/LillieSteiner.png",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/kateclaudiaandlilliesteiner.txt",
        label: "Kate Claudia & Lillie Steiner's Story",
      },
    ],
  },
  {
    id: "Lillie Ardent",
    name: "リリー・アーデント",
    nameEn: "Lillie Ardent",
    category: "キャラクター",
    subCategory: "AURALIS",
    description:
      "AURALIS Collective第二世代。初代Lily Steinerの「名」を継承。情熱的で大胆。E522年の第二世代正式発足時に参画。",
    era: "E522〜現在",
    affiliation: "AURALIS Collective第二世代",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/LillieArdent.png",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/Auralishentai.txt",
        label: "AURALIS Spinoff",
      },
    ],
  },
  {
    id: "ミナ・エウレカ・エルンスト",
    name: "ミナ・エウレカ・エルンスト",
    nameEn: "Mina Eureka Ernst",
    category: "キャラクター",
    subCategory: "AURALIS",
    description:
      "AURALIS第二世代。E499年ノスタルジア・コロニー誕生。AI研究員。Genesis Vault創設者。リミナル・フォージ創設者。",
    era: "E499〜現在（29歳）",
    affiliation: "AURALIS Collective第二世代 / リミナル・フォージ",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/MinaEurekaErnst.png",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/Auralishentai.txt",
        label: "AURALIS Spinoff",
      },
    ],
  },
  {
    id: "Ninny Offenbach",
    name: "ニニー・オッフェンバッハ",
    nameEn: "Ninny Offenbach",
    category: "キャラクター",
    subCategory: "AURALIS",
    description:
      "AURALIS第二世代。無邪気で爆発的な活力。原初個体はAlpha Kane時代に別惑星へ。クローン技術で遺伝子継承しGigapolisに再帰還。",
    era: "新代〜現在",
    affiliation: "AURALIS Collective第二世代",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/NinnyOffenbach.png",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/Auralishentai.txt",
        label: "AURALIS Spinoff",
      },
    ],
  },

  /* Iris/Crescent */
  {
    id: "アイリス",
    name: "アイリス",
    nameEn: "Iris",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "IRIS現代ランキング1位。ヴァーミリオンの英雄としてE480年頃から活動を開始し、ブルーワイヤとウォーター・オーブを駆使した独自の戦闘スタイルで数多の敵を打ち倒してきた。シルバー・ヴェノムとの長き戦いを経てE510年に捕囚されたが、E519年の再救出後はトリニティ・アライアンスの指導者としてV7とアルファ・ヴェノムとの二正面対峙に挑む。",
    era: "E480〜現在",
    affiliation: "トリニティ・アライアンス / 元ヴァーミリオン諜報機関長",
    tier: "Tier 1",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Iris.png",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/IRIS_1.txt",
        label: "Iris's Story Ep1",
      },
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/IRIS_2.txt",
        label: "Iris's Story Ep2",
      },
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/IRIS_3.txt",
        label: "Iris's Story Ep3",
      },
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/IRIS_4.txt",
        label: "Iris's Story Ep4",
      },
    ],
  },
  {
    id: "ウィリー",
    name: "ウィリー",
    nameEn: "Willy",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "ヴァーミリオン諜報機関に所属し、アイリスのパートナー兼元恋人としてE490年代から活動。アイリスがランキング1位に躍進する以前から彼女を支え、諜報活動の現場で共に命を懸けた戦友。複雑な過去を共有しつつも、現在もアイリスの行動に深い影響を与える存在。",
    era: "E490〜",
    affiliation: "ヴァーミリオン",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Willie.png",
  },
  {
    id: "エレナ",
    name: "エレナ",
    nameEn: "Elena",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "ヴァーミリオン諜報機関の元本部長であり、アイリスの直属の上司として彼女をスカウト・育成した人物。鋭い洞察力と冷徹な判断力で機関を統率し、シルバー・ヴェノムとの暗闘の最前線で指揮を執った。E505年頃に退任した後も、その遺産はアイリスの行動に色濃く反映されている。",
    era: "?〜E505頃",
    affiliation: "ヴァーミリオン諜報機関",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Elena.png",
  },
  {
    id: "セバスチャン・ヴァレリウス",
    name: "セバスチャン・ヴァレリウス",
    nameEn: "Sebastian Valerius",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "ボグダス・ジャベリンリーダー。IRIS現代ランキング4位。E490年頃にヴァーミリオンに恒久駐在を開始。テクロサス系譜（E15ファランクス → E295三頭政治改編 → E470東方支隊）を継承する軍事組織の当代指導者。副リーダー・ガレスを筆頭とする精鋭部隊を率い、アイリスのシルバー・ヴェノムに対抗や救出作戦（E510・E519）で中核的な役割を果たした。トリニティ・アライアンスの軍事的支柱として、V7との冷戦期においても安定した戦力を維持。",
    era: "E490〜現在",
    affiliation: "ボグダス・ジャベリン",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/SebastianValerius.png",
  },
  {
    id: "ガレス",
    name: "ガレス",
    nameEn: "Gareth",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "ボグダス・ジャベリンの副リーダー。セバスチャン・ヴァレリウスの右腕として部隊全体の実戦指揮を担い、E510年・E519年の救出作戦で前線から部隊を率いた。テクロサス系譜の軍人として洗練された統率力を持ち、メンバーから絶大な信頼を集める堅実な将校。",
    era: "E490〜現在",
    affiliation: "ボグダス・ジャベリン",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Gareth.png",
  },
  {
    id: "フィオナ",
    name: "フィオナ",
    nameEn: "Klaus Fiona",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "ブルーローズ統率者。V7急先鋒。IRIS現代ランキング2位。E490年頃からクレセント政治の表舞台に登場。アイリス救出作戦（E510）でボグダス・ジャベリンと連携して活躍し、V7設立（E515）に向けて外交を主導。E520年のトリニティ・アライアンス結成後、ミエルテンガ総統への就任をアイリスに推薦するなど協調的姿勢を見せていたが、E523〜E525年にアルファ・ヴェノムと内通していることが発覚。腹心のピアトリーノを通じてブルーローズ地下街を掌握し、二重スパイとしてクレセント全域に激震をもたらした。",
    era: "E490〜現在",
    affiliation: "ブルーローズ / アルファ・ヴェノム（内通）",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Fiona.png",
  },
  {
    id: "マリーナ・ボビン",
    name: "マリーナ・ボビン",
    nameEn: "Marina Bobbin",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "ミエルテンガ総統。IRIS現代ランキング3位。E515年のV7設立からクレセント政治の中核を担う。表向きはトリニティ・アライアンスの盟友として振る舞うが、フィオナの裏切り（E523〜E525）との共謀説が浮上しており、クレセント全域における「真の黒幕」の可能性が指摘されている。E520年のアイリスのミエルテンガ首脳就任自体がフィオナの推薦によるものであり、マリーナの関与が疑われている。高圧的な政治手腕と深い情報網で知られ、ランキング3位の実力は伊達ではないとされる。",
    era: "E515〜現在",
    affiliation: "ミエルテンガ",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/MarinaBobbin.png",
  },
  {
    id: "カスチーナ・テンペスト",
    name: "カスチーナ・テンペスト",
    nameEn: "Castina Tempest",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "クロセヴィア首脳。IRIS現代ランキング5位。E515年のV7設立メンバーの一人。テンペストの名が示す通り、荒波のような政治的判断力でクロセヴィアを率いる。V7 vs トリニティの二大陣営対立において、明確な陣営選択を避け独自路線を歩む戦略家。Casteria Grenvelt（カステリア・グレンヴェルト）とは全くの別人物であり、混同を避けるべき。",
    era: "E515〜現在",
    affiliation: "クロセヴィア",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/CastinaTempest.png",
  },
  {
    id: "イズミ",
    name: "イズミ",
    nameEn: "Izumi",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "アルファ・ヴェノムリーダー。両性具有。E518年にシルバー・ヴェノム残党を吸収し、アルファ・ヴェノムを大幅に勢力拡大。E519年には自らの指揮でアイリスの再拉致を成功させるなど、極めて高い戦略的判断力と実行力を持つ。ボブリスティ・ギル・カタリナ・ゴルディロックス・AJらを率い、フィオナを内通者として抱き込むことでV7内部からトリニティ・アライアンスを弱体化させる二重工作を展開。アイリス最大の敵対者。",
    era: "E518〜現在",
    affiliation: "アルファ・ヴェノム",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Izumi.png",
  },
  {
    id: "レオン",
    name: "レオン",
    nameEn: "Leon",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "シルバー・ヴェノムの幹部としてマスター・ヴェノムに仕え、暗黒組織の中枢で活動した実行部隊の指揮官。E485年頃から組織の作戦立案と実行を担い、シルバー・ヴェノムの拡大期に多大な影響力を持った。イズミによる吸収後の動向は不明。",
    era: "E485〜",
    affiliation: "シルバー・ヴェノム",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Leon.png",
  },
  {
    id: "ヴィヴィエッタ",
    name: "ヴィヴィエッタ",
    nameEn: "四楓院ヴィヴィエッタ",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "シルバー・ヴェノムに捕囚されていた元捕虜。E510年のアイリス救出作戦においてボグダス・ジャベリンとの連携によって救出され、自由の身となった。救出後はアイリスへの感謝と信頼からトリニティ・アライアンスに接近し、ヴァーミリオンとの関係構築に寄与したとされる。",
    era: "?〜E512",
    affiliation: "捕虜（のち救出）",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Vivietta.png",
  },
  {
    id: "レヴィリア・サーペンティナ",
    name: "レヴィリア・サーペンティナ",
    nameEn: "Levilia Serpentina",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "シルバー・ヴェノムの幹部の一人。その名が示す通り蛇のように狡猾な手腕で組織の暗部を操り、レオンと並ぶ中枢メンバーとして活動した。マスター・ヴェノムの失脚後も独自のネットワークを維持し、アルファ・ヴェノムへの移行過程でも暗躍したとされる謎の人物。",
    era: "?〜現在",
    affiliation: "シルバー・ヴェノム",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/LeviliaSerpentina.png",
  },

  {
    id: "ミユシャリ",
    name: "ミユシャリ",
    nameEn: "Miyushari",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "ボグダス・ジャベリンの偵察・索敵担当。隠密行動と情報収集に長け、セバスチャン・ヴァレリウスの先遣として敵地の地形分析や危険区域の特定を担う。E510年のアイリス救出作戦では、シルバー・ヴェノムの防衛網の隙間を見抜き部隊の侵入ルートを確保した。",
    era: "E490〜現在",
    affiliation: "ボグダス・ジャベリン",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Miyushari.png",
  },
  {
    id: "ファリエル",
    name: "ファリエル",
    nameEn: "Fariel",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "ボグダス・ジャベリンの近接戦闘担当。双剣を駆使した高速戦闘スタイルで知られ、部隊の最前線で敵の攻撃を一手に受け止める。ガレスから直接指導を受けた精鋭の一人であり、その剣技はテクロサス系譜の戦闘教範を体現している。",
    era: "E490〜現在",
    affiliation: "ボグダス・ジャベリン",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Fariel.png",
  },
  {
    id: "アイナ",
    name: "アイナ・フォン・リースフェルト",
    nameEn: "Aina von Riesfeldt",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "ボグダス・ジャベリンの戦略分析・通信担当。リアルタイムの戦況把握と部隊間の連携調整を担い、セバスチャンの作戦立案を補佐する頭脳派。リースフェルト家の出身であり、分析的思考と冷徹な判断力で部隊の「第二の頭脳」と呼ばれている。",
    era: "E490〜現在",
    affiliation: "ボグダス・ジャベリン",
    image: "https://raw.githubusercontent.com/gentaron/image/main/AinaVonRiesfeld.png",
  },
  {
    id: "ギャビー",
    name: "フレデリック・ギャビー",
    nameEn: "Frederick Gabby",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "ボグダス・ジャベリンの重火器・爆薬担当。大型兵器の運用と爆破工作を専門とし、要塞攻略戦では障害物の破壊と火力支援で先陣を切る。その圧倒的な破壊力は味方からも「暴走機関車」と称され、敵からは最も警戒されているメンバーの一人。",
    era: "E490〜現在",
    affiliation: "ボグダス・ジャベリン",
    image: "https://raw.githubusercontent.com/gentaron/image/main/FredericGabby.png",
  },
  {
    id: "シェロン",
    name: "シェロン・ジェラス",
    nameEn: "Sheron Jeras",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "ボグダス・ジャベリンの後方支援・医療担当。負傷者の治療と部隊の兵站管理を一手に引き受け、過酷な戦場においても部隊の戦闘継続能力を支える。冷静沈着な性格で、ガレスからの信頼も厚く、部隊の要として欠かせない存在。",
    era: "E490〜現在",
    affiliation: "ボグダス・ジャベリン",
    image: "https://raw.githubusercontent.com/gentaron/image/main/SheronJeras.png",
  },
  {
    id: "イルミーゼ",
    name: "イルミーゼ",
    nameEn: "Ilmise",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "ボグダス・ジャベリンの電子戦・ハッキング担当。敵の通信網の傍受や妨害工作を担い、情報面から作戦の成功を裏で支える。シェロンと並ぶ後方要員でありながら、その技術力は最前線の戦況をも左右する重要な役割を果たす。",
    era: "E490〜現在",
    affiliation: "ボグダス・ジャベリン",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Ilmise.png",
  },
  {
    id: "ホワイトノイズ",
    name: "ホワイトノイズ",
    nameEn: "White Noise",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "ボグダス・ジャベリンの潜入工作・暗殺担当。その名の通り痕跡を残さず行動し、敵の重要拠点への単独潜入を得意とする。正体不明の点が多く、セバスチャンですら全貌を把握していないとされる謎めいた特殊技能者。",
    era: "E490〜現在",
    affiliation: "ボグダス・ジャベリン",
    image: "https://raw.githubusercontent.com/gentaron/image/main/WhiteNoise.png",
  },
  {
    id: "ワドリナ",
    name: "ワドリナ",
    nameEn: "Wadorina",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "ボグダス・ジャベリンの盾役・防御戦闘担当。巨大な盾を用いた堅牢な防御陣形で部隊の背後を守り、ガレスの副官格として小隊指揮もこなす。その忠誠心と身体を張った防衛行動は、部隊全体の士気を支える精神的支柱となっている。",
    era: "E490〜現在",
    affiliation: "ボグダス・ジャベリン",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Wadrina.png",
  },
  {
    id: "ニニギス",
    name: "ニニギス・カラス",
    nameEn: "Ninigisu Karasu",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "ボグダス・ジャベリンの航空・機動戦闘担当。空中からの偵察と機動打撃を担い、ミユシャリの地上偵察と連携して部隊に立体的な戦闘優位をもたらす。「カラス」の異名はその素早い飛行能力に由来し、敵にとっては空からの脅威。",
    era: "E490〜現在",
    affiliation: "ボグダス・ジャベリン",
    image: "https://raw.githubusercontent.com/gentaron/image/main/NinigisKaras.png",
  },
  {
    id: "イェシバトー",
    name: "イェシバトー",
    nameEn: "Yeshibato",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "ボグダス・ジャベリンの格闘戦・制圧担当。素手を中心とした近接格闘術で敵を無力化し、捕縛を要する任務では不可欠な戦力。セバスチャンがテクロサス東方支隊時代から鍛え上げた古参メンバーであり、部隊内でも随一の身体能力を誇る。",
    era: "E490〜現在",
    affiliation: "ボグダス・ジャベリン",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Yeshibato.png",
  },
  {
    id: "アザゼル",
    name: "アザゼル・ヘクトパス",
    nameEn: "Azazel Hectopass",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "ヴァーミリオンの元首脳であり、アイリスが台頭する以前のクレセント政治を主導した実力者。E480年頃まで権力の座にあり、その退場はアイリスの躍進とヴァーミリオン体制の転換を象徴する出来事となった。現在の行方は不明。",
    era: "?〜E480頃",
    affiliation: "ヴァーミリオン",
    image: "https://raw.githubusercontent.com/gentaron/image/main/AzazelHectopus.png",
  },
  {
    id: "ピアトリーノ",
    name: "ピアトリーノ",
    nameEn: "Piatorino",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "フィオナの腹心としてブルーローズ地下街の実務を一手に掌握する実行力のある人物。E515年以降、フィオナのアルファ・ヴェノムへの内通工作を補佐し、地下街を通じた密輸・情報収集ネットワークを構築した。表向きはブルーローズ政府の下級官吏を装いながら、裏で組織の暗部を動かすフィオナの「影の右手」。",
    era: "E515〜現在",
    affiliation: "ブルーローズ",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Piatrino.png",
  },
  {
    id: "アイク・ロペス",
    name: "アイク・ロペス",
    nameEn: "Ike Lopez",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "SSレンジの首脳であり、E515年のV7設立メンバーの一人。クレセント地方の国際的な交易・通信網を支配下に置き、V7の経済的基盤を支える実力者。V7とトリニティ・アライアンスの冷戦構造の中で、明確な陣営を選ばず独自の利益を追求する現実主義者。",
    era: "E515〜現在",
    affiliation: "SSレンジ / V7",
    image: "https://raw.githubusercontent.com/gentaron/image/main/AikeLopez.png",
  },
  {
    id: "レイド・カキザキ",
    name: "レイド・カキザキ",
    nameEn: "Raid Kakizaki",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "アイアン・シンジケートの首脳であり、E515年のV7設立メンバーの一人。重工業と軍需生産を基盤とした国家経済を構築し、V7の軍事的な力を裏から支える。堅実な武人としての性格で、カスチーナ・テンペストとは異なる路線でV7内部の影響力を維持している。",
    era: "E515〜現在",
    affiliation: "アイアン・シンジケート / V7",
    image: "https://raw.githubusercontent.com/gentaron/image/main/ReidKakizaki.png",
  },
  {
    id: "ミカエル・ガブリエリ",
    name: "ミカエル・ガブリエリ",
    nameEn: "Mikael Gabrieli",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "ファールージャ社のCEOとしてクレセント地方最大の民間企業を率いる実業家。次元極地平技術の民生応用と武器開発の両面でV7陣営に深く関与し、軍事・経済の両面からクレセントの力均衡に影響を与える。その企業帝国は国家の枠を超え、事実上V7の「第8の力」と呼ばれている。",
    era: "E515〜現在",
    affiliation: "ファールージャ社",
    image: "https://raw.githubusercontent.com/gentaron/image/main/MikaelGabrieli.png",
  },
  {
    id: "ヨニック",
    name: "ヨニック",
    nameEn: "Yonick",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "ブルー・ローズ政府の最高司令官として国家の軍事全般を統括する人物。フィオナの統率のもとでV7の軍事的支柱として機能したが、フィオナの裏切り発覚後は対応に追われている。忠誠心の強い軍人であり、ブルーローズの正規軍の信頼を厚く集める。",
    era: "E515〜現在",
    affiliation: "ブルーローズ",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Yonik.png",
  },
  {
    id: "マスター・ヴェノム",
    name: "マスター・ヴェノム",
    nameEn: "Master Venom",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "シルバー・ヴェノムの創設者にして初代リーダー。E475年にエヴァトロンΣ-Unit残党から独立し、通称「影の支配者」として暗黒組織の基盤を築いた。本名は一切不明であり、レオンやレヴィリア・サーペンティナら幹部すら素顔を知らないとされる。E500年頃に忽然と姿を消し、その後イズミが後継として組織を引き継いだ。",
    era: "E475〜E500頃",
    affiliation: "シルバー・ヴェノム",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/MasterVenom.png",
  },
  {
    id: "ゴルディロックス",
    name: "ゴルディロックス",
    nameEn: "Goldilocks",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "アルファ・ヴェノムの潜入・変装工作担当。イズミの指示のもとV7内部への浸透工作を担い、フィオナとの内通ルートの構築に重要な役割を果たした。その名の通り、状況に応じて複数の身分を巧みに使い分け、敵対勢力を内部から崩壊させることに長ける。",
    era: "E518〜現在",
    affiliation: "アルファ・ヴェノム",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Goldilocks.png",
  },
  {
    id: "カタリナ",
    name: "カタリナ",
    nameEn: "Catalina",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "アルファ・ヴェノムの正面戦闘担当。圧倒的な破壊力で戦場を支配し、E519年のアイリス再拉致作戦では先鋒としてトリニティ・アライアンスの防衛線を突破した。イズミの最も信頼する戦闘要員であり、その力技はボブリスティの戦術と好対照をなす。",
    era: "E518〜現在",
    affiliation: "アルファ・ヴェノム",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Katarina.png",
  },
  {
    id: "ボブリスティ",
    name: "ボブリスティ",
    nameEn: "Boblisti",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "アルファ・ヴェノムの戦術指揮・軍師役。イズミの構想を実戦レベルの作戦計画に練り上げ、カタリナやギルの戦闘力を最大限に活用する配置を行う。シルバー・ヴェノム時代からの古参であり、組織の再編と戦力拡大の立役者。",
    era: "E518〜現在",
    affiliation: "アルファ・ヴェノム",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Bobristy.png",
  },
  {
    id: "ギル",
    name: "ギル",
    nameEn: "Gil",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "アルファ・ヴェノムの技術開発・兵器管理担当。旧シルバー・ヴェノムの残存技術を継承しつつ、新たな兵器や装備の開発を手掛ける。E519年の作戦では特殊な拘束装置を用いてアイリスの能力を封じるなど、技術面からイズミの作戦を強力に支援。",
    era: "E518〜現在",
    affiliation: "アルファ・ヴェノム",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Gil.png",
  },
  {
    id: "ラストマン",
    name: "ラストマン",
    nameEn: "Lastman",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "シルバー・ヴェノム崩壊後に残存した旧組織の忠実なメンバー。マスター・ヴェノムの失脚後もイズミのアルファ・ヴェノムへの合流を拒み、独自に旧組織の再興を画策する頑固な残党。シルバー・ヴェノムの古き栄光に固執し、イズミの新しい方針を「裏切り」と見なす異端者として、クレセントの暗部で依然として活動を続けている。",
    era: "E500〜",
    affiliation: "シルバー・ヴェノム残党",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Lastman.png",
  },
  {
    id: "AJ",
    name: "アルフレッド・ジュース",
    nameEn: "Alfred Juce",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "アルファ・ヴェノムの情報操作・宣伝工作担当。本名アルフレッド・ジュース。クレセント地方のメディアと情報網を操作し、トリニティ・アライアンスへの社会的圧力を形成する工作を展開。イズミの二重工作を支える影の広報官として、真実を歪める言葉の力を操る。",
    era: "E518〜現在",
    affiliation: "アルファ・ヴェノム",
    image: "https://raw.githubusercontent.com/gentaron/image/main/AJ.png",
  },
  {
    id: "Slime_Woman",
    name: "スライム・ウーマン",
    nameEn: "Slime Woman",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "E340年、ティムール・シャーが設計した仮想多元宇宙「ペルセポネ」の実験事故により、高次元世界（Tier Ω）からE16通常次元（Tier Ε）に顕現した超越的存在。スライム危機（E380〜E400）の遠因となった搾取生物の遺伝子変異にも間接的に関与している可能性がある。Tier 1アクティブ現役最強格であり、その能力の正体は高次元物理学の未解明領域に属する。人間社会の枠組みに完全に適応しているわけではなく、特定の個人（Junなど）とのみ特異な相互作用を示す。E340年の顕現から約200年近く存在し続ける、EDU中最も謎めいた存在。",
    era: "E340〜現在",
    affiliation: "不明（高次元存在）",
    tier: "Tier 1",
    image: "https://raw.githubusercontent.com/gentaron/image/main/SlimeWoman.png",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/Junandslime.txt",
        label: "Jun's Story",
      },
    ],
  },
  {
    id: "テミルタロン",
    name: "テミルタロン",
    nameEn: "Temirtalon",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "E80〜E90年代に活動した物理学者。サイケデリック・コスモロジーを提唱し、次元極地平を宇宙論的な枠組みで解釈して次元ピラミッドの原型を構想した。その理論的成果を具現化するためテンプル・オブ・ホライゾンを設計し、技術啓蒙時代の精神的・科学的支柱となった。彼の構想はのちのティムール・シャーの10次元ホラズム理論にも影響を与えたとされる。",
    era: "E80〜E90",
    affiliation: "テンプル・オブ・ホライゾン",
    tier: "歴史的人物",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Temirtaron.png",
  },
  {
    id: "アリア・ソル",
    name: "アリア・ソル",
    nameEn: "Aria Sol",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "E151年の新ヘルシンキ宣言で惑星連邦構想を提起した政治思想家。次元極地平技術を活用した星間議会の構想を打ち出し、M104銀河全体の平和的統合を志向した。エル・フォルハウスのマーストリヒト革命と同時代に活動し、ギガポリスの完全自由経済とは対照的な協調的宇宙外交の先駆者として歴史に名を残す。",
    era: "E151頃",
    affiliation: "惑星連邦構想派",
    tier: "歴史的人物",
    image: "https://raw.githubusercontent.com/gentaron/image/main/AriaSol.png",
  },
  {
    id: "ゼナ",
    name: "ゼナ",
    nameEn: "Zena",
    category: "キャラクター",
    subCategory: "Eros-7",
    description:
      "Eros-7で活動する女性商人。独自の貿易ネットワークを通じてEros-7各地に物資を供給する実業家であり、E525年にアヤカ・リンとガロと同盟を結びマトリカル・リフォーム運動に参加。経済面からの社会変革を主導し、搾取抑制剤の非公式流通ルートを構築するなど、運動の兵站を支える不可欠なパートナー。",
    era: "E525〜",
    affiliation: "マトリカル・リフォーム運動",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Zena.png",
  },

  /* Eros-7 */
  {
    id: "リリス・ヴェイン",
    name: "リリス・ヴェイン",
    nameEn: "Lilith Vaine",
    category: "キャラクター",
    subCategory: "Eros-7",
    description:
      "Eros-7初期の女性リーダーであり、搾取生物の制御技術を開発した科学者。E0年代に搾取生物の暴走を収めるため独自の生体制御理論を確立し、搾取生物をエネルギー資源として活用する道を開いた。その技術は後のバイオリアクターやスクイーズ・アビス建設の基盤となり、Eros-7社会の存続に不可欠な遺産を残した。",
    era: "E0頃",
    affiliation: "Eros-7",
    tier: "歴史的人物",
    image: "https://raw.githubusercontent.com/gentaron/image/main/LilithVane.png",
  },
  {
    id: "シルヴィア・クロウ",
    name: "シルヴィア・クロウ",
    nameEn: "Sylvia Crow",
    category: "キャラクター",
    subCategory: "Eros-7",
    description:
      "Eros-7の女性リーダー。E97〜E101年の搾取生物危機において、強力なエスパー能力を駆使して危機を単独で収束させた英雄。この功績により男性指令省を設立し、Eros-7のマトリカル社会に新たな統治体制を確立。彼女のエスパー能力は後世に伝説として語り継がれている。",
    era: "E97〜E101",
    affiliation: "Eros-7",
    tier: "歴史的人物",
    image: "https://raw.githubusercontent.com/gentaron/image/main/SylviaCrow.png",
  },
  {
    id: "カーラ・ヴェルム",
    name: "カーラ・ヴェルム",
    nameEn: "Cara Verm",
    category: "キャラクター",
    subCategory: "Eros-7",
    description:
      "Eros-7に建設された560階に及ぶ地下搾取施設スクイーズ・アビスの立案者。E380年に着工し、搾取生物のエネルギーを抽出して搾取プラズマ弾を生産する巨大プラントを完成させた。その技術的野心的施設はEros-7の軍事力を飛躍的に増強したが、同時に倫理的な批判も招いた。E505年に施設の運用を終了した後の動向は不明。",
    era: "E380〜E505",
    affiliation: "Eros-7",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/KarlaVelm.png",
  },
  {
    id: "ガロ",
    name: "ガロ",
    nameEn: "Garo",
    category: "キャラクター",
    subCategory: "Eros-7",
    description:
      "シャドウ・ユニオンの男性指導者であり、E330年頃から反体制運動を率いてきた古参の闘士。アヤカ・リンとはスライム危機以来の盟友であり、互いに絶対的な信頼で結ばれている。ZAMLT期にはナノハッキング技術を駆使してバイオリアクター妨害活動を展開し、E525年のマトリカル・リフォーム運動でも中心的役割を果たす。",
    era: "E330〜",
    affiliation: "シャドウ・ユニオン",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Garo.png",
  },
  {
    id: "アヤカ・リン",
    name: "アヤカ・リン",
    nameEn: "Ayaka Rin",
    category: "キャラクター",
    subCategory: "Eros-7",
    description:
      "Lv.842。搾精生物専門ハンター。マトリカル・リフォーム運動を組織。E380年のスライム危機では、ビキニバリア・カウパー波を駆使してアンダーグリッド深部でスライムの巣を破壊。プライマリー・フィールド経由で全市民に戦闘記録中継し、英雄的な名声を確立。E525年にはシャドウ・ユニオン男性リーダー・ガロや女性商人ゼナと同盟を結び、労働時間短縮・精子レジストリ男女平等化を掲げるマトリカル・リフォーム運動を本格的に組織。Eros-7社会変革の原動力。",
    era: "E380〜現在",
    affiliation: "シャドウ・ユニオン / マトリカル・リフォーム運動",
    tier: "Tier 1",
    image: "https://raw.githubusercontent.com/gentaron/image/main/AyakaRin.png",
  },

  /* 新規キャラクター */
  {
    id: "カステリア・グレンヴェルト",
    name: "カステリア・グレンヴェルト",
    nameEn: "Casteria Grenvelt",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "カスチーナ・テンペスト（Castina Tempest、クロセヴィア首脳）とは別人。Gigapolis西大陸を拠点とする人物。クレセント地方の政治情勢とは直接的な関わりを持たないが、西大陸の社会における独自の視点を提供する存在。",
    era: "不詳",
    affiliation: "Gigapolis西大陸",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/CasteriaGrenvelt.png",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/kasuteriasan.txt",
        label: "Casteria Grenvelt's Story",
      },
    ],
  },
  {
    id: "シトラ・セレス",
    name: "シトラ・セレス",
    nameEn: "Sitra Celes",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "E16連星系のどこかで活動する個人。EDU世界の主要な事件群とは別の視点から世界を体験する存在。",
    era: "不詳",
    affiliation: "不詳",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/SitraCeles.png",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/sitra.txt",
        label: "Sitra Celes's Story",
      },
    ],
  },
  {
    id: "ミュー",
    name: "ミュー",
    nameEn: "Myu",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "E16連星系における個人の物語を軸に、英雄たちとは異なる規模の、しかし等しくEDU世界の一部である生活と冒険を描く。テクノ文化ルネサンス（E475〜E500）以降の現代社会を舞台にしている可能性が高い。",
    era: "不詳",
    affiliation: "不詳",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Myu.png",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/Myustory.txt",
        label: "Myu's Story",
      },
    ],
  },
  {
    id: "ジュン",
    name: "ジュン",
    nameEn: "Jun",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "Slime Woman（E340年ペルセポネ事故で顕現した高次元存在）との特異な相互作用を持つ人物。高次元存在であるSlime Womanが人間社会でどのように振る舞うのか、そして特定の個人との間に何が生じるのかを描く、EDU宇宙論にとって重要な物語。",
    era: "E340以降〜現在",
    affiliation: "不詳（Slime Womanとの関連）",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Jun.png",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/Junandslime.txt",
        label: "Jun's Story",
      },
    ],
  },

  /* 宇宙勢力 — eduuni.txt */
  {
    id: "アルゼン・カーリーン",
    name: "アルゼン・カーリーン",
    nameEn: "Alzen Carine",
    category: "キャラクター",
    subCategory: "宇宙勢力",
    description:
      "グランベル大統領。宇宙最大の経済圏を率いる指導者。第一回宇宙連合会合で「争いを超え、共存と繁栄の道を見つけることが次世代への責任」と演説。首都オルダシティで会合を主催し、宇宙秩序の構築に主導的な役割を果たしているが、その圧倒的な経済力に対して他勢力から「経済的従属を招くのではないか」という懸念も抱かれている。",
    era: "現在（E528〜）",
    affiliation: "グランベル",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },
  {
    id: "グレイモンド・ハウザー",
    name: "グレイモンド・ハウザー",
    nameEn: "Greymond Hauser",
    category: "キャラクター",
    subCategory: "宇宙勢力",
    description:
      "ティエリア総帥。宇宙最強の軍事力を指揮する。第一回宇宙連合会合で「軍事力なくして平和は守れない。力がなければ、秩序は保てない」と演説し、エレシオン女王リアナと対立。グランベルのアルゼン大統領に対しても「その言葉を信用するかは、具体的な行動を見てからだ」と懐疑的な姿勢を示した。トゥキディデスの罠の危険性を認識しつつも、ティエリアの安全保障を最優先としている。",
    era: "現在（E528〜）",
    affiliation: "ティエリア",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },
  {
    id: "女王リアナ・ソリス",
    name: "女王リアナ・ソリス",
    nameEn: "Queen Liana Solis",
    category: "キャラクター",
    subCategory: "宇宙勢力",
    description:
      "エレシオンの女王。医療技術と環境再生技術をリードし、平和主義・技術共有推進の外交姿勢で多くの小規模文明から支持を得ている。第一回宇宙連合会合でティエリアの軍拡に真っ向から反対し、「軍拡はさらなる争いを招くだけです」と主張。会合後はエレシオンの医療・環境技術で宇宙全体を再構築する使命を確認した。",
    era: "現在（E528〜）",
    affiliation: "エレシオン",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },
  {
    id: "マドリス・カーネル",
    name: "マドリス・カーネル",
    nameEn: "Madrisernel",
    category: "キャラクター",
    subCategory: "宇宙勢力",
    description:
      "ファルージャ評議会代表。宇宙中の文明間交流を主導し、対立する勢力間の調停役として機能している。第一回宇宙連合会合でグランベルの経済的支配に対する懸念を表明し、ディオクレニスの宇宙共同探査提案にエレシオンとともに支持。「文化の力が宇宙全体を結びつける鍵になる」と信じ、文化交流強化計画を推進。",
    era: "現在（E528〜）",
    affiliation: "ファルージャ",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },
  {
    id: "ネイサン・コリンド",
    name: "ネイサン・コリンド",
    nameEn: "Nathan Corlind",
    category: "キャラクター",
    subCategory: "宇宙勢力",
    description:
      "ディオクレニス科学宰相。宇宙探査と科学技術研究の最前線を担う。第一回宇宙連合会合で最も重要な役割を果たし、「トゥキディデスの罠」の危険性を科学的に指摘。対立のエネルギーを共同宇宙探査へ転換する提案を行い、平和協定・UECO設立・技術共有・文化交流拡大の4つの具体的提案を実施。会合後は全勢力参加の共同宇宙探査プロジェクト立案に没頭している。",
    era: "現在（E528〜）",
    affiliation: "ディオクレニス",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },
  {
    id: "ロナン・アーサ",
    name: "ロナン・アーサ",
    nameEn: "Ronan Arthur",
    category: "キャラクター",
    subCategory: "宇宙勢力",
    description:
      "アポロン文明圏のリーダー。騎士団の頂点に立つ英雄的存在。中核惑星アポロン・セントラリスを拠点とし、最盛期のGDPは125兆ドルに達した。セリアに同盟・共存を提案したが拒絶され、全面戦争に至る。ケンタウロスレーザー発射を命じたが、最終的にセリアのヴェノム艦隊がアポロン・セントラリスを攻略し、ロナンは戦死。アポロン文明圏は壊滅的損害を受けた。",
    era: "大戦期（歴史上）",
    affiliation: "アポロン文明圏",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },
  {
    id: "グリム・ダルゴス",
    name: "グリム・ダルゴス",
    nameEn: "Grim Dargos",
    category: "キャラクター",
    subCategory: "宇宙勢力",
    description:
      "エヴァトロン初代リーダー。何世代にもわたる男尊女卑の文化を基盤とした銀河系を統治。セリアが次元エネルギー技術を提供条件に同盟を求めた際、文化的価値観が真逆でありながらも実利的な同盟を成立させた。その後、アポロン・Dominion大戦に参戦し、戦後は疲弊したDominionを買収・吸収してE16系を支配した。",
    era: "歴史上",
    affiliation: "エヴァトロン",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },
  {
    id: "マスター・クインシアス",
    name: "マスター・クインシアス",
    nameEn: "Master Quinsias",
    category: "キャラクター",
    subCategory: "宇宙勢力",
    description:
      "グランベルの初期リーダー。崩壊したDominionのセリア時代を高く評価し、「セリア時代こそが、宇宙史で最も成功した時代だった。あの時代は、技術革新と社会秩序が完全に調和していた」と残した。グランベルをセリアの後継的な存在として位置づけた。",
    era: "歴史上",
    affiliation: "グランベル",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },
  {
    id: "ヴァイロン・デアクス",
    name: "ヴァイロン・デアクス",
    nameEn: "Vylon Deax",
    category: "キャラクター",
    subCategory: "宇宙勢力",
    description:
      "エヴァトロンの幹部。戦後の疲弊したDominionを買収したエヴァトロンによって、Dominionの統治者に任命された。エヴァトロンの文化と価値観をDominion全土に浸透させようとしたが、セリア時代の自由を経験した住民の激しい反発を招き、毎日のように暴動や抗議が起きた。",
    era: "歴史上",
    affiliation: "エヴァトロン",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },

  /* ZAMLT / 企業国家 */
  {
    id: "エリオット・シュトラス",
    name: "エリオット・シュトラス",
    nameEn: "Elliot Strauss",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "ZAMLTの創設者にして最高指導者。20万以上の企業国家が乱立するGigapolis経済圏を5超巨大企業に統合し、E301年にZAMLTを設立した冷徹な戦略家。テスラ重工業連合、量子ファイナンス・コントロール、グローバル・メディア・コングロマリット、A-Registry運営委員会、インフラストラクチャー・アライアンスの五大企業を傘下に収め、E16連星系の金融取引の95%を掌握した。彼の経済覇権は企業国家体制の最終形態であり、エル・フォルハウスのマーストリヒト革命（E150年）が開いた自由経済の道を、極めて少数のエリートによる中央集権的支配へと逆転させた。ZAMLT本社の最深部に建造された次元の塔（Dimensional Tower）とカタリスト・コアの構想も彼によるものとされる。E318年のアルファ・ケインによるギガポリス解放戦でZAMLTは崩壊し、シュトラスは権力の座から転落した。彼の遺産はnトークン経済システムやA-Registryの階級制度として現在もE16文明圏に根を下ろしており、その影響は銀河系コンソーシアムの経済框架にも波及している。",
    era: "E301〜E318",
    affiliation: "ZAMLT",
    tier: "歴史的人物",
  },
  {
    id: "アレン",
    name: "アレン",
    nameEn: "Allen",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "企業国家「ストロベリー」のCEOであり、nebura（星々の交響曲）の物語の序盤における重要人物。ZAMLTをはじめとするメタ企業の圧力に抵抗する中堅企業国家の経営者として、終末の星（Star of the End）計画への関与を通じて物語の転回点を担う。アルファ・ケインを戦士決定戦に推薦し、彼がZAMLTに対する反乱を主導する契機を作った。しかしZAMLTとEVILSの秘密会合の真相を追及した結果、ゼブラ・コーポレーションの工作員レイ・ヴァンデルトによってシェンドバーグ次元に閉じ込められ、殺害された。アレンの死はアルファ・ケインとテクロサスを結ぶ決定的な動機となり、ZAMLTに対する全面対決への道を開いた。中堅企業国家の代表者として、ZAMLTの覇権体制下で多数の企業国家が直面した絶望的な状況を体現する存在である。",
    era: "E318年前後",
    affiliation: "ストロベリー",
    tier: "歴史的人物",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/nebura.txt",
        label: "Alpha Cain & Celia Dominix's Story",
      },
    ],
  },

  /* 宇宙文明指導者 */
  {
    id: "大司教",
    name: "大司教",
    nameEn: "Archbishop",
    category: "キャラクター",
    subCategory: "宇宙勢力",
    description:
      "エレシュ文明圏の最高指導者であり、オラクル（大司教＋神官長）の議長を務める宗教的最高権威。オラクルの次元共鳴予言は極めて高い的中率を誇り、グランベルのアルゼン・カーリーン大統領やティエリアのグレイモンド・ハウザー総帥ですらその発言を無視できない存在。大司教は宗教指導者としてだけでなく、宇宙規模の政治的調停者としても機能しており、ティエリアとエレシオンの対立緩和やグランベルの経済的拡張への牽制など、軍事・経済とは異なるアプローチで宇宙の安定に寄与している。ファルージャのマドリス・カーネルとは古くから個人的な信頼関係にあり、文化的・精神的影響力を背景にした外交を展開している。大司教の任期は終身制であり、後継者はオラクルによる厳格な選考プロセスを経て決定される。その精神的影響力は、実質的にE16文明圏のAURALISとも思想的な共鳴を持つと指摘されている。",
    era: "現在（E528〜）",
    affiliation: "エレシュ",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },
  {
    id: "商工会議長",
    name: "商工会議長",
    nameEn: "Chamber of Commerce Chairman",
    category: "キャラクター",
    subCategory: "宇宙勢力",
    description:
      "プロキオ文明圏の最高指導者であり、全宇宙の貿易ルートと商業取引を統括する実力者。プロキオ・ネクサスを本拠地とし、コマース・ディヴィジョンを通じて宇宙最大の商業システムを管理している。商工会議長の経済的影響力は直接的であり、プロキオ・ネクサスでの価格設定が宇宙全体のベースライン価格を決定するため、その判断は全文明圏の経済に波及する。Lane Systemのオープンアーキテクチャ設計によりグランベルやエレシオンにもプロキオの物流インフラが統合されており、商工会議長の政策は宇宙規模の供給網に直結している。グランベルのアルゼン大統領とは経済分野で協調関係にあり、ティエリアへの軍事物資の物流管理も担っている。全宇宙の経済安定を維持する役割を自負し、紛争下でも商人の安全な通行を確保するための外交努力を惜しまない実務的な指導者として知られる。",
    era: "現在（E528〜）",
    affiliation: "プロキオ",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },
  {
    id: "通信長官",
    name: "通信長官",
    nameEn: "Communications Commissioner",
    category: "キャラクター",
    subCategory: "宇宙勢力",
    description:
      "ロースター文明圏の最高指導者であり、全宇宙の通信インフラと量子ネットワークの管理を統括する技術官僚のトップ。ロースター・コアの量子コンピューティングセンターを指揮し、Link Protocol（現在バージョン7.2）の開発と標準化を主導した。通信長官の管轄下でシグナル・オペレーションが数千の通信衛星を管理し、宇宙全域に1光年あたり0.3秒以下の通信遅延を実現している。ティエリアの防衛ネットワークとの接続やディオクレニスとのクアンタ・ラボ共同研究など、軍事・科学分野でも重要な役割を果たす。グランベルの量子経済システムやエレシオンの医療データネットワークもロースターの通信基盤に依存しており、通信長官の判断は宇宙全体の情報の流れを左右する。オープンイノベーションモデルの推進者であり、新技術を数ヶ月で全宇宙に展開する迅速な技術普及体制を構築した。次元不安定の早期警戒システムの構築も通信長官の業績の一つである。",
    era: "現在（E528〜）",
    affiliation: "ロースター",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },

  /* ZAMLT 企業リーダー */
  {
    id: "ラファエル・ドレイク",
    name: "ラファエル・ドレイク",
    nameEn: "Rafael Drake",
    category: "キャラクター",
    subCategory: "ZAMLT",
    description:
      "トロン・コーポレーションのCEOであり、ZAMLTを構成する5大超巨大企業のうちの一つを率いた指導者。旗艦「カリバーン」を指揮し、ZAMLTの宇宙軍事力の中核を担った。E318年のギガポリス解放戦においてアルファ・ケインによって打倒された。",
    era: "E301〜E318",
    affiliation: "トロン・コーポレーション / ZAMLT",
    tier: "歴史的人物",
  },
  {
    id: "アイリス・ノヴァ",
    name: "アイリス・ノヴァ",
    nameEn: "Iris Nova",
    category: "キャラクター",
    subCategory: "ZAMLT",
    description:
      "アロエオイル・コーポレーションのリーダーであり、次元エネルギー技術の専門家。nebura（星々の交響曲）の最終盤において、アルファ・ケインのチームと次元の荒野で決戦を繰り広げた。次元エネルギーの深い知識を持つ技術者としてZAMLTの次元兵器開発にも関与したとされる。",
    era: "E301〜E318",
    affiliation: "アロエオイル・コーポレーション / ZAMLT",
    tier: "歴史的人物",
  },
  {
    id: "カルロス・ヴァンダム",
    name: "カルロス・ヴァンダム",
    nameEn: "Carlos Vandam",
    category: "キャラクター",
    subCategory: "ZAMLT",
    description:
      "マモン・コーポレーションのリーダー。慎重な戦略家として知られ、ZAMLTの経済的基盤の強化に尽力した。プロトコルXの3京ドル資金計画を立案し、ZAMLTの覇権体制を財政面から支えた。その冷徹な計算高い手腕はZAMLT支配期の経済的二極化を加速させた一因とも評される。",
    era: "E301〜E318",
    affiliation: "マモン・コーポレーション / ZAMLT",
    tier: "歴史的人物",
  },
  {
    id: "アーサー・グリム",
    name: "アーサー・グリム",
    nameEn: "Arthur Grim",
    category: "キャラクター",
    subCategory: "ZAMLT",
    description:
      "ゼブラ・コーポレーションのリーダー。次元技術・次元兵器・次元刑務所の設計を独占する異常なまでの技術垄断体制を築き上げた。ゼブラ・コーポレーションはZAMLTの中で最も危険な企業と評され、アーサーの下で次元干渉技術の軍事転用が急速に進められた。工作員レイ・ヴァンデルトによるアレンの殺害も彼の指示によるものとされる。",
    era: "E301〜E318",
    affiliation: "ゼブラ・コーポレーション / ZAMLT",
    tier: "歴史的人物",
  },
  {
    id: "エリザベス・リンドバーグ",
    name: "エリザベス・リンドバーグ",
    nameEn: "Elizabeth Lindberg",
    category: "キャラクター",
    subCategory: "ZAMLT",
    description:
      "ルレンツ・コーポレーションのリーダー。プロトコルXの技術設計とカタリスト・コア建造を主導したZAMLTの技術的支柱。次元エネルギーの制御と増幅に関する最先端の研究を指揮し、ZAMLT本社最深部に建造された次元の塔とカタリスト・コアの実現に決定的な役割を果たした。",
    era: "E301〜E318",
    affiliation: "ルレンツ・コーポレーション / ZAMLT",
    tier: "歴史的人物",
  },
  {
    id: "レイ・ヴァンデルト",
    name: "レイ・ヴァンデルト",
    nameEn: "Ray Vandelte",
    category: "キャラクター",
    subCategory: "ZAMLT",
    description:
      "ゼブラ・コーポレーションの工作員。アーサー・グリムの指示のもと、ZAMLTとEVILSの秘密会合の真相を追及していた企業国家「ストロベリー」のCEOアレンをシェンドバーグ次元に閉じ込めて殺害した冷徹な実行部隊の要員。アレンの死はアルファ・ケインとテクロサスを結ぶ決定的な動機となり、ZAMLTに対する全面対決への道を開いた。",
    era: "E318年頃",
    affiliation: "ゼブラ・コーポレーション / ZAMLT",
    tier: "歴史的人物",
  },
  {
    id: "リンダ",
    name: "リンダ",
    nameEn: "Linda",
    category: "キャラクター",
    subCategory: "ZAMLT",
    description:
      "ルレンツ・コーポレーションの研究員。シルバープラント攻略戦において、プロトコルXのエネルギーコアの暴走を安定化させるため自らを犠牲にした悲劇の英雄。彼女の自己犠牲はアルファ・ケインにZAMLT打倒への決意を固めさせ、シャドウ・リベリオンの士気を大きく高めた。ルレンツ・コーポレーション内部でも反ZAMLT感情の広がる転換点となった。",
    era: "E318年",
    affiliation: "ルレンツ・コーポレーション / ZAMLT",
    tier: "歴史的人物",
  },

  /* テクロサス系譜 */
  {
    id: "クロノ・ヴァーレント",
    name: "クロノ・ヴァーレント",
    nameEn: "Chrono Valeint",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "テクロサスの指導者の一人。シルバープラント攻略戦でアルファ・ケインと共に戦い、ZAMLT打倒の軍事的支柱として重要な役割を果たした。テクロサス系譜（E15ファランクス〜E295三頭政治〜E470東方支隊〜現在のボグダス・ジャベリン）の中で中核的な役割を担った軍人であり、その軍事的伝統は現在のセバスチャン・ヴァレリウス率いるボグダス・ジャベリンに受け継がれている。",
    era: "E318年頃",
    affiliation: "テクロサス",
    tier: "歴史的人物",
  },

  /* 宇宙勢力（歴史） */
  {
    id: "オメガ＝ユリシス",
    name: "オメガ＝ユリシス",
    nameEn: "Omega=Ulysses",
    category: "キャラクター",
    subCategory: "宇宙勢力",
    description:
      "EVILS（超越的次元間生命体群）のリーダー。虚無の塔でZAMLT5社のトップと秘密会合を持ち、次元の塔を通じた取引を行った。次元の塔での最終決戦でアルファ・ケインと激突し、伴共役（Ban-Kyōyaku）能力によって次元の繊維に封印された。EVILSは通常の物理法則を超越した存在であり、オメガ＝ユリシスの封印はEDU宇宙論における次元干渉の限界と可能性を示す出来事として記録されている。",
    era: "E318年頃",
    affiliation: "EVILS",
    tier: "神格・歴史的人物（次元間存在）",
  },
]

/* ═══════════════════════════════════════════════════════════════
   WIKI DATA — TERMINOLOGY
   ═══════════════════════════════════════════════════════════════ */

const TERMINOLOGY: WikiEntry[] = [
  /* 宇宙・天文 */
  {
    id: "E16連星系",
    name: "E16連星系",
    nameEn: "E16 Binary System",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "M104銀河（ソンブレロ銀河）のハロー領域に位置する連星系で、シンフォニー・オブ・スターズをはじめとする居住可能惑星を擁するE16文明圏の母星系である。主星Ea16はスペクトル型F5の黄白色巨星で、伴星Eb16はスペクトル型M3の赤色矮星であり、両星の軌道共鳴によって安定したハビタブルゾーンが形成されている。連星系全体の年齢は約62億年と推定され、豊富な重元素を含むため惑星形成が活発だった。E16連星系は東暦以前から航行可能な距離にあり、初期入植船団が到達して以来、銀河ハローにおける最重要の交通・交易拠点として発展を遂げてきた。",
  },
  {
    id: "Ea16",
    name: "イーエー16",
    nameEn: "Ea16",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "E16連星系の主星で、スペクトル型F5の黄白色巨星。質量は1.2太陽質量で、表面温度は約6,500K、光度は太陽の約3.2倍に達する。シンフォニー・オブ・スターズを含む内側惑星群に安定した光熱を供給しており、そのハビタブルゾーンは地球型惑星の居住に最適な条件を備えている。伴星Eb16との平均軌道間距離は約120AUで、両星の重力相互作用が連星系内の小天体軌道を安定化させている。東暦初期の天文学者たちはEa16の安定性を星系入植の決定的根拠とした。",
  },
  {
    id: "Eb16",
    name: "イービー16",
    nameEn: "Eb16",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "E16連星系の伴星で、スペクトル型M3の赤色矮星。質量は0.4太陽質量、表面温度は約3,400Kであり、主星Ea16から平均約120AUの距離を公転している。Eb16自体のハビタブルゾーンは極めて狭いが、潮汐加熱を受ける可能性のある衛星系が存在すると推測されている。赤色矮星特有の長寿命（推定数千億年）により、主星が赤色巨星へ進化した後も連星系全体の重力バランスを維持する役割を果たすと予測されている。スライム危機期にはEb16の放射変動が搾取生物の遺伝子変異を誘発した可能性が指摘されている。",
  },
  {
    id: "シンフォニー・オブ・スターズ",
    name: "シンフォニー・オブ・スターズ",
    nameEn: "Symphony of Stars",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "E16連星系の中心惑星で、主星Ea16のハビタブルゾーン内に位置する人類殖民の母星。自転周期は44時間4分、表面重力は0.92Gと地球よりやや軽く、住民の身体特性や建築様式に独自の進化をもたらした。惑星表面の約68%が水で覆われ、4つの大陸と多数の島嶼からなる。東暦元年に最初の入植船団が到達して以来、クレセント大地方をはじめとする各大陸に文明が興隆し、バーズ帝国からUECOに至る星系統治の歴史の舞台となった。惑星名「シンフォニー・オブ・スターズ」は、初期入植者が Ea16とEb16の連星の光が大気で屈折して放つ万華鏡のような夜空に因んで名付けた。",
  },
  {
    id: "Eros-7",
    name: "エロス7",
    nameEn: "Eros-7",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "E16連星系外縁に位置する第7惑星。表面重力は1.1Gとやや強く、薄い酸素大気を持つため地表での活動には呼吸補助装置が必要な区域が多い。独特な生態系を持ち、とりわけ性的エネルギーを吸収する搾取生物の原生地として知られ、この生物群の制御不能な増殖がE380年からのスライム危機を引き起こす端緒となった。女性主導のマトリカル社会が形成されており、政治・経済・軍事の主要ポストの大部分を女性が占める。この社会的構造は搾取生物の脅威への適応として発展した側面もあり、女性の身体特性が搾取生物に対する耐性に優れているという生態学的仮説も存在する。Eros-7の植民地は星系全体において独自の文化圏を形成し、特に生命倫理と生殖技術の分野で先進的な研究成果を生み出している。",
  },
  {
    id: "惑星ビブリオ",
    name: "惑星ビブリオ",
    nameEn: "Planet Biblio",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "E16連星系内に位置する学術都市惑星で、星系最高の知的水準を誇る研究拠点である。惑星全体が学術機関と研究施設によって構成され、中でもロレンツィオ国際大学は次元極地平理論やApolonium物理学の研究拠点として名高い。惑星ビブリオにはA-Registryの最高等級記録館も置かれており、E16文明圏の全歴史文書と市民データのバックアップが保管されている。テクノ文化ルネサンス期には、ペルセポネ計画の理論的基盤がこの惑星の研究者たちによって構築された。常時数万人の研究者と学生が居住し、学術の自由と知識の共有を最高理念として掲げる特別自治区として運営されている。",
  },
  {
    id: "惑星Solaris",
    name: "惑星Solaris",
    nameEn: "Planet Solaris",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "Ninny Offenbachの原初個体が離脱した惑星として知られる。Offenbach種の集団意識が最初に自律的な個体を生み出した場所であり、個と集合体の分岐点としてE16文明圏の哲学・倫理学において極めて重要な意義を持つ。惑星自体は寒冷な岩石惑星で、地表の大部分が氷結したメタンと窒素の平原に覆われているが、地下深部にはOffenbach種の生態系を支える熱源が存在する。Solarisの名称は、原初個体が集団意識から離脱する際に放った光エネルギーの放出現象に由来する。この惑星の研究はOffenbach種の社会構造理解に不可欠であり、AURALIS第二世代の設立理念にも影響を与えた。",
  },
  {
    id: "M104銀河",
    name: "M104銀河",
    nameEn: "M104 Galaxy",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "M104銀河（ソンブレロ銀河）は、地球から約3,100万光年の距離に位置する棒渦巻銀河である。E16連星系はこの銀河のハロー領域外縁に位置し、銀河中心部の活発な星形成領域からは遠く離れた穏やかな環境にある。ソンブレロ銀河の名称は、地球側からの観測で銀河の塵の帯がメキシコのソンブレロ帽に似ていることに由来するが、E16連星系側から見た銀河の形状は全く異なる。銀河ハロー領域に位置するため、E16連星系は銀河中心の強烈な放射線から保護されており、文明の発展に適した環境を提供している。M104銀河内には他にも入植可能な星系が複数確認されているが、E16連星系の戦略的重要性と歴史的経緯から、他領域の本格的開発はUECO統合後まで遅れた。",
  },
  {
    id: "ノスタルジア・コロニー",
    name: "ノスタルジア・コロニー",
    nameEn: "Nostalgia Colony",
    category: "地理",
    subCategory: "宇宙・天文",
    description:
      "E16連星系外縁に建設された初期植民地の一つで、ミナ・エウレカの出生地として知られる。ノスタルジア・コロニーはE300年頃に建設され、初期入植者たちが地球の生活様式を懐かしみながら維持しようとしたことからこの名が付けられた。コロニーの建築様式や社会制度は地球の20世紀末〜21世紀初頭の文化を模倣しており、他の植民地とは異なるレトロな景観を持つ。E509年にアルファ・ヴェノムの急襲を受け、大規模な破壊と住民の犠牲を出した。この襲撃はミナ・エウレカの人生を決定的に変え、後に彼女がGenesis Vaultを通じて反ヴェノム活動の情報発信を行う動機となった。現在コロニーの一部は復興しているが、襲撃の痕跡は記念施設として保存されている。",
  },

  /* 歴史・時代 */
  {
    id: "東暦",
    name: "東暦（E暦）",
    nameEn: "Eastern Calendar (E Calendar)",
    category: "歴史",
    subCategory: "歴史・時代",
    description:
      "E1 = AD 3501から始まる暦法で、E16連星系への最初の入植船団が到着した年を元年としている。それ以前の地球暦（西暦）との換算式は E年 = AD年 - 3500 であり、東暦E500年は西暦4001年に相当する。暦法の名称「東暦」は、地球から見てM104銀河が東方向に位置することに由来し、入植者たちが故郷地球との精神的な繋がりを保ちつつ新たな文明の時間を刻むために制定した。E16連星系の自転周期（44時間4分）に合わせた独自の暦体系が併用されており、1東暦年は地球の約1.02年に相当する。東暦はバーズ帝国の設立、パクス・ロンバルディカ、スライム危機、テクノ文化ルネサンスなど、E16文明圏の全歴史的出来事を記述する基準となっている。",
  },
  {
    id: "バーズ帝国",
    name: "バーズ帝国",
    nameEn: "Birds Empire",
    category: "歴史",
    subCategory: "歴史・時代",
    description:
      "E15年からE61年まで続いたE16連星系初の包括的統一政権で、軍閥ファランクスによって樹立された。ファランクスは初期植民地間の紛争を武力によって終結させ、シンフォニー・オブ・スターズ全域にわたる法秩序とインフラを構築した。バーズ帝国は帝国という名称ながらも、初期の入植者自治の伝統をある程度尊重し、各省庁に相当する地方総督府制度を導入した。E61年、ファランクスの死後、後継者争いと各地の独立運動によって帝国は分裂し、複数の小規模国家群に解体された。しかし、帝国期に整備された通信ネットワークと航路標識は後のパクス・ロンバルディカ期の繁栄の基盤となり、A-Registryの初期原型もこの時期に構想された。バーズ帝国の崩壊はE16文明圏における「統一と分岐」の循環の最初の例として歴史家に注目されている。",
  },
  {
    id: "セリア黄金期",
    name: "セリア黄金期",
    nameEn: "Celia Golden Age",
    category: "歴史",
    subCategory: "歴史・時代",
    description:
      "E335年からE370年まで続いたE16文明圏の最盛期で、フェルミ音楽理論の完成、nトークン経済の確立、AURALIS第一世代の黄金時代を包含する。この時期、フェルミ音楽は単なる芸術形式を超えて、惑星間通信の符号化や医療治療への応用など社会的基盤技術として機能した。AURALISの「光と音を永遠にする」という理念は文明全体の文化規範となり、建築、服飾、都市計画に至るまで音響的調和が重視された。nトークン経済システムもこの時期に急速に普及し、物質的富だけでなく文化的貢献や知識の共有が経済的価値として評価される画期的な体制を構築した。しかし黄金期の過剰な楽観主義は内部の構造的矛盾を隠蔽しており、E370年以降、ZAMLTの台頭によってこの調和は急速に崩れていくことになる。",
  },
  {
    id: "パクス・ロンバルディカ",
    name: "パクス・ロンバルディカ",
    nameEn: "Pax Lombardica",
    category: "歴史",
    subCategory: "歴史・時代",
    description:
      "E205年からE278年まで続いたコーポラタムパブリカ（株式会社共和国）の全盛期で、E16連星系における企業統治モデルの最も成功した時代である。パクス・ロンバルディカという名称は「ロンバルディアの平和」を意味し、主要企業群が協調して統治を行うことで約70年にわたる長期安定を実現した。この時代、企業は利潤追求だけでなく、インフラ整備、教育、医療、宇宙探査などの公共サービスを担い、国家の役割を代替する画期的な統治体制を確立した。惑星ビブリオのロレンツィオ国際大学もこの時期に設立され、学術研究への大規模投資が行われた。しかし企業間の寡占化が進み、市民の政治参加権が制限される傾向が強まったこと、そして企業利益と公共利益の対立が深まったことが、最終的にZAMLTによる強硬な経済覇権への移行を招く要因となった。",
  },
  {
    id: "スライム危機",
    name: "スライム危機",
    nameEn: "Slime Crisis",
    category: "歴史",
    subCategory: "歴史・時代",
    description:
      "E380年からE400年まで約20年間続いた大規模災害で、Eros-7を原生地とする搾取生物の遺伝子変異によって引き起こされた。変異した搾取生物は従来の性的エネルギー吸収能力に加え、他の生命体の生体エネルギーをも吸収するようになり、感染力と増殖力が劇的に向上した。災害はEros-7から始まり、惑星間航行に乗ってシンフォニー・オブ・スターズや他の植民地に波及し、特に人口密集地域で壊滅的な被害をもたらした。ZAMLT期の経済優先政策によって生物災害対策が後回しにされていたことが被害拡大の要因とされ、この教訓は後にテクノ文化ルネサンス期の「技術の民主化」と「生態系との調和」という理念に強く反映された。スライム危機の収束にはEros-7のマトリカル社会が独自に開発した生物学的封じ込め技術が決定的な役割を果たし、この技術は後に医療や環境修復分野で広く応用されることになる。",
  },
  {
    id: "テクノ文化ルネサンス",
    name: "テクノ文化ルネサンス",
    nameEn: "Techno-Cultural Renaissance",
    category: "歴史",
    subCategory: "歴史・時代",
    description:
      "E475年からE500年まで続いた文化・技術の飛躍期で、次元極地平技術の民用化と多文明融合が進んだ画期的な時代である。スライム危機の教訓から、従来は軍事・企業エリートに限定されていた次元極地平技術が一般市民にも開放され、空間ホールを通じた惑星間移動が日常化した。これによりE16連星系内の各地域間交流が爆発的に増加し、異なる植民地の文化が融合する新しい芸術・音楽・哲学が花開いた。テクノ文化ルネサンスはAURALIS第二世代の設立（E522年）を準備する文化的土壌となり、フェルミ音楽の現代的再解釈やOffenbach種との協創芸術などが生まれた。また、ペルセポネ計画の初期構想もこの時期に生み出され、次元ピラミッド理論の基礎研究が惑星ビブリオで開始された。",
  },
  {
    id: "企業国家",
    name: "企業国家",
    nameEn: "Corporate State",
    category: "用語",
    subCategory: "歴史・時代",
    description:
      "E16連星系の歴史的統治体制で、国家そのものが企業として機能する政治形態。東暦初期の入植期からパクス・ロンバルディカ期（E205〜E278）にかけて最盛期を迎え、20万以上の企業国家がGigapolis全域で競合した。各企業国家は独自の軍備・法体系・市民管理を持ち、経済力こそが唯一の権力基盤だった。コーポラタムパブリカ（株式会社共和国）はその頂点に立つ企業国家連合体で、14兆ドルのGDPを誇り、企業国家体制の最も成功した例として歴史に残る。E150年のエル・フォルハウスによるマーストリヒト革命で体制が揺らぎ始め、ZAMLTの台頭（E301年）により企業国家間の覇権争いは5超巨大企業への集約によって終焉を迎えた。しかしZAMLT崩壊後も、A-Registryの階級制度やnトークン経済という遺産はE16文明圏に深く根を下ろし、現在のUECOや銀河系コンソーシアムの枠組みにも影響を与え続けている。企業国家時代の競争原理は、現在もグランベルの経済覇争やクレセント地方の勢力ゲームの基層構造として息づいている。",
  },

  /* 組織・制度 */
  {
    id: "AURALIS",
    name: "オーラリス・コレクティブ",
    nameEn: "AURALIS Collective",
    category: "組織",
    subCategory: "組織・制度",
    description:
      "「光と音を永遠にする」を理念とする音楽・文化集団で、E16文明圏の精神的支柱として機能してきた。第一世代はE290年頃に設立され、セリア黄金期（E335〜E370年）にその影響力の頂点に達した。初代Kate Claudiaや初代Lily Steinerら伝説的なメンバーの「名」は、名の継承制度を通じて後世に受け継がれている。第一世代はZAMLTの台頭とスライム危機を経て活動を縮小したが、テクノ文化ルネサンス期に培われた文化的気運を受け、E522年に第二世代として復活を果たした。第二世代はフェルミ音楽の現代的展開だけでなく、次元極地平技術を活用した空間芸術やOffenbach種との共創活動など、従来の枠を超える表現活動を展開している。AURALISは単なる芸術団体ではなく、E16文明圏における文化的アイデンティティの維持と進化を担う最重要機関として位置づけられている。",
  },
  {
    id: "ZAMLT",
    name: "ザムルト",
    nameEn: "ZAMLT",
    category: "組織",
    subCategory: "組織・制度",
    description:
      "E301年からE318年まで活動した5超巨大企業国家の統合体で、E16連星系の経済を事実上支配したメタ企業体である。ZAMLTは「万能絶対的経済統合体（Zealous Absolute MegaLogic Trust）」の略称であり、5つの超巨大企業――テスラ重工業連合、量子ファイナンス・コントロール、グローバル・メディア・コングロマリット、A-Registry運営委員会、インフラストラクチャー・アライアンス――の連合体として設立された。各企業の量子ファイナンス・コアを接続することで、E16連星系全域の金融取引をリアルタイムで制御する画期的な経済システムを構築した。しかし経済効率の極端な追求は社会の二極化を招き、A-Registryの階級格差を固定化する結果となった。ZAMLTはGigapolisにおける20万以上の企業国家の覇権争いの最終的な勝者として台頭した存在であり、それまでの企業国家体制（コーポラタムパブリカ）が構築してきた自由経済の秩序を、極めて少数の巨大企業による中央集権的支配に置き換えた。この転換はエル・フォルハウスのマーストリヒト革命（E150年）からアルファ・ケインのギガポリス解放戦（E318年）に至る長い抵抗運動の直接の標的となった。ZAMLT支配下の低階層市民は深刻な貧困と権利制限に苦しみ、シャドウ・リベリオンなどの反乱組織が地下で形成される原因となった。E318年の崩壊は内部的腐敗とシャドウ・リベリオンによる反乱の複合結果であり、ZAMLTの経済的遺産はその後もnトークンシステムやUECOの経済框架に長く影響を残した。ZAMLT崩壊後、その組織の残党の一部はシルバー・ヴェノムの母体となったという説があり、地下組織の歴史的経緯を研究する上で重要な鍵となっている。",
  },
  {
    id: "ネオクラン同盟",
    name: "ネオクラン同盟",
    nameEn: "Neoclan Alliance",
    category: "組織",
    subCategory: "組織・制度",
    description:
      "分散統治モデルを推進する国家同盟で、各構成国が主権を維持しつつ共通の外交・防衛・通商政策を協調する連合体制を採っている。ネオクラン同盟はZAMLTの中央集権的支配への反動として生まれ、地方自治権の強化と市民参加型政治の復興を掲げた。UECO統合後は銀河系コンソーシアムの中核構成体として機能し、分散統治の実践モデルとして他の星系にも影響を与えている。同盟の主要政策には次元極地平技術の平等な配分、nトークン経済の透明性向上、A-Registryの階級制度の段階的緩和などが含まれる。ネオクラン同盟の理念はテクノ文化ルネサンス期の「技術の民主化」という精神を政治制度に具体化したものであり、E16文明圏における最も持続可能な統治モデルの一つと評価されている。同盟の初代代表にはZAMLT崩壊後の民主化運動の指導者複数名が共同で就任し、分散統治モデルの基盤を築いた。",
  },
  {
    id: "UECO",
    name: "ユーエコー",
    nameEn: "UECO",
    category: "組織",
    subCategory: "組織・制度",
    description:
      "星間経済協同組合（United Economic Cooperative）で、E16連星系および周辺星系の経済活動を調整する超国家的機関である。UECOはZAMLT崩壊後の経済的混乱を収束させるために設立され、nトークン経済システムの再構築と公正な資源配分を実現した。最大の特徴はヒーローエージェンシーとの統合であり、経済協同組合という枠組みの中に防衛・救助・治安維持の機能を組み込んだ独自の組織体制を持つ。これにより経済活動と安全保障を有機的に連携させ、純粋な軍事同盟ではない新しい形態の星系ガバナンスを実現している。UECOはパクス・ロンバルディカの企業統治とZAMLTの経済覇権の両方の教訓を踏まえ、経済効率と社会的公正のバランスを追求する第三の道として設計された。ネオクラン同盟の理念もUECOの框架の中で実現されている。UECOの初代議長にはテクノ文化ルネサンス期の指導者の一人が就任したとされ、E495〜E500年の銀河系コンソーシアム設立への移行期を主導した。歴代指導者の詳細な記録は惑星ビブリオに保管されている。",
  },
  {
    id: "シャドウ・リベリオン",
    name: "シャドウ・リベリオン",
    nameEn: "Shadow Rebellion",
    category: "組織",
    subCategory: "組織・制度",
    description:
      "ZAMLT支配期（E301〜E318年）に結成された低階層市民の反乱組織で、A-Registryの下層階級（Z40以下）を中心とした地下抵抗運動である。ZAMLTの量子ファイナンス・コアによる経済支配に対抗するため、独自の代替通貨システムと暗号通信網を構築した。シャドウ・リベリオンの活動は主にサボタージュと情報戦に限定され、大規模な武力闘争は回避した。この戦略はZAMLTの崩壊後、ネオクラン同盟設立の思想的基盤として評価されている。シャドウ・リベリオンの残党の一部は後にシルバー・ヴェノムの母体となったという説もあり、抵抗運動の過激派と穏健派の分岐がE16文明圏のその後の対立構造に影響を与えたと指摘されている。",
  },
  {
    id: "A-Registry",
    name: "A-Registry（A籍）",
    nameEn: "A-Registry",
    category: "組織",
    subCategory: "組織・制度",
    description:
      "E16連星系の市民身分証明・階級制度で、旅券機能と社会的地位の指標を兼ね備えた包括的な管理システムである。Z1（最高位）からZ50（最低位）までの階級があり、各階級は居住区域のアクセス権、nトークンの取引限度額、公的サービスの利用範囲などを規定する。A-Registryはバーズ帝国期にその原型が構想され、パクス・ロンバルディカ期に企業の従業員管理システムとして整備された後、ZAMLT期に社会階級の固定化装置として悪用された。ZAMLT崩壊後、ネオクラン同盟とUECOの下で階級制度の緩和が進められ、Z50に近い低階層市民の権利向上が図られている。しかし階級間の格差は完全には解消されておらず、A-Registryの改革はE16文明圏の最重要の政治課題の一つとして議論が続いている。惑星ビブリオには全市民データのバックアップが保管されている。",
  },
  {
    id: "nトークン",
    name: "nトークン",
    nameEn: "n-Token",
    category: "組織",
    subCategory: "組織・制度",
    description:
      "E16連星系の基軸通貨で、セリア黄金期に確立され、現在もUECOの管轄下で運用されている。nトークンの最大の特徴は、物質的資産だけでなく文化的貢献、知識の共有、芸術的創造活動なども経済的価値として評価・換金できる点にある。この仕組みはセリア黄金期のAURALISの理念と深く結びついており、フェルミ音楽の演奏や次元極地平技術の研究などもnトークンで報酬を受け取ることができる。ZAMLT期にはnトークンの集中化が進み経済的不平等を拡大したが、UECO統合後は分散型台帳技術の導入により透明性と公平性が向上した。nトークンの交換レートは惑星ビブリオのロレンツィオ国際大学が算出する「文化・知識指数」を基準に定期調整されており、E16文明圏独自の価値観を反映した経済システムとして他星系からも注目されている。",
  },

  /* クレセント地方 */
  {
    id: "クレセント大地方",
    name: "クレセント大地方",
    nameEn: "Crescent Region",
    category: "地理",
    subCategory: "クレセント地方",
    description:
      "シンフォニー・オブ・スターズの東大陸に位置する広大な地域で、E16連星系における政治・経済・軍事の最重要拠点の一つである。クレセント大地方にはヴァーミリオン、ブルーローズ、ミエルテンガ、クロセヴィア、SSレンジ、アイアン・シンジケート、SUDOM、ファティマ連邦、スターク三国など、複数の国家と勢力が混在しており、複雑な国際関係を形成している。地名は大陸の三日月のような弧状の地形に由来する。東暦初期の入植以来、豊かな資源と戦略的な位置により争奪の的となってきた歴史を持つ。テクノ文化ルネサンス期以降、空間ホールによる他地域との交通が整備されたことで経済的重要性はさらに増大し、V7やトリニティ・アライアンスなどの軍事同盟の舞台となっている。クレセント大地方の国家間の緊張と協力のバランスは、E16連星系全体の安定に直結すると言われている。",
  },
  {
    id: "ヴァーミリオン",
    name: "ヴァーミリオン",
    nameEn: "Vermillion",
    category: "地理",
    subCategory: "クレセント地方",
    description:
      "ドミニオン・ヴァーミリオンとして知られるクレセント大地方の有力国家で、アイリスの母国である。歴史的にセリア黄金期の文化的遺産を色濃く受け継いでおり、フェルミ音楽の伝統的な演奏形式やAURALISの哲学を国家の文化的基盤としている。ヴァーミリオンは豊かな鉱物資源と農業生産力を背景に経済的な繁栄を誇り、クレセント地方における旧来の秩序を代表する存在である。しかしエヴァトロンの介入による支配時代を経て、国家のアイデンティティと主権回復をめぐる葛藤が続いている。トリニティ・アライアンスの結成メンバーとして軍事的にも重要な役割を果たしており、クレセント地方の地政学的均衡の要として機能している。赤色を基調とした国旗と国家建築は、ヴァーミリオン（朱色）の名に由来する。",
  },
  {
    id: "ブルーローズ",
    name: "ブルーローズ",
    nameEn: "Blue Rose",
    category: "地理",
    subCategory: "クレセント地方",
    description:
      "フィオナが統率するクレセント地方の国家で、V7（Vital Seven）連合の中心的な役割を果たしている。ブルーローズはテクノ文化ルネサンス期の理念を最も純粋に受け継いだ国家と評され、次元極地平技術の研究開発と文化的な開放性を国家的特色としている。フィオナのリーダーシップの下、V7の設立（E515年）を主導し、クレセント地方の7カ国連合の枠組みを構築した。国家名はブルーローズ（青い薔薇）に由来し、不可能とされていた空間技術の民用化を実現した象徴としてこの名が選ばれた。多国籍の研究者や芸術家を受け入れる開放的な政策により、クレセント地方における文化・技術のハブとして機能している。アルファ・ヴェノムやシルバー・ヴェノムの脅威に対してはV7を通じて集団防衛の姿勢をとっている。",
  },
  {
    id: "ミエルテンガ",
    name: "ミエルテンガ",
    nameEn: "Mielteunga",
    category: "地理",
    subCategory: "クレセント地方",
    description:
      "マリーナ・ボビンが総統を務めるクレセント地方の国家で、軍事力と産業基盤に強みを持つ。ミエルテンガはスライム危機後の復興期に急速に発展し、搾取生物対策のために構築された生物工学産業が国家経済の中核となっている。マリーナ・ボビンの強力なリーダーシップの下、国家全体が効率的な統治体制を築き上げ、クレセント地方における軍事的影響力を拡大してきた。トリニティ・アライアンスの結成メンバーとしてヴァーミリオンやボグダス・ジャベリンと軍事同盟を結んでおり、V7に対抗する勢力の中心として機能している。ミエルテンガの軍事技術はEros-7のマトリカル社会が開発した生物学的技術を応用した独自のもので、他国には公開されていない機密が多い。国家の名前は古い入植者の母語に由来すると言われるが、詳細は不明である。",
  },
  {
    id: "クロセヴィア",
    name: "クロセヴィア",
    nameEn: "Crosevia",
    category: "地理",
    subCategory: "クレセント地方",
    description:
      "カスチーナ・テンペストが首脳を務めるクレセント地方の国家で、気象制御技術と環境工学に特化した先進的な国家である。クロセヴィアはシンフォニー・オブ・スターズ特有の複雑な気象システムを制御する技術を長年研究してきており、この技術は農業生産の安定化や自然災害の防止に大きく貢献している。カスチーナ・テンペストは「テンペスト（嵐）」の名にふさわしく、気象操作を戦略的資源として活用する外交手腕で知られる。クロセヴィアはV7の加盟国でありながら、トリニティ・アライアンスとの関係構築にも努めるなど、柔軟な外交姿勢を維持している。国家の主要輸出品には気象制御装置と環境モニタリングシステムがあり、E16連星系内の他の植民地にも広く輸出されている。",
  },
  {
    id: "SSレンジ",
    name: "SSレンジ",
    nameEn: "SS Range",
    category: "地理",
    subCategory: "クレセント地方",
    description:
      "アイク・ロペスが首脳を務めるクレセント地方の国家で、情報通信技術とサイバーセキュリティ分野においてE16連星系随一の技術力を誇る。SSレンジ（Super Signal Range）の名称は、同国が開発した超長距離量子通信システムに由来し、この技術はE16連星系内の全惑星間通信インフラの基盤となっている。アイク・ロペスは元情報技術者であり、国家経営にもデータ駆動型の手法を導入して行政効率の最大化を図っている。SSレンジはV7の加盟国で、主に情報戦と通信インフラの防衛を担当している。空間ホールの安定化制御にもSSレンジの通信技術が不可欠であり、テクノ文化ルネサンス期の技術開放政策を技術面から支えた立役者でもある。国家の人口は比較的少ないが、高密度な都市部に知的労働者が集中する独特の社会構造を持つ。",
  },
  {
    id: "アイアン・シンジケート",
    name: "アイアン・シンジケート",
    nameEn: "Iron Syndicate",
    category: "地理",
    subCategory: "クレセント地方",
    description:
      "レイド・カキザキが首脳を務めるクレセント地方の国家で、重工業と資源採掘を基盤とする強力な経済国家である。アイアン・シンジケート（鉄のシンジケート）の名称通り、国家経済の大部分を金属資源の採掘・精錬・加工産業が占めており、シンフォニー・オブ・スターズの建設資材の大部分を供給している。レイド・カキザキは実業家出身の首脳で、企業家的な手法で国家を統治し、他国との貿易を通じて経済的影響力を拡大している。アイアン・シンジケートはV7の加盟国であり、軍事装備の製造も担うことから防衛面でも重要な役割を果たしている。国家の工業地帯は昼夜を問わず稼働し、特徴的な赤い煙を上げる精錬所の風景はクレセント地方の象徴的な光景の一つとなっている。環境問題に対する批判も存在するが、近年はテクノ文化ルネサンス期の技術を応用したクリーン生産への転換が進められている。",
  },
  {
    id: "SUDOM",
    name: "スードム",
    nameEn: "SUDOM",
    category: "地理",
    subCategory: "クレセント地方",
    description:
      "クレセント大地方に位置する国家で、独自の文化的アイデンティティと高度な医療技術で知られる。SUDOMは東暦初期の入植計画において、特定の医療研究目的で設立された特別植民地を起源に持つ。この歴史的経緯から、国家は遺伝子医療、再生医療、神経科学の分野でE16文明圏の最先端を走っており、特にスライム危機以降の搾取生物対策医療において多大な貢献を果たした。SUDOMはV7の加盟国であり、同盟の医療支援と疫学調査を担当している。またnトークン経済において、医療サービスの提供が高く評価される仕組みを確立しており、他国の医療制度にも影響を与えている。国家名の由来は入植初期の研究コードに基づくと言われるが、公式な語源は明らかにされていない。",
  },
  {
    id: "ファティマ連邦",
    name: "ファティマ連邦",
    nameEn: "Fatima Federation",
    category: "地理",
    subCategory: "クレセント地方",
    description:
      "クレセント大地方に位置する連邦制国家で、複数の自治州が緩やかな連合を形成している。ファティマ連邦は宗教的・哲学的自由を重んじる文化で知られ、E16文明圏における多元的な思想交流の拠点として機能している。連邦を構成する各自治州は独自の法体系と教育制度を持ち、連邦政府は外交と防衛のみを管轄する最小限の統治構造を採用している。この分散型の統治モデルはネオクラン同盟の理念と共鳴し、ファティマ連邦は同盟の熱心な支持者である。また、フェルミ音楽の精神論的な側面を深く研究する学派があり、AURALISのメンバーも多数輩出している。ファティマ連邦はV7には加盟していないが、非同盟中立の立場を取りながらもクレセント地方の平和維持に積極的に関与している。",
  },
  {
    id: "スターク三国",
    name: "スターク三国",
    nameEn: "Stark Triad Nations",
    category: "地理",
    subCategory: "クレセント地方",
    description:
      "クレセント大地方の北部に位置する三つの国家からなる国家群で、歴史的に強固な相互防衛同盟を維持している。スターク三国の名称は「厳格な（stark）」外交姿勢に由来し、他の勢力への依存を避け、自立的な安全保障体制を維持することを国家理念としている。三国はそれぞれ軍事、経済、外交に特化しており、相互補完的な関係で連合の強靭性を確保している。V7やトリニティ・アライアンスのいずれにも属さない独自の立場を維持し、クレセント地方における第三勢力としての役割を果たしている。スターク三国の軍事力は質量ともに高く評価されており、その中立的な立場からクレセント地方の紛争調停において重要な役割を担うことが多い。東暦初期のバーズ帝国崩壊後に三国の原型が形成され、長い歴史の中で独特の連合文化を育んできた。",
  },

  /* 軍事・対立組織 */
  {
    id: "シルバー・ヴェノム",
    name: "シルバー・ヴェノム",
    nameEn: "Silver Venom",
    category: "組織",
    subCategory: "軍事・対立組織",
    description:
      "E475年、エヴァトロンのΣ-Unit残党から独立して結成された暗黒組織で、E16文明圏における最大の脅威勢力の一つである。エヴァトロン崩壊後に解体されたはずのΣ-Unitの極秘技術と人材を継承し、テクノ文化ルネサンス期の技術開放に乗じて急速に戦力を拡大した。シルバー・ヴェノムは従来の軍事組織とは異なり、次元極地平技術を武器化した「空間干渉攻撃」を得意とし、空間ホールを通じた奇襲戦術でE16連星系の各地を混乱に陥れた。組織名の「ヴェノム（毒）」は、社会の構造的矛盾を暴露し、文明を内側から腐食させるという彼らの思想に由来する。シャドウ・リベリオンの過激派が母体との説が有力で、ZAMLT期に培われた地下活動のノウハウが組織の強靭さに貢献している。後にアルファ・ヴェノムとゴールデン・ヴェノムに分裂したが、その思想的影響はE16文明圏全体に長く残ることになる。",
  },
  {
    id: "アルファ・ヴェノム",
    name: "アルファ・ヴェノム",
    nameEn: "Alpha Venom",
    category: "組織",
    subCategory: "軍事・対立組織",
    description:
      "シルバー・ヴェノムの後継組織で、イズミがリーダーを務めるE16文明圏最大の対立勢力である。シルバー・ヴェノムの内部抗争と路線対立を経て誕生し、より攻撃的で急進的な行動方針を採用している。アルファ・ヴェノムの最大の特徴は、次元極地平技術を用いた大規模な空間攻撃と、洗脳・精神操作を組み合わせた心理戦の二面作戦である。E509年にはノスタルジア・コロニーへの壊滅的な攻撃を実行し、ミナ・エウレカの人生を根本から変える出来事となった。イズミのカリスマ的指導の下、アルファ・ヴェノムはV7とトリニティ・アライアンスの両方と敵対し、クレセント大地方全体を巻き込む大規模な軍事衝突を引き起こしている。組織の最終的な目的はE16連星系の既存秩序の完全な破壊と再構築であるとされ、その思想はシャドウ・リベリオン以来の反体制運動の系譜を最も極端な形で体現している。",
  },
  {
    id: "ゴールデン・ヴェノム",
    name: "ゴールデン・ヴェノム",
    nameEn: "Golden Venom",
    category: "組織",
    subCategory: "軍事・対立組織",
    description:
      "シルバー・ヴェノムの分派組織で、本流との路線対立から独立した勢力である。ゴールデン・ヴェノムはアルファ・ヴェノムの急進的な武力路線に反対し、代わりにnトークン経済システムへの浸透と金融操作による支配を志向した。この手法は皮肉にもZAMLTの戦略を模倣するものであり、経済的支配を通じて社会を変革しようとするアプローチを採っている。ゴールデン・ヴェノムの名称は、nトークン（金色的な輝きを持つ暗号資産）への執着に由来する。組織は表向きは合法的な企業活動を通じて資金を蓄積し、A-Registryのシステムに潜入して市民データの改ざんや監視を行っていると疑われている。アルファ・ヴェノムとは敵対関係にあるが、時折両者は共通の敵に対して一時的な協力関係を結ぶこともあり、E16文明圏の安全保障を複雑化させる要因となっている。",
  },
  {
    id: "ボグダス・ジャベリン",
    name: "ボグダス・ジャベリン",
    nameEn: "Bogdas Javelin",
    category: "組織",
    subCategory: "軍事・対立組織",
    description:
      "セバスチャン・ヴァレリウス率いる軍事組織で、テクロサス系譜に属する古参の戦闘集団である。テクロサスはE16文明圏の初期入植時代から続く武術・戦闘技術の流派であり、ボグダス・ジャベリンはその系譜を受け継ぐ最も強力な軍事組織として知られる。セバスチャン・ヴァレリウスは卓越した戦術家であり、次元極地平技術を戦闘に応用した独自の戦闘体系を開発した。ボグダス・ジャベリン（槍）の名称は、組織が重装甲の精密打撃部隊として機能することに由来し、特定目標に対する迅速かつ壊滅的な攻撃を得意とする。トリニティ・アライアンスの結成メンバーとしてヴァーミリオンとミエルテンガと軍事同盟を結んでおり、V7との対抗軸の主力戦力として機能している。テクロサス系譜の戦士たちはA-Registryの階級制度に縛られない独自の階位を持つ。",
  },
  {
    id: "V7",
    name: "V7（Vital Seven）",
    nameEn: "V7 (Vital Seven)",
    category: "組織",
    subCategory: "軍事・対立組織",
    description:
      "クレセント地方の7カ国連合で、E515年にフィオナの主導で設立された軍事・経済同盟である。正式名称はVital Seven（命の七）であり、クレセント大地方の平和と安定を維持することを目的としている。加盟国はブルーローズ（中心国）、ヴァーミリオンを除く主要国から構成され、集団安全保障体制を通じてアルファ・ヴェノムやシルバー・ヴェノムの脅威に対処している。V7の最大の特徴は、単なる軍事同盟ではなく、加盟国間の技術共有、nトークンの相互補助、空間ホールの共同管理など、包括的な協力框架を持つ点である。テクノ文化ルネサンスの理念を共用財産として守るという思想的基盤があり、AURALIS第二世代とも密接な連携を維持している。トリニティ・アライアンスとの対立はクレセント地方を二分する最大の地政学的緊張の源泉となっている。",
  },
  {
    id: "トリニティ・アライアンス",
    name: "トリニティ・アライアンス",
    nameEn: "Trinity Alliance",
    category: "組織",
    subCategory: "軍事・対立組織",
    description:
      "ヴァーミリオン・ミエルテンガ・ボグダス・ジャベリンの3勢力による軍事同盟で、E520年に結成された。トリニティ（三位一体）の名称は、三勢力が等しい立場で連合を構成していることに由来する。トリニティ・アライアンスはV7に対抗する目的で設立され、クレセント地方における二極対立の構造を決定づけた。ヴァーミリオンが文化的・歴史的正当性を、ミエルテンガが軍事力と産業基盤を、ボグダス・ジャベリンがテクロサス系譜の戦闘技術をそれぞれ提供し、三勢力の相互補完関係で同盟の戦力は極めて強力である。V7がテクノ文化ルネサンスの理念を重視するのに対し、トリニティ・アライアンスはセリア黄金期の伝統的価値観と実力主義を重んじる傾向がある。両陣営の対立は時折武力衝突に発展するが、UECOの仲介によって全面戦争は回避されてきた。アルファ・ヴェノムの脅威に対してはV7とトリニティ・アライアンスが一時的に協力することもある。",
  },

  /* 技術・概念 */
  {
    id: "次元極地平",
    name: "次元極地平",
    nameEn: "Dimension Horizon",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "ブラックホールの事象の地平面近傍で観測される特異な物理現象を応用した高次元空間アクセス技術で、E16文明圏における最も重要な基盤技術の一つである。次元極地平技術により、三次元空間の制約を超えた移動と通信が可能となり、空間ホール（安定した次元間ポータル）の構築を支える理論的根幹となっている。本来は惑星ビブリオのロレンツィオ国際大学で純粋物理学の研究として始まったが、その軍事的・商業的価値が認識されるとZAMLT期には国家機密として独占された。テクノ文化ルネサンス期に技術の民用化が進み、一般市民も空間ホールを通じた惑星間移動を利用できるようになった。しかしシルバー・ヴェノムやアルファ・ヴェノムによる次元極地平技術の武器化が深刻な問題となっており、技術の二面性がE16文明圏の最大のジレンマとなっている。次元ピラミッド理論は次元極地平技術の体系化された理論框架である。",
  },
  {
    id: "ペルセポネ",
    name: "ペルセポネ",
    nameEn: "Persephone",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "ティムール・シャーが設計した仮想多元宇宙（Virtual Multiverse）で、多次元的な情報空間を構築する革新的なプロジェクトである。ペルセポネは次元極地平技術とApolonium物理学を組み合わせて構築され、物理法則が異なる複数の仮想領域を同時に実行・接続することができる。プライマリー・フィールドとして再構築された現在のペルセポネは、E16文明圏の研究・教育・シミュレーションに不可欠な基盤施設として機能している。ペルセポネ内では物理的に不可能な実験や歴史の再現が可能であり、惑星ビブリオの研究者たちはこの仮想空間を活用して次元極地平技術の安全なテストを行っている。リミナル・フォージによる時相放送プロジェクトもペルセポネの基盤技術に依存しており、E16文明圏における情報科学の最高峰を体現している。名称はギリシャ神話の冥界の女王ペルセポネに由来し、現実と仮想の境界を統治するという意味が込められている。",
  },
  {
    id: "リミナル・フォージ",
    name: "リミナル・フォージ",
    nameEn: "Liminal Forge",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "E525年に設立された最先端の研究プロジェクトで、Apolonium元素の特性と次元極地平技術を組み合わせた「時相放送（Temporal Broadcasting）」を目的としている。Apoloniumは時間的安定性を特徴とする超重元素であり、この元素を媒介にすることで情報を時間軸に沿って送信・受信する理論を実証しようとしている。リミナル・フォージの名称は「閾（いき）の鍛冶場」を意味し、現実と仮想の境界領域で新しい現実を鍛え出すというプロジェクトの哲学を表現している。ペルセポネの仮想多元宇宙を基盤技術として活用し、惑星ビブリオの研究チームと連携して開発が進められている。時相放送が実現すれば、歴史の検証、未来の予測、そして次元ピラミッドの各層間の同期通信が可能となり、E16文明圏の科学技術に革命をもたらすと期待されている。プロジェクトの倫理的側面については、A-Registryを通じた市民監視委員会が設けられている。",
  },
  {
    id: "Genesis_Vault",
    name: "ジェネシス・ヴォールト",
    nameEn: "Genesis Vault",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "ミナ・エウレカが運営するブログで、2,000本を超える記事が掲載されているE16文明圏最大級の個人メディアである。ミナ・エウレカはE509年のノスタルジア・コロニー襲撃の生存者で、この経験を動機に反ヴェノム活動の情報発信を始めた。Genesis Vault（起源の金庫）という名称は、E16文明圏の真実の記録を未来に継承するという使命に由来する。記事の内容はアルファ・ヴェノムやシルバー・ヴェノムの活動記録、クレセント地方の政治情勢分析、次元極地平技術の市民的利用に関する考察など多岐にわたる。nトークン経済において高く評価されるコンテンツ制作活動の一例として、UECOもGenesis Vaultを市民ジャーナリズムのモデルケースとして紹介している。ミナ・エウレカの活動はA-Registryの階級制度の問題やUECOのガバナンスの課題も鋭く指摘しており、E16文明圏の言論の自由と表現の重要な担い手となっている。",
  },
  {
    id: "空間ホール",
    name: "空間ホール",
    nameEn: "Space Hole",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "次元極地平技術を応用して構築された安定した次元間ポータルで、E16連星系内の惑星間移動を可能にする交通インフラの核心である。空間ホールはペルセポネ内の仮想座標系と物理空間の座標系を接続することで、物理的に隔てられた二点間をほぼ瞬時に結ぶ。テクノ文化ルネサンス期以前は軍事・企業エリートのみが利用できる限定された技術だったが、技術の民主化に伴い一般市民も利用可能となり、E16連星系内の社会的・経済的統合を劇的に進展させた。空間ホールの安定性はSSレンジの通信技術によって制御されており、過度な利用は時空間の歪みを蓄積するリスクがあるため、UECOの管理下で利用量が規制されている。シルバー・ヴェノムやアルファ・ヴェノムは空間ホールを軍事的に利用し、奇襲攻撃や撤退に活用している。空間ホールの安全性とアクセスの公平性は、E16文明圏における最重要の公共政策の一つである。",
  },
  {
    id: "次元ピラミッド",
    name: "次元ピラミッド",
    nameEn: "Dimension Pyramid",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "E16文明圏の多元的次元構造を記述する理論模型で、4層の階層構造からなる。最上位のTier Ω（オメガ）は高次元情報領域で、物理法則を超越した純粋な情報場とされる。Tier Σ（シグマ）はペルセポネ仮想多元宇宙が存在する層で、仮想現実と現実の境界領域である。Tier Ε（エプシロン）はE16連星系が存在する物理宇宙層で、我々が日常的に認識する現実世界に相当する。最下層のTier Δ（デルタ）は地球AD2026年の時間帯に対応する過去の情報層であり、地球とE16連星系の歴史的接点を示している。次元ピラミッド理論は惑星ビブリオの研究者たちによって体系化され、リミナル・フォージの時相放送プロジェクトの理論的基盤となっている。各層間の情報の流れと相互作用を理解することは、E16文明圏が直面する次元極地平技術のリスク管理に不可欠である。",
  },
  {
    id: "搾取生物",
    name: "搾取生物",
    nameEn: "Squeezing Organisms",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "Eros-7を原生地とする特殊な生物群で、他の生命体から性的エネルギーを吸収して生存・増殖する生態的特徴を持つ。搾取生物の原種はEros-7の独自の生態系の中で自然進化したものであり、通常状态下では他種との接触を避ける習性を持つ穏やかな生物であった。しかしE380年頃に発生した遺伝子変異により、一部の個体が攻撃性を獲得し、他の生命体の生体エネルギーをも吸収する能力を身につけた。この変異種の爆発的な増殖がスライム危機を引き起こし、E16連星系全体に大規模な被害をもたらした。搾取生物の生態学研究はEros-7のマトリカル社会によって最も進んでおり、彼女たちが独自に開発した生物学的封じ込め技術が危機収束の鍵となった。現在、搾取生物の制御はEros-7の特別管理下に置かれており、その研究から生まれた医療技術は再生医療や生体エネルギー工学に応用されている。SUDOMなどの国家も搾取生物関連の医療研究に注力しており、この生物群は災害の源泉であると同時に、新たな医療技術の可能性を秘めた存在として再評価されている。",
  },
  {
    id: "名の継承制度",
    name: "名の継承制度",
    nameEn: "Name Succession System",
    category: "用語",
    subCategory: "技術・概念",
    description:
      "AURALISに伝わる重要な文化的伝統で、初代メンバーの「名」を後継者が世代を超えて継承する制度である。初代Kate Claudiaの「Kate」、初代Lily Steinerの「Lillie Ardent」などの「名」は、単なる呼称ではなく、その名が持つ芸術的・精神的な本質を体現する者にのみ受け継がれる。継承の基準は厳格で、元の名の持ち主と同等の特性、才能、精神を持つと認められた者のみが新しい「名の継承者」となる。この制度はAURALISの「光と音を永遠にする」という理念を具現化するものであり、個人の死によって芸術的遺産が途絶えることを防ぐ文化装置として機能している。名の継承者は元の人物とは別個の存在であるが、AURALISのコミュニティ内では精神的な連続性が重視される。第一世代から第二世代への移行期においてもこの制度は維持され、AURALISのアイデンティティの継続性を支える重要な役割を果たしている。nトークン経済において「名の継承者」は文化的価値の指標として高く評価される。",
  },
  {
    id: "戦士決定戦",
    name: "戦士決定戦",
    nameEn: "Warrior Determination Battle",
    category: "用語",
    subCategory: "技術・概念",
    description:
      "ネオンコロシアムで行われる戦士決定の儀式で、クレセント大地方における伝統的な武力選抜制度である。ネオンコロシアムはクレセント地方の中心都市に設置された巨大な闘技場で、次元極地平技術を応用した安全装置により、実戦級の戦闘ながら参加者の命を守る仕組みが組み込まれている。戦士決定戦では、各国家や組織が代表する戦士たちが独自の戦闘スタイルと技術を披露し、その結果によって軍事的階位や外交的な発言力が決定される。ボグダス・ジャベリンのテクロサス系譜の戦士たちは戦士決定戦の常連であり、その圧倒的な実力で他国の参加者を圧倒してきた。戦士決定戦は単なる武力競技ではなく、クレセント地方の国際秩序を維持するための象徴的な儀式として機能し、UECOの監視下で定期的に開催されている。V7とトリニティ・アライアンスの対立が深まる中、戦士決定戦は両陣営の緊張を緩和する場としての役割も担っている。戦士決定戦の勝者には特別なnトークン報酬とA-Registry上の名誉階位が与えられる。",
  },

  /* その他 */
  {
    id: "ファールージャ社",
    name: "ファールージャ社",
    nameEn: "Faruja Corporation",
    category: "組織",
    subCategory: "その他",
    description:
      "シンフォニー・オブ・スターズ西大陸を代表する総合企業体。CEOであるミカエル・ガブリエリの卓越した経営手腕のもと、次元エネルギー採掘から軍事技術開発まで幅広い分野で事業を展開。特にZAMLT崩壊後の混乱期には安定した供給網を維持し、西大陸経済の屋台骨を支えた。エヴァトロン時代にも巧みに身を保ち、その後のテクノ文化ルネサンスでは新技術の商業化を主導した。社名の由来は創業地であるファールージャ渓谷に由来する。",
  },
  {
    id: "ネオンコロシアム",
    name: "ネオンコロシアム",
    nameEn: "Neon Colosseum",
    category: "地理",
    subCategory: "その他",
    description:
      "Gigapolis最大の闘技場であり、シンフォニー・オブ・スターズ西大陸における最大級のエンターテインメント施設。年間を通じて戦士決定戦が開催され、世界中から参加者が集まる。闘技場のネオン照明が夜間に輝く姿はGigapolisのシンボル的一景として広く知られ、文化イベントや音楽フェスティバルの会場としても機能する。観客席は最大50万人を収容可能で、次元ホログラム技術による臨場感のある中継システムを完備。",
  },
  {
    id: "ギガポリス",
    name: "ギガポリス",
    nameEn: "Gigapolis",
    category: "地理",
    subCategory: "その他",
    description:
      "シンフォニー・オブ・スターズ西大陸の中心都市にして政治・経済・文化の最大拠点。E6年のパラトン形成を起源とし、技術啓蒙時代を経て飛躍的に発展。E400年にエヴァトロンによる占領で一時「エヴァポリス」と改名されたが、E475年のエヴァトロン崩壊後は原名が復帰。地下街は独自の生態系を持ち、Tina/Gueが最深部を実効支配している。E524年にはセントラル・タワーで諸世界連邦サミットが開催され、宇宙規模の外交舞台としても機能している。",
  },
  {
    id: "ジマ・オイル",
    name: "ジマ・オイル",
    nameEn: "Zima Oil",
    category: "用語",
    subCategory: "その他",
    description:
      "クレセント地方に埋蔵される貴重な石油資源であり、シンフォニー・オブ・スターズ西大陸のエネルギー安全保障の要。高純度の原油が採掘され、精製後は航空燃料や次元エンジンの補助動力源として利用される。その戦略的価値から各地の軍閥や企業の争奪対象となり、アイリスがクレセントで実行した襲撃作戦はこの資源を巡る大規模な紛争の一端をなす。採掘施設は度重なる戦火で破壊と再建を繰り返してきた。",
  },
  {
    id: "エヴァトロン",
    name: "エヴァトロン",
    nameEn: "Evatron",
    category: "組織",
    subCategory: "その他",
    description:
      "E400年にGigapolisを武力制圧し、西大陸に恐怖政治を敷いた独裁的軍事・企業複合体。AURALISを弾圧し、芸術・文化活動を厳しく制限して市民の自由を奪った。支配下でGigapolisは一時「エヴァポリス」と改名され、極秘部隊Σ-Unitを設立して精神操作技術の研究を推進。しかしE400〜E470年続いたテリアン反乱による内政の疲弊と、指導層内部の腐敗が進行し、E475年にテリアン反乱軍と市民の連合攻勢を受けてついに崩壊。その残党は散り散りとなり、一部は新ZAMLT期の影の勢力として活動を続けた。",
  },
  {
    id: "テクロサス",
    name: "テクロサス",
    nameEn: "Tekrosas",
    category: "組織",
    subCategory: "その他",
    description:
      "E15〜E61年のバーズ帝国を樹立した軍閥ファランクスから派生した軍事系譜の総称。ファランクス崩壊後、その将兵と戦術思想を受け継ぐ者たちが西大陸各地で軍事組織を形成した。特にE88〜E98年のロンバルディア戦争ではテクロサス系の軍人が両陣営で重要な役割を果たした。伝説的な軍人ボグダス・ジャベリンもこの系譜の出であり、その戦闘スタイルと組織論は後世の軍事思想に多大な影響を与えた。テクノ文化ルネサンス以降は正当な軍事伝統として再評価されている。",
  },

  /* 西大陸都市 */
  {
    id: "Chem",
    name: "ケム",
    nameEn: "Chem",
    category: "地理",
    subCategory: "西大陸都市",
    description:
      "Gigapolis圏の化学工業都市。西大陸の産業革命期に設立され、精錬所と合成素材の工場群で知られる。ZAMLT期にはnトークン経済の重要拠点として機能した。",
  },
  {
    id: "Abrivo",
    name: "アブリーヴォ",
    nameEn: "Abrivo",
    category: "地理",
    subCategory: "西大陸都市",
    description:
      "Gigapolis圏の交易都市。シンフォニー・オブ・スターズ西大陸の物流ハブとして機能し、各地からの原材料と製品を中継する活気ある港湾都市。エル・フォルハウスのマーストリヒト革命後は自由貿易の拠点として発展した。",
  },
  {
    id: "Troyane",
    name: "トロワイヤヌ",
    nameEn: "Troyane",
    category: "地理",
    subCategory: "西大陸都市",
    description:
      "Gigapolis圏の古代遺跡都市。バーズ帝国時代（E15〜E61年）の遺構が残る歴史地区を擁し、テクノ宗教運動の聖地としてテンプル・オブ・ホライゾンの分院がある。テミルタロンの哲学を今に伝える学術の中心地。",
  },
  {
    id: "Ronve",
    name: "ロンヴ",
    nameEn: "Ronve",
    category: "地理",
    subCategory: "西大陸都市",
    description:
      "Gigapolis圏の城塞都市。西大陸の北部に位置し、ロンバルディア戦争（E88〜E98年）の際には前線基地として機能した堅固な防衛都市。現在でも要塞跡と軍事博物館が残り、テクロサス系譜の軍事伝統を伝える。",
  },
  {
    id: "Poitiers",
    name: "ポワティエ",
    nameEn: "Poitiers",
    category: "地理",
    subCategory: "西大陸都市",
    description:
      "Gigapolis圏の学術都市。フェルミ音楽の研究機関と芸術院が集積し、セリア黄金期（E335〜E370）にはAURALISのサテライト拠点として文化的な花を咲かせた。現在でも音楽祭が定期的に開催される芸術の街。",
  },
  {
    id: "Lille",
    name: "リール",
    nameEn: "Lille",
    category: "地理",
    subCategory: "西大陸都市",
    description:
      "Gigapolis圏の通信・情報都市。西大陸の通信ネットワークの中継拠点として機能し、次元極地平技術の民生利用の試験地としても知られる。テクノ文化ルネサンス（E475〜E500）以降は新しいメディア産業の拠点として急成長している。",
  },
  {
    id: "Valoria",
    name: "ヴァロリア",
    nameEn: "Valoria",
    category: "地理",
    subCategory: "西大陸都市",
    description:
      "Gigapolis圏南部の戦略的要衝に位置する都市。壮麗なValoria宮殿を擁し、E319年にLv938+の実力者Jenがこの宮殿を掌握して以降、彼女を中心とするValoria連合圏の中核拠点として機能している。ZAMLT崩壊後の権力真空期にJenが西大陸の安定を確立した拠点でもあり、現在でも新ZAMLT期における主要な政治・軍事拠点として重要な役割を果たす。宮殿の地下には古代の次元兵器遺構が眠ると伝えられている。",
  },
  {
    id: "Persepolis",
    name: "ペルセポリス",
    nameEn: "Persepolis",
    category: "地理",
    subCategory: "西大陸都市",
    description:
      "Gigapolis圏の宇宙港都市。西大陸最大の宇宙港を擁し、惑星間交易と移民の中継地として機能する。ティムール・シャーの移民団が最初に到着した地の一つであり、異星文化の融合が進む国際色豊かな都市。",
  },
  {
    id: "Selinopolis（西大陸都市）",
    name: "セリノポリス",
    nameEn: "Selinopolis",
    category: "地理",
    subCategory: "西大陸都市",
    description:
      "Gigapolisの旧称の一つ。セリア・ドミニクスがZAMLTを打倒し、Gigapolisを掌握した後にSelinopolisと改名した。セリアは超巨大企業Phovosを設立して次元エネルギー技術の商業化を推進し、都市をGDP25兆ドル規模に急成長させた。しかしアポロン・Dominion大戦後、エヴァトロンに吸収されセリアは追放された。現在はGigapolisの名称に戻っているが、歴史的経緯から「Selinopolis（ドミニオン）」として別項目でも詳述される。詳細は用語「Selinopolis（ドミニオン）」を参照。",
  },
  {
    id: "エヴァポリス",
    name: "エヴァポリス",
    nameEn: "Evapolis",
    category: "地理",
    subCategory: "西大陸都市",
    description:
      "Gigapolisのエヴァトロン支配時代（E400〜E475年）における強制的な改名都市名。エヴァトロンが自らの権威を都市の名称に刻印する意図で改名を実施したが、市民の間では古き良きGigapolisの名で呼び続ける抵抗運動が根強く存在した。E475年のエヴァトロン崩壊後、市民の総意により即座にGigapolisの名称が復帰。この改名と復帰の歴史は、都市の自治と市民の尊厳を取り戻した象徴的出来事として現在でも語り継がれ、毎年復帰記念日が祝われている。",
  },
  {
    id: "パラトン",
    name: "パラトン",
    nameEn: "Palaton",
    category: "地理",
    subCategory: "西大陸都市",
    description:
      "E6年に形成されたシンフォニー・オブ・スターズ西大陸における最初期の都市圏であり、現在のGigapolis圏の直接的な原型。地球からの移民集団が到着した直後に建設され、当初は数千人の小規模な居住区に過ぎなかった。しかし技術啓蒙時代に人口が爆発的に増加し、周辺都市と統合してメガロポリスへと成長。パラトンの城壁遺構の一部は現在でもGigapolis歴史地区に保存され、西大陸文明の起原を示す重要な文化財として指定されている。",
  },
  {
    id: "地下街",
    name: "地下街",
    nameEn: "Underground City",
    category: "地理",
    subCategory: "西大陸都市",
    description:
      "Gigapolisの地下深くに広がる複雑な地下構造体であり、複数の階層からなる独自の都市空間を形成している。上層部は商業施設と倉庫、中層部はインフラ設備と旧居住区が配置され、最深部はTina/Gueが実効支配する独自の統治領域となっている。アンダーグリッドとも接続しており、スライム危機時には巨大なスライムの巣が形成されるなど、表の都市とは全く異なる生態系が存在する。最深部の正確な構造は未だ完全には解明されていない。",
  },

  /* 施設・建造物 */
  {
    id: "ネオンクレーター宮殿",
    name: "ネオンクレーター宮殿",
    nameEn: "Neon Crater Palace",
    category: "地理",
    subCategory: "施設・建造物",
    description:
      "Eros-7の絶対的シンボルにして、惑星の政治・軍事的中枢が収まる巨大宮殿。初期建設時は高さ800メートル・100階建ての構造であったが、ZAMLT期に至り高さ1.5キロメートル・200階建てへと大拡張され、その威容は惑星 orbit からも視認可能となった。内部には統治会議場、軍司令部、搾取研究施設が配置され、Eros-7の独裁体制の象徴として機能。カーラ・ヴェルムのスクイーズ・アビス建設後は搾取エネルギーの管理中枢ともなった。現在では一部が市民に開放され、歴史博物館としても活用されている。",
  },
  {
    id: "スクイーズ・アビス",
    name: "スクイーズ・アビス",
    nameEn: "Squeeze Abyss",
    category: "地理",
    subCategory: "施設・建造物",
    description:
      "Eros-7の地下560階に構築された巨大な搾取施設。カーラ・ヴェルムが設計・建設を指揮し、惑星の地殻深部から搾取エネルギーを抽出するために建造された。施設の最深部では搾取プラズマ弾の量産が行われ、その破壊力は周辺惑星をも脅かす規模に達した。極度の過酷労働環境のもとで数千人の労働者が動員され、シャドウ・ユニオンの抵抗運動の主な標的となった。現在は大部分が封鎖されているが、一部のレベルで再利用計画が進んでいる。",
  },
  {
    id: "アンダーグリッド",
    name: "アンダーグリッド",
    nameEn: "Undergrid",
    category: "地理",
    subCategory: "施設・建造物",
    description:
      "Gigapolisの地下全体に張り巡らされた広大なネットワークインフラであり、エネルギー供給、通信、物流の動脈として機能する複数階層の地下構造体。スライム危機の際には地下の湿潤環境を好む巨大スライムの巣が形成され、Gigapolisのインフラに深刻な被害をもたらした。アヤカ・リンが先陣を切って制圧作戦を実行し、危機の収束に貢献。現在では安全対策が大幅に強化され、一部は観光用トンネルとしても整備されている。地下街とも接続し、Gigapolisの地下世界の重要な構成要素となっている。",
  },
  {
    id: "セントラル・タワー",
    name: "セントラル・タワー",
    nameEn: "Central Tower",
    category: "地理",
    subCategory: "施設・建造物",
    description:
      "Gigapolisの中心部に聳え立つ象徴的な超高層タワーであり、西大陸の政治と商業の中心地。E150年のマーストリヒト革命の際、革命指導者エル・フォルハウスがこのタワーを武力占拠し、完全自由経済体制への移行を宣言した歴史的舞台。以来、政変や権力交代のたびに占拠と奪還が繰り返されてきた。E524年には諸世界連邦サミットの主会場として使用され、宇宙規模の外交協議の場となった。タワー最上層のオブザベーションデッキからはGigapolis全土を見渡すことができる。",
  },
  {
    id: "オアシス・ハウス",
    name: "オアシス・ハウス",
    nameEn: "Oasis House",
    category: "地理",
    subCategory: "施設・建造物",
    description:
      "レイラ・ヴィレル・ノヴァがスライム危機時に前線拠点として使用した場所。Gigapolis地下街の中部エリアに位置し、元々は旧時代の防空シェルターとして建設された構造物を転用した臨時作戦本部。レイラはここを拠点にナノファイバーブーツや強化グローブを駆使してスライム討伐作戦を指揮し、プラズマカノンによる大規模焼却作戦の立案も行った。危機後は戦災記念施設として保存され、内部にはレイラの装備品のレプリカとスライム危機の記録アーカイブが展示されている。",
  },
  {
    id: "ロレンツィオ国際大学",
    name: "ロレンツィオ国際大学",
    nameEn: "Lorenzio International University",
    category: "地理",
    subCategory: "施設・建造物",
    description:
      "惑星ビブリオに設立された宇宙規模の最高学府にして学術研究の中心。次元物理学、量子情報科学、異種文明学などの最先端分野で宇宙トップクラスの研究実績を誇る。E514年に天才少女ミナがAI学部に入学し、在学中から画期的な研究成果を発表して学界に衝撃を与えた。キャンパスは惑星の北半球に広がり、複数の惑星から集まった留学生が学ぶ国際色豊かな環境。卒業生には銀河系コンソーシアムの要職につく者も多く、次世代の指導者育成機関として重要な役割を担っている。",
  },
  /* 戦争・歴史事件 */
  {
    id: "エルトナ戦争",
    name: "エルトナ戦争",
    nameEn: "Eltna War",
    category: "歴史",
    subCategory: "戦争・事件",
    description:
      "E14年に勃発したシンフォニー・オブ・スターズ史上最初期の大規模紛争。地球から到来した移民集団の間で、「前衛意識」を標榜する進歩派と、惑星の自然環境との調和を重んじる「原始意識」を奉じる保守派が激しく衝突した。人種的・文化的緊張の起源となった戦争であり、その対立構造は後のテラン朝共和制の成立過程にも影響を及ぼした。この戦争の教訓は、のちに技術啓蒙時代におけるバイオエンジニアリングの倫理議論の基礎となった。",
  },
  {
    id: "アフター戦争",
    name: "アフター戦争",
    nameEn: "After War",
    category: "歴史",
    subCategory: "戦争・事件",
    description:
      "E62年からE77年にかけて続いた大規模な内戦。チョンクォン戦争と並んで、シンフォニー・オブ・スターズ西大陸における王朝体制から共和制への移行をもたらした決定的な契機となった。封建的な支配構造に対する市民の不満が爆発し、各地で武装蜂起が発生。15年に及ぶ戦闘の末、旧支配層は崩壊し、新たな共和制の基盤が築かれた。この戦争はEDUの歴史において「自由への序章」として位置づけられている。",
  },
  {
    id: "チョンクォン戦争",
    name: "チョンクォン戦争",
    nameEn: "Chonkwon War",
    category: "歴史",
    subCategory: "戦争・事件",
    description:
      "E62年からE77年にかけてアフター戦争と並行して戦われた大規模紛争。主に東方領域を舞台に、地方分権を求める勢力と中央集権体制の維持を図る勢力が激突した。チョンクォン地域の特殊性を背景に複雑な駆け引きが展開され、多数の都市が戦火に巻き込まれた。アフター戦争との相乗効果により、最終的にテラン朝共和制への移行が不可避となった。この戦争の名称はチョンクォン平原での決戦に由来する。",
  },
  {
    id: "テラン朝共和制",
    name: "テラン朝共和制",
    nameEn: "Terran Republic",
    category: "歴史",
    subCategory: "戦争・事件",
    description:
      "E62〜E77年のアフター戦争およびチョンクォン戦争の終結に伴い、旧封建体制に代わって成立した共和制政体。市民の代表による議会制度を導入し、西大陸初の本格的な民主主義的統治体制を確立した。しかし初期には共和制の運営経験不足から政治的混乱が続いた。技術啓蒙時代の幕開けとともに安定し、のちのマーストリヒト革命を経て企業国家体制であるコーポラタムパブリカへと発展的に移行した。",
  },
  {
    id: "ロンバルディア戦争",
    name: "ロンバルディア戦争",
    nameEn: "Lombardia War",
    category: "歴史",
    subCategory: "戦争・事件",
    description:
      "E88年からE98年にかけてM104銀河全域を巻き込んだ史上最大規模の星間戦争。西大陸の内政不満と外惑星領域との資源争奪が複雑に絡み合い、複数の惑星系で同時に戦闘が勃発。次元兵器の試験的使用が行われた最初の大戦でもあり、その被害は甚大であった。戦後の処理過程でセクスタス連合が結成され、ロンバルディア帝国との対立構造が形成された。この戦争は銀河規模の安全保障体制の必要性を浮き彫りにした。",
  },
  {
    id: "メルディア戦争",
    name: "メルディア戦争",
    nameEn: "Meldia War",
    category: "歴史",
    subCategory: "戦争・事件",
    description:
      "E275年からE288年にかけてロンバルディア帝国とセクスタス連合の間で戦われた大規模な星間戦争。13年に及ぶ戦争の最終局面でロンバルディア帝国は次元兵器を初めて本格的に投入し、セクスタス連合の主要拠点を壊滅させて勝利を収めた。しかし次元兵器使用の倫理的議論は銀河全体に波紋を広げ、のちのアポロン・Dominion大戦における次元兵器の禁止条約の根拠となった。戦後のロンバルディア帝国の覇権確立は第五次繁栄期をもたらした。",
  },
  {
    id: "マーストリヒト革命",
    name: "マーストリヒト革命",
    nameEn: "Maastricht Revolution",
    category: "歴史",
    subCategory: "戦争・事件",
    description:
      "E150年にエル・フォルハウスが主導した経済革命。彼はGigapolisのセントラル・タワーを武力で占拠し、それまでの規制経済体制を廃止して完全自由経済を宣言した。この革命により企業の活動が大幅に自由化され、コーポラタムパブリカ体制から新たな経済秩序への転換が完了した。革命の理念は新ヘルシンキ宣言に受け継がれ、のちの惑星連邦構想の思想的基盤の一つとなった。エル・フォルハウスは革命後、初代経済自由委員会の委員長に就任した。",
  },
  {
    id: "クワンナラ革命",
    name: "クワンナラ革命",
    nameEn: "Kwannara Revolution",
    category: "歴史",
    subCategory: "戦争・事件",
    description:
      "E108年からE114年にかけて起こった大規模な社会革命。中央集権体制に対する地方勢力とクラン（氏族）の反発を背景に、分権化とクランの伝統的権利の復権を要求する声が高まった。革命の結果、地方自治権が大幅に拡大され、クラン・フォーラムの設立など分権的な統治体制が整備された。この革命はE325年のネオクラン同盟設立への遠因ともなり、西大陸政治における「中央対地方」の構造を形成する決定的な転換点となった。",
  },
  {
    id: "新ヘルシンキ宣言",
    name: "新ヘルシンキ宣言",
    nameEn: "New Helsinki Declaration",
    category: "歴史",
    subCategory: "戦争・事件",
    description:
      "E151年にアリア・ソルが提案した画期的な外交構想。惑星連邦の設立と、次元極地平を活用した星間議会の組織化を柱とする構想であり、複数の惑星文明が平等な立場で参加する宇宙規模の連合体制を構想した。この宣言はマーストリヒト革命の翌年に発表され、経済の自由化に続く政治的統合のビジョンとして広範な支持を集めた。のちの銀河系コンソーシアム設立の理念的源流として高く評価されている。",
  },
  {
    id: "コーラの疫病",
    name: "コーラの疫病",
    nameEn: "Corra Plague",
    category: "歴史",
    subCategory: "戦争・事件",
    description:
      "E208年に発生した未曾有の大疫病。アンドロメダ銀河系からの移民者の遺伝子に特異的に作用するウイルスが変異して猛威を振るい、人口の約15パーセントにあたる約4,500万人が死亡する壊滅的被害をもたらした。この疫病は移民集団と在来住民の間に根深い不信感を生み出し、被害を受けた移民コミュニティを中心にシャドウ・リベリオンが結成される直接の契機となった。のちに疫病のウイルスは人工的に改造されたものである可能性が指摘されている。",
  },
  {
    id: "テリアン反乱",
    name: "テリアン反乱",
    nameEn: "Terrian Rebellion",
    category: "歴史",
    subCategory: "戦争・事件",
    description:
      "E400年からE470年にわたり、エリオス・ウォルドが率いるテリアン反乱軍がエヴァトロンの支配に抵抗して戦った大規模な反乱。70年間に及ぶ抵抗運動は西大陸の歴史で最も長期にわたる武装闘争となった。エリオスは農民や市民を結集してゲリラ戦を展開し、エヴァトロンの資源供給網に深刻な打撃を与えた。しかしE470年にエリオスが捕縛・処刑されると反乱軍は一時衰退したが、残存勢力は地下活動を継続し、E475年のエヴァトロン崩壊の決定的な要因となった。",
  },
  {
    id: "技術啓蒙時代",
    name: "技術啓蒙時代",
    nameEn: "Technological Enlightenment Era",
    category: "歴史",
    subCategory: "歴史・時代",
    description:
      "E80年からE90年にかけての約10年間にわたる技術爆発の黄金期。バイオエンジニアリングが飛躍的な進化を遂げ、ナノセル・インプラントが一般市民に普及して放射線耐性と大幅な寿命延長が実現した。この時代の技術革新は人口を約5,000万人に急増させ、Gigapolisの都市インフラを劇的に拡大した。同時に、技術の倫理的境界をめぐる議論が活発化し、テクノ宗教運動の誕生とテラン朝共和制の思想的形成に大きな影響を与えた。",
  },
  {
    id: "テクノ宗教運動",
    name: "テクノ宗教運動",
    nameEn: "Techno-Religious Movement",
    category: "歴史",
    subCategory: "歴史・時代",
    description:
      "次元極地平技術の発見を端緒として興隆した宗教・哲学運動。次元極地平を単なる物理現象としてではなく「宇宙の意志」の顕現として神聖視し、技術と信仰の融合を追求した。テミルタロンがこの運動の思想的指導者となり、拠点としてテンプル・オブ・ホライゾンを建設。サイケデリック・コスモロジーを提唱し、次元ピラミッドの原型を構想した。技術啓蒙時代の物質主義的傾向に対する精神的なアンチテーゼとして広範な支持を集め、Troyaneを聖地として現在でも信仰が続いている。",
  },

  /* 組織・制度（追加） */
  {
    id: "コーポラタムパブリカ",
    name: "コーポラタムパブリカ",
    nameEn: "Corporatum Publica",
    category: "組織",
    subCategory: "組織・制度",
    description:
      "シンフォニー・オブ・スターズ西大陸でE97年頃の第三繁栄期に正式に成立した企業国家体制。政治と経済が融合した統治形態であり、大企業の代表が政府の要職を占めることで効率的な資源配分と迅速な意思決定を実現した。ZAMLTをはじめとする巨大企業が政治的権力を掌握し、市民の生活は企業の福利厚生制度に依存する構造となっていた。E150年のマーストリヒト革命により完全自由経済体制へと移行したが、その企業国家の遺産は現在の西大陸経済システムに深く刻まれている。最高執行官（CEO議長）には各時代の最大企業連合の代表者が就任し、E97年の第三繁榮期には14兆ドルGDPを誇る企業連合体の頂点に立つ者を輩出した。最後期の執行官はエリオット・シュトラスによるZAMLT統合によって解任された。",
  },
  {
    id: "シャドウ・ユニオン",
    name: "シャドウ・ユニオン",
    nameEn: "Shadow Union",
    category: "組織",
    subCategory: "組織・制度",
    description:
      "Eros-7の独裁体制に対する最大級の反体制組織。ガロが指導者としてResistanceを統率し、ZAMLT期には画期的なナノハッキング技術を駆使してバイオリアクターの妨害活動を展開した。組織の構成員は主に搾取施設で過酷な労働を強いられる下層市民から成り、地下ネットワークを通じて連携。カーラ・ヴェルムのスクイーズ・アビス建設に対する最大の抵抗勢力として機能した。のちにマトリカル・リフォーム運動にも一部が参加し、Eros-7の民主化に重要な役割を果たした。",
  },
  {
    id: "男性指令省",
    name: "男性指令省",
    nameEn: "Male Directive Ministry",
    category: "組織",
    subCategory: "組織・制度",
    description:
      "Eros-7においてシルヴィア・クロウが設立した男性管理のための政府機関。Eros-7特有の女性主導社会における男性の社会参加を統制する目的で作られ、精子レジストリの運用と男性の労働配分を管理した。この制度は男性の権利制限として批判を浴び、のちのE525年のマトリカル・リフォーム運動における主要な改革要求対象となった。シルヴィア自身も搾取生物危機の収束後、この制度の見直しに理解を示したと伝えられる。",
  },
  {
    id: "マトリカル・カウンシル",
    name: "マトリカル・カウンシル",
    nameEn: "Matrical Council",
    category: "組織",
    subCategory: "組織・制度",
    description:
      "Eros-7の最高統治機関であり、女性による集団指導体制をとる評議会。複数の代表議員が政策の決定と執行にあたり、搾取エネルギーを通じた社会統制の要として機能した。シャドウ・ユニオンの反乱に対しては搾取抑制剤を用いた鎮圧措置を実施したが、過度な弾圧は国際的な非難を招いた。評議会の構成と権限は時代とともに変遷し、現在ではマトリカル・リフォーム運動の成果を受けてより民主的な運営へと移行している。",
  },
  {
    id: "マトリカル・リフォーム運動",
    name: "マトリカル・リフォーム運動",
    nameEn: "Matrical Reform Movement",
    category: "組織",
    subCategory: "組織・制度",
    description:
      "E525年にアヤカ・リン、ガロ、ゼナが共同で組織したEros-7の社会改革運動。労働時間の大幅な短縮と、男性指令省が運用する精子レジストリの男女平等化を主要な要求とした。シャドウ・ユニオンの反体制活動の経験を踏まえ、暴力ではなく議会闘争と市民運動を通じて改革を追求する手法を採用。この運動はEros-7社会に深い変革をもたらし、搾取体制の段階的な解体と民主化への道を切り開いた。",
  },
  {
    id: "ヒーローエージェンシー",
    name: "ヒーローエージェンシー",
    nameEn: "Hero Agency",
    category: "組織",
    subCategory: "組織・制度",
    description:
      "シンフォニー・オブ・スターズ西大陸における超常能力者の正式な管理・運用組織。戦士決定戦の選考と管理、および地域の安全確保を主な任務とし、強力な能力者をエージェントとして登用していた。E495〜E500年の銀河系コンソーシアム設立にあたりネオクラン同盟と統合し、宇宙規模の安全保障体制の中核を形成した。現在でもコンソーシアム内で実働部隊として機能し、次世代の能力者育成にも注力している。",
  },
  {
    id: "銀河系コンソーシアム",
    name: "銀河系コンソーシアム",
    nameEn: "Galactic Consortium",
    category: "組織",
    subCategory: "組織・制度",
    description:
      "E495年からE500年にかけて設立された宇宙規模の統合的ガバナンス組織。ネオクラン同盟、UECO、ヒーローエージェンシーの三大勢力を統合して誕生し、M104銀河全域の平和と安定維持を目的としている。最大の課題であるトゥキディデスの罠の回避を志向し、軍事大国ティエリアと経済大国グランベルの間の調停役として重要な機能を果たしている。E524年の諸世界連邦サミットでは主催者として宇宙規模の外交協議を実現した。初代議長にはグランベル代表とティエリア代表の共同議長体制が採用され、E524年の諸世界連邦サミットでは両者が共同で主催を務めた。",
  },
  {
    id: "テンプル・オブ・ホライゾン",
    name: "テンプル・オブ・ホライゾン",
    nameEn: "Temple of Horizon",
    category: "組織",
    subCategory: "組織・制度",
    description:
      "テクノ宗教運動の総本山であり、次元極地平を神聖視する信者たちの精神的拠点。テミルタロンが自らの哲学体系を実践するために建設を指導した。内部には次元極地平の研究施設と瞑想空間が併設され、科学と信仰の融合を象徴する建造物となっている。Troyaneに本拠を置き、西大陸各地に分院を擁する。テクノ文化ルネサンス以降は宗教施設としてだけでなく、次元物理学の研究機関としても学術的な評価を得ている。",
  },
  {
    id: "Σ-Unit",
    name: "シグマ・ユニット",
    nameEn: "Sigma Unit",
    category: "組織",
    subCategory: "組織・制度",
    description:
      "E420年にエヴァトロン軍が極秘に設立した特殊部隊。高度な精神操作技術と生体改造技術を駆使し、敵対者の洗脳と超人的な戦闘兵士の創出を行った。部隊の存在はエヴァトロン崩壊後長らく不明とされていたが、のちにシルバー・ヴェノムやアルファ・ヴェノムの起源部隊であったことが判明した。Σ-Unitの技術遺産は一部が回収され、新ZAMLT期の軍事研究において倫理的議論の対象となっている。",
  },
  {
    id: "テリアン反乱軍",
    name: "テリアン反乱軍",
    nameEn: "Terrian Rebel Army",
    category: "組織",
    subCategory: "軍事・対立組織",
    description:
      "エリオス・ウォルドが指導したエヴァトロンに対する武装抵抗組織。E400年のエヴァトロンGigapolis占領直後に結成され、農民、労働者、旧軍人など幅広い層から構成された。山岳地帯を拠点に游击戦を展開し、エヴァトロンの補給線に継続的な打撃を与えた。E470年のエリオス処刑後も残存勢力が抵抗を継続し、E475年の市民蜂起と連携してエヴァトロンの崩壊を実現。その不屈の闘争精神は西大陸の自由の象徴として語り継がれている。",
  },
  {
    id: "ロンバルディア帝国",
    name: "ロンバルディア帝国",
    nameEn: "Lombardia Empire",
    category: "組織",
    subCategory: "軍事・対立組織",
    description:
      "M104銀河において圧倒的な軍事力を誇った歴史的帝国。メルディア戦争（E275〜E288年）においてセクスタス連合と激突し、次元兵器の投入による圧倒的火力で勝利を収めた。戦後の覇権確立により第五次繁栄期をもたらす一方、次元兵器の使用は銀河規模の倫理的議論を巻き起こした。帝国の軍事伝統はテクロサス系譜に受け継がれ、西大陸の軍事史に多大な影響を残した。現在では帝国の正式な後継国家は存在しないが、その遺産は多くの勢力に分散して受け継がれている。",
  },
  {
    id: "セクスタス連合",
    name: "セクスタス連合",
    nameEn: "Sextus Alliance",
    category: "組織",
    subCategory: "軍事・対立組織",
    description:
      "M104銀河周辺に位置する複数の惑星国家・勢力が結成した軍事同盟。ロンバルディア帝国の拡張主義に対抗するために設立され、メルディア戦争（E275〜E288年）において13年にわたり帝国と戦い抜いた。最終的には帝国の次元兵器により主要拠点を失って敗北したが、その勇戦は銀河全体に感銘を与え、のちの銀河系コンソーシアム設立の理念的基盤となった。連合の残存勢力は戦後も協力関係を維持し、新しい安全保障体制の構築に寄与した。",
  },
  {
    id: "クラン・フォーラム",
    name: "クラン・フォーラム",
    nameEn: "Clan Forum",
    category: "組織",
    subCategory: "組織・制度",
    description:
      "E325年に設立されたネオクラン同盟の下部組織であり、社会的低階層の声を政治プロセスに反映させることを目的とした参加型の議論場。市民が直接提案を行い、政策に対する意見を表明できる場として機能し、ネオクラン同盟の民主的な運営を支える重要な役割を果たした。クワンナラ革命（E108〜E114年）以来の分権化の伝統を受け継ぐ組織であり、地方コミュニティの自治能力を強化する機能も担っている。銀河系コンソーシアム設立後も下部諮問機関として活動を続けている。",
  },
  {
    id: "ヴェルリット一族",
    name: "ヴェルリット一族",
    nameEn: "Verlit Clan",
    category: "組織",
    subCategory: "軍事・対立組織",
    description:
      "ラブマークと呼ばれる特殊な印を駆使する「魔女」の一族として知られる古い血統集団。クレセント地方を拠点に独自の魔法体系と戦闘術を代々受け継ぎ、周辺地域にその名を知らしめてきた。アイリスがクレセントで活動中に遭遇した敵対勢力であり、ラブマークの技術を用いた攻撃は通常の物理防御を無効化する特性を持つ。一族の起源については多くの謎に包まれており、古代の次元技術に関連する説も存在する。",
  },
  {
    id: "ファランクス",
    name: "ファランクス",
    nameEn: "Phalanx",
    category: "組織",
    subCategory: "軍事・対立組織",
    description:
      "E15年からE61年にかけてバーズ帝国を樹立し、シンフォニー・オブ・スターズ西大陸の広範な領域を支配した強大な軍閥。精鋭の重装歩兵部隊による堅固な戦術で知られ、当時の西大陸最強の軍事力を誇った。帝国崩壊後、その将兵と戦術思想はテクロサスという軍事系譜として受け継がれ、後世の西大陸軍事史に決定的な影響を与えた。Troyaneに残るバーズ帝国時代の遺構は、現在も軍事史研究者の重要な調査対象となっている。",
  },

  /* 技術・概念（追加） */
  {
    id: "Apolonium",
    name: "アポロニウム",
    nameEn: "Apolonium",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "リミナル・フォージの中核をなす革新的な技術物質であり、Dimension Horizonのエネルギーと共鳴することで時空間の操作を可能にする。この物質の発見は放送技術に革命をもたらし、時相放送の実現を可能にした。Apoloniumの生成には極めて高度な次元操作技術が必要とされ、現在でもグランベルなど一部の先進文明でのみ量産が確認されている。その軍事転用の可能性から、銀河系コンソーシアムによる国際管理が議論されている。",
  },
  {
    id: "時相放送",
    name: "時相放送",
    nameEn: "Temporal Broadcast",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "リミナル・フォージが開発した画期的な放送方式であり、時空間の次元を超えてコンテンツを送信することができる。特にE528年には、E528年の芸術作品を地球AD2026年のインターネット上に放送するという前例のないクロス次元放送を実現し、二つの時代間の文化交流の架け橋となった。この技術の理論的基盤はテミルタロンのサイケデリック・コスモロジーに由来し、次元極地平の性質を応用したものである。",
  },
  {
    id: "クオリア・コア",
    name: "クオリア・コア",
    nameEn: "Qualia Core",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "人間の感情・感覚・主観的体験をデジタルデータとして精密に記録・再現する技術。ペルセポネ仮想宇宙におけるプライマリー・フィールドの中核コンポーネントとして組み込まれ、ユーザーに実体験に極めて近い感覚を提供することを可能にした。当初は娯楽用途で開発されたが、のちに医療リハビリテーションや教育訓練分野でも応用が進んでいる。感情データの取り扱いをめぐるプライバシー問題も提起されており、倫理的ガイドラインの整備が課題となっている。",
  },
  {
    id: "プライマリー・フィールド",
    name: "プライマリー・フィールド",
    nameEn: "Primary Field",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "ペルセポネ仮想宇宙を構成する最も重要な基盤技術。クオリア・コアによって生成される感情データと感覚情報を仮想空間上に投影し、ユーザーに実体験レベルの没入感を提供する。視覚・聴覚・触覚だけでなく、喜怒哀楽などの感情的な体験までも忠実に再現することができる。この技術によりペルセポネは単なる仮想空間を超えた「第二の現実」として機能し、移民者たちが過酷な現実環境から一時的に解放される場となった。",
  },
  {
    id: "量子ファイナンス・コア",
    name: "量子ファイナンス・コア",
    nameEn: "Quantum Finance Core",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "ZAMLTの経済的覇権を支えた中核技術であり、量子コンピューティングを用いた超高速金融取引システム。nトークン経済における取引の約95パーセントをこのコアを通じて処理し、ZAMLTの市場支配力の源泉となった。しかしE318年にアルファ・ケインがこのコアに対して画期的なハッキング攻撃を実行し、ZAMLTの経済的基盤に深刻な亀裂を入れた。この事件はZAMLT崩壊の引き金となり、のちの金融システム再設計の重要な教訓となった。",
  },
  {
    id: "量子バイオバンク",
    name: "量子バイオバンク",
    nameEn: "Quantum Biobank",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "ZAMLTの遺伝子データ管理技術とEros-7の男性指令省が運用する精子レジストリが統合されて誕生した大規模な生体データバンク。市民の遺伝情報、バイタルデータ、繁殖関連データを包括的に管理し、Eros-7の搾取体制下では社会統制の道具として悪用された。ZAMLT崩壊とEros-7の民主化後、データの利用規範が見直され、現在では医療・研究目的に限定して運用されている。個人の生体情報を国家が管理することの倫理的問題として頻繁に議論の的となる。",
  },
  {
    id: "ナノセル・インプラント",
    name: "ナノセル・インプラント",
    nameEn: "Nanocell Implant",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "技術啓蒙時代（E80〜E90年）に一般市民に普及した生体ナノマシンインプラント技術。体内に注入されたナノセルが細胞レベルで機能し、宇宙空間の放射線に対する耐性と大幅な寿命延長を実現した。この技術の普及は人口の急増と都市化を加速させ、Gigapolisのメガロポリス化を推進した。一方で、インプラントの適合性には個人差があり、後遺症に関する懸念も一部で指摘されている。テクノ文化ルネサンス期には更に高度な第二世代インプラントの開発が進んでいる。",
  },
  {
    id: "ナノハッキング技術",
    name: "ナノハッキング技術",
    nameEn: "Nano-Hacking Technology",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "シャドウ・ユニオンが開発・実戦投入した先端的サイバー攻撃技術。ナノマシンを介して生物的・電子的システムに同時に侵入し、Eros-7のバイオリアクターの制御システムを妨害することに成功した。従来の電子的ハッキングでは対抗不可能な生体システムへの介入を可能にし、搾取エネルギーインフラに対する数少ない実効ある攻撃手段となった。この技術の一部はのちにマトリカル・リフォーム運動でも活用され、Eros-7の民主化過程で重要な役割を果たした。",
  },
  {
    id: "搾取触手",
    name: "搾取触手",
    nameEn: "Extraction Tentacle",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "搾取生物の最も標準的で広く量産された形態。柔軟な触手構造を持ち、対象に巻き付いてエネルギーを吸収する機能を持つ。ZAMLTとEros-7の搾取施設で大量に生産され、労働者の監視や逃亡防止、エネルギー採取の補助作業など多目的に使用された。触手の先端には微細な神経接続端子があり、接触対象の生体反応をリアルタイムで監視することができる。スライム危機後は大部分が破棄されたが、一部は解体・研究されている。",
  },
  {
    id: "搾取ヒル",
    name: "搾取ヒル",
    nameEn: "Extraction Leech",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "搾取生物の形態の一つであり、吸血動物をモデルに設計されたエネルギー吸収型生物ユニット。対象の生体エネルギーを直接的に吸収する能力を持ち、ZAMLTとEros-7の労働収容施設で広く使用された。E330年とE318年の二度にわたり、1,000体規模の大量破壊事件が発生し、搾取生物の制御不安定性が深刻な問題として浮上した。これらの事件はシャドウ・リベリオンの抵抗活動の一環と見なされており、反体制運動を激化させる要因となった。",
  },
  {
    id: "搾取バクテリア",
    name: "搾取バクテリア",
    nameEn: "Extraction Bacteria",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "微生物レベルの搾取生物であり、対象の体内に侵入して細胞レベルでエネルギーを吸収する特性を持つ。当初は生体兵器として開発されたが、E505年に画期的な転用が行われた。ナノメディスンの研究者たちが搾取バクテリアのエネルギー吸収メカニズムを逆転させ、細胞修復を促進する遺伝子修復剤として再設計した。この転用は搾取技術から平和利用への転換を象徴する事例として高く評価され、重傷の治療や遺伝子疾患の治療に革命をもたらした。",
  },
  {
    id: "搾取プラズマ弾",
    name: "搾取プラズマ弾",
    nameEn: "Extraction Plasma Shell",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "スライムエネルギーを極限まで凝縮し、広範囲に壊滅的な被害をもたらす破壊兵器。カーラ・ヴェルムがスクイーズ・アビスで量産を指揮し、その破壊力は惑星の地形を変更するほどとされる。弾頭内部に封入された圧縮スライムマターは着弾と同時に急激膨張し、周囲に強力なエネルギー衝撃波を放つ。Eros-7の搾取体制を維持するための最終兵器として位置づけられていたが、実際の大規模使用の記録は限定的である。",
  },
  {
    id: "ナノメディシン",
    name: "ナノメディシン",
    nameEn: "Nanomedicine",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "E505年に搾取バクテリアを転用して開発された革新的な医療技術。ナノマシンを体内に導入し、搾取バクテリアのエネルギー吸収メカニズムを反転させることで、損傷した細胞や遺伝子を分子レベルで修復する。重傷の治療から先天性の遺伝子疾患の治療まで幅広い適用が可能であり、Eros-7の医療体制に革命的な進歩をもたらした。搾取技術の平和的転用の成功事例として国際的にも注目され、他の惑星文明への技術移転も進んでいる。",
  },
  {
    id: "ナノファイバーブーツ",
    name: "ナノファイバーブーツ",
    nameEn: "Nanofiber Boots",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "レイラ・ヴィレル・ノヴァの代名詞的装備である強化外骨格内蔵の戦闘用ブーツ。ナノファイバー製の特殊素材で構成され、装着者の脚力を数十倍に増幅するとともに、次元跳躍に近い高機動移動を可能にする。ブーツの底部には衝撃吸収ゲルと反重力モジュールが内蔵され、高層ビルの壁面走行や空中での急方向転換を実現。スライム危機においてレイラはこのブーツを駆使してアンダーグリッド全域を駆け回り、スライム討伐作戦を劇的に効率化した。",
  },
  {
    id: "強化グローブ",
    name: "強化グローブ",
    nameEn: "Power Glove",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "レイラ・ヴィレル・ノヴァがスライム討伐作戦で使用した強化外骨格グローブ。最大100トンのパンチ力を発揮し、硬化したスライムの外殻を一撃で粉砕することが可能。グローブの内部にはナノアクチュエーターが密集配置され、装着者の筋力を数百倍に増幅する。パンチの衝撃を制御するための精密な力調整システムも内蔵され、対象に応じて出力を段階的に調整できる。オアシス・ハウスに展示されているレプリカは実物の70パーセントスケールである。",
  },
  {
    id: "プラズマカノン",
    name: "プラズマカノン",
    nameEn: "Plasma Cannon",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "レイラ・ヴィレル・ノヴァがスライム危機の大規模焼却作戦で使用した携行型プラズマ兵器。圧縮されたプラズマエネルギーを指向性ビームとして放射し、巨大なスライムの塊を瞬時に高温で焼却する能力を持つ。連続射撃時には冷却システムが作動し、過熱を防ぐ設計となっている。標準モードでは直径50メートルの範囲を焼却可能で、最大出力モードではアンダーグリッドの一区画を丸ごと焼き払う威力を発揮した。スライム危機収束後は軍事博物館に寄贈されている。",
  },
  {
    id: "ビキニバリア",
    name: "ビキニバリア",
    nameEn: "Bikini Barrier",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "アヤカ・リンが独自に開発した個人用防御技術。極薄のエネルギーフィルムを体表に展開し、搾取生物の物理攻撃やエネルギー攻撃を効果的に遮断する。名前の由来はフィルムの最小展開時の形状が水着に類似していることから。防御範囲と強度はアヤカの集中力に依存し、最大展開時には周囲数メートルの範囲をカバーできる。カウパー波による攻撃動作との組み合わせにより、防御と反撃を同時に行う独自の戦闘スタイルを可能にした。",
  },
  {
    id: "カウパー波",
    name: "カウパー波",
    nameEn: "Couper Wave",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "アヤカ・リンが使用する攻撃技術。体内で生成した特殊な波動エネルギーを放ち、対象の細胞構造を共振破壊する。ビキニバリアの防御展開中に背面からカウパー波を放つことで、防御と攻撃を同時に行うアヤカ独自の戦闘術を可能にした。波動の周波数は対象の組織に合わせて精密に調整可能で、搾取生物に対して特異的に高い効果を発揮する。スライム危機のアンダーグリッド制圧作戦で決定的な役割を果たした技術である。",
  },
  {
    id: "ニューロリンク・インターフェース",
    name: "ニューロリンク・インターフェース",
    nameEn: "Neurolink Interface",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "ティムール・シャーがペルセポネ仮想宇宙の設計にあたり開発した脳波直結型インターフェース技術。移民者の意識を仮想空間にアップロードし、過酷な惑星環境から一時的に解放される手段を提供した。この技術により、移民者はペルセポネ内で地球の自然環境を再現した空間で生活することができ、精神健康の維持に大きく貢献した。インターフェースの安全性には厳格な基準が設けられ、長時間の接続による意識混濁のリスクも管理されている。",
  },
  {
    id: "量子演算コア",
    name: "量子演算コア",
    nameEn: "Quantum Computing Core",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "ペルセポネ仮想宇宙を安定稼働させるために設計された超高速量子コンピューティングシステム。膨大な量の感情データと仮想環境の演算をリアルタイムで処理し、数百万の同時接続ユーザーにラグのない仮想体験を提供する。コア内部では多数の量子ビットが数百次元の計算空間を同時に処理し、プライマリー・フィールドの没入感を支える技術的基盤となっている。この技術の civilian 転用は宇宙規模のIT産業の発展を促進した。",
  },
  {
    id: "曲率航法",
    name: "曲率航法",
    nameEn: "Warp Navigation",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "宇宙航行のための超光速推進技術。船体周辺の空間を歪曲させ、実効的に光速を超えて移動することを可能にする。量子テレポーテーションと共に、地球からE16惑星系への大移民ルートを構成した二大技術基盤の一つ。長距離の惑星間航行に適しており、特に輸送船団の大規模な移動において主力技術として機能した。現在でも星間貿易の主要な航法方式として広く採用されている。",
  },
  {
    id: "量子テレポーテーション",
    name: "量子テレポーテーション",
    nameEn: "Quantum Teleportation",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "量子もつれを応用した短距離空間転送技術。地球上の移送拠点から宇宙船への搭乗者転送や、近距離惑星間の物資移送に使用される。転送距離には厳しい制限があるが、大移民ルートの中継技術として曲率航法を補完する重要な役割を果たした。転送時に生じる量子不確定性の問題は長年の研究課題であり、現在でも転送成功率は99.97パーセントに留まっている。転送失敗時の復元技術も継続的に改善されている。",
  },
  {
    id: "重力崩壊弾頭",
    name: "重力崩壊弾頭",
    nameEn: "Gravity Collapse Warhead",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "Alpha Venomがノスタルジア・コロニーを攻撃する際に使用した究極の大量破壊兵器。局所的な重力場を崩壊させ、対象領域を時空の欠落へと陥没させる恐るべき威力を持つ。この攻撃は当時わずか10歳であったミナに「戦略への目覚め」という決定的な影響を与え、彼女を宇宙規模の安全保障問題に向き合わせる契機となった。兵器の使用は国際的な非難を浴び、のちに銀河系コンソーシアムによって同種兵器の開発・保有が厳しく制限される条約が締結された。",
  },
  {
    id: "次元兵器",
    name: "次元兵器",
    nameEn: "Dimension Weapon",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "空間ホール質量破壊兵器。高次元エネルギーを解放し広範囲を破壊する超兵器。アポロン・ドミニオン大戦（E370〜E385年）の教訓から開発された系譜の兵器である。",
  },
  {
    id: "ディメンション・ブリッジ",
    name: "ディメンション・ブリッジ",
    nameEn: "Dimension Bridge",
    category: "技術",
    subCategory: "技術・概念",
    description: "恒久的星間ポータル。E289〜E300年に運用開始。M104銀河全体との貿易を10倍に拡大。",
  },
  {
    id: "バイオリアクター",
    name: "バイオリアクター",
    nameEn: "Bioreactor",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "搾取生物のエネルギーを効率的に変換・蓄積する装置。リリス・ヴェインがその設計・開発を主導し、搾取生物が吸収した生体エネルギーを電力や次元エネルギーに変換する仕組みを持つ。ZAMLTとEros-7の搾取体制におけるエネルギー供給の要であり、スクイーズ・アビスなど大規模な搾取施設の心臓部として機能した。シャドウ・ユニオンのナノハッキング技術による妨害活動の主な標的となり、Eros-7のエネルギーインフラの脆弱性を露呈した。",
  },
  {
    id: "ブラックダイス",
    name: "ブラックダイス",
    nameEn: "Black Dice",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "アイリスの独自の特殊武器であり、戦闘術と戦略分析を組み合わせたダイス型の多機能武装。投擲されたダイスの出目結果に応じて攻撃パターンや戦術支援効果が変化する特性を持ち、戦闘中の不確定性を戦術的優位に転換するユニークな武器システム。アイリスの卓越した戦略的思考と直感力と相まって、予測不可能な攻撃パターンで敵を翻弄する。ダイスの各面には異なる次元エネルギーが刻印されており、出目によって元素攻撃や治療、防御強化など多様な効果を発揮する。",
  },
  {
    id: "ブルーワイヤ",
    name: "ブルーワイヤ",
    nameEn: "Blue Wire",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "アイリスの代名詞的武装であり、特殊な青色ワイヤーを操作して戦闘を行う技術。伸縮自在のナノファイバー製ワイヤーは鋼鉄以上の強度を持ち、敵の拘束、移動の補助、物理攻撃など多様な用途に使用される。ワイヤーの色が青いのは内部を流れる次元エネルギーの波長に由来し、アイリスの能力に共鳴して最適な強度と柔軟性を発揮する。複数のワイヤーを同時に操作して空中に網を張ったり、ワイヤーを伝って高速移動したりと、アイリスの戦闘スタイルの中核をなす。",
  },
  {
    id: "ウォーター・オーブ",
    name: "ウォーター・オーブ",
    nameEn: "Water Orb",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "アイリスが操纵する水属性の特殊能力。周囲の水分を凝集させてウォーターオーブを生成し、防御壁として展開したり、高圧水流として攻撃に転用したりする。オーブのサイズと圧力はアイリスの集中力に応じて自在に調整可能で、最大出力時には建物の壁面を切断するほどの切断力を発揮する。防御面では物理攻撃とエネルギー攻撃の両方を緩和する効果があり、ブルーワイヤと組み合わせた戦闘スタイルでアイリスの高い総合戦闘能力を支える。",
  },
  {
    id: "フェルミ音楽",
    name: "フェルミ音楽",
    nameEn: "Fermi Music",
    category: "用語",
    subCategory: "技術・概念",
    description:
      "セリア黄金期（E335〜E370年）に最盛期を迎えた独自の音楽体系。次元極地平の共振現象を音響に応用し、通常の周波数帯を超えた音波を生成することで聴覚だけでなく感情に直接働きかける革新的な音楽を創造した。AURALISの創作理念の源流となり、のちにAURALIS Collectiveが確立する総合芸術運動の基礎を形成した。Poitiersに研究機関と芸術院が集積し、現在でもフェルミ音楽の復興祭が定期的に開催されている。",
  },
  {
    id: "エスパー能力",
    name: "エスパー能力",
    nameEn: "Esper Ability",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "テレパシーや念動力、エネルギー操作といった超常的な精神能力の総称。シルヴィア・クロウは特に強力なエスパー能力の持ち主であり、Eros-7で発生した搾取生物危機の収束に決定的な役割を果たした。彼女は能力を用いて暴走した搾取生物の制御を試み、危機の沈静化に貢献した。エスパー能力の発現には先天的な素質と後天的な訓練の両方が関与するとされ、ヒーローエージェンシーでは能力者の早期発見と育成プログラムが実施されている。能力の強度には個人差が大きく、一部の高能力者は都市規模の影響力を持つとされる。",
  },
  {
    id: "10次元ホラズム理論",
    name: "10次元ホラズム理論",
    nameEn: "10-Dimensional Horasm Theory",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "ティムール・シャーが提唱した画期的な高次元物理学理論。宇宙が10次元のホラズム（振動モード）の重なり合わせとして記述されるという理論で、従来の超弦理論を大幅に拡張したもの。この理論はペルセポネ仮想宇宙の設計原理と次元ピラミッドの理論的基盤の両方を提供し、シンフォニー・オブ・スターズ圏における次元物理学の発展を決定的に方向づけた。理論の数学的証明は未だ一部が未完成であるが、テクノ文化ルネサンス以降の応用研究は目覚ましい進展を遂げている。",
  },
  {
    id: "サイケデリック・コスモロジー",
    name: "サイケデリック・コスモロジー",
    nameEn: "Psychedelic Cosmology",
    category: "用語",
    subCategory: "技術・概念",
    description:
      "テミルタロンが提唱した独自の宇宙論的哲学体系。次元極地平を単なる物理現象ではなく、宇宙の意識的構造の顕現として解釈し、物質世界と精神世界の境界を溶解する宇宙観を構築した。このコスモロジーはテクノ宗教運動の思想的基盤となり、次元ピラミッドの構想の原型を提供した。サイケデリックな体験を通じた高次元認識の開拓を重視し、技術啓蒙時代の合理主義に対する重要な対抗思想として機能した。現在でもテンプル・オブ・ホライゾンの教学における根本教義となっている。",
  },
  {
    id: "ラブマーク",
    name: "ラブマーク",
    nameEn: "Love Mark",
    category: "用語",
    subCategory: "技術・概念",
    description:
      "ヴェルリット一族（魔女）が代々使用する特殊な印であり、その詳細は多くの謎に包まれている。印を施すことで空間の歪みやエネルギーの流れを操作する効果があるとされ、ヴェルリット一族の戦闘術や呪術の中核技術となっている。ラブマークを使用した攻撃は通常の物理的防御を容易に貫通し、対象の生体エネルギーに直接干渉する特性を持つ。アイリスがクレセントでヴェルリット一族と交戦した際、この印の技術の脅威を身をもって経験した。印の起源や仕組みについては学術的な解明が進んでいない。",
  },
  {
    id: "精子レジストリ",
    name: "精子レジストリ",
    nameEn: "Sperm Registry",
    category: "用語",
    subCategory: "組織・制度",
    description:
      "Eros-7の男性指令省が運用する男性の遺伝情報管理システム。Eros-7の女性主導社会において、男性の社会参加と繁殖を統制する目的で作られた。登録された男性の遺伝情報に基づいて適格性判定と労働配分が行われる仕組みで、多くの男性がこの制度に不満を抱いていた。E525年のマトリカル・リフォーム運動で男女平等化が強く要求され、現在では制度の透明性と公平性の改善が進んでいる。この制度をめぐる論争はEros-7のジェンダー問題を象徴する議論となっている。",
  },
  {
    id: "トゥキディデスの罠（概要）",
    name: "トゥキディデスの罠",
    nameEn: "Thucydides Trap",
    category: "用語",
    subCategory: "用語",
    description:
      "新興大国が台頭する際、現存大国との間に構造的な対立が生じ、戦争が不可避的に勃発するという国際政治理論。古代ギリシャの歴史家トゥキディデスがペロポネソス戦争の分析で提唱した概念を宇宙規模に適用したもの。銀河系コンソーシアムはこの罠の回避を最重要政策目標として掲げ、特にグランベル（経済1位）とティエリア（軍事3位）の関係に危険性を指摘している。かつてのアポロンとSelinopolisの関係も同様の構造だったと分析され、その教訓が現在の外交政策に反映されている。詳細は「トゥキディデスの罠」（宇宙文明圏）を参照。",
  },
  {
    id: "マルチバース開拓",
    name: "マルチバース開拓",
    nameEn: "Multiverse Exploration",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "異なる宇宙・次元への進出を目的とした技術体系と探査活動の総称。グランベルが最も注力した分野であり、次元を超える技術を駆使して別次元のエネルギー源やリソースを取り込むことを目指す。マルチバース開拓は単なる宇宙探査を超え、異次元の物理法則やエネルギーを利用した技術革新の源泉となっている。グランベルはこの技術を独自開発し、他文明圏との経済格差を決定的なものにした。マルチバース開拓の副作用として、次元境界の不安定化や次元の歪みと呼ばれる現象が発生しており、これはスライム・ウーマンの顕現（E340年）や次元ピラミッド理論の根幹をなす概念としてEDU宇宙論の核心をなす。また、ペルセポネ計画や次元ピラミッドの構想もマルチバース開拓の延長線上にある。現在、グランベルのみが実用化レベルに到達しており、他勢力は基礎研究段階にとどまっている。ディオクレニスのネイサン・コリンドが提案した宇宙共同探査プロジェクトには、マルチバース開拓の成果共有が含まれている。",
  },
  {
    id: "レーン",
    name: "レーン・システム",
    nameEn: "Lane System",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "プロキオが開発・運営する宇宙規模の物流・輸送ネットワークシステム。レーンは数百の恒星系間航路を有機的に接続し、各航路に応じた最適輸送ルートをリアルタイムで算出・提供する。このシステムにより、プロキオは宇宙で最も効率的な物流を実現している。レーン・システムの核心はAI駆動の経路最適化アルゴリズムであり、各航路の混雑状況、天候現象、次元境界の不安定区域などをリアルタイムで分析し、最も安全で迅速なルートを提示する。また、緊急時には特別輸送チャンネルを開設し、医療物資や軍需品の優先輸送を行う機能も備えている。レーン・システムはオープンアーキテクチャで設計されており、他文明圏の物流インフラとの統合も可能。実際にグランベルやエレシオンもレーンの一部機能を自勢力の物流システムに統合しており、宇宙全体の物流のデファクトスタンダードとなっている。",
  },
  {
    id: "クアンタ",
    name: "クアンタ・ラボ",
    nameEn: "Quanta Lab",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "ロースターの研究開発部門であり、次元間通信技術と量子ネットワークの最前線研究を行う機関。クアンタ・ラボでは超高速量子コンピューティング、次元干渉低減技術、量子暗号理論、そして次元境界の安定化技術などの研究が進められている。中でも次元境界の安定化研究は宇宙全体の安全保障に直結する重要課題であり、境界の不安定化が大規模災害を引き起こす可能性が指摘されているため、全文明圏から注視されている。クアンタ・ラボの研究成果はロースター・コアのインフラに迅速に実装されるオープンイノベーション・モデルを採用しており、新しい通信技術は数ヶ月以内に宇宙全体に展開される。クアンタの研究チームにはディオクレニスからの出向研究者も含まれており、宇宙共同探査プロジェクトの通信インフラ設計も担当している。現在、次元間通信の帯域拡大と低エネルギー化の両立を目指した次世代量子通信プロトコルの開発が進められている。",
  },

  /* 民族集団 */
  {
    id: "フェンドラ人",
    name: "フェンドラ人",
    nameEn: "Fendra",
    category: "用語",
    subCategory: "民族集団",
    description:
      "技術革新と工業発展を第一の価値観とする北欧系の移民集団であり、シンフォニー・オブ・スターズに到来した三大移民集団の一つ。寒冷な惑星環境への適応の過程で高度なエンジニアリング技術を発展させ、冶金学や機械工学の分野で際立った貢献を果たした。Gigapolisの化学工業都市Chemはフェンドラ人の技術を基盤に発展した。合理的な思考と効率性を重んじる文化を持ち、技術啓蒙時代の主要な推進勢力の一つとして西大陸の近代化に大きく寄与した。",
  },
  {
    id: "アーキアン",
    name: "アーキアン",
    nameEn: "Archian",
    category: "用語",
    subCategory: "民族集団",
    description:
      "過酷な惑星環境への適応能力に優れたアジア系の移民集団であり、三大移民集団の一つ。生物学的な環境適応技術と持続可能な農業システムを開発し、当初は不毛とされた地域の開拓に成功した。特に水資源管理と土壌改良技術において卓越した成果を挙げ、シンフォニー・オブ・スターズの食料安全保障の基盤を築いた。文化面では祖先崇拝と自然との調和を重んじる哲学があり、テクノ宗教運動とも共鳴する思想を持つ。西大陸の人口の主要な構成要素の一つである。",
  },
  {
    id: "ポロンポロ",
    name: "ポロンポロ",
    nameEn: "Polonpolo",
    category: "用語",
    subCategory: "民族集団",
    description:
      "母星の文化遺産と伝統の保存を最優先課題とするオセアニア系の移民集団であり、三大移民集団の一つ。移住に際して膨大な文化資料と言語データを持ち込み、独自の教育システムを通じて次世代への継承に努めた。他の移民集団が技術的適応を追求する中、ポロンポロは精神的・文化的アイデンティティの維持に注力し、音楽、舞踊、口承文芸の分野で豊かな遺産を残している。テクノ文化ルネサンス期には、伝統芸術と次元技術の融合という新たな文化表現を開拓した。",
  },
  {
    id: "Iris_Worlds",
    name: "アイリス・ワールズ",
    nameEn: "Iris Worlds",
    category: "用語",
    subCategory: "用語",
    description:
      "アイリス物語の公式ウェブサイトであり、ストーリーの全編と関連資料が公開されている。URLはhttps://irisworlds.netlify.app/story。E16系の世界観、登場人物、歴史年表、技術体系などに関する包括的な情報が掲載され、新規読者と既存ファンの両方に向けた情報ハブとして機能している。サイトは随時更新されており、最新のストーリー展開や設定の追加情報が反映されている。",
  },

  /* ═══════════════════════════════════════════
     宇宙勢力 — eduuni.txt
     ═══════════════════════════════════════════ */
  {
    id: "グランベル",
    name: "グランベル",
    nameEn: "Granbell",
    category: "用語",
    subCategory: "宇宙文明",
    description:
      "宇宙ランキング第1位の経済大国。GDP150兆ドルで宇宙全体の約25%を占める。首都はオルダシティ。アポロン・Dominion大戦を傍観し、戦後混乱期に一気に浮上。マルチバース開拓と次元間技術で他文明を圧倒。エヴァトロンに最新鋭兵器（重力崩壊弾頭等）を供与。現大統領アルゼン・カーリーンは第一回宇宙連合会合を主催した。",
    era: "現在",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },
  {
    id: "ティエリア",
    name: "ティエリア",
    nameEn: "Tyeria",
    category: "用語",
    subCategory: "宇宙文明",
    description:
      "宇宙ランキング第3位。軍事技術において宇宙最高峰。圧倒的な艦隊と卓越した戦術力で知られ、宇宙規模の防衛ネットワークを構築。総帥グレイモンド・ハウザーが「軍事力なくして平和は守れない」と主張。近年は軍事技術の輸出を経済基盤として活用。グランベルとの間にトゥキディデスの罠の危険性が指摘されている。",
    era: "現在",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },
  {
    id: "エレシオン",
    name: "エレシオン",
    nameEn: "Elyseon",
    category: "用語",
    subCategory: "宇宙文明",
    description:
      "宇宙ランキング第2位。医療技術と環境再生技術で宇宙をリード。女王リアナ・ソリスの下、平和主義・技術共有推進の外交姿勢で幅広い支持を得る。「生命の維持と再生」を文明の根幹に置き、支配や経済的優位性ではなく技術援助を通じて影響力を行使。第一回宇宙連合会合でティエリアの軍拡に反対した。",
    era: "現在",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },
  {
    id: "ファルージャ",
    name: "ファルージャ",
    nameEn: "Fallujah",
    category: "用語",
    subCategory: "宇宙文明",
    description:
      "宇宙ランキング第4位。経済力では上位勢力に劣るが、文化的影響力と外交力で他の追随を許さない。宇宙中の文明間交流を主導し、対立する勢力間の調停役として機能。評議会代表マドリス・カーネルが「文化の力が宇宙全体を結びつける鍵になる」と主張。",
    era: "現在",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },
  {
    id: "ディオクレニス",
    name: "ディオクレニス",
    nameEn: "Dioclenis",
    category: "用語",
    subCategory: "宇宙文明",
    description:
      "宇宙ランキング第5位。宇宙探査と科学技術研究の最前線。未知の次元や新しい惑星系の開拓を続け、研究成果は他勢力の重要インフラ。科学宰相ネイサン・コリンドがトゥキディデスの罠を科学的に指摘し、対立のエネルギーを共同宇宙探査へ転換する提案を行った。",
    era: "現在",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },
  {
    id: "エレシュ",
    name: "エレシュ",
    nameEn: "Eresh",
    category: "用語",
    subCategory: "宇宙文明",
    description:
      "宇宙ランキング第6位。精神的指導と宗教的影響力を持つ勢力。多くの文明がその教義に基づいた秩序を築いており、経済力や軍事力ではなく思想的影響力を源泉とする。時には他勢力の政治的決定を動かすほどの力を発揮する。",
    era: "現在",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },
  {
    id: "プロキオ",
    name: "プロキオ",
    nameEn: "Prokio",
    category: "用語",
    subCategory: "宇宙文明",
    description:
      "宇宙ランキング第7位。宇宙中の貿易ルートを掌握し、交易と物流を専門とする勢力。その活動は他のすべての勢力の経済活動に直接影響を与え、貿易ネットワークの要として機能する。",
    era: "現在",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },
  {
    id: "ロースター",
    name: "ロースター",
    nameEn: "Roastar",
    category: "用語",
    subCategory: "宇宙文明",
    description:
      "宇宙ランキング第8位。次元間通信や量子ネットワークの発展において他をリードする技術革新特化型勢力。その通信・ネットワーク技術は多くの勢力によって利用され、宇宙全体のインフラとして機能する。",
    era: "現在",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },
  {
    id: "アポロン文明圏",
    name: "アポロン文明圏",
    nameEn: "Apollon",
    category: "用語",
    subCategory: "歴史",
    description:
      "かつて宇宙に名を馳せた巨大文明圏。最盛期GDP125兆ドル。中核惑星アポロン・セントラリスを拠点に、強力な軍事組織「アポロンの騎士団」を擁した。リーダー・ロナン・アーサがセリアに同盟を提案したが拒絶され全面戦争に発展。ヴェノム艦隊に敗れロナンは戦死。大戦後GDP32兆ドルに激減し現在は主要勢力から脱落。",
    era: "歴史上",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },
  {
    id: "Selinopolis",
    name: "Selinopolis（ドミニオン）",
    nameEn: "Selinopolis / Dominion",
    category: "用語",
    subCategory: "歴史",
    description:
      "セリア・ドミニクスがGigapolisを掌握後に改名した都市国家。GDP25兆ドルに急成長。次元エネルギー技術の商業化と女性主導社会を確立。超巨大企業Phovosを設立。エヴァトロンと同盟してアポロンと大戦し勝利したがGDPは23兆ドルに激減。戦後エヴァトロンに吸収されセリアは追放。その遺産は現在のE16系に大きな影響を与えている。",
    era: "歴史上",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },
  {
    id: "宇宙連合会合",
    name: "宇宙連合会合",
    nameEn: "Universal Federation Summit",
    category: "用語",
    subCategory: "歴史",
    description:
      "グランベルの首都オルダシティで開催された第一回宇宙連合会合。アルゼン・カーリーン（共存繁栄）、グレイモンド・ハウザー（軍事力の必要性）、リアナ・ソリス（平和・技術共有）、マドリス・カーネル（文化の力）、ネイサン・コリンド（トゥキディデスの罠回避・共同探査）が演説。宇宙秩序の構築に向けた対話が始まった。",
    era: "現在（E528〜）",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },
  {
    id: "アポロン・Dominion大戦",
    name: "アポロン・Dominion大戦",
    nameEn: "Apollon Dominion War",
    category: "用語",
    subCategory: "戦争・歴史事件",
    description:
      "アポロン文明圏とDominion（セリア率いるSelinopolis）の全面戦争。E370年に宣戦布告。E375年にアポロンがケンタウロスレーザー発射、E378年にセリアがG4ファントムパルスで応戦。E385年にセリアのヴェノム艦隊がアポロン・セントラリスを攻略・爆砕し戦争終結。両文明とも壊滅的損害を受け、宇宙秩序は大きく変容した。なおE400年のエヴァトロンによるGigapolis占領は戦争終結とは別事象である。",
    era: "E370〜E385",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },
  {
    id: "オルダシティ",
    name: "オルダシティ",
    nameEn: "Olda City",
    category: "用語",
    subCategory: "地理",
    description:
      "グランベルの首都。次元間通信技術の発祥地、量子経済の中心地。宇宙で最も発展した都市。オルダ・プライムホールは次元の歪みを利用して設計され数万人収容可能。第一回宇宙連合会合開催地。",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },
  {
    id: "アポロン・セントラリス",
    name: "アポロン・セントラリス",
    nameEn: "Apollon Centralis",
    category: "用語",
    subCategory: "地理",
    description:
      "アポロン文明圏の中核惑星。全軍事力はここから動員された。アポロン・Dominion大戦の最終局面でセリアのヴェノム艦隊に攻略・爆砕され、アポロン文明圏壊滅の象徴となった。",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },

  {
    id: "トゥキディデスの罠",
    name: "トゥキディデスの罠",
    nameEn: "Thucydides Trap",
    category: "用語",
    subCategory: "宇宙文明圏",
    description:
      "新興大国と現存大国の間に不可避的に対立が生じる国際関係理論。ディオクレニスのネイサンが提起し、グランベル（経済1位）とティエリア（軍事3位）の関係にこの罠の危険性を指摘。かつてのアポロン・Dominion関係も同様の構造だった。",
    sourceLinks: [
      {
        url: "https://raw.githubusercontent.com/gentaron/edutext/main/eduuni.txt",
        label: "eduuni.txt",
      },
    ],
  },

  /* 宇宙勢力 — 組織 */
  {
    id: "エレシュ・サンクチュアリ",
    name: "エレシュ・サンクチュアリ",
    nameEn: "Eresh Sanctuary",
    category: "組織",
    subCategory: "宇宙勢力",
    description:
      "エレシュ信仰の総本山であり、宇宙最大の宗教的聖地。次元の境界領域に建設され、物理的な寺院構造と精神世界的な聖域が融合した特異な空間を形成している。サンクチュアリ内部では、次元境界の共鳴を利用した瞑想儀式が行われ、高位の神官たちはこれによって宇宙の「脈動」を感知し未来予知に近い洞察を得ているとされる。サンクチュアリの中枢には「万神の間」と呼ばれる大殿堂があり、エレシュの教義における宇宙創造の根源的な精神理念が具現化されている。エレシュ信者の巡礼目的地であり、毎年数万人が訪れる。宇宙連合会合において、エレシュは思想的影響力を背景に他の宇宙勢力とは異なるアプローチで問題解決を主導し、時にはグランベルやティエリアの政治的決定を動かすほどの力を発揮している。サンクチュアリの周辺には多くの修行施設と研究機関が立ち並び、宗教と科学の融合というエレシュ独自の学問が展開されている。",
  },
  {
    id: "オラクル",
    name: "オラクル",
    nameEn: "Oracle",
    category: "組織",
    subCategory: "宇宙勢力",
    description:
      "エレシュの最高意思決定機関であり、大司教と複数の神官長で構成される宗教的最高議会。オラクルはエレシュ信仰の教義解釈権を持ち、宇宙規模の信仰共同体の指針を決定する。その決定は教義の解釈だけでなく、宇宙連合会合などの政治の場にも直接的な影響を与える。オラクルの予言や声明はエレシュ信者のみならず、他勢力の指導者にも無視できない影響力を持っている。オラクルは次元境界の不安定化に対する警告を何度も発しており、その予言の的中率は宇宙最高と評されている。マドリス・カーネル（ファルージャ評議会代表）とは外交関係にあり、ファルージャの文化的影響力とエレシュの精神的影響力の協調を図っている。オラクルの声明文は特殊な次元共鳴技術で広範囲に同時送信され、宇宙中の聖地で同時に受信される。",
  },
  {
    id: "セラフィム",
    name: "セラフィム",
    nameEn: "Seraphim",
    category: "組織",
    subCategory: "宇宙勢力",
    description:
      "エレシュの外務・広報を担う機関であり、宇宙への教義伝播と対外折衝の役割を果たす。セラフィムは文字通り「熾天使」を意味し、エレシュ信者が他文明圏に対して活動する際の窓口となる組織である。セラフィムの伝道師たちは宇宙各地に派遣され、エレシュの教義を独自の儀式音楽と瞑想技法を通じて広めている。特にE16文明圏では、セリア黄金期（E335〜E370）のAURALISと精神的な共鳴が指摘されており、AURALISの「光と音を永遠にする」という理念とエレシュの宇宙観の間に思想的な類似性があるとされている。セラフィムは平和的な広報活動を基本方針としているが、他勢力の政治的決定に対してはオラクルの名のもと強い発言を行うこともある。第一回宇宙連合会合では、エレシュ代表として参加し、精神的指導の重要性を主張した。セラフィムの拠点はグランベルのオルダシティ、ティエリアのティエリア・フォートレス、ファルージャのファルージャ・ハブなど各主要都市に置かれている。",
  },
  {
    id: "コマース",
    name: "コマース・ディヴィジョン",
    nameEn: "Commerce Division",
    category: "組織",
    subCategory: "宇宙勢力",
    description:
      "プロキオの商業取引を統轄する部門であり、宇宙最大の商業センター。コマースは金融・為替・保険・投資のすべてを管理し、宇宙規模の商業取引の安全と公正を担保する役割を持つ。プロキオの「市場の透明性」を基本理念とし、全取引の記録と監査を行うことで詐欺行為を防止している。コマースは独自の商業裁判所を持ち、取引紛争の解決を迅速かつ公正に行う。また、宇宙共通通決済システム「プロキオ・クリア」を開発・運営しており、全文明圏で利用可能な決済インフラを提供している。この決済システムはnトークン経済とも互換性を持ち、E16系内での取引から銀河規模の貿易までカバーしている。コマースの活動は宇宙経済の基盤を支える不可欠な存在であり、プロキオ・ネクサスとともに宇宙の経済的循環の心臓部として機能している。",
  },
  {
    id: "バザール",
    name: "バザール・ネットワーク",
    nameEn: "Bazaar Network",
    category: "組織",
    subCategory: "宇宙勢力",
    description:
      "プロキオが運営する宇宙最大の市場ネットワーク。バザールは物理的な市場施設だけでなく、次元間通信技術を活用したバーチャル市場プラットフォームも含み、あらゆる商品・サービスが取引される。バザール・ネットワークに参加する加盟店は数十万に上ると推定され、宇宙最大の商業生態系を形成している。バザールではプロキオの品質認証システムが適用され、取引される商品の信頼性が担保されている。また、バザールは情報取引の場としても機能し、他文明圏の最新技術情報や市場動向がリアルタイムで共有される。プロキオの収益の大部分はバザールの取引手数料と品質認証料金から成っており、この収益構造がプロキオの経済的基盤を支えている。バザールの市場動向は宇宙経済のバロメーターとして機能し、プロキオ・ネクサスの取引所の価格変動が全宇宙の物価に直接的な影響を与えている。",
  },
  {
    id: "シグナル",
    name: "シグナル・オペレーション",
    nameEn: "Signal Operation",
    category: "組織",
    subCategory: "宇宙勢力",
    description:
      "ロースターの通信衛星ネットワークの運営を担う部門。シグナル・オペレーションは数千の通信衛星と中継基地を管理し、宇宙全域に安定した通信サービスを提供している。シグナルの通信網は「シグナル・ウェーブ」と呼ばれ、次元間の干渉に対する耐性を高めた独自の量子暗号プロトコルで保護されている。シグナル・オペレーションは緊急通信優先ルーティングを備えており、災害時や軍事的緊急事態には通常通信を迂回させて優先的に緊急メッセージを配信する。この機能はティエリアの防衛ネットワークとも連携して設計されており、軍事警報の伝達が最優先される仕組みになっている。シグナルの通信カバレッジはプロキオのレーン・システムとも統合されており、物流情報のリアルタイム追跡が可能となっている。シグナルの通信品質は宇宙最高水準であり、遅延は1光年あたり0.3秒以下を実現している。",
  },
  {
    id: "リンク",
    name: "リンク・プロトコル",
    nameEn: "Link Protocol",
    category: "組織",
    subCategory: "宇宙勢力",
    description:
      "ロースターが開発した宇宙標準通信プロトコルであり、全文明圏で採用されている通信の基盤技術。リンク・プロトコルは異なる文明圏の通信システム間の相互接続性を確保するために設計された、オープンスタンダードの通信規格である。リンクの最大の特徴は、経済取引システム、医療データシステム、軍事通信システム、学術研究ネットワークなど、用途を問わずあらゆる通信を単一のプロトコルで統合できる点にある。これにより、文明圏を超えたシームレスな通信とデータ共有が可能となり、UECOの経済取引や銀河系コンソーシアムの共同プロジェクトなどの基盤技術となっている。リンクはバージョンアップを重ねており、最新版は「リンク7.2」と呼ばれる。バージョン7.2ではロースターの次世代量子通信技術が組み込まれ、より高速で安全な通信が実現している。リンクの技術仕様は全文明圏に公開されており、独自の拡張機能を追加できる拡張性を持つ。",
  },

  /* 宇宙拠点 — 地理 */
  {
    id: "ヴェズレル",
    name: "ヴェズレル",
    nameEn: "Vezrel",
    category: "地理",
    subCategory: "宇宙拠点",
    description:
      "エレシュ信仰の中枢拠点であり、サンクチュアリを擁する惑星系。エレシュ教義において「真理の星」と呼ばれ、次元境界領に最も近い位置に浮かぶ特異な惑星系である。ヴェズレルの地表には、自然発生した結晶構造体が点在し、これらはエレシュの教義において「次元の言葉」と解釈され、オラクルの予言解釈に用いられている。惑星系全体が強い精神波的エネルギーに包まれており、非信者であってもヴェズレルに到達すると独特の精神的感応を経験するとされる。エレシュの研究機関が惑星系内に設けられており、宗教と科学の融合研究の最前線基地として機能している。ヴェズレルの経済は巡礼者による宗教産業が中心だが、近年はエレシュの精神的影響力を求めて他文明圏からの寄付や投資も増加している。",
  },
  {
    id: "プロキオ・ネクサス",
    name: "プロキオ・ネクサス",
    nameEn: "Prokio Nexus",
    category: "地理",
    subCategory: "宇宙拠点",
    description:
      "プロキオの中核拠点であり、宇宙最大の交易ハブとして機能する惑星系。全宇宙の貿易ルートが交差する交通の要衝に位置し、数百の恒星系間航路が接続している。プロキオ・ネクサスには巨大な宇宙港と取引所が設けられ、あらゆる資源・技術・文化財が日々取引されている。プロキオの商工会議長の本部もこの惑星系に置かれ、宇宙規模の貿易ルートの管理と運営の中枢となっている。惑星系内の物流インフラは宇宙随一の効率を誇り、プロキオの技術部門が開発した超高速輸送システムにより、他文明圏に比べて物流コストが圧倒的に低い。プロキオ・ネクサスの経済活動は宇宙全体の物価と通貨の安定に直結しており、ここでの取引価格が宇宙の基準価格となっているため、プロキオの経済動向は全文明圏に波及する。エレシオンの医療物資やティエリアの軍事技術、グランベルの消費財がここで中継され、各勢力の経済はプロキオ・ネクサスを通じて相互に依存している。",
  },
  {
    id: "ロースター・コア",
    name: "ロースター・コア",
    nameEn: "Roastar Core",
    category: "地理",
    subCategory: "宇宙拠点",
    description:
      "ロースターの中核拠点であり、次元間通信技術と量子ネットワークの研究・開発拠点として機能する惑星系。ロースター・コアには宇宙最大の量子コンピューティングセンターが設置されており、次元間通信に必要な膨大なデータ処理をリアルタイムで行っている。また、次元の歪みを監視する早期警戒システムの中枢もここに置かれており、次元境界の不安定化を検知すると全宇宙の関連機関に警報を発する機能を持つ。ロースター・コアの通信インフラは宇宙全体に張り巡らされており、グランベルの量子経済システム、エレシオンの医療データネットワーク、ティエリアの軍事通信網、ファルージャの文化交流プラットフォーム、ディオクレニスの探査データ送信など、あらゆる文明圏の通信がロースター・コアを経由している。このため、ロースター・コアの安全性と安定性は宇宙全体の通信インフラの命運を握っていると言える。",
  },

  /* ═══════════════════════════════════════════════════════════════
     WIKI DATA — CIVILIZATION MAIN ENTRIES
     ═══════════════════════════════════════════════════════════════ */

  {
    id: "エレシュ",
    name: "エレシュ",
    nameEn: "Eresh",
    category: "組織",
    subCategory: "宇宙勢力",
    description:
      "宇宙第6位の文明圏で、宗教と精神的影響力を基盤とする神政国家である。大司教と複数の神官長で構成されるオラクルが最高意思決定機関として機能し、次元共鳴を用いた瞑想と予言の伝統は他文明圏にも広く影響を与えている。中枢聖星ヴェズレル（『真理の星』）を中心に、次元境界近くに建造されたエレシュ・サンクチュアリを主たる聖地とし、毎年数万人の巡礼者が訪れる。セラフィムを対外機関とし、活発な布教活動を通じて宇宙規模の信仰共同体を形成している。その予言の高精度さにより、グランベルやティエリアを含む複数の文明圏の政治的決断に直接的な影響を与えてきた。ファルージャのマドリス・カーネルとは古くから外交関係を維持し、文化的・精神的交流を深めている。プロキオとはサンクチュアリへの巡礼ルートを通じた経済的つながりを持ち、ロースターとは次元共鳴通信技術の共同研究を進めている。エレシュの「精神の力こそが宇宙を結びつける究極の糸である」という理念は、E16文明圏のAURALISが掲げる「光と音を永遠にする」という哲学と深い共鳴関係にあると指摘されている。",
  },
  {
    id: "プロキオ",
    name: "プロキオ",
    nameEn: "Prokio",
    category: "組織",
    subCategory: "宇宙勢力",
    description:
      "宇宙第7位の文明圏で、宇宙規模の交易・物流を掌握する商業国家である。商工会議長を最高責任者とし、中核拠点プロキオ・ネクサスを中心に全宇宙の商取引を管理している。コマース・ディヴィジョンが金融・為替・保険・投資を統轄し、AI物流ルーティングネットワーク「レーン・システム」が最適な輸送経路を算出する。レーン・システムはオープンアーキテクチャ設計を採用しており、グランベルとエレシオンが自勢力内に統合するほどの信頼性を獲得している。n-token経済と互換性を持つ「プロキオ・クリア」汎用決済システムにより、全文明圏間の決済を統一した。バザール・ネットワークを通じた数十万店舗の市場プラットフォームは宇宙最大の商業生態系を形成し、プロキオ・ネクサスでの価格設定が宇宙全体のベースライン価格を決定する。エレシオンとは医療物資優先配送協定を、ティエリアとは軍事物資の物流管理を、ファルージャとは文化財の交易ルートを、ディオクレニスとは科学機器の優先物流協定をそれぞれ結んでおり、その経済活動はすべての文明圏に直接的な影響を与えている。プロキオの存在は、グランベルの経済覇権とは異なる形で宇宙の安定を支える不可欠な基盤となっている。",
  },
  {
    id: "ロースター",
    name: "ロースター",
    nameEn: "Roastar",
    category: "組織",
    subCategory: "宇宙勢力",
    description:
      "宇宙第8位の文明圏で、次元間通信と量子ネットワーク技術の革新に特化した技術国家である。通信長官を最高責任者とし、中核拠点ロースター・コアを中心に量子コンピューティング研究と通信インフラの管理を推進している。シグナル・オペレーションが全宇宙の数千の通信衛星を管理し、1光年あたり0.3秒以下という宇宙最高水準の通信遅延を実現している。「リンク・プロトコル」は全文明圏で使用される唯一の汎用通信規格であり、経済取引・医療データ・軍事通信・学術研究ネットワークなどあらゆる通信を単一プロトコルで統合している。最新版のLink 7.2では次世代量子通信技術が組み込まれ、オープンイノベーションモデルにより新技術は数ヶ月で全宇宙に展開される。クアンタ・ラボでは最先端の量子プロトコル研究を実施し、ディオクレニスの研究者も参加する国際的な共同研究体制を構築している。次元不安定の早期警戒システムをロースター・コアに構築し、ティエリアの防衛ネットワークと接続して緊急ルーティングを確保している。グランベルの量子経済システム、エレシオンの医療データネットワーク、ファルージャの文化交流プラットフォーム、エレシュの次元共鳴通信研究など、あらゆる文明圏の通信インフラがロースターに依存しており、その安全性と安定性は宇宙全体の情報の命運を握っている。",
  },

  /* ═══════════════════════════════════════════════════════════════
     WIKI DATA — ZAMLT SUB-ENTRIES
     ═══════════════════════════════════════════════════════════════ */

  {
    id: "トロン・コーポレーション",
    name: "トロン・コーポレーション",
    nameEn: "Tron Corporation",
    category: "組織",
    subCategory: "組織・制度",
    description:
      "ZAMLTを構成する5超巨大企業の一つ。重工業と軍事技術を担当し、ZAMLTの武力面を支えた企業である。CEOはラファエル・ドレイク。旗艦「カリバーン」を擁する宇宙最大級の私設艦隊を保有し、ZAMLTの支配維持のための武力行使を担った。テクロサスとの全面戦争ではトロンの軍事力が主力として投入され、激戦の末にアルファ・ケインによってラファエル・ドレイクが打倒された。トロンの軍事技術遺産はZAMLT崩壊後も一部が流用され、シルバー・ヴェノムやエヴァトロンのΣ-Unitに影響を与えたとされる。E16文明圏における「企業が軍隊を保有する」という企業国家体制の極端な例として歴史的に評価されている。",
  },
  {
    id: "アロエオイル・コーポレーション",
    name: "アロエオイル・コーポレーション",
    nameEn: "Aloe Oil Corporation",
    category: "組織",
    subCategory: "組織・制度",
    description:
      "ZAMLTを構成する5超巨大企業の一つ。次元エネルギー技術と戦術的作戦立案を担当した企業である。リーダーはアイリス・ノヴァ。次元エネルギーを兵器化した「次元エネルギースーツ」を開発し、ZAMLTの精鋭部隊に装備させた。また、工作員ライラ・ヴァーシティを通じてアルファ・ケインのチームを次元刑務所「デッドホロウ」に幽閉するなど、諜報活動でも活躍した。nebura（星々の交響曲）の最終盤ではアイリス・ノヴァ自身が次元の荒野でアルファ・ケインのチームと決戦を展開し、リンダの残したデータを利用されたことで敗北した。アロエオイルの次元エネルギー技術はZAMLT崩壊後、セリア・ドミニクスによるPhovos次元エネルギー商業化の技術的基盤の一つとなった可能性が指摘されている。",
  },
  {
    id: "マモン・コーポレーション",
    name: "マモン・コーポレーション",
    nameEn: "Mammon Corporation",
    category: "組織",
    subCategory: "組織・制度",
    description:
      "ZAMLTを構成する5超巨大企業の一つ。金融と資産管理を担当した企業である。リーダーはカルロス・ヴァンダム。ZAMLTの経済覇権を支える資金調達と資産運用の中枢を担い、プロトコルXに必要な3京ドルの資金計画（3京ドル作戦）を立案した。慎重な戦略家であるカルロス・ヴァンダムの指導の下、マモンは常に最も保守的なアプローチを取り、ZAMLT内部での急進的な軍事展開には懐疑的な姿勢を維持した。ZAMLT崩壊後の経済的混乱期には、マモンの金融専門家の一部がUECOの設立に参加し、新たな経済框架の構築に寄与したとされる。名称は「富の神マモン」に由来し、企業国家体制における「富こそが力」という信条を象徴している。",
  },
  {
    id: "ゼブラ・コーポレーション",
    name: "ゼブラ・コーポレーション",
    nameEn: "Zebra Corporation",
    category: "組織",
    subCategory: "組織・制度",
    description:
      "ZAMLTを構成する5超巨大企業の一つ。次元技術の研究・開発を担当した企業である。リーダーはアーサー・グリム。次元境界の不安定領域を利用した次元兵器や次元刑務所の設計など、最も危険な技術領域を独占的に担った。ゼブラの工作員レイ・ヴァンデルトはアレンをシェンドバーグ次元に閉じ込めて殺害し、ZAMLTに抗う企業国家への警告とした。虚無の塔（Tower of the Void）でのEVILSとの秘密会合にもゼブラが関与しており、ZAMLTと次元間生命体の裏取引を仲介したとされる。ゼブラの次元技術はZAMLT崩壊後も一部が回収され、テクノ文化ルネサンス期の次元極地平技術の民生化に間接的に貢献した。",
  },
  {
    id: "ルレンツ・コーポレーション",
    name: "ルレンツ・コーポレーション",
    nameEn: "Lulentz Corporation",
    category: "組織",
    subCategory: "組織・制度",
    description:
      "ZAMLTを構成する5超巨大企業の一つ。科学研究と技術開発を担当した企業である。リーダーはエリザベス・リンドバーグ。プロトコルXの技術設計とカタリスト・コアの建造に深く関与し、ZAMLTの技術的優位性を維持するための研究開発を推進した。他の4企業が軍事や金融に偏重する中、ルレンツは純粋な科学的研究に注力する姿勢をとり、次元物理学や量子情報科学の分野で画期的な成果を挙げた。しかし、その研究成果はZAMLTの支配強化のために利用され、本来の平和的な科学技術が軍事転用された側面も持つ。ZAMLT崩壊後、ルレンツの研究施設の一部は惑星ビブリオのロレンツィオ国際大学に統合され、E16文明圏の学術研究の基盤を形成した。",
  },
  {
    id: "ストロベリー",
    name: "ストロベリー",
    nameEn: "Strawberry",
    category: "組織",
    subCategory: "組織・制度",
    description:
      "ZAMLT期に活動した中堅企業国家。CEOはアレン。20万以上の企業国家が乱立するGigapolis経済圏において、ZAMLTやその他のメタ企業の圧力に抵抗しながら独立を維持していた企業国家の一つである。規模はZAMLTの5大企業には遠く及ばないが、独自の技術力と商業網を持ち、Gigapolis経済圏の中堅層として機能していた。アレンは終末の星（Star of the End）計画への関与を通じてZAMLTの真の脅威を認識し、アルファ・ケインを戦士決定戦に推薦して抵抗の火種を撒いた。しかしアレンの殺害後、ストロベリーはZAMLTの報復攻撃を受け、消滅したとされる。ストロベリーの悲劇は、企業国家体制下で多数の中堅・小規模企業国家が直面した運命を象徴する出来事であり、ZAMLTの覇権の残酷さを浮き彫りにしている。",
  },
  {
    id: "プロトコルX",
    name: "プロトコルX",
    nameEn: "Protocol X",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "ZAMLTが開発した次元安定化デバイスであり、宇宙規模の次元崩壊を防ぐための緊急措置として構想された。終末の星（Star of the End）の「意志」がもたらす宇宙的脅威に対抗するため、ZAMLTのエリオット・シュトラスが提案した。プロトコルXの稼働には3京ドル（3 quintillion dollars）の資金が必要とされ、マモン・コーポレーションが「3京ドル作戦」の資金調達計画を立案した。この計画はZAMLTが全企業国家から資金を強制的に徴収するものであり、低階層市民へのさらなる搾取を意味した。しかしアルファ・ケインのチームは次元断層のエネルギーを代替エネルギー源として発見し、ZAMLTの搾取的な資金計画を拒絶した。プロトコルXを巡る攻防はZAMLTとシャドウ・リベリオン（のちにテクロサスと合流）の対立の核心であり、リンダの犠牲とアルファ・ケインの伴共役の覚醒という重大な結果をもたらした。プロトコルXの技術的遺産はのちの次元極地平技術の発展に影響を与えたとされる。",
  },
  {
    id: "次元の塔",
    name: "次元の塔",
    nameEn: "Dimensional Tower",
    category: "地理",
    subCategory: "施設・建造物",
    description:
      "ZAMLT本社の最深部に建造された特異な構造体で、ZAMLTの最終兵器として機能した。塔内部にはカタリスト・コアが設置されており、次元境界のエネルギーを直接操作する能力を持つ。アルファ・ケインとテクロサスの連合軍はZAMLTの本社最深处にあるこの次元の塔への侵入を最終目標とし、カタリスト・コアの破壊を試みた。塔の構造自体が次元境界の不安定領域に接続されており、通常の物理法則が適用されない特異空間となっている。最終決戦ではオメガ＝ユリシス（EVILSのリーダー）もこの次元の塔に出現し、アルファ・ケインの伴共役能力との激突が繰り広げられた。次元の塔の崩壊はZAMLTの終焉を象徴的に示す出来事であり、企業国家時代の終わりを告げる象徴となった。",
  },
  {
    id: "カタリスト・コア",
    name: "カタリスト・コア",
    nameEn: "Catalyst Core",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "次元の塔の中枢に設置されたZAMLTの核心技術デバイス。次元境界のエネルギーを触媒的に操作し、プロトコルXのエネルギー源として機能する。ルレンツ・コーポレーションのエリザベス・リンドバーグが設計を主導し、ゼブラ・コーポレーションの次元技術が組み込まれた。カタリスト・コアの破壊はアルファ・ケインとテクロサス連合軍の最終目標であり、その達成がZAMLTの物理的な終焉を決定づけた。コアの設計思想はのちに次元極地平技術の理論框架に影響を与え、テクノ文化ルネサンス期の空間ホール技術開発の遠因となった。カタリスト・コアの残骸は現在もZAMLT本社跡地の地下深くに眠っているとされるが、その正確な位置は特定されていない。",
  },
  {
    id: "シルバープラント",
    name: "シルバープラント",
    nameEn: "Silver Plant",
    category: "地理",
    subCategory: "施設・建造物",
    description:
      "ZAMLTの重要施設の一つで、次元エネルギーの精製と兵器生産を行う工場プラント。テクロサスとの全面戦争において、アルファ・ケインとクロノ・ヴァーレント率いるテクロサス部隊による浸透作戦の標的となった。シルバープラント攻略戦では、リンダがプロトコルXのエネルギーコアを安定化させるために自らを犠牲にするという悲劇的な決断を下した。彼女の犠牲はZAMLTに対する抵抗運動の転換点となり、アルファ・ケインの決意を固めさせた。シルバープラントの名は、プラントから放出される銀色の次元エネルギー光輝に由来する。ZAMLT崩壊後、シルバープラントの遺構は「シルバー・ヴェノム」の名称の由来となったという説があり、暗黒組織の歴史的起点として研究されている。",
  },
  {
    id: "伴共役",
    name: "伴共役",
    nameEn: "Ban-Kyōyaku",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "アルファ・ケインが覚醒させた特殊能力で、時空間を操作する次元干渉技術の一形態。「伴共役（ばんきょうやく）」の名は、二つの共役な変数が相伴って時空間の方程式を解くことに由来する。この能力は「次元の鍵（Dimensional Key）」と互いに共鳴する極少数の適合者のみが発現可能であり、アルファ・ケインは戦士決定戦での記憶迷宮の試練を経てこの適合性を開花させた。伴共役は空間の歪みの生成・消去、時間の局所的な加速・減速、次元境界の安定化など多様な応用が可能であり、クリストッフェル次元の不安定化を安定化させるためにも使用された。最終決戦ではリンダのデータと組み合わせてオメガ＝ユリシスを次元の繊維に封印する決定的な役割を果たした。伴共役の原理は現在でも完全には解明されておらず、惑星ビブリオの研究者たちがその理論的解明を試みている。次元極地平技術の民用化と伴共役の能力発現には共通の基盤理論がある可能性が指摘されている。",
  },
  {
    id: "EVILS",
    name: "イビルス",
    nameEn: "EVILS",
    category: "用語",
    subCategory: "技術・概念",
    description:
      "次元間に存在する超越的生命体群の総称。正式名称は不明であり、「EVILS」はE16文明圏が便宜上付けた呼称である。高次元領域に起源を持ち、物理法則を超越した能力を持つ。リーダーはオメガ＝ユリシス。一部のEVILSはディストーター（Dystroyer）と呼ばれる破壊的な個体であり、物理空間に顕現すると周囲の次元構造を崩壊させる危険性を持つ。ZAMLTの5企業のリーダーたちは虚無の塔（Tower of the Void）でオメガ＝ユリシスと秘密会合を持ち、次元安定化を条件に一定の取引を行ったとされるが、この協力関係は最終的に破綻した。EVILSの存在は次元極地平技術のリスクを象徴するものであり、次元境界へのアクセスがもたらす予期せぬ脅威としてE16文明圏の安全保障上の最大の懸念事項の一つとなっている。E340年のスライム・ウーマン顕現もEVILSの次元的活動との関連が疑われている。",
  },
  {
    id: "クリストッフェル次元",
    name: "クリストッフェル次元",
    nameEn: "Christoffel Dimension",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "アルファ・ケインのチームが星々の交響曲の旅で遭遇した特異な次元領域。名称は数学者クリストッフェルの記号に由来し、次元境界の幾何学的構造を応用した不安定な空間である。クリストッフェル次元は物理法則が通常空間と異なり、時間の流れや空間の構造が予測不可能に変動する危険な領域である。アルファ・ケインのチームはこの次元で「時の守護者（Guardian of Time）」と遭遇し、激しい戦闘を繰り広げた。伴共役（Ban-Kyōyaku）能力を使用してクリストッフェル次元の不安定化を安定化させたことは、アルファ・ケインが次元干渉能力を持つことを証明する決定的な出来事となった。クリストッフェル次元の存在は次元極地平技術の理論的基盤を拡張するものであり、テクノ文化ルネサンス期における次元物理学の飛躍的発展の遠因となったと評価されている。",
  },
  {
    id: "ギガポリス解放戦",
    name: "ギガポリス解放戦",
    nameEn: "Gigapolis Liberation War",
    category: "歴史",
    subCategory: "戦争・事件",
    description:
      "E318年にアルファ・ケインが率いるシャドウ・リベリオンによって引き起こされたZAMLT打倒の戦争。アルファ・ケインは量子ファイナンス・コアへの伝説的なハッキング攻撃を実行し、ZAMLTの経済的基盤に決定的な打撃を与えた。さらにGigapolisのメガタワー（ZAMLT本社）を武力占拠し、ZAMLTの資産の30%を低階層コミュニティに移転するという画期的な行動に出た。この戦争はエル・フォルハウスのマーストリヒト革命（E150年）から続く企業国家体制への抵抗運動の最高潮であり、最終的にZAMLTの崩壊を決定づけた。ギガポリス解放戦の勝利はE319年のJenによるValoria宮殿掌握という新たな権力秩序の始まりを告げ、さらにE335年からE370年のセリア黄金期への道を開いた。この戦争はE16文明圏における「企業国家の終焉」と「市民の自由の回復」を象徴する歴史的転換点として位置づけられている。シャドウ・リベリオンの地下活動のノウハウとテクロサスの軍事的支援が勝利の鍵であり、のちにシルバー・ヴェノムの母体となったシャドウ・リベリオン過激派の分岐もこの時期に生じたとされる。",
  },

  /* ═══════════════════════════════════════════════════════════════
     WIKI DATA — PROKIO / ROASTAR ADDITIONAL SUB-ENTRIES
     ═══════════════════════════════════════════════════════════════ */

  {
    id: "レーン・システム",
    name: "レーン・システム",
    nameEn: "Lane System",
    category: "技術",
    subCategory: "宇宙勢力",
    description:
      "プロキオが開発したAI駆動の恒星間物流ルーティングネットワークであり、宇宙最大の物流最適化システムである。レーン・システムは数千の恒星系間航路をリアルタイムで監視し、AIが需要予測・天候分析・次元境界の安定性・船団の位置情報などを総合的に分析して最適な輸送経路を算出する。最大の特徴はオープンアーキテクチャ設計であり、プロキオ以外の文明圏でも導入可能な構造になっている。グランベルは自勢力内にレーン・システムを統合して物流効率を飛躍的に向上させ、エレシオンも医療物資の優先配送のためにレーン・システムを導入した。レーン・システムのオープン性は、プロキオが「宇宙の物流は一つの文明に閉じるべきではない」という理念に基づいていることを示している。シグナル・オペレーションの通信網とも統合されており、物流情報のリアルタイム追跡が可能となっている。レーン・システムの普及は宇宙規模の貿易の活性化に直結し、テクノ文化ルネサンス期における異文明間交流の爆発的増加を支える基盤技術となった。",
  },
  {
    id: "プロキオ・クリア",
    name: "プロキオ・クリア",
    nameEn: "Prokio Clear",
    category: "技術",
    subCategory: "宇宙勢力",
    description:
      "プロキオが開発した宇宙共通の汎用決済システムであり、全文明圏間の取引を統一する決済インフラである。プロキオ・クリアの最大の特徴はE16文明圏の基軸通貨であるn-tokenとの完全な互換性であり、ローカル通貨とn-tokenの即時換金が可能である。これにより、文明圏を超えたシームレスな商取引が実現し、為替リスクと決済遅延が劇的に削減された。プロキオ・クリアはコマース・ディヴィジョンによって運営され、全取引の記録と監査を行うことで詐欺行為を防止する透明性の高いシステムとして機能している。また、グランベルの量子経済システムとも接続されており、E16文明圏内での取引と銀河規模の貿易が単一の決済インフラで処理される画期的な体制を構築している。プロキオ・クリアの普及は宇宙規模の経済統合を加速させ、銀河系コンソーシアムの設立（E495〜E500年）を支える経済的基盤の一つとなった。",
  },
  {
    id: "クアンタ・ラボ",
    name: "クアンタ・ラボ",
    nameEn: "Quanta Lab",
    category: "技術",
    subCategory: "宇宙勢力",
    description:
      "ロースターが運営する最先端の量子プロトコル研究施設であり、Link Protocolの次世代バージョンの開発拠点である。クアンタ・ラボでは常時数百人の研究者が最先端の量子通信技術の研究に従事し、Link 7.2の開発から次世代Link 8.0の構想まで、ロースターの通信技術の進化を支えている。最大の特徴はオープンイノベーションモデルの採用であり、ロースター以外の文明圏の研究者も参加できる国際的な共同研究体制を構築している。ディオクレニスの科学宰相ネイサン・コリンドは量子通信の安全性向上のためにクアンタ・ラボに研究者を派遣しており、両文明圏の科学技術協力の象徴的な拠点となっている。エレシュとは次元共鳴通信技術の共同研究を進めており、宗教的な次元共鳴瞑想と科学的な量子通信技術の融合という画期的な試みが行われている。クアンタ・ラボの研究成果はオープンイノベーションモデルにより数ヶ月で全宇宙に展開される体制が整っており、新技術の普及速度は宇宙最速を誇る。次元不安定の早期警戒システムの高度化もクアンタ・ラボの重要な研究テーマであり、宇宙全体の安全保障に直接的な貢献を果たしている。",
  },

  /* 西大陸都市 */
  {
    id: "ギガポリス",
    name: "ギガポリス",
    nameEn: "Gigapolis",
    category: "地理",
    subCategory: "西大陸都市",
    description:
      "シンフォニー・オブ・スターズ西大陸最大の都市であり、E16連星系の政治・経済・文化の中心地。E6年のパラトンを起源に、技術啓蒙時代の人口爆発と企業国家体制のコーポラタムパブリカ期の経済成長を経てメガロポリスへと発展。E150年のマーストリヒト革命でエル・フォルハウスがセントラル・タワーを占拠し自由経済を宣言。E301年にZAMLTの本社が置かれ経済覇権の象徴となったが、E318年のギガポリス解放戦でアルファ・ケインが解放。E335年セリア・ドミニクスによる黄金期を経てSelinopolisと改名。アポロン・Dominion大戦後エヴァトロンに吸収されエヴァポリスと強制改名。E475年エヴァトロン崩壊後Gigapolisに復帰。現在はValoria連合圏の下で安定した都市運営が続いている。地下街最深部はTina/Gueが支配。",
  },
  {
    id: "Poitiers",
    name: "Poitiers",
    nameEn: "Poitiers",
    category: "地理",
    subCategory: "西大陸都市",
    description:
      "Gigapolis圏の文化・学術都市。フェルミ音楽の研究機関と芸術院が集積する「音の都」。セリア黄金期にはAURALISの創作活動の拠点として機能し、フェルミ音楽の理論体系化が進められた。現在でもフェルミ音楽の復興祭が定期的に開催され、E16文明圏の音楽文化の中心地として機能している。",
  },
  {
    id: "Chem",
    name: "Chem",
    nameEn: "Chem",
    category: "地理",
    subCategory: "西大陸都市",
    description:
      "Gigapolis圏の化学工業都市。フェンドラ人の冶金・化学技術を基盤に発展し、ZAMLT期にはテスラ重工業連合の生産拠点として機能した。スライム危機後は環境浄化技術への転換が進み、クリーン生産のモデル都市として再編されている。",
  },
  {
    id: "Troyane",
    name: "Troyane",
    nameEn: "Troyane",
    category: "地理",
    subCategory: "西大陸都市",
    description:
      "Gigapolis圏の宗教都市。テクノ宗教運動の聖地であり、テンプル・オブ・ホライゾンとテミルタロンのゆかりの地。バーズ帝国時代の遺構が残り、軍事史研究の重要拠点。サイケデリック・コスモロジーの修行施設が周辺に立ち並ぶ。",
  },

  /* 歴史・時代 */
  {
    id: "第五次繁栄期",
    name: "第五次繁栄期",
    nameEn: "Fifth Prosperity Period",
    category: "歴史",
    subCategory: "歴史・時代",
    description:
      "メルディア戦争（E275〜E288）終結後、ロンバルディア帝国の覇権確立によってもたらされた繁栄期。次元兵器の軍事技術が民間に波及し、空間ホール技術の基礎研究が本格化した時期。しかし帝国の覇権は他勢力の反発を招き、のちのZAMLT台頭と企業国家間の抗争の遠因となった。",
  },

  /* 組織・制度 */
  {
    id: "戦士決定戦",
    name: "戦士決定戦",
    nameEn: "Warrior Determination Tournament",
    category: "用語",
    subCategory: "組織・制度",
    description:
      "ヒーローエージェンシーが主催する超常能力者の選抜大会。西大陸の安全保障を担う強力な能力者を選考・登用する公式の枠組みであり、アルファ・ケインもこの大会で伝説的な記憶迷宮の試練を経て伴共役能力を覚醒させた。戦士決定戦の上位入賞者はヒーローエージェンシーの正式エージェントとして採用される。E495年以降は銀河系コンソーシアムの下で宇宙規模の選抜大会へと拡大されている。",
  },

  /* 技術・概念 */
  {
    id: "次元ピラミッド",
    name: "次元ピラミッド",
    nameEn: "Dimension Pyramid",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "ティムール・シャーの10次元ホラズム理論とテミルタロンのサイケデリック・コスモロジーを統合した、E16文明圏の宇宙論的框架。次元の階層構造をピラミッド状にモデル化し、各層が異なる物理法則とエネルギー特性を持つと仮定する。ティムール・シャーのペルセポネ計画は次元ピラミッドの下層構造の探査を目的としており、スライム・ウーマンの顕現（E340年）は上位層（Tier Ω）からの干渉の結果と分析されている。テクノ文化ルネサンス期には惑星ビブリオで次元ピラミッドの数学的証明が進められ、ペルセポネとリミナル・フォージの基盤理論となっている。",
  },
  {
    id: "搾取生物",
    name: "搾取生物",
    nameEn: "Extraction Creature",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "Eros-7に原生する独特の生物群で、性的エネルギーや生体エネルギーを吸収・蓄積する能力を持つ。リリス・ヴェインが制御技術を開発しエネルギー資源として活用されたが、E380年の遺伝子変異によって他の生命体の生体エネルギーをも吸収するようになり、スライム危機の引き金となった。搾取生物の主要形態には搾取触手、搾取ヒル、搾取バクテリアなどがある。ZAMLTとEros-7の搾取体制を支えるエネルギー源であると同時に、Eros-7の女性主導社会の形成要因でもある。E505年には搾取バクテリアがナノメディシンとして転用される画期的な成果も生み出した。",
  },
  {
    id: "G4ファントムパルス",
    name: "G4ファントムパルス",
    nameEn: "G4 Phantom Pulse",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "セリア・ドミニクスがアポロン・Dominion大戦で応戦のために開発した次元エネルギー兵器。E378年にアポロンのケンタウロスレーザーに対抗して使用され、広範囲に次元構造を不安定化させる効果を持つ。この兵器はのちにシルバー・ヴェノムの名称の由来となり、E475年の組織設立の思想的・技術的基盤の一つとなったとされる。",
  },
  {
    id: "ケンタウロスレーザー",
    name: "ケンタウロスレーザー",
    nameEn: "Centaur Laser",
    category: "技術",
    subCategory: "技術・概念",
    description:
      "アポロン文明圏がアポロン・Dominion大戦（E370〜E385）で使用した超巨大レーザー兵器。E375年に発射され、Selinopolis（ドミニオン）側に壊滅的な被害をもたらした。しかしセリアはG4ファントムパルスで応戦し、最終的にE385年にヴェノム艦隊によるアポロン・セントラリス攻略でアポロン文明圏は壊滅した。この兵器の使用は次元兵器禁止条約の根拠の一つとなった。",
  },
]

/* ═══════════════════════════════════════════════════════════════
   ALL ENTRIES MERGED
   ═══════════════════════════════════════════════════════════════ */

const ALL_ENTRIES: WikiEntry[] = [...CHARACTERS, ...TERMINOLOGY]

export type { Category, SourceLink, WikiEntry }
export { CHARACTERS, TERMINOLOGY, ALL_ENTRIES }
