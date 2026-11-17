"use strict";
state.arcade =
  state.arcade && typeof state.arcade === "object" ? state.arcade : {};
// Recover additional game results without changing the original platform storage identity.
try {
  const saved = JSON.parse(localStorage.getItem(KEY) || "null");
  if (saved?.arcade && typeof saved.arcade === "object")
    state.arcade = saved.arcade;
} catch {}
const AUI = {
  en: {
    eyebrow: "THE READING ARCADE",
    heading: "More ways to read. More ways to play.",
    sub: "Dispatch supplies, repair stories, investigate clues, and discover word meanings. Choose a challenge and take your time.",
    play: "Play game",
    resume: "Continue game",
    round: "Round",
    of: "of",
    read: "Read the passage. Keep it open while you solve the challenge.",
    sequence: "Rebuild the timeline",
    sequenceHint:
      "Move each card up or down. You can also drag cards into place.",
    up: "Move up",
    down: "Move down",
    check: "Check my work",
    claim: "Choose your conclusion",
    pin: "Pin the evidence",
    context: "Follow the word clues",
    next: "Next round",
    done: "Game complete!",
    again: "Play from the beginning",
    success: "Challenge solved!",
    retry: "Some pieces need another look.",
    overview: "All games",
    rounds: "rounds",
    roundsDone: "Rounds solved",
    none: "No rounds completed yet. Choose a game to start.",
    progress: "Game collection",
    first: "First-attempt score",
    complete: "Completed",
    review: "Review the passage",
    matches: "correct positions",
    choices: "correct choices",
    reveal: "Show reading hint",
    hint: "Reread the passage and look for time markers, cause-and-effect clues, or the sentence that explains your choice.",
    ready: "Make all your choices before checking.",
    restart: "Restart this playthrough?",
    earned: "All rounds solved. Your progress has been saved.",
    dispatch: "Sinag Dispatch",
    dispatchSub:
      "Read community requests, select supplies, and bring light to three locations.",
    dispatchSkill: "Details · Inference · Prioritizing",
    answered: "Questions answered",
    delivery: "Dispatch successful",
    debrief: "Read a little deeper",
    debriefHint:
      "Two extra questions about the request. These practice answers do not affect mission unlocking.",
    checkDebrief: "Check these answers",
  },
  fil: {
    eyebrow: "MGA LARO SA PAGBASA",
    heading: "Mas maraming paraan ng pagbasa at paglalaro.",
    sub: "Maghatid ng suplay, ayusin ang kuwento, siyasatin ang pahiwatig, at tuklasin ang salita. Pumili ng laro at magbasa sa sariling bilis.",
    play: "Laruin",
    resume: "Ipagpatuloy",
    round: "Yugto",
    of: "sa",
    read: "Basahin ang sipi. Maaari itong balikan habang sumasagot.",
    sequence: "Ayusin ang pagkakasunod",
    sequenceHint:
      "Ilipat ang bawat card pataas o pababa. Maaari ring i-drag ang mga card.",
    up: "Ilipat pataas",
    down: "Ilipat pababa",
    check: "Suriin ang sagot",
    claim: "Piliin ang iyong konklusyon",
    pin: "Tukuyin ang ebidensya",
    context: "Sundan ang mga pahiwatig",
    next: "Susunod na yugto",
    done: "Natapos ang laro!",
    again: "Laruin mula sa simula",
    success: "Nalutas ang hamon!",
    retry: "May kailangan pang balikan.",
    overview: "Lahat ng laro",
    rounds: "yugto",
    roundsDone: "Mga yugtong nalutas",
    none: "Wala pang natapos na yugto. Pumili ng laro.",
    progress: "Koleksyon ng mga laro",
    first: "Resulta sa unang pagsubok",
    complete: "Natapos",
    review: "Balikan ang sipi",
    matches: "tamang puwesto",
    choices: "tamang sagot",
    reveal: "Ipakita ang pahiwatig",
    hint: "Balikan ang teksto at hanapin ang pagkakasunod, sanhi at bunga, o pangungusap na nagpapaliwanag sa iyong pasya.",
    ready: "Kumpletuhin ang pagpili bago suriin.",
    restart: "Simulan muli ang larong ito?",
    earned: "Natapos ang lahat ng yugto. Naka-save na ang progreso.",
    dispatch: "Sinag Dispatch",
    dispatchSub:
      "Basahin ang kahilingan, piliin ang suplay, at magbigay-liwanag sa tatlong lugar.",
    dispatchSkill: "Detalye · Paghihinuha · Pag-una",
    answered: "Mga tanong na nasagutan",
    delivery: "Matagumpay na paghahatid",
    debrief: "Palalimin ang pag-unawa",
    debriefHint:
      "Dalawang dagdag na tanong. Hindi nito binabago ang pagbubukas ng misyon.",
    checkDebrief: "Suriin ang mga sagot",
  },
};
const at = () => AUI[state.lang];
let arcadeSession = null,
  dragFrom = null;
