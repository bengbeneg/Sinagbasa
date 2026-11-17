let lessonCategory = "all";

function categoryOf(lesson) {
  return CATEGORIES.find((c) => c.id === lesson.category) || CATEGORIES[0];
}

function categorizedLessons() {
  const l = L();
  const t = T();
  const cats =
    lessonCategory === "all"
      ? CATEGORIES
      : CATEGORIES.filter((c) => c.id === lessonCategory);

  const titleHtml = title(
    l ? "MGA BAHAGI NG PAG-UNAWA" : "READING SKILL PATHWAYS",
    l
      ? "Piliin ang kasanayang palalalimin."
      : "Choose the skill you want to strengthen.",
    l
      ? "Labindalawang aralin sa anim na bahagi ng pag-unawa. Bawat aralin ay may kaugnay na laro."
      : "Twelve lessons across six reading skills. Every lesson connects to a game.",
  );

  const categoryButtons = CATEGORIES.map(
    (c) => `
      <button data-category="${c.id}" aria-pressed="${lessonCategory === c.id}" class="${lessonCategory === c.id ? "active" : ""}">
        ${c.icon} ${c.name[l]}
      </button>`,
  ).join("");

  const tabsHtml = `
    <div class="category-tabs" role="group" aria-label="${l ? "Kategorya ng aralin" : "Lesson categories"}">
      <button data-category="all" aria-pressed="${lessonCategory === "all"}" class="${lessonCategory === "all" ? "active" : ""}">
        ${l ? "Lahat" : "All skills"}
      </button>
      ${categoryButtons}
    </div>
  `;

  const journeyHtml = `
    <section class="lesson-journey-card">
      <div class="journey-card-icon" aria-hidden="true">01</div>
      <div class="journey-card-copy">
        <p class="eyebrow">${l ? "MAGSIMULA SA UNANG ARALIN" : "START FROM LESSON ONE"}</p>
        <h2>${l ? "Simulan ang iyong lesson journey" : "Start your lesson journey"}</h2>
        <p>${l
          ? "Sundan ang mga aralin mula una hanggang huli. Naaalala ng SINAGBASA ang huling hakbang na natapos mo."
          : "Follow the lessons from beginning to end. SINAGBASA remembers the last step you reached."}</p>
        <div class="journey-card-progress">
          <div><span style="width:${(state.lessons.length / LESSONS.length) * 100}%"></span></div>
          <small><strong>${state.lessons.length}</strong> / ${LESSONS.length} ${l ? "araling natapos" : "lessons completed"}</small>
        </div>
      </div>
      <button class="primary journey-start-button" type="button" data-start-lesson-journey>
        ${state.lessonProgress?.[0]?.started
          ? (l ? "Ipagpatuloy ang Lesson 1" : "Continue Lesson 1")
          : (l ? "Simulan ang Lesson 1" : "Start Lesson 1")}
        <span aria-hidden="true">→</span>
      </button>
    </section>
  `;

  const sectionsHtml = cats
    .map((c) => {
      const completedCount = LESSONS.filter(
        (a) =>
          a.category === c.id && state.lessons.includes(LESSONS.indexOf(a)),
      ).length;
      const totalCount = LESSONS.filter((a) => a.category === c.id).length;

      const lessonsHtml = LESSONS.map((a, i) => {
        if (a.category !== c.id) return "";
        const isDone = state.lessons.includes(i);
        const pillText = isDone ? "✓ " + t.completed : t.minutes;
        const numStr = String(i + 1).padStart(2, "0");

        return `
          <a class="category-lesson" href="#lessons/${i}">
            <span class="number">${numStr}</span>
            <div>
              <h3>${a.title[l]}</h3>
              <p>${a.desc[l]}</p>
              <span class="pill">${pillText}</span>
            </div>
            <span class="row-symbol">＋</span>
          </a>
        `;
      }).join("");

      return `
        <section class="category-section">
          <div class="category-heading">
            <span>${c.icon}</span>
            <div>
              <p class="eyebrow">${l ? "BAHAGI NG PAG-UNAWA" : "AREA OF COMPREHENSION"}</p>
              <h2>${c.name[l]}</h2>
              <p>${c.part[l]}</p>
            </div>
            <small>${completedCount} / ${totalCount} ${t.completed.toLowerCase()}</small>
          </div>
          <div class="category-lessons">
            ${lessonsHtml}
          </div>
          <a class="text-link" href="#games/${c.game}">
            ${l ? "Gamitin ang kasanayan sa laro" : "Put this skill into play"}
          </a>
        </section>
      `;
    })
    .join("");

  return titleHtml + journeyHtml + tabsHtml + sectionsHtml;
}

const oldLessons = lessonsPage;
lessonsPage = function (id) {
  if (id === undefined) {
    return categorizedLessons();
  }
  const html = oldLessons(id);
  const a = LESSONS[Number(id)];
  if (!a) {
    return html;
  }
  return (
    `<div class="lesson-category-label">${categoryOf(a).icon} ${categoryOf(a).name[L()]}</div>` +
    html
  );
};

