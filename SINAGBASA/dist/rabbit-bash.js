"use strict";

/* Rabbit Recall: a lesson-linked target game with collectible puzzle cards. */
state.rabbit = { answered: {}, pieces: 0, skins: [], streak: 0, bestStreak: 0 };
try {
  const savedRabbit = JSON.parse(localStorage.getItem(KEY) || "null")?.rabbit;
  if (savedRabbit && typeof savedRabbit === "object") {
    state.rabbit = {
      answered:
        savedRabbit.answered && typeof savedRabbit.answered === "object"
          ? savedRabbit.answered
          : {},
      pieces: Math.max(0, Math.min(12, Number(savedRabbit.pieces) || 0)),
      skins: Array.isArray(savedRabbit.skins) ? savedRabbit.skins : [],
      streak: Math.max(0, Number(savedRabbit.streak) || 0),
      bestStreak: Math.max(0, Number(savedRabbit.bestStreak) || 0),
    };
  }
} catch {}

const RABBIT_SKINS = [
  { icon: "🌿", name: ["Forest Scout", "Bantay-Gubat"] },
  { icon: "🌙", name: ["Moon Reader", "Mambabasa ng Buwan"] },
  { icon: "✨", name: ["Sinag Champion", "Kampeon ng Sinag"] },
];

const rabbitCopy = {
  en: {
    title: "Rabbit Recall",
    eyebrow: "BASH · ANSWER · COLLECT",
    desc: "Tap a rabbit, answer a question from your lessons, and collect puzzle-card pieces to unlock rabbit skins.",
    back: "All games",
    bash: "Bash a rabbit!",
    fieldHint: "Every rabbit hides one lesson question. Correct answers earn one new piece.",
    question: "Lesson challenge",
    story: "Read the story first",
    storyHint: "The question will be based on this passage.",
    continue: "Continue to question",
    check: "Check answer",
    correct: "Great hit! You earned a puzzle piece.",
    repeat: "Correct! You already collected this question's piece.",
    wrong: "Not quite. Review the explanation and try another answer.",
    next: "Back to the rabbit field",
    review: "Review lesson",
    collection: "Puzzle collection",
    pieces: "pieces collected",
    unlock: "Complete 4 pieces to unlock",
    unlocked: "Skin unlocked",
    complete: "All lesson questions cleared! You collected every skin.",
    progress: "Rabbit Recall rewards",
    focus: "Focus",
    streak: "Streak",
    mastery: "Mastery stars",
  },
  fil: {
    title: "Rabbit Recall",
    eyebrow: "HAMPAS · SAGOT · KOLEKTA",
    desc: "Pindutin ang kuneho, sagutin ang tanong mula sa mga aralin, at mangolekta ng puzzle-card pieces para mag-unlock ng rabbit skins.",
    back: "Lahat ng laro",
    bash: "Pumili ng kuneho!",
    fieldHint: "May nakatagong tanong mula sa aralin ang bawat kuneho. May isang bagong piraso sa bawat tamang sagot.",
    question: "Hamon mula sa aralin",
    story: "Basahin muna ang kuwento",
    storyHint: "Ibabatay sa talatang ito ang tanong.",
    continue: "Magpatuloy sa tanong",
    check: "Tingnan ang sagot",
    correct: "Mahusay! Nakakuha ka ng puzzle piece.",
    repeat: "Tama! Nakuha mo na dati ang piraso para sa tanong na ito.",
    wrong: "Hindi pa tama. Basahin ang paliwanag at subukang muli.",
    next: "Bumalik sa rabbit field",
    review: "Balikan ang aralin",
    collection: "Koleksiyon ng puzzle",
    pieces: "pirasong nakolekta",
    unlock: "Bumuo ng 4 na piraso para ma-unlock",
    unlocked: "Na-unlock na skin",
    complete: "Natapos ang lahat ng tanong! Nakolekta mo ang lahat ng skin.",
    progress: "Mga gantimpala sa Rabbit Recall",
    focus: "Pokus",
    streak: "Sunod-sunod",
    mastery: "Mastery stars",
  },
};

