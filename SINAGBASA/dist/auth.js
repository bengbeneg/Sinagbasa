"use strict";

window.sinagSupabase = null;
window.sinagUser = null;
window.sinagProfile = null;

const authText = {
  en: {
    landingEyebrow: "READING OPENS POSSIBILITIES",
    landingTitle: "Build stronger readers, one story at a time.",
    landingSub: "A bilingual learning space where senior high school students read closely, think critically, and grow through interactive challenges.",
    feat1: "Bilingual Lessons & Skills",
    feat2: "7 Arcade & Story Game Modes",
    feat3: "Track Mastery Stars & Progress",
    trustNote: "Free for students & teachers · Zero setup required",
    getStarted: "Get started",
    photoAlt: "Students reading books together in a classroom",
    photoCaption: "Learning grows when every reader has a place in the story.",
    challengeEyebrow: "WHY THIS MATTERS",
    challengeTitle: "Reading is more than recognizing words.",
    functionalRate: "70.8%",
    functionalLabel: "of Filipinos aged 10–64 were functionally literate in 2024.",
    pisaRate: "24%",
    pisaLabel: "of Filipino 15-year-olds reached at least Level 2 reading proficiency in PISA 2022.",
    sourceLabel: "View official source",
    missionEyebrow: "OUR PURPOSE",
    missionTitle: "What SINAGBASA intends to do",
    missionBody: "SINAGBASA turns reading practice into an active learning journey. Filipino stories, comprehension challenges, educational games, and progress tracking help senior high school students read closely, think critically, and build confidence.",
    missionNote: "The goal is not only to finish a story, but to understand it, reflect on it, and carry its lessons forward.",
    backLanding: "Back to welcome page",
    welcome: "Welcome to SINAGBASA",
    sub: "Sign in to continue your reading journey.",
    signupSub: "Create your account to begin your reading journey.",
    login: "Log in",
    signup: "Create account",
    name: "Full name",
    email: "Email address",
    password: "Password",
    confirmPassword: "Confirm password",
    noAccount: "Don't have an account yet?",
    haveAccount: "Already have an account?",
    signUpLink: "Sign up",
    loginLink: "Log in",
    required: "This field is required.",
    invalidEmail: "Enter a valid email address.",
    nameShort: "Enter at least 2 characters.",
    passwordMismatch: "Passwords do not match.",
    passwordRequirements: "Password must contain:",
    passwordRules: ["At least 8 characters", "One uppercase letter", "One lowercase letter", "One number", "One special character"],
    invalidLogin: "Incorrect email or password.",
    emailUnverified: "Verify your email before logging in.",
    accountExists: "An account with this email already exists.",
    forgot: "Forgot password?",
    sendReset: "Send reset link",
    updatePassword: "Set new password",
    newPassword: "New password",
    verifyTitle: "Check your email",
    verify: "We sent a verification link. Verify your email before logging in.",
    resend: "Create another account",
    logout: "Log out",
    saving: "Saving…",
    saved: "Progress synced",
    loading: "Loading progress…",
    syncError: "Progress sync unavailable",
    authError: "Authentication could not start. Check the connection and Supabase setup.",
    resetSent: "Password reset instructions were sent to your email.",
    passwordUpdated: "Password updated. You can continue to the app.",
    recoveryExpired: "This password reset link is invalid or expired. Request a new reset link below.",
  },
  fil: {
    landingEyebrow: "NAGBUBUKAS NG PAGKAKATAON ANG PAGBASA",
    landingTitle: "Palakasin ang bawat mambabasa, isang kuwento sa bawat pagkakataon.",
    landingSub: "Isang bilingual na learning space kung saan masusing nagbabasa, kritikal na nag-iisip, at natututo sa interactive challenges ang mga senior high school student.",
    feat1: "Bilingguwal na Aralin at Kasanayan",
    feat2: "7 Arcade at Story Game Modes",
    feat3: "Subaybayan ang Mastery Stars at Progreso",
    trustNote: "Libre para sa mag-aaral at guro · Walang setup",
    getStarted: "Magsimula",
    photoAlt: "Mga mag-aaral na sama-samang nagbabasa sa silid-aralan",
    photoCaption: "Lumago ang pagkatuto kapag may puwang ang bawat mambabasa sa kuwento.",
    challengeEyebrow: "BAKIT ITO MAHALAGA",
    challengeTitle: "Higit pa sa pagkilala ng mga salita ang pagbasa.",
    functionalRate: "70.8%",
    functionalLabel: "ng mga Pilipinong edad 10–64 ang functionally literate noong 2024.",
    pisaRate: "24%",
    pisaLabel: "ng mga Pilipinong 15 taong gulang ang umabot sa hindi bababa sa Level 2 reading proficiency sa PISA 2022.",
    sourceLabel: "Tingnan ang opisyal na sanggunian",
    missionEyebrow: "ANG AMING LAYUNIN",
    missionTitle: "Ano ang layunin ng SINAGBASA",
    missionBody: "Ginagawang aktibong paglalakbay ng SINAGBASA ang pagsasanay sa pagbasa. Tinutulungan ng mga kuwentong Filipino, comprehension challenge, larong pang-edukasyon, at progress tracking ang mga senior high school student na magsuri, mag-isip nang kritikal, at magkaroon ng tiwala sa sarili.",
    missionNote: "Ang layunin ay hindi lamang matapos ang kuwento, kundi maunawaan ito, pagnilayan, at dalhin ang mga aral nito.",
    backLanding: "Bumalik sa welcome page",
    welcome: "Maligayang pagdating sa SINAGBASA",
    sub: "Mag-log in upang ipagpatuloy ang iyong paglalakbay sa pagbasa.",
    signupSub: "Gumawa ng account upang simulan ang iyong paglalakbay sa pagbasa.",
    login: "Mag-log in",
    signup: "Gumawa ng account",
    name: "Buong pangalan",
    email: "Email address",
    password: "Password",
    confirmPassword: "Kumpirmahin ang password",
    noAccount: "Wala ka pang account?",
    haveAccount: "May account ka na?",
    signUpLink: "Mag-sign up",
    loginLink: "Mag-log in",
    required: "Kailangang punan ang field na ito.",
    invalidEmail: "Maglagay ng wastong email address.",
    nameShort: "Maglagay ng hindi bababa sa 2 character.",
    passwordMismatch: "Hindi magkatugma ang mga password.",
    passwordRequirements: "Dapat taglayin ng password ang:",
    passwordRules: ["Hindi bababa sa 8 character", "Isang malaking titik", "Isang maliit na titik", "Isang numero", "Isang special character"],
    invalidLogin: "Mali ang email o password.",
    emailUnverified: "I-verify muna ang email bago mag-log in.",
    accountExists: "May account na gamit ang email na ito.",
    forgot: "Nakalimutan ang password?",
    sendReset: "Ipadala ang reset link",
    updatePassword: "Itakda ang bagong password",
    newPassword: "Bagong password",
    verifyTitle: "Tingnan ang iyong email",
    verify: "Nagpadala kami ng verification link. I-verify ang email bago mag-log in.",
    resend: "Gumawa ng ibang account",
    logout: "Mag-log out",
    saving: "Sine-save…",
    saved: "Naka-sync ang progreso",
    loading: "Kinukuha ang progreso…",
    syncError: "Hindi available ang progress sync",
    authError: "Hindi masimulan ang authentication. Suriin ang koneksyon at Supabase setup.",
    resetSent: "Ipinadala sa iyong email ang password reset instructions.",
    passwordUpdated: "Nabago ang password. Maaari ka nang magpatuloy.",
    recoveryExpired: "Hindi wasto o nag-expire na ang reset link. Humiling ng bagong reset link sa ibaba.",
  },
};