function createSession(game) {
  const records = state.arcade[game.id] || {};
  const firstOpen = game.rounds.findIndex((_, i) => !records[i]?.complete);
  return {
    id: game.id,
    round: firstOpen < 0 ? 0 : firstOpen,
    order: [2, 0, 3, 1],
    answers: {},
    claim: null,
    pin: null,
    checked: false,
    solved: false,
    score: 0,
    hint: false,
    hintUsed: false,
  };
}
function arcadeReady(game) {
  return game.id === "sequence" || game.id === "detective"
    ? game.id === "sequence" ||
        (arcadeSession.claim !== null && arcadeSession.pin !== null)
    : game.rounds[arcadeSession.round].questions.every((_, i) =>
        Number.isInteger(arcadeSession.answers[i]),
      );
}
function arcadeCatalog() {
  const u = at(),
    l = L();
  return (
    title(u.eyebrow, u.heading, u.sub) +
    `<div class="arcade-catalog"><a class="arcade-card dispatch-theme" href="#games/dispatch"><div class="arcade-card-top"><span class="arcade-emblem">✺</span><span class="pill">${MISSIONS.length} ${u.rounds}</span></div><p class="eyebrow">${u.dispatchSkill}</p><h2>${u.dispatch}</h2><p>${u.dispatchSub}</p><div class="arcade-card-foot"><span>${completedMissions()} / ${MISSIONS.length} ${u.roundsDone}</span><strong>${u.play} ＋</strong></div></a>${ARCADE.map(
      (g) => {
        const n = g.rounds.filter(
          (_, i) => state.arcade[g.id]?.[i]?.complete,
        ).length;
        return `<a class="arcade-card ${g.theme}-theme" href="#games/${g.id}"><div class="arcade-card-top"><span class="arcade-emblem">${g.icon}</span><span class="pill">${g.rounds.length} ${u.rounds}</span></div><p class="eyebrow">${g.skill[l]}</p><h2>${g.name[l]}</h2><p>${g.desc[l]}</p><div class="arcade-card-foot"><span>${n} / ${g.rounds.length} ${u.roundsDone}</span><strong>${n ? u.resume : u.play} ＋</strong></div></a>`;
      },
    ).join("")}</div>`
  );
}
function arcadePage(game) {
  if (!arcadeSession || arcadeSession.id !== game.id)
    arcadeSession = createSession(game);
  const s = arcadeSession,
    r = game.rounds[s.round],
    u = at(),
    l = L();
  const passage =
    game.id === "detective" ? r.sentences[l].join(" ") : r.passage[l];
  const record = state.arcade[game.id]?.[s.round];
  const total =
    game.id === "sequence"
      ? 4
      : game.id === "detective"
        ? 2
        : r.questions.length;
  return `<div class="arcade-top"><a class="text-link" href="#games">${u.overview}</a><span class="pill">${game.skill[l]}</span></div><section class="arcade-stage ${game.theme}-theme"><div class="arcade-stage-head"><div><p class="eyebrow">${game.name[l]}</p><h1>${r.title[l]}</h1></div><div class="round-meter"><strong>0${s.round + 1}</strong><span>${u.round} ${s.round + 1} ${u.of} ${game.rounds.length}</span></div></div><div class="round-path">${game.rounds.map((_, i) => `<span class="${i === s.round ? "current" : ""} ${state.arcade[game.id]?.[i]?.complete ? "complete" : ""}">${state.arcade[game.id]?.[i]?.complete ? "✓" : i + 1}</span>`).join("")}</div><div class="arcade-playarea"><aside class="case-file"><p class="eyebrow">${u.review}</p><p class="muted">${u.read}</p><article class="case-passage">${passage}</article><button class="hint-button" id="hint">${u.reveal}</button>${s.hint ? `<div class="hint-copy">${u.hint}</div>` : ""}<div class="case-stats"><span>${u.first}</span><strong>${Number.isInteger(record?.first) ? record.first + " / " + total : "—"}</strong></div></aside><section class="challenge"><h2>${game.id === "sequence" ? u.sequence : game.id === "detective" ? u.claim : u.context}</h2>${game.id === "sequence" ? `<p class="muted">${u.sequenceHint}</p><div class="timeline" id="timeline">${s.order.map((event, i) => `<div class="timeline-card ${s.checked ? (event === i ? "correct-card" : "wrong-card") : ""}" draggable="${!s.solved}" data-drag="${i}"><span class="timeline-number">${i + 1}</span><p>${r.events[l][event]}</p><div class="move-controls"><button data-move="${i}:up" aria-label="${u.up}: ${r.events[l][event]}" ${i === 0 || s.solved ? "disabled" : ""}>↑</button><button data-move="${i}:down" aria-label="${u.down}: ${r.events[l][event]}" ${i === 3 || s.solved ? "disabled" : ""}>↓</button></div></div>`).join("")}</div>` : game.id === "detective" ? `<p class="detective-question">${r.question[l]}</p><div class="option-list">${r.options[l].map((o, i) => `<button class="option ${s.claim === i ? "selected" : ""}" data-claim="${i}" aria-pressed="${s.claim === i}" ${s.solved ? "disabled" : ""}><span>${"ABC"[i]}</span>${o}</button>`).join("")}</div><h3 class="pin-title">${u.pin}</h3><div class="evidence-board">${r.sentences[l].map((text, i) => `<button class="clue-card ${s.pin === i ? "pinned" : ""}" data-pin="${i}" aria-pressed="${s.pin === i}" ${s.solved ? "disabled" : ""}><span class="clue-tag">${"ABCD"[i]}</span><p>${text}</p><span class="pin-label">${s.pin === i ? "●" : "○"}</span></button>`).join("")}</div>` : `<div class="word-challenges">${r.questions.map((q, i) => `<div class="word-question"><span class="word-tag">${q.word[l]}</span><h3>${i + 1}. ${q.q[l]}</h3><div class="word-options">${q.options[l].map((o, n) => `<button class="${s.answers[i] === n ? "selected" : ""}" data-word="${i}:${n}" aria-pressed="${s.answers[i] === n}" ${s.solved ? "disabled" : ""}>${o}</button>`).join("")}</div>${s.checked ? `<p class="word-explanation ${s.answers[i] === q.answer ? "right" : "incorrect"}">${s.answers[i] === q.answer ? "✓" : "○"} ${q.why[l]}</p>` : ""}</div>`).join("")}</div>`}<div class="challenge-footer"><span>${s.solved ? u.success : u.ready}</span><button class="primary" id="arcadeCheck" ${!arcadeReady(game) || s.solved ? "disabled" : ""}>${u.check}</button></div>${s.checked ? `<div class="feedback ${s.solved ? "success" : ""}" role="status" id="arcadeFeedback" tabindex="-1"><strong>${s.solved ? u.success : u.retry}</strong><p>${s.score} / ${total} ${game.id === "sequence" ? u.matches : u.choices}</p>${["sequence", "detective"].includes(game.id) ? `<p>${r.why[l]}</p>` : ""}${s.solved ? `<div class="actions">${s.round < game.rounds.length - 1 ? `<button class="primary" id="arcadeNext">${u.next}</button>` : `<a class="primary" href="#progress">${T().progressLink}</a><button class="secondary" id="arcadeRestart">${u.again}</button>`}</div>${s.round === game.rounds.length - 1 ? `<p>${u.earned}</p>` : ""}` : ""}</div>` : ""}</section></div></section>`;
}
function bindArcade(game) {
  if (!game) return;
  const s = arcadeSession;
  function change() {
    s.checked = false;
    s.solved = false;
    render();
  }
  document.querySelectorAll("[data-move]").forEach(
    (b) =>
      (b.onclick = () => {
        const [i, dir] = b.dataset.move.split(":");
        const from = Number(i),
          to = from + (dir === "up" ? -1 : 1);
        if (to < 0 || to >= s.order.length || s.solved) return;
        [s.order[from], s.order[to]] = [s.order[to], s.order[from]];
        change();
        document.querySelector(`[data-move="${to}:${dir}"]`)?.focus();
      }),
  );
  document.querySelectorAll("[data-drag]").forEach((card) => {
    card.ondragstart = (e) => {
      if (s.solved) {
        e.preventDefault();
        return;
      }
      dragFrom = Number(card.dataset.drag);
      e.dataTransfer.setData("text/plain", String(dragFrom));
      e.dataTransfer.effectAllowed = "move";
    };
    card.ondragover = (e) => e.preventDefault();
    card.ondrop = (e) => {
      e.preventDefault();
      const to = Number(card.dataset.drag);
      if (s.solved || dragFrom === null) return;
      const [moved] = s.order.splice(dragFrom, 1);
      s.order.splice(to, 0, moved);
      dragFrom = null;
      change();
    };
    card.ondragend = () => (dragFrom = null);
  });
  document.querySelectorAll("[data-claim]").forEach(
    (b) =>
      (b.onclick = () => {
        s.claim = Number(b.dataset.claim);
        change();
      }),
  );
  document.querySelectorAll("[data-pin]").forEach(
    (b) =>
      (b.onclick = () => {
        s.pin = Number(b.dataset.pin);
        change();
      }),
  );
  document.querySelectorAll("[data-word]").forEach(
    (b) =>
      (b.onclick = () => {
        const [i, n] = b.dataset.word.split(":").map(Number);
        s.answers[i] = n;
        change();
      }),
  );
  if ($("hint"))
    $("hint").onclick = () => {
      s.hint = !s.hint;
      if (s.hint) s.hintUsed = true;
      render();
    };
  if ($("arcadeCheck"))
    $("arcadeCheck").onclick = () => {
      if (s.solved || !arcadeReady(game)) return;
      const r = game.rounds[s.round];
      const total =
        game.id === "sequence"
          ? 4
          : game.id === "detective"
            ? 2
            : r.questions.length;
      s.score =
        game.id === "sequence"
          ? s.order.filter((event, i) => event === i).length
          : game.id === "detective"
            ? Number(s.claim === r.answer) + Number(s.pin === r.evidence)
            : r.questions.filter((q, i) => s.answers[i] === q.answer).length;
      s.checked = true;
      s.solved = s.score === total;
      state.arcade[game.id] ??= {};
      const record = state.arcade[game.id][s.round] ?? {
        attempts: 0,
        first: null,
        complete: false,
        total,
      };
      record.attempts++;
      if (record.first === null) record.first = s.score;
      if (s.solved)
        record.stars = Math.max(
          Number(record.stars) || 0,
          record.attempts === 1 && !s.hintUsed
            ? 3
            : record.attempts <= 2
              ? 2
              : 1,
        );
      if (s.solved && !record.complete) {
        record.complete = true;
        log("arcade", game.id);
      }
      state.arcade[game.id][s.round] = record;
      save();
      render();
      $("arcadeFeedback")?.focus();
    };
  if ($("arcadeNext"))
    $("arcadeNext").onclick = () => {
      s.round++;
      s.order = [2, 0, 3, 1];
      s.answers = {};
      s.claim = null;
      s.pin = null;
      s.checked = false;
      s.solved = false;
      s.hint = false;
      render();
      $("main").focus({ preventScroll: true });
      window.scrollTo({ top: 0 });
    };
  if ($("arcadeRestart"))
    $("arcadeRestart").onclick = () => {
      arcadeSession = createSession(game);
      arcadeSession.round = 0;
      render();
    };
}
function arcadeProgress() {
  const u = at(),
    l = L();
  return `<section class="arcade-progress"><div class="section-heading"><div><p class="eyebrow">${u.eyebrow}</p><h2>${u.progress}</h2></div><a class="text-link" href="#games">${u.overview}</a></div><div class="arcade-progress-grid">${ARCADE.map(
    (g) => {
      const rounds = Object.values(state.arcade[g.id] || {});
      const solved = g.rounds.filter(
        (_, i) => state.arcade[g.id]?.[i]?.complete,
      ).length;
      const first = rounds.filter((r) => Number.isInteger(r.first));
      const score = first.length
        ? Math.round(
            (first.reduce((sum, r) => sum + r.first, 0) /
              first.reduce((sum, r) => sum + r.total, 0)) *
              100,
          ) + "%"
        : "—";
      return `<a class="arcade-progress-card ${g.theme}-theme" href="#games/${g.id}"><span class="arcade-emblem">${g.icon}</span><h3>${g.name[l]}</h3><p>${solved} / ${g.rounds.length} ${u.roundsDone}</p><div class="track"><div style="width:${(solved / g.rounds.length) * 100}%"></div></div><small>${u.first}: ${score}</small></a>`;
    },
  ).join("")}</div></section>`;
}
const originalGamesPage = gamesPage;
gamesPage = function (id) {
  if (id === undefined) return arcadeCatalog();
  if (id === "dispatch")
    return (
      `<a class="text-link" href="#games">${at().overview}</a>` +
      originalGamesPage()
    );
  const game = ARCADE.find((g) => g.id === id);
  return game ? arcadePage(game) : originalGamesPage(id);
};
const originalProgressPage = progressPage;
progressPage = function () {
  return originalProgressPage() + arcadeProgress();
};
const originalBind = bind;
bind = function (page, id) {
  originalBind(page, id);
  if (page === "games") bindArcade(ARCADE.find((g) => g.id === id));
};
window.addEventListener("hashchange", () => {
  arcadeSession = null;
  render();
});
render();
let debriefSelections = {},
  debriefChecked = false;
