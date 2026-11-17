"use strict";

let cloudUser = null;
let cloudSyncTimer = null;
let cloudSyncing = false;
let cloudReady = false;

function validCloudState(value) {
  return (
    value &&
    typeof value === "object" &&
    Array.isArray(value.lessons) &&
    value.missions &&
    typeof value.missions === "object" &&
    Array.isArray(value.activity)
  );
}

function cloudStateSnapshot() {
  return JSON.parse(JSON.stringify(state));
}

function restoreCloudStory() {
  const saved = state.story;
  if (
    typeof storyState === "undefined" ||
    !saved ||
    !Number.isInteger(saved.chapter) ||
    !STORY_CHAPTERS[saved.chapter]?.nodes?.[saved.node]
  ) return;
  storyState = {
    ...saved,
    complete: Array.isArray(saved.complete) ? saved.complete : [],
    trail: Array.isArray(saved.trail) ? saved.trail.slice(-60) : [],
    clues: Array.isArray(saved.clues) ? saved.clues : [],
    paused: false,
  };
  chosenStoryMode = storyState.mode === "relaxed" ? "relaxed" : "timed";
}

async function uploadCloudProgress() {
  if (!cloudReady || !cloudUser || cloudSyncing) return;
  cloudSyncing = true;
  try {
    const { error } = await window.sinagSupabase
      .from("student_progress")
      .upsert(
        { user_id: cloudUser.id, state: cloudStateSnapshot() },
        { onConflict: "user_id" },
      );
    if (error) throw error;
    window.setCloudStatus?.("saved");
  } catch (error) {
    console.error("Progress sync failed", error);
    window.setCloudStatus?.("error");
  } finally {
    cloudSyncing = false;
  }
}

function queueCloudProgress() {
  if (!cloudReady || !cloudUser) return;
  window.setCloudStatus?.("saving");
  clearTimeout(cloudSyncTimer);
  cloudSyncTimer = setTimeout(uploadCloudProgress, 650);
}

const localSave = save;
save = function () {
  localSave();
  queueCloudProgress();
};

async function startCloudProgress(user) {
  cloudUser = user;
  cloudReady = false;
  window.setCloudStatus?.("loading");
  const { data, error } = await window.sinagSupabase
    .from("student_progress")
    .select("state")
    .eq("user_id", user.id)
    .maybeSingle();
  if (cloudUser?.id !== user.id) return;
  if (error) throw error;
  if (data?.state && validCloudState(data.state)) {
    state = { ...state, ...data.state, lang: data.state.lang === "fil" ? "fil" : "en" };
    restoreCloudStory();
    localSave();
  } else {
    cloudReady = true;
    await uploadCloudProgress();
  }
  cloudReady = true;
  window.setCloudStatus?.("saved");
  render();
}

function stopCloudProgress() {
  clearTimeout(cloudSyncTimer);
  cloudUser = null;
  cloudReady = false;
}

window.startCloudProgress = startCloudProgress;
window.stopCloudProgress = stopCloudProgress;
