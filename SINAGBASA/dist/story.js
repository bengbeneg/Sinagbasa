"use strict";
let storyState = null;
try {
  const raw = JSON.parse(localStorage.getItem(KEY) || "null")?.story;
  if (
    raw &&
    Number.isInteger(raw.chapter) &&
    STORY_CHAPTERS[raw.chapter] &&
    STORY_CHAPTERS[raw.chapter].nodes[raw.node]
  ) {
    storyState = {
      ...raw,
      complete: Array.isArray(raw.complete)
        ? raw.complete.filter((i) => Number.isInteger(i) && STORY_CHAPTERS[i])
        : [],
      trail: Array.isArray(raw.trail) ? raw.trail.slice(-60) : [],
      clues: Array.isArray(raw.clues)
        ? raw.clues.filter((k) => /^\d+:(start|follow|detour)$/.test(k))
        : [],
      line: Math.max(
        0,
        Math.min(
          Number(raw.line) || 0,
          STORY_CHAPTERS[raw.chapter].nodes[raw.node].lines.length,
        ),
      ),
      remaining: Math.max(0, Math.min(Number(raw.remaining) || 75000, 75000)),
      paused: false,
      mode: raw.mode === "relaxed" ? "relaxed" : "timed",
      resolve: Math.max(0, Math.min(Number(raw.resolve) || 3, 3)),
    };
  }
} catch {}
state.story = storyState;
let chosenStoryMode = storyState?.mode || "timed",
  storyTick = Date.now(),
  lastTimerSave = 0;
