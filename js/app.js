import { CATEGORIES as CATEGORIES_FR, QUESTIONS as QUESTIONS_FR, MEMO_CARDS as MEMO_CARDS_FR } from "./data.js";
import { CATEGORIES as CATEGORIES_EN, QUESTIONS as QUESTIONS_EN, MEMO_CARDS as MEMO_CARDS_EN } from "./data.en.js";
import { UI } from "./i18n.js";
import { icon } from "./icons.js";

const STORAGE_KEY = "instructorPrepProgressV1";
const LANG_KEY = "instructorPrepLang";

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { results: {}, sessions: 0 };
  } catch {
    return { results: {}, sessions: 0 };
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    /* localStorage indisponible (navigation privée, etc.) : on continue sans persister */
  }
}

function loadLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    return saved === "en" ? "en" : "fr";
  } catch {
    return "fr";
  }
}

function saveLang(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    /* ignore */
  }
}

const state = {
  route: "home",
  params: {},
  progress: loadProgress(),
  lang: loadLang(),
};

const DATA_BY_LANG = {
  fr: { categories: CATEGORIES_FR, questions: QUESTIONS_FR, memoCards: MEMO_CARDS_FR },
  en: { categories: CATEGORIES_EN, questions: QUESTIONS_EN, memoCards: MEMO_CARDS_EN },
};

function data() {
  return DATA_BY_LANG[state.lang];
}

