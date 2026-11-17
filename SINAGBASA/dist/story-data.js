const CAST = [
  { name: "Alex", role: ["Student investigator", "Mag-aaral na imbestigador"] },
  { name: "Mika", role: ["Radio operator", "Tagapag-ugnay sa radyo"] },
  { name: "Theo", role: ["Courier", "Tagapaghatid"] },
  { name: "Ms. Reyes", role: ["Librarian", "Tagapangasiwa ng aklatan"] },
];
const STORY_TEXT = {
  en: {
    title: "Signal After Dark",
    subtitle: "A storm. A silent radio. A town counting on your next decision.",
    chapter: "Chapter",
    start: "Begin the story",
    continue: "Continue story",
    nextLine: "Continue dialogue",
    decision: "Make your move",
    journal: "Evidence journal",
    empty: "No clues collected yet.",
    timer: "Scene time remaining",
    timerFailed: "Decision failed",
    timerExpired: "Time expired",
    timerSecured: "Scene secured",
    timed: "Timed adventure",
    relaxed: "Story mode · no timer",
    mode: "Play style",
    pause: "Pause",
    resume: "Resume",
    paused: "The story is paused.",
    retry: "Retry checkpoint",
    fail: "The plan broke down.",
    timeout: "The radio window closed.",
    timeoutBody:
      "Your team missed the transmission window. Return to the checkpoint, reread the clue, and try again.",
    success: "Chapter secured!",
    next: "Continue to next chapter",
    complete: "Town restored. Case closed.",
    completeBody:
      "Your team followed the evidence, recovered the signal, and brought the town back together.",
    restart: "Replay from chapter one",
    chapters: "Case chapters",
    locked: "Complete the previous chapter first.",
    reading:
      "Read every dialogue line to reveal your choices. In timed mode, the countdown begins as soon as each scene opens, so read carefully under pressure.",
    cast: "YOUR READING RESCUE TEAM",
    trust: "Team resolve",
    inspect: "Inspect the clue",
    back: "Back to games",
    saved: "Your checkpoint is saved automatically.",
    choiceLog: "Your decisions",
    noLog: "Your choices will appear here.",
    return: "Return to briefing",
    win: "Mission accomplished",
    modeHint:
      "Timed mode gives 75 seconds for the full scene, including dialogue and evidence. Pause anytime; hidden tabs pause automatically.",
    checkpoint: "Checkpoint",
    failExplain:
      "A failed scene is a chance to rethink the evidence. You can retry without losing chapter completion.",
    mission: "OBJECTIVE",
    sound: "Sound",
    chapterCount: "chapters",
  },
  fil: {
    title: "Hudyat sa Dilim",
    subtitle:
      "Isang bagyo. Tahimik na radyo. Bayang umaasa sa susunod mong pasya.",
    chapter: "Kabanata",
    start: "Simulan ang kuwento",
    continue: "Ipagpatuloy",
    nextLine: "Ipagpatuloy ang usapan",
    decision: "Piliin ang kilos",
    journal: "Talaan ng ebidensya",
    empty: "Wala pang nakolektang pahiwatig.",
    timer: "Natitirang oras sa eksena",
    timerFailed: "Maling pasya",
    timerExpired: "Naubos ang oras",
    timerSecured: "Ligtas ang eksena",
    timed: "May oras na pakikipagsapalaran",
    relaxed: "Kuwento · walang timer",
    mode: "Paraan ng paglalaro",
    pause: "I-pause",
    resume: "Ipagpatuloy",
    paused: "Naka-pause ang kuwento.",
    retry: "Balikan ang checkpoint",
    fail: "Hindi nagtagumpay ang plano.",
    timeout: "Nagsara ang pagkakataong makapagpadala.",
    timeoutBody:
      "Hindi nakaabot ang pangkat sa oras ng pagpapadala. Balikan ang checkpoint at muling basahin ang pahiwatig.",
    success: "Natapos ang kabanata!",
    next: "Susunod na kabanata",
    complete: "Naibalik ang liwanag. Nalutas ang kaso.",
    completeBody:
      "Sinundan ng pangkat ang ebidensya, naibalik ang hudyat, at muling napag-ugnay ang bayan.",
    restart: "Laruin mula sa unang kabanata",
    chapters: "Mga kabanata",
    locked: "Tapusin muna ang naunang kabanata.",
    reading:
      "Basahin ang bawat linya bago lumabas ang pagpipilian. Sa timed mode, magsisimula ang countdown pagbukas ng bawat eksena kaya magbasa nang maingat kahit may oras.",
    cast: "PANGKAT NA TAGAPAGSAGIP SA PAGBASA",
    trust: "Tiwala ng pangkat",
    inspect: "Suriin ang pahiwatig",
    back: "Bumalik sa mga laro",
    saved: "Awtomatikong naka-save ang checkpoint.",
    choiceLog: "Iyong mga pasya",
    noLog: "Makikita rito ang iyong mga pasya.",
    return: "Balikan ang simula",
    win: "Matagumpay ang misyon",
    modeHint:
      "May 75 segundo para sa buong eksena, kasama ang usapan at ebidensya. Maaaring i-pause; awtomatikong naka-pause sa nakatagong tab.",
    checkpoint: "Checkpoint",
    failExplain:
      "Pagkakataon ang hindi matagumpay na eksena upang balikan ang ebidensya. Maaaring subukan muli.",
    mission: "LAYUNIN",
    sound: "Tunog",
    chapterCount: "kabanata",
  },
};
const STORY_CHAPTERS = [];
function scene(id, speaker, lines, clue, choices, kind = "scene") {
  return { id, speaker, lines, clue, choices, kind };
}
function option(label, to, cost = 0) {
  return { label, to, cost };
}
function storyChapter(
  title,
  objective,
  brief,
  clue,
  choices,
  follow,
  followClue,
  finalChoices,
  detour,
  fail,
  win,
) {
  STORY_CHAPTERS.push({
    title,
    objective,
    nodes: {
      start: scene("start", 1, brief, clue, choices),
      detour: scene("detour", 3, detour, clue, [
        option(
          [
            "Return to the clue and reconsider",
            "Balikan ang pahiwatig at muling magpasya",
          ],
          "follow",
          1,
        ),
      ]),
      follow: scene("follow", 2, follow, followClue, finalChoices),
      fail: scene("fail", 0, fail, null, [], "fail"),
      success: scene("success", 3, win, null, [], "success"),
    },
  });
}
storyChapter(
  ["The Silent Frequency", "Tahimik na Frequency"],
  ["Find the active emergency channel.", "Hanapin ang aktibong channel."],
  [
    [
      "Mika: The storm knocked out the regular radio. Ms. Reyes left a handwritten notice before heading to the library.",
      "Mika: Nawalan ng regular na radyo dahil sa bagyo. Nag-iwan si Ms. Reyes ng sulat bago pumunta sa aklatan.",
    ],
    [
      "Alex: Read the notice carefully. A channel marked “testing” may not carry real messages.",
      "Alex: Basahing mabuti ang sulat. Maaaring walang totoong mensahe sa channel na may “testing.”",
    ],
  ],
  [
    "NOTICE: Channel 4 is under testing and must not be used. Channel 7 carries tonight’s emergency updates. The archive channel is for yesterday’s recordings only.",
    "ABISO: Sinusubukan pa ang Channel 4; huwag gamitin. Nasa Channel 7 ang balita ngayong gabi. Para sa tala kahapon lamang ang archive channel.",
  ],
  [
    option(["Tune to Channel 7", "Pumunta sa Channel 7"], "follow"),
    option(
      ["Ask the librarian to interpret the notice", "Magpatulong sa librarian"],
      "detour",
      1,
    ),
    option(
      [
        "Use Channel 4 because it is mentioned first",
        "Gamitin ang Channel 4 dahil unang nabanggit",
      ],
      "fail",
      2,
    ),
  ],
  [
    [
      "Theo: Channel 7 works! The first message says, “Hold deliveries until the route notice is confirmed.”",
      "Theo: Gumagana ang Channel 7! “Ipagpaliban ang paghahatid hanggang makumpirma ang abiso sa ruta.”",
    ],
    [
      "Mika: We have the signal, but the instruction matters as much as the frequency.",
      "Mika: May hudyat na, ngunit mahalaga rin ang tagubilin.",
    ],
  ],
  [
    "RADIO: Hold deliveries until the route notice is confirmed.",
    "RADYO: Huwag munang maghatid hanggang makumpirma ang abiso sa ruta.",
  ],
  [
    option(
      ["Wait for route confirmation", "Hintayin ang kumpirmasyon ng ruta"],
      "success",
    ),
    option(
      ["Send the courier immediately", "Ipadala agad ang courier"],
      "fail",
      2,
    ),
  ],
  [
    [
      "Ms. Reyes: “Testing” is a warning, not an invitation. The notice assigns tonight’s updates to Channel 7.",
      "Ms. Reyes: Babala ang “sinusubukan,” hindi paanyaya. Sa Channel 7 ang balita ngayong gabi.",
    ],
  ],
  [
    [
      "Alex: We reached a test signal, or moved without confirmation. The team must stop and rebuild its plan.",
      "Alex: Napunta sa test signal o kumilos nang walang kumpirmasyon. Kailangang muling bumuo ng plano.",
    ],
  ],
  [
    [
      "Ms. Reyes: You found the live signal and respected the hold instruction. The team can now read the route notice.",
      "Ms. Reyes: Nahanap ang aktibong hudyat at nasunod ang tagubilin. Maaari nang basahin ang ruta.",
    ],
  ],
);