let authMode = "login";
let authBusy = false;
let activeUserId = null;
let activeActivation = null;
// Capture the callback before Supabase consumes and removes its URL fragment.
const authCallback = new URLSearchParams(location.hash.slice(1));
const passwordResetPage = new URLSearchParams(location.search).get("auth") === "reset-password";
const recoveryStorageKey = "sinagbasa-password-recovery";
let recoveryPending = passwordResetPage || authCallback.get("type") === "recovery";
try {
  recoveryPending ||= sessionStorage.getItem(recoveryStorageKey) === "pending";
} catch {}
const authCallbackError = authCallback.get("error") || authCallback.get("error_code");

function setRecoveryPending(pending) {
  recoveryPending = pending;
  try {
    if (pending) sessionStorage.setItem(recoveryStorageKey, "pending");
    else sessionStorage.removeItem(recoveryStorageKey);
  } catch {}
}

function clearPasswordResetUrl() {
  const url = new URL(location.href);
  url.searchParams.delete("auth");
  url.hash = "";
  history.replaceState(null, "", `${url.pathname}${url.search}`);
}

function showRecoveryForm() {
  authMode = "reset";
  document.body.classList.remove("authenticated");
  authForm();
}
const authLang = () => state?.lang === "fil" ? "fil" : "en";
const au = () => authText[authLang()];
const authRedirectUrl = () => `${location.origin}${location.pathname}`;
const passwordResetRedirectUrl = () => `${authRedirectUrl()}?auth=reset-password`;

