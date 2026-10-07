import { CATEGORIES as CATEGORIES_FR, QUESTIONS as QUESTIONS_FR, MEMO_CARDS as MEMO_CARDS_FR } from "./data.js";
import { CATEGORIES as CATEGORIES_EN, QUESTIONS as QUESTIONS_EN, MEMO_CARDS as MEMO_CARDS_EN } from "./data.en.js";
import { UI } from "./i18n.js";
import { icon } from "./icons.js";
import { TABLES, loadApneaProgress, saveApneaProgress } from "./apnea.js";

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
  apneaProgress: loadApneaProgress(),
};

// Un seul minuteur actif à la fois (chrono d'apnée ou décompte de
// récupération) : toujours le nettoyer avant d'en lancer un autre, et à
// chaque navigation, pour ne jamais laisser un minuteur tourner dans le
// vide sur une vue qui n'est plus affichée.
let activeIntervalId = null;
function clearActiveInterval() {
  if (activeIntervalId !== null) {
    clearInterval(activeIntervalId);
    activeIntervalId = null;
  }
}

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
  clearActiveInterval();
  state.route = route;
  state.params = params;
  document.querySelectorAll(".tab").forEach((btn) => {
    const isTop = ["home", "quiz", "memo", "progress", "training"].includes(route) && btn.dataset.route === route;
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
      <details class="card memo-card ${isWarning ? "warning-card" : ""}" ${!isWarning ? `style="border-left-color:${c.color}"` : ""}>
        <summary>
          <h2>${cardIcon}${m.title}</h2>
          <span class="memo-chevron">${icon("chevron")}</span>
        </summary>
        <ul>${m.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
      </details>
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

// ---------------- TRAINING (apnée) ----------------

function formatClock(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function simpleCard({ iconName, titleKey, descKey, btnKey, onClick }) {
  const card = el(`
    <div class="card">
      <h2>${icon(iconName, "icon-inline")}${t(titleKey)}</h2>
      <p>${t(descKey)}</p>
      <button class="btn btn-primary btn-block" style="margin-top:12px;">${t(btnKey)}</button>
    </div>
  `);
  card.querySelector("button").addEventListener("click", onClick);
  return card;
}

function renderTrainingHub() {
  const view = el(`
    <div>
      <div class="card warning-card">
        <h2>${icon("warning", "icon-inline")}${t("trainingSafetyTitle")}</h2>
        <ul class="safety-list">${t("trainingSafetyBullets").map((b) => `<li>${b}</li>`).join("")}</ul>
      </div>

      <div class="card">
        <h2>${icon("timer", "icon-inline")}${t("trainingTitle")}</h2>
        <p>${t("trainingIntro")}</p>
      </div>

      <div class="section-title">${t("trainingSectionBreathing")}</div>
      <div id="section-breathing"></div>

      <div class="section-title">${t("trainingSectionApnea")}</div>
      <div id="section-apnea"></div>

      <div class="section-title">${t("trainingSectionMobility")}</div>
      <div id="section-mobility"></div>
    </div>
  `);

  view.querySelector("#section-breathing").append(
    simpleCard({
      iconName: "breath", titleKey: "breathingCardTitle", descKey: "breathingCardDesc", btnKey: "breathingStartBtn",
      onClick: () => navigate("training-breathing"),
    }),
    simpleCard({
      iconName: "physiologie", titleKey: "hemiCostalCardTitle", descKey: "hemiCostalCardDesc", btnKey: "hemiCostalStartBtn",
      onClick: () => navigate("training-hemi"),
    }),
    simpleCard({
      iconName: "physique", titleKey: "waveCardTitle", descKey: "waveCardDesc", btnKey: "waveStartBtn",
      onClick: () => navigate("training-wave"),
    }),
  );

  const apneaSection = view.querySelector("#section-apnea");
  [
    { type: "hypercapnie", nameKey: "hypercapnieName", descKey: "hypercapnieDesc" },
    { type: "hypoxique", nameKey: "hypoxiqueName", descKey: "hypoxiqueDesc" },
  ].forEach(({ type, nameKey, descKey }) => {
    const table = TABLES[type];
    const levelNum = Math.min(state.apneaProgress[type] || 1, table.levels.length);
    const levelData = table.levels.find((l) => l.level === levelNum);
    const card = el(`
      <div class="card" style="border-left: 4px solid ${table.color}">
        <h2>${t(nameKey)}</h2>
        <p>${t(descKey)}</p>
        <p class="apnea-plan">${t("levelLabel")} ${levelData.level} — ${levelData.reps} × ~${levelData.hold}s (${t("sessionPlanSuffix")}), ${levelData.series} ${t("seriesSuffix")}</p>
        <button class="btn btn-primary btn-block apnea-start-btn" style="margin-top:4px;">${t("startSessionBtn")}</button>
      </div>
    `);
    card.querySelector(".apnea-start-btn").addEventListener("click", () => navigate("training-session", { type }));
    apneaSection.appendChild(card);
  });
  apneaSection.appendChild(simpleCard({
    iconName: "breath", titleKey: "diaphragmCardTitle", descKey: "diaphragmCardDesc", btnKey: "diaphragmStartBtn",
    onClick: () => navigate("training-diaphragm"),
  }));

  view.querySelector("#section-mobility").append(
    simpleCard({
      iconName: "stretch", titleKey: "stretchCardTitle", descKey: "stretchCardDesc", btnKey: "stretchStartBtn",
      onClick: () => navigate("training-stretch"),
    }),
  );

  return view;
}

const BODY_DIAGRAM_VERTICAL = `
<svg viewBox="0 0 120 200" class="body-diagram" aria-hidden="true">
  <path class="body-outline" d="M60 8c-9 0-16 7-16 16v5c-13 4-23 15-25 29l-7 46c-2 13 4 24 15 28v33c0 11 9 20 20 20h26c11 0 20-9 20-20v-33c11-4 17-15 15-28l-7-46c-2-14-12-25-25-29v-5c0-9-7-16-16-16z"/>
  <path class="body-zone zone-shoulders" d="M25 44c11-10 23-15 35-15s24 5 35 15l-5 16c-9-8-19-13-30-13s-21 5-30 13z"/>
  <ellipse class="body-zone zone-chest" cx="60" cy="95" rx="33" ry="33"/>
  <ellipse class="body-zone zone-belly" cx="60" cy="152" rx="28" ry="30"/>
</svg>`;

const BODY_DIAGRAM_SIDES = `
<svg viewBox="0 0 120 200" class="body-diagram" aria-hidden="true">
  <defs>
    <clipPath id="clip-body-left"><rect x="0" y="0" width="60" height="200"/></clipPath>
    <clipPath id="clip-body-right"><rect x="60" y="0" width="60" height="200"/></clipPath>
  </defs>
  <path class="body-outline" d="M60 8c-9 0-16 7-16 16v5c-13 4-23 15-25 29l-7 46c-2 13 4 24 15 28v33c0 11 9 20 20 20h26c11 0 20-9 20-20v-33c11-4 17-15 15-28l-7-46c-2-14-12-25-25-29v-5c0-9-7-16-16-16z"/>
  <ellipse class="body-zone zone-left" cx="60" cy="100" rx="36" ry="52" clip-path="url(#clip-body-left)"/>
  <ellipse class="body-zone zone-right" cx="60" cy="100" rx="36" ry="52" clip-path="url(#clip-body-right)"/>
</svg>`;

/**
 * Moteur générique d'un guide de respiration animé par étapes (ballon
 * qui grossit/rétrécit + schéma du buste optionnel). Réutilisé par le
 * guide 3 temps, la respiration hémi-costale et la respiration "vague".
 */
function renderStageGuide({ titleKey, diagramSVG, stages, loop, doneLabelKey, hintKey }) {
  const view = el(`
    <div>
      <button class="back-link" id="guide-back">${t("backToTrainingBtn")}</button>
      <div class="card breathing-card">
        <h2>${icon("breath", "icon-inline")}${t(titleKey)}</h2>
        ${hintKey ? `<p>${t(hintKey)}</p>` : ""}
        <div class="breath-stage">
          <div class="breath-visuals">
            <div class="breath-circle-wrap">
              <div class="breath-circle" id="guide-circle"></div>
            </div>
            ${diagramSVG ? `<div class="breath-body-wrap" id="guide-body">${diagramSVG}</div>` : ""}
          </div>
          <div class="breath-label" id="guide-label"></div>
          <div class="breath-step" id="guide-step"></div>
        </div>
        <div id="guide-actions" class="breath-actions"></div>
      </div>
    </div>
  `);
  view.querySelector("#guide-back").addEventListener("click", () => navigate("training"));

  const circle = view.querySelector("#guide-circle");
  const bodyWrap = view.querySelector("#guide-body");
  const labelEl = view.querySelector("#guide-label");
  const stepEl = view.querySelector("#guide-step");
  const actionsEl = view.querySelector("#guide-actions");

  function setActiveZone(zone) {
    if (!bodyWrap) return;
    bodyWrap.querySelectorAll(".body-zone").forEach((z) => z.classList.remove("active"));
    if (zone) bodyWrap.querySelector(`.zone-${zone}`)?.classList.add("active");
  }

  function renderStopButton() {
    actionsEl.innerHTML = `<button class="btn btn-ghost btn-block" id="guide-stop">${t("breathingStopBtn")}</button>`;
    actionsEl.querySelector("#guide-stop").addEventListener("click", () => navigate("training"));
  }

  let stageIndex = 0;

  function runStage() {
    if (stageIndex >= stages.length) {
      if (loop) {
        stageIndex = 0;
      } else {
        labelEl.textContent = t(doneLabelKey || "guideDoneGeneric");
        stepEl.textContent = "";
        setActiveZone(null);
        actionsEl.innerHTML = `
          <button class="btn btn-primary btn-block" id="guide-restart">${t("breathingRestartBtn")}</button>
          <button class="btn btn-ghost btn-block" id="guide-stop" style="margin-top:8px;">${t("breathingStopBtn")}</button>
        `;
        actionsEl.querySelector("#guide-restart").addEventListener("click", () => {
          stageIndex = 0;
          runStage();
        });
        actionsEl.querySelector("#guide-stop").addEventListener("click", () => navigate("training"));
        return;
      }
    }
    const stage = stages[stageIndex];
    circle.style.transitionDuration = `${stage.duration}s`;
    circle.style.transform = `scale(${stage.scale})`;
    labelEl.textContent = t(stage.labelKey);
    stepEl.textContent = stage.stepKey ? t(stage.stepKey) : "";
    setActiveZone(stage.zone);
    renderStopButton();

    clearActiveInterval();
    activeIntervalId = setTimeout(() => {
      stageIndex++;
      runStage();
    }, stage.duration * 1000);
  }

  runStage();

  return view;
}

function renderBreathingGuide() {
  const D = 3;
  const inhaleSteps = [
    { labelKey: "breathingInhale", stepKey: "breathingStepBelly", zone: "belly", scale: 1.0, duration: D },
    { labelKey: "breathingInhale", stepKey: "breathingStepChest", zone: "chest", scale: 1.25, duration: D },
    { labelKey: "breathingInhale", stepKey: "breathingStepShoulders", zone: "shoulders", scale: 1.5, duration: D },
  ];
  const stages = [
    ...inhaleSteps,
    { labelKey: "breathingExhale", stepKey: null, zone: null, scale: 0.75, duration: D * 2 },
    ...inhaleSteps,
  ];
  return renderStageGuide({
    titleKey: "breathingGuideTitle",
    diagramSVG: BODY_DIAGRAM_VERTICAL,
    stages,
    loop: false,
    doneLabelKey: "breathingDone",
  });
}

function renderHemiCostalGuide() {
  const D = 4;
  const side = (zone, labelKey) => [
    { labelKey: "breathingInhale", stepKey: labelKey, zone, scale: 1.3, duration: D },
    { labelKey: "breathingExhale", stepKey: labelKey, zone, scale: 0.8, duration: D },
  ];
  const stages = [
    ...side("left", "hemiLeftLabel"), ...side("left", "hemiLeftLabel"), ...side("left", "hemiLeftLabel"),
    ...side("right", "hemiRightLabel"), ...side("right", "hemiRightLabel"), ...side("right", "hemiRightLabel"),
  ];
  return renderStageGuide({
    titleKey: "hemiCostalGuideTitle",
    diagramSVG: BODY_DIAGRAM_SIDES,
    stages,
    loop: false,
    hintKey: "hemiHint",
  });
}

function renderWaveBreathing() {
  const D = 5;
  const stages = [
    { labelKey: "breathingInhale", stepKey: null, zone: null, scale: 1.45, duration: D },
    { labelKey: "breathingExhale", stepKey: null, zone: null, scale: 0.75, duration: D },
  ];
  return renderStageGuide({
    titleKey: "waveGuideTitle",
    diagramSVG: null,
    stages,
    loop: true,
  });
}

const DIAPHRAGM_STEPS = [
  { labelKey: "diaphragmStepFull", n: 1 },
  { labelKey: "diaphragmStepFull", n: 2 },
  { labelKey: "diaphragmStepHalf", n: 1 },
  { labelKey: "diaphragmStepHalf", n: 2 },
];
const DIAPHRAGM_RECOVERY = 60;

function renderDiaphragmBalances() {
  let stepIndex = 0;
  const holdLog = [];
  let holdStartMs = 0;

  const view = el(`
    <div>
      <button class="back-link" id="dia-back">${t("sessionStopBtn")}</button>
      <div class="apnea-counter" id="dia-counter"></div>
      <div class="card" id="dia-card"></div>
    </div>
  `);
  view.querySelector("#dia-back").addEventListener("click", () => navigate("training"));

  function updateCounter() {
    const step = DIAPHRAGM_STEPS[stepIndex];
    view.querySelector("#dia-counter").textContent = step ? `${t(step.labelKey)} — ${step.n} ${t("diaphragmRepSuffix")}` : "";
  }

  function renderReady() {
    clearActiveInterval();
    updateCounter();
    const card = view.querySelector("#dia-card");
    card.innerHTML = `
      <h2>${icon("breath", "icon-inline")}${t("diaphragmGuideTitle")}</h2>
      <p>${t("diaphragmHint")}</p>
      <button class="btn btn-primary btn-block" id="dia-ready-btn" style="margin-top:10px;">${t("readyHoldBtn")}</button>
    `;
    card.querySelector("#dia-ready-btn").addEventListener("click", startHold);
  }

  function startHold() {
    holdStartMs = Date.now();
    const card = view.querySelector("#dia-card");
    card.innerHTML = `
      <h2>${icon("timer", "icon-inline")}${t("phaseHoldTitle")}</h2>
      <div class="apnea-clock" id="dia-hold-clock">0:00</div>
      <button class="btn btn-primary btn-block" id="dia-stop-hold-btn">${t("stopHoldBtn")}</button>
    `;
    card.querySelector("#dia-stop-hold-btn").addEventListener("click", stopHold);
    clearActiveInterval();
    activeIntervalId = setInterval(() => {
      const elapsed = Math.round((Date.now() - holdStartMs) / 1000);
      const clockEl = document.getElementById("dia-hold-clock");
      if (clockEl) clockEl.textContent = formatClock(elapsed);
    }, 250);
  }

  function stopHold() {
    clearActiveInterval();
    holdLog.push(Math.max(0, Math.round((Date.now() - holdStartMs) / 1000)));
    if (stepIndex < DIAPHRAGM_STEPS.length - 1) {
      startRecovery(() => {
        stepIndex++;
        renderReady();
      });
    } else {
      renderDone();
    }
  }

  function startRecovery(onComplete) {
    let remaining = DIAPHRAGM_RECOVERY;
    const card = view.querySelector("#dia-card");
    card.innerHTML = `
      <h2>${icon("timer", "icon-inline")}${t("phaseRecoveryTitle")}</h2>
      <div class="apnea-clock" id="dia-recovery-clock">${formatClock(remaining)}</div>
      <ul class="safety-list">
        <li>${t("recoveryStep1")}</li>
        <li>${t("recoveryStep2")}</li>
        <li>${t("recoveryStep3")}</li>
      </ul>
      <div class="apnea-recovery-actions">
        <button class="btn btn-ghost" id="dia-add-time-btn">${t("addTimeBtn")}</button>
        <button class="btn btn-primary" id="dia-skip-btn">${t("skipRecoveryBtn")}</button>
      </div>
    `;
    const clockEl = () => document.getElementById("dia-recovery-clock");
    function finish() {
      clearActiveInterval();
      onComplete();
    }
    card.querySelector("#dia-add-time-btn").addEventListener("click", () => {
      remaining += 30;
      if (clockEl()) clockEl().textContent = formatClock(remaining);
    });
    card.querySelector("#dia-skip-btn").addEventListener("click", finish);
    clearActiveInterval();
    activeIntervalId = setInterval(() => {
      remaining--;
      if (clockEl()) clockEl().textContent = formatClock(Math.max(0, remaining));
      if (remaining <= 0) finish();
    }, 1000);
  }

  function renderDone() {
    clearActiveInterval();
    view.querySelector("#dia-counter").textContent = "";
    const card = view.querySelector("#dia-card");
    card.innerHTML = `
      <h2>${t("diaphragmDoneTitle")}</h2>
      <p>${t("diaphragmDoneBody")}</p>
      <ul class="safety-list">${holdLog.map((s, i) => `<li>${t("repCounterPrefix")} ${i + 1} : ${formatClock(s)}</li>`).join("")}</ul>
      <button class="btn btn-primary btn-block" id="dia-back-hub" style="margin-top:12px;">${t("backToTrainingBtn")}</button>
    `;
    card.querySelector("#dia-back-hub").addEventListener("click", () => navigate("training"));
  }

  renderReady();
  return view;
}

const STRETCHES = [
  { nameKey: "stretch1Name", duration: 20 },
  { nameKey: "stretch2Name", duration: 20 },
  { nameKey: "stretch3Name", duration: 20 },
  { nameKey: "stretch4Name", duration: 20 },
  { nameKey: "stretch5Name", duration: 20 },
  { nameKey: "stretch6Name", duration: 20 },
  { nameKey: "stretch7Name", duration: 20 },
];

function renderChestStretches() {
  let index = 0;
  const view = el(`
    <div>
      <button class="back-link" id="stretch-back">${t("sessionStopBtn")}</button>
      <div class="card">
        <h2>${icon("stretch", "icon-inline")}${t("stretchGuideTitle")}</h2>
        <p>${t("stretchNote")}</p>
        <div id="stretch-body"></div>
      </div>
    </div>
  `);
  view.querySelector("#stretch-back").addEventListener("click", () => navigate("training"));
  const body = view.querySelector("#stretch-body");

  function renderStep() {
    clearActiveInterval();
    if (index >= STRETCHES.length) {
      body.innerHTML = `
        <h2 style="margin-top:14px;">${t("stretchDoneTitle")}</h2>
        <button class="btn btn-primary btn-block" id="stretch-back-hub" style="margin-top:8px;">${t("backToTrainingBtn")}</button>
      `;
      body.querySelector("#stretch-back-hub").addEventListener("click", () => navigate("training"));
      return;
    }
    const stretch = STRETCHES[index];
    let remaining = stretch.duration;
    body.innerHTML = `
      <p class="apnea-counter" style="margin-top:14px;">${index + 1} / ${STRETCHES.length}</p>
      <p style="font-weight:600;">${t(stretch.nameKey)}</p>
      <div class="apnea-clock" id="stretch-clock">${formatClock(remaining)}</div>
      <div class="apnea-recovery-actions">
        <button class="btn btn-ghost" id="stretch-skip-btn">${t("stretchSkip")}</button>
        <button class="btn btn-primary" id="stretch-next-btn">${t("stretchNextBtn")}</button>
      </div>
    `;
    const clockEl = () => document.getElementById("stretch-clock");
    function advance() {
      clearActiveInterval();
      index++;
      renderStep();
    }
    body.querySelector("#stretch-skip-btn").addEventListener("click", advance);
    body.querySelector("#stretch-next-btn").addEventListener("click", advance);
    clearActiveInterval();
    activeIntervalId = setInterval(() => {
      remaining--;
      if (clockEl()) clockEl().textContent = formatClock(Math.max(0, remaining));
      if (remaining <= 0) advance();
    }, 1000);
  }

  renderStep();
  return view;
}

function renderApneaSession(params) {
  const type = params.type === "hypoxique" ? "hypoxique" : "hypercapnie";
  const table = TABLES[type];
  const level = Math.min(state.apneaProgress[type] || 1, table.levels.length);
  const levelData = table.levels.find((l) => l.level === level);

  let repIndex = 1;
  let seriesIndex = 1;
  const holdLog = [];
  let holdStartMs = 0;

  const view = el(`
    <div style="--cat-color:${table.color}">
      <button class="back-link" id="apnea-back">${t("sessionStopBtn")}</button>
      <div class="apnea-counter">
        <span id="apnea-rep-counter"></span>
      </div>
      <div class="card" id="apnea-card"></div>
    </div>
  `);
  view.querySelector("#apnea-back").addEventListener("click", () => navigate("training"));

  function updateCounter() {
    view.querySelector("#apnea-rep-counter").textContent =
      `${t("repCounterPrefix")} ${repIndex}/${levelData.reps} — ${t("seriesCounterPrefix")} ${seriesIndex}/${levelData.series}`;
  }

  function renderBreathePhase() {
    clearActiveInterval();
    updateCounter();
    const card = view.querySelector("#apnea-card");
    card.innerHTML = `
      <h2>${icon("breath", "icon-inline")}${t("phaseBreatheTitle")}</h2>
      <p>${t("phaseBreatheHint")}</p>
      <button class="btn btn-primary btn-block" id="apnea-ready-btn" style="margin-top:10px;">${t("readyHoldBtn")}</button>
    `;
    card.querySelector("#apnea-ready-btn").addEventListener("click", startHold);
  }

  function startHold() {
    holdStartMs = Date.now();
    const card = view.querySelector("#apnea-card");
    card.innerHTML = `
      <h2>${icon("timer", "icon-inline")}${t("phaseHoldTitle")}</h2>
      <div class="apnea-clock" id="apnea-hold-clock">0:00</div>
      <p class="apnea-target">${t("holdTargetPrefix")} ${formatClock(levelData.hold)} ${t("holdTargetSuffix")}</p>
      <button class="btn btn-primary btn-block" id="apnea-stop-hold-btn">${t("stopHoldBtn")}</button>
    `;
    card.querySelector("#apnea-stop-hold-btn").addEventListener("click", stopHold);

    clearActiveInterval();
    activeIntervalId = setInterval(() => {
      const elapsed = Math.round((Date.now() - holdStartMs) / 1000);
      const clockEl = document.getElementById("apnea-hold-clock");
      if (clockEl) clockEl.textContent = formatClock(elapsed);
    }, 250);
  }

  function stopHold() {
    clearActiveInterval();
    const elapsed = Math.max(0, Math.round((Date.now() - holdStartMs) / 1000));
    holdLog.push(elapsed);

    if (repIndex < levelData.reps) {
      startRecovery(levelData.recovery, false, () => {
        repIndex++;
        renderBreathePhase();
      });
    } else if (seriesIndex < levelData.series) {
      startRecovery(levelData.seriesRecovery, true, () => {
        seriesIndex++;
        repIndex = 1;
        renderBreathePhase();
      });
    } else {
      renderDone();
    }
  }

  function startRecovery(durationSeconds, isSeriesRecovery, onComplete) {
    let remaining = durationSeconds;
    const card = view.querySelector("#apnea-card");
    const title = isSeriesRecovery ? t("seriesRecoveryTitle") : t("phaseRecoveryTitle");
    card.innerHTML = `
      <h2>${icon("timer", "icon-inline")}${title}</h2>
      <div class="apnea-clock" id="apnea-recovery-clock">${formatClock(remaining)}</div>
      <ul class="safety-list">
        <li>${t("recoveryStep1")}</li>
        <li>${t("recoveryStep2")}</li>
        <li>${t("recoveryStep3")}</li>
      </ul>
      <div class="apnea-recovery-actions">
        <button class="btn btn-ghost" id="apnea-add-time-btn">${t("addTimeBtn")}</button>
        <button class="btn btn-primary" id="apnea-skip-btn">${t("skipRecoveryBtn")}</button>
      </div>
    `;
    const clockEl = () => document.getElementById("apnea-recovery-clock");

    function finish() {
      clearActiveInterval();
      onComplete();
    }

    card.querySelector("#apnea-add-time-btn").addEventListener("click", () => {
      remaining += 30;
      if (clockEl()) clockEl().textContent = formatClock(remaining);
    });
    card.querySelector("#apnea-skip-btn").addEventListener("click", finish);

    clearActiveInterval();
    activeIntervalId = setInterval(() => {
      remaining--;
      if (clockEl()) clockEl().textContent = formatClock(Math.max(0, remaining));
      if (remaining <= 0) finish();
    }, 1000);
  }

  function renderDone() {
    clearActiveInterval();
    view.querySelector("#apnea-rep-counter").textContent = "";
    const card = view.querySelector("#apnea-card");
    card.innerHTML = `
      <h2>${t("sessionDoneTitle")}</h2>
      <p>${t("sessionDoneBody")}</p>
      <ul class="safety-list">${holdLog.map((s, i) => `<li>${t("repCounterPrefix")} ${i + 1} : ${formatClock(s)}</li>`).join("")}</ul>
      <p style="margin-top:12px; font-weight:600;">${t("validateQuestion")}</p>
      <button class="btn btn-primary btn-block" id="apnea-validate-yes">${t("validateYes")}</button>
      <button class="btn btn-ghost btn-block" id="apnea-validate-no" style="margin-top:8px;">${t("validateNo")}</button>
      <button class="btn btn-ghost btn-block" id="apnea-back-hub" style="margin-top:8px;">${t("backToTrainingBtn")}</button>
    `;
    card.querySelector("#apnea-validate-yes").addEventListener("click", () => {
      const maxLevel = table.levels.length;
      state.apneaProgress[type] = Math.min(level + 1, maxLevel);
      saveApneaProgress(state.apneaProgress);
      navigate("training");
    });
    card.querySelector("#apnea-validate-no").addEventListener("click", () => {
      state.apneaProgress[type] = level;
      saveApneaProgress(state.apneaProgress);
      navigate("training");
    });
    card.querySelector("#apnea-back-hub").addEventListener("click", () => navigate("training"));
  }

  renderBreathePhase();
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
    case "training":
      content = renderTrainingHub();
      break;
    case "training-breathing":
      content = renderBreathingGuide();
      break;
    case "training-hemi":
      content = renderHemiCostalGuide();
      break;
    case "training-wave":
      content = renderWaveBreathing();
      break;
    case "training-diaphragm":
      content = renderDiaphragmBalances();
      break;
    case "training-stretch":
      content = renderChestStretches();
      break;
    case "training-session":
      content = renderApneaSession(state.params);
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