// Extend the fixed adventure with a deliberate literacy progression. Early
// chapters ask readers to identify explicit information; later chapters move
// through source evaluation, inference, evidence reconciliation, constrained
// prioritization, and synthesis. The branches and checkpoint ids stay stable.
const STORY_ADVANCED_DIALOGUE = [
  {
    start: [
      [
        "Mika: Three labels compete for our attention: testing, emergency, and archive. Before touching the dial, separate what each label permits from what it merely describes.",
        "Mika: Tatlong label ang dapat suriin: testing, emergency, at archive. Bago galawin ang dial, alamin kung ano ang pinahihintulutan ng bawat label at kung ano ang inilalarawan lamang nito.",
      ],
      [
        "Theo: So the safest choice is not automatically the first channel named. It is the one whose purpose and time match tonight's need.",
        "Theo: Kaya hindi awtomatikong pinakaligtas ang unang channel na nabanggit. Dapat tumugma ang gamit at oras nito sa pangangailangan ngayong gabi.",
      ],
    ],
    follow: [[
      "Alex: The word 'hold' changes the action completely. A true message is not permission to act before its stated condition is met.",
      "Alex: Binabago ng salitang 'maghintay' ang dapat gawin. Ang totoong mensahe ay hindi pahintulot na kumilos bago matupad ang kondisyon nito.",
    ]],
    startLabels: [
      ["Select Channel 7 because its purpose and time match the emergency", "Piliin ang Channel 7 dahil tugma ang gamit at oras nito sa emergency"],
      ["Request clarification before committing to a channel", "Humingi muna ng paglilinaw bago pumili ng channel"],
      ["Select Channel 4 because mention order implies priority", "Piliin ang Channel 4 dahil tila prayoridad ang unang nabanggit"],
    ],
  },
  {
    start: [
      [
        "Mika: Both messages look official, which makes this harder. Compare publication time, scope, and whether one notice explicitly replaces the other.",
        "Mika: Parehong mukhang opisyal ang mensahe kaya mas mahirap ito. Ihambing ang oras, saklaw, at kung tahasang pinapalitan ng isang abiso ang isa.",
      ],
      [
        "Theo: A shorter route is useful only while its evidence remains current. Convenience cannot overrule a newer closure that applies to all traffic.",
        "Theo: Kapaki-pakinabang lamang ang mas maikling ruta habang napapanahon ang ebidensya nito. Hindi mahihigitan ng kaginhawaan ang bagong pagsasara para sa lahat ng sasakyan.",
      ],
    ],
    follow: [[
      "Alex: The gate note supplies two criteria: assigned function and protection from weather. The correct entrance must satisfy both.",
      "Alex: Dalawang pamantayan ang nasa tala: nakatalagang gamit at proteksyon sa panahon. Dapat matugunan ng tamang pasukan ang dalawa.",
    ]],
    startLabels: [
      ["Follow the newer north-road notice that supersedes the screenshot", "Sundin ang bagong abiso sa hilagang daan na pumapalit sa screenshot"],
      ["Verify which source is current before choosing", "Tiyakin muna kung aling sanggunian ang kasalukuyan"],
      ["Prefer the shorter bridge route despite its older timestamp", "Piliin ang mas maikling ruta sa tulay kahit mas luma ang oras nito"],
    ],
  },
  {
    start: [
      [
        "Theo: Food and water are already available, so repeating those deliveries would ignore part of the message. We need the unmet need supported by several details.",
        "Theo: May pagkain at tubig na, kaya hindi dapat ulitin ang mga iyon. Hanapin natin ang pangangailangang hindi pa natutugunan at sinusuportahan ng maraming detalye.",
      ],
      [
        "Mika: Link the wet clothing, falling temperature, and shivering. Each clue is incomplete alone, but together they justify an inference.",
        "Mika: Pag-ugnayin ang basang damit, lumalamig na hangin, at panginginig. Kulang ang bawat pahiwatig kung nag-iisa, ngunit malinaw ang hinuha kapag pinagsama.",
      ],
    ],
    follow: [[
      "Alex: Sequence carries meaning here. Calling everyone first sounds compassionate, but it risks soaking the blankets and creating confusion at the entrance.",
      "Alex: May kahulugan ang pagkakasunod-sunod. Maawain pakinggan ang pagtawag agad sa lahat, ngunit maaaring mabasa ang kumot at magkagulo sa pasukan.",
    ]],
    startLabels: [
      ["Infer a need for dry blankets from the combined conditions", "Hinuhaing kailangan ng tuyong kumot batay sa pinagsamang kalagayan"],
      ["Identify the details that jointly support an unmet need", "Tukuyin ang mga detalyeng magkakasamang sumusuporta sa pangangailangan"],
      ["Send more food even though the message says meals are ready", "Magpadala pa ng pagkain kahit sinabing handa na ang pagkain"],
    ],
  },
  {
    start: [
      [
        "Theo: An empty box proves only that the contents are no longer here. By itself, it proves neither theft nor delivery.",
        "Theo: Pinatutunayan lamang ng walang lamang kahon na wala na rito ang laman. Hindi nito mag-isang pinatutunayan ang pagnanakaw o paghahatid.",
      ],
      [
        "Alex: Reconcile quantity, destination, signature, time, and the undamaged container. Then separate the strongest conclusion from what remains unknown.",
        "Alex: Pagtugmain ang dami, destinasyon, lagda, oras, at kundisyon ng kahon. Saka ihiwalay ang pinakamatibay na konklusyon sa hindi pa alam.",
      ],
    ],
    follow: [[
      "Mika: A precise report can confirm delivery while withholding the packer's identity. Accuracy includes naming the limit of our evidence.",
      "Mika: Maaaring kumpirmahin ng tumpak na ulat ang paghahatid ngunit hindi ang nag-impake. Bahagi ng katumpakan ang pagkilala sa hangganan ng ebidensya.",
    ]],
    startLabels: [
      ["Conclude delivery because the independent records and quantities agree", "Magpasyang naihatid dahil tugma ang magkahiwalay na tala at dami"],
      ["Compare all records before selecting the best explanation", "Ihambing ang lahat ng tala bago piliin ang pinakamahusay na paliwanag"],
      ["Treat the empty box as sufficient proof of theft", "Ituring ang walang lamang kahon bilang sapat na patunay ng pagnanakaw"],
    ],
  },
  {
    start: [
      [
        "Alex: This decision combines urgency and consequence. Convert every phrase to the same timeline, then identify which location loses access first.",
        "Alex: Pinagsasama ng pasyang ito ang pagkaapurahan at epekto. Ilagay sa iisang timeline ang bawat oras, saka tukuyin kung aling lugar ang unang mauubusan.",
      ],
      [
        "Ms. Reyes: Do not let list order, building size, or familiarity replace evidence. Later deliveries remain possible only if the earliest shortage is protected now.",
        "Ms. Reyes: Huwag hayaang palitan ng ayos ng listahan, laki ng gusali, o pagiging pamilyar ang ebidensya. Posible lamang ang susunod na hatid kung mapoprotektahan ngayon ang pinakamalapit na kakulangan.",
      ],
    ],
    follow: [[
      "Mika: Physical delivery is only half the task. The receipt creates accountability, so it must reach the person authorized to verify supplies rather than attendance.",
      "Mika: Kalahati lamang ng gawain ang paghahatid. Lumilikha ng pananagutan ang resibo, kaya dapat itong tanggapin ng may kapangyarihang magpatunay ng suplay, hindi ng attendance.",
    ]],
    startLabels: [
      ["Prioritize the hall because its supply fails first on the shared timeline", "Unahin ang bulwagan dahil ito ang unang mauubusan sa iisang timeline"],
      ["Normalize and compare all three deadlines before dispatch", "Ihambing sa iisang batayan ang tatlong deadline bago magpadala"],
      ["Prioritize by mention order instead of time to shortage", "Unahin ayon sa pagkakabanggit sa halip na oras ng pagkaubos"],
    ],
  },
  {
    start: [
      [
        "Theo: People need reassurance, but certainty we do not possess could send them toward danger. Separate verified outcomes from conditions that may still change.",
        "Theo: Kailangan ng tao ang katiyakan, ngunit maaaring ilagay sila sa panganib ng katiyakang wala naman tayo. Ihiwalay ang napatunayang resulta sa kundisyong maaari pang magbago.",
      ],
      [
        "Mika: Synthesize the whole case: report what arrived, preserve the route warning, and do not turn several successful deliveries into a claim about every road.",
        "Mika: Pagsamahin ang buong kaso: iulat ang dumating, panatilihin ang babala sa ruta, at huwag gawing pahayag tungkol sa lahat ng daan ang ilang matagumpay na paghahatid.",
      ],
    ],
    follow: [[
      "Alex: The ending should explain why the mission succeeded. Evidence was checked, interpretations were revised, and responsibilities were shared; that reasoning matters more than a hero myth.",
      "Alex: Dapat ipaliwanag ng wakas kung bakit nagtagumpay ang misyon. Sinuri ang ebidensya, itinama ang interpretasyon, at hinati ang tungkulin; mas mahalaga iyon kaysa kuwento ng nag-iisang bayani.",
    ]],
    startLabels: [
      ["Broadcast verified outcomes while preserving the unresolved route warning", "Ibalita ang napatunayang resulta habang pinananatili ang babala sa ruta"],
      ["Audit the final message for evidence, limits, and possible overclaiming", "Suriin ang huling mensahe para sa ebidensya, limitasyon, at labis na pahayag"],
      ["Generalize from successful deliveries that every road is safe", "Ipahayag mula sa matagumpay na hatid na ligtas ang lahat ng daan"],
    ],
  },
];

