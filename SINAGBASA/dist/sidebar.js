"use strict";

const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");
const sidebarClose = document.getElementById("sidebarClose");
const sidebarBrand = document.getElementById("sidebarBrand");
const sidebarBackdrop = document.getElementById("sidebarBackdrop");
const themeToggle = document.getElementById("themeToggle");
const sidebarMedia = window.matchMedia("(max-width: 900px)");
let sidebarOpen = false;
let sidebarCollapsed = false;
const SIDEBAR_PREFERENCE = "sinagbasa-sidebar-collapsed";
const THEME_PREFERENCE = "sinagbasa-theme";
try {
  sidebarCollapsed = localStorage.getItem(SIDEBAR_PREFERENCE) === "true";
} catch {}

function applySidebarCollapse() {
  const active = sidebarCollapsed && !sidebarMedia.matches;
  document.body.classList.toggle("sidebar-collapsed", active);
  sidebarBrand.setAttribute("aria-expanded", String(!active));
  sidebarBrand.setAttribute("aria-label", active ? "Expand sidebar" : "Collapse sidebar");
  sidebarBrand.title = active ? "Expand sidebar" : "Collapse sidebar";
}

function applyTheme(theme) {
  const dark = theme === "dark";
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  const filipino = typeof state !== "undefined" && state.lang === "fil";
  const label = dark
    ? (filipino ? "Maliwanag na tema" : "Light mode")
    : (filipino ? "Madilim na tema" : "Dark mode");
  themeToggle.innerHTML = `<span class="side-icon" aria-hidden="true">${dark ? "☀" : "☾"}</span><span class="side-label">${label}</span>`;
  themeToggle.setAttribute("aria-label", label);
  themeToggle.title = label;
  themeToggle.setAttribute("aria-pressed", String(dark));
}

themeToggle.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  try { localStorage.setItem(THEME_PREFERENCE, next); } catch {}
  applyTheme(next);
});

function setSidebar(open, returnFocus = false) {
  const mobile = sidebarMedia.matches;
  sidebarOpen = Boolean(open && mobile);
  document.body.classList.toggle("sidebar-open", sidebarOpen);
  menuToggle.setAttribute("aria-expanded", String(sidebarOpen));
  sidebar.setAttribute("aria-hidden", String(mobile && !sidebarOpen));
  sidebar.inert = mobile && !sidebarOpen;
  menuToggle.inert = sidebarOpen;
  document.querySelector("main").inert = sidebarOpen;
  document.querySelector("footer").inert = sidebarOpen;
  sidebarBackdrop.hidden = !sidebarOpen;
  if (sidebarOpen) sidebarClose.focus();
  else if (returnFocus) menuToggle.focus();
}

menuToggle.addEventListener("click", () => setSidebar(!sidebarOpen));
sidebarBrand.addEventListener("click", () => {
  if (sidebarMedia.matches) {
    setSidebar(false, true);
    return;
  }
  sidebarCollapsed = !sidebarCollapsed;
  try {
    localStorage.setItem(SIDEBAR_PREFERENCE, String(sidebarCollapsed));
  } catch {}
  applySidebarCollapse();
});
sidebarClose.addEventListener("click", () => setSidebar(false, true));
sidebarBackdrop.addEventListener("click", () => setSidebar(false, true));
sidebar.addEventListener("click", (event) => {
  if (sidebarMedia.matches && event.target.closest("a")) setSidebar(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && sidebarOpen) setSidebar(false, true);
});
sidebarMedia.addEventListener("change", () => {
  setSidebar(false);
  applySidebarCollapse();
});
setSidebar(false);
applySidebarCollapse();
applyTheme(document.documentElement.dataset.theme);
