"use strict";

// Stable, student-usable references shared by every lesson. Topic-specific
// teaching remains in each guide below; these links provide the source texts,
// curriculum basis, and an optional diagnostic reference without overcrowding
// the lesson page.
window.LESSON_RESOURCES = [
  {
    title: "DepEd Learning Portal · Reading and Writing Skills",
    desc: "Browse DepEd modules, lesson plans, handouts, and worksheets for Senior High School.",
    tag: "DEPED LR PORTAL",
    url: "https://lrmds.deped.gov.ph/list/subjects/609",
    use: "Use for the next topic-aligned module or teacher-approved practice material.",
  },
  {
    title: "DepEd SHS Reading and Writing Skills Curriculum Guide",
    desc: "Check the official competencies, content standards, and performance standards behind the lessons.",
    tag: "DEPED CURRICULUM",
    url: "https://lrmds.deped.gov.ph/detail/14520",
    use: "Use to connect each lesson skill to the wider SHS learning sequence.",
  },
  {
    title: "Phil-IRI Manual 2018",
    desc: "DepEd's reading-inventory manual for planning instruction based on oral, silent, and listening comprehension.",
    tag: "DEPED PHIL-IRI",
    url: "https://lrmds.deped.gov.ph/detail/13908",
    use: "Best used by a teacher or reading adviser when choosing targeted support.",
  },
  {
    title: "Purdue OWL · Reading Strategies",
    desc: "A concise supplementary guide to active reading, annotation, note-making, and synthesis.",
    tag: "SUPPLEMENTARY",
    url: "https://owl.purdue.edu/owl/general_writing/academic_writing/reading_strategies/index.html",
    use: "Use the annotation and summary techniques during independent reading.",
  },
];