const RABBIT_DISTRACTORS = [
  ["More gym decorations", "Mas maraming dekorasyon sa gym"],
  ["Additional meal schedules", "Dagdag na iskedyul ng pagkain"],
  ["Whichever site replied last", "Ang huling sumagot na lugar"],
  ["Niko", "Si Niko"],
  ["She had completed every agenda item", "Natapos na niya ang lahat ng paksa sa adyenda"],
  ["Easy to repair", "Madaling ayusin"],
  ["Difficult to enter", "Mahirap pasukin"],
  ["Sam selected the type of seed", "Pinili ni Sam ang uri ng buto"],
  ["The class preferred handwriting", "Mas gusto ng klase ang sulat-kamay"],
  ["A Blue Library Door", "Ang Asul na Pinto ng Aklatan"],
  ["Students borrowed more novels", "Humiram ng mas maraming nobela ang mga mag-aaral"],
  ["Both statements are opinions", "Parehong opinyon ang dalawang pahayag"],
];
const RABBIT_CONTEXT = [
  ["The coordinator must prioritize needs that could become dangerous before the next scheduled delivery.", "Kailangang unahin ng tagapag-ugnay ang pangangailangang maaaring maging mapanganib bago ang susunod na paghahatid."],
  ["The team reviews which basic need has not yet been addressed rather than simply sending more of what is already available.", "Sinusuri ng pangkat kung aling pangunahing pangangailangan ang hindi pa natutugunan sa halip na dagdagan lamang ang mayroon na."],
  ["Only one vehicle is available, so urgency and the time remaining must guide the decision.", "Iisa lamang ang sasakyan kaya dapat ibatay ang pasya sa tindi ng pangangailangan at natitirang oras."],
  ["Readers must trace each pronoun to the nearest logical noun, not merely the nearest word.", "Dapat iugnay ng mambabasa ang panghalip sa lohikal na pangngalan, hindi lamang sa pinakamalapit na salita."],
  ["Her decision allowed the group to protect its schedule despite a problem beyond her control.", "Dahil sa kaniyang pasya, nasunod ng pangkat ang iskedyul kahit may problemang wala sa kaniyang kontrol."],
  ["The phrase after the comma directly restates the unfamiliar term in ordinary language.", "Ang parirala pagkatapos ng kuwit ay tuwirang nagpapaliwanag sa di-pamilyar na salita."],
  ["The signal word ‘unlike’ establishes a contrast between the hallway and the room.", "Ang salitang ‘unlike’ ay naghahambing nang pasalungat sa pasilyo at sa silid."],
  ["Time markers reveal which preparation occurred before the planting itself.", "Ipinakikita ng mga panandang panahon kung aling paghahanda ang nauna sa pagtatanim."],
  ["The connector ‘because’ introduces the condition that produced the later action.", "Ipinakikilala ng pang-ugnay na ‘because’ ang kondisyong nagbunga sa sumunod na kilos."],
  ["A strong title must cover the shared purpose of all the actions, not just one memorable detail.", "Dapat saklawin ng mahusay na pamagat ang iisang layunin ng lahat ng kilos, hindi lamang ang isang kapansin-pansing detalye."],
  ["Relevant evidence explains why finding materials became more efficient.", "Ipinapaliwanag ng kaugnay na ebidensya kung bakit naging mas mabilis ang paghahanap ng mga kagamitan."],
  ["One statement can be checked against a schedule; the other depends on personal judgment.", "Ang isang pahayag ay masusuri sa iskedyul samantalang ang isa ay nakabatay sa pansariling paghuhusga."],
];

let rabbitSession = { lesson: null, phase: "story", choice: null, checked: false, correct: false, justEarned: false, hearts: 3 };
const rt = () => rabbitCopy[state.lang];
const rabbitSolved = () => Object.keys(state.rabbit.answered).filter((key) => state.rabbit.answered[key]?.correct).length;

function rabbitCollection(compact = false) {
  const u = rt();
  return `<section class="rabbit-collection ${compact ? "compact" : ""}"><div class="rabbit-collection-head"><div><p class="eyebrow">${u.collection}</p><h2>${state.rabbit.pieces} / 12 ${u.pieces}</h2></div><span class="rabbit-card-count">🧩 ${state.rabbit.pieces}</span></div><div class="rabbit-skins">${RABBIT_SKINS.map((skin, i) => {
    const unlocked = state.rabbit.pieces >= (i + 1) * 4;
    return `<div class="rabbit-skin ${unlocked ? "unlocked" : "locked"}"><div class="skin-puzzle">${[0, 1, 2, 3].map((_, p) => `<span class="${state.rabbit.pieces >= i * 4 + p + 1 ? "filled" : ""}">${state.rabbit.pieces >= i * 4 + p + 1 ? skin.icon : "?"}</span>`).join("")}</div><strong>${skin.name[L()]}</strong><small>${unlocked ? "✓ " + u.unlocked : `${u.unlock} (${Math.min(4, Math.max(0, state.rabbit.pieces - i * 4))}/4)`}</small></div>`;
  }).join("")}</div></section>`;
}