function ensureAuthGate() {
  let gate = document.getElementById("authGate");
  if (!gate) {
    gate = document.createElement("div");
    gate.id = "authGate";
    gate.className = "auth-gate";
    document.body.append(gate);
  }
  gate.hidden = false;
  return gate;
}

function landingPage() {
  const u = au();
  authMode = "landing";
  ensureAuthGate().innerHTML = `<main class="landing-page"><section class="landing-shell"><section class="landing-copy"><div class="landing-top"><div class="landing-logo"><span>✺</span><strong>SINAG<span>BASA</span></strong><small>LEARN · PLAY · GROW</small></div></div><div class="landing-main"><p class="eyebrow">${u.landingEyebrow}</p><h1>${u.landingTitle}</h1><p class="landing-lead">${u.landingSub}</p><div class="landing-highlights"><div class="landing-pill"><span>✦</span> ${u.feat1}</div><div class="landing-pill"><span>◈</span> ${u.feat2}</div><div class="landing-pill"><span>★</span> ${u.feat3}</div></div></div><div class="landing-foot"><div class="landing-actions"><button class="primary" data-auth-mode="signup">${u.getStarted}</button><button class="secondary" data-auth-mode="login">${u.login}</button></div><p class="landing-trust">✓ ${u.trustNote}</p></div></section><figure class="landing-photo"><img src="assets/222.jpg" alt="${u.photoAlt}"><figcaption>${u.photoCaption}</figcaption></figure></section><section class="landing-details" aria-labelledby="landing-impact-title"><div class="landing-section-heading"><p class="eyebrow">${u.challengeEyebrow}</p><h2 id="landing-impact-title">${u.challengeTitle}</h2></div><div class="landing-card impact-stat"><strong>${u.functionalRate}</strong><p>${u.functionalLabel}</p><a href="https://psa.gov.ph/content/every-10-filipinos-9-have-basic-literacy-while-7-have-functional-literacy" target="_blank" rel="noopener noreferrer">PSA · 2024 FLEMMS <span>↗</span><small>${u.sourceLabel}</small></a></div><div class="landing-card impact-stat"><strong>${u.pisaRate}</strong><p>${u.pisaLabel}</p><a href="https://www.oecd.org/en/publications/pisa-2022-results-volume-i-and-ii-country-notes_ed6fbcc5-en/philippines_a0882a2d-en.html" target="_blank" rel="noopener noreferrer">OECD · PISA 2022 <span>↗</span><small>${u.sourceLabel}</small></a></div><article class="landing-card purpose-card"><p class="eyebrow">${u.missionEyebrow}</p><h2>${u.missionTitle}</h2><p>${u.missionBody}</p><p class="mission-note">${u.missionNote}</p></article></section></main>`;
  bindAuthGate();
}