function t(key) {
  return UI[state.lang][key];
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function catInfo(id) {
  return data().categories.find((c) => c.id === id) || { label: id, color: "#4fc3f7" };
}

/** Trie le paquet de questions en donnant la priorité aux questions pas
 * encore maîtrisées (rappel actif : on s'entraîne davantage sur ce qu'on
 * ne sait pas encore, principe central de la répétition espacée), tout
 * en gardant un ordre aléatoire à l'intérieur de chaque groupe. */
function prioritizeForRecall(questions) {
  const notMastered = shuffle(questions.filter((q) => state.progress.results[q.id] !== true));
  const mastered = shuffle(questions.filter((q) => state.progress.results[q.id] === true));
  return [...notMastered, ...mastered];
}

function categoryStats(catId) {
  const qs = data().questions.filter((q) => q.cat === catId);
  const mastered = qs.filter((q) => state.progress.results[q.id] === true).length;
  return { total: qs.length, mastered };
}

function overallStats() {
  const total = data().questions.length;
  const mastered = Object.values(state.progress.results).filter((v) => v === true).length;
  return { total, mastered };
}

function el(html) {
  const tpl = document.createElement("template");
  tpl.innerHTML = html.trim();
  return tpl.content.firstElementChild;
}

function scrollViewTop() {
  document.getElementById("view").scrollTop = 0;
}

function applyStaticI18n() {
  document.documentElement.lang = t("htmlLang");
  document.querySelectorAll("[data-i18n]").forEach((elm) => {
    elm.textContent = t(elm.dataset.i18n);
  });
  const toggleLabel = document.getElementById("lang-toggle-label");
  const toggleBtn = document.getElementById("lang-toggle");
  if (toggleLabel) toggleLabel.textContent = state.lang === "fr" ? "EN" : "FR";
  if (toggleBtn) toggleBtn.setAttribute("aria-label", t("langToggleAria"));
}

function hydrateStaticIcons() {
  document.querySelectorAll("[data-icon]").forEach((elm) => {
    elm.innerHTML = icon(elm.dataset.icon);
  });
}

function navigate(route, params = {}) {
  state.route = route;
  state.params = params;
  document.querySelectorAll(".tab").forEach((btn) => {
    const isTop = ["home", "quiz", "memo", "progress"].includes(route) && btn.dataset.route === route;
    if (isTop) btn.setAttribute("aria-current", "page");
    else btn.removeAttribute("aria-current");
  });
  render();
  document.getElementById("view").scrollTop = 0;
}

document.querySelectorAll(".tab").forEach((btn) => {
  btn.addEventListener("click", () => navigate(btn.dataset.route));
});

document.getElementById("lang-toggle")?.addEventListener("click", () => {
  state.lang = state.lang === "fr" ? "en" : "fr";
  saveLang(state.lang);
  applyStaticI18n();
  render();
});

// ---------------- VIEWS ----------------

function renderHome() {
  const stats = overallStats();
  const pct = stats.total ? Math.round((stats.mastered / stats.total) * 100) : 0;
  const view = el(`
    <div>
      <div class="card">
        <h2>${icon("diver", "icon-inline")}${t("welcomeTitle")}</h2>
        <p>${t("welcomeBody")}</p>
      </div>

      <div class="stat-row">
        <div class="stat-box">
          <div class="stat-value">${stats.mastered}/${stats.total}</div>
          <div class="stat-label">${t("statMastered")}</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">${pct}%</div>
          <div class="stat-label">${t("statProgress")}</div>
        </div>
      </div>

      <div class="section-title">${t("sectionThemes")}</div>
      <div class="cat-grid" id="home-cat-grid"></div>
    </div>
  `);

  const grid = view.querySelector("#home-cat-grid");
  data().categories.forEach((c) => {
    const s = categoryStats(c.id);
    const tile = el(`
      <button class="cat-tile" style="background:${c.color}">
        <span class="cat-icon">${icon(c.id)}</span>
        <span class="cat-label">${c.label}</span>
        <span class="cat-meta">${s.mastered}/${s.total} ${t("masteredSuffix")}</span>
      </button>
    `);
    tile.addEventListener("click", () => navigate("quiz-session", { cat: c.id }));
    grid.appendChild(tile);
  });

  return view;
}

function renderQuizHome() {
  const view = el(`
    <div>
      <div class="card">
        <h2>${t("quizHomeTitle")}</h2>
        <p>${t("quizHomeBody")}</p>
      </div>
      <div class="section-title">${t("sectionThemesLabel")}</div>
      <div class="cat-grid" id="quiz-cat-grid"></div>
      <div class="section-title">${t("orLabel")}</div>
      <button class="btn btn-primary btn-block" id="quiz-all-btn">${t("allCategoriesBtn")}</button>
    </div>
  `);

  const grid = view.querySelector("#quiz-cat-grid");
  data().categories.forEach((c) => {
    const s = categoryStats(c.id);
    const tile = el(`
      <button class="cat-tile" style="background:${c.color}">
        <span class="cat-icon">${icon(c.id)}</span>
        <span class="cat-label">${c.label}</span>
        <span class="cat-meta">${s.total} ${t("questionsSuffix")}</span>
      </button>
    `);
    tile.addEventListener("click", () => navigate("quiz-session", { cat: c.id }));
    grid.appendChild(tile);
  });

  view.querySelector("#quiz-all-btn").addEventListener("click", () => navigate("quiz-session", { cat: "all" }));

  return view;
}

function renderQuizSession(params) {
  const catId = params.cat;
  const pool = catId === "all" ? data().questions : data().questions.filter((q) => q.cat === catId);
  const questions = prioritizeForRecall(pool);
  let index = 0;
  let score = 0;
  const isAll = catId === "all";
  const info = isAll ? { label: t("allCategoriesLabel"), color: "var(--accent-strong)" } : catInfo(catId);
  const infoIcon = isAll ? icon("target") : icon(catId);

  const view = el(`
    <div style="--cat-color:${info.color}">
      <button class="back-link" id="quiz-back">${t("backToThemes")}</button>
      <div class="quiz-progress">
        <span class="quiz-progress-label">${infoIcon}${info.label}</span>
        <span id="quiz-counter"></span>
      </div>
      <div class="progress-bar-track" style="margin-bottom:16px;">
        <div class="progress-bar-fill" id="quiz-bar" style="width:0%; background:${info.color}"></div>
      </div>
      <div class="card" id="quiz-card"></div>
    </div>
  `);

  view.querySelector("#quiz-back").addEventListener("click", () => navigate("quiz"));

  function renderQuestion() {
    if (index >= questions.length) {
      renderResult();
      return;
    }
    scrollViewTop();
    const q = questions[index];
    view.querySelector("#quiz-counter").textContent = `${index + 1} / ${questions.length}`;
    view.querySelector("#quiz-bar").style.width = `${(index / questions.length) * 100}%`;

    const card = view.querySelector("#quiz-card");
    card.innerHTML = "";
    if (state.progress.results[q.id] === false) {
      card.appendChild(el(`<span class="review-tag">${icon("repeat")}${t("reviewTag")}</span>`));
    }
    card.appendChild(el(`<p class="question-text">${q.q}</p>`));

    const choicesWrap = el(`<div></div>`);
    q.choices.forEach((choiceText, i) => {
      const btn = el(`<button class="choice">${choiceText}</button>`);
      btn.addEventListener("click", () => selectAnswer(q, i, choicesWrap, card));
      choicesWrap.appendChild(btn);
    });
    card.appendChild(choicesWrap);
  }

  function selectAnswer(q, chosenIndex, choicesWrap, card) {
    const buttons = Array.from(choicesWrap.querySelectorAll(".choice"));
    buttons.forEach((b, i) => {
      b.disabled = true;
      if (i === q.correct) b.classList.add("correct");
      else if (i === chosenIndex) b.classList.add("incorrect");
    });

    const isCorrect = chosenIndex === q.correct;
    if (isCorrect) score++;
    state.progress.results[q.id] = isCorrect;
    saveProgress(state.progress);

    card.appendChild(el(`
      <div class="explanation">
        <strong>${isCorrect ? t("correctFeedback") : t("incorrectFeedback")}</strong> ${q.explanation}
      </div>
    `));

    const nextBtn = el(`<button class="btn btn-primary btn-block" style="margin-top:14px;">${index + 1 < questions.length ? t("nextQuestion") : t("seeResult")}</button>`);
    nextBtn.addEventListener("click", () => {
      index++;
      renderQuestion();
    });
    card.appendChild(nextBtn);
  }

  function renderResult() {
    scrollViewTop();
    view.querySelector("#quiz-bar").style.width = "100%";
    view.querySelector("#quiz-counter").textContent = `${questions.length} / ${questions.length}`;
    state.progress.sessions = (state.progress.sessions || 0) + 1;
    saveProgress(state.progress);

    const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;
    const card = view.querySelector("#quiz-card");
    card.innerHTML = "";
    card.appendChild(el(`
      <div class="result-hero">
        <div class="result-score">${score} / ${questions.length}</div>
        <div class="result-caption">${pct}${t("resultCaptionSuffix")}</div>
      </div>
    `));
    const again = el(`<button class="btn btn-primary btn-block" style="margin-top:12px;">${t("againBtn")}</button>`);
    again.addEventListener("click", () => navigate("quiz-session", params));
    const back = el(`<button class="btn btn-ghost btn-block" style="margin-top:8px;">${t("backThemesBtn")}</button>`);
    back.addEventListener("click", () => navigate("quiz"));
    card.appendChild(again);
    card.appendChild(back);
  }

  if (questions.length === 0) {
    view.querySelector("#quiz-card").innerHTML = `<div class="empty-state">${t("emptyCategory")}</div>`;
  } else {
    renderQuestion();
  }

  return view;
}

function renderMemo() {
  const view = el(`
    <div>
      <div class="card">
        <h2>${t("memoTitle")}</h2>
        <p>${t("memoBody")}</p>
      </div>
      <div id="memo-list"></div>
    </div>
  `);

  const list = view.querySelector("#memo-list");
  data().memoCards.forEach((m) => {
    const c = catInfo(m.cat);
    const isWarning = m.id === "m-disclaimer";
    const isSources = m.id === "m-sources";
    const cardIcon = isWarning ? icon("warning") : isSources ? icon("search") : icon(m.cat);
    const card = el(`
      <div class="card memo-card ${isWarning ? "warning-card" : ""}" ${!isWarning ? `style="border-left-color:${c.color}"` : ""}>
        <h2>${cardIcon}${m.title}</h2>
        <ul>${m.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
      </div>
    `);
    list.appendChild(card);
  });

  return view;
}

function renderProgress() {
  const stats = overallStats();
  const view = el(`
    <div>
      <div class="card">
        <h2>${t("progressTitle")}</h2>
        <p>${t("progressBody")}</p>
      </div>
      <div class="stat-row">
        <div class="stat-box">
          <div class="stat-value">${stats.mastered}/${stats.total}</div>
          <div class="stat-label">${t("statMastered")}</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">${state.progress.sessions || 0}</div>
          <div class="stat-label">${t("sessionsCompleted")}</div>
        </div>
      </div>
      <div class="section-title">${t("byTheme")}</div>
      <div class="card" id="progress-by-cat"></div>
      <button class="btn btn-ghost btn-block" id="reset-progress" style="margin-top:16px;">${t("resetBtn")}</button>
    </div>
  `);

  const byCat = view.querySelector("#progress-by-cat");
  data().categories.forEach((c) => {
    const s = categoryStats(c.id);
    const pct = s.total ? Math.round((s.mastered / s.total) * 100) : 0;
    byCat.appendChild(el(`
      <div class="cat-progress-row">
        <span class="cat-name-icon" style="color:${c.color}">${icon(c.id)}</span>
        <span class="cat-name">${c.label}</span>
        <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${pct}%;background:${c.color}"></div></div>
        <span class="cat-pct">${pct}%</span>
      </div>
    `));
  });

  view.querySelector("#reset-progress").addEventListener("click", () => {
    if (confirm(t("resetConfirm"))) {
      state.progress = { results: {}, sessions: 0 };
      saveProgress(state.progress);
      navigate("progress");
    }
  });

  return view;
}

function render() {
  const viewEl = document.getElementById("view");
  viewEl.innerHTML = "";
  if (state.route === "quiz-session" && state.params.cat && state.params.cat !== "all") {
    viewEl.style.setProperty("--cat-color", catInfo(state.params.cat).color);
  } else {
    viewEl.style.removeProperty("--cat-color");
  }
  let content;
  switch (state.route) {
    case "quiz":
      content = renderQuizHome();
      break;
    case "quiz-session":
      content = renderQuizSession(state.params);
      break;
    case "memo":
      content = renderMemo();
      break;
    case "progress":
      content = renderProgress();
      break;
    case "home":
    default:
      content = renderHome();
  }
  viewEl.appendChild(content);
}

applyStaticI18n();
hydrateStaticIcons();
navigate("home");

// ---------------- PWA install prompt ----------------
let deferredInstallPrompt = null;
const toast = document.getElementById("install-toast");
const installBtn = document.getElementById("install-btn");
const dismissBtn = document.getElementById("install-dismiss");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  if (!localStorage.getItem("installToastDismissed")) {
    toast.hidden = false;
  }
});

installBtn?.addEventListener("click", async () => {
  toast.hidden = true;
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
  }
});

dismissBtn?.addEventListener("click", () => {
  toast.hidden = true;
  try {
    localStorage.setItem("installToastDismissed", "1");
  } catch {
    /* ignore */
  }
});

// ---------------- Service worker ----------------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {
      /* l'appli fonctionne même si le service worker échoue à s'enregistrer */
    });
  });
}
