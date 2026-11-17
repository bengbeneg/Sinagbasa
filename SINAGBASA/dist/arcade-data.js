const ARCADE = [
  {
    id: "sequence",
    icon: "⇄",
    name: ["Story Repair", "Ayusin ang Kuwento"],
    skill: ["Sequence & cause and effect", "Pagkakasunod at sanhi at bunga"],
    desc: [
      "Rebuild three scrambled stories. Put every event back where it belongs.",
      "Ayusin ang tatlong kuwentong nagulo. Ilagay ang bawat pangyayari sa tamang pagkakasunod.",
    ],
    theme: "blue",
    rounds: [
      {
        title: ["The Library Rescue", "Pagsagip sa Aklatan"],
        passage: [
          "When Mara opened the library, she noticed water dripping near a shelf. She moved the books to a dry table before calling the caretaker. The caretaker fixed the leaking pipe. Only after the floor was dry did Mara return the books to the shelf.",
          "Pagbukas ni Mara ng aklatan, napansin niyang may tumutulong tubig malapit sa estante. Inilipat niya ang mga aklat sa tuyong mesa bago tawagan ang tagapangasiwa. Inayos nito ang tumutulong tubo. Nang matuyo lamang ang sahig ibinalik ni Mara ang mga aklat sa estante.",
        ],
        events: [
          [
            "Mara noticed the leak.",
            "She moved the books to a dry table.",
            "The caretaker repaired the pipe.",
            "She returned the books after the floor dried.",
          ],
          [
            "Napansin ni Mara ang tagas.",
            "Inilipat niya ang mga aklat sa tuyong mesa.",
            "Inayos ng tagapangasiwa ang tubo.",
            "Ibinalik niya ang mga aklat nang matuyo ang sahig.",
          ],
        ],
        why: [
          "The books were moved before the repair to keep them dry. Returning them happened last.",
          "Inilipat muna ang mga aklat upang hindi mabasa bago ayusin ang tubo. Huling ginawa ang pagbabalik ng mga aklat.",
        ],
      },
      {
        title: ["The Garden Project", "Proyekto sa Hardin"],
        passage: [
          "The class first tested two places for sunlight. They chose the brighter area, then removed weeds and prepared the soil. After planting seeds, they watered the garden. A week later, they recorded the first seedlings.",
          "Sinuri muna ng klase ang sikat ng araw sa dalawang lugar. Pinili nila ang mas maliwanag na lugar, saka inalis ang damo at inihanda ang lupa. Pagkatapos magtanim ng mga buto, diniligan nila ang hardin. Makalipas ang isang linggo, itinala nila ang mga unang punla.",
        ],
        events: [
          [
            "The class compared sunlight in two places.",
            "They cleared weeds and prepared the chosen area.",
            "They planted seeds and watered them.",
            "They recorded the seedlings a week later.",
          ],
          [
            "Inihambing ng klase ang sikat ng araw sa dalawang lugar.",
            "Inalis nila ang damo at inihanda ang napiling lugar.",
            "Nagtanim sila ng mga buto at diniligan ang mga ito.",
            "Itinala nila ang mga punla makalipas ang isang linggo.",
          ],
        ],
        why: [
          "Testing came before choosing and preparing the area. Seedlings appeared after planting.",
          "Nauna ang pagsusuri bago pumili at maghanda ng lugar. Lumitaw ang mga punla matapos magtanim.",
        ],
      },
      {
        title: ["The Missing Permission Slip", "Nawawalang Pahintulot"],
        passage: [
          "Luis packed his bag the night before the trip. At school, he realized his signed permission slip was missing. He called his mother, who found it on the kitchen table. She brought it to school, and the teacher checked it before Luis boarded the bus.",
          "Inayos ni Luis ang kanyang bag noong gabi bago ang biyahe. Sa paaralan, napansin niyang wala ang pinirmahang pahintulot. Tinawagan niya ang kanyang ina, na nakakita nito sa mesa sa kusina. Dinala niya ito sa paaralan, at sinuri ng guro bago sumakay si Luis sa bus.",
        ],
        events: [
          [
            "Luis packed his bag.",
            "He noticed the missing slip and called his mother.",
            "His mother found and delivered the slip.",
            "The teacher checked the slip before he boarded.",
          ],
          [
            "Inayos ni Luis ang kanyang bag.",
            "Napansin niyang wala ang pahintulot at tinawagan ang ina.",
            "Nakita at dinala ng kanyang ina ang pahintulot.",
            "Sinuri ng guro ang pahintulot bago siya sumakay.",
          ],
        ],
        why: [
          "The call followed the discovery. The teacher checked the delivered slip before Luis boarded.",
          "Sumunod ang tawag sa pagkakatuklas. Sinuri ng guro ang dinalang pahintulot bago sumakay si Luis.",
        ],
      },
    ],
  },
  {
    id: "detective",
    icon: "◎",
    name: ["Evidence Detective", "Detektib ng Ebidensya"],
    skill: ["Inference & supporting evidence", "Paghihinuha at ebidensya"],
    desc: [
      "Investigate three cases. Make a claim, then pin the clue that proves it.",
      "Siyasatin ang tatlong kaso. Pumili ng pasya at tukuyin ang sumusuportang pahiwatig.",
    ],
    theme: "purple",
    rounds: [
      {
        title: ["The Quiet Volunteer", "Tahimik na Boluntaryo"],
        sentences: [
          [
            "Ana arrived early to help prepare the event.",
            "She finished setting up chairs without being asked.",
            "When the coordinator thanked her, she smiled and returned to arranging the materials.",
            "Later, other students joined the preparation.",
          ],
          [
            "Maagang dumating si Ana upang tumulong sa paghahanda ng programa.",
            "Natapos niyang ayusin ang mga upuan kahit hindi siya inutusan.",
            "Nang pasalamatan siya ng tagapangasiwa, ngumiti siya at bumalik sa pag-aayos ng mga kagamitan.",
            "Kalaunan, tumulong din ang ibang mag-aaral.",
          ],
        ],
        question: [
          "What can you reasonably infer about Ana?",
          "Ano ang makatwirang mahihinuha tungkol kay Ana?",
        ],
        options: [
          [
            "She takes initiative.",
            "She dislikes working with others.",
            "She is the event coordinator.",
          ],
          [
            "Kusa siyang kumikilos.",
            "Ayaw niyang makipagtulungan.",
            "Siya ang tagapangasiwa ng programa.",
          ],
        ],
        answer: 0,
        evidence: 1,
        why: [
          "Finishing the chairs without being asked supports initiative. The passage does not identify her as the coordinator or say she dislikes others.",
          "Ang pag-aayos ng upuan kahit hindi inutusan ay sumusuporta sa pagkukusa. Hindi sinabing siya ang tagapangasiwa o ayaw niya sa iba.",
        ],
      },
      {
        title: ["The Changed Meeting", "Binagong Pulong"],
        sentences: [
          [
            "The reading club usually meets in the library on Fridays.",
            "A notice says the library will be closed this Friday for repairs.",
            "The club adviser reserved Room 12 for the same time instead.",
            "Members were asked to bring their usual reading materials.",
          ],
          [
            "Karaniwang nagpupulong ang reading club sa aklatan tuwing Biyernes.",
            "Ayon sa abiso, sarado ang aklatan ngayong Biyernes dahil sa pagkukumpuni.",
            "Inireserba ng tagapayo ang Room 12 sa parehong oras.",
            "Hiniling sa mga kasapi na dalhin ang karaniwang babasahin.",
          ],
        ],
        question: [
          "What will happen to Friday’s meeting?",
          "Ano ang mangyayari sa pulong sa Biyernes?",
        ],
        options: [
          [
            "It will be canceled.",
            "It will take place in another room.",
            "It will move to Saturday.",
          ],
          [
            "Kakanselahin ito.",
            "Gaganapin ito sa ibang silid.",
            "Ililipat ito sa Sabado.",
          ],
        ],
        answer: 1,
        evidence: 2,
        why: [
          "The adviser reserved Room 12 for the same time. That supports a change of room, not a cancellation or a new day.",
          "Nagpareserba ang tagapayo ng Room 12 sa parehong oras. Nagbago ang silid, hindi kinansela o inilipat sa ibang araw.",
        ],
      },
      {
        title: ["The Empty Collection Box", "Walang Laman na Kahon"],
        sentences: [
          [
            "A donation box was full when the volunteers left at noon.",
            "By afternoon, the box was empty.",
            "A signed delivery receipt on the desk listed the same donated items as received by the shelter at 1 p.m.",
            "The box itself was undamaged.",
          ],
          [
            "Puno ang kahon ng donasyon nang umalis ang mga boluntaryo sa tanghali.",
            "Pagsapit ng hapon, wala nang laman ang kahon.",
            "Nasa mesa ang pinirmahang resibo ng paghahatid na nagtala ng parehong mga donasyong tinanggap ng shelter nang ala-una.",
            "Walang sira ang kahon.",
          ],
        ],
        question: [
          "Which explanation is best supported?",
          "Aling paliwanag ang may pinakamalinaw na suporta?",
        ],
        options: [
          [
            "Someone stole the donations.",
            "The volunteers never collected anything.",
            "The donations were delivered to the shelter.",
          ],
          [
            "May nagnakaw ng donasyon.",
            "Walang nakolekta ang mga boluntaryo.",
            "Naihatid ang donasyon sa shelter.",
          ],
        ],
        answer: 2,
        evidence: 2,
        why: [
          "The signed receipt is evidence of delivery. An empty box alone would not establish theft.",
          "Ebidensya ng paghahatid ang pinirmahang resibo. Hindi sapat ang walang lamang kahon upang sabihing may pagnanakaw.",
        ],
      },
    ],
  },
  {
    id: "context",
    icon: "≋",
    name: ["Word Compass", "Kompas ng Salita"],
    skill: ["Vocabulary in context", "Talasalitaan sa konteksto"],
    desc: [
      "Use surrounding clues to unlock nine word challenges across three passages.",
      "Gamitin ang mga pahiwatig sa teksto upang sagutin ang siyam na tanong sa tatlong sipi.",
    ],
    theme: "orange",
    rounds: [
      {
        title: ["A Community Pantry", "Pantry ng Komunidad"],
        passage: [
          "Food was scarce after the storm; only a few packets remained on the shelves. Volunteers pooled their supplies, combining rice, vegetables, and canned goods from several homes. They distributed the food equitably, giving each household a share based on its number of members.",
          "Kakaunti ang pagkain matapos ang bagyo; ilang pakete lamang ang natira sa mga estante. Pinagsama-sama ng mga boluntaryo ang kanilang suplay mula sa ilang tahanan. Ipinamahagi nila ito nang patas, batay sa bilang ng kasapi ng bawat pamilya.",
        ],
        questions: [
          {
            word: ["scarce", "kakaunti"],
            q: [
              "What does “scarce” mean here?",
              "Ano ang ibig sabihin ng “kakaunti” rito?",
            ],
            options: [
              [
                "Available in large amounts",
                "In short supply",
                "Too expensive to buy",
              ],
              [
                "Maraming suplay",
                "Kaunti lamang ang suplay",
                "Napakamahal bilhin",
              ],
            ],
            answer: 1,
            why: [
              "“Only a few packets remained” signals a shortage.",
              "Ipinapakita ng “ilang pakete lamang ang natira” ang kakulangan.",
            ],
          },
          {
            word: ["pooled", "pinagsama-sama"],
            q: [
              "What did the volunteers do when they “pooled” supplies?",
              "Ano ang ginawa sa mga suplay na “pinagsama-sama”?",
            ],
            options: [
              [
                "Combined what they had",
                "Threw everything away",
                "Kept each supply separate",
              ],
              [
                "Pinag-isa ang kanilang suplay",
                "Itinapon ang lahat",
                "Pinaghiwalay ang bawat suplay",
              ],
            ],
            answer: 0,
            why: [
              "The next phrase explains pooling: combining supplies from several homes.",
              "Ipinapaliwanag ng suplay mula sa ilang tahanan ang pagsasama-sama.",
            ],
          },
          {
            word: ["equitably", "patas"],
            q: [
              "What makes the distribution equitable in this passage?",
              "Bakit patas ang pamamahagi sa sipi?",
            ],
            options: [
              [
                "The first family got everything",
                "Every family got exactly one item",
                "Shares reflected household size",
              ],
              [
                "Nakuha ng unang pamilya ang lahat",
                "Tig-isang bagay ang lahat",
                "Batay ang bahagi sa laki ng pamilya",
              ],
            ],
            answer: 2,
            why: [
              "The passage explicitly bases each share on the number of household members.",
              "Tahasan na ibinatay ang bahagi sa bilang ng kasapi ng pamilya.",
            ],
          },
        ],
      },
      {
        title: ["The School Exhibit", "Eksibit sa Paaralan"],
        passage: [
          "The class created a makeshift display using spare cardboard because proper stands had not arrived. Although their materials were modest, the team was meticulous: they checked every label and aligned each picture carefully. Their effort was evident when visitors could follow the exhibit without asking for directions.",
          "Gumawa ang klase ng pansamantalang display gamit ang sobrang karton dahil hindi pa dumating ang mga patungan. Simple ang materyales ngunit masinop ang pangkat: sinuri nila ang bawat label at maingat na inayos ang larawan. Kitang-kita ang kanilang pagsisikap dahil nasundan ng mga bisita ang eksibit nang hindi nagtatanong ng direksyon.",
        ],
        questions: [
          {
            word: ["makeshift", "pansamantala"],
            q: [
              "What does “makeshift” describe?",
              "Ano ang tinutukoy ng “pansamantala”?",
            ],
            options: [
              [
                "An improvised temporary solution",
                "A permanent stone structure",
                "An expensive finished display",
              ],
              [
                "Pansamantalang alternatibong ginawa",
                "Permanenteng estrukturang bato",
                "Mamahaling tapos na display",
              ],
            ],
            answer: 0,
            why: [
              "They used spare cardboard while waiting for the proper stands.",
              "Gumamit sila ng sobrang karton habang hinihintay ang mga patungan.",
            ],
          },
          {
            word: ["meticulous", "masinop"],
            q: [
              "What does “meticulous” mean here?",
              "Ano ang kahulugan ng “masinop” dito?",
            ],
            options: [
              [
                "Careless and hurried",
                "Careful about details",
                "Uninterested in the work",
              ],
              [
                "Pabaya at nagmamadali",
                "Maingat sa mga detalye",
                "Walang interes sa gawain",
              ],
            ],
            answer: 1,
            why: [
              "Checking every label and carefully aligning pictures show attention to detail.",
              "Ipinapakita ng pagsusuri sa bawat label at maingat na pag-aayos ang pagtuon sa detalye.",
            ],
          },
          {
            word: ["evident", "kitang-kita"],
            q: [
              "What does “evident” mean?",
              "Ano ang ibig sabihin ng “kitang-kita”?",
            ],
            options: [
              ["Hidden from everyone", "Still uncertain", "Clearly noticeable"],
              ["Nakatago sa lahat", "Hindi pa tiyak", "Malinaw na napapansin"],
            ],
            answer: 2,
            why: [
              "Visitors could navigate easily, making the team’s effort observable.",
              "Madaling nasundan ng mga bisita ang eksibit kaya kapansin-pansin ang pagsisikap.",
            ],
          },
        ],
      },
      {
        title: ["A Reading Club Decision", "Pasya ng Reading Club"],
        passage: [
          "The club initially planned a long novel, but some members found its language daunting and felt nervous about starting. The adviser proposed a shorter story instead. Members were receptive to the suggestion and agreed to try it. After discussing the first chapter, their hesitation subsided; they felt more comfortable continuing.",
          "Unang nagplano ang club ng mahabang nobela, ngunit nakakatakot ang wika nito para sa ilang kasapi at kinakabahan silang magsimula. Nagmungkahi ang tagapayo ng mas maikling kuwento. Bukas ang mga kasapi sa mungkahi at pumayag silang subukan ito. Matapos talakayin ang unang kabanata, humupa ang pag-aalinlangan at naging mas komportable silang magpatuloy.",
        ],
        questions: [
          {
            word: ["daunting", "nakakatakot"],
            q: [
              "How did the “daunting” language make some members feel?",
              "Ano ang epekto ng “nakakatakot” na wika sa ilang kasapi?",
            ],
            options: [
              [
                "Nervous about beginning",
                "Certain it would be easy",
                "Bored because it was familiar",
              ],
              [
                "Kinabahang magsimula",
                "Tiyak na madali ito",
                "Nainip dahil pamilyar ito",
              ],
            ],
            answer: 0,
            why: [
              "The sentence connects the language with nervousness about starting.",
              "Iniugnay ng pangungusap ang wika sa pagkakaba sa pagsisimula.",
            ],
          },
          {
            word: ["receptive", "bukas"],
            q: [
              "What does “receptive” suggest about the members?",
              "Ano ang ipinapahiwatig ng pagiging “bukas” sa mungkahi?",
            ],
            options: [
              [
                "They refused to listen",
                "They were willing to consider the idea",
                "They had already read the story",
              ],
              [
                "Tumanggi silang makinig",
                "Handa silang isaalang-alang ang ideya",
                "Nabasa na nila ang kuwento",
              ],
            ],
            answer: 1,
            why: [
              "They agreed to try the shorter story.",
              "Pumayag silang subukan ang mas maikling kuwento.",
            ],
          },
          {
            word: ["subsided", "humupa"],
            q: [
              "What happened when their hesitation “subsided”?",
              "Ano ang nangyari nang “humupa” ang pag-aalinlangan?",
            ],
            options: [
              [
                "It became stronger",
                "It stayed exactly the same",
                "It decreased",
              ],
              ["Lalo itong lumakas", "Hindi ito nagbago", "Nabawasan ito"],
            ],
            answer: 2,
            why: [
              "They became more comfortable continuing, showing less hesitation.",
              "Naging mas komportable silang magpatuloy, kaya nabawasan ang pag-aalinlangan.",
            ],
          },
        ],
      },
    ],
  },
];
const DEBRIEF = [
  [
    {
      q: [
        "What is the main purpose of this request?",
        "Ano ang pangunahing layunin ng kahilingan?",
      ],
      options: [
        [
          "To ask for urgent drinking water",
          "To invite families to a sports event",
          "To report a shortage of blankets",
        ],
        [
          "Humingi ng agarang maiinom na tubig",
          "Anyayahan ang pamilya sa palaro",
          "Iulat ang kakulangan ng kumot",
        ],
      ],
      answer: 0,
      why: [
        "The passage contrasts available supplies with the drinking water that will run out.",
        "Inihahambing ng sipi ang sapat na suplay sa tubig na mauubos.",
      ],
    },
    {
      q: [
        "Which statement is supported by the passage?",
        "Aling pahayag ang sinusuportahan ng sipi?",
      ],
      options: [
        [
          "All locations have no drinking water",
          "The gym has enough food for two days",
          "The families are staying at the health center",
        ],
        [
          "Walang tubig sa lahat ng lugar",
          "May pagkain ang gym para sa dalawang araw",
          "Nasa sentro ng kalusugan ang mga pamilya",
        ],
      ],
      answer: 1,
      why: [
        "Sentence B explicitly states that food is available for two days.",
        "Tahasan itong sinabi sa pangungusap B.",
      ],
    },
  ],
  [
    {
      q: [
        "Which detail explains the children’s need for warmth?",
        "Anong detalye ang nagpapaliwanag sa pangangailangan ng init?",
      ],
      options: [
        [
          "They arrived at the hall",
          "They already have meals",
          "Their clothes are wet and they are shivering",
        ],
        [
          "Dumating sila sa bulwagan",
          "May pagkain na sila",
          "Basang-basa ang damit at nanginginig sila",
        ],
      ],
      answer: 2,
      why: [
        "Wet clothes, cold air, and shivering support a need for dry blankets.",
        "Ang basang damit, lamig, at panginginig ay sumusuporta sa pangangailangan ng tuyong kumot.",
      ],
    },
    {
      q: [
        "What can you NOT conclude from this passage?",
        "Ano ang HINDI mahihinuha mula sa sipi?",
      ],
      options: [
        [
          "The families walked through rain",
          "The children have a diagnosed illness",
          "Meals are ready for everyone",
        ],
        [
          "Naglakad sa ulan ang pamilya",
          "May tiyak na sakit ang mga bata",
          "May nakahandang pagkain para sa lahat",
        ],
      ],
      answer: 1,
      why: [
        "Shivering supports cold conditions, but no illness is diagnosed in the passage.",
        "Ipinapahiwatig ng panginginig ang lamig, ngunit walang sakit na tinukoy sa sipi.",
      ],
    },
  ],
  [
    {
      q: [
        "Why should the health center be prioritized?",
        "Bakit dapat unahin ang sentro ng kalusugan?",
      ],
      options: [
        [
          "Its volunteers have no meals for the upcoming shift",
          "It is mentioned first",
          "The gym has no food",
        ],
        [
          "Walang pagkain ang mga boluntaryo sa paparating na tungkulin",
          "Ito ang unang nabanggit",
          "Walang pagkain ang gym",
        ],
      ],
      answer: 0,
      why: [
        "The volunteers’ shift starts at noon, and no meals remain.",
        "Magsisimula ang tungkulin sa tanghali at wala nang pagkain.",
      ],
    },
    {
      q: [
        "What resource limit affects the decision?",
        "Anong limitasyon sa suplay ang nakaaapekto sa pasya?",
      ],
      options: [
        [
          "No locations have blankets",
          "Only one food delivery is available before noon",
          "Water must be delivered to every location",
        ],
        [
          "Walang kumot sa lahat ng lugar",
          "Isang paghahatid ng pagkain lamang bago magtanghali",
          "Kailangang maghatid ng tubig sa lahat",
        ],
      ],
      answer: 1,
      why: [
        "Sentence A sets the one-delivery constraint.",
        "Itinatakda ng pangungusap A ang limitasyong isang paghahatid.",
      ],
    },
  ],
];