function authForm(message = "") {
  const u = au(), signup = authMode === "signup", forgot = authMode === "forgot", reset = authMode === "reset";
  const passwordRules = signup || reset
    ? `<div class="password-rules" id="passwordRules"><strong>${u.passwordRequirements}</strong>${u.passwordRules.map((rule, index) => `<span data-password-rule="${index}"><i aria-hidden="true">○</i>${rule}</span>`).join("")}</div>`
    : "";
  const switchLink = signup
    ? `<p class="auth-switch">${u.haveAccount} <button data-auth-mode="login">${u.loginLink}</button></p>`
    : !forgot && !reset
      ? `<p class="auth-switch">${u.noAccount} <button data-auth-mode="signup">${u.signUpLink}</button></p>`
      : forgot
        ? `<p class="auth-switch"><button data-auth-mode="login">← ${u.loginLink}</button></p>`
        : "";
  ensureAuthGate().innerHTML = `<section class="auth-shell auth-dialog"><div class="auth-card"><button class="auth-back" data-auth-mode="landing">← ${u.backLanding}</button><div class="auth-logo"><span>✺</span><strong>SINAG<span>BASA</span></strong></div><p class="eyebrow">${signup ? u.signup : reset ? u.updatePassword : forgot ? u.forgot : u.login}</p><h1>${u.welcome}</h1><p>${signup ? u.signupSub : u.sub}</p><form id="authForm" novalidate>${signup ? `<label>${u.name}<input name="name" autocomplete="name" maxlength="100" aria-describedby="nameError"><small class="field-error" id="nameError" data-error-for="name"></small></label>` : ""}${!reset ? `<label>${u.email}<input name="email" type="email" autocomplete="email" aria-describedby="emailError"><small class="field-error" id="emailError" data-error-for="email"></small></label>` : ""}${!forgot ? `<label>${reset ? u.newPassword : u.password}<input name="password" type="password" autocomplete="${signup || reset ? "new-password" : "current-password"}" aria-describedby="passwordError"><small class="field-error" id="passwordError" data-error-for="password"></small></label>${passwordRules}` : ""}${signup ? `<label>${u.confirmPassword}<input name="confirmPassword" type="password" autocomplete="new-password" aria-describedby="confirmPasswordError"><small class="field-error" id="confirmPasswordError" data-error-for="confirmPassword"></small></label>` : ""}<button class="primary full auth-submit" type="submit" ${authBusy ? "disabled" : ""}>${reset ? u.updatePassword : forgot ? u.sendReset : signup ? u.signup : u.login}</button></form>${!signup && !forgot && !reset ? `<button class="auth-link" data-auth-mode="forgot">${u.forgot}</button>` : ""}${switchLink}<div class="auth-message" id="authMessage" role="status">${esc(message)}</div></div></section>`;
  bindAuthGate();
}

function verificationScreen(email) {
  const u = au();
  ensureAuthGate().innerHTML = `<section class="auth-shell"><div class="auth-card auth-notice"><span class="auth-mail">✉</span><p class="eyebrow">EMAIL VERIFICATION</p><h1>${u.verifyTitle}</h1><p>${u.verify}</p><strong>${esc(email)}</strong><button class="secondary full" data-auth-mode="login">${u.login}</button></div></section>`;
  bindAuthGate();
}

const passwordSpecialCharacters = "!@#$%^&*()_+-=[]{};'\\:\"|<>?,./`~";
const passwordTests = [
  (value) => value.length >= 8,
  (value) => /[A-Z]/.test(value),
  (value) => /[a-z]/.test(value),
  (value) => /[0-9]/.test(value),
  (value) => [...value].some((character) => passwordSpecialCharacters.includes(character)),
];

