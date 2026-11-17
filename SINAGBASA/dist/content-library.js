"use strict";

let remoteContent = [];
let teacherEditId = null;

const contentText = {
  en: {
    library: "Library",
    librarySub: "Lessons, reading materials, and stories shared by your teachers.",
    teacher: "Teacher Studio",
    teacherSub: "Create and publish bilingual learning content.",
    empty: "No teacher content has been published yet.",
    lesson: "Lesson",
    material: "Material",
    story: "Story",
    storyGame: "Story game",
    draft: "Draft",
    published: "Published",
    create: "Create content",
    edit: "Edit content",
    save: "Save content",
    cancel: "Cancel editing",
    titleEn: "English title",
    titleFil: "Filipino title",
    bodyEn: "English content",
    bodyFil: "Filipino content",
    link: "Optional resource link",
    attachment: "File attachment",
    attachmentHelp: "PDF, Word, PowerPoint, text, or image · Maximum 10 MB",
    currentFile: "Current file",
    removeFile: "Remove current file",
    fileTooLarge: "The selected file must be 10 MB or smaller.",
    fileTypeInvalid: "Choose a PDF, Word, PowerPoint, text, JPG, PNG, or WebP file.",
    uploading: "Uploading file…",
    openFile: "Open attachment",
    gameSettings: "Story game builder",
    timer: "Decision timer (seconds, 0 for none)",
    points: "Completion points",
    scenes: "Scenes",
    addScene: "Add scene",
    removeScene: "Remove scene",
    narrativeEn: "Narrative or dialogue in English",
    narrativeFil: "Narrative or dialogue in Filipino",
    questionEn: "Decision question in English",
    questionFil: "Decision question in Filipino",
    choices: "Choices",
    addChoice: "Add choice",
    removeChoice: "Remove",
    choiceEn: "English choice",
    choiceFil: "Filipino choice",
    outcome: "What happens",
    continueOutcome: "Continue to next scene",
    successOutcome: "Complete the game",
    failOutcome: "Show failure and retry",
    feedbackEn: "English feedback",
    feedbackFil: "Filipino feedback",
    preview: "Preview game",
    invalidGame: "Story games require at least one scene and two choices per scene.",
    teacherLessons: "Lessons from your teachers",
    teacherGames: "Story games from your teachers",
    playGame: "Play game",
    timeLeft: "Time left",
    gameComplete: "Story complete!",
    earnedPoints: "Points earned",
    retryChoice: "Try the decision again",
    backLessons: "Back to lessons",
    backGames: "Back to games",
    publish: "Publish for students",
    open: "Open",
    editButton: "Edit",
    deleteButton: "Delete",
    deleteConfirm: "Delete this content permanently?",
    saved: "Content saved.",
    removed: "Content deleted.",
    forbidden: "Teacher access is required.",
  },
  fil: {
    library: "Aklatan",
    librarySub: "Mga aralin, babasahin, at kuwentong ibinahagi ng inyong mga guro.",
    teacher: "Teacher Studio",
    teacherSub: "Gumawa at maglathala ng bilingual na learning content.",
    empty: "Wala pang inilalathalang nilalaman ang guro.",
    lesson: "Aralin",
    material: "Materyal",
    story: "Kuwento",
    storyGame: "Larong kuwento",
    draft: "Burador",
    published: "Nakalathala",
    create: "Gumawa ng content",
    edit: "I-edit ang content",
    save: "I-save ang content",
    cancel: "Kanselahin ang pag-edit",
    titleEn: "Pamagat sa Ingles",
    titleFil: "Pamagat sa Filipino",
    bodyEn: "Nilalaman sa Ingles",
    bodyFil: "Nilalaman sa Filipino",
    link: "Opsyonal na resource link",
    attachment: "Kalakip na file",
    attachmentHelp: "PDF, Word, PowerPoint, text, o larawan · Hanggang 10 MB",
    currentFile: "Kasalukuyang file",
    removeFile: "Alisin ang kasalukuyang file",
    fileTooLarge: "Dapat 10 MB o mas maliit ang napiling file.",
    fileTypeInvalid: "Pumili ng PDF, Word, PowerPoint, text, JPG, PNG, o WebP file.",
    uploading: "Ina-upload ang file…",
    openFile: "Buksan ang kalakip",
    gameSettings: "Tagabuo ng larong kuwento",
    timer: "Oras sa pagpapasya (segundo, 0 kung wala)",
    points: "Puntos kapag natapos",
    scenes: "Mga eksena",
    addScene: "Magdagdag ng eksena",
    removeScene: "Alisin ang eksena",
    narrativeEn: "Salaysay o usapan sa Ingles",
    narrativeFil: "Salaysay o usapan sa Filipino",
    questionEn: "Tanong sa pagpapasya sa Ingles",
    questionFil: "Tanong sa pagpapasya sa Filipino",
    choices: "Mga pagpipilian",
    addChoice: "Magdagdag ng pagpipilian",
    removeChoice: "Alisin",
    choiceEn: "Pagpipilian sa Ingles",
    choiceFil: "Pagpipilian sa Filipino",
    outcome: "Ano ang mangyayari",
    continueOutcome: "Magpatuloy sa susunod na eksena",
    successOutcome: "Tapusin ang laro",
    failOutcome: "Ipakita ang pagkabigo at subukang muli",
    feedbackEn: "Feedback sa Ingles",
    feedbackFil: "Feedback sa Filipino",
    preview: "I-preview ang laro",
    invalidGame: "Kailangan ng larong kuwento ang isang eksena at dalawang pagpipilian sa bawat eksena.",
    teacherLessons: "Mga aralin mula sa inyong mga guro",
    teacherGames: "Mga larong kuwento mula sa inyong mga guro",
    playGame: "Laruin",
    timeLeft: "Natitirang oras",
    gameComplete: "Tapos na ang kuwento!",
    earnedPoints: "Nakuhang puntos",
    retryChoice: "Subukang muli ang pasya",
    backLessons: "Bumalik sa mga aralin",
    backGames: "Bumalik sa mga laro",
    publish: "Ilathala para sa mga mag-aaral",
    open: "Buksan",
    editButton: "I-edit",
    deleteButton: "Burahin",
    deleteConfirm: "Permanenteng burahin ang content na ito?",
    saved: "Nai-save ang content.",
    removed: "Nabura ang content.",
    forbidden: "Kailangan ang teacher access.",
  },
};

