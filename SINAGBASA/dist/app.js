"use strict";
const KEY = "sinagbasa-platform-v2";
let state = { lang: "en", lessons: [], lessonProgress: {}, missions: {}, customGames: {}, activity: [] },
  storageOK = true;
try {
  const raw = JSON.parse(localStorage.getItem(KEY) || "null");
  if (
    raw &&
    ["en", "fil"].includes(raw.lang) &&
    Array.isArray(raw.lessons) &&
    raw.missions &&
    typeof raw.missions === "object" &&
    Array.isArray(raw.activity)
  )
    state = {
      lang: raw.lang,
      lessons: raw.lessons.filter(
        (x) => Number.isInteger(x) && x >= 0 && x < LESSONS.length,
      ),
      lessonProgress: raw.lessonProgress && typeof raw.lessonProgress === "object" ? raw.lessonProgress : {},
      missions: raw.missions,
      customGames: raw.customGames && typeof raw.customGames === "object" ? raw.customGames : {},
      activity: raw.activity.slice(0, 30),
    };
  const old = JSON.parse(localStorage.getItem("sinag-dispatch-v1") || "null");
  if (!raw && old) {
    state.lang = old.lang === "fil" ? "fil" : "en";
    if (old.completed)
      state.missions[0] = { complete: true, attempts: 0, first: null };
  }
} catch {
  storageOK = false;
}
const $ = (id) => document.getElementById(id);
const L = () => (state.lang === "fil" ? 1 : 0);
const T = () => UI[state.lang];
const locIds = ["gym", "health", "hall"],
  supIds = ["food", "water", "blankets"];
let selected = { location: null, supply: null, evidence: null },
  quizChoice = null,
  quizChecked = false,
  quizCorrect = false;
let currentRoute = "";
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    storageOK = false;
  }
  if ($("storageText"))
    $("storageText").textContent = T()[storageOK ? "local" : "unavailable"];
}
function log(type, id) {
  state.activity.unshift({ type, id, time: new Date().toISOString() });
  state.activity = state.activity.slice(0, 30);
}
const completedMissions = () =>
  MISSIONS.filter((_, i) => state.missions[i]?.complete).length;