function updatePasswordRules(value = "") {
  document.querySelectorAll("[data-password-rule]").forEach((item, index) => {
    const valid = passwordTests[index](value);
    item.classList.toggle("valid", valid);
    item.querySelector("i").textContent = valid ? "✓" : "○";
  });
}

function setFieldError(form, name, message = "") {
  const input = form.elements[name];
  const output = form.querySelector(`[data-error-for="${name}"]`);
  if (!input || !output) return;
  output.textContent = message;
  input.classList.toggle("invalid", Boolean(message));
  input.setAttribute("aria-invalid", String(Boolean(message)));
}

function validateAuthForm(form) {
  const u = au(), values = Object.fromEntries(new FormData(form));
  let valid = true;
  const requireField = (name) => {
    const empty = !String(values[name] || "").trim();
    setFieldError(form, name, empty ? u.required : "");
    if (empty) valid = false;
    return !empty;
  };
  if (authMode === "signup" && requireField("name") && (values.name.trim().length < 2 || values.name.trim().length > 100 || /[\u0000-\u001f\u007f]/.test(values.name))) {
    setFieldError(form, "name", state.lang === "fil" ? "Gumamit ng 2–100 character na walang control character." : "Use 2–100 characters without control characters.");
    valid = false;
  }
  if (authMode !== "reset" && requireField("email")) {
    const emailValid = values.email.trim().length<=254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim());
    if (!emailValid) {
      setFieldError(form, "email", u.invalidEmail);
      valid = false;
    }
  }
  if (authMode !== "forgot" && requireField("password") && ["signup", "reset"].includes(authMode)) {
    const strong = passwordTests.every((test) => test(values.password));
    updatePasswordRules(values.password);
    if (!strong) {
      setFieldError(form, "password", u.passwordRequirements);
      valid = false;
    }
  }
  if (authMode === "signup") {
    if (requireField("confirmPassword") && values.confirmPassword !== values.password) {
      setFieldError(form, "confirmPassword", u.passwordMismatch);
      valid = false;
    }
  }
  if (!valid) form.querySelector(".invalid")?.focus();
  return valid ? values : null;
}

function friendlyAuthError(error) {
  const u = au(), message = String(error?.message || "").toLowerCase();
  if (error?.code === "weak_password" || message.includes("weak password"))
    return `${u.passwordRequirements} ${u.passwordRules.join(", ")}.`;
  if (message.includes("invalid login credentials")) return u.invalidLogin;
  if (message.includes("email not confirmed")) return u.emailUnverified;
  if (message.includes("already registered") || message.includes("already exists")) return u.accountExists;
  return error?.message || u.authError;
}