const STORY_FAILURE_CONSEQUENCES = [
  { image: "assets/story-failure-signal.png", lines: [
    ["Mika: The test channel carries only silence, while an unconfirmed dispatch sends help away from those calling. The clinic's urgent message never reaches the team.", "Mika: Katahimikan lamang ang nasa test channel, habang inilalayo ng hindi kumpirmadong dispatch ang tulong sa mga tumatawag. Hindi nakarating sa pangkat ang agarang mensahe ng klinika."],
    ["Ms. Reyes: Every minute on the wrong frequency closes a rescue window. We must admit the mistake, return to the notice, and recover the live channel now.", "Ms. Reyes: Bawat minuto sa maling frequency ay nagsasara ng pagkakataong makasagip. Aminin natin ang pagkakamali, balikan ang abiso, at hanapin agad ang aktibong channel."],
  ]},
  { image: "assets/story-failure-flood.png", lines: [
    ["Theo: The outdated route ends at a flooded bridge. The current tears the relief boxes away, and the clinic lights remain on while its expected supplies disappear downstream.", "Theo: Nagtatapos sa binahang tulay ang lumang ruta. Tinangay ng agos ang mga kahon, at nananatiling bukas ang ilaw ng klinika habang inaanod ang hinihintay nitong suplay."],
    ["Alex: Choosing convenience over current evidence endangered the courier and cost resources we cannot quickly replace. Rebuild the route from verified information.", "Alex: Nalagay sa panganib ang tagapaghatid at nawala ang suplay na hindi madaling mapapalitan dahil pinili natin ang ginhawa kaysa ebidensya. Buuing muli ang ruta mula sa beripikadong impormasyon."],
  ]},
  { image: "assets/story-failure-hall.png", lines: [
    ["Ms. Reyes: Extra food sits untouched, or badly sequenced distribution leaves dry blankets exposed to rain. Either way, soaked children keep shivering while precious time disappears.", "Ms. Reyes: Hindi nagagalaw ang dagdag na pagkain, o nababasa sa ulan ang tuyong kumot dahil sa maling pagkakasunod-sunod. Sa alinman, patuloy na nanginginig ang mga basang bata habang nauubos ang oras."],
    ["Mika: A weak inference is not just a wrong answer here; it leaves a real need unmet. Trace every detail and choose what protects them from the worsening cold.", "Mika: Hindi lamang maling sagot ang mahinang hinuha; iniiwan nitong walang tugon ang tunay na pangangailangan. Sundan ang bawat detalye at piliin ang magpoprotekta sa kanila sa lumalalang lamig."],
  ]},
  { image: "assets/story-failure-flood.png", lines: [
    ["Alex: The unsupported accusation spreads over the radio. Volunteers stop trusting the handover system, deliveries stall, and the clinic waits for water the records could have accounted for.", "Alex: Kumalat sa radyo ang akusasyong walang batayan. Nawalan ng tiwala ang mga boluntaryo, huminto ang paghahatid, at naghintay ang klinika sa tubig na maipapaliwanag sana ng mga tala."],
    ["Ms. Reyes: Evidence protects people as well as reputations. Correct the claim publicly and rebuild the report using only what the records establish.", "Ms. Reyes: Pinoprotektahan ng ebidensya ang tao at pangalan. Itama sa publiko ang pahayag at buuing muli ang ulat gamit lamang ang pinatutunayan ng mga tala."],
  ]},
  { image: "assets/story-failure-hall.png", lines: [
    ["Theo: Either the water goes to the wrong location or its receipt reaches someone unable to verify it. At the hall, the last container empties while exhausted families wait for accountable distribution.", "Theo: Maaaring napunta ang tubig sa maling lugar o napunta ang resibo sa hindi makapagpapatunay nito. Sa bulwagan, nauubos ang huling lalagyan habang naghihintay ang mga pagod na pamilya ng maayos na pamamahagi."],
    ["Mika: Mention order felt easy, but deadlines measured the real risk. Build one shared timeline before another avoidable shortage becomes an emergency.", "Mika: Madaling sundin ang ayos ng pagbanggit, ngunit deadline ang sumusukat sa tunay na panganib. Bumuo ng iisang timeline bago maging emergency ang isa pang maiiwasang kakulangan."],
  ]},
  { image: "assets/story-failure-hall.png", lines: [
    ["Mika: A false all-clear or a distorted hero story travels faster than the correction. Families trust unsafe routes, and volunteers who carried the mission together disappear from the record.", "Mika: Mas mabilis kumalat kaysa pagwawasto ang maling all-clear o baluktot na kuwento ng nag-iisang bayani. Nagtiwala ang mga pamilya sa delikadong ruta, at nabura sa tala ang mga boluntaryong nagtulungan."],
    ["Alex: A comforting exaggeration can become a dangerous instruction. The broadcast must name confirmed successes, preserve uncertainty, and require continued route checks.", "Alex: Maaaring maging mapanganib na tagubilin ang nakaaaliw na pagmamalabis. Dapat tukuyin ng broadcast ang kumpirmadong tagumpay, kilalanin ang hindi tiyak, at ipagpatuloy ang pagsusuri sa ruta."],
  ]},
];