const oldExpansionBind = bind;
bind = function (page, id) {
  oldExpansionBind(page, id);

  document.querySelectorAll("[data-category]").forEach((b) => {
    b.onclick = () => {
      lessonCategory = b.dataset.category;
      render();
    };
  });

  const journeyStart = document.querySelector("[data-start-lesson-journey]");
  if (journeyStart) {
    journeyStart.onclick = () => {
      state.lessonProgress = state.lessonProgress || {};
      const current = state.lessonProgress[0] || {};
      state.lessonProgress[0] = {
        step: Math.max(0, Math.min(4, Number(current.step) || 0)),
        active: true,
        started: true,
      };
      save();
      location.hash = "lessons/0";
    };
  }

  const game = ARCADE.find((g) => g.id === id);
  if (game && arcadeSession) {
    document.querySelectorAll("[data-chapter]").forEach((b) => {
      b.onclick = () => {
        const n = Number(b.dataset.chapter);
        if (n !== 0 && !state.arcade[game.id]?.[n - 1]?.complete) {
          return;
        }
        arcadeSession = { ...createSession(game), round: n };
        render();
      };
    });
  }

  if ($("dispatch")) {
    const fn = $("dispatch").onclick;
    $("dispatch").onclick = () => {
      fn();
      if (state.missions[Number(id)]?.complete) {
        celebrate("✺", L() ? "Naibalik ang liwanag!" : "Light restored!");
      }
    };
  }

  if ($("arcadeCheck")) {
    const fn = $("arcadeCheck").onclick;
    $("arcadeCheck").onclick = () => {
      fn();
      if (arcadeSession?.solved) {
        celebrate("✧", L() ? "Nalutas ang hamon!" : "Challenge solved!");
      }
    };
  }
};

const oldArcadeView = arcadePage;
arcadePage = function (g) {
  let html = oldArcadeView(g);
  const s = arcadeSession;
  const masteryRecord = state.arcade[g.id]?.[s.round];

  const roundButtons = g.rounds
    .map((r, i) => {
      const isCurrent = i === s.round;
      const isComplete = state.arcade[g.id]?.[i]?.complete;
      const isDisabled = i !== 0 && !state.arcade[g.id]?.[i - 1]?.complete;
      const checkOrNum = isComplete ? "✓" : String(i + 1).padStart(2, "0");

      return `
        <button data-chapter="${i}" class="${isCurrent ? "current" : ""} ${isComplete ? "complete" : ""}" ${isDisabled ? "disabled" : ""}>
          <span>${checkOrNum}</span>
          <small>${r.title[L()]}</small>
        </button>
      `;
    })
    .join("");

  const chapterButtons = `
    <div class="chapter-select" role="group" aria-label="${L() ? "Mga kabanata" : "Chapters"}">
      ${roundButtons}
    </div>
  `;

  html = html.replace(
    /<div class="round-path">[\s\S]*?<\/div>/,
    chapterButtons,
  );

  if (g.id === "headline") {
    html = html.replace(
      at().context,
      L()
        ? "Piliin ang pamagat at detalye"
        : "Build the headline and support it",
    );
  }

  if (g.id === "fact") {
    html = html.replace(
      at().context,
      L() ? "Iuri ang pahayag" : "Sort the newsroom claims",
    );
  }

  if (masteryRecord?.complete) {
    const stars = Number(masteryRecord.stars) || 1;
    html = html.replace(
      '<div class="round-meter">',
      `<div class="mastery-stars compact" aria-label="${stars} of 3 stars">${[1, 2, 3].map((star) => `<span class="${star <= stars ? "earned" : ""}">★</span>`).join("")}</div><div class="round-meter">`,
    );
  }

  return html;
};

function celebrate(symbol, message) {
  document.querySelector(".reward-pop")?.remove();

  const div = document.createElement("div");
  div.className = "reward-pop";
  div.setAttribute("role", "status");

  const confettiHtml = Array.from(
    { length: 12 },
    (_, i) => `<i style="--i:${i}"></i>`,
  ).join("");

  div.innerHTML = `
    <strong>${symbol}</strong>
    <span>${message}</span>
    <div class="confetti" aria-hidden="true">${confettiHtml}</div>
  `;

  document.body.append(div);
  setTimeout(() => div.remove(), 2200);
}

UI.en.journeySub =
  "Six skill pathways. Twelve lessons. A town of possibilities.";
UI.fil.journeySub =
  "Anim na kasanayan. Labindalawang aralin. Maraming pagkakataong makatulong.";

UI.en.badgeHints[2] = "Complete all dispatch missions";
UI.fil.badgeHints[2] = "Tapusin ang lahat ng dispatch mission";

render();