function allowed(i) {
  return i === 0 || state.missions[i - 1]?.complete === true;
}
function route() {
  return (location.hash.slice(1) || "home").split("/");
}
function header() {
  const t = T();
  const navIcons = ["⌂", "≡", "◆", "▥"];
  $("nav").innerHTML = ["home", "lessons", "games", "progress"]
    .map(
      (r, i) =>
        `<a href="#${r}" title="${t.nav[i]}" aria-label="${t.nav[i]}" data-label="${t.nav[i]}" ${route()[0] === r ? 'aria-current="page"' : ""}><span class="side-icon" aria-hidden="true">${navIcons[i]}</span><span class="side-label">${t.nav[i]}</span></a>`,
    )
    .join("");
  $("language").innerHTML = `<span class="side-icon" aria-hidden="true">文</span><span class="side-label">${t.lang}</span>`;
  $("language").title = t.lang;
  document.documentElement.lang = state.lang;
  $("footerText").textContent = t.footer;
  $("storageText").textContent = t[storageOK ? "local" : "unavailable"];
}
function title(eyebrow, heading, sub) {
  return `<div class="page-title"><p class="eyebrow">${eyebrow}</p><h1>${heading}</h1><p>${sub}</p></div>`;
}
function lessonCards() {
  const t = T(),
    l = L();
  return LESSONS.slice(0, 3)
    .map(
      (lesson, i) =>
        `<a class="lesson-card color-${i}" href="#lessons/${i}"><div class="card-top"><span class="number">0${i + 1}</span><span class="pill">${state.lessons.includes(i) ? "✓ " + t.completed : t.minutes}</span></div><div class="lesson-icon">${["≡", "∴", "⇄"][i % 3]}</div><p class="eyebrow">${lesson.skill[l]}</p><h3>${lesson.title[l]}</h3><p>${lesson.desc[l]}</p><span class="card-link">${state.lessons.includes(i) ? t.review : t.open} <span aria-hidden="true">＋</span></span></a>`,
    )
    .join("");
}
function home() {
  const t = T();
  const l = L();
  const totalProgress = state.lessons.length + completedMissions();
  const totalActivities = LESSONS.length + MISSIONS.length;

  return `
    <div class="home-page">
    <section class="home-introduction" aria-labelledby="homeIntroductionTitle">
      <p class="eyebrow">${l ? "MATUTO · MAGLARO · UMUNLAD" : "LEARN · PLAY · GROW"}</p>
      <h2 id="homeIntroductionTitle">${l ? "Maligayang pagdating sa SINAGBASA!" : "Welcome to SINAGBASA!"}</h2>
      <p class="home-introduction-copy">${l ? "Nilikha ang SINAGBASA para sa mga mag-aaral ng Grade 12 sa Tagaytay City Science National High School ISHS upang suportahan ang pag-unawa sa binabasa sa English at Filipino." : "SINAGBASA was created for Grade 12 students at Tagaytay City Science National High School - ISHS to support reading comprehension in English and Filipino."}</p>
      <p class="home-introduction-copy">${l ? "Ang ideya: gawing aktibo at kawili-wili ang pagbasa sa pamamagitan ng mga aralin, laro, at interaktibong kuwento. Layunin nitong palakasin ang pag-unawa sa pangunahing ideya, pagbuo ng hinuha, at kumpiyansa sa pagbasa." : "The idea: make reading active and engaging through lessons, games, and interactive stories. The goal is stronger understanding of main ideas, better inference skills, and greater reading confidence."}</p>
      <p class="home-introduction-copy">${l ? "Bakit ito mahalaga? Sa PISA 2022, 24% lamang ng mga 15-taong-gulang na mag-aaral sa Pilipinas ang umabot sa Level 2 o mas mataas sa pagbasa." : "Why it matters: in PISA 2022, only 24% of 15-year-old students in the Philippines reached Level 2 or higher in reading."} <a class="home-introduction-source" href="https://www.oecd.org/en/publications/pisa-2022-results-volume-i-and-ii-country-notes_ed6fbcc5-en/philippines_a0882a2d-en.html" target="_blank" rel="noopener noreferrer">OECD</a> ? <a class="home-introduction-source" href="https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/reading-comprehension-strategies" target="_blank" rel="noopener noreferrer">${l ? "Ebidensya sa mga estratehiya sa pag-unawa (EEF)" : "Evidence on comprehension strategies (EEF)"}</a></p>
      <nav class="home-introduction-links" aria-label="${l ? "Mga mabilisang link sa pag-aaral" : "Learning shortcuts"}">
        <div class="home-introduction-shortcut">
          <a class="primary" href="#lessons" aria-describedby="introLessons">${l ? "Simulan ang mga aralin" : "Start learning"} &rarr;</a>
          <p id="introLessons">${l ? "Matuto sa mga gabay na aralin at halimbawa." : "Build reading skills with guided lessons and examples."}</p>
        </div>
        <div class="home-introduction-shortcut">
          <a class="secondary" href="#games" aria-describedby="introGames">${l ? "Maglaro at magsanay" : "Play and practice"} &rarr;</a>
          <p id="introGames">${l ? "Magsanay sa mga laro at interaktibong kuwento." : "Practice through games and interactive stories."}</p>
        </div>
        <div class="home-introduction-shortcut">
          <a class="secondary" href="#library" aria-describedby="introLibrary">${l ? "Buksan ang aklatan" : "Explore the library"} &rarr;</a>
          <p id="introLibrary">${l ? "Tuklasin ang mga babasahing ibinahagi ng iyong guro." : "Explore reading materials shared by your teacher."}</p>
        </div>
        <div class="home-introduction-shortcut">
          <a class="secondary" href="#progress" aria-describedby="introProgress">${l ? "Tingnan ang progreso" : "View my progress"} &rarr;</a>
          <p id="introProgress">${l ? "Tingnan ang mga natapos na aralin at misyon." : "See your completed lessons and missions."}</p>
        </div>
      </nav>
    </section>
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">${t.welcome}</p>
        <h1>${t.hero.replace("\n", "<br>")}</h1>
        <p>${t.sub}</p>
        <div class="actions">
          <a class="primary" href="#lessons">${t.start}</a>
          <a class="secondary" href="#games">${t.nav[2]}</a>
        </div>
        <div class="hero-meta"><span>EN / FIL</span><span>GRADE 12</span><span>SELF-PACED</span></div>
      </div>
      <div class="journey-panel">
        <div class="panel-label"><span>✺</span> ${t.journey}</div>
        <div class="journey-step"><span class="step-number">01</span><div><strong>${t.nav[1]}</strong><p>${state.lessons.length} / ${LESSONS.length} ${t.completed.toLowerCase()}</p></div><span class="step-symbol">≡</span></div>
        <div class="journey-step"><span class="step-number">02</span><div><strong>${t.nav[2]}</strong><p>${completedMissions()} / ${MISSIONS.length} ${t.missionsCount.toLowerCase()}</p></div><span class="step-symbol">◎</span></div>
        <div class="journey-step"><span class="step-number">03</span><div><strong>${t.nav[3]}</strong><p>${t.progressSub}</p></div><span class="step-symbol">▥</span></div>
        <div class="panel-bottom"><span>${totalProgress} / ${totalActivities}</span><div class="track"><div style="width:${(totalProgress / totalActivities) * 100}%"></div></div></div>
      </div>
    </section>

    <section class="home-access-section" aria-labelledby="homeAccessTitle">
      <div class="home-access-heading">
        <p class="eyebrow">${l ? "PUMILI NG GAGAWIN" : "CHOOSE YOUR PATH"}</p>
        <h2 id="homeAccessTitle">${l ? "Mag-aral o magsanay" : "Learn or practice"}</h2>
        <p>${l ? "Buksan ang mga aralin para matuto nang sunod-sunod, o piliin ang mga laro para gamitin ang iyong kasanayan." : "Open Lessons for guided learning, or choose Games to apply your reading skills."}</p>
      </div>
      <div class="home-access-grid">
        <article class="home-access-card lessons-access-card">
          <span class="access-card-icon" aria-hidden="true">≡</span>
          <div>
            <p class="eyebrow">${l ? "MATUTO" : "LEARN"}</p>
            <h3>${t.nav[1]}</h3>
            <p>${l ? "Magsimula sa Lesson 1, sundan ang limang hakbang, at balikan ang huling bahagi anumang oras." : "Start from Lesson 1, follow five guided steps, and resume where you left off."}</p>
            <strong>${state.lessons.length} / ${LESSONS.length} ${t.completed.toLowerCase()}</strong>
          </div>
          <a class="primary" href="#lessons">${l ? "Buksan ang mga aralin" : "Open lessons"} →</a>
        </article>
        <article class="home-access-card games-access-card">
          <span class="access-card-icon" aria-hidden="true">◆</span>
          <div>
            <p class="eyebrow">${l ? "MAGSANAY" : "PRACTICE"}</p>
            <h3>${t.nav[2]}</h3>
            <p>${l ? "Pumili ng larong kaugnay ng iyong kasanayan at magsanay sa sarili mong bilis." : "Choose a game connected to your reading skill and practice at your own pace."}</p>
            <strong>${completedMissions()} ${t.missionsCount.toLowerCase()}</strong>
          </div>
          <a class="secondary" href="#games">${l ? "Tingnan ang mga laro" : "Browse games"} →</a>
        </article>
      </div>
    </section>

    <section class="section">
      <div class="section-heading"><div><p class="eyebrow">${t.nav[1]}</p><h2>${t.journey}</h2><p>${t.journeySub}</p></div><a class="text-link" href="#lessons">${t.browse}</a></div>
      <div class="cards">${lessonCards()}</div>
    </section>
    <section class="game-banner"><div><p class="eyebrow">${t.homeCard}</p><h2>${t.homeCardTitle}</h2><p>${t.homeCardSub}</p><a class="primary gold" href="#games">${t.nav[2]}</a></div><div class="banner-stats"><strong>${String(MISSIONS.length).padStart(2, "0")}</strong><span>${t.mission.toUpperCase()}S</span><div class="mini-lights"><span class="${state.missions[0]?.complete ? "on" : ""}">01</span><span class="${state.missions[1]?.complete ? "on" : ""}">02</span><span class="${state.missions[2]?.complete ? "on" : ""}">03</span></div></div></section>
    </div>
  `;
}
function renderLessonStation(i) {
  const l = L(),
    t = T(),
    a = LESSONS[i],
    g = (window.LESSON_GUIDES && window.LESSON_GUIDES[i]) || {},
    isDone = state.lessons.includes(i),
    cat = typeof categoryOf === "function" ? categoryOf(a) : { icon: "✺", name: ["Reading", "Pagbasa"] },
    numStr = String(i + 1).padStart(2, "0"),
    prevId = i > 0 ? i - 1 : null,
    nextId = i < LESSONS.length - 1 ? i + 1 : null;

  const conceptBullets = (g.conceptBullets && g.conceptBullets[l]) || a.body[l];
  const tips = (g.tips && g.tips[l]) || [];
  const steps = (g.steps && g.steps[l]) || [];
  const examplePassage = (g.example && g.example.passage && g.example.passage[l]) || a.example[l];
  const exampleBreakdown = (g.example && g.example.breakdown && g.example.breakdown[l]) || [];
  const traps = (g.traps && g.traps[l]) || [];
  const resources = window.LESSON_RESOURCES || g.resources || [];
  const compCode = (g.competency && g.competency[l]) || "DepEd SHS Reading Framework";
  const timeEst = (g.time && g.time[l]) || (l ? "5 minutong pag-aaral" : "5 mins study");
  const savedGuide = state.lessonProgress?.[i] || {};
  const guideStep = Math.max(0, Math.min(4, Number(savedGuide.step) || 0));
  const guideActive = savedGuide.active !== false;
  const guideLabels = l
    ? ["Pangunahing konsepto", "Mga tip", "Proseso", "Halimbawa", "Mga dapat iwasan"]
    : ["Core concepts", "Reading tips", "Step-by-step method", "Worked example", "Common traps"];
  const relatedGame = a.game || (cat && cat.game) || "dispatch";
  const emphasize = (text) => String(text).replace(
    /^([^:]{2,48}):\s*/,
    "<strong>$1:</strong> ",
  );

  return `<div class="lesson-top-bar">
    <a class="text-link back-link" href="#lessons">← ${l ? "Bumalik sa lahat ng aralin" : "Back to all lessons"}</a>
    <div class="lesson-meta-chips">
      <span class="chip cat-chip">${cat.icon || "✺"} ${cat.name ? cat.name[l] : a.skill[l]}</span>
      <span class="chip time-chip">⏱ ${timeEst}</span>
      <span class="chip status-chip ${isDone ? "done" : "todo"}">${isDone ? (l ? "✓ Natapos Na" : "✓ Completed") : (l ? "○ Pag-aaralan" : "○ In Progress")}</span>
    </div>
  </div>
  <div class="lesson-station-layout ${guideActive ? "guided-lesson-active" : ""}">
    <article class="lesson-station-main">
      <header class="lesson-station-head">
        <div class="lesson-deped-banner">
          <span class="deped-icon">🏛️</span>
          <div>
            <strong>${l ? "Pambansang Pamantayan ng DepEd" : "DepEd Learning Competency"}</strong>
            <p>${compCode}</p>
          </div>
        </div>
        <div class="lesson-heading-copy">
          <p class="eyebrow">${l ? "ARALIN" : "LESSON"} ${numStr} · ${a.skill[l].toUpperCase()}</p>
          <h1>${a.title[l]}</h1>
          <ul class="lesson-summary-list"><li>${emphasize(a.desc[l])}</li></ul>
          <div class="lesson-start-actions">
            ${guideActive
      ? `<button class="secondary" id="showFullLesson" type="button">${l ? "Tingnan ang buong aralin" : "See whole lesson"}</button>`
      : `<button class="primary lesson-start-button" id="startGuidedLesson" type="button">
                  ${savedGuide.started ? (l ? "Ipagpatuloy ang guided lesson" : "Continue guided lesson") : (l ? "Simulan ang guided lesson" : "Start guided lesson")}
                </button>`}
          </div>
        </div>
      </header>

      ${guideActive ? `<div class="guided-progress" aria-label="${l ? "Progreso sa aralin" : "Lesson progress"}">
        <div class="guided-progress-copy">
          <span>${l ? "HAKBANG" : "STEP"} ${guideStep + 1} / 5</span>
          <strong>${guideLabels[guideStep]}</strong>
        </div>
        <div class="guided-progress-track"><span style="width:${((guideStep + 1) / 5) * 100}%"></span></div>
        <div class="guided-step-dots">${guideLabels.map((label, index) => `<span class="${index < guideStep ? "done" : index === guideStep ? "current" : ""}" title="${label}">${index < guideStep ? "✓" : index + 1}</span>`).join("")}</div>
      </div>` : ""}

      <section class="lesson-block ${guideActive && guideStep !== 0 ? "guided-hidden" : ""}" data-guide-step="0">
        <div class="block-title">
          <span class="block-num">01</span>
          <h2>${l ? "Pangunahing Konsepto (Core Concepts)" : "Core Principles & What Matters"}</h2>
        </div>
        <ul class="lesson-bullet-list concept-list">
          ${conceptBullets.map((b) => `<li><span class="bullet-dot">✦</span><span>${emphasize(b)}</span></li>`).join("")}
        </ul>
      </section>

      <section class="lesson-block highlight-block ${guideActive && guideStep !== 1 ? "guided-hidden" : ""}" data-guide-step="1">
        <div class="block-title">
          <span class="block-num">02</span>
          <h2>${l ? "Mga Mahahalagang Tips at Estratehiya" : "Strategic Reading Tips & Rules"}</h2>
        </div>
        <ul class="lesson-bullet-list tips-list">
          ${tips.map((tip) => `<li><span class="bullet-dot tip-icon">💡</span><span>${emphasize(tip)}</span></li>`).join("")}
        </ul>
      </section>

      <section class="lesson-block ${guideActive && guideStep !== 2 ? "guided-hidden" : ""}" data-guide-step="2">
        <div class="block-title">
          <span class="block-num">03</span>
          <h2>${l ? "Hakbang-hakbang na Proseso sa Pagbasa" : "Step-by-Step Reading Method"}</h2>
        </div>
        <ul class="lesson-bullet-list steps-list">
          ${steps.map((st, idx) => `<li><span class="step-badge">${idx + 1}</span><span>${emphasize(st.replace(/^\d+\.\s*/, ""))}</span></li>`).join("")}
        </ul>
      </section>

      <section class="lesson-block example-block ${guideActive && guideStep !== 3 ? "guided-hidden" : ""}" data-guide-step="3">
        <div class="block-title">
          <span class="block-num">04</span>
          <h2>${l ? "Suriing Halimbawa at Pagsusuri" : "Worked Example & Text Analysis"}</h2>
        </div>
        <div class="example-card">
          <p class="example-card-label">${l ? "HALIMBAWANG SIPI" : "SAMPLE PASSAGE"}</p>
          <blockquote>${examplePassage}</blockquote>
        </div>
        <div class="analysis-box">
          <p class="analysis-title">${l ? "Pagsusuri at Paglalapat (Bullet Analysis):" : "Line-by-Line Breakdown:"}</p>
          <ul class="lesson-bullet-list analysis-list">
            ${exampleBreakdown.map((eb) => `<li><span class="bullet-dot check-dot">✓</span><span>${emphasize(eb.replace(/^•\s*/, ""))}</span></li>`).join("")}
          </ul>
        </div>
      </section>

      <section class="lesson-block trap-block ${guideActive && guideStep !== 4 ? "guided-hidden" : ""}" data-guide-step="4">
        <div class="block-title">
          <span class="block-num">05</span>
          <h2>${l ? "Mga Karaniwang Pagkakamali na Dapat Iwasan" : "Reading Traps to Avoid"}</h2>
        </div>
        <ul class="lesson-bullet-list traps-list">
          ${traps.map((tr) => `<li><span class="bullet-dot alert-dot">⚠️</span><span>${emphasize(tr)}</span></li>`).join("")}
        </ul>
      </section>

      ${guideActive ? `<nav class="guided-controls" aria-label="${l ? "Pag-navigate sa aralin" : "Lesson navigation"}">
        <button class="secondary" id="guidedBack" type="button" ${guideStep === 0 ? "disabled" : ""}>← ${l ? "Bumalik" : "Back"}</button>
        <span>${l ? "Awtomatikong nase-save ang progreso" : "Progress saves automatically"}</span>
        <button class="primary" id="guidedNext" type="button">${guideStep === 4 ? (l ? "Tapusin ang aralin" : "Finish lesson") : (l ? "Susunod" : "Next")} →</button>
      </nav>` : ""}

      <div class="lesson-finish-card ${guideActive ? "guided-hidden" : ""}">
        <div>
          <h3>${isDone ? (l ? "Natapos mo na ang araling ito" : "Lesson completed") : (l ? "Itala ang iyong natutuhan" : "Record your learning progress")}</h3>
          <p>${isDone ? (l ? "Naitala at na-save na ang iyong progreso." : "Your lesson progress has been recorded and saved.") : (l ? "Itala ang iyong progreso upang mai-save sa iyong cloud learning journal." : "Mark this lesson complete to sync it with your learning records and mastery tracker.")}</p>
        </div>
        ${isDone ? `<div class="lesson-complete-actions">
          ${nextId !== null ? `<a class="primary" href="#lessons/${nextId}">${l ? "Pumunta sa susunod na aralin" : "Go to next lesson"} →</a>` : ""}
          <a class="secondary" href="#home">${l ? "Bumalik sa pangunahing pahina" : "Go back home"}</a>
        </div>` : `<button class="primary" id="finishLesson" type="button">
          ${l ? "✓ Itala bilang natapos" : "✓ Mark as completed"}
        </button>`}
      </div>
    </article>

    <aside class="lesson-station-sidebar">
      <div class="sidebar-card study-tracker-card">
        <h3>${l ? "Katayuan ng Aralin" : "Study Tracker"}</h3>
        <p class="tracker-desc">${l ? "Aralin" : "Lesson"} ${numStr} / ${LESSONS.length}</p>
        <div class="tracker-status-box ${isDone ? "is-done" : "is-pending"}">
          <span class="status-icon">${isDone ? "✓" : "○"}</span>
          <strong>${isDone ? (l ? "Naitalang Natapos" : "Marked Completed") : (l ? "Hindi Pa Natatapos" : "Pending Study")}</strong>
        </div>
        <button class="primary full" id="finishLessonSide" type="button">
          ${isDone ? (l ? "Markahan bilang hindi natapos" : "Mark as incomplete") : (l ? "✓ Markahan bilang natapos" : "✓ Mark as completed")}
        </button>
        <div class="lesson-nav-buttons">
          ${prevId !== null ? `<a class="nav-prev-btn" href="#lessons/${prevId}">← ${l ? "Nakaraang aralin" : "Previous lesson"}</a>` : `<span></span>`}
          ${nextId !== null ? `<a class="nav-next-btn" href="#lessons/${nextId}">${l ? "Susunod na aralin" : "Next lesson"} →</a>` : `<span></span>`}
        </div>
      </div>

      <div class="sidebar-card deped-card">
        <div class="card-header">
          <span class="card-icon">📚</span>
          <h3>${l ? "Mga Kagamitan ng DepEd" : "Official DepEd Resources"}</h3>
        </div>
        <ul class="sidebar-note-list"><li>${l ? "Pumili lamang ng isang sanggunian na angkop sa kasalukuyang kasanayan." : "Choose one reference that matches the skill you are studying."}</li></ul>
        <div class="deped-resource-list">
          ${resources.map((r) => `
            <a class="deped-item" href="${r.url}" target="_blank" rel="noopener noreferrer">
              <span class="deped-tag">${r.tag}</span>
              <strong>${r.title}</strong>
              <ul><li>${r.desc}</li><li><b>${l ? "Gamit:" : "Use:"}</b> ${r.use}</li></ul>
              <span class="resource-open">${l ? "Buksan ang sanggunian" : "Open resource"} ↗</span>
            </a>
          `).join("")}
        </div>
      </div>

      <div class="sidebar-card framework-card">
        <div class="card-header">
          <span class="card-icon">🧠</span>
          <h3>${l ? "Mga Paraan sa Mas Mabisang Pag-aaral" : "Better Study Methods"}</h3>
        </div>
        <ul class="framework-bullets">
          <li>
            <strong>${l ? "Preview–Read–Summarize" : "Preview–Read–Summarize"}</strong>:
            <span>${l ? "Silipin ang pamagat at heading, basahin ang mahahalagang bahagi, saka ibuod sa isang pangungusap." : "Preview headings, read for key evidence, then write a one-sentence summary."}</span>
          </li>
          <li>
            <strong>Cornell Notetaking</strong>:
            <span>${l ? "Ihiwalay ang paksang salita (Cue Column) sa buod at tala." : "Organize notes into Cue column, notes, and summary."}</span>
          </li>
          <li>
            <strong>IDEAS Framework</strong>:
            <span>${l ? "Inference, Definition, Example, Antonym, Synonym sa pagbasa." : "Inference, Definition, Example, Antonym, Synonym for context decoding."}</span>
          </li>
        </ul>
      </div>

      <div class="sidebar-card lesson-game-card">
        <span class="game-choice-icon" aria-hidden="true">◆</span>
        <p class="eyebrow">${l ? "OPSYONAL NA PAGSASANAY" : "OPTIONAL PRACTICE"}</p>
        <h3>${l ? "Gamitin ang kasanayan sa laro" : "Practice this skill in a game"}</h3>
        <p>${l ? "Subukan ang kaugnay na laro pagkatapos mong basahin ang aralin. Hiwalay na mase-save ang iyong game progress." : "Try the related game after studying the lesson. Your game progress is saved separately."}</p>
        <a class="primary full lesson-game-link" href="#games/${relatedGame}">${l ? "Pumunta sa laro" : "Go to related game"} →</a>
      </div>
    </aside>
  </div>`;
}