function rabbitField() {
  const u = rt();
  const remaining = LESSONS.map((_, i) => i).filter((i) => !state.rabbit.answered[i]?.correct);
  const choices = remaining.length ? remaining.slice(0, 6) : [];
  return `<div class="rabbit-game-head"><div><p class="eyebrow">${u.eyebrow}</p><h1>${u.title}</h1><p>${u.desc}</p></div><a class="text-link" href="#games">${u.back}</a></div><section class="rabbit-stage"><div class="rabbit-score"><span>${rabbitSolved()} / ${LESSONS.length}</span><div class="track"><div style="width:${(rabbitSolved() / LESSONS.length) * 100}%"></div></div><strong>🧩 ${state.rabbit.pieces}</strong></div><div class="rabbit-field-title"><h2>${remaining.length ? u.bash : u.complete}</h2><p>${u.fieldHint}</p></div>${remaining.length ? `<div class="rabbit-field" aria-label="${u.bash}">${choices.map((lesson, i) => `<button class="rabbit-target rabbit-${i % 3}" data-rabbit="${lesson}" aria-label="${u.bash} ${i + 1}"><span class="rabbit-ears" aria-hidden="true"><i></i><i></i></span><span class="rabbit-face" aria-hidden="true">• ᴥ •</span><span class="rabbit-hole" aria-hidden="true"></span><small>?</small></button>`).join("")}</div>` : `<div class="rabbit-finish">🏆<strong>${u.complete}</strong></div>`}</section>${rabbitCollection()}`;
}

function rabbitQuestion() {
  const u = rt(), i = rabbitSession.lesson, lesson = LESSONS[i], l = L();
  const already = state.rabbit.answered[i]?.correct && !rabbitSession.justEarned;
  const options = [...lesson.options[l], RABBIT_DISTRACTORS[i][l]];
  const stars = Math.max(1, rabbitSession.hearts);
  return `<div class="rabbit-game-head"><div><p class="eyebrow">${u.question} · ${lesson.skill[l]}</p><h1>${lesson.title[l]}</h1></div><button class="text-link rabbit-back" id="rabbitBack">${u.next}</button></div><section class="rabbit-question-card"><div class="rabbit-challenge-hud"><span>${u.focus}: ${"♥".repeat(rabbitSession.hearts)}${"♡".repeat(3 - rabbitSession.hearts)}</span><span>🔥 ${u.streak}: ${state.rabbit.streak}</span></div><div class="question-rabbit" aria-hidden="true"><span>🐰</span><i>💥</i></div><p class="eyebrow">${T().lesson} ${String(i + 1).padStart(2, "0")}</p><h2>${lesson.question[l]}</h2><div class="option-list">${options.map((option, n) => `<button class="option ${rabbitSession.choice === n ? "selected" : ""}" data-rabbit-answer="${n}" aria-pressed="${rabbitSession.choice === n}" ${rabbitSession.correct ? "disabled" : ""}><span>${"ABCD"[n]}</span>${option}</button>`).join("")}</div><button class="primary full" id="rabbitCheck" ${rabbitSession.choice === null || rabbitSession.correct ? "disabled" : ""}>${u.check}</button>${rabbitSession.checked ? `<div class="feedback ${rabbitSession.correct ? "success" : ""}" role="status" id="rabbitFeedback" tabindex="-1"><strong>${rabbitSession.correct ? (already ? u.repeat : u.correct) : u.wrong}</strong>${rabbitSession.correct ? `<div class="mastery-stars" aria-label="${stars} of 3 stars">${[1, 2, 3].map((star) => `<span class="${star <= stars ? "earned" : ""}">★</span>`).join("")}</div>` : ""}<p>${lesson.explain[l]}</p><div class="actions">${rabbitSession.correct ? `<button class="primary" id="rabbitNext">${u.next}</button>` : ""}<a class="secondary" href="#lessons/${i}">${u.review}</a></div></div>` : ""}</section>`;
}

function rabbitStory() {
  const u = rt(), i = rabbitSession.lesson, lesson = LESSONS[i], l = L();
  return `<div class="rabbit-game-head"><div><p class="eyebrow">${u.story} · ${lesson.skill[l]}</p><h1>${lesson.title[l]}</h1></div><button class="text-link rabbit-back" id="rabbitBack">${u.next}</button></div><section class="rabbit-story-card"><div class="story-rabbit" aria-hidden="true">🐰</div><p class="eyebrow">${T().lesson} ${String(i + 1).padStart(2, "0")}</p><h2>${u.story}</h2><p class="muted">${u.storyHint}</p><blockquote>${lesson.example[l]} ${RABBIT_CONTEXT[i][l]}</blockquote><button class="primary full" id="rabbitContinue">${u.continue}</button></section>`;
}