const st = () => STORY_TEXT[state.lang];
function freshStory(chapter = 0, complete = storyState?.complete || []) {
  return {
    chapter,
    node: "start",
    checkpoint: "start",
    line: 0,
    inspected: false,
    remaining: 75000,
    paused: false,
    mode: chosenStoryMode,
    resolve: 3,
    complete: [...complete],
    trail: [],
    clues: [],
    timeout: false,
    started: true,
  };
}
function saveStory() {
  state.story = storyState;
  save();
}
function sprite(i, extra = "") {
  return `<span class="pixel-character character-${i} ${extra}" role="img" aria-label="${CAST[i].name}"></span>`;
}
function storyFeatured() {
  const u = st();
  return `<a class="story-feature" href="#games/story"><div class="story-feature-copy"><p class="eyebrow">${L() ? "PAKIKIPAGSAPALARAN SA PAGBASA" : "A BRANCHING READING ADVENTURE"}</p><h2>${u.title}</h2><p>${u.subtitle}</p><span class="story-cta">${storyState ? u.continue : u.start} ＋</span><small>6 ${u.chapterCount} · ${L() ? "Mga pasya at bunga" : "Choices & consequences"} · EN / FIL</small></div><div class="feature-cast">${sprite(0)}${sprite(1)}</div></a>`;
}
function storyLanding() {
  const u = st(),
    l = L();
  return `<a class="text-link" href="#games">${u.back}</a><section class="story-intro"><div class="story-intro-copy"><p class="eyebrow">SINAGBASA · STORY CAMPAIGN</p><h1>${u.title}</h1><p>${u.subtitle}</p><p class="story-instructions">${u.reading}</p><div class="mode-select" role="group" aria-label="${u.mode}"><button data-mode="timed" aria-pressed="${chosenStoryMode === "timed"}" class="${chosenStoryMode === "timed" ? "selected" : ""}">${u.timed}</button><button data-mode="relaxed" aria-pressed="${chosenStoryMode === "relaxed"}" class="${chosenStoryMode === "relaxed" ? "selected" : ""}">${u.relaxed}</button></div><small>${u.modeHint}</small><button class="primary story-primary" id="storyBegin">${storyState?.started ? u.continue : u.start}</button></div><div class="intro-cast">${CAST.map((c, i) => `<div>${sprite(i)}<strong>${c.name}</strong><span>${c.role[l]}</span></div>`).join("")}</div></section><section class="story-chapter-list"><h2>${u.chapters}</h2><div class="story-chapters">${STORY_CHAPTERS.map((c, i) => `<button data-storychapter="${i}" ${i > 0 && !storyState?.complete.includes(i - 1) ? "disabled" : ""}><span>${storyState?.complete.includes(i) ? "✓" : String(i + 1).padStart(2, "0")}</span><strong>${c.title[l]}</strong><small>${i > 0 && !storyState?.complete.includes(i - 1) ? u.locked : c.objective[l]}</small></button>`).join("")}</div></section>`;
}
function activeStory() {
  const s = storyState,
    u = st(),
    l = L(),
    chapter = STORY_CHAPTERS[s.chapter],
    node = chapter.nodes[s.node];
  const dialogueDone = s.line >= node.lines.length;
  const choiceOpen =
    dialogueDone && (node.clue ? s.inspected : true) && node.kind === "scene";
  const currentLine = node.lines[Math.min(s.line, node.lines.length - 1)][l];
  return `<div class="adventure-toolbar"><a href="#games" class="text-link">${u.back}</a><span>${u.chapter} ${s.chapter + 1} / ${STORY_CHAPTERS.length}</span><button class="language" id="storyPause">${s.paused ? u.resume : u.pause}</button></div><section class="story-world ${s.node === "success" ? "world-success" : ""} ${s.node === "fail" ? "world-fail" : ""}"><div class="rain" aria-hidden="true"></div><div class="world-hud"><div><p>${u.mission}</p><strong>${chapter.objective[l]}</strong></div><div class="resolve"><small>${u.trust}</small><span aria-label="${s.resolve} / 3">${[0, 1, 2].map((i) => `<i class="${i < s.resolve ? "filled" : ""}">◆</i>`).join("")}</span></div>${s.mode === "timed" ? `<div class="clock ${s.remaining <= 15000 && choiceOpen ? "urgent" : ""}" id="storyClock" role="timer" aria-label="${u.timer}"><strong id="clockNumber">${choiceOpen ? Math.ceil(s.remaining / 1000) : "—"}</strong><small>${u.timer}</small></div>` : `<span class="story-mode-badge">${u.relaxed}</span>`}</div><div class="story-scene"><div class="scene-actors">${sprite(0, "investigator")}${sprite(node.speaker === 0 ? 1 : node.speaker, "speaker")}</div><div class="scene-title"><span>${u.chapter} ${String(s.chapter + 1).padStart(2, "0")}</span><h1>${chapter.title[l]}</h1></div></div><div class="dialogue-box"><div class="speaker-tag">${CAST[node.speaker].name}<span>${CAST[node.speaker].role[l]}</span></div><p class="dialogue-line" id="dialogueLine">${s.timeout && node.kind === "fail" ? u.timeoutBody : currentLine}</p><div class="dialogue-bottom"><span>${Math.min(s.line + 1, node.lines.length)} / ${node.lines.length}</span>${!dialogueDone ? `<button class="story-button" id="dialogueNext">${u.nextLine}</button>` : ""}</div></div></section><div class="story-bottom-grid"><section class="story-action-panel">${node.kind === "fail" && dialogueDone ? `<div class="story-outcome fail-outcome" role="status"><span>◇</span><h2>${s.timeout ? u.timeout : u.fail}</h2><p>${u.failExplain}</p><button class="story-button" id="storyRetry">${u.retry}</button></div>` : node.kind === "success" && dialogueDone ? `<div class="story-outcome success-outcome" role="status"><span>✺</span><h2>${s.chapter === STORY_CHAPTERS.length - 1 ? u.complete : u.success}</h2><p>${s.chapter === STORY_CHAPTERS.length - 1 ? u.completeBody : chapter.objective[l]}</p>${s.chapter < STORY_CHAPTERS.length - 1 ? `<button class="story-button" id="storyNext">${u.next}</button>` : `<a class="story-button" href="#progress">${T().progressLink}</a><button class="story-ghost" id="storyRestart">${u.restart}</button>`}</div>` : dialogueDone ? `<div class="clue-document"><p class="eyebrow">${u.checkpoint} · ${L() ? "PIYESA NG EBIDENSYA" : "EVIDENCE FILE"}</p><blockquote>${node.clue[l]}</blockquote>${!s.inspected ? `<button class="story-button" id="storyInspect">${u.inspect}</button>` : '<span class="collected">✓ ' + (l ? "Naitala sa journal" : "Added to journal") + "</span>"}</div>${choiceOpen ? `<h2 class="decision-heading">${u.decision}</h2><div class="branch-choices">${node.choices.map((c, i) => `<button data-storychoice="${i}" ${s.paused ? "disabled" : ""}><span>${String(i + 1).padStart(2, "0")}</span>${c.label[l]}</button>`).join("")}</div>` : ""}` : `<p class="await-dialogue">${u.reading}</p>`}</section><aside class="evidence-journal"><h2>${u.journal}</h2>${
    s.clues.length
      ? s.clues
          .map((key) => {
            const [ch, n] = key.split(":");
            const clue = STORY_CHAPTERS[Number(ch)]?.nodes[n]?.clue;
            return clue
              ? `<details ${Number(ch) === s.chapter ? "open" : ""}><summary>${STORY_CHAPTERS[Number(ch)].title[l]} · ${n === "follow" ? "02" : "01"}</summary><p>${clue[l]}</p></details>`
              : "";
          })
          .join("")
      : `<p>${u.empty}</p>`
  }<h3>${u.choiceLog}</h3>${
    s.trail.length
      ? `<ol>${s.trail
          .slice(-5)
          .map((item) => {
            const label =
              STORY_CHAPTERS[item.chapter]?.nodes[item.node]?.choices[
                item.choice
              ]?.label;
            return label ? `<li>${label[l]}</li>` : "";
          })
          .join("")}</ol>`
      : `<p>${u.noLog}</p>`
  }<small>${u.saved}</small></aside></div>${s.paused ? `<div class="story-pause-overlay" role="dialog" aria-modal="true" aria-label="${u.paused}"><div><span>Ⅱ</span><h2>${u.paused}</h2><button class="story-button" id="storyResume">${u.resume}</button></div></div>` : ""}`;
}
let showStoryLanding = true;
function storyPage() {
  return !storyState || showStoryLanding ? storyLanding() : activeStory();
}
function completeStoryNode() {
  const s = storyState,
    node = STORY_CHAPTERS[s.chapter].nodes[s.node];
  if (
    node.kind === "success" &&
    s.line >= node.lines.length &&
    !s.complete.includes(s.chapter)
  ) {
    s.complete.push(s.chapter);
    log("story", s.chapter);
    saveStory();
    celebrate("✺", st().success);
  }
}
function moveStory(to, cost = 0) {
  const s = storyState;
  s.resolve = Math.max(0, s.resolve - cost);
  s.node = to;
  s.line = 0;
  s.inspected = false;
  s.remaining = 75000;
  s.timeout = false;
  s.paused = false;
  storyTick = Date.now();
  if (to === "start" || to === "follow") s.checkpoint = to;
  saveStory();
  render();
  $("main").focus({ preventScroll: true });
}
function decideStory(i) {
  const s = storyState,
    node = STORY_CHAPTERS[s.chapter].nodes[s.node];
  if (
    s.paused ||
    s.line < node.lines.length ||
    !s.inspected ||
    node.kind !== "scene"
  )
    return;
  const c = node.choices[i];
  if (!c) return;
  s.trail.push({ chapter: s.chapter, node: s.node, choice: i });
  s.trail = s.trail.slice(-60);
  moveStory(c.to, c.cost);
}
function bindStory() {
  const u = st();
  const activeNode = storyState && STORY_CHAPTERS[storyState.chapter]?.nodes[storyState.node];
  const scene = document.querySelector(".story-scene");
  const clock = $("storyClock");
  const clockNumber = $("clockNumber");
  if (clock && clockNumber) {
    const clockLabel = clock.querySelector("small");
    if (activeNode?.kind === "scene") {
      clockNumber.textContent = Math.ceil(storyState.remaining / 1000);
      clock.classList.toggle("urgent", storyState.remaining <= 15000);
    } else if (activeNode?.kind === "fail") {
      clockNumber.textContent = storyState.timeout ? "0" : "×";
      if (clockLabel) clockLabel.textContent = storyState.timeout ? u.timerExpired : u.timerFailed;
      clock.classList.add("failed");
    } else if (activeNode?.kind === "success") {
      clockNumber.textContent = "✓";
      if (clockLabel) clockLabel.textContent = u.timerSecured;
    }
  }
  const displayedDialogue = $("dialogueLine")?.textContent || "";
  const displayedSpeaker = CAST.find((member) => displayedDialogue.startsWith(`${member.name}:`));
  const speakerTag = document.querySelector(".speaker-tag");
  if (displayedSpeaker && speakerTag) {
    speakerTag.firstChild.nodeValue = displayedSpeaker.name;
    const role = speakerTag.querySelector("span");
    if (role) role.textContent = displayedSpeaker.role[L()];
  }
  if (scene && activeNode?.image) {
    const consequenceArt = document.createElement("img");
    consequenceArt.className = "story-consequence-art";
    consequenceArt.src = activeNode.image;
    consequenceArt.alt = "";
    scene.prepend(consequenceArt);
  }
  document.querySelectorAll("[data-mode]").forEach(
    (b) =>
      (b.onclick = () => {
        chosenStoryMode = b.dataset.mode;
        render();
      }),
  );
  if ($("storyBegin"))
    $("storyBegin").onclick = () => {
      if (!storyState) storyState = freshStory();
      storyState.mode = chosenStoryMode;
      storyState.paused = false;
      showStoryLanding = false;
      storyTick = Date.now();
      saveStory();
      render();
    };
  document.querySelectorAll("[data-storychapter]").forEach(
    (b) =>
      (b.onclick = () => {
        const i = Number(b.dataset.storychapter);
        if (i > 0 && !storyState?.complete.includes(i - 1)) return;
        const prev = storyState;
        storyState = freshStory(i, prev?.complete || []);
        storyState.clues = prev?.clues || [];
        showStoryLanding = false;
        saveStory();
        render();
      }),
  );
  if ($("dialogueNext"))
    $("dialogueNext").onclick = () => {
      const s = storyState,
        node = STORY_CHAPTERS[s.chapter].nodes[s.node];
      s.line = Math.min(s.line + 1, node.lines.length);
      completeStoryNode();
      saveStory();
      render();
      $("dialogueNext")?.focus();
    };
  if ($("storyInspect"))
    $("storyInspect").onclick = () => {
      const s = storyState;
      s.inspected = true;
      const key = s.chapter + ":" + s.node;
      if (!s.clues.includes(key)) s.clues.push(key);
      storyTick = Date.now();
      saveStory();
      render();
      document.querySelector("[data-storychoice]")?.focus();
    };
  document
    .querySelectorAll("[data-storychoice]")
    .forEach(
      (b) => (b.onclick = () => decideStory(Number(b.dataset.storychoice))),
    );
  if ($("storyRetry"))
    $("storyRetry").onclick = () => {
      storyState.resolve = 3;
      moveStory(storyState.checkpoint);
    };
  if ($("storyNext"))
    $("storyNext").onclick = () => {
      if (!storyState.complete.includes(storyState.chapter)) return;
      const prev = storyState;
      storyState = freshStory(prev.chapter + 1, prev.complete);
      storyState.clues = prev.clues;
      storyState.trail = prev.trail;
      saveStory();
      render();
      window.scrollTo({ top: 0 });
    };
  if ($("storyRestart"))
    $("storyRestart").onclick = () => {
      storyState = freshStory(0, storyState.complete);
      showStoryLanding = false;
      saveStory();
      render();
    };
  function toggle() {
    storyState.paused = !storyState.paused;
    storyTick = Date.now();
    saveStory();
    render();
    if (storyState.paused) $("storyResume")?.focus();
    else $("storyPause")?.focus();
  }
  if ($("storyPause")) $("storyPause").onclick = toggle;
  if ($("storyResume")) $("storyResume").onclick = toggle;
}
function tickStory(now = Date.now()) {
  const s = storyState,
    delta = Math.max(0, Math.min(now - storyTick, 5000));
  storyTick = now;
  if (
    !s ||
    showStoryLanding ||
    route()[1] !== "story" ||
    s.paused ||
    document.hidden ||
    s.mode !== "timed"
  )
    return;
  const node = STORY_CHAPTERS[s.chapter].nodes[s.node];
  if (node.kind !== "scene") return;
  s.remaining = Math.max(0, s.remaining - delta);
  if ($("clockNumber"))
    $("clockNumber").textContent = Math.ceil(s.remaining / 1000);
  $("storyClock")?.classList.toggle("urgent", s.remaining <= 15000);
  if (now - lastTimerSave > 5000) {
    saveStory();
    lastTimerSave = now;
  }
  if (s.remaining <= 0) {
    s.node = "fail";
    s.line = 0;
    s.inspected = false;
    s.timeout = true;
    s.resolve = Math.max(0, s.resolve - 1);
    saveStory();
    render();
  }
}
setInterval(() => tickStory(), 250);
document.addEventListener("visibilitychange", () => {
  storyTick = Date.now();
  if (storyState) saveStory();
});
const gamesWithStory = gamesPage;
gamesPage = function (id) {
  if (id === "story") return storyPage();
  const result = gamesWithStory(id);
  return id === undefined ? storyFeatured() + result : result;
};
const bindWithStory = bind;
bind = function (page, id) {
  bindWithStory(page, id);
  if (page === "games" && id === "story") bindStory();
};
const homeBeforeStory = home;
home = function () {
  return homeBeforeStory().replace(
    '<section class="hero">',
    `${storyFeatured()}<section class="hero">`,
  );
};
const progressBeforeStory = progressPage;
progressPage = function () {
  const u = st();
  return (
    progressBeforeStory() +
    `<section class="story-progress"><div class="story-progress-copy"><span class="eyebrow">STORY CAMPAIGN</span><h2>${u.title}</h2><p>${storyState?.complete.length || 0} / ${STORY_CHAPTERS.length} ${L() ? "kabanatang natapos" : "chapters completed"}</p><div class="track"><div style="width:${((storyState?.complete.length || 0) / STORY_CHAPTERS.length) * 100}%"></div></div><a class="primary" href="#games/story">${u.continue}</a></div><div class="story-progress-visual" aria-label="${L() ? "Sina Mika at Alex sa bayan" : "Mika and Alex in town"}">${sprite(0)}${sprite(1)}</div></section>`
  );
};
window.addEventListener("hashchange", () => {
  storyTick = Date.now();
  showStoryLanding = true;
  if (storyState) saveStory();
  render();
});
render();
document.addEventListener("keydown", (e) => {
  if (route()[1] === "story" && storyState?.paused) {
    if (e.key === "Tab") {
      e.preventDefault();
      $("storyResume")?.focus();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      $("storyResume")?.click();
    }
  }
});
let storySoundEnabled = false,
  storyAudio = null,
  lastSoundSecond = -1;