const ct = () => contentText[state.lang];
const esc = (value = "") =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[
        character
      ],
  );
const contentIsTeacher = () => window.sinagProfile?.role === "teacher";
const CONTENT_BUCKET = "teacher-materials";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const safeResourceUrl = (value) => {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
};

function validateTeacherContent(payload) {
  if (!["lesson","material","story"].includes(payload.kind)) throw new Error("Invalid content type.");
  for (const field of ["title_en","title_fil","body_en","body_fil"]) {
    const limit=field.startsWith("title")?160:50000;
    if(typeof payload[field]!=="string"||!payload[field].trim()||payload[field].length>limit)throw new Error(`${field.startsWith("title")?"Titles":"Content"} must contain 1–${limit} characters.`);
  }
  if(payload.resource_url && (payload.resource_url.length>2048||!safeResourceUrl(payload.resource_url)))throw new Error("Enter a valid HTTP or HTTPS resource link (maximum 2048 characters).");
  if(payload.game_config && (payload.game_config.scenes.length>32||new TextEncoder().encode(JSON.stringify(payload.game_config)).length>131072))throw new Error("Games may contain up to 32 scenes and 128 KB of configuration.");
}

const formatFileSize = (bytes) => {
  const size = Number(bytes) || 0;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

async function openContentFile(path) {
  const previewWindow = window.open("about:blank", "_blank");
  if (previewWindow) previewWindow.opener = null;
  const { data, error } = await window.sinagSupabase.storage
    .from(CONTENT_BUCKET)
    .createSignedUrl(path, 60);
  if (error) {
    previewWindow?.close();
    throw error;
  }
  if (previewWindow) previewWindow.location.href = data.signedUrl;
  else window.location.href = data.signedUrl;
}

async function loadRemoteContent() {
  if (!window.sinagSupabase || !window.sinagUser) return;
  const userId = window.sinagUser.id;
  let { data, error } = await window.sinagSupabase
    .from("content_items")
    .select("id,author_id,kind,title_en,title_fil,body_en,body_fil,resource_url,file_path,file_name,file_type,file_size,game_config,published,created_at,updated_at")
    .order("created_at", { ascending: false });
  if (error && /game_config/i.test(error.message)) {
    const withoutGameConfig = await window.sinagSupabase
      .from("content_items")
      .select("id,author_id,kind,title_en,title_fil,body_en,body_fil,resource_url,file_path,file_name,file_type,file_size,published,created_at,updated_at")
      .order("created_at", { ascending: false });
    data = withoutGameConfig.data?.map((item) => ({ ...item, game_config: null }));
    error = withoutGameConfig.error;
  }
  if (error && /file_(path|name|type|size)/i.test(error.message)) {
    const fallback = await window.sinagSupabase
      .from("content_items")
      .select("id,author_id,kind,title_en,title_fil,body_en,body_fil,resource_url,published,created_at,updated_at")
      .order("created_at", { ascending: false });
    data = fallback.data?.map((item) => ({ ...item, file_path: null, file_name: null, file_type: null, file_size: null, game_config: null }));
    error = fallback.error;
  }
  if (error) throw error;
  if (window.sinagUser?.id !== userId) return;
  remoteContent = data || [];
}

window.addEventListener("sinagbasa:signed-out",()=>{remoteContent=[];teacherEditId=null;});

function libraryPage(id) {
  const u = ct(), item = remoteContent.find((entry) => entry.id === id);
  if (item) {
    const titleText = state.lang === "fil" ? item.title_fil : item.title_en;
    const bodyText = state.lang === "fil" ? item.body_fil : item.body_en;
    const url = safeResourceUrl(item.resource_url);
    return `<a class="text-link" href="#library">← ${u.library}</a><article class="library-reader"><span class="pill">${u[item.kind]}</span><h1>${esc(titleText)}</h1><div class="library-body">${esc(bodyText).replace(/\n/g, "<br>")}</div><div class="library-resources">${item.file_path ? `<button class="primary" type="button" data-file-open="${esc(item.file_path)}">${u.openFile} · ${esc(item.file_name)} (${formatFileSize(item.file_size)}) ↗</button>` : ""}${url ? `<a class="secondary" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${u.open} ↗</a>` : ""}</div></article>`;
  }
  return `${title("READ · EXPLORE · DISCOVER", u.library, u.librarySub)}<div class="library-grid">${remoteContent.length ? remoteContent.map((entry) => {
    const itemTitle = state.lang === "fil" ? entry.title_fil : entry.title_en;
    const itemBody = state.lang === "fil" ? entry.body_fil : entry.body_en;
    return `<a class="library-card" href="#library/${entry.id}"><span class="pill">${u[entry.kind]}</span><h2>${esc(itemTitle)}</h2><p>${esc(itemBody.slice(0, 150))}${itemBody.length > 150 ? "…" : ""}</p><strong>${u.open} ＋</strong></a>`;
  }).join("") : `<div class="empty"><span>▤</span><h3>${u.empty}</h3></div>`}</div>`;
}

function legacyTeacherPage() {
  const u = ct();
  if (!contentIsTeacher()) return `<div class="feedback"><strong>${u.forbidden}</strong></div>`;
  const editing = remoteContent.find((entry) => entry.id === teacherEditId);
  const ownedContent = remoteContent.filter((entry) => entry.author_id === window.sinagUser.id);
  return `${title("CREATE · REVIEW · PUBLISH", u.teacher, u.teacherSub)}<div class="teacher-layout"><form class="teacher-form" id="teacherContentForm"><h2>${editing ? u.edit : u.create}</h2><label>Type<select name="kind" required>${["lesson", "material", "story"].map((kind) => `<option value="${kind}" ${editing?.kind === kind ? "selected" : ""}>${u[kind]}</option>`).join("")}</select></label><label>${u.titleEn}<input name="title_en" required maxlength="160" value="${esc(editing?.title_en)}"></label><label>${u.titleFil}<input name="title_fil" required maxlength="160" value="${esc(editing?.title_fil)}"></label><label>${u.bodyEn}<textarea name="body_en" required rows="8">${esc(editing?.body_en)}</textarea></label><label>${u.bodyFil}<textarea name="body_fil" required rows="8">${esc(editing?.body_fil)}</textarea></label><label>${u.link}<input name="resource_url" type="url" value="${esc(editing?.resource_url)}" placeholder="https://..."></label><label class="teacher-check"><input name="published" type="checkbox" ${editing?.published ? "checked" : ""}> ${u.publish}</label><button class="primary full" type="submit">${u.save}</button>${editing ? `<button class="secondary full" id="teacherCancel" type="button">${u.cancel}</button>` : ""}<div id="teacherStatus" class="muted" role="status"></div></form><section class="teacher-list">${ownedContent.length ? ownedContent.map((entry) => `<article><div><span class="pill">${u[entry.kind]}</span><span class="content-state ${entry.published ? "live" : ""}">${entry.published ? u.published : u.draft}</span><h3>${esc(entry.title_en)}</h3><p>${esc(entry.title_fil)}</p></div><div class="actions"><button class="secondary" data-content-edit="${entry.id}">${u.editButton}</button><button class="reset" data-content-delete="${entry.id}">${u.deleteButton}</button></div></article>`).join("") : `<p class="muted">${u.empty}</p>`}</section></div>`;
}

const defaultGameChoice = (outcome = "continue") => ({
  label_en: "",
  label_fil: "",
  outcome,
  feedback_en: "",
  feedback_fil: "",
});

const defaultGameScene = () => ({
  narrative_en: "",
  narrative_fil: "",
  question_en: "",
  question_fil: "",
  choices: [defaultGameChoice("continue"), defaultGameChoice("fail")],
});

function normalizeGameConfig(value) {
  const config = value && typeof value === "object" ? value : {};
  const scenes = Array.isArray(config.scenes) && config.scenes.length
    ? config.scenes.map((scene) => ({
        narrative_en: String(scene.narrative_en || ""),
        narrative_fil: String(scene.narrative_fil || ""),
        question_en: String(scene.question_en || ""),
        question_fil: String(scene.question_fil || ""),
        choices: Array.isArray(scene.choices) && scene.choices.length >= 2
          ? scene.choices.slice(0, 4).map((choice) => ({
              label_en: String(choice.label_en || ""),
              label_fil: String(choice.label_fil || ""),
              outcome: ["continue", "success", "fail"].includes(choice.outcome) ? choice.outcome : "continue",
              feedback_en: String(choice.feedback_en || ""),
              feedback_fil: String(choice.feedback_fil || ""),
            }))
          : [defaultGameChoice("continue"), defaultGameChoice("fail")],
      }))
    : [defaultGameScene()];
  return {
    timer: Math.max(0, Math.min(300, Number(config.timer) || 0)),
    points: Math.max(1, Math.min(1000, Number(config.points) || 100)),
    scenes,
  };
}

function gameChoiceMarkup(choice, sceneIndex, choiceIndex, u) {
  const outcomes = [
    ["continue", u.continueOutcome],
    ["success", u.successOutcome],
    ["fail", u.failOutcome],
  ];
  return `<div class="game-choice-builder" data-choice><div class="builder-row"><strong>${u.choices} ${choiceIndex + 1}</strong><button class="text-link" type="button" data-remove-choice="${sceneIndex}:${choiceIndex}">${u.removeChoice}</button></div><label>${u.choiceEn}<input data-choice-field="label_en" maxlength="240" value="${esc(choice.label_en)}" required></label><label>${u.choiceFil}<input data-choice-field="label_fil" maxlength="240" value="${esc(choice.label_fil)}" required></label><label>${u.outcome}<select data-choice-field="outcome">${outcomes.map(([value, label]) => `<option value="${value}" ${choice.outcome === value ? "selected" : ""}>${label}</option>`).join("")}</select></label><label>${u.feedbackEn}<textarea data-choice-field="feedback_en" rows="2">${esc(choice.feedback_en)}</textarea></label><label>${u.feedbackFil}<textarea data-choice-field="feedback_fil" rows="2">${esc(choice.feedback_fil)}</textarea></label></div>`;
}

function gameSceneMarkup(scene, sceneIndex, u) {
  return `<fieldset class="game-scene-builder" data-scene><legend>${u.scenes} ${sceneIndex + 1}</legend><div class="builder-row"><span></span><button class="reset" type="button" data-remove-scene="${sceneIndex}">${u.removeScene}</button></div><label>${u.narrativeEn}<textarea data-scene-field="narrative_en" rows="4" required>${esc(scene.narrative_en)}</textarea></label><label>${u.narrativeFil}<textarea data-scene-field="narrative_fil" rows="4" required>${esc(scene.narrative_fil)}</textarea></label><label>${u.questionEn}<input data-scene-field="question_en" maxlength="300" value="${esc(scene.question_en)}" required></label><label>${u.questionFil}<input data-scene-field="question_fil" maxlength="300" value="${esc(scene.question_fil)}" required></label><div class="game-choice-list">${scene.choices.map((choice, choiceIndex) => gameChoiceMarkup(choice, sceneIndex, choiceIndex, u)).join("")}</div><button class="secondary" type="button" data-add-choice="${sceneIndex}" ${scene.choices.length >= 4 ? "disabled" : ""}>${u.addChoice}</button></fieldset>`;
}

function gameBuilderMarkup(config, u) {
  return `<section class="game-builder" id="gameBuilder"><div class="builder-heading"><div><p class="eyebrow">${u.storyGame}</p><h3>${u.gameSettings}</h3></div><span class="pill">${config.scenes.length} ${u.scenes.toLowerCase()}</span></div><div class="builder-settings"><label>${u.timer}<input name="game_timer" type="number" min="0" max="300" value="${config.timer}"></label><label>${u.points}<input name="game_points" type="number" min="1" max="1000" value="${config.points}"></label></div><div id="gameScenes">${config.scenes.map((scene, index) => gameSceneMarkup(scene, index, u)).join("")}</div><button class="secondary full" type="button" id="addGameScene">${u.addScene}</button></section>`;
}

function collectGameConfig(form) {
  return {
    timer: Math.max(0, Math.min(300, Number(form.elements.game_timer?.value) || 0)),
    points: Math.max(1, Math.min(1000, Number(form.elements.game_points?.value) || 100)),
    scenes: [...form.querySelectorAll("[data-scene]")].map((sceneNode) => ({
      narrative_en: sceneNode.querySelector('[data-scene-field="narrative_en"]').value.trim(),
      narrative_fil: sceneNode.querySelector('[data-scene-field="narrative_fil"]').value.trim(),
      question_en: sceneNode.querySelector('[data-scene-field="question_en"]').value.trim(),
      question_fil: sceneNode.querySelector('[data-scene-field="question_fil"]').value.trim(),
      choices: [...sceneNode.querySelectorAll("[data-choice]")].map((choiceNode) => ({
        label_en: choiceNode.querySelector('[data-choice-field="label_en"]').value.trim(),
        label_fil: choiceNode.querySelector('[data-choice-field="label_fil"]').value.trim(),
        outcome: choiceNode.querySelector('[data-choice-field="outcome"]').value,
        feedback_en: choiceNode.querySelector('[data-choice-field="feedback_en"]').value.trim(),
        feedback_fil: choiceNode.querySelector('[data-choice-field="feedback_fil"]').value.trim(),
      })),
    })),
  };
}

function mountGameBuilder(form, initialConfig) {
  const u = ct();
  const kindSelect = form.elements.kind;
  kindSelect.querySelector('option[value="material"]')?.remove();
  let config = normalizeGameConfig(initialConfig);
  const publishLabel = form.querySelector(".teacher-check");
  publishLabel.insertAdjacentHTML("beforebegin", gameBuilderMarkup(config, u));
  let builder = form.querySelector("#gameBuilder");

  const refresh = () => {
    builder.outerHTML = gameBuilderMarkup(config, u);
    builder = form.querySelector("#gameBuilder");
    mountBuilderEvents();
    updateVisibility();
  };
  const readCurrent = () => {
    const current = form.querySelector("#gameBuilder");
    if (!current || kindSelect.value !== "story") return config;
    return collectGameConfig(form);
  };
  const updateVisibility = () => {
    const current = form.querySelector("#gameBuilder");
    current.hidden = kindSelect.value !== "story";
    current.querySelectorAll("input,textarea,select,button").forEach((control) => {
      control.disabled = kindSelect.value !== "story";
    });
    if (kindSelect.value === "story") {
      current.querySelectorAll("[data-remove-scene]").forEach((button) => { button.disabled = config.scenes.length <= 1; });
      current.querySelectorAll("[data-scene]").forEach((sceneNode) => {
        const choiceCount = sceneNode.querySelectorAll("[data-choice]").length;
        sceneNode.querySelectorAll("[data-remove-choice]").forEach((button) => { button.disabled = choiceCount <= 2; });
        const addChoice = sceneNode.querySelector("[data-add-choice]");
        if (addChoice) addChoice.disabled = choiceCount >= 4;
      });
    }
    form.querySelector(".file-upload-label").hidden = false;
  };
  const mountBuilderEvents = () => {
    const current = form.querySelector("#gameBuilder");
    current.querySelector("#addGameScene").onclick = () => {
      config = collectGameConfig(form);
      config.scenes.push(defaultGameScene());
      refresh();
    };
    current.querySelectorAll("[data-remove-scene]").forEach((button) => {
      button.disabled = config.scenes.length <= 1;
      button.onclick = () => {
        config = collectGameConfig(form);
        if (config.scenes.length > 1) config.scenes.splice(Number(button.dataset.removeScene), 1);
        refresh();
      };
    });
    current.querySelectorAll("[data-add-choice]").forEach((button) => {
      button.onclick = () => {
        config = collectGameConfig(form);
        const scene = config.scenes[Number(button.dataset.addChoice)];
        if (scene.choices.length < 4) scene.choices.push(defaultGameChoice("fail"));
        refresh();
      };
    });
    current.querySelectorAll("[data-remove-choice]").forEach((button) => {
      const [sceneIndex, choiceIndex] = button.dataset.removeChoice.split(":").map(Number);
      button.disabled = config.scenes[sceneIndex].choices.length <= 2;
      button.onclick = () => {
        config = collectGameConfig(form);
        if (config.scenes[sceneIndex].choices.length > 2) config.scenes[sceneIndex].choices.splice(choiceIndex, 1);
        refresh();
      };
    });
  };

  kindSelect.onchange = () => {
    if (kindSelect.value === "story") config = readCurrent();
    updateVisibility();
  };
  mountBuilderEvents();
  updateVisibility();
}

function teacherPage() {
  const u = ct();
  if (!contentIsTeacher()) return `<div class="feedback"><strong>${u.forbidden}</strong></div>`;
  const editing = remoteContent.find((entry) => entry.id === teacherEditId);
  const ownedContent = remoteContent.filter((entry) => entry.author_id === window.sinagUser.id);
  const currentAttachment = editing?.file_path
    ? `<div class="current-attachment"><span><strong>${u.currentFile}</strong><small>${esc(editing.file_name)} · ${formatFileSize(editing.file_size)}</small></span><button class="text-link" type="button" data-file-open="${esc(editing.file_path)}">${u.openFile} ↗</button></div><label class="teacher-check"><input name="remove_file" type="checkbox"> ${u.removeFile}</label>`
    : "";
  const ownedList = ownedContent.length
    ? ownedContent.map((entry) => `<article><div><span class="pill">${u[entry.kind]}</span><span class="content-state ${entry.published ? "live" : ""}">${entry.published ? u.published : u.draft}</span><h3>${esc(entry.title_en)}</h3><p>${esc(entry.title_fil)}</p>${entry.file_path ? `<small class="attachment-meta">▣ ${esc(entry.file_name)} · ${formatFileSize(entry.file_size)}</small>` : ""}</div><div class="actions"><button class="secondary" data-content-edit="${entry.id}">${u.editButton}</button><button class="reset" data-content-delete="${entry.id}">${u.deleteButton}</button></div></article>`).join("")
    : `<p class="muted">${u.empty}</p>`;
  return `${title("CREATE · REVIEW · PUBLISH", u.teacher, u.teacherSub)}
    <div class="teacher-layout">
      <form class="teacher-form" id="teacherContentForm">
        <h2>${editing ? u.edit : u.create}</h2>
        <label>Type<select name="kind" required>${["lesson", "material", "story"].map((kind) => `<option value="${kind}" ${editing?.kind === kind ? "selected" : ""}>${u[kind]}</option>`).join("")}</select></label>
        <label>${u.titleEn}<input name="title_en" required maxlength="160" value="${esc(editing?.title_en)}"></label>
        <label>${u.titleFil}<input name="title_fil" required maxlength="160" value="${esc(editing?.title_fil)}"></label>
        <label>${u.bodyEn}<textarea name="body_en" required rows="8">${esc(editing?.body_en)}</textarea></label>
        <label>${u.bodyFil}<textarea name="body_fil" required rows="8">${esc(editing?.body_fil)}</textarea></label>
        <label>${u.link}<input name="resource_url" type="url" value="${esc(editing?.resource_url)}" placeholder="https://..."></label>
        <label class="file-upload-label">${u.attachment}<input name="attachment" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.webp"><small>${u.attachmentHelp}</small></label>
        ${currentAttachment}
        <label class="teacher-check"><input name="published" type="checkbox" ${editing?.published ? "checked" : ""}> ${u.publish}</label>
        <div class="teacher-form-actions"><button class="primary" type="submit">${u.save}</button>${editing ? `<button class="secondary" id="teacherCancel" type="button">${u.cancel}</button>` : ""}</div>
        <div id="teacherStatus" class="muted" role="status"></div>
      </form>
      <details class="teacher-published">
        <summary><span>${state.lang === "fil" ? "Iyong mga nilalaman" : "Your published content and drafts"}</span><small>${ownedContent.length} ${state.lang === "fil" ? "item" : "items"}</small></summary>
        <section class="teacher-list">${ownedList}</section>
      </details>
    </div>`;
}

const publishedTeacherContent = (kind) => remoteContent.filter((item) => item.kind === kind && (item.published || contentIsTeacher()));
const customContentId = (routeId) => String(routeId || "").startsWith("custom-") ? String(routeId).slice(7) : null;

function teacherLessonPage(item) {
  const u = ct();
  const titleText = state.lang === "fil" ? item.title_fil : item.title_en;
  const bodyText = state.lang === "fil" ? item.body_fil : item.body_en;
  const resourceUrl = safeResourceUrl(item.resource_url);
  return `<a class="text-link" href="#lessons">← ${u.backLessons}</a><article class="library-reader teacher-lesson-reader"><span class="pill">${u.lesson}</span><h1>${esc(titleText)}</h1><div class="library-body">${esc(bodyText).replace(/\n/g, "<br>")}</div><div class="library-resources">${item.file_path ? `<button class="primary" type="button" data-file-open="${esc(item.file_path)}">${u.openFile} · ${esc(item.file_name)} (${formatFileSize(item.file_size)}) ↗</button>` : ""}${resourceUrl ? `<a class="secondary" href="${esc(resourceUrl)}" target="_blank" rel="noopener noreferrer">${u.open} ↗</a>` : ""}</div></article>`;
}

const lessonsWithTeacherContent = lessonsPage;
lessonsPage = function (id) {
  const contentId = customContentId(id);
  if (contentId) {
    const item = remoteContent.find((entry) => entry.id === contentId && entry.kind === "lesson");
    return item ? teacherLessonPage(item) : lessonsWithTeacherContent();
  }
  const html = lessonsWithTeacherContent(id);
  if (id !== undefined) return html;
  const lessons = publishedTeacherContent("lesson");
  if (!lessons.length) return html;
  const u = ct();
  return `${html}<section class="section teacher-content-section"><div class="section-heading"><div><p class="eyebrow">TEACHER STUDIO</p><h2>${u.teacherLessons}</h2></div></div><div class="cards">${lessons.map((item) => { const itemTitle = state.lang === "fil" ? item.title_fil : item.title_en; const itemBody = state.lang === "fil" ? item.body_fil : item.body_en; return `<a class="lesson-card teacher-lesson-card" href="#lessons/custom-${item.id}"><div class="card-top"><span class="number">✎</span><span class="pill">${item.published ? u.published : u.draft}</span></div><div class="lesson-icon">▤</div><p class="eyebrow">${u.lesson}</p><h3>${esc(itemTitle)}</h3><p>${esc(itemBody.slice(0, 150))}${itemBody.length > 150 ? "…" : ""}</p><span class="card-link">${u.open} ＋</span></a>`; }).join("")}</div></section>`;
};

let teacherGameSession = null;
let teacherGameTimer = null;

function teacherStoryGamePage(item) {
  const u = ct();
  const config = normalizeGameConfig(item.game_config);
  if (!teacherGameSession || teacherGameSession.id !== item.id) {
    teacherGameSession = { id: item.id, scene: 0, feedback: "", complete: false, deadline: null };
  }
  const l = state.lang === "fil" ? "fil" : "en";
  const titleText = l === "fil" ? item.title_fil : item.title_en;
  const intro = l === "fil" ? item.body_fil : item.body_en;
  if (teacherGameSession.complete) {
    return `<a class="text-link" href="#games">← ${u.backGames}</a><section class="custom-game-complete"><span>✺</span><p class="eyebrow">${u.storyGame}</p><h1>${u.gameComplete}</h1><h2>${esc(titleText)}</h2><strong>+${config.points} ${u.earnedPoints}</strong><div class="actions"><button class="primary" id="replayTeacherGame">${u.playGame}</button><a class="secondary" href="#games">${u.backGames}</a></div></section>`;
  }
  const scene = config.scenes[Math.min(teacherGameSession.scene, config.scenes.length - 1)];
  if (config.timer > 0 && !teacherGameSession.deadline) teacherGameSession.deadline = Date.now() + config.timer * 1000;
  return `<a class="text-link" href="#games">← ${u.backGames}</a><section class="custom-story-game"><header><div><p class="eyebrow">${u.storyGame} · ${u.scenes} ${teacherGameSession.scene + 1}/${config.scenes.length}</p><h1>${esc(titleText)}</h1></div>${config.timer > 0 ? `<div class="custom-game-timer"><span>${u.timeLeft}</span><strong id="teacherGameTime">${config.timer}s</strong></div>` : ""}</header><div class="custom-story-layout"><article><p class="custom-game-intro">${esc(intro)}</p><div class="custom-scene-copy">${esc(scene[`narrative_${l}`]).replace(/\n/g, "<br>")}</div></article><section class="custom-decision"><p class="eyebrow">${u.outcome}</p><h2>${esc(scene[`question_${l}`])}</h2><div class="option-list">${scene.choices.map((choice, index) => `<button class="option" data-teacher-game-choice="${index}"><span>${String.fromCharCode(65 + index)}</span>${esc(choice[`label_${l}`])}</button>`).join("")}</div>${teacherGameSession.feedback ? `<div class="feedback" role="status"><strong>${esc(teacherGameSession.feedback)}</strong><p>${u.retryChoice}</p></div>` : ""}</section></div></section>`;
}

const gamesWithTeacherContent = gamesPage;
gamesPage = function (id) {
  const contentId = customContentId(id);
  if (contentId) {
    const item = remoteContent.find((entry) => entry.id === contentId && entry.kind === "story");
    return item ? teacherStoryGamePage(item) : gamesWithTeacherContent();
  }
  const html = gamesWithTeacherContent(id);
  if (id !== undefined) return html;
  const games = publishedTeacherContent("story").filter((item) => item.game_config);
  if (!games.length) return html;
  const u = ct();
  return `${html}<section class="section teacher-content-section"><div class="section-heading"><div><p class="eyebrow">TEACHER STUDIO</p><h2>${u.teacherGames}</h2></div></div><div class="arcade-catalog teacher-game-catalog">${games.map((item) => { const itemTitle = state.lang === "fil" ? item.title_fil : item.title_en; const itemBody = state.lang === "fil" ? item.body_fil : item.body_en; const config = normalizeGameConfig(item.game_config); const completed = Boolean(state.customGames?.[item.id]?.complete); return `<a class="arcade-card purple-theme" href="#games/custom-${item.id}"><div class="arcade-card-top"><span class="arcade-emblem">◇</span><span class="pill">${config.scenes.length} ${u.scenes.toLowerCase()}</span></div><p class="eyebrow">${u.storyGame}</p><h2>${esc(itemTitle)}</h2><p>${esc(itemBody.slice(0, 150))}${itemBody.length > 150 ? "…" : ""}</p><div class="arcade-card-foot"><span>${completed ? "✓ " + u.published : config.points + " pts"}</span><strong>${u.playGame} ＋</strong></div></a>`; }).join("")}</div></section>`;
};

const headerWithLibrary = header;
header = function () {
  headerWithLibrary();
  if (!window.sinagUser) return;
  const nav = $("nav");
  nav.insertAdjacentHTML("beforeend", `<a href="#library" title="${ct().library}" aria-label="${ct().library}" data-label="${ct().library}" ${route()[0] === "library" ? 'aria-current="page"' : ""}><span class="side-icon" aria-hidden="true">▤</span><span class="side-label">${ct().library}</span></a>${contentIsTeacher() ? `<a href="#teacher" title="${ct().teacher}" aria-label="${ct().teacher}" data-label="${ct().teacher}" ${route()[0] === "teacher" ? 'aria-current="page"' : ""}><span class="side-icon" aria-hidden="true">✎</span><span class="side-label">${ct().teacher}</span></a>` : ""}`);
};

const renderWithLibrary = render;
render = function () {
  const [page, id] = route();
  if (!window.sinagUser || !["library", "teacher"].includes(page)) return renderWithLibrary();
  document.body.dataset.page = page;
  header();
  $("main").innerHTML = page === "library" ? libraryPage(id) : teacherPage();
  bind(page, id);
};

const bindWithLibrary = bind;
bind = function (page, id) {
  bindWithLibrary(page, id);
  if (page !== "teacher" || !contentIsTeacher()) return;
  const form = $("teacherContentForm");
  if (form) form.onsubmit = async (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form));
    const payload = {
      author_id: window.sinagUser.id,
      kind: values.kind,
      title_en: values.title_en.trim(),
      title_fil: values.title_fil.trim(),
      body_en: values.body_en.trim(),
      body_fil: values.body_fil.trim(),
      resource_url: values.resource_url.trim() || null,
      published: values.published === "on",
    };
    const query = teacherEditId
      ? window.sinagSupabase.from("content_items").update(payload).eq("id", teacherEditId)
      : window.sinagSupabase.from("content_items").insert(payload);
    const { error } = await query;
    if (error) return void ($("teacherStatus").textContent = error.message);
    teacherEditId = null;
    await loadRemoteContent();
    render();
  };
  if ($("teacherCancel")) $("teacherCancel").onclick = () => { teacherEditId = null; render(); };
  document.querySelectorAll("[data-content-edit]").forEach((button) => button.onclick = () => { teacherEditId = button.dataset.contentEdit; render(); });
  document.querySelectorAll("[data-content-delete]").forEach((button) => button.onclick = async () => {
    if (!confirm(ct().deleteConfirm)) return;
    const { error } = await window.sinagSupabase.from("content_items").delete().eq("id", button.dataset.contentDelete);
    if (error) return alert(error.message);
    await loadRemoteContent();
    render();
  });
};