function rabbitPage() {
  return rabbitSession.lesson === null
    ? rabbitField()
    : rabbitSession.phase === "story"
      ? rabbitStory()
      : rabbitQuestion();
}

const gamesWithRabbit = gamesPage;
gamesPage = function (id) {
  if (id === "rabbit") return rabbitPage();
  const html = gamesWithRabbit(id);
  if (id !== undefined) return html;
  const card = `<a class="arcade-card rabbit-theme" href="#games/rabbit"><div class="arcade-card-top"><span class="arcade-emblem">🐰</span><span class="pill">${rabbitSolved()} / ${LESSONS.length}</span></div><p class="eyebrow">${rt().eyebrow}</p><h2>${rt().title}</h2><p>${rt().desc}</p><div class="arcade-card-foot"><span>🧩 ${state.rabbit.pieces} / 12</span><strong>${at().play} ＋</strong></div></a>`;
  return html.replace('<div class="arcade-catalog">', `<div class="arcade-catalog">${card}`);
};

const progressWithRabbit = progressPage;
progressPage = function () {
  return progressWithRabbit() + `<section class="arcade-progress"><div class="section-heading"><div><p class="eyebrow">${rt().eyebrow}</p><h2>${rt().progress}</h2></div><a class="text-link" href="#games/rabbit">${at().play}</a></div>${rabbitCollection(true)}</section>`;
};

const bindWithRabbit = bind;
bind = function (page, id) {
  bindWithRabbit(page, id);
  if (page !== "games" || id !== "rabbit") return;
  document.querySelectorAll("[data-rabbit]").forEach((button) => {
    button.onclick = () => {
      rabbitSession = { lesson: Number(button.dataset.rabbit), phase: "story", choice: null, checked: false, correct: false, justEarned: false, hearts: 3 };
      render();
    };
  });
  if ($("rabbitContinue")) $("rabbitContinue").onclick = () => {
    rabbitSession.phase = "question";
    render();
  };
  document.querySelectorAll("[data-rabbit-answer]").forEach((button) => {
    button.onclick = () => {
      rabbitSession.choice = Number(button.dataset.rabbitAnswer);
      rabbitSession.checked = false;
      render();
    };
  });
  if ($("rabbitCheck")) $("rabbitCheck").onclick = () => {
    const i = rabbitSession.lesson, correct = rabbitSession.choice === LESSONS[i].answer;
    rabbitSession.checked = true;
    rabbitSession.correct = correct;
    rabbitSession.justEarned = false;
    state.rabbit.answered[i] ??= { attempts: 0, correct: false };
    state.rabbit.answered[i].attempts++;
    if (correct && !state.rabbit.answered[i].correct) {
      state.rabbit.answered[i].correct = true;
      state.rabbit.pieces = Math.min(12, state.rabbit.pieces + 1);
      rabbitSession.justEarned = true;
      const skinIndex = Math.floor(state.rabbit.pieces / 4) - 1;
      if (state.rabbit.pieces % 4 === 0 && skinIndex >= 0 && !state.rabbit.skins.includes(skinIndex)) state.rabbit.skins.push(skinIndex);
    }
    if (correct) {
      state.rabbit.streak++;
      state.rabbit.bestStreak = Math.max(state.rabbit.bestStreak, state.rabbit.streak);
      state.rabbit.answered[i].stars = Math.max(Number(state.rabbit.answered[i].stars) || 0, Math.max(1, rabbitSession.hearts));
    } else {
      rabbitSession.hearts = Math.max(1, rabbitSession.hearts - 1);
      state.rabbit.streak = 0;
    }
    save();
    render();
    $("rabbitFeedback")?.focus();
  };
  const goBack = () => { rabbitSession = { lesson: null, phase: "story", choice: null, checked: false, correct: false, justEarned: false, hearts: 3 }; render(); };
  if ($("rabbitNext")) $("rabbitNext").onclick = goBack;
  if ($("rabbitBack")) $("rabbitBack").onclick = goBack;
};

window.addEventListener("hashchange", () => {
  if (route()[1] !== "rabbit") rabbitSession = { lesson: null, phase: "story", choice: null, checked: false, correct: false, justEarned: false, hearts: 3 };
});

render();