function debriefView(i) {
  const u = at(),
    l = L();
  return `<section class="debrief"><details><summary>${u.debrief}<span>＋</span></summary><p class="muted">${u.debriefHint}</p>${DEBRIEF[i].map((q, n) => `<div class="word-question"><h3>${n + 1}. ${q.q[l]}</h3><div class="word-options">${q.options[l].map((o, j) => `<button data-debrief="${n}:${j}" class="${debriefSelections[n] === j ? "selected" : ""}" aria-pressed="${debriefSelections[n] === j}">${o}</button>`).join("")}</div>${debriefChecked ? `<p class="word-explanation ${debriefSelections[n] === q.answer ? "right" : "incorrect"}">${debriefSelections[n] === q.answer ? "✓" : "○"} ${q.why[l]}</p>` : ""}</div>`).join("")}<button class="primary" id="debriefCheck" ${DEBRIEF[i].every((_, n) => Number.isInteger(debriefSelections[n])) ? "" : "disabled"}>${u.checkDebrief}</button><div id="debriefStatus" role="status" class="muted">${debriefChecked ? DEBRIEF[i].filter((q, n) => q.answer === debriefSelections[n]).length + " / 2 " + u.choices : ""}</div></details></section>`;
}
const gamePageWithArcade = gamesPage;
gamesPage = function (id) {
  const html = gamePageWithArcade(id);
  const i = Number(id);
  return id !== undefined &&
    id !== "" &&
    Number.isInteger(i) &&
    MISSIONS[i] &&
    allowed(i)
    ? html + debriefView(i)
    : html;
};
const bindWithArcade = bind;
bind = function (page, id) {
  bindWithArcade(page, id);
  document.querySelectorAll("[data-debrief]").forEach(
    (b) =>
      (b.onclick = () => {
        const [q, a] = b.dataset.debrief.split(":").map(Number);
        debriefSelections[q] = a;
        debriefChecked = false;
        render();
        document.querySelector(".debrief details").open = true;
      }),
  );
  if ($("debriefCheck"))
    $("debriefCheck").onclick = () => {
      debriefChecked = true;
      render();
      document.querySelector(".debrief details").open = true;
      $("debriefStatus").scrollIntoView({ block: "nearest" });
    };
};
window.addEventListener("hashchange", () => {
  debriefSelections = {};
  debriefChecked = false;
  render();
});
render();
const originalHome = home;
home = function () {
  return (
    originalHome() +
    `<section class="section"><div class="section-heading"><div><p class="eyebrow">${at().eyebrow}</p><h2>${L() ? "Piliin ang susunod mong hamon." : "Choose your next challenge."}</h2></div><a class="text-link" href="#games">${at().overview}</a></div><div class="arcade-progress-grid">${ARCADE.map((g) => `<a class="arcade-progress-card ${g.theme}-theme" href="#games/${g.id}"><span class="arcade-emblem">${g.icon}</span><h3>${g.name[L()]}</h3><p>${g.desc[L()]}</p><strong class="text-link">${at().play}</strong></a>`).join("")}</div></section>`
  );
};
render();
