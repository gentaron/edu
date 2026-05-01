import type { WikiId } from "../../platform/schemas/branded"
import type { WikiEntry } from "@/types"

export const WIKI_CHARACTERS: WikiEntry[] = [
  /* Gigapolis/West Continent */
  {
    id: "Diana" as WikiId,
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
    id: "Jen" as WikiId,
    name: "ジェン",
    nameEn: "Jen",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "Lv938+。E319年にValoria宮殿を掌握し、ZAMLT崩壊後の権力真空を埋める形で台頭。現在もValoria連合圏を主導する現役最強格の一人。Alpha Kaneのギガポリス解放戦に触発されたとも言われ、新ZAMLT期の混乱を鎮め西大陸の安定を確立した。セリア・ドミニクスが構築したセリア黄金期の記憶を持つ数少ない存在であり、AURALISの理念にも深い理解を示す。EDU現代において最古参のTier 1アクティブ勢力として、その経験と実力は周囲から「生きた伝説」として畏怖されている。",
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
    id: "Tina/Gue" as WikiId,
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
    id: "セリア・ドミニクス" as WikiId,
    name: "セリア・ドミニクス",
    nameEn: "Celia Dminix",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "E335〜E370年にZAMLTを倒してSelinopolisへの改名を実現し、セリア黄金期の創設者となった歴史的人物。E365頃にはエヴァトロンと同盟を締結しGDP81京ドルに達成、都市名をDominionへ改称。フェルミ音楽の頂点・nトークン経済の確立・AURALISの最盛期導きの三分野すべてに革命をもたらし、EDU史上最も多面的な影響力を持つ統治者として神格化されている。AURALIS Collectiveの創設者ケイト・クラウディアやリリー・スタイナーとの協働がセリア黄金期の文化を支えた。のちのアポロン・Dominion大戦ではロナン・アーサの同盟提案を拒絶し、全面戦争へと至る道を選んだ。",
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
    id: "アルファ・ケイン" as WikiId,
    name: "アルファ・ケイン",
    nameEn: "Alpha Kane",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "E318年に覚醒したスティル・アレーナの元チャンピオン。シャドウ・リベリオンのリーダーとしてZAMLTに対する反乱を指揮し、テクロサスの戦士たちとも連携してオムニバス・エンジンへの伝説的なハッキングによってギガポリス解放戦でメガタワーを占拠。その過程で伴共役の覚醒という奇跡的な現象を起こし、プロトコルXを巡る攻防の決定的な局面を形成した。その勇姿はのちのセリア・ドミニクスを含む多くの者に影響を与え、EDU史上最も象徴的な革命家として神格化されている。\nこのアルファ・ケインの根底には、安全の監視者パラドックス(D2)と倫理の解除(D3)の思想的地層が横たわっている。コーポラトクラシー体制がもたらす「安全という名の抑圧」に対するD2の根源的な反逆精神と、既存の倫理規範を打ち破って新たな自由を切り拓くというD3の実践的姿勢が、彼の行動原理を支えている。",
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
    id: "エリオス・ウォルド" as WikiId,
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
    id: "エル・フォルハウス" as WikiId,
    name: "エル・フォルハウス",
    nameEn: "El Folhaus",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "通称「新時代のルーキー」。E150年にマーストリヒト革命を決起し、ギガポリスのセントラル・タワーを占拠して完全自由経済を確立した革命家。コーポラタムパブリカのコーポラトクラシー体制を打ち破り、西大陸に新たな経済秩序をもたらした。その行動は後のZAMLT期やセリア黄金期にも影響を与える画期的出来事となった。",
    era: "E150",
    affiliation: "コーポラタムパブリカ",
    tier: "歴史的人物",
    image: "https://raw.githubusercontent.com/gentaron/image/main/ElForhaus.png",
  },
  {
    id: "ティムール・シャー" as WikiId,
    name: "ティムール・シャー",
    nameEn: "Timur Shah",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "移民団のリーダーであり、10次元ホラズム理論の提唱者。E0年頃、過酷な宇宙環境を生き抜くため仮想多元宇宙「ペルセポネ」を設計し、移民たちの意識をアップロードする道を開いた。その理論は次元階梯パンディクトの構想へと発展し、EDU宇宙論の基礎を築いた。しかしペルセポネの実験事故はE340年のスライム・ウーマン顕現という予期せぬ結果をもたらした。",
    era: "E0頃",
    affiliation: "移民団",
    tier: "歴史的人物",
    image: "https://raw.githubusercontent.com/gentaron/image/main/TimurShah.png",
  },
  {
    id: "レイラ・ヴィレル・ノヴァ" as WikiId,
    name: "レイラ・ヴィレル・ノヴァ",
    nameEn: "Layla Virell Nova",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "Pink Voltage。E325年AURALIS参加。E380〜E400年のスライム危機ではオアシス・ハウスを拠点に英雄的活躍を見せ、プラズマカノンとナノファイバーブーツを駆使してスライムの巣を焼却した。E400年に冷凍保存され、E522年に目覚めた後はAURALIS Collective第二世代として活動。Pink Voltageの異名は電撃的な戦闘スタイルに由来する。AURALIS創設者の一人ケイト・クラウディアの理念を深く受け継ぎ、彼女が不在となってからもAURALISの精神的継承者として第二世代の活動を牽引している。",
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
    id: "弦太郎" as WikiId,
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
    id: "Kate Claudia" as WikiId,
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
    id: "Kate Patton" as WikiId,
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
    id: "Lily Steiner" as WikiId,
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
    id: "Lillie Ardent" as WikiId,
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
    id: "ミナ・エウレカ・エルンスト" as WikiId,
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
    id: "Ninny Offenbach" as WikiId,
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
    id: "アイリス" as WikiId,
    name: "アイリス",
    nameEn: "Iris",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "IRIS現代ランキング1位。ヴァーミリオンの英雄としてE480年頃から活動を開始し、ブルーワイヤとウォーター・オーブを駆使した独自の戦闘スタイルで数多の敵を打ち倒してきた。シルバー・ヴェノムとの長き戦いを経てE510年に捕囚されたが、E519年の再救出後はトリニティ・アライアンスの指導者としてV7とアルファ・ヴェノムとの二正面対峙に挑む。セバスチャン・ヴァレリウス率いるボグダス・ジャベリンとの連携も作戦成功の鍵となっている。",
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
    id: "ウィリー" as WikiId,
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
    id: "エレナ" as WikiId,
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
    id: "セバスチャン・ヴァレリウス" as WikiId,
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
    id: "ガレス" as WikiId,
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
    id: "フィオナ" as WikiId,
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
    id: "マリーナ・ボビン" as WikiId,
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
    id: "カスチーナ・テンペスト" as WikiId,
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
    id: "イズミ" as WikiId,
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
    id: "レオン" as WikiId,
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
    id: "ヴィヴィエッタ" as WikiId,
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
    id: "レヴィリア・サーペンティナ" as WikiId,
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
    id: "ミユシャリ" as WikiId,
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
    id: "ファリエル" as WikiId,
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
    id: "アイナ" as WikiId,
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
    id: "ギャビー" as WikiId,
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
    id: "シェロン" as WikiId,
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
    id: "イルミーゼ" as WikiId,
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
    id: "ホワイトノイズ" as WikiId,
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
    id: "ワドリナ" as WikiId,
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
    id: "ニニギス" as WikiId,
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
    id: "イェシバトー" as WikiId,
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
    id: "アザゼル" as WikiId,
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
    id: "ピアトリーノ" as WikiId,
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
    id: "アイク・ロペス" as WikiId,
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
    id: "レイド・カキザキ" as WikiId,
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
    id: "ミカエル・ガブリエリ" as WikiId,
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
    id: "ヨニック" as WikiId,
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
    id: "マスター・ヴェノム" as WikiId,
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
    id: "ゴルディロックス" as WikiId,
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
    id: "カタリナ" as WikiId,
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
    id: "ボブリスティ" as WikiId,
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
    id: "ギル" as WikiId,
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
    id: "ラストマン" as WikiId,
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
    id: "AJ" as WikiId,
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
    id: "Slime_Woman" as WikiId,
    name: "スライム・ウーマン",
    nameEn: "Slime Woman",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "E340年、ティムール・シャーが設計した仮想多元宇宙「ペルセポネ」の実験事故により、高次元世界（Tier Ω）からE16通常次元（Tier Ε）に顕現した超越的存在。スライム危機（E380〜E400）の遠因となったリーチ・ドレインの遺伝子変異にも間接的に関与している可能性がある。Tier 1アクティブ現役最強格であり、その能力の正体は高次元物理学の未解明領域に属する。人間社会の枠組みに完全に適応しているわけではなく、特定の個人（Junなど）とのみ特異な相互作用を示す。E340年の顕現から約200年近く存在し続ける、EDU中最も謎めいた存在。",
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
    id: "テミルタロン" as WikiId,
    name: "テミルタロン",
    nameEn: "Temirtalon",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "E80〜E90年代に活動した物理学者。サイケデリック・コスモロジーを提唱し、次元極地平を宇宙論的な枠組みで解釈して次元階梯パンディクトの原型を構想した。その理論的成果を具現化するためテンプル・オブ・ホライゾンを設計し、技術啓蒙時代の精神的・科学的支柱となった。彼の構想はのちのティムール・シャーの10次元ホラズム理論にも影響を与えたとされる。",
    era: "E80〜E90",
    affiliation: "テンプル・オブ・ホライゾン",
    tier: "歴史的人物",
    image: "https://raw.githubusercontent.com/gentaron/image/main/Temirtaron.png",
  },
  {
    id: "アリア・ソル" as WikiId,
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
    id: "ゼナ" as WikiId,
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
    id: "リリス・ヴェイン" as WikiId,
    name: "リリス・ヴェイン",
    nameEn: "Lilith Vaine",
    category: "キャラクター",
    subCategory: "Eros-7",
    description:
      "Eros-7初期の女性リーダーであり、リーチ・ドレインの制御技術を開発した科学者。E0年代にリーチ・ドレインの暴走を収めるため独自の生体制御理論を確立し、リーチ・ドレインをエネルギー資源として活用する道を開いた。その技術は後のバイオリアクターやスクイーズ・アビス建設の基盤となり、Eros-7社会の存続に不可欠な遺産を残した。",
    era: "E0頃",
    affiliation: "Eros-7",
    tier: "歴史的人物",
    image: "https://raw.githubusercontent.com/gentaron/image/main/LilithVane.png",
  },
  {
    id: "シルヴィア・クロウ" as WikiId,
    name: "シルヴィア・クロウ",
    nameEn: "Sylvia Crow",
    category: "キャラクター",
    subCategory: "Eros-7",
    description:
      "Eros-7の女性リーダー。E97〜E101年のリーチ・ドレイン危機において、強力なエスパー能力を駆使して危機を単独で収束させた英雄。この功績により男性指令省を設立し、Eros-7のマトリカル社会に新たな統治体制を確立。彼女のエスパー能力は後世に伝説として語り継がれている。",
    era: "E97〜E101",
    affiliation: "Eros-7",
    tier: "歴史的人物",
    image: "https://raw.githubusercontent.com/gentaron/image/main/SylviaCrow.png",
  },
  {
    id: "カーラ・ヴェルム" as WikiId,
    name: "カーラ・ヴェルム",
    nameEn: "Cara Verm",
    category: "キャラクター",
    subCategory: "Eros-7",
    description:
      "Eros-7に建設された560階に及ぶ地下搾取施設スクイーズ・アビスの立案者。E380年に着工し、リーチ・ドレインのエネルギーを抽出して搾取プラズマ弾を生産する巨大プラントを完成させた。その技術的野心的施設はEros-7の軍事力を飛躍的に増強したが、同時に倫理的な批判も招いた。E505年に施設の運用を終了した後の動向は不明。",
    era: "E380〜E505",
    affiliation: "Eros-7",
    tier: "Tier 2",
    image: "https://raw.githubusercontent.com/gentaron/image/main/KarlaVelm.png",
  },
  {
    id: "ガロ" as WikiId,
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
    id: "アヤカ・リン" as WikiId,
    name: "アヤカ・リン",
    nameEn: "Ayaka Rin",
    category: "キャラクター",
    subCategory: "Eros-7",
    description:
      "Lv.842。搾精生物専門ハンター。マトリカル・リフォーム運動を組織。E380年のスライム危機では、ビキニバリア・カウパー波を駆使してアンダーグリッド深部でスライムの巣を破壊。オルタ・フィールド経由で全市民に戦闘記録中継し、英雄的な名声を確立。E525年にはシャドウ・ユニオン男性リーダー・ガロや女性商人ゼナと同盟を結び、労働時間短縮・ジーン・カタログ男女平等化を掲げるマトリカル・リフォーム運動を本格的に組織。Eros-7社会変革の原動力。",
    era: "E380〜現在",
    affiliation: "シャドウ・ユニオン / マトリカル・リフォーム運動",
    tier: "Tier 1",
    image: "https://raw.githubusercontent.com/gentaron/image/main/AyakaRin.png",
  },

  /* 新規キャラクター */
  {
    id: "カステリア・グレンヴェルト" as WikiId,
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
    id: "シトラ・セレス" as WikiId,
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
    id: "ミュー" as WikiId,
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
    id: "ジュン" as WikiId,
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
    id: "アルゼン・カーリーン" as WikiId,
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
    id: "グレイモンド・ハウザー" as WikiId,
    name: "グレイモンド・ハウザー",
    nameEn: "Greymond Hauser",
    category: "キャラクター",
    subCategory: "宇宙勢力",
    description:
      "ティエリア総帥。宇宙最強の軍事力を指揮する。第一回宇宙連合会合で「軍事力なくして平和は守れない。力がなければ、秩序は保てない」と演説し、エレシオン女王リアナと対立。グランベルのアルゼン大統領に対しても「その言葉を信用するかは、具体的な行動を見てからだ」と懐疑的な姿勢を示した。ヘゲモニー・パラドックスの危険性を認識しつつも、ティエリアの安全保障を最優先としている。",
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
    id: "女王リアナ・ソリス" as WikiId,
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
    id: "マドリス・カーネル" as WikiId,
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
    id: "ネイサン・コリンド" as WikiId,
    name: "ネイサン・コリンド",
    nameEn: "Nathan Corlind",
    category: "キャラクター",
    subCategory: "宇宙勢力",
    description:
      "ディオクレニス科学宰相。宇宙探査と科学技術研究の最前線を担う。第一回宇宙連合会合で最も重要な役割を果たし、「ヘゲモニー・パラドックス」の危険性を科学的に指摘。対立のエネルギーを共同宇宙探査へ転換する提案を行い、平和協定・UECO設立・技術共有・文化交流拡大の4つの具体的提案を実施。会合後は全勢力参加の共同宇宙探査プロジェクト立案に没頭している。",
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
    id: "ロナン・アーサ" as WikiId,
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
    id: "グリム・ダルゴス" as WikiId,
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
    id: "マスター・クインシアス" as WikiId,
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
    id: "ヴァイロン・デアクス" as WikiId,
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

  /* ZAMLT / コーポラトクラシー */
  {
    id: "エリオット・シュトラス" as WikiId,
    name: "エリオット・シュトラス",
    nameEn: "Elliot Strauss",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "ZAMLTの創設者にして最高指導者。20万以上のコーポラトクラシーが乱立するGigapolis経済圏を5超巨大企業に統合し、E301年にZAMLTを設立した冷徹な戦略家。ZAMLTは構成企業の英語名の頭文字をとった名称であり、ゼブラ・コーポレーション（Z）、アロエオイル・コーポレーション（A）、マモン・コーポレーション（M）、ルレンツ・コーポレーション（L）、トロン・コーポレーション（T）の五大企業を傘下に収め、E16連星系の金融取引の95%を掌握した。彼の経済覇権はコーポラトクラシー体制の最終形態であり、エル・フォルハウスのマーストリヒト革命（E150年）が開いた自由経済の道を、極めて少数のエリートによる中央集権的支配へと逆転させた。ZAMLT本社の最深部に建造された次元の塔（Dimensional Tower）とカタリスト・コアの構想も彼によるものとされる。E318年のアルファ・ケインによるギガポリス解放戦でZAMLTは崩壊し、シュトラスは権力の座から転落した。彼の遺産はnトークン経済システムやA-Registryの階級制度として現在もE16文明圏に根を下ろしており、その影響は銀河系コンソーシアムの経済框架にも波及している。",
    era: "E301〜E318",
    affiliation: "ZAMLT",
    tier: "歴史的人物",
  },
  {
    id: "アレン" as WikiId,
    name: "アレン",
    nameEn: "Allen",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "コーポラトクラシー「ストロベリー」のCEOであり、nebura（星々の交響曲）の物語の序盤における重要人物。ZAMLTをはじめとするメタ企業の圧力に抵抗する中堅コーポラトクラシーの経営者として、終末の星（Star of the End）計画への関与を通じて物語の転回点を担う。アルファ・ケインをスティル・アレーナに推薦し、彼がZAMLTに対する反乱を主導する契機を作った。しかしZAMLTとEVILSの秘密会合の真相を追及した結果、ゼブラ・コーポレーションの工作員レイ・ヴァンデルトによってシェンドバーグ次元に閉じ込められ、殺害された。アレンの死はアルファ・ケインとテクロサスを結ぶ決定的な動機となり、ZAMLTに対する全面対決への道を開いた。中堅コーポラトクラシーの代表者として、ZAMLTの覇権体制下で多数のコーポラトクラシーが直面した絶望的な状況を体現する存在である。",
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
    id: "大司教" as WikiId,
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
    id: "商工会議長" as WikiId,
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
    id: "通信長官" as WikiId,
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
    id: "ラファエル・ドレイク" as WikiId,
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
    id: "アイリス・ノヴァ" as WikiId,
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
    id: "カルロス・ヴァンダム" as WikiId,
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
    id: "アーサー・グリム" as WikiId,
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
    id: "エリザベス・リンドバーグ" as WikiId,
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
    id: "レイ・ヴァンデルト" as WikiId,
    name: "レイ・ヴァンデルト",
    nameEn: "Ray Vandelte",
    category: "キャラクター",
    subCategory: "ZAMLT",
    description:
      "ゼブラ・コーポレーションの工作員。アーサー・グリムの指示のもと、ZAMLTとEVILSの秘密会合の真相を追及していたコーポラトクラシー「ストロベリー」のCEOアレンをシェンドバーグ次元に閉じ込めて殺害した冷徹な実行部隊の要員。アレンの死はアルファ・ケインとテクロサスを結ぶ決定的な動機となり、ZAMLTに対する全面対決への道を開いた。",
    era: "E318年頃",
    affiliation: "ゼブラ・コーポレーション / ZAMLT",
    tier: "歴史的人物",
  },
  {
    id: "リンダ" as WikiId,
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
    id: "クロノ・ヴァーレント" as WikiId,
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
    id: "オメガ＝ユリシス" as WikiId,
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

  /* 追加: 共同体指導者 */
  {
    id: "ファランクス（初代皇帝）" as WikiId,
    name: "ファランクス（初代皇帝）",
    nameEn: "Phalanx",
    category: "キャラクター",
    subCategory: "宇宙勢力",
    description:
      "バーズ帝国の初代皇帝。E15年に軍閥ファランクスを率いてE16連星系の初期植民地間紛争を武力によって終結させ、連星系初の包括的統一政権バーズ帝国を樹立した。ファランクスは帝国という名称ながらも、初期の入植者自治の伝統を尊重し、各省庁に相当する地方総督府制度を導入した。E61年の死後、後継者争いによって帝国は分裂したが、その軍事伝統はテクロサス系譜として受け継がれ、現在のボグダス・ジャベリンに至っている。",
    era: "E15〜E61",
    affiliation: "バーズ帝国",
    tier: "歴史的人物",
  },
  {
    id: "セルヴァ・ドーン" as WikiId,
    name: "セルヴァ・ドーン",
    nameEn: "Selva Dawn",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "SUDOMの初代医療総裁。E480年代に医療研究特別植民地だったSUDOMを国家へと昇格させ、遺伝子医療と再生医療の分野でE16文明圏の最先端を走る医療国家の基盤を築いた。スライム危機後のリーチ・ドレイン対策医療において中心的役割を果たし、V7加盟後は同盟の医療支援と疫学調査を統括した。",
    era: "E480〜",
    affiliation: "SUDOM",
    tier: "Tier 2",
  },
  {
    id: "ハシーム・ファティマ" as WikiId,
    name: "ハシーム・ファティマ",
    nameEn: "Hashim Fatima",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "ファティマ連邦の初代連邦議長。E400年代に分散する複数の自治州を緩やかな連合に統合し、宗教的・哲学的自由を重んじる連邦国家の基盤を築いた。ファティマ連邦の名称は彼の家族名に由来する。最小限の統治構造を採る分散型モデルを確立し、ネオクラン同盟の理念と共鳴する外交路線を推進した。",
    era: "E400〜",
    affiliation: "ファティマ連邦",
    tier: "Tier 2",
  },
  {
    id: "トリスタン・スターク" as WikiId,
    name: "トリスタン・スターク",
    nameEn: "Tristan Stark",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "スターク三国軍事理事長。E480年代に三国の防衛同盟を近代化し、他勢力への依存を避ける自律的安全保障体制を強化した。V7やトリニティ・アライアンスのいずれにも属さない独自路線を堅持し、クレセント地方の第三勢力として中立地帯の防衛を担う。質量ともに高く評価されるスターク三国軍事力の近代化の立役者。",
    era: "E480〜",
    affiliation: "スターク三国",
    tier: "Tier 2",
  },
  {
    id: "オーギュスト・ゴールド" as WikiId,
    name: "オーギュスト・ゴールド",
    nameEn: "August Gold",
    category: "キャラクター",
    subCategory: "Iris/クレセント",
    description:
      "ゴールデン・ヴェノムの創設者。シルバー・ヴェノムの内部抗争から独立し、アルファ・ヴェノムの急進的な武力路線に反対してnトークン経済システムへの浸透と金融操作による支配を志向する分派を率いた。表向きは合法的な企業活動を通じて資金を蓄積し、A-Registryシステムへの潜入工作を指揮していると疑われる。その手法は皮肉にもZAMLTの戦略を模倣するものであり、経済的支配による社会変革を最終目標としている。",
    era: "E500〜",
    affiliation: "ゴールデン・ヴェノム",
    tier: "Tier 2",
  },
  {
    id: "ルシア・ネオ" as WikiId,
    name: "ルシア・ネオ",
    nameEn: "Lucia Neo",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "ネオクラン同盟の初代代表。ZAMLT崩壊後の民主化運動の指導者複数名と共同で分散統治モデルの基盤を築いた。地方自治権の強化と市民参加型政治の復興を掲げ、テクノ文化ルネサンス期の「技術の民主化」という精神を政治制度に具体化した。UECO統合後は銀河系コンソーシアムの中核構成体として機能するネオクラン同盟の理念を代表する外交官として活動した。",
    era: "E330〜",
    affiliation: "ネオクラン同盟",
    tier: "歴史的人物",
  },
  {
    id: "ヘクトル・ヴァン" as WikiId,
    name: "ヘクトル・ヴァン",
    nameEn: "Hector Van",
    category: "キャラクター",
    subCategory: "Gigapolis",
    description:
      "UECO（星間経済協同組合）の初代議長。テクノ文化ルネサンス期の指導者の一人として、ZAMLT崩壊後の経済的混乱を収束させ、nトークン経済システムの再構築と公正な資源配分を実現した。ヒーローエージェンシーとの統合という独自の組織体制を構築し、経済活動と安全保障の有機的連携を実現した。E495〜E500年の銀河系コンソーシアム設立への移行期を主導した。",
    era: "E400後半〜E500",
    affiliation: "UECO",
    tier: "歴史的人物",
  },
]