function bindAuthGate() {
  document.querySelectorAll("[data-auth-mode]").forEach((button) => button.onclick = () => {
    authMode = button.dataset.authMode;
    if (authMode === "landing") landingPage();
    else authForm();
  });
  const form = document.getElementById("authForm");
  if (form) {
    form.onsubmit = handleAuthSubmit;
    const password = form.elements.password;
    if (password && ["signup", "reset"].includes(authMode)) {
      updatePasswordRules(password.value);
      password.addEventListener("input", () => {
        updatePasswordRules(password.value);
        setFieldError(form, "password", "");
      });
    }
    form.querySelectorAll("input").forEach((input) => input.addEventListener("input", () => setFieldError(form, input.name, "")));
    const confirmation = form.elements.confirmPassword;
    if (confirmation) confirmation.addEventListener("input", () => {
      const mismatch = confirmation.value && confirmation.value !== password.value;
      setFieldError(form, "confirmPassword", mismatch ? au().passwordMismatch : "");
    });
  }
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  if (authBusy) return;
  const values = validateAuthForm(event.currentTarget);
  if (!values) return;
  authBusy = true;
  const submit = event.currentTarget.querySelector("button[type=submit]");
  if (submit) submit.disabled = true;
  try {
    if (authMode === "signup") {
      const { data, error } = await window.sinagSupabase.auth.signUp({
        email: values.email.trim(),
        password: values.password,
        options: {
          emailRedirectTo: authRedirectUrl(),
          data: { display_name: values.name.trim() },
        },
      });
      if (error) throw error;
      // Supabase silently "succeeds" for already-registered emails:
      // it returns a user object with an empty identities array.
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        authBusy = false;
        authForm(au().accountExists);
        return;
      }
      authBusy = false;
      verificationScreen(data.user?.email || values.email);
    } else if (authMode === "forgot") {
      const { error } = await window.sinagSupabase.auth.resetPasswordForEmail(values.email.trim(), {
        redirectTo: passwordResetRedirectUrl(),
      });
      if (error) throw error;
      authMode = "login";
      authBusy = false;
      authForm(au().resetSent);
    } else if (authMode === "reset") {
      const { error } = await window.sinagSupabase.auth.updateUser({ password: values.password });
      if (error) throw error;
      setRecoveryPending(false);
      clearPasswordResetUrl();
      authMode = "login";
      authBusy = false;
      authForm(au().passwordUpdated);
    } else {
      const { data, error } = await window.sinagSupabase.auth.signInWithPassword({
        email: values.email.trim(),
        password: values.password,
      });
      if (error) throw error;
      await activateAuthenticatedUser(data.user);
      window.dispatchEvent(new CustomEvent("sinagbasa:login", { detail: { user: data.user } }));
    }
  } catch (error) {
    authBusy = false;
    const message = document.getElementById("authMessage");
    if (message) message.textContent = friendlyAuthError(error);
    if (submit) submit.disabled = false;
  } finally {
    authBusy = false;
  }
}

function clearAuthenticatedSession() {
  activeUserId = null;
  activeActivation = null;
  window.sinagUser = null;
  window.sinagProfile = null;
  window.stopCloudProgress?.();
  state = {lang:state.lang === "fil" ? "fil" : "en",lessons:[],lessonProgress:{},missions:{},customGames:{},activity:[]};
  if (typeof storyState !== "undefined") storyState = null;
  try { if (typeof KEY !== "undefined") localStorage.removeItem(KEY); } catch {}
  document.body.classList.remove("authenticated");
  const main = document.getElementById("main");
  if (main) main.innerHTML = "";
  window.dispatchEvent(new CustomEvent("sinagbasa:signed-out"));
}

function activateAuthenticatedUser(user) {
  if (recoveryPending) {
    showRecoveryForm();
    return Promise.resolve();
  }
  if (!user?.email_confirmed_at) {
    verificationScreen(user?.email || "");
    return Promise.resolve();
  }
  if (activeUserId === user.id && activeActivation) return activeActivation;
  if (activeUserId === user.id && window.sinagProfile) return Promise.resolve();
  if (window.sinagUser && window.sinagUser.id !== user.id) clearAuthenticatedSession();
  activeUserId = user.id;
  activeActivation = (async () => {
    try {
      window.sinagUser = user;
      const { data, error } = await window.sinagSupabase.rpc("ensure_own_profile");
      if (window.sinagUser?.id !== user.id) return;
      if (error) throw error;
      const profile = Array.isArray(data) ? data[0] : data;
      if (!profile?.id) throw new Error("Profile could not be loaded");
      window.sinagProfile = profile;

      // A slow or temporarily unavailable optional data service must not keep a
      // successfully authenticated user trapped behind the login screen.
      document.body.classList.remove("auth-pending");
      document.body.classList.add("authenticated");
      ensureAuthGate().hidden = true;
      render();
      window.dispatchEvent(new CustomEvent("sinagbasa:authenticated", { detail: { user } }));

      const results = await Promise.allSettled([
        window.startCloudProgress(user),
        window.loadRemoteContent(),
      ]);
      results.forEach((result) => {
        if (result.status === "rejected") console.error("Account data load failed", result.reason);
      });
      if (window.sinagUser?.id !== user.id) return;
      render();
    } catch (error) {
      if (window.sinagUser?.id !== user.id) return;
      activeUserId = null;
      window.sinagUser = null;
      window.sinagProfile = null;
      throw new Error(`Account setup failed: ${error.message}`);
    } finally {
      if (activeUserId === user.id) activeActivation = null;
    }
  })();
  return activeActivation;
}