storyChapter(
  ["Two Roads, One Delivery", "Dalawang Daan, Isang Paghahatid"],
  [
    "Choose a route supported by the current notice.",
    "Pumili ng rutang batay sa kasalukuyang abiso.",
  ],
  [
    [
      "Theo: A screenshot says the east bridge is open. But its date is yesterday. A fresh notice just arrived.",
      "Theo: Bukas daw ang tulay sa screenshot, ngunit kahapon ang petsa. May bagong abiso.",
    ],
    [
      "Alex: We need the current instruction, not the message that promises the shortest trip.",
      "Alex: Kailangan ang kasalukuyang tagubilin, hindi ang pinakamabilis na pangako.",
    ],
  ],
  [
    "TODAY 7:10 PM: East bridge closed to all traffic. Use the north road for deliveries. Yesterday’s bridge notice is no longer valid.",
    "NGAYON 7:10 PM: Sarado ang silangang tulay sa lahat. Gamitin ang hilagang daan. Hindi na balido ang abiso kahapon.",
  ],
  [
    option(["Use the north road", "Gamitin ang hilagang daan"], "follow"),
    option(
      ["Verify the date with Ms. Reyes", "Ipatukoy ang petsa kay Ms. Reyes"],
      "detour",
      1,
    ),
    option(
      ["Follow yesterday’s bridge screenshot", "Sundin ang screenshot kahapon"],
      "fail",
      2,
    ),
  ],
  [
    [
      "Theo: The north road leads to two entrances. The marker says deliveries belong at the covered gate.",
      "Theo: May dalawang pasukan. Sa may bubong na tarangkahan ang paghahatid.",
    ],
    [
      "Mika: Choose the entrance that protects the supplies from rain.",
      "Mika: Piliin ang pasukang protektado sa ulan.",
    ],
  ],
  [
    "GATE NOTE: Main door is for visitors. Supplies must enter through the covered gate.",
    "TALA: Para sa bisita ang pangunahing pinto. Sa may bubong na tarangkahan ang suplay.",
  ],
  [
    option(
      ["Go to the covered gate", "Pumunta sa may bubong na tarangkahan"],
      "success",
    ),
    option(
      [
        "Leave supplies at the visitor door",
        "Iwan ang suplay sa pinto ng bisita",
      ],
      "fail",
      2,
    ),
  ],
  [
    [
      "Ms. Reyes: The time stamp matters. Today’s notice replaces yesterday’s route.",
      "Ms. Reyes: Mahalaga ang petsa. Pinalitan ng abiso ngayon ang ruta kahapon.",
    ],
  ],
  [
    [
      "Theo: The old route is blocked, or the supplies reached the wrong entrance. We need a better reading of the notice.",
      "Theo: Barado ang lumang ruta o mali ang pasukan ng suplay. Balikan ang abiso.",
    ],
  ],
  [
    [
      "Mika: Correct route, correct gate. The supplies stayed dry. A new message is coming from the hall.",
      "Mika: Tamang ruta at pasukan. Tuyo ang suplay. May mensahe mula sa bulwagan.",
    ],
  ],
);