window.LESSON_GUIDES = [
  {
    competency: [
      "DepEd SHS Core: EN11/12RWS-IIIa-1 · Locating explicit textual details",
      "DepEd SHS Filipino: F11PB-Ia-97 · Pagtukoy sa mga literal na impormasyon",
    ],
    time: ["4 mins study", "4 minutong pag-aaral"],
    conceptBullets: [
      [
        "Focus solely on facts directly stated and explicitly verifiable in the text.",
        "Separate essential facts (who, what, where, when, why) from background fluff.",
        "Never introduce external assumptions that the author did not clearly write.",
      ],
      [
        "Tumutok lamang sa mga katotohanang direkta at malinaw na isinasaad sa teksto.",
        "Ihiwalay ang mahahalagang detalye (sino, ano, saan, kailan, bakit) sa mga palamuting salita.",
        "Huwag magdagdag ng sariling palagay na wala sa mismong pahayag ng may-akda.",
      ],
    ],
    tips: [
      [
        "Anchor on the 5 Ws and 1 H (Who, What, Where, When, Why, How) before reading.",
        "Scan rapidly for capitalized names, specific dates, numerical quantities, and time markers.",
        "Watch out for mention versus need: a place named in passing is not necessarily the location needing help.",
        "The Finger Rule: if you cannot point your finger directly to the exact sentence, it is not a literal detail.",
      ],
      [
        "Gamiting gabay ang 5 Ws at 1 H (Sino, Ano, Saan, Kailan, Bakit, Paano) bago magbasa.",
        "Mabilisang hanapin ang malalaking titik (pangalan), petsa, numero, at palatandaan ng oras.",
        "Mag-ingat sa pagbanggit laban sa pangangailangan: ang nabanggit na lugar ay maaaring hindi siyang nangangailangan.",
        "Panuntunan ng Daliri: kung hindi mo maituturo ang mismong salita sa teksto, hindi ito literal na detalye.",
      ],
    ],
    steps: [
      [
        "1. Identify the Question Target: determine the exact piece of information needed.",
        "2. Keyword Scanning: scan the text vertically for signal nouns and numbers.",
        "3. Anchor Sentence Verification: stop and read the entire sentence containing the signal word.",
        "4. Boundary Check: read one sentence before and after to verify conditions or exclusions.",
      ],
      [
        "1. Alamin ang Hinahanap: tukuyin ang eksaktong impormasyong hinihingi.",
        "2. Pag-scan sa Keywords: basahin nang pahapyaw pababa upang matagpuan ang mga pangngalan at numero.",
        "3. Pagsusuri sa Pangungusap: basahing buo ang pangungusap na kinaroroonan ng pahiwatig.",
        "4. Pagsusuri sa Paligid: basahin ang nauna at kasunod na pangungusap upang masiguro ang konteksto.",
      ],
    ],
    example: {
      passage: [
        "The gym has food supplies for two days, but drinking water will completely run out tonight.",
        "May pagkain sa gym para sa dalawang araw, ngunit mauubos ang maiinom na tubig ngayong gabi.",
      ],
      breakdown: [
        [
          "• Fact 1: Food supplies are secure for a 2-day timeframe.",
          "• Fact 2: Drinking water has an imminent deadline ('tonight').",
          "• Analysis: The urgent requirement is drinking water due to the explicit time constraint.",
        ],
        [
          "• Katotohanan 1: Sapat ang pagkain para sa dalawang araw.",
          "• Katotohanan 2: May agarang banta sa tubig ('ngayong gabi').",
          "• Pagsusuri: Tubig ang agarang kailangan dahil sa malinaw na palugit ng oras.",
        ],
      ],
    },
    traps: [
      [
        "The Proximity Trap: assuming the first mentioned noun is automatically the most urgent.",
        "Prior Knowledge Bias: answering based on real-life assumptions rather than what the text states.",
      ],
      [
        "Bitag ng Pagkakasunod: pag-aakalang ang unang nabanggit na bagay ang siyang pinakamahalaga.",
        "Panghihimasok ng Sariling Kaalaman: pagsagot batay sa sariling karanasan sa halip na sa nakasulat.",
      ],
    ],
    resources: [
      {
        title: "DepEd LRMDS · Reading Comprehension Explicit Details Module",
        desc: "Official self-learning module on factual information retrieval for Senior High School.",
        tag: "DepEd Portal",
      },
      {
        title: "Phil-IRI Manual · Literal Level Comprehension Indicators",
        desc: "Standard Philippine Informal Reading Inventory diagnostic guide for secondary level readers.",
        tag: "Phil-IRI",
      },
      {
        title: "National Reading Program (NRP) · Fact-Scanning Strategy Sheet",
        desc: "Core DepEd reading intervention framework under MATATAG Curriculum.",
        tag: "DepEd NRP",
      },
    ],
  },
  {
    competency: [
      "DepEd SHS Core: EN11/12RWS-IIIa-2 · Making textual inferences",
      "DepEd SHS Filipino: F11PB-IIIa-98 · Paghihinuha sa mga pahiwatig ng teksto",
    ],
    time: ["5 mins study", "5 minutong pag-aaral"],
    conceptBullets: [
      [
        "An inference is a logical conclusion: Text Clues + Reader Reasoning = Supported Inference.",
        "The author implies meaning between the lines without stating it outright.",
        "Every valid inference must be firmly anchored in textual evidence, not wild guessing.",
      ],
      [
        "Ang hinuha ay lohikal na pasya: Pahiwatig ng Teksto + Pangangatwiran = Wastong Hinuha.",
        "Ipinahihiwatig ng may-akda ang mensahe nang hindi ito tahasang sinasabi.",
        "Dapat nakatuntong sa patunay ng teksto ang bawat hinuha, hindi sa hula lamang.",
      ],
    ],
    tips: [
      [
        "Notice sensory descriptions: shivering, soaked clothing, or silence reveal conditions.",
        "Identify emotional clues: word choice and reactions expose character feelings and urgency.",
        "Apply the conservative test: the simplest conclusion directly backed by clues is the strongest.",
        "Avoid adding dramatic details that the passage does not support.",
      ],
      [
        "Pansinin ang pandamang paglalarawan: nanginginig, basang damit, o katahimikan.",
        "Suriin ang emosyonal na pahiwatig: ang mga salita at reaksyon ay nagpapakita ng kalagayan.",
        "Piliin ang pinakapayak at matibay na konklusyon batay sa mga katotohanan.",
        "Huwag mag-imbento ng mga sitwasyong hindi binanggit sa sipi.",
      ],
    ],
    steps: [
      [
        "1. Identify the Gap: note what the author left unsaid.",
        "2. Collect Concrete Clues: underline physical symptoms, dialogue, and environment.",
        "3. Formulate the Connection: ask 'What condition must exist to cause all these clues?'",
        "4. Test Textual Support: verify that no clue contradicts your inference.",
      ],
      [
        "1. Hanapin ang Puwang: pansinin kung ano ang hindi direktang sinabi ng may-akda.",
        "2. Tipunin ang Pahiwatig: salungguhitan ang pisikal na kalagayan, kilos, at paligid.",
        "3. Buoin ang Ugnayan: itanong 'Anong kalagayan ang nagdulot sa lahat ng pahiwatig na ito?'",
        "4. Patunayan sa Teksto: tiyaking walang pahiwatig na sumasalungat sa iyong nabuong pasya.",
      ],
    ],
    example: {
      passage: [
        "Rain soaked the families’ clothes. The temperature is dropping, and children are shivering. Meals and clean water are ready.",
        "Nabasa ng ulan ang damit ng mga pamilya. Lumalamig at nanginginig ang mga bata. May pagkain at malinis na tubig na.",
      ],
      breakdown: [
        [
          "• Clue 1: Wet clothes + dropping temperature + shivering = danger of hypothermia.",
          "• Clue 2: Food and water are already prepared and ready.",
          "• Inferred Need: Warm blankets, dry clothes, and heating, even though 'blankets' is not in the text.",
        ],
        [
          "• Pahiwatig 1: Basang damit + bumababang temperatura + panginginig = panganib ng labis na lamig.",
          "• Pahiwatig 2: Handa na ang pagkain at malinis na tubig.",
          "• Nahinuha: Tuyong damit at makakapal na kumot ang kailangan kahit hindi nabanggit ang salitang 'kumot'.",
        ],
      ],
    },
    traps: [
      [
        "Over-interpretation: building an elaborate backstory not grounded in the passage.",
        "Ignoring stated facts: making an inference when a direct fact already provides the answer.",
      ],
      [
        "Labis na Pagpapalawak: pagbuo ng kuwentong malayo sa simpleng pahiwatig ng teksto.",
        "Pagbalewala sa Tahasang Sabi: paghinuha kahit mayroon nang direktang sagot sa sipi.",
      ],
    ],
    resources: [
      {
        title: "DepEd Commons · Inferential Reasoning & Drawing Conclusions Guide",
        desc: "Senior High School reading and writing skills module on deductive textual analysis.",
        tag: "DepEd Commons",
      },
      {
        title: "Phil-IRI · Interpretative Comprehension Question Framework",
        desc: "Guide on classifying and answering interpretive questions for secondary students.",
        tag: "Phil-IRI",
      },
      {
        title: "OECD PISA · Reading Literacy Framework: Reflect & Evaluate",
        desc: "International benchmark standards on extracting implicit meaning from complex texts.",
        tag: "PISA Guide",
      },
    ],
  },
  {
    competency: [
      "DepEd SHS Core: EN11/12RWS-IVac-8 · Comparing, prioritizing and evaluating claims",
      "DepEd SHS Filipino: F11PS-IIIb-91 · Pagpapahayag ng paghatol at pagtataya batay sa pamantayan",
    ],
    time: ["5 mins study", "5 minutong pag-aaral"],
    conceptBullets: [
      [
        "Prioritization requires systematic ranking based on objective criteria: time limit, severity, and resources.",
        "Comparison requires identifying key differences across situations, not just superficial similarities.",
        "Decisions must be justified using quantifiable evidence rather than emotional preference.",
      ],
      [
        "Ang pag-una ay nangangailangan ng pamantayan: palugit ng oras, bigat ng pangangailangan, at suplay.",
        "Ang paghahambing ay sumusuri sa mahahalagang pagkakaiba ng mga sitwasyon.",
        "Dapat batay sa ebidensya at bilang ang pasya, hindi sa emosyon o paboritismo.",
      ],
    ],
    tips: [
      [
        "Standardize timeframes: convert days, hours, and schedules to a single comparable scale.",
        "Identify the window of failure: the option whose deadline expires first takes priority.",
        "Order of arrival or mention in the paragraph does not dictate emergency priority.",
        "Distinguish between critical survival supplies and comfort supplies.",
      ],
      [
        "Pag-isahin ang sukatan ng oras: gawing oras o araw ang lahat upang madaling maipagkumpara.",
        "Tukuyin ang pinakamaikling palugit: ang sitwasyong unang mauubusan ang dapat maunang tulungan.",
        "Ang unang nabanggit sa talata ay hindi awtomatikong siyang dapat mauna sa aksyon.",
        "Ihiwalay ang pangkagipitang pangangailangan sa mga bagay na maaari pang maghintay.",
      ],
    ],
    steps: [
      [
        "1. Extract Demands: list each entity, requested resource, and current supply level.",
        "2. Calculate Deadline: compute exactly when each location will reach zero resources.",
        "3. Compare Vulnerabilities: evaluate consequence of delay for each case.",
        "4. Formulate Recommendation: state priority order supported by the time metrics.",
      ],
      [
        "1. Itala ang Kahilingan: isulat ang bawat humihiling, ang kailangan, at kasalukuyang natitira.",
        "2. Tuusin ang Oras: alamin kung kailan eksaktong mauubusan ang bawat isa.",
        "3. Ihambing ang Panganib: timbangin ang epekto ng pagkaantala sa bawat lugar.",
        "4. Buoin ang Pasya: ipahayag ang dapat unahin kalakip ang patunay mula sa teksto.",
      ],
    ],
    example: {
      passage: [
        "The gym has water until tomorrow. The health center’s water runs out in one hour. Both request the same delivery.",
        "May tubig sa gym hanggang bukas. Mauubos ang tubig sa sentro ng kalusugan sa loob ng isang oras. Pareho silang humihiling ng parehong suplay.",
      ],
      breakdown: [
        [
          "• Location A (Gym): 24-hour supply buffer.",
          "• Location B (Health Center): 1-hour critical threshold.",
          "• Decision: Health center takes priority because its supply window closes first.",
        ],
        [
          "• Lugar A (Gym): May 24 oras pang palugit ng tubig.",
          "• Lugar B (Health Center): 1 oras na lamang ang natitira bago maubusan.",
          "• Pasya: Dapat unahin ang health center dahil mas maikli at mapanganib ang oras nito.",
        ],
      ],
    },
    traps: [
      [
        "First-Come Bias: giving priority to whoever requested first rather than who is in greatest peril.",
        "Size Assumption: assuming a larger building automatically has a shorter survival margin.",
      ],
      [
        "Bitag ng Naunang Humiling: pagbibigay-priyoridad sa naunang nagsumite sa halip na sa mas gipit.",
        "Laki ng Lugar: pag-aakalang ang mas malaking gusali ay laging mas nangangailangan.",
      ],
    ],
    resources: [
      {
        title: "DepEd DRRMS · Emergency Resource Allocation & Assessment Guidelines",
        desc: "Disaster Risk Reduction and Management school protocols for prioritizing critical aid.",
        tag: "DepEd DRRMS",
      },
      {
        title: "DepEd Reading & Writing Skills · Evaluative Critical Thinking Framework",
        desc: "Curriculum materials for Senior High School analytical decision-making.",
        tag: "Curriculum Guide",
      },
    ],
  },
  {
    competency: [
      "DepEd SHS Core: EN11/12RWS-IIIa-2 · Coherence and pronoun-antecedent agreement",
      "DepEd SHS Filipino: F11PB-Id-100 · Paggamit ng Kohesyong Gramatikal (Anapora at Katapora)",
    ],
    time: ["4 mins study", "4 minutong pag-aaral"],
    conceptBullets: [
      [
        "Pronouns (he, she, it, they / siya, ito, sila) replace nouns to maintain cohesion.",
        "Anaphora refers backward to a noun mentioned earlier in the passage.",
        "Cataphora introduces a pronoun first, revealing the noun later for emphasis.",
      ],
      [
        "Ang mga panghalip (siya, ito, sila, kaniya) ay pumapalit sa pangngalan upang maging maayos ang daloy.",
        "Anapora ang tawag kapag ang panghalip ay tumutukoy sa pangngalang naunang binanggit.",
        "Katapora ang tawag kapag nauna ang panghalip bago binanggit ang mismong pangngalan.",
      ],
    ],
    tips: [
      [
        "The Replacement Test: replace the pronoun with your candidate noun to see if sense holds.",
        "Verify agreement: singular pronouns replace singular nouns; plural matches plural.",
        "Trace to the nearest logical subject: writers rarely skip multiple sentences without restating names.",
        "Check semantic logic: ensure the candidate noun can realistically perform the verb.",
      ],
      [
        "Subukin ang Pagpapalit: ipalit ang napiling pangngalan sa panghalip upang suriin ang diwa.",
        "Tiyakin ang kaisahan: ang isahang panghalip ay para sa isahang pangngalan; maramihan sa maramihan.",
        "Sundan ang pinakamalapit na simuno sa naunang sugnay.",
        "Suriin ang lohika: tiyaking kayang gawin ng napiling pangngalan ang kilos ng pandiwa.",
      ],
    ],
    steps: [
      [
        "1. Highlight the Pronoun: locate words like 'it', 'he', 'they', or 'this'.",
        "2. Scan Preceding Clause: identify all nouns that appeared before the pronoun.",
        "3. Filter by Number and Gender: eliminate nouns that do not match the pronoun's properties.",
        "4. Substitute and Read: verify that the sentence is clear and grammatically sound.",
      ],
      [
        "1. Tukuyin ang Panghalip: bilugan ang mga salitang gaya ng 'siya', 'ito', 'sila', o 'nito'.",
        "2. Tingnan ang Naunang Sugnay: itala ang mga pangngalang lumitaw bago ang panghalip.",
        "3. Salain ayon sa Kailanan: alisin ang mga pangngalang hindi tumutugma sa bilang at kasarian.",
        "4. Ipalit at Basahin: tiyaking natural at malinaw ang buong pangungusap.",
      ],
    ],
    example: {
      passage: [
        "Lara handed Niko a folder. He placed it on the desk.",
        "Iniabot ni Lara kay Niko ang folder. Inilagay niya ito sa mesa.",
      ],
      breakdown: [
        [
          "• 'He' refers to Niko (the person receiving and acting).",
          "• 'It' refers to the folder (the object handed and placed).",
          "• 'The desk' is the surface location, not the object placed.",
        ],
        [
          "• 'Niya' ay tumutukoy kay Niko (ang tumanggap at naglagay).",
          "• 'Ito' ay tumutukoy sa folder (ang bagay na iniabot at inilapag).",
          "• Ang 'mesa' ang pinagpatungan, hindi ang bagay na inilapag.",
        ],
      ],
    },
    traps: [
      [
        "Ambiguous Reference: choosing a nearby noun that does not make real-world sense with the verb.",
        "Object/Subject Confusion: confusing the recipient of an action with the object being handled.",
      ],
      [
        "Mapanlinlang na Kalapitan: pagpili sa pinakamalapit na salita kahit hindi ito angkop sa kilos.",
        "Pagkalito sa Layon at Simuno: pagpapalit sa taong tumanggap sa bagay na ginamit.",
      ],
    ],
    resources: [
      {
        title: "DepEd Filipino PPTTP · Aralin sa Kohesyong Gramatikal",
        desc: "Komprehensibong aralin sa pagtukoy ng anapora, katapora, at elipsis sa mga tekstong akademiko.",
        tag: "DepEd Filipino",
      },
      {
        title: "Purdue OWL · Pronoun Reference and Antecedent Clarity",
        desc: "Standards for maintaining grammatical reference clarity across complex sentences.",
        tag: "Writing Lab",
      },
    ],
  },
  {
    competency: [
      "DepEd SHS Core: EN11/12RWS-IVac-9 · Analyzing character motivation in narrative texts",
      "DepEd SHS Filipino: F11PB-IIIa-98 · Pagsusuri sa motibasyon at pagkilos ng mga tauhan",
    ],
    time: ["5 mins study", "5 minutong pag-aaral"],
    conceptBullets: [
      [
        "A motive explains why a character acts: the internal goal, belief, or necessity driving them.",
        "Motives are frequently unstated and must be deduced from reactions to obstacles.",
        "Actions reflect a character's true values when facing conflict or sacrifice.",
      ],
      [
        "Ipinapaliwanag ng motibo kung bakit kumikilos ang tauhan: ang mithiin, takot, o tungkuling nagtutulak sa kaniya.",
        "Kadalasan ay hindi tahasang sinasabi ang motibo at nahihinuha lamang sa reaksyon sa balakid.",
        "Ipinakikita ng kilos ang tunay na pinahahalagahan ng tauhan sa harap ng sakripisyo.",
      ],
    ],
    tips: [
      [
        "Apply the motive formula: Action + Obstacle = Underlying Motivation.",
        "Look at what the character sacrifices: giving up time or pride reveals their true goal.",
        "Distinguish spoken excuses from genuine underlying motives.",
        "Stick strictly to motives supported by the circumstances described in the text.",
      ],
      [
        "Gamitin ang pormula ng motibo: Kilos + Balakid = Malalim na Dahilan.",
        "Tingnan ang isinakripisyo: ang pagpaparaya sa oras o sariling kapakanan ay nagpapakita ng tunay na layunin.",
        "Ihiwalay ang paimbabaw na sinasabi sa tunay na motibong pinatutunayan ng gawa.",
        "Huwag lumihis sa mga pangyayaring malinaw na inilatag sa sipi.",
      ],
    ],
    steps: [
      [
        "1. Identify the Decisive Action: what unusual or deliberate choice did the character make?",
        "2. Inspect the Triggering Event: what crisis or delay forced this decision?",
        "3. Evaluate Beneficiary: who benefited from the action, and what was prevented?",
        "4. Name the Value: identify the driving virtue (e.g., responsibility, empathy, duty).",
      ],
      [
        "1. Tukuyin ang Ginawa: anong mahalagang pasya o aksyon ang ginawa ng tauhan?",
        "2. Alamin ang Pinagmulan: anong suliranin o antala ang nagbunsod sa pasyang ito?",
        "3. Suriin ang Nakinabang: sino ang natulungan at anong abala ang naiwasan?",
        "4. Pangalanan ang Motibo: tukuyin ang adhikaing nagtulak (hal. pananagutan, malasakit).",
      ],
    ],
    example: {
      passage: [
        "The bus was delayed. Maya asked her group to start the meeting without her.",
        "Naantala ang bus. Hiniling ni Maya na simulan ng grupo ang pulong kahit wala pa siya.",
      ],
      breakdown: [
        [
          "• Conflict: Maya is stuck in traffic and cannot arrive on time.",
          "• Action: Instructs peers to proceed without waiting for her.",
          "• Motive: Values the group's productivity and respects their schedule over her presence.",
        ],
        [
          "• Suliranin: Naantala ang biyahe ni Maya at mahuhuli siya sa usapan.",
          "• Kilos: Nagbilin na magsimula na ang grupo nang hindi siya hinihintay.",
          "• Motibo: Pagpapahalaga sa oras ng kapwa at pag-iwas sa pagkakaantala ng buong grupo.",
        ],
      ],
    },
    traps: [
      [
        "Negative Projection: assuming malice or disinterest when practical necessity is the cause.",
        "Ignoring Obstacles: analyzing actions in isolation without considering the crisis at hand.",
      ],
      [
        "Maling Pagpapalagay: pag-aakalang ayaw o nagtatampo ang tauhan gayong may praktikal na balakid.",
        "Pahiwalay na Pagsusuri: paghusga sa kilos nang hindi isinasaalang-alang ang gipit na kalagayan.",
      ],
    ],
    resources: [
      {
        title: "DepEd Creative Nonfiction & Narrative Guide · Character Motivation",
        desc: "Senior High School literature framework on internal conflict and behavioral motives.",
        tag: "DepEd SHS Lit",
      },
      {
        title: "National Reading Program · Narrative Perspective-Taking",
        desc: "Instructional techniques for analyzing character intent and narrative empathy.",
        tag: "DepEd NRP",
      },
    ],
  },
  {
    competency: [
      "DepEd SHS Core: EN11/12RWS-IIIa-1 · Context clues (definition and appositives)",
      "DepEd SHS Filipino: F11PT-IIIa-88 · Pagbibigay-kahulugan gamit ang pahiwatig na depinisyon",
    ],
    time: ["4 mins study", "4 minutong pag-aaral"],
    conceptBullets: [
      [
        "Writers frequently define difficult words directly inside the sentence using punctuation and signal words.",
        "Appositives are explanatory noun phrases set off by commas, dashes, or parentheses.",
        "Punctuation marks (commas, parentheses, dashes) are explicit signposts provided for readers.",
      ],
      [
        "Kadalasan ay mismong may-akda ang nagbibigay ng kahulugan sa pangungusap gamit ang bantas at salita.",
        "Ang aposisyon ay pariralang nagpapaliwanag na napapaloob sa mga kuwit, gitling, o panaklong.",
        "Ang mga bantas ay malinaw na palatandaang inilalagay upang gabayan ang mambabasa.",
      ],
    ],
    tips: [
      [
        "Watch for signal words: 'means', 'is defined as', 'or', 'in other words'.",
        "Look for explanatory punctuation brackets: commas (,), dashes (—), or parentheses ().",
        "The Cover-and-Read Drill: cover the unfamiliar word and read the definition in its place.",
        "Check whether the explanation gives a complete synonym or an expanded description.",
      ],
      [
        "Bantayan ang mga hudyat: 'ibig sabihin', 'o kaya', 'sa madaling salita', 'tinatawag na'.",
        "Tingnan ang mga bantas: kuwit (,), gitling (—), o panaklong () na naglalaman ng paliwanag.",
        "Takpan at Basahin: takpan ang di-kilalang salita at ipalit ang paliwanag upang masubok ang diwa.",
        "Alamin kung ang paliwanag ay kasingkahulugan o malawak na paglalarawan.",
      ],
    ],
    steps: [
      [
        "1. Identify the Target Term: pinpoint the challenging vocabulary word.",
        "2. Look for Defining Connectors: scan immediately before or after for 'meaning' or 'that is'.",
        "3. Check for Flanking Punctuation: look for comma pairs setting off an explanation.",
        "4. Substitute: replace the term with the extracted clause to verify clarity.",
      ],
      [
        "1. Hanapin ang Di-Kilalang Salita: tukuyin ang salitang nagdudulot ng kalituhan.",
        "2. Hanapin ang Hudyat ng Depinisyon: suriin kung may 'ibig sabihin' o 'tinutukoy nito'.",
        "3. Suriin ang Bantas: tingnan kung may dalawang kuwit o panaklong na nagpapaliwanag.",
        "4. Ipalit at Subukan: basahing muli ang pangungusap gamit ang nahanap na kahulugan.",
      ],
    ],
    example: {
      passage: [
        "The route was inaccessible, meaning people could not enter it.",
        "Hindi madaanan ang ruta, ibig sabihin ay hindi makapasok dito ang mga tao.",
      ],
      breakdown: [
        [
          "• Target Word: 'inaccessible' / 'hindi madaanan'.",
          "• Signal Phrase: 'meaning' / 'ibig sabihin'.",
          "• Embedded Definition: 'people could not enter it'.",
        ],
        [
          "• Salita: 'inaccessible' / 'hindi madaanan'.",
          "• Hudyat: 'ibig sabihin'.",
          "• Direktang Kahulugan: 'hindi makapasok dito ang mga tao'.",
        ],
      ],
    },
    traps: [
      [
        "Overlooking Punctuation: missing an appositive because of ignoring comma boundaries.",
        "Confusing Examples with Definitions: an example illustrates; an appositive defines.",
      ],
      [
        "Pagbalewala sa Bantas: hindi pagpansin sa kuwit na naghihiwalay sa paliwanag.",
        "Pagkakamali sa Halimbawa: ang halimbawa ay nagpapakita lamang; ang depinisyon ay nagpapaliwanag ng buo.",
      ],
    ],
    resources: [
      {
        title: "DepEd IDEAS Context Clues Toolkit",
        desc: "Official framework on Inference, Definition, Example, Antonym, and Synonym deciphering.",
        tag: "DepEd Reading",
      },
      {
        title: "DepEd LRMS · Academic Vocabulary Acquisition in SHS",
        desc: "Instructional guide for decoding tier-two academic vocabulary across disciplines.",
        tag: "LRMS Module",
      },
    ],
  },
  {
    competency: [
      "DepEd SHS Core: EN11/12RWS-IIIa-1 · Context clues (contrast and exemplification)",
      "DepEd SHS Filipino: F11PT-IIIa-88 · Pahiwatig gamit ang kasalungat at halimbawa",
    ],
    time: ["4 mins study", "4 minutong pag-aaral"],
    conceptBullets: [
      [
        "Contrast clues reveal word meaning by showing the exact opposite condition.",
        "Exemplification clues list familiar examples that belong to the unfamiliar category.",
        "Contrast transitions indicate a 180-degree shift in tone, condition, or meaning.",
      ],
      [
        "Ipinakikita ng pahiwatig na kasalungat ang kahulugan sa pamamagitan ng kabaligtarang kalagayan.",
        "Ang pahiwatig na halimbawa ay naglilista ng mga pamilyar na bagay na saklaw ng di-kilalang salita.",
        "Ang mga hudyat ng salungatan ay nagpapakita ng biglaang pag-iiba ng tono o kahulugan.",
      ],
    ],
    tips: [
      [
        "Contrast markers: 'unlike', 'but', 'however', 'in contrast', 'on the other hand'.",
        "Example markers: 'such as', 'for instance', 'including', 'like'.",
        "Polarity Inversion: if the anchor word is 'chaotic', the contrasting word must mean 'peaceful'.",
        "Categorization: when tools like hammer and saw are listed, the term means 'hand tools'.",
      ],
      [
        "Hudyat ng kasalungat: 'di-tulad', 'ngunit', 'subalit', 'gayunman', 'sa kabilang banda'.",
        "Hudyat ng halimbawa: 'gaya ng', 'tulad ng', 'kabilang ang', 'halimbawa'.",
        "Kabaligtarang Tono: kung 'maingay' ang kilalang salita, ang kasalungat nito ay 'tahimik'.",
        "Pag-uuri: kung martilyo at lagari ang binanggit, ang salita ay tumutukoy sa 'kasangkapang pangkamay'.",
      ],
    ],
    steps: [
      [
        "1. Identify the Transition Signal: spot 'unlike' or 'such as'.",
        "2. Locate the Anchor Idea: read the known word being contrasted or illustrated.",
        "3. Invert or Generalize: flip the anchor for contrast, or group the items for examples.",
        "4. Confirm in Context: check whether the deduced meaning fits the sentence logically.",
      ],
      [
        "1. Hanapin ang Hudyat: pansinin ang 'di-tulad' o 'halimbawa'.",
        "2. Tukuyin ang Kilalang Salita: unawain ang pamilyar na salitang inihambing.",
        "3. Baligtarin o Ipunin: baligtarin ang diwa kung kasalungat, o alamin ang kategorya kung halimbawa.",
        "4. Tiyakin sa Pangungusap: subukan kung angkop ang nabuong kahulugan.",
      ],
    ],
    example: {
      passage: [
        "Unlike the noisy hallway, the room was tranquil.",
        "Di-tulad ng maingay na pasilyo, payapa ang silid.",
      ],
      breakdown: [
        [
          "• Contrast Marker: 'Unlike' signals an opposite relationship.",
          "• Anchor Concept: 'noisy hallway' represents loud, chaotic sound.",
          "• Deduced Meaning: 'tranquil' must mean calm, quiet, and peaceful.",
        ],
        [
          "• Hudyat: 'Di-tulad' ay naghuhudyat ng kabaligtaran.",
          "• Kilalang Salita: 'maingay na pasilyo'.",
          "• Kahulugan: Ang 'payapa' ay kabaligtaran ng maingay: kalmado, tahimik, at panatag.",
        ],
      ],
    },
    traps: [
      [
        "Confusing Similarity with Contrast: mistaking 'similarly' for a contrast clue.",
        "Example Limitation: assuming the word means *only* that one example rather than the broader category.",
      ],
      [
        "Pagkalito sa Pagkakatulad: pag-aakalang magkapareho ang diwa gayong may hudyat ng kasalungat.",
        "Makitid na Pagpapakahulugan: pag-aakalang ang salita ay katumbas lamang ng iisang halimbawa.",
      ],
    ],
    resources: [
      {
        title: "DepEd SHS English · Semantic Clue Categorization Reference",
        desc: "Framework on antonymic reasoning and exemplification patterns in expository essays.",
        tag: "DepEd Module",
      },
      {
        title: "Phil-IRI Vocabulary Assessment Matrix",
        desc: "Diagnostic rubrics for measuring student contextual deduction skills.",
        tag: "Phil-IRI",
      },
    ],
  },
  {
    competency: [
      "DepEd SHS Core: EN11/12RWS-IIIa-1 · Chronological patterns of organization",
      "DepEd SHS Filipino: F11PB-Id-100 · Pagsusuri sa pagkakasunod-sunod at kronolohiya",
    ],
    time: ["5 mins study", "5 minutong pag-aaral"],
    conceptBullets: [
      [
        "Narrative order is not always chronological: the order in which sentences appear is not always how events happened in time.",
        "Transitions and verb tenses are the GPS markers that re-establish authentic timelines.",
        "Flashbacks, explanations, and anticipations require reconstructive reading.",
      ],
      [
        "Ang ayos ng pagsulat ay hindi laging ayos ng totoong pangyayari sa oras.",
        "Ang mga hudyat ng oras at pandiwa ang gabay upang muling mabuo ang wastong timeline.",
        "Ang mga pagbabalik-tanaw at paliwanag ay nangangailangan ng mapanuring pagsasaayos.",
      ],
    ],
    tips: [
      [
        "Watch subordinate clauses: 'Before doing A, do B' means B happens first!",
        "Timeline mapping: mentally assign chronological timestamps (1st, 2nd, 3rd) rather than reading order.",
        "Identify transition markers: 'prior to', 'subsequently', 'meanwhile', 'finally', 'initially'.",
        "Inspect past perfect tense ('had done') which signals an event completed before another past event.",
      ],
      [
        "Bantayan ang sugnay: 'Bago gawin ang A, gawin ang B' — nangangahulugang B ang unang gagawin!",
        "Gumawa ng mental timeline: bilangin ang pagkakasunod (1, 2, 3) ayon sa oras ng kaganapan.",
        "Pansinin ang mga hudyat: 'bago', 'matapos', 'kasabay nito', 'sa wakas', 'sa simula'.",
        "Tingnan ang aspekto ng pandiwa na nagpapakita kung ano ang naunang natapos.",
      ],
    ],
    steps: [
      [
        "1. Strip Extraneous Fluff: isolate the bare actions mentioned in the text.",
        "2. Circle Time Conjunctions: mark 'before', 'after', 'prior to', and 'following'.",
        "3. Sequence Chronologically: arrange the actions in true chronological order.",
        "4. Double Check Causal Links: verify that no prerequisite action is placed after its consequence.",
      ],
      [
        "1. Alisin ang Palamuti: itala ang mismong mga kilos na naganap sa talata.",
        "2. Bilugan ang Hudyat ng Oras: markahan ang 'bago', 'matapos', 'habang', at 'nang'.",
        "3. Ayusin sa Tunay na Oras: pagsunud-sunurin ayon sa kung ano ang unang nangyari sa totoong buhay.",
        "4. Tiyakin ang Lohika: siguraduhing ang kailangang maunang gawain ay hindi nalagay sa huli.",
      ],
    ],
    example: {
      passage: [
        "Before planting, Sam loosened the soil. He watered the seeds after planting.",
        "Bago magtanim, binungkal ni Sam ang lupa. Diniligan niya ang buto matapos magtanim.",
      ],
      breakdown: [
        [
          "• Step 1: Loosening the soil ('before planting' marks it as the opening act).",
          "• Step 2: Planting the seeds (the middle anchor).",
          "• Step 3: Watering the seeds ('after planting' marks it as the final step).",
        ],
        [
          "• Hakbang 1: Pagbungkal ng lupa (ang 'bago magtanim' ay nagpapatunay na ito ang una).",
          "• Hakbang 2: Pagtanim ng buto (ang gitnang gawain).",
          "• Hakbang 3: Pagdilig ng buto (ang 'matapos magtanim' ay nagpapakita na ito ang huli).",
        ],
      ],
    },
    traps: [
      [
        "Reading Order Fallacy: assuming the first mentioned sentence happened first.",
        "Ignoring Conjunction Constraints: overlooking 'before' and reading as simple left-to-right progression.",
      ],
      [
        "Bitag ng Pagkakasulat: pag-aakalang kung ano ang unang nabasa ay siyang unang naganap.",
        "Paglampas sa 'Bago': hindi pagpansin sa salitang 'bago' na nagpapalit sa ayos ng kilos.",
      ],
    ],
    resources: [
      {
        title: "DepEd MELCs · Text Organization & Chronological Flow",
        desc: "Standards for identifying sequential structures in academic, technical, and narrative texts.",
        tag: "DepEd Curriculum",
      },
      {
        title: "National Reading Program · Graphic Organizers for Chronology",
        desc: "Flowcharts and linear sequence organizers to help readers reconstruct event timelines.",
        tag: "NRP Resource",
      },
    ],
  },
  {
    competency: [
      "DepEd SHS Core: EN11/12RWS-IIIa-1 · Patterns of development: Cause and Effect",
      "DepEd SHS Filipino: F11PB-Id-100 · Pagsusuri sa ugnayang sanhi at bunga",
    ],
    time: ["5 mins study", "5 minutong pag-aaral"],
    conceptBullets: [
      [
        "Cause (Sanhi) is the catalyst or reason why an event happened (answers 'Why?').",
        "Effect (Bunga) is the outcome, consequence, or aftermath (answers 'What occurred?').",
        "Correlation is not causation: two events occurring simultaneously are not necessarily cause and effect.",
      ],
      [
        "Ang Sanhi ay ang dahilan kung bakit naganap ang pangyayari (sumasagot sa 'Bakit?').",
        "Ang Bunga ay ang kinalabasan, resulta, o epekto ng sanhi (sumasagot sa 'Ano ang nangyari?').",
        "Ang sabay na pangyayari ay hindi awtomatikong sanhi at bunga ng isa't isa.",
      ],
    ],
    tips: [
      [
        "The Why-What Test: ask 'Why did this happen?' to locate the cause; ask 'What was the result?' to find the effect.",
        "Causal markers: 'because', 'due to', 'as a result', 'consequently', 'led to', 'therefore'.",
        "Watch for causal chains: Cause 1 leads to Effect 1, which becomes Cause 2 for Effect 2.",
        "Verify necessity: if the alleged cause was absent, would the effect still have occurred?",
      ],
      [
        "Pagsusuring Bakit-Ano: itanong ang 'Bakit?' upang makita ang sanhi; itanong ang 'Ano ang bunga?' para sa resulta.",
        "Hudyat ng sanhi at bunga: 'dahil sa', 'bunga nito', 'kaya naman', 'sanhi ng', 'dulot ng'.",
        "Bantayan ang kadena ng pangyayari: ang unang bunga ay maaaring maging sanhi ng susunod na kaganapan.",
        "Subukin ang lohika: kung wala ba ang sanhi, mangyayari pa rin ba ang naging bunga?",
      ],
    ],
    steps: [
      [
        "1. Identify the Explicit Connectors: circle words like 'because', 'prompted', or 'therefore'.",
        "2. Isolate the Two Halves: separate the event into Action A and Consequence B.",
        "3. Invert the Logic: check if Action A was the direct reason why Consequence B materialized.",
        "4. Label Distinctly: prevent confusing the symptom with the root trigger.",
      ],
      [
        "1. Hanapin ang Hudyat: bilugan ang 'dahil', 'kaya', 'bunga nito', o 'sanhi'.",
        "2. Paghiwalayin ang Sugnay: hatiin sa Dahilan A at Resulta B.",
        "3. Suriin ang Ugnayan: tiyaking ang Dahilan A ang direktang nagluwal sa Resulta B.",
        "4. Malinaw na Pag-uri: huwag ipagpalit ang bunga sa mismong pinagmulang sanhi.",
      ],
    ],
    example: {
      passage: [
        "Because the printer ran out of ink, the class submitted handwritten copies.",
        "Dahil naubusan ng tinta ang printer, sulat-kamay ang isinumite ng klase.",
      ],
      breakdown: [
        [
          "• Trigger/Cause: The printer ran out of ink ('Because the printer ran out...').",
          "• Outcome/Effect: Students submitted handwritten copies as a direct result.",
        ],
        [
          "• Sanhi: Naubusan ng tinta ang printer (ang nagbunsod na dahilan).",
          "• Bunga: Nagsusumite ng sulat-kamay ang buong klase (ang naging resulta).",
        ],
      ],
    },
    traps: [
      [
        "Post Hoc Fallacy: assuming that because event A happened before event B, event A must have caused event B.",
        "Confounding Factors: mistaking a contributing factor for the sole underlying cause.",
      ],
      [
        "Maling Pag-uugnay: pag-aakalang ang naunang kaganapan ang siyang sanhi kahit nagkataon lamang.",
        "Iisang Dahilan: pag-aakalang iisa lamang ang sanhi gayong may iba pang salik na kasangkot.",
      ],
    ],
    resources: [
      {
        title: "DepEd Reading & Writing Skills · Cause and Effect Analysis Patterns",
        desc: "Senior High School expository writing and analytical reading module.",
        tag: "DepEd Curriculum",
      },
      {
        title: "Ishikawa Cause-and-Effect Diagramming Protocol",
        desc: "Graphic organizers for multi-causal analysis in scientific and argumentative texts.",
        tag: "Analysis Tool",
      },
    ],
  },
  {
    competency: [
      "DepEd SHS Core: EN11/12RWS-IIIa-2 · Identifying the main idea and thesis statement",
      "DepEd SHS Filipino: F11PB-Ia-97 · Pagtukoy sa pangunahing kaisipan at paksang diwa",
    ],
    time: ["5 mins study", "5 minutong pag-aaral"],
    conceptBullets: [
      [
        "The main idea summarizes what the entire paragraph asserts about its topic.",
        "Topic is the subject (what it is about); Main Idea is the author's specific claim about that topic.",
        "An accurate main idea must be broad enough to cover all details, but narrow enough to exclude unmentioned concepts.",
      ],
      [
        "Binubuod ng pangunahing ideya ang kabuuang sinasabi ng talata tungkol sa paksa.",
        "Ang Paksa ay ang pinag-uusapan; ang Pangunahing Ideya ay ang tiyak na pananaw o mensahe tungkol sa paksa.",
        "Dapat saklaw ng pangunahing ideya ang lahat ng detalye, ngunit hindi lumalagpas sa nilalaman ng teksto.",
      ],
    ],
    tips: [
      [
        "Examine the First and Last Sentences: authors commonly state the main thesis in the opening or conclusion.",
        "The Umbrella Test: every supporting sentence must comfortably fit under the main idea.",
        "Avoid picking a single interesting fact: a detail about one recycling bin does not summarize the entire project.",
        "Express as a complete thought: a topic is a noun phrase; a main idea is a complete declarative sentence.",
      ],
      [
        "Suriin ang Una at Huling Pangungusap: karaniwang inilalagay ang paksang pangungusap sa simula o dulo.",
        "Pagsubok ng Payong: bawat sumusuportang pangungusap ay dapat sumisilong sa ilalim ng pangunahing ideya.",
        "Huwag pumili ng iisang detalye lamang: ang kuwento tungkol sa isang basurahan ay hindi buod ng buong proyekto.",
        "Buong Pangungusap: ang paksa ay parirala lamang; ang pangunahing ideya ay buong pangungusap na may simuno at panaguri.",
      ],
    ],
    steps: [
      [
        "1. Identify the Topic: in 1–3 words, what subject is discussed repeatedly?",
        "2. Identify the Author's Core Claim: what is the author asserting or proving about this topic?",
        "3. Test Against Details: do the individual sentences provide evidence for this central claim?",
        "4. Formulate the GIST: summarize the unifying thought in one concise sentence.",
      ],
      [
        "1. Tukuyin ang Paksa: sa 1–3 salita, ano ang pangkalahatang pinag-uusapan?",
        "2. Alamin ang Pahayag ng May-Akda: ano ang nais patunayan o sabihin tungkol sa paksa?",
        "3. Sukatin sa mga Detalye: pinatutunayan ba ng bawat pangungusap ang kaisipang ito?",
        "4. Buoin ang Buod: ipahayag ang pinakapuso ng talata sa isang malinaw na pangungusap.",
      ],
    ],
    example: {
      passage: [
        "Students labeled bins, explained recycling, and collected reusable paper. These actions reduced waste.",
        "Nilagyan ng label ang basurahan, ipinaliwanag ang recycling, at nangolekta ng papel. Nabawasan ang basura.",
      ],
      breakdown: [
        [
          "• Actions: Labeled bins + educated peers + collected paper.",
          "• Result: School waste was successfully reduced.",
          "• Main Idea: Student-led collective recycling initiatives effectively diminished school waste.",
        ],
        [
          "• Mga Kilos: Paglagay ng label + pagpapaliwanag + pangongolekta ng papel.",
          "• Resulta: Nabawasan ang basura sa paaralan.",
          "• Pangunahing Ideya: Ang pagtutulungan ng mga mag-aaral sa pag-recycle ay nagbunga ng pagbawas ng basura.",
        ],
      ],
    },
    traps: [
      [
        "Too Narrow: choosing an individual supporting detail as the main headline.",
        "Too Broad: choosing an overly generic topic like 'Global Waste' that encompasses ideas not in the text.",
      ],
      [
        "Masyadong Makitid: pagpili sa iisang sumusuportang halimbawa bilang pangkalahatang pamagat.",
        "Masyadong Malawak: pagpili sa malawak na paksang wala namang kinalaman sa tiyak na sipi.",
      ],
    ],
    resources: [
      {
        title: "DepEd SHS Core · Academic Reading & Summarizing Strategies",
        desc: "Guidelines for extracting thesis statements and topic sentences from academic texts.",
        tag: "DepEd Module",
      },
      {
        title: "GIST (Generating Interactions between Schemata and Text) Protocol",
        desc: "Structured reading technique for formulating 20-word maximum main idea summaries.",
        tag: "Summarization Tool",
      },
    ],
  },
  {
    competency: [
      "DepEd SHS Core: EN11/12RWS-IVac-8 · Selecting relevant supporting evidence",
      "DepEd SHS Filipino: F11PB-Id-100 · Pagkilala sa mga sumusuportang detalye",
    ],
    time: ["4 mins study", "4 minutong pag-aaral"],
    conceptBullets: [
      [
        "Supporting details provide factual proof, data, illustrations, or explanations for the main idea.",
        "A detail can be completely true in real life, yet totally irrelevant to the author's specific claim.",
        "Major details directly substantiate the core claim; minor details provide supplementary description.",
      ],
      [
        "Ang mga sumusuportang detalye ay nagbibigay ng patunay, datos, at halimbawa sa pangunahing ideya.",
        "Maaaring totoo ang isang detalye sa totoong buhay, ngunit walang kaugnayan sa pinatutunayan ng may-akda.",
        "Ang pangunahing detalye ay direktang nagpapatunay; ang pansuportang detalye ay nagbibigay lamang ng kulay.",
      ],
    ],
    tips: [
      [
        "The Direct Relevance Test: ask 'Does this specific sentence actually prove or cause the stated claim?'",
        "Differentiate essential evidence from decorative facts (e.g., paint color, weather conditions).",
        "Match the detail to the exact adjective in the claim (e.g., 'easier to use' requires functional improvements).",
        "Discard unhelpful distractors regardless of how factual they sound.",
      ],
      [
        "Pagsusuri sa Kabuluhan: itanong 'Direkta bang pinatutunayan o idinudulot ng pangungusap na ito ang pahayag?'",
        "Ihiwalay ang palamuting impormasyon (kulay ng pader, panahon) sa patunay ng gamit.",
        "Itugma sa mismong katangian (hal. 'mas madaling gamitin' ay nangangailangan ng patunay sa organisasyon).",
        "Alisin ang mga salitang walang kaugnayan gaano man ito katotoo pakinggan.",
      ],
    ],
    steps: [
      [
        "1. Identify the Exact Claim: what thesis needs proof (e.g., 'The library was modernized')?",
        "2. Evaluate Candidate Sentences: does each sentence provide functional, documented proof?",
        "3. Discard Extraneous Noise: cross out details that do not impact the claim's validity.",
        "4. Validate Core Support: ensure the remaining evidence forms an airtight case.",
      ],
      [
        "1. Tukuyin ang Pahayag: anong partikular na kaisipan ang kailangang patunayan?",
        "2. Suriin ang Bawat Pangungusap: nagbibigay ba ito ng malinaw at lohikal na patunay?",
        "3. Tanggalin ang Walang Kinalaman: alisin ang mga detalyeng palamuti lamang.",
        "4. Pagtitibay ng Ebidensya: tiyaking ang natirang mga detalye ay sapat upang suportahan ang kaisipan.",
      ],
    ],
    example: {
      passage: [
        "The library became easier to use. Books were sorted by topic and signs marked sections. The door was blue.",
        "Naging mas madaling gamitin ang aklatan. Inayos ang mga aklat ayon sa paksa at may palatandaan sa seksyon. Asul ang pinto.",
      ],
      breakdown: [
        [
          "• Target Claim: 'The library became easier to use'.",
          "• Valid Supporting Evidence: Categorized book sorting + sectional signage directly improve ease of navigation.",
          "• Irrelevant Detail: 'The door was blue' is factually stated, but completely irrelevant to user navigation.",
        ],
        [
          "• Pinatutunayan: 'Naging mas madaling gamitin ang aklatan'.",
          "• Wastong Suporta: Pag-ayos ng aklat at mga palatandaan (direktang nagpadali sa paghahanap).",
          "• Walang Kaugnayan: 'Asul ang pinto' ay totoo ayon sa teksto, ngunit walang kinalaman sa kadalian ng paggamit.",
        ],
      ],
    },
    traps: [
      [
        "The Factual Fallacy: selecting a detail simply because it appears in the passage, without verifying its relevance.",
        "Surface Matching: matching repeated words rather than underlying logical support.",
      ],
      [
        "Bitag ng Katotohanan: pagpili sa detalye dahil lamang ito ay totoo, nang hindi sinusuri kung may kaugnayan.",
        "Paimbabaw na Pagkakatulad: pagpili batay sa magkaparehong salita sa halip na sa lohikal na suporta.",
      ],
    ],
    resources: [
      {
        title: "DepEd SHS Core · Formulating Evaluative Statements & Evidence",
        desc: "Framework on testing the relevance and sufficiency of textual evidence in argumentative texts.",
        tag: "DepEd RWS",
      },
      {
        title: "Toulmin Argument Evidence Evaluation Matrix",
        desc: "Criteria for connecting ground data to claims via legitimate warrants.",
        tag: "Critical Tool",
      },
    ],
  },
  {
    competency: [
      "DepEd SHS Core: EN11/12RWS-IVac-10 · Critical reading: Fact versus Opinion",
      "DepEd SHS Filipino: F11PB-Ia-97 · Paghihiwalay ng katotohanan sa opinyon at paghatol",
    ],
    time: ["5 mins study", "5 minutong pag-aaral"],
    conceptBullets: [
      [
        "Fact: an objective statement verifiable by empirical evidence, historical records, or direct observation.",
        "Opinion: a subjective judgment, value belief, or emotional evaluation that cannot be proven true or false.",
        "Even an inaccurate factual claim remains a claim of fact because it can be audited; opinions are inherently untestable.",
      ],
      [
        "Katotohanan: obhetibong pahayag na mapatutunayan gamit ang ebidensya, talaan, o direktang obserbasyon.",
        "Opinyon: pansariling paghatol, paniniwala, o damdamin na hindi maaaring patunayan bilang unibersal na totoo o mali.",
        "Kahit ang maling datos ay nananatiling pahayag ng katotohanan dahil masusuri ito; ang opinyon ay nakabatay sa panlasa.",
      ],
    ],
    tips: [
      [
        "The Verification Test: ask 'Can this be checked against archival logs, scientific instruments, or official registries?'",
        "Watch for subjective value modifiers: 'best', 'worst', 'most impressive', 'disappointing', 'should', 'must'.",
        "Identify hybrid sentences: writers often embed an opinion adjective inside a factual event.",
        "Check for author bias: observe whether counter-evidence was selectively suppressed.",
      ],
      [
        "Pagsusuri ng Katibayan: itanong 'Masusuri ba ito sa opisyal na talaan, siyentipikong datos, o aktwal na tala?'",
        "Bantayan ang mga salitang nagpapahayag ng paghatol: 'pinakamahusay', 'pinakamasama', 'kahanga-hanga', 'dapat'.",
        "Mag-ingat sa pinaghalong pahayag: kadalasang isinasama ang opinyong pang-uri sa loob ng totoong pangyayari.",
        "Suriin ang pagkiling ng may-akda: pansinin kung may paboritismo o sadyang itinagong kabilang panig.",
      ],
    ],
    steps: [
      [
        "1. Strip Value Adjectives: remove emotional words to examine the bare factual core.",
        "2. Identify the Authority Base: does the claim rely on institutional data or personal sentiment?",
        "3. Categorize Statement: classify as Claim of Fact, Claim of Value (opinion), or Claim of Policy.",
        "4. Evaluate Objectivity: determine whether the statement is universal or subjective.",
      ],
      [
        "1. Alisin ang Pang-uring Naghuhusga: tanggalin ang emosyonal na salita upang makita ang pinakapahayag.",
        "2. Tukuyin ang Pinagmulan: nakabatay ba sa opisyal na datos o sa pansariling damdamin ng nagsalita?",
        "3. Uriin ang Pahayag: ikategorya bilang Katotohanan, Pagpapahalaga (opinyon), o Polisiya.",
        "4. Tiyakin ang Pagiging Obhetibo: alamin kung ito ay pangkalahatang mapatutunayan o sariling pananaw.",
      ],
    ],
    example: {
      passage: [
        "The exhibit opened at nine. It was the most impressive exhibit of the year.",
        "Nagbukas ang eksibit nang alas-nuwebe. Ito ang pinakakahanga-hangang eksibit ng taon.",
      ],
      breakdown: [
        [
          "• Statement 1 ('opened at nine'): Objective Fact (verifiable via logbooks, tickets, and timestamps).",
          "• Statement 2 ('most impressive'): Subjective Opinion (a personal value judgment based on individual taste).",
        ],
        [
          "• Pahayag 1 ('Nagbukas nang alas-nuwebe'): Obhetibong Katotohanan (mapatutunayan sa logbook at orasan).",
          "• Pahayag 2 ('pinakakahanga-hanga'): Pansariling Opinyon (paghatol na nakabatay sa pansariling panlasa).",
        ],
      ],
    },
    traps: [
      [
        "Consensus Fallacy: believing that when many people agree on an opinion, it transforms into an empirical fact.",
        "Expert Opinion Confusion: treating a respected expert's personal opinion as an unquestionable scientific law.",
      ],
      [
        "Bitag ng Mayorya: pag-aakalang kapag marami ang sumasang-ayon sa isang opinyon ay nagiging katotohanan na ito.",
        "Pahayag ng Eksperto: pagtanggap sa opinyon ng eksperto bilang batas na hindi na maaaring suriin o kuwestyunin.",
      ],
    ],
    resources: [
      {
        title: "DepEd Media & Information Literacy (MIL) · Fact-Checking Framework",
        desc: "Standards for verifying sources, identifying bias, and evaluating digital texts.",
        tag: "DepEd MIL",
      },
      {
        title: "CRAAP Source Evaluation Test (Currency, Relevance, Authority, Accuracy, Purpose)",
        desc: "Analytical tool for auditing credibility and objectivity in academic and media reports.",
        tag: "Critical Tool",
      },
      {
        title: "DepEd MATATAG · Countering Disinformation Reading Modules",
        desc: "Secondary curriculum resources on differentiating verified journalism from subjective commentary.",
        tag: "MATATAG NRP",
      },
    ],
  },
];