function storyTone(kind = "radio") {
  if (!storySoundEnabled) return;
  try {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    storyAudio ??= new AudioCtor();
    storyAudio.resume();
    const notes =
      kind === "success"
        ? [440, 554, 659]
        : kind === "fail"
          ? [220, 165]
          : [620];
    notes.forEach((hz, i) => {
      const osc = storyAudio.createOscillator(),
        gain = storyAudio.createGain(),
        time = storyAudio.currentTime + i * 0.1;
      osc.type = "square";
      osc.frequency.value = hz;
      gain.gain.setValueAtTime(0.025, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);
      osc.connect(gain);
      gain.connect(storyAudio.destination);
      osc.start(time);
      osc.stop(time + 0.1);
    });
  } catch {}
}
const activeStoryWithSound = activeStory;
activeStory = function () {
  return activeStoryWithSound().replace(
    '<button class="language" id="storyPause">',
    `<button class="language" id="storySound" aria-pressed="${storySoundEnabled}">${st().sound}: ${storySoundEnabled ? "ON" : "OFF"}</button><button class="language" id="storyPause">`,
  );
};
const bindStoryWithSound = bindStory;
bindStory = function () {
  bindStoryWithSound();
  if ($("storySound"))
    $("storySound").onclick = () => {
      storySoundEnabled = !storySoundEnabled;
      storyTone();
      render();
    };
  if ($("dialogueNext")) {
    const fn = $("dialogueNext").onclick;
    $("dialogueNext").onclick = () => {
      storyTone();
      fn();
    };
  }
  document.querySelectorAll("[data-storychoice]").forEach((b) => {
    const fn = b.onclick;
    b.onclick = () => {
      fn();
      storyTone(
        storyState.node === "fail"
          ? "fail"
          : storyState.node === "success"
            ? "success"
            : "radio",
      );
    };
  });
};
const tickStoryWithSound = tickStory;
tickStory = function (now = Date.now()) {
  tickStoryWithSound(now);
  const s = storyState;
  if (
    s &&
    route()[1] === "story" &&
    !showStoryLanding &&
    !s.paused &&
    !document.hidden &&
    s.mode === "timed" &&
    STORY_CHAPTERS[s.chapter].nodes[s.node].kind === "scene"
  ) {
    const sec = Math.ceil(s.remaining / 1000);
    if (sec > 0 && sec <= 10 && sec !== lastSoundSecond) {
      lastSoundSecond = sec;
      storyTone("radio");
    }
  }
};
render();