queueMicrotask(() => {
  STORY_ADVANCED_DIALOGUE.forEach((upgrade, chapterIndex) => {
    const chapter = STORY_CHAPTERS[chapterIndex];
    if (!chapter) return;
    chapter.nodes.start.lines.push(...upgrade.start);
    chapter.nodes.follow.lines.push(...upgrade.follow);
    const consequence = STORY_FAILURE_CONSEQUENCES[chapterIndex];
    if (consequence) {
      chapter.nodes.fail.lines.push(...consequence.lines);
      chapter.nodes.fail.image = consequence.image;
    }
    upgrade.startLabels.forEach((label, choiceIndex) => {
      if (chapter.nodes.start.choices[choiceIndex]) {
        chapter.nodes.start.choices[choiceIndex].label = label;
      }
    });
  });
});
storyChapter(
  ["The Unspoken Need", "Hindi Tahasang Pangangailangan"],
  [
    "Infer what the waiting families need.",
    "Mahinuha ang kailangan ng naghihintay na pamilya.",
  ],
  [
    [
      "Ms. Reyes: The hall’s message does not name a supply. It describes the families instead.",
      "Ms. Reyes: Hindi binanggit ang suplay. Kalagayan ng pamilya ang inilarawan.",
    ],
    [
      "Alex: Actions and conditions can be clues. Do not confuse a guess with a supported inference.",
      "Alex: Pahiwatig ang kilos at kalagayan. Ihiwalay ang hula sa may suportang hinuha.",
    ],
  ],
  [
    "HALL: Families arrived with wet clothes. Children are shivering as the air grows colder. Meals and drinking water are already ready.",
    "BULWAGAN: Basa ang damit ng pamilya. Nanginginig ang bata habang lumalamig. May pagkain at maiinom na tubig na.",
  ],
  [
    option(["Bring dry blankets", "Magdala ng tuyong kumot"], "follow"),
    option(
      ["Ask which detail suggests a need", "Itanong ang sumusuportang detalye"],
      "detour",
      1,
    ),
    option(["Bring only extra food", "Dagdag na pagkain lamang"], "fail", 2),
  ],
  [
    [
      "Theo: I have dry blankets. The hall asks us to place them in the dry corner before calling the families.",
      "Theo: May tuyong kumot. Ilagay daw sa tuyong sulok bago tawagin ang pamilya.",
    ],
    [
      "Mika: Follow the order so the blankets stay usable.",
      "Mika: Sundin ang ayos upang magamit ang mga kumot.",
    ],
  ],
  [
    "DELIVERY NOTE: Place blankets in the dry corner first. Then call the families.",
    "TALA: Ilagay muna ang kumot sa tuyong sulok. Saka tawagin ang pamilya.",
  ],
  [
    option(
      [
        "Place blankets, then call families",
        "Ilagay ang kumot, saka tawagin ang pamilya",
      ],
      "success",
    ),
    option(
      [
        "Call everyone before placing the blankets",
        "Tawagin muna ang lahat bago ilagay ang kumot",
      ],
      "fail",
      1,
    ),
  ],
  [
    [
      "Ms. Reyes: Wet clothes, cold air, and shivering all support a need for warmth.",
      "Ms. Reyes: Basa, lamig, at panginginig ang suporta sa pangangailangan ng init.",
    ],
  ],
  [
    [
      "Theo: Our delivery did not address the clue, or we ignored the required order. Let’s return to the checkpoint.",
      "Theo: Hindi natugunan ang pahiwatig o nasunod ang ayos. Balikan ang checkpoint.",
    ],
  ],
  [
    [
      "Ms. Reyes: Your inference helped the families. They found a note that may explain the missing supply log.",
      "Ms. Reyes: Nakatulong ang hinuha. Nakakita ang pamilya ng tala tungkol sa nawawalang log.",
    ],
  ],
);
storyChapter(
  ["The Missing Supply Log", "Nawawalang Talaan ng Suplay"],
  [
    "Explain an empty box using evidence.",
    "Ipaliwanag ang walang lamang kahon gamit ang ebidensya.",
  ],
  [
    [
      "Alex: A supply box is empty. Someone says the items were stolen. We need more than a rumor.",
      "Alex: Walang laman ang kahon. Ninakaw daw ang laman. Hindi sapat ang tsismis.",
    ],
    [
      "Mika: The courier left a signed receipt beside the box. Compare it with the log.",
      "Mika: May pinirmahang resibo sa tabi. Ihambing ito sa log.",
    ],
  ],
  [
    "LOG: Twelve water packs collected. RECEIPT: Twelve water packs received at the clinic, signed 7:20 PM. The box is undamaged.",
    "LOG: Labindalawang pakete ng tubig. RESIBO: Labindalawang pakete ang tinanggap sa klinika, pirmado 7:20 PM. Walang sira ang kahon.",
  ],
  [
    option(
      [
        "Conclude the water was delivered to the clinic",
        "Sabihing naihatid ang tubig sa klinika",
      ],
      "follow",
    ),
    option(
      ["Ask to compare quantities", "Ihambing muna ang dami"],
      "detour",
      1,
    ),
    option(
      ["Accuse the courier of theft", "Akusahan ang courier ng pagnanakaw"],
      "fail",
      2,
    ),
  ],
  [
    [
      "Theo: The quantities match. The clinic needs a corrected report, not a theft warning.",
      "Theo: Tugma ang dami. Kailangan ng klinika ang itinamang ulat, hindi babala ng pagnanakaw.",
    ],
    [
      "Alex: Write only what the records support.",
      "Alex: Isulat lamang ang sinusuportahan ng tala.",
    ],
  ],
  [
    "REPORT CHOICE: The receipt documents delivery of twelve packs. It does not say who originally packed them.",
    "ULAT: Patunay ang resibo sa labindalawang pakete. Hindi sinabi kung sino ang orihinal na nag-impake.",
  ],
  [
    option(
      [
        "Report twelve packs delivered; leave the packer unknown",
        "Iulat ang naihatid; huwag hulaan ang nag-impake",
      ],
      "success",
    ),
    option(
      [
        "Name a packer without evidence",
        "Pangalanan ang nag-impake nang walang ebidensya",
      ],
      "fail",
      2,
    ),
  ],
  [
    [
      "Ms. Reyes: Both records list twelve packs. The signed receipt supports delivery.",
      "Ms. Reyes: Labindalawa sa dalawang tala. Patunay ng paghahatid ang pirmadong resibo.",
    ],
  ],
  [
    [
      "Alex: An unsupported accusation or invented name confused the report. Return to the actual records.",
      "Alex: Nagulo ang ulat dahil sa walang batayang akusasyon o pangalan. Balikan ang tala.",
    ],
  ],
  [
    [
      "Mika: The log is repaired. Now we can prioritize the final requests using trustworthy records.",
      "Mika: Naayos ang log. Maaari nang unahin ang huling kahilingan gamit ang maaasahang tala.",
    ],
  ],
);
storyChapter(
  ["Before the Window Closes", "Bago Magsara ang Pagkakataon"],
  [
    "Prioritize a shortage using time clues.",
    "Unahin ang kakulangan gamit ang pahiwatig sa oras.",
  ],
  [
    [
      "Mika: One water delivery remains. Three locations are calling at once.",
      "Mika: Isang paghahatid ng tubig na lang. Sabay-sabay ang tatlong kahilingan.",
    ],
    [
      "Theo: Read every deadline before giving me the destination.",
      "Theo: Basahin ang bawat oras bago piliin ang pupuntahan.",
    ],
  ],
  [
    "GYM: Water until tomorrow. CLINIC: Water until midnight. HALL: Water runs out in thirty minutes. One delivery can leave now.",
    "GYM: Tubig hanggang bukas. KLINIKA: Hanggang hatinggabi. BULWAGAN: Mauubos sa loob ng tatlumpung minuto. Isang paghahatid ngayon.",
  ],
  [
    option(
      ["Send water to the hall first", "Unahin ang tubig sa bulwagan"],
      "follow",
    ),
    option(
      ["Ask Mika to compare deadlines", "Ipatulad ang oras kay Mika"],
      "detour",
      1,
    ),
    option(
      [
        "Choose the gym because it was listed first",
        "Unahin ang gym dahil unang nakalista",
      ],
      "fail",
      2,
    ),
  ],
  [
    [
      "Theo: Destination confirmed. The handover note says the caretaker, not the visitor desk, records water deliveries.",
      "Theo: Kumpirmado ang lugar. Tagapangasiwa, hindi mesa ng bisita, ang nagtatala ng tubig.",
    ],
    [
      "Alex: Make sure the record reaches the right person.",
      "Alex: Tiyaking sa tamang tao mapupunta ang tala.",
    ],
  ],
  [
    "HANDOVER: Give the water and receipt to the hall caretaker. Visitor desk handles attendance only.",
    "PAG-ABOT: Sa tagapangasiwa ang tubig at resibo. Attendance lamang sa mesa ng bisita.",
  ],
  [
    option(
      [
        "Give supplies and receipt to the caretaker",
        "Ibigay ang suplay at resibo sa tagapangasiwa",
      ],
      "success",
    ),
    option(
      [
        "Leave the receipt at the visitor desk",
        "Iwan ang resibo sa mesa ng bisita",
      ],
      "fail",
      1,
    ),
  ],
  [
    [
      "Mika: Thirty minutes is sooner than midnight or tomorrow. Mention order is not priority order.",
      "Mika: Mas maaga ang tatlumpung minuto kaysa hatinggabi o bukas. Hindi prayoridad ang ayos ng pagbanggit.",
    ],
  ],
  [
    [
      "Theo: We chose a later shortage or sent the record to the wrong desk. The plan needs another look.",
      "Theo: Nahuling kakulangan ang nauna o mali ang mesa ng tala. Balikan ang plano.",
    ],
  ],
  [
    [
      "Ms. Reyes: The hall received water in time, and the caretaker signed. One last broadcast can bring the town together.",
      "Ms. Reyes: Nakaabot ang tubig at pumirma ang tagapangasiwa. Isang huling broadcast para sa bayan.",
    ],
  ],
);
storyChapter(
  ["The Final Broadcast", "Huling Broadcast"],
  [
    "Choose an accurate summary and ending.",
    "Piliin ang tumpak na buod at wakas.",
  ],
  [
    [
      "Ms. Reyes: The signal is restored, the deliveries are recorded, and the families have the right supplies.",
      "Ms. Reyes: Naibalik ang hudyat, naitala ang paghahatid, at may tamang suplay ang pamilya.",
    ],
    [
      "Alex: The final message should summarize what we know without exaggerating.",
      "Alex: Ibuod ang nalalaman nang walang pagmamalabis.",
    ],
  ],
  [
    "CONFIRMED: Channel 7 works. Water reached the hall. Blankets reached waiting families. Roads still require the latest route notices.",
    "KUMPIRMADO: Gumagana ang Channel 7. Nakarating ang tubig at kumot. Kailangan pa rin ang pinakabagong abiso sa ruta.",
  ],
  [
    option(
      [
        "Broadcast the confirmed deliveries and remind everyone to check routes",
        "Iulat ang naihatid at paalalahanang suriin ang ruta",
      ],
      "follow",
    ),
    option(
      ["Ask for a final evidence review", "Humingi ng huling pagsusuri"],
      "detour",
      1,
    ),
    option(
      [
        "Announce that every road is completely safe",
        "Sabihing ligtas ang lahat ng kalsada",
      ],
      "fail",
      2,
    ),
  ],
  [
    [
      "Mika: There is one last sentence. Do we credit a single hero or the team’s evidence-based decisions?",
      "Mika: May huling pangungusap. Isang bayani ba o pasyang batay sa ebidensya ng pangkat?",
    ],
    [
      "Theo: Every person read a different piece of the story.",
      "Theo: Iba-ibang bahagi ang binasa ng bawat isa.",
    ],
  ],
  [
    "TEAM LOG: Mika found the signal. Alex read the clues. Theo delivered supplies. Ms. Reyes verified the records.",
    "TALA: Nahanap ni Mika ang hudyat. Binasa ni Alex ang pahiwatig. Naghatid si Theo. Sinuri ni Ms. Reyes ang tala.",
  ],
  [
    option(
      [
        "Credit the team and the use of evidence",
        "Kilalanin ang pangkat at paggamit ng ebidensya",
      ],
      "success",
    ),
    option(
      [
        "Claim that one person did everything",
        "Sabihing iisang tao ang gumawa ng lahat",
      ],
      "fail",
      1,
    ),
  ],
  [
    [
      "Ms. Reyes: Confirmed deliveries do not prove that every road is safe. Preserve the route warning.",
      "Ms. Reyes: Hindi patunay sa ligtas na kalsada ang paghahatid. Panatilihin ang babala sa ruta.",
    ],
  ],
  [
    [
      "Alex: The broadcast went beyond the evidence. Revisit the confirmed facts and try again.",
      "Alex: Lumampas sa ebidensya ang broadcast. Balikan ang kumpirmadong detalye.",
    ],
  ],
  [
    [
      "Mika: The signal carries a clear, accurate message. The town lights up as your team’s final report reaches everyone.",
      "Mika: Malinaw at tumpak ang mensahe. Lumiwanag ang bayan nang makarating ang huling ulat.",
    ],
  ],
);