window.loadRemoteContent = loadRemoteContent;

const bindWithFileUploads = bind;
bind = function (page, id) {
  bindWithFileUploads(page, id);

  if (teacherGameTimer) {
    clearInterval(teacherGameTimer);
    teacherGameTimer = null;
  }

  document.querySelectorAll("[data-file-open]").forEach((button) => {
    button.onclick = async () => {
      button.disabled = true;
      try {
        await openContentFile(button.dataset.fileOpen);
      } catch (error) {
        alert(error.message);
      } finally {
        button.disabled = false;
      }
    };
  });

  const activeGameId = page === "games" ? customContentId(id) : null;
  if (activeGameId) {
    const item = remoteContent.find((entry) => entry.id === activeGameId && entry.kind === "story");
    const config = item ? normalizeGameConfig(item.game_config) : null;
    const completeGame = () => {
      teacherGameSession.complete = true;
      state.customGames ||= {};
      state.customGames[activeGameId] = { complete: true, score: config.points, updatedAt: new Date().toISOString() };
      save();
      render();
    };
    document.querySelectorAll("[data-teacher-game-choice]").forEach((button) => {
      button.onclick = () => {
        const scene = config.scenes[teacherGameSession.scene];
        const choice = scene.choices[Number(button.dataset.teacherGameChoice)];
        const feedback = state.lang === "fil" ? choice.feedback_fil : choice.feedback_en;
        teacherGameSession.deadline = null;
        if (choice.outcome === "fail") {
          teacherGameSession.feedback = feedback || ct().retryChoice;
          render();
          return;
        }
        if (choice.outcome === "success" || teacherGameSession.scene >= config.scenes.length - 1) {
          completeGame();
          return;
        }
        teacherGameSession.scene += 1;
        teacherGameSession.feedback = "";
        render();
      };
    });
    if ($("replayTeacherGame")) $("replayTeacherGame").onclick = () => { teacherGameSession = null; render(); };
    if (config?.timer > 0 && $("teacherGameTime")) {
      teacherGameTimer = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((teacherGameSession.deadline - Date.now()) / 1000));
        const output = $("teacherGameTime");
        if (output) output.textContent = `${remaining}s`;
        if (remaining <= 0) {
          clearInterval(teacherGameTimer);
          teacherGameTimer = null;
          teacherGameSession.feedback = ct().retryChoice;
          teacherGameSession.deadline = null;
          render();
        }
      }, 250);
    }
  }

  if (page !== "teacher" || !contentIsTeacher()) return;
  const form = $("teacherContentForm");
  if (!form) return;
  const initialEditing = remoteContent.find((entry) => entry.id === teacherEditId);
  mountGameBuilder(form, initialEditing?.game_config);
  document.querySelectorAll("[data-content-edit]").forEach((button) => {
    const item = remoteContent.find((entry) => entry.id === button.dataset.contentEdit);
    if (item?.kind === "story") {
      button.closest(".actions").insertAdjacentHTML("afterbegin", `<a class="secondary" href="#games/custom-${item.id}">${ct().preview}</a>`);
    }
  });

  form.onsubmit = async (event) => {
    event.preventDefault();
    const u = ct();
    const status = $("teacherStatus");
    const submit = form.querySelector('[type="submit"]');
    const file = form.elements.attachment.files[0];
    const editing = remoteContent.find((entry) => entry.id === teacherEditId);

    if (file && file.size > MAX_FILE_SIZE) {
      status.textContent = u.fileTooLarge;
      return;
    }
    if (file && !ALLOWED_FILE_TYPES.has(file.type)) {
      status.textContent = u.fileTypeInvalid;
      return;
    }

    submit.disabled = true;
    status.textContent = file ? u.uploading : "";
    let uploadedPath = null;

    try {
      const values = Object.fromEntries(new FormData(form));
      const payload = {
        author_id: window.sinagUser.id,
        kind: values.kind,
        title_en: values.title_en.trim(),
        title_fil: values.title_fil.trim(),
        body_en: values.body_en.trim(),
        body_fil: values.body_fil.trim(),
        resource_url: values.resource_url.trim() || null,
        published: values.published === "on",
      };

      if (values.kind === "story") payload.game_config = collectGameConfig(form);
      else if (editing?.game_config) payload.game_config = null;

      if (values.kind === "story" && payload.game_config.scenes.some((scene) => scene.choices.length < 2)) {
        throw new Error(u.invalidGame);
      }

      validateTeacherContent(payload);
      if (file) {
        const safeName = file.name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "attachment";
        const uniqueId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        uploadedPath = `${window.sinagUser.id}/${uniqueId}-${safeName}`;
        const { error: uploadError } = await window.sinagSupabase.storage
          .from(CONTENT_BUCKET)
          .upload(uploadedPath, file, { cacheControl: "3600", upsert: false, contentType: file.type });
        if (uploadError) throw uploadError;
        Object.assign(payload, {
          file_path: uploadedPath,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
        });
      } else if (values.remove_file === "on") {
        Object.assign(payload, { file_path: null, file_name: null, file_type: null, file_size: null });
      }

      const query = teacherEditId
        ? window.sinagSupabase.from("content_items").update(payload).eq("id", teacherEditId)
        : window.sinagSupabase.from("content_items").insert(payload);
      const { error } = await query;
      if (error) throw error;

      if (editing?.file_path && (uploadedPath || values.remove_file === "on")) {
        await window.sinagSupabase.storage.from(CONTENT_BUCKET).remove([editing.file_path]);
      }
      teacherEditId = null;
      await loadRemoteContent();
      render();
    } catch (error) {
      if (uploadedPath) await window.sinagSupabase.storage.from(CONTENT_BUCKET).remove([uploadedPath]);
      status.textContent = error.message;
      submit.disabled = false;
    }
  };

  document.querySelectorAll("[data-content-delete]").forEach((button) => {
    button.onclick = async () => {
      if (!confirm(ct().deleteConfirm)) return;
      const item = remoteContent.find((entry) => entry.id === button.dataset.contentDelete);
      const { error } = await window.sinagSupabase.from("content_items").delete().eq("id", button.dataset.contentDelete);
      if (error) return alert(error.message);
      if (item?.file_path) {
        const { error: fileError } = await window.sinagSupabase.storage.from(CONTENT_BUCKET).remove([item.file_path]);
        if (fileError) alert(fileError.message);
      }
      await loadRemoteContent();
      render();
    };
  });
};