async function logoutUser() {
  window.stopCloudProgress();
  try {
    await window.finishActivityForLogout?.();
  } catch {}
  try {
    await window.sinagSupabase?.auth.signOut();
  } catch {}
  try {
    sessionStorage.clear();
    localStorage.removeItem(KEY);
  } catch {}
  location.hash = "home";
  location.reload();
}

window.setCloudStatus = function (status) {
  const node = document.getElementById("cloudStatus");
  if (node) node.textContent = au()[status === "error" ? "syncError" : status];
};

const headerWithAccount = header;
header = function () {
  headerWithAccount();
  if (!window.sinagUser) return;
  document.querySelector("header .account-menu")?.remove();
  document.querySelector("header").insertAdjacentHTML("beforeend", `<div class="account-menu"><span><strong>${esc(window.sinagProfile?.display_name || window.sinagUser.email)}</strong><small id="cloudStatus">${au().saved}</small></span><button id="logoutButton" title="${au().logout}" aria-label="${au().logout}"><b aria-hidden="true">↪</b><em>${au().logout}</em></button></div>`);
};

const bindWithAccount = bind;
bind = function (page, id) {
  bindWithAccount(page, id);
  if ($("logoutButton")) $("logoutButton").onclick = logoutUser;
};

async function initializeAuth() {
  const config = window.SINAGBASA_SUPABASE;
  if (!config?.url || !config?.publishableKey) {
    authForm(au().authError);
    return;
  }
  if (!window.supabase?.createClient) {
    authForm("Connecting securely…");
    const loaded = await new Promise((resolve) => {
      const deadline = Date.now() + 10000;
      const check = () => {
        if (window.supabase?.createClient) resolve(true);
        else if (Date.now() >= deadline) resolve(false);
        else setTimeout(check, 100);
      };
      check();
    });
    if (!loaded) {
      authForm("Could not load the secure login service. Check your connection, then refresh the page.");
      return;
    }
  }
  try {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith("sb-") && key.endsWith("-auth-token")) {
        localStorage.removeItem(key);
      }
    }
  } catch {}

  window.sinagSupabase = window.supabase.createClient(config.url, config.publishableKey, {
    auth: {
      storage: window.sessionStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  window.sinagSupabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT") {
      clearAuthenticatedSession();
      setRecoveryPending(false);
      setTimeout(() => { if (!window.sinagUser) landingPage(); }, 0);
    } else if (event === "PASSWORD_RECOVERY") {
      setRecoveryPending(true);
      setTimeout(() => { if (recoveryPending) showRecoveryForm(); }, 0);
    } else if (event === "SIGNED_IN" && session?.user) {
      setTimeout(() => activateAuthenticatedUser(session.user).catch((error) => authForm(error.message)), 0);
    }
  });
  const { data: { session }, error: sessionError } = await window.sinagSupabase.auth.getSession();
  if (authCallbackError || (recoveryPending && (sessionError || !session?.user))) {
    setRecoveryPending(false);
    clearPasswordResetUrl();
    authMode = "forgot";
    authForm(au().recoveryExpired);
    return;
  }
  if (recoveryPending && session?.user) {
    setRecoveryPending(true);
    showRecoveryForm();
    return;
  }
  if (session?.user) {
    const { data, error } = await window.sinagSupabase.auth.getUser();
    if (!error && data.user) return activateAuthenticatedUser(data.user);
  }
  try {
    localStorage.removeItem(KEY);
  } catch {}
  landingPage();
}

initializeAuth().catch((error) => authForm(error.message || au().authError));