function lessonsPage(id) {
  const t = T(),
    l = L();
  if (id === undefined)
    return (
      title("READ · UNDERSTAND · APPLY", t.lessonsTitle, t.lessonsSub) +
      `<div class="cards">${lessonCards()}</div>`
    );
  const i = Number(id);
  if (!Number.isInteger(i) || !LESSONS[i]) return lessonsPage();
  return renderLessonStation(i);
}
function gamesPage(id) {
  const t = T(),
    l = L();
  if (id === undefined)
    return (
      title("SINAG DISPATCH", t.gameTitle, t.gameSub) +
      `<div class="game-overview"><div class="overview-intro"><span class="big-sun">✺</span><h2>${t.homeCardTitle}</h2><p>${t.homeCardSub}</p><div class="track"><div style="width:${(completedMissions() / MISSIONS.length) * 100}%"></div></div><p>${completedMissions()} / ${MISSIONS.length} ${t.missionsCount.toLowerCase()}</p></div><div class="missions-list">${MISSIONS.map((m, i) => `<${allowed(i) ? "a" : "div"} ${allowed(i) ? `href="#games/${i}"` : ""} class="mission-row ${!allowed(i) ? "locked" : ""}"><span class="number">0${i + 1}</span><div><p class="eyebrow">${LESSONS[m.skill].skill[l]}</p><h3>${m.title[l]}</h3><p>${state.missions[i]?.complete ? "✓ " + t.completed : allowed(i) ? t.play : t.missionLocked}</p></div><span class="row-symbol">${state.missions[i]?.complete ? "✺" : allowed(i) ? "＋" : "◇"}</span></${allowed(i) ? "a" : "div"}>`).join("")}</div></div>`
    );
  const i = Number(id);
  if (!Number.isInteger(i) || !MISSIONS[i] || !allowed(i)) return gamesPage();
  const m = MISSIONS[i];
  return `<div class="game-page-head"><div><p class="eyebrow">SINAG DISPATCH · ${t.mission} 0${i + 1}</p><h1>${m.title[l]}</h1></div><a class="text-link" href="#games">${t.nav[2]}</a></div><div class="dispatch-layout"><aside class="map-panel"><h2>${t.map}</h2><p>${t.destination}</p><div class="town">${locIds.map((key, n) => `<button class="place ${selected.location === key ? "selected" : ""} ${MISSIONS.some((m, k) => m.location === key && state.missions[k]?.complete) ? "lit" : ""}" data-location="${key}" aria-pressed="${selected.location === key}"><span class="place-number">0${n + 1}</span><strong>${t.loc[n]}</strong><span class="place-light">✺</span></button>`).join("")}</div><div class="skill-note"><p class="eyebrow">${t.skill}</p><h3>${LESSONS[m.skill].skill[l]}</h3><a class="text-link" href="#lessons/${m.skill}">${t.review}</a></div></aside><section class="dispatch-panel"><div class="request-top"><span class="pill amber">${t.request}</span><span class="muted">${t.mission} 0${i + 1} / ${String(MISSIONS.length).padStart(2, "0")}</span></div><p class="muted">${t.read}</p><article class="passage">${m.sentences[l].join(" ")}</article><h3>${t.supply}</h3><div class="supplies">${supIds.map((key, n) => `<button class="${selected.supply === key ? "selected" : ""}" data-supply="${key}" aria-pressed="${selected.supply === key}"><span>${["▤", "◉", "▧"][n]}</span>${t.sup[n]}</button>`).join("")}</div><h3 class="evidence-title">${t.evidence}</h3><p class="muted">${t.evidenceSub}</p><div class="option-list">${m.sentences[l].map((s, n) => `<button class="option ${selected.evidence === n ? "selected" : ""}" data-evidence="${n}" aria-pressed="${selected.evidence === n}"><span>${"ABCD"[n]}</span>${s}</button>`).join("")}</div><div class="dispatch-bottom"><span class="muted">${t.ready}</span><button class="primary" id="dispatch" ${Object.values(selected).some((v) => v === null) ? "disabled" : ""}>${t.send}</button></div><div id="dispatchFeedback" class="feedback" role="status" tabindex="-1" hidden></div></section></div>`;
}
function progressPage() {
  const t = T(),
    l = L(),
    records = Object.values(state.missions),
    first = records.filter((r) => Number.isInteger(r?.first)),
    accuracy = first.length
      ? Math.round(
        (first.reduce((s, r) => s + r.first, 0) / (first.length * 3)) * 100,
      ) + "%"
      : "—",
    attempts = records.reduce((s, r) => s + (Number(r?.attempts) || 0), 0);
  const badges = [
    state.lessons.length > 0,
    completedMissions() > 0,
    completedMissions() === MISSIONS.length,
  ];
  return (
    title("YOUR PERSONAL JOURNEY", t.progressTitle, t.progressSub) +
    `<div class="stats-grid">${[
      [state.lessons.length + "/" + LESSONS.length, t.lessonsCount],
      [completedMissions() + "/" + MISSIONS.length, t.missionsCount],
      [accuracy, t.accuracy],
      [attempts, t.attempts],
    ]
      .map(
        ([value, label]) =>
          `<div class="stat"><strong>${value}</strong><span>${label}</span></div>`,
      )
      .join(
        "",
      )}</div><div class="progress-layout"><section class="progress-panel"><h2>${t.badges}</h2><div class="badges">${badges.map((b, i) => `<div class="badge ${b ? "earned" : ""}"><span>${["✧", "◎", "✺"][i]}</span><strong>${t.badgeNames[i]}</strong><small>${b ? t.completed : t.badgeHints[i]}</small></div>`).join("")}</div><h2 class="log-title">${t.deliveries}</h2>${records.length ? MISSIONS.map((m, i) => (state.missions[i] ? `<div class="log-row"><div><strong>${m.title[l]}</strong><small>${state.missions[i].attempts || 0} ${t.attemptLabel}</small></div><span class="pill">${state.missions[i].complete ? "✓ " + t.completed : t.notStarted}</span></div>` : "")).join("") : `<p class="muted">${t.none}</p>`}<a class="primary" href="#games">${t.play}</a></section><section class="progress-panel"><h2>${t.activity}</h2>${state.activity.length
        ? state.activity
          .map((a) => {
            const content =
              a.type === "lesson"
                ? LESSONS[a.id]
                : a.type === "arcade"
                  ? ARCADE.find((g) => g.id === a.id)
                  : a.type === "story"
                    ? STORY_CHAPTERS[a.id]
                    : MISSIONS[a.id];
            if (!content) return "";
            return `<div class="activity-row"><span>${a.type === "lesson" ? "≡" : "✺"}</span><div><strong>${(content.title || content.name)[l]}</strong><p>${a.type === "lesson" ? t.lessonActivity : a.type === "arcade" ? (L() ? "Natapos na yugto ng laro" : "Completed game round") : a.type === "story" ? (L() ? "Natapos na kabanata ng kuwento" : "Completed story chapter") : t.missionActivity}</p><small>${new Date(a.time).toLocaleDateString(state.lang === "fil" ? "fil-PH" : "en-PH", { month: "short", day: "numeric" })}</small></div></div>`;
          })
          .join("")
        : `<div class="empty"><span>✧</span><h3>${t.empty}</h3><p>${t.emptySub}</p></div>`
    }</section></div><div class="reset-row"><p class="muted">${t[storageOK ? "local" : "unavailable"]}</p><button class="reset" id="reset">${t.reset}</button></div>`
  );
}
function render() {
  const [page, id] = route();
  document.body.dataset.page = page;
  header();
  const main = $("main");
  main.innerHTML =
    page === "lessons"
      ? lessonsPage(id)
      : page === "games"
        ? gamesPage(id)
        : page === "progress"
          ? progressPage()
          : home();
  bind(page, id);
}
function bind(page, id) {
  const t = T(),
    i = Number(id);
  document.querySelectorAll("[data-quiz]").forEach(
    (b) =>
    (b.onclick = () => {
      quizChoice = Number(b.dataset.quiz);
      quizChecked = false;
      quizCorrect = false;
      render();
    }),
  );
  if ($("check"))
    $("check").onclick = () => {
      if (quizChoice === null) return;
      quizChecked = true;
      quizCorrect = quizChoice === LESSONS[i].answer;
      render();
      $("quizFeedback").scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    };
  const handleFinishLesson = () => {
    if (!state.lessons.includes(i)) {
      state.lessons.push(i);
      log("lesson", i);
      save();
      if (typeof celebrate === "function") {
        celebrate("✺", L() ? "Naitala ang aralin!" : "Lesson completed!");
      }
    } else {
      state.lessons = state.lessons.filter((x) => x !== i);
      save();
    }
    render();
  };
  if ($("finishLesson")) $("finishLesson").onclick = handleFinishLesson;
  if ($("finishLessonSide")) $("finishLessonSide").onclick = handleFinishLesson;
  if ($("startGuidedLesson"))
    $("startGuidedLesson").onclick = () => {
      const current = state.lessonProgress?.[i] || {};
      state.lessonProgress = state.lessonProgress || {};
      state.lessonProgress[i] = {
        step: Math.max(0, Math.min(4, Number(current.step) || 0)),
        active: true,
        started: true,
      };
      save();
      render();
      document.querySelector(".guided-progress")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
  if ($("showFullLesson"))
    $("showFullLesson").onclick = () => {
      state.lessonProgress[i] = { ...state.lessonProgress[i], active: false, started: true };
      save();
      render();
    };
  if ($("guidedBack"))
    $("guidedBack").onclick = () => {
      const current = Math.max(0, Number(state.lessonProgress?.[i]?.step) || 0);
      state.lessonProgress[i] = { step: Math.max(0, current - 1), active: true, started: true };
      save();
      render();
      document.querySelector(".guided-progress")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
  if ($("guidedNext"))
    $("guidedNext").onclick = () => {
      const current = Math.max(0, Number(state.lessonProgress?.[i]?.step) || 0);
      if (current < 4) {
        state.lessonProgress[i] = { step: current + 1, active: true, started: true };
        save();
        render();
        document.querySelector(".guided-progress")?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      state.lessonProgress[i] = { step: 4, active: false, started: true, complete: true };
      if (!state.lessons.includes(i)) {
        state.lessons.push(i);
        log("lesson", i);
      }
      save();
      render();
      if (typeof celebrate === "function") celebrate("✺", L() ? "Natapos ang aralin!" : "Lesson completed!");
    };
  ["location", "supply", "evidence"].forEach((type) =>
    document.querySelectorAll(`[data-${type}]`).forEach(
      (b) =>
      (b.onclick = () => {
        selected[type] =
          type === "evidence" ? Number(b.dataset[type]) : b.dataset[type];
        render();
      }),
    ),
  );
  if ($("dispatch"))
    $("dispatch").onclick = () => {
      if (Object.values(selected).some((v) => v === null)) return;
      const m = MISSIONS[i],
        checks = [
          selected.location === m.location,
          selected.supply === m.supply,
          selected.evidence === m.evidence,
        ],
        score = checks.filter(Boolean).length;
      const record = state.missions[i] ?? {
        complete: false,
        attempts: 0,
        first: null,
      };
      record.attempts++;
      if (record.first === null) record.first = score;
      if (score === 3) {
        if (!record.complete) log("mission", i);
        record.complete = true;
      }
      if (score === 3)
        record.stars = Math.max(
          Number(record.stars) || 0,
          record.attempts === 1 ? 3 : record.attempts === 2 ? 2 : 1,
        );
      state.missions[i] = record;
      save();
      render();
      const box = $("dispatchFeedback");
      box.classList.toggle("success", score === 3);
      box.innerHTML = `<strong>${score === 3 ? t.success : t.wrong}</strong>${score === 3 ? `<div class="mastery-stars" aria-label="${record.stars} of 3 stars">${[1, 2, 3].map((star) => `<span class="${star <= record.stars ? "earned" : ""}">★</span>`).join("")}</div>` : ""}<p>${m.explain[L()]}</p>${score !== 3 ? `<ul>${checks.map((ok, n) => (ok ? "" : `<li>${[t.locationError, t.supplyError, t.evidenceError][n]}</li>`)).join("")}</ul>` : `<div class="actions">${i < MISSIONS.length - 1 ? `<a class="primary" href="#games/${i + 1}">${t.next}</a>` : `<a class="primary" href="#progress">${t.progressLink}</a>`}<button class="secondary" id="replay">${t.replay}</button></div>`}`;
      box.hidden = false;
      box.focus();
      if ($("replay"))
        $("replay").onclick = () => {
          selected = { location: null, supply: null, evidence: null };
          render();
        };
    };
  if ($("reset"))
    $("reset").onclick = () => {
      if (!confirm(t.resetConfirm)) return;
      state.lessons = [];
      state.lessonProgress = {};
      state.missions = {};
      state.activity = [];
      state.arcade = {};
      state.customGames = {};
      state.rabbit = {
        answered: {},
        pieces: 0,
        skins: [],
        streak: 0,
        bestStreak: 0,
      };
      state.story = null;
      storyState = null;
      try {
        localStorage.removeItem("sinag-dispatch-v1");
      } catch { }
      save();
      render();
    };
}
$("language").onclick = () => {
  state.lang = state.lang === "en" ? "fil" : "en";
  save();
  render();
  if (typeof applyTheme === "function") applyTheme(document.documentElement.dataset.theme);
};
window.addEventListener("hashchange", () => {
  if (location.hash !== currentRoute) {
    selected = { location: null, supply: null, evidence: null };
    quizChoice = null;
    quizChecked = false;
    quizCorrect = false;
    currentRoute = location.hash;
  }
  render();
  window.scrollTo({ top: 0 });
  $("main").focus({ preventScroll: true });
});
render();
