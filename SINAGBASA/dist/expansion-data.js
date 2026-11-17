const CATEGORIES = [
  {
    id: "details",
    name: ["Literal comprehension", "Literal na pag-unawa"],
    part: [
      "Facts, details, and references",
      "Katotohanan, detalye, at tinutukoy",
    ],
    icon: "≡",
    game: "dispatch",
  },
  {
    id: "inference",
    name: ["Inferential comprehension", "Paghihinuha"],
    part: [
      "Conclusions supported by clues",
      "Konklusyong sinusuportahan ng pahiwatig",
    ],
    icon: "∴",
    game: "detective",
  },
  {
    id: "vocabulary",
    name: ["Vocabulary in context", "Talasalitaan sa konteksto"],
    part: [
      "Meaning through surrounding words",
      "Kahulugan gamit ang kalapit na salita",
    ],
    icon: "≋",
    game: "context",
  },
  {
    id: "sequence",
    name: ["Sequence & cause and effect", "Pagkakasunod at sanhi at bunga"],
    part: ["Event order and connections", "Ayos ng pangyayari at ugnayan"],
    icon: "⇄",
    game: "sequence",
  },
  {
    id: "mainidea",
    name: ["Main idea & supporting details", "Pangunahing ideya at detalye"],
    part: ["The message and its support", "Mensahe at sumusuportang detalye"],
    icon: "▤",
    game: "headline",
  },
  {
    id: "critical",
    name: ["Critical reading", "Mapanuring pagbasa"],
    part: [
      "Fact, opinion, purpose, and priorities",
      "Katotohanan, opinyon, layunin, at prayoridad",
    ],
    icon: "◇",
    game: "fact",
  },
];
LESSONS[0].category = "details";
LESSONS[0].game = "dispatch";
LESSONS[1].category = "inference";
LESSONS[1].game = "detective";
LESSONS[2].category = "critical";
LESSONS[2].game = "dispatch";
LESSONS.push(
  ...[
    {
      category: "details",
      skill: ["Literal comprehension", "Literal na pag-unawa"],
      title: ["Track who and what", "Sundan ang sino at ano"],
      desc: [
        "Facts, details, and references",
        "Katotohanan, detalye, at tinutukoy",
      ],
      body: [
        [
          "Pronouns replace names and objects. Read the surrounding sentences to identify what they refer to.",
          "Replace the pronoun with your chosen noun and check whether the sentence still makes sense.",
        ],
        [
          "Pumapalit sa pangalan at bagay ang panghalip. Basahin ang kalapit na pangungusap upang matukoy ang tinutukoy.",
          "Ipalit ang napiling pangngalan at suriin kung makabuluhan pa ang pangungusap.",
        ],
      ],
      example: [
        "Lara handed Niko a folder. He placed it on the desk.",
        "Iniabot ni Lara kay Niko ang folder. Inilagay niya ito sa mesa.",
      ],
      question: ["What does “it” refer to?", "Ano ang tinutukoy ng “ito”?"],
      options: [
        ["The desk", "The folder", "Lara"],
        ["Ang mesa", "Ang folder", "Si Lara"],
      ],
      answer: 1,
      explain: [
        "The folder is the object placed on the desk.",
        "Ang folder ang bagay na inilagay sa mesa.",
      ],
      game: "dispatch",
    },
    {
      category: "inference",
      skill: ["Inferential comprehension", "Paghihinuha"],
      title: [
        "Explain a character’s decision",
        "Ipaliwanag ang pasya ng tauhan",
      ],
      desc: [
        "Conclusions supported by clues",
        "Konklusyong sinusuportahan ng pahiwatig",
      ],
      body: [
        [
          "A motive explains why a person acts. It may be implied instead of directly stated.",
          "Connect the circumstances to the action. Do not add motives that the passage does not support.",
        ],
        [
          "Ipinaliliwanag ng motibo ang dahilan ng kilos. Maaari itong ipinahiwatig lamang.",
          "Iugnay ang kalagayan sa kilos. Huwag magdagdag ng motibong walang suporta sa sipi.",
        ],
      ],
      example: [
        "The bus was delayed. Maya asked her group to start the meeting without her.",
        "Naantala ang bus. Hiniling ni Maya na simulan ng grupo ang pulong kahit wala pa siya.",
      ],
      question: [
        "Why did Maya send the message?",
        "Bakit nagpadala si Maya ng mensahe?",
      ],
      options: [
        [
          "To avoid delaying the group",
          "Because she dislikes meetings",
          "To cancel the meeting",
        ],
        [
          "Upang hindi maantala ang grupo",
          "Dahil ayaw niya ng pulong",
          "Upang kanselahin ang pulong",
        ],
      ],
      answer: 0,
      explain: [
        "The message responds to the delay and lets the group proceed.",
        "Tugon ang mensahe sa pagkaantala upang makapagpatuloy ang grupo.",
      ],
      game: "detective",
    },
    {
      category: "vocabulary",
      skill: ["Vocabulary in context", "Talasalitaan sa konteksto"],
      title: [
        "Look for definition clues",
        "Hanapin ang pahiwatig na depinisyon",
      ],
      desc: [
        "Meaning through surrounding words",
        "Kahulugan gamit ang kalapit na salita",
      ],
      body: [
        [
          "Look for words such as means, or, and in other words. They can introduce an explanation.",
          "Read the whole sentence and try replacing the unfamiliar word with the explanation.",
        ],
        [
          "Hanapin ang ibig sabihin, o, at sa madaling salita. Maaaring ipakilala ng mga ito ang paliwanag.",
          "Basahin ang buong pangungusap at ipalit ang paliwanag sa di-pamilyar na salita.",
        ],
      ],
      example: [
        "The route was inaccessible, meaning people could not enter it.",
        "Hindi madaanan ang ruta, ibig sabihin ay hindi makapasok dito ang mga tao.",
      ],
      question: [
        "What does “inaccessible” mean?",
        "Ano ang ibig sabihin ng “hindi madaanan”?",
      ],
      options: [
        ["Easy to reach", "Unable to be entered", "Recently painted"],
        ["Madaling marating", "Hindi mapapasok", "Bagong pintura"],
      ],
      answer: 1,
      explain: [
        "The phrase after “meaning” explains the word.",
        "Ipinapaliwanag ng parirala pagkatapos ng “ibig sabihin” ang salita.",
      ],
      game: "context",
    },
    {
      category: "vocabulary",
      skill: ["Vocabulary in context", "Talasalitaan sa konteksto"],
      title: [
        "Use contrast and examples",
        "Gamitin ang kasalungat at halimbawa",
      ],
      desc: [
        "Meaning through surrounding words",
        "Kahulugan gamit ang kalapit na salita",
      ],
      body: [
        [
          "But, unlike, and however can signal a contrast. Compare the descriptions.",
          "Examples can explain a broader word: tools such as a hammer and screwdriver.",
        ],
        [
          "Maaaring magpakita ng kaibahan ang ngunit, di-tulad, at gayunman. Ihambing ang paglalarawan.",
          "Maaaring magpaliwanag ng salita ang halimbawa: kagamitan gaya ng martilyo at distornilyador.",
        ],
      ],
      example: [
        "Unlike the noisy hallway, the room was tranquil.",
        "Di-tulad ng maingay na pasilyo, payapa ang silid.",
      ],
      question: [
        "What does “tranquil” mean?",
        "Ano ang kahulugan ng “payapa”?",
      ],
      options: [
        ["Crowded", "Damaged", "Calm and quiet"],
        ["Siksikan", "Sira", "Kalmado at tahimik"],
      ],
      answer: 2,
      explain: [
        "The contrast with noise suggests quietness.",
        "Ipinahihiwatig ng kaibahan sa ingay ang katahimikan.",
      ],
      game: "context",
    },
    {
      category: "sequence",
      skill: ["Sequence & cause and effect", "Pagkakasunod at sanhi at bunga"],
      title: ["Follow the order of events", "Sundan ang ayos ng pangyayari"],
      desc: ["Event order and connections", "Ayos ng pangyayari at ugnayan"],
      body: [
        [
          "First, before, after, and finally tell you when events happen.",
          "Mention order is not always event order. Build a timeline and check it against the passage.",
        ],
        [
          "Ipinapakita ng una, bago, pagkatapos, at sa wakas ang oras ng pangyayari.",
          "Hindi laging kapareho ng pagkakasunod ang ayos ng pagkakabanggit. Bumuo ng timeline.",
        ],
      ],
      example: [
        "Before planting, Sam loosened the soil. He watered the seeds after planting.",
        "Bago magtanim, binungkal ni Sam ang lupa. Diniligan niya ang buto matapos magtanim.",
      ],
      question: ["What happened first?", "Ano ang unang nangyari?"],
      options: [
        ["Loosening the soil", "Watering the seeds", "Seeds sprouting"],
        ["Pagbungkal ng lupa", "Pagdidilig ng buto", "Pagtubo ng buto"],
      ],
      answer: 0,
      explain: [
        "“Before planting” puts soil preparation first.",
        "Inuuna ng “bago magtanim” ang paghahanda ng lupa.",
      ],
      game: "sequence",
    },
    {
      category: "sequence",
      skill: ["Sequence & cause and effect", "Pagkakasunod at sanhi at bunga"],
      title: ["Separate cause from effect", "Ihiwalay ang sanhi at bunga"],
      desc: ["Event order and connections", "Ayos ng pangyayari at ugnayan"],
      body: [
        [
          "Cause explains why; effect explains what happened as a result.",
          "Look for because, so, and therefore. Two events happening together do not automatically prove a causal connection.",
        ],
        [
          "Ipinaliliwanag ng sanhi ang bakit; ipinapakita ng bunga ang resulta.",
          "Hanapin ang dahil, kaya, at samakatuwid. Hindi awtomatikong sanhi at bunga ang sabay na pangyayari.",
        ],
      ],
      example: [
        "Because the printer ran out of ink, the class submitted handwritten copies.",
        "Dahil naubusan ng tinta ang printer, sulat-kamay ang isinumite ng klase.",
      ],
      question: [
        "What caused the handwritten submission?",
        "Ano ang sanhi ng sulat-kamay na pagsusumite?",
      ],
      options: [
        ["Missing notes", "No printer ink", "Canceled class"],
        ["Nawalang tala", "Walang tinta sa printer", "Kinanselang klase"],
      ],
      answer: 1,
      explain: [
        "The because clause states the cause.",
        "Isinasaad ng bahaging may dahil ang sanhi.",
      ],
      game: "sequence",
    },
    {
      category: "mainidea",
      skill: ["Main idea & supporting details", "Pangunahing ideya at detalye"],
      title: ["Find the main message", "Hanapin ang pangunahing mensahe"],
      desc: ["The message and its support", "Mensahe at sumusuportang detalye"],
      body: [
        [
          "The main idea summarizes what the whole paragraph says about its topic.",
          "A good title covers the important details without making unsupported claims.",
        ],
        [
          "Binubuod ng pangunahing ideya ang sinasabi ng buong talata tungkol sa paksa.",
          "Saklaw ng magandang pamagat ang mahahalagang detalye nang walang dagdag na pahayag.",
        ],
      ],
      example: [
        "Students labeled bins, explained recycling, and collected reusable paper. These actions reduced waste.",
        "Nilagyan ng label ang basurahan, ipinaliwanag ang recycling, at nangolekta ng papel. Nabawasan ang basura.",
      ],
      question: [
        "Which title fits the whole paragraph?",
        "Aling pamagat ang akma sa buong talata?",
      ],
      options: [
        [
          "A Broken Bin",
          "How Paper Is Made",
          "Students Work Together to Reduce Waste",
        ],
        [
          "Sirang Basurahan",
          "Paano Ginagawa ang Papel",
          "Pagtutulungan sa Pagbawas ng Basura",
        ],
      ],
      answer: 2,
      explain: [
        "The title covers the actions and shared result.",
        "Saklaw nito ang mga kilos at resulta.",
      ],
      game: "headline",
    },
    {
      category: "mainidea",
      skill: ["Main idea & supporting details", "Pangunahing ideya at detalye"],
      title: ["Choose supporting details", "Piliin ang sumusuportang detalye"],
      desc: ["The message and its support", "Mensahe at sumusuportang detalye"],
      body: [
        [
          "Supporting details explain or provide evidence for the main idea.",
          "Match the detail to the exact claim. A detail can be true but irrelevant to that claim.",
        ],
        [
          "Nagpapaliwanag o nagbibigay-ebidensya ang sumusuportang detalye.",
          "Itugma ang detalye sa eksaktong pahayag. Maaaring totoo ngunit hindi kaugnay ang detalye.",
        ],
      ],
      example: [
        "The library became easier to use. Books were sorted by topic and signs marked sections. The door was blue.",
        "Naging mas madaling gamitin ang aklatan. Inayos ang mga aklat ayon sa paksa at may palatandaan sa seksyon. Asul ang pinto.",
      ],
      question: [
        "Which detail supports easier use?",
        "Anong detalye ang suporta sa mas madaling paggamit?",
      ],
      options: [
        ["Sorted books and signs", "The blue door", "The library had a door"],
        [
          "Maayos na aklat at palatandaan",
          "Asul na pinto",
          "May pinto ang aklatan",
        ],
      ],
      answer: 0,
      explain: [
        "Sorting and signs help readers find books.",
        "Nakatutulong sa paghahanap ang ayos at palatandaan.",
      ],
      game: "headline",
    },
    {
      category: "critical",
      skill: ["Critical reading", "Mapanuring pagbasa"],
      title: [
        "Separate facts from views",
        "Ihiwalay ang katotohanan at opinyon",
      ],
      desc: [
        "Fact, opinion, purpose, and priorities",
        "Katotohanan, opinyon, layunin, at prayoridad",
      ],
      body: [
        [
          "A factual claim can be checked with records or observation. Being checkable does not automatically make a claim true.",
          "An opinion expresses a personal judgment, such as best or most enjoyable. Read the exact claim before labeling it.",
        ],
        [
          "Masusuri ang pahayag ng katotohanan gamit ang tala o obserbasyon. Hindi awtomatikong totoo ang lahat ng masusuring pahayag.",
          "Nagpapahayag ng paghatol ang opinyon, tulad ng pinakamahusay o pinakamasaya. Basahin ang eksaktong pahayag.",
        ],
      ],
      example: [
        "The exhibit opened at nine. It was the most impressive exhibit of the year.",
        "Nagbukas ang eksibit nang alas-nuwebe. Ito ang pinakakahanga-hangang eksibit ng taon.",
      ],
      question: ["Which expresses an opinion?", "Alin ang opinyon?"],
      options: [
        ["The opening time", "The most impressive claim", "Neither"],
        ["Oras ng pagbubukas", "Ang pinakakahanga-hanga", "Wala sa dalawa"],
      ],
      answer: 1,
      explain: [
        "Most impressive is a judgment; time is checkable.",
        "Paghatol ang pinakakahanga-hanga; masusuri ang oras.",
      ],
      game: "fact",
    },
  ],
);
ARCADE.find((g) => g.id === "sequence").rounds.push(
  ...[
    {
      title: ["The Corrected Notice", "Itinamang Abiso"],
      passage: [
        "Jo posted a meeting notice for Room 8. The adviser said the room was reserved. Jo found an available room and changed the notice to Room 10. Finally, she sent the correction to members.",
        "Nag-post si Jo ng abiso para sa Room 8. Sinabing nakalaan ang silid. Humanap siya ng bakanteng silid at pinalitan ng Room 10 ang abiso. Sa huli, ipinadala ang pagwawasto.",
      ],
      events: [
        [
          "Jo posted the Room 8 notice.",
          "The adviser explained the conflict.",
          "Jo changed the notice to Room 10.",
          "She sent the correction.",
        ],
        [
          "Nag-post ng abiso para sa Room 8.",
          "Ipinaliwanag ang suliranin.",
          "Pinalitan ng Room 10 ang abiso.",
          "Ipinadala ang pagwawasto.",
        ],
      ],
      why: [
        "The conflict caused the correction, which was sent last.",
        "Ang suliranin ang sanhi ng pagwawasto; huli ang pagpapadala.",
      ],
    },
    {
      title: ["The Bottle Campaign", "Kampanya sa Bote"],
      passage: [
        "The council first counted disposable cups. It posted reminders to bring reusable bottles. Students used the refill station. At the end of the week, the council counted cups again to compare results.",
        "Una, binilang ang disposable na baso. Naglagay ng paalala tungkol sa reusable na bote. Gumamit ang mag-aaral ng refill station. Sa huling araw, muling binilang ang baso upang ihambing ang resulta.",
      ],
      events: [
        [
          "The council made the first count.",
          "It posted reminders.",
          "Students used the refill station.",
          "The council counted again.",
        ],
        [
          "Ginawa ang unang bilang.",
          "Naglagay ng paalala.",
          "Ginamit ang refill station.",
          "Muling nagbilang.",
        ],
      ],
      why: [
        "The first count precedes the intervention and the comparison follows it.",
        "Nauna ang unang bilang sa kampanya at sumunod ang paghahambing.",
      ],
    },
    {
      title: ["The Seed Test", "Pagsubok sa Buto"],
      passage: [
        "The group placed seeds on damp paper. They checked the paper every morning. After several days, roots appeared. They recorded the sprouted seeds before planting them in soil.",
        "Inilagay ang buto sa basang papel. Sinuri ito tuwing umaga. Makalipas ang ilang araw, lumitaw ang ugat. Itinala ang tumubong buto bago itanim sa lupa.",
      ],
      events: [
        [
          "They placed the seeds.",
          "They monitored the paper.",
          "Roots appeared.",
          "They recorded sprouted seeds.",
        ],
        [
          "Inilagay ang buto.",
          "Sinuri ang papel.",
          "Lumitaw ang ugat.",
          "Itinala ang tumubong buto.",
        ],
      ],
      why: [
        "Setup comes before monitoring; recording follows sprouting.",
        "Nauna ang paghahanda sa pagsusuri; sumunod sa pagtubo ang pagtatala.",
      ],
    },
  ],
);
ARCADE.find((g) => g.id === "detective").rounds.push(
  ...[
    {
      title: ["The Unfinished Poster", "Hindi Tapos na Poster"],
      sentences: [
        [
          "Ben brought an unfinished poster.",
          "He asked classmates to review the message before adding final designs.",
          "He revised an unclear sentence.",
          "Then he colored the border.",
        ],
        [
          "Nagdala si Ben ng hindi tapos na poster.",
          "Hiniling niyang suriin ang mensahe bago ang huling disenyo.",
          "Binago niya ang malabong pangungusap.",
          "Saka kinulayan ang gilid.",
        ],
      ],
      question: [
        "What does his approach suggest?",
        "Ano ang ipinahihiwatig ng paraan niya?",
      ],
      options: [
        [
          "He prioritizes clarity before decoration",
          "He refuses feedback",
          "He is already finished",
        ],
        [
          "Inuuna ang kalinawan bago dekorasyon",
          "Ayaw ng puna",
          "Tapos na siya",
        ],
      ],
      answer: 0,
      evidence: 1,
      why: [
        "Reviewing the message before design supports clarity as his priority.",
        "Suporta sa pag-una sa kalinawan ang pagsusuri ng mensahe bago disenyo.",
      ],
    },
    {
      title: ["The Borrowed Charger", "Hiniram na Charger"],
      sentences: [
        [
          "Rina’s battery was low before the meeting.",
          "She borrowed a charger and sat beside an outlet.",
          "When it had enough charge, she returned to the group.",
          "The meeting began later.",
        ],
        [
          "Mahina ang baterya ni Rina bago ang pulong.",
          "Humiram siya ng charger at umupo sa tabi ng saksakan.",
          "Nang sapat na ang charge, bumalik siya sa grupo.",
          "Nagsimula ang pulong kalaunan.",
        ],
      ],
      question: [
        "Why sit beside the outlet?",
        "Bakit umupo sa tabi ng saksakan?",
      ],
      options: [
        ["To avoid everyone", "To charge her phone", "To cancel the meeting"],
        [
          "Upang iwasan ang lahat",
          "Upang i-charge ang telepono",
          "Upang kanselahin ang pulong",
        ],
      ],
      answer: 1,
      evidence: 1,
      why: [
        "The borrowed charger directly supports charging.",
        "Direktang suporta ang hiniram na charger.",
      ],
    },
    {
      title: ["Two Different Times", "Magkaibang Oras"],
      sentences: [
        [
          "Two notices give different exhibit times.",
          "One is an old screenshot without a date.",
          "Today’s school announcement says ten o’clock.",
          "The teacher says to follow today’s announcement.",
        ],
        [
          "Magkaiba ang oras sa dalawang abiso.",
          "Ang isa ay lumang screenshot na walang petsa.",
          "Alas-diyes ang nakasaad sa anunsyo ngayon.",
          "Sundin daw ang anunsyo ngayon.",
        ],
      ],
      question: [
        "Which time has the best support?",
        "Aling oras ang may pinakamatibay na suporta?",
      ],
      options: [
        [
          "The undated screenshot",
          "A guessed time",
          "Ten, in today’s announcement",
        ],
        [
          "Sa screenshot na walang petsa",
          "Hulang oras",
          "Alas-diyes sa anunsyo ngayon",
        ],
      ],
      answer: 2,
      evidence: 2,
      why: [
        "The dated current announcement supports ten o’clock.",
        "Suporta sa alas-diyes ang kasalukuyang anunsyo.",
      ],
    },
  ],
);
ARCADE.find((g) => g.id === "context").rounds.push(
  ...[
    {
      title: ["A Careful Plan", "Maingat na Plano"],
      passage: [
        "The team devised a plan, creating a schedule. They anticipated delays, expecting rain to slow deliveries. A covered pickup area would mitigate the problem by reducing the rain’s effect.",
        "Bumuo ang pangkat ng plano at iskedyul. Inasahan nila ang pagkaantala dahil sa ulan. May bubong na lugar upang mabawasan ang epekto ng ulan.",
      ],
      questions: [
        {
          word: ["devised", "bumuo"],
          q: [
            "What does “devised” mean here?",
            "Ano ang kahulugan ng “bumuo” rito?",
          ],
          options: [
            ["Created a plan", "The opposite meaning", "A different action"],
            ["Lumikha ng plano", "Kasalungat na kahulugan", "Ibang kilos"],
          ],
          answer: 0,
          why: [
            "The surrounding explanation gives this meaning.",
            "Ibinibigay ng kalapit na paliwanag ang kahulugang ito.",
          ],
        },
        {
          word: ["anticipated", "inasahan"],
          q: [
            "What does “anticipated” mean here?",
            "Ano ang kahulugan ng “inasahan” rito?",
          ],
          options: [
            ["Not mentioned", "Expected in advance", "A different action"],
            ["Hindi nabanggit", "Inisip na maaaring mangyari", "Ibang kilos"],
          ],
          answer: 1,
          why: [
            "The surrounding explanation gives this meaning.",
            "Ibinibigay ng kalapit na paliwanag ang kahulugang ito.",
          ],
        },
        {
          word: ["mitigate", "mabawasan"],
          q: [
            "What does “mitigate” mean here?",
            "Ano ang kahulugan ng “mabawasan” rito?",
          ],
          options: [
            ["Not mentioned", "The opposite meaning", "Reduce the impact"],
            [
              "Hindi nabanggit",
              "Kasalungat na kahulugan",
              "Paliitin ang epekto",
            ],
          ],
          answer: 2,
          why: [
            "The surrounding explanation gives this meaning.",
            "Ibinibigay ng kalapit na paliwanag ang kahulugang ito.",
          ],
        },
      ],
    },
    {
      title: ["Working Together", "Sama-samang Paggawa"],
      passage: [
        "Tasks were allocated: each member received one. The group collaborated, sharing ideas. The report was coherent because its sections connected logically.",
        "Ipinamahagi ang gawain sa bawat kasapi. Nagtulungan sila at nagbahagi ng ideya. Magkakaugnay ang ulat dahil lohikal na konektado ang mga seksyon.",
      ],
      questions: [
        {
          word: ["allocated", "ipinamahagi"],
          q: [
            "What does “allocated” mean here?",
            "Ano ang kahulugan ng “ipinamahagi” rito?",
          ],
          options: [
            [
              "Assigned or distributed",
              "The opposite meaning",
              "A different action",
            ],
            ["Itinalaga o ibinahagi", "Kasalungat na kahulugan", "Ibang kilos"],
          ],
          answer: 0,
          why: [
            "The surrounding explanation gives this meaning.",
            "Ibinibigay ng kalapit na paliwanag ang kahulugang ito.",
          ],
        },
        {
          word: ["collaborated", "nagtulungan"],
          q: [
            "What does “collaborated” mean here?",
            "Ano ang kahulugan ng “nagtulungan” rito?",
          ],
          options: [
            ["Not mentioned", "Worked together", "A different action"],
            ["Hindi nabanggit", "Sama-samang gumawa", "Ibang kilos"],
          ],
          answer: 1,
          why: [
            "The surrounding explanation gives this meaning.",
            "Ibinibigay ng kalapit na paliwanag ang kahulugang ito.",
          ],
        },
        {
          word: ["coherent", "magkakaugnay"],
          q: [
            "What does “coherent” mean here?",
            "Ano ang kahulugan ng “magkakaugnay” rito?",
          ],
          options: [
            ["Not mentioned", "The opposite meaning", "Logically connected"],
            [
              "Hindi nabanggit",
              "Kasalungat na kahulugan",
              "Lohikal na konektado",
            ],
          ],
          answer: 2,
          why: [
            "The surrounding explanation gives this meaning.",
            "Ibinibigay ng kalapit na paliwanag ang kahulugang ito.",
          ],
        },
      ],
    },
    {
      title: ["Clear Instructions", "Malinaw na Tagubilin"],
      passage: [
        "The instruction was ambiguous, allowing two interpretations. The teacher clarified it by explaining exactly what to submit. The new message was concise: three short sentences gave all the needed steps.",
        "Malabo ang tagubilin at may dalawang pagkaunawa. Nilinaw ng guro ang eksaktong isusumite. Maikli ngunit sapat ang bagong mensahe: tatlong pangungusap ang nagbigay ng lahat ng hakbang.",
      ],
      questions: [
        {
          word: ["ambiguous", "malabo"],
          q: [
            "What does “ambiguous” mean here?",
            "Ano ang kahulugan ng “malabo” rito?",
          ],
          options: [
            [
              "Open to more than one interpretation",
              "The opposite meaning",
              "A different action",
            ],
            [
              "May higit sa isang pagkaunawa",
              "Kasalungat na kahulugan",
              "Ibang kilos",
            ],
          ],
          answer: 0,
          why: [
            "The surrounding explanation gives this meaning.",
            "Ibinibigay ng kalapit na paliwanag ang kahulugang ito.",
          ],
        },
        {
          word: ["clarified", "nilinaw"],
          q: [
            "What does “clarified” mean here?",
            "Ano ang kahulugan ng “nilinaw” rito?",
          ],
          options: [
            ["Not mentioned", "Made the meaning clearer", "A different action"],
            [
              "Hindi nabanggit",
              "Ginawang malinaw ang kahulugan",
              "Ibang kilos",
            ],
          ],
          answer: 1,
          why: [
            "The surrounding explanation gives this meaning.",
            "Ibinibigay ng kalapit na paliwanag ang kahulugang ito.",
          ],
        },
        {
          word: ["concise", "maikli ngunit sapat"],
          q: [
            "What does “concise” mean here?",
            "Ano ang kahulugan ng “maikli ngunit sapat” rito?",
          ],
          options: [
            [
              "Not mentioned",
              "The opposite meaning",
              "Brief but sufficiently informative",
            ],
            [
              "Hindi nabanggit",
              "Kasalungat na kahulugan",
              "Maikli ngunit may sapat na impormasyon",
            ],
          ],
          answer: 2,
          why: [
            "The surrounding explanation gives this meaning.",
            "Ibinibigay ng kalapit na paliwanag ang kahulugang ito.",
          ],
        },
      ],
    },
  ],
);
ARCADE.push({
  id: "headline",
  name: ["Headline Studio", "Studio ng Pamagat"],
  skill: ["Main idea & supporting details", "Pangunahing ideya at detalye"],
  desc: [
    "Publish the right headline and find its supporting detail.",
    "Piliin ang pamagat at sumusuportang detalye.",
  ],
  icon: "▤",
  theme: "blue",
  rounds: [
    {
      title: ["A Better Library", "Mas Maayos na Aklatan"],
      passage: [
        "The library sorted books by topic. Clear signs marked each section, and a search list helped readers locate titles. These changes made finding books easier.",
        "Inayos ang mga aklat ayon sa paksa. May malinaw na palatandaan at listahan sa paghahanap. Naging mas madaling hanapin ang aklat.",
      ],
      questions: [
        {
          word: ["MAIN MESSAGE", "PANGUNAHING MENSAHE"],
          q: [
            "Which headline captures the whole passage?",
            "Aling pamagat ang sumasaklaw sa buong sipi?",
          ],
          options: [
            [
              "Library Changes Help Readers Find Books",
              "The Best Project Ever",
              "Only One Small Detail",
            ],
            [
              "Mga Pagbabagong Nagpapadali sa Paghahanap",
              "Pinakamahusay na Proyekto",
              "Isang Maliit na Detalye",
            ],
          ],
          answer: 0,
          why: [
            "This headline covers the actions and their shared purpose.",
            "Saklaw ng pamagat ang mga kilos at iisang layunin.",
          ],
        },
        {
          word: ["SUPPORTING DETAIL", "SUMUSUPORTANG DETALYE"],
          q: [
            "Which detail directly supports that headline?",
            "Anong detalye ang direktang suporta sa pamagat?",
          ],
          options: [
            [
              "Something not mentioned",
              "Signs marked each section",
              "A library has a door",
            ],
            [
              "Hindi nabanggit",
              "May palatandaan sa bawat seksyon",
              "May pinto ang aklatan",
            ],
          ],
          answer: 1,
          why: [
            "The detail explains how the main result was achieved.",
            "Ipinapaliwanag ng detalye kung paano nakamit ang resulta.",
          ],
        },
      ],
    },
    {
      title: ["Water Wise", "Maingat sa Tubig"],
      passage: [
        "Students reported leaking taps, used only enough water for cleaning, and collected rainwater for the garden. Their shared effort reduced wasted water.",
        "Iniulat ang tumutulong gripo, ginamit ang sapat na tubig sa paglilinis, at nag-ipon ng ulan para sa hardin. Nabawasan ang nasasayang na tubig.",
      ],
      questions: [
        {
          word: ["MAIN MESSAGE", "PANGUNAHING MENSAHE"],
          q: [
            "Which headline captures the whole passage?",
            "Aling pamagat ang sumasaklaw sa buong sipi?",
          ],
          options: [
            [
              "A Completely Different Topic",
              "Students Work Together to Save Water",
              "Only One Small Detail",
            ],
            [
              "Ibang Paksa",
              "Pagtutulungan sa Pagtitipid ng Tubig",
              "Isang Maliit na Detalye",
            ],
          ],
          answer: 1,
          why: [
            "This headline covers the actions and their shared purpose.",
            "Saklaw ng pamagat ang mga kilos at iisang layunin.",
          ],
        },
        {
          word: ["SUPPORTING DETAIL", "SUMUSUPORTANG DETALYE"],
          q: [
            "Which detail directly supports that headline?",
            "Anong detalye ang direktang suporta sa pamagat?",
          ],
          options: [
            [
              "Students wore school uniforms",
              "A personal preference",
              "Students reported leaking taps",
            ],
            [
              "Naka-uniporme ang mag-aaral",
              "Personal na kagustuhan",
              "Iniulat ang tumutulong gripo",
            ],
          ],
          answer: 2,
          why: [
            "The detail explains how the main result was achieved.",
            "Ipinapaliwanag ng detalye kung paano nakamit ang resulta.",
          ],
        },
      ],
    },
    {
      title: ["A Welcoming Club", "Magiliw na Samahan"],
      passage: [
        "Club members paired newcomers with guides. They explained activities and invited questions. New members felt more comfortable joining discussions.",
        "Ipinares sa gabay ang bagong kasapi. Ipinaliwanag ang gawain at pinayagang magtanong. Naging komportable silang sumali sa talakayan.",
      ],
      questions: [
        {
          word: ["MAIN MESSAGE", "PANGUNAHING MENSAHE"],
          q: [
            "Which headline captures the whole passage?",
            "Aling pamagat ang sumasaklaw sa buong sipi?",
          ],
          options: [
            [
              "A Completely Different Topic",
              "The Best Project Ever",
              "The Club Helps New Members Participate",
            ],
            [
              "Ibang Paksa",
              "Pinakamahusay na Proyekto",
              "Tulong sa Pakikilahok ng Bagong Kasapi",
            ],
          ],
          answer: 2,
          why: [
            "This headline covers the actions and their shared purpose.",
            "Saklaw ng pamagat ang mga kilos at iisang layunin.",
          ],
        },
        {
          word: ["SUPPORTING DETAIL", "SUMUSUPORTANG DETALYE"],
          q: [
            "Which detail directly supports that headline?",
            "Anong detalye ang direktang suporta sa pamagat?",
          ],
          options: [
            [
              "Guides explained activities and welcomed questions",
              "A meeting takes place in a room",
              "A detail unrelated to the claim",
            ],
            [
              "Ipinaliwanag ng gabay ang gawain at pinayagang magtanong",
              "Sa silid ginaganap ang pulong",
              "Di-kaugnay na detalye",
            ],
          ],
          answer: 0,
          why: [
            "The detail explains how the main result was achieved.",
            "Ipinapaliwanag ng detalye kung paano nakamit ang resulta.",
          ],
        },
      ],
    },
    {
      title: ["Safer Walkways", "Mas Ligtas na Daanan"],
      passage: [
        "The class removed loose cables, kept bags away from aisles, and marked a slippery area. These steps made classroom walkways safer.",
        "Inalis ang nakalawit na kable, inilayo ang bag sa daanan, at minarkahan ang madulas na bahagi. Naging mas ligtas ang daanan.",
      ],
      questions: [
        {
          word: ["MAIN MESSAGE", "PANGUNAHING MENSAHE"],
          q: [
            "Which headline captures the whole passage?",
            "Aling pamagat ang sumasaklaw sa buong sipi?",
          ],
          options: [
            [
              "Small Changes Improve Walkway Safety",
              "The Best Project Ever",
              "Only One Small Detail",
            ],
            [
              "Maliliit na Pagbabago para sa Ligtas na Daanan",
              "Pinakamahusay na Proyekto",
              "Isang Maliit na Detalye",
            ],
          ],
          answer: 0,
          why: [
            "This headline covers the actions and their shared purpose.",
            "Saklaw ng pamagat ang mga kilos at iisang layunin.",
          ],
        },
        {
          word: ["SUPPORTING DETAIL", "SUMUSUPORTANG DETALYE"],
          q: [
            "Which detail directly supports that headline?",
            "Anong detalye ang direktang suporta sa pamagat?",
          ],
          options: [
            [
              "Something not mentioned",
              "Bags were kept away from aisles",
              "The classroom has windows",
            ],
            [
              "Hindi nabanggit",
              "Inilayo ang bag sa daanan",
              "May bintana ang silid",
            ],
          ],
          answer: 1,
          why: [
            "The detail explains how the main result was achieved.",
            "Ipinapaliwanag ng detalye kung paano nakamit ang resulta.",
          ],
        },
      ],
    },
    {
      title: ["Reading Together", "Sabayang Pagbasa"],
      passage: [
        "The group read a short story, discussed unfamiliar words, and compared their interpretations. Sharing ideas helped them understand the story more deeply.",
        "Nagbasa ng maikling kuwento, tinalakay ang di-pamilyar na salita, at inihambing ang pagkaunawa. Lumalim ang pag-unawa dahil sa pagbabahagi.",
      ],
      questions: [
        {
          word: ["MAIN MESSAGE", "PANGUNAHING MENSAHE"],
          q: [
            "Which headline captures the whole passage?",
            "Aling pamagat ang sumasaklaw sa buong sipi?",
          ],
          options: [
            [
              "A Completely Different Topic",
              "Discussion Supports Deeper Understanding",
              "Only One Small Detail",
            ],
            [
              "Ibang Paksa",
              "Talakayan para sa Mas Malalim na Pag-unawa",
              "Isang Maliit na Detalye",
            ],
          ],
          answer: 1,
          why: [
            "This headline covers the actions and their shared purpose.",
            "Saklaw ng pamagat ang mga kilos at iisang layunin.",
          ],
        },
        {
          word: ["SUPPORTING DETAIL", "SUMUSUPORTANG DETALYE"],
          q: [
            "Which detail directly supports that headline?",
            "Anong detalye ang direktang suporta sa pamagat?",
          ],
          options: [
            [
              "The story had a title",
              "A personal preference",
              "Members compared interpretations",
            ],
            [
              "May pamagat ang kuwento",
              "Personal na kagustuhan",
              "Inihambing ng kasapi ang pagkaunawa",
            ],
          ],
          answer: 2,
          why: [
            "The detail explains how the main result was achieved.",
            "Ipinapaliwanag ng detalye kung paano nakamit ang resulta.",
          ],
        },
      ],
    },
    {
      title: ["A Clearer Notice", "Mas Malinaw na Abiso"],
      passage: [
        "The council added the date, room, and contact person to its announcement. Members no longer had to ask where or when to attend. Complete details made the notice useful.",
        "Idinagdag ang petsa, silid, at taong makokontak. Hindi na kailangang itanong ang saan at kailan. Naging kapaki-pakinabang ang kumpletong detalye.",
      ],
      questions: [
        {
          word: ["MAIN MESSAGE", "PANGUNAHING MENSAHE"],
          q: [
            "Which headline captures the whole passage?",
            "Aling pamagat ang sumasaklaw sa buong sipi?",
          ],
          options: [
            [
              "A Completely Different Topic",
              "The Best Project Ever",
              "Complete Details Make Announcements Useful",
            ],
            [
              "Ibang Paksa",
              "Pinakamahusay na Proyekto",
              "Kapaki-pakinabang ang Kumpletong Anunsyo",
            ],
          ],
          answer: 2,
          why: [
            "This headline covers the actions and their shared purpose.",
            "Saklaw ng pamagat ang mga kilos at iisang layunin.",
          ],
        },
        {
          word: ["SUPPORTING DETAIL", "SUMUSUPORTANG DETALYE"],
          q: [
            "Which detail directly supports that headline?",
            "Anong detalye ang direktang suporta sa pamagat?",
          ],
          options: [
            [
              "The notice included the date and room",
              "The council has members",
              "A detail unrelated to the claim",
            ],
            [
              "May petsa at silid ang abiso",
              "May kasapi ang konseho",
              "Di-kaugnay na detalye",
            ],
          ],
          answer: 0,
          why: [
            "The detail explains how the main result was achieved.",
            "Ipinapaliwanag ng detalye kung paano nakamit ang resulta.",
          ],
        },
      ],
    },
  ],
});
ARCADE.push({
  id: "fact",
  name: ["Fact or View", "Katotohanan o Opinyon"],
  skill: ["Critical reading", "Mapanuring pagbasa"],
  desc: [
    "Sort newsroom claims into factual statements and opinions.",
    "Iuri ang pahayag ng katotohanan at opinyon.",
  ],
  icon: "◇",
  theme: "purple",
  rounds: [
    {
      title: ["Exhibit Notes", "Tala sa Eksibit"],
      passage: [
        "A school newsletter contains the following statements. Sort the claims by what they express; a checkable claim still needs evidence to establish that it is true.",
        "May mga pahayag sa newsletter ng paaralan. Iuri ang mga ito; kailangan pa rin ng ebidensya upang patunayang totoo ang masusuring pahayag.",
      ],
      questions: [
        {
          word: ["CLAIM 1", "PAHAYAG 1"],
          q: [
            "The exhibit opened at nine.",
            "Nagbukas ang eksibit nang alas-nuwebe.",
          ],
          options: [
            ["Checkable factual claim", "Opinion / judgment"],
            ["Masusuring pahayag ng katotohanan", "Opinyon / paghatol"],
          ],
          answer: 0,
          why: [
            "This claim can be checked with records or observation.",
            "Masusuri ito gamit ang tala o obserbasyon.",
          ],
        },
        {
          word: ["CLAIM 2", "PAHAYAG 2"],
          q: ["It displayed twelve posters.", "May labindalawang poster."],
          options: [
            ["Checkable factual claim", "Opinion / judgment"],
            ["Masusuring pahayag ng katotohanan", "Opinyon / paghatol"],
          ],
          answer: 0,
          why: [
            "This claim can be checked with records or observation.",
            "Masusuri ito gamit ang tala o obserbasyon.",
          ],
        },
        {
          word: ["CLAIM 3", "PAHAYAG 3"],
          q: [
            "It was the most exciting event of the year.",
            "Ito ang pinakamasayang programa ng taon.",
          ],
          options: [
            ["Checkable factual claim", "Opinion / judgment"],
            ["Masusuring pahayag ng katotohanan", "Opinyon / paghatol"],
          ],
          answer: 1,
          why: [
            "This expresses a preference or judgment, not an objectively checkable measure.",
            "Personal na kagustuhan o paghatol ang pahayag.",
          ],
        },
        {
          word: ["CLAIM 4", "PAHAYAG 4"],
          q: [
            "Blue is the best poster color.",
            "Asul ang pinakamagandang kulay ng poster.",
          ],
          options: [
            ["Checkable factual claim", "Opinion / judgment"],
            ["Masusuring pahayag ng katotohanan", "Opinyon / paghatol"],
          ],
          answer: 1,
          why: [
            "This expresses a preference or judgment, not an objectively checkable measure.",
            "Personal na kagustuhan o paghatol ang pahayag.",
          ],
        },
      ],
    },
    {
      title: ["Library Voices", "Mga Tinig sa Aklatan"],
      passage: [
        "A school newsletter contains the following statements. Sort the claims by what they express; a checkable claim still needs evidence to establish that it is true.",
        "May mga pahayag sa newsletter ng paaralan. Iuri ang mga ito; kailangan pa rin ng ebidensya upang patunayang totoo ang masusuring pahayag.",
      ],
      questions: [
        {
          word: ["CLAIM 1", "PAHAYAG 1"],
          q: [
            "The library has four reading tables.",
            "May apat na mesa sa aklatan.",
          ],
          options: [
            ["Checkable factual claim", "Opinion / judgment"],
            ["Masusuring pahayag ng katotohanan", "Opinyon / paghatol"],
          ],
          answer: 0,
          why: [
            "This claim can be checked with records or observation.",
            "Masusuri ito gamit ang tala o obserbasyon.",
          ],
        },
        {
          word: ["CLAIM 2", "PAHAYAG 2"],
          q: ["It closes at five.", "Nagsasara ito nang alas-singko."],
          options: [
            ["Checkable factual claim", "Opinion / judgment"],
            ["Masusuring pahayag ng katotohanan", "Opinyon / paghatol"],
          ],
          answer: 0,
          why: [
            "This claim can be checked with records or observation.",
            "Masusuri ito gamit ang tala o obserbasyon.",
          ],
        },
        {
          word: ["CLAIM 3", "PAHAYAG 3"],
          q: [
            "The corner chair is the most comfortable.",
            "Pinakakomportable ang upuan sa sulok.",
          ],
          options: [
            ["Checkable factual claim", "Opinion / judgment"],
            ["Masusuring pahayag ng katotohanan", "Opinyon / paghatol"],
          ],
          answer: 1,
          why: [
            "This expresses a preference or judgment, not an objectively checkable measure.",
            "Personal na kagustuhan o paghatol ang pahayag.",
          ],
        },
        {
          word: ["CLAIM 4", "PAHAYAG 4"],
          q: [
            "Everyone should prefer printed books.",
            "Dapat mas gusto ng lahat ang nakalimbag na aklat.",
          ],
          options: [
            ["Checkable factual claim", "Opinion / judgment"],
            ["Masusuring pahayag ng katotohanan", "Opinyon / paghatol"],
          ],
          answer: 1,
          why: [
            "This expresses a preference or judgment, not an objectively checkable measure.",
            "Personal na kagustuhan o paghatol ang pahayag.",
          ],
        },
      ],
    },
    {
      title: ["Garden Updates", "Balita sa Hardin"],
      passage: [
        "A school newsletter contains the following statements. Sort the claims by what they express; a checkable claim still needs evidence to establish that it is true.",
        "May mga pahayag sa newsletter ng paaralan. Iuri ang mga ito; kailangan pa rin ng ebidensya upang patunayang totoo ang masusuring pahayag.",
      ],
      questions: [
        {
          word: ["CLAIM 1", "PAHAYAG 1"],
          q: ["The group planted ten seeds.", "Nagtanim ng sampung buto."],
          options: [
            ["Checkable factual claim", "Opinion / judgment"],
            ["Masusuring pahayag ng katotohanan", "Opinyon / paghatol"],
          ],
          answer: 0,
          why: [
            "This claim can be checked with records or observation.",
            "Masusuri ito gamit ang tala o obserbasyon.",
          ],
        },
        {
          word: ["CLAIM 2", "PAHAYAG 2"],
          q: ["Seven seeds sprouted.", "Tumubo ang pito."],
          options: [
            ["Checkable factual claim", "Opinion / judgment"],
            ["Masusuring pahayag ng katotohanan", "Opinyon / paghatol"],
          ],
          answer: 0,
          why: [
            "This claim can be checked with records or observation.",
            "Masusuri ito gamit ang tala o obserbasyon.",
          ],
        },
        {
          word: ["CLAIM 3", "PAHAYAG 3"],
          q: [
            "Gardening is the most relaxing hobby.",
            "Paghahardin ang pinaka-nakakarelaks na libangan.",
          ],
          options: [
            ["Checkable factual claim", "Opinion / judgment"],
            ["Masusuring pahayag ng katotohanan", "Opinyon / paghatol"],
          ],
          answer: 1,
          why: [
            "This expresses a preference or judgment, not an objectively checkable measure.",
            "Personal na kagustuhan o paghatol ang pahayag.",
          ],
        },
        {
          word: ["CLAIM 4", "PAHAYAG 4"],
          q: [
            "The garden is prettier than every other project.",
            "Mas maganda ang hardin kaysa lahat ng proyekto.",
          ],
          options: [
            ["Checkable factual claim", "Opinion / judgment"],
            ["Masusuring pahayag ng katotohanan", "Opinyon / paghatol"],
          ],
          answer: 1,
          why: [
            "This expresses a preference or judgment, not an objectively checkable measure.",
            "Personal na kagustuhan o paghatol ang pahayag.",
          ],
        },
      ],
    },
    {
      title: ["Club Messages", "Mensahe ng Samahan"],
      passage: [
        "A school newsletter contains the following statements. Sort the claims by what they express; a checkable claim still needs evidence to establish that it is true.",
        "May mga pahayag sa newsletter ng paaralan. Iuri ang mga ito; kailangan pa rin ng ebidensya upang patunayang totoo ang masusuring pahayag.",
      ],
      questions: [
        {
          word: ["CLAIM 1", "PAHAYAG 1"],
          q: [
            "The club met on Tuesday.",
            "Nagpulong ang samahan noong Martes.",
          ],
          options: [
            ["Checkable factual claim", "Opinion / judgment"],
            ["Masusuring pahayag ng katotohanan", "Opinyon / paghatol"],
          ],
          answer: 0,
          why: [
            "This claim can be checked with records or observation.",
            "Masusuri ito gamit ang tala o obserbasyon.",
          ],
        },
        {
          word: ["CLAIM 2", "PAHAYAG 2"],
          q: ["Eight members attended.", "Dumalo ang walong kasapi."],
          options: [
            ["Checkable factual claim", "Opinion / judgment"],
            ["Masusuring pahayag ng katotohanan", "Opinyon / paghatol"],
          ],
          answer: 0,
          why: [
            "This claim can be checked with records or observation.",
            "Masusuri ito gamit ang tala o obserbasyon.",
          ],
        },
        {
          word: ["CLAIM 3", "PAHAYAG 3"],
          q: [
            "Tuesday is the perfect meeting day.",
            "Martes ang perpektong araw ng pulong.",
          ],
          options: [
            ["Checkable factual claim", "Opinion / judgment"],
            ["Masusuring pahayag ng katotohanan", "Opinyon / paghatol"],
          ],
          answer: 1,
          why: [
            "This expresses a preference or judgment, not an objectively checkable measure.",
            "Personal na kagustuhan o paghatol ang pahayag.",
          ],
        },
        {
          word: ["CLAIM 4", "PAHAYAG 4"],
          q: [
            "This club is the best in school.",
            "Ito ang pinakamahusay na samahan sa paaralan.",
          ],
          options: [
            ["Checkable factual claim", "Opinion / judgment"],
            ["Masusuring pahayag ng katotohanan", "Opinyon / paghatol"],
          ],
          answer: 1,
          why: [
            "This expresses a preference or judgment, not an objectively checkable measure.",
            "Personal na kagustuhan o paghatol ang pahayag.",
          ],
        },
      ],
    },
    {
      title: ["Canteen Notes", "Tala sa Kantina"],
      passage: [
        "A school newsletter contains the following statements. Sort the claims by what they express; a checkable claim still needs evidence to establish that it is true.",
        "May mga pahayag sa newsletter ng paaralan. Iuri ang mga ito; kailangan pa rin ng ebidensya upang patunayang totoo ang masusuring pahayag.",
      ],
      questions: [
        {
          word: ["CLAIM 1", "PAHAYAG 1"],
          q: [
            "The menu lists three rice meals.",
            "May tatlong rice meal sa menu.",
          ],
          options: [
            ["Checkable factual claim", "Opinion / judgment"],
            ["Masusuring pahayag ng katotohanan", "Opinyon / paghatol"],
          ],
          answer: 0,
          why: [
            "This claim can be checked with records or observation.",
            "Masusuri ito gamit ang tala o obserbasyon.",
          ],
        },
        {
          word: ["CLAIM 2", "PAHAYAG 2"],
          q: ["The meal costs fifty pesos.", "Limampung piso ang pagkain."],
          options: [
            ["Checkable factual claim", "Opinion / judgment"],
            ["Masusuring pahayag ng katotohanan", "Opinyon / paghatol"],
          ],
          answer: 0,
          why: [
            "This claim can be checked with records or observation.",
            "Masusuri ito gamit ang tala o obserbasyon.",
          ],
        },
        {
          word: ["CLAIM 3", "PAHAYAG 3"],
          q: [
            "This is the tastiest meal available.",
            "Ito ang pinakamasarap na pagkain.",
          ],
          options: [
            ["Checkable factual claim", "Opinion / judgment"],
            ["Masusuring pahayag ng katotohanan", "Opinyon / paghatol"],
          ],
          answer: 1,
          why: [
            "This expresses a preference or judgment, not an objectively checkable measure.",
            "Personal na kagustuhan o paghatol ang pahayag.",
          ],
        },
        {
          word: ["CLAIM 4", "PAHAYAG 4"],
          q: ["The new menu is wonderful.", "Napakaganda ng bagong menu."],
          options: [
            ["Checkable factual claim", "Opinion / judgment"],
            ["Masusuring pahayag ng katotohanan", "Opinyon / paghatol"],
          ],
          answer: 1,
          why: [
            "This expresses a preference or judgment, not an objectively checkable measure.",
            "Personal na kagustuhan o paghatol ang pahayag.",
          ],
        },
      ],
    },
    {
      title: ["Event Reactions", "Reaksyon sa Programa"],
      passage: [
        "A school newsletter contains the following statements. Sort the claims by what they express; a checkable claim still needs evidence to establish that it is true.",
        "May mga pahayag sa newsletter ng paaralan. Iuri ang mga ito; kailangan pa rin ng ebidensya upang patunayang totoo ang masusuring pahayag.",
      ],
      questions: [
        {
          word: ["CLAIM 1", "PAHAYAG 1"],
          q: ["The program lasted one hour.", "Isang oras ang programa."],
          options: [
            ["Checkable factual claim", "Opinion / judgment"],
            ["Masusuring pahayag ng katotohanan", "Opinyon / paghatol"],
          ],
          answer: 0,
          why: [
            "This claim can be checked with records or observation.",
            "Masusuri ito gamit ang tala o obserbasyon.",
          ],
        },
        {
          word: ["CLAIM 2", "PAHAYAG 2"],
          q: [
            "The speaker answered five questions.",
            "Sinagot ng tagapagsalita ang limang tanong.",
          ],
          options: [
            ["Checkable factual claim", "Opinion / judgment"],
            ["Masusuring pahayag ng katotohanan", "Opinyon / paghatol"],
          ],
          answer: 0,
          why: [
            "This claim can be checked with records or observation.",
            "Masusuri ito gamit ang tala o obserbasyon.",
          ],
        },
        {
          word: ["CLAIM 3", "PAHAYAG 3"],
          q: [
            "The talk was more enjoyable than any movie.",
            "Mas masaya ang talumpati kaysa anumang pelikula.",
          ],
          options: [
            ["Checkable factual claim", "Opinion / judgment"],
            ["Masusuring pahayag ng katotohanan", "Opinyon / paghatol"],
          ],
          answer: 1,
          why: [
            "This expresses a preference or judgment, not an objectively checkable measure.",
            "Personal na kagustuhan o paghatol ang pahayag.",
          ],
        },
        {
          word: ["CLAIM 4", "PAHAYAG 4"],
          q: [
            "The speaker’s style was perfect.",
            "Perpekto ang estilo ng tagapagsalita.",
          ],
          options: [
            ["Checkable factual claim", "Opinion / judgment"],
            ["Masusuring pahayag ng katotohanan", "Opinyon / paghatol"],
          ],
          answer: 1,
          why: [
            "This expresses a preference or judgment, not an objectively checkable measure.",
            "Personal na kagustuhan o paghatol ang pahayag.",
          ],
        },
      ],
    },
  ],
});
MISSIONS.push(
  ...[
    {
      title: ["Breakfast for the Early Shift", "Almusal sa Maagang Tungkulin"],
      skill: 0,
      location: "gym",
      supply: "food",
      evidence: 1,
      sentences: [
        [
          "Gym volunteers start at six in the morning.",
          "Their breakfast delivery was canceled, leaving them without meals.",
          "They have enough water and blankets.",
          "The other locations received meals last night.",
        ],
        [
          "Alas-sais nagsisimula ang boluntaryo sa gym.",
          "Kinansela ang almusal kaya wala silang pagkain.",
          "May sapat na tubig at kumot.",
          "May pagkain na ang ibang lugar kagabi.",
        ],
      ],
      explain: [
        "The gym has a food shortage after its canceled breakfast.",
        "Kulang ang pagkain sa gym dahil sa kinanselang almusal.",
      ],
    },
    {
      title: ["A Cold Waiting Room", "Malamig na Hintayan"],
      skill: 1,
      location: "health",
      supply: "blankets",
      evidence: 1,
      sentences: [
        [
          "Families wait at the health center.",
          "Cold wind enters the corridor, and children hug themselves to stay warm.",
          "Meals and water are already provided.",
          "The gym and hall have enough dry blankets.",
        ],
        [
          "Naghihintay ang pamilya sa sentro ng kalusugan.",
          "Malamig ang hangin sa pasilyo at niyayakap ng bata ang sarili upang mainitan.",
          "May pagkain at tubig na.",
          "May sapat na kumot sa gym at bulwagan.",
        ],
      ],
      explain: [
        "Cold conditions suggest a need for blankets at the health center.",
        "Ipinahihiwatig ng lamig ang pangangailangan ng kumot sa sentro ng kalusugan.",
      ],
    },
    {
      title: ["The Last Water Delivery", "Huling Paghahatid ng Tubig"],
      skill: 2,
      location: "hall",
      supply: "water",
      evidence: 1,
      sentences: [
        [
          "Only one water delivery is available before three.",
          "The hall runs out of drinking water at two today.",
          "The gym and health center have water until tomorrow.",
          "All locations have food and blankets.",
        ],
        [
          "Isang paghahatid ng tubig lamang bago alas-tres.",
          "Alas-dos ngayon mauubusan ng tubig ang bulwagan.",
          "May tubig sa gym at sentro hanggang bukas.",
          "May pagkain at kumot sa lahat.",
        ],
      ],
      explain: [
        "The hall has the earliest shortage, so its water request comes first.",
        "Unang mauubusan ang bulwagan kaya unahin ang tubig dito.",
      ],
    },
  ],
);
DEBRIEF.push(
  ...[
    [
      {
        q: [
          "Where is the unmet need?",
          "Saan ang hindi pa natugunang pangangailangan?",
        ],
        options: [
          ["School gym", "Health center", "Barangay hall"],
          ["Gym", "Sentro ng kalusugan", "Bulwagan"],
        ],
        answer: 0,
        why: [
          "The gym has a food shortage after its canceled breakfast.",
          "Kulang ang pagkain sa gym dahil sa kinanselang almusal.",
        ],
      },
      {
        q: [
          "Which supply addresses that need?",
          "Anong suplay ang tugon sa pangangailangan?",
        ],
        options: [
          ["Food", "Water", "Blankets"],
          ["Pagkain", "Tubig", "Kumot"],
        ],
        answer: 0,
        why: [
          "The gym has a food shortage after its canceled breakfast.",
          "Kulang ang pagkain sa gym dahil sa kinanselang almusal.",
        ],
      },
    ],
    [
      {
        q: [
          "Where is the unmet need?",
          "Saan ang hindi pa natugunang pangangailangan?",
        ],
        options: [
          ["School gym", "Health center", "Barangay hall"],
          ["Gym", "Sentro ng kalusugan", "Bulwagan"],
        ],
        answer: 1,
        why: [
          "Cold conditions suggest a need for blankets at the health center.",
          "Ipinahihiwatig ng lamig ang pangangailangan ng kumot sa sentro ng kalusugan.",
        ],
      },
      {
        q: [
          "Which supply addresses that need?",
          "Anong suplay ang tugon sa pangangailangan?",
        ],
        options: [
          ["Food", "Water", "Blankets"],
          ["Pagkain", "Tubig", "Kumot"],
        ],
        answer: 2,
        why: [
          "Cold conditions suggest a need for blankets at the health center.",
          "Ipinahihiwatig ng lamig ang pangangailangan ng kumot sa sentro ng kalusugan.",
        ],
      },
    ],
    [
      {
        q: [
          "Where is the unmet need?",
          "Saan ang hindi pa natugunang pangangailangan?",
        ],
        options: [
          ["School gym", "Health center", "Barangay hall"],
          ["Gym", "Sentro ng kalusugan", "Bulwagan"],
        ],
        answer: 2,
        why: [
          "The hall has the earliest shortage, so its water request comes first.",
          "Unang mauubusan ang bulwagan kaya unahin ang tubig dito.",
        ],
      },
      {
        q: [
          "Which supply addresses that need?",
          "Anong suplay ang tugon sa pangangailangan?",
        ],
        options: [
          ["Food", "Water", "Blankets"],
          ["Pagkain", "Tubig", "Kumot"],
        ],
        answer: 1,
        why: [
          "The hall has the earliest shortage, so its water request comes first.",
          "Unang mauubusan ang bulwagan kaya unahin ang tubig dito.",
        ],
      },
    ],
  ],
);
