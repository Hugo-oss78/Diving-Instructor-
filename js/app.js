import { CATEGORIES, QUESTIONS, MEMO_CARDS } from "./data.js";

const STORAGE_KEY = "instructorPrepProgressV1";

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

const state = {
  route: "home",
  params: {},
  progress: loadProgress(),
};

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function catInfo(id) {
  return CATEGORIES.find((c) => c.id === id) || { label: id, icon: "•", color: "#4fc3f7" };
}

function categoryStats(catId) {
  const qs = QUESTIONS.filter((q) => q.cat === catId);
  const mastered = qs.filter((q) => state.progress.results[q.id] === true).length;
  return { total: qs.length, mastered };
}

function overallStats() {
  const total = QUESTIONS.length;
  const attempted = Object.keys(state.progress.results).length;
  const mastered = Object.values(state.progress.results).filter((v) => v === true).length;
  return { total, attempted, mastered };
}

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
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

// ---------------- VIEWS ----------------

function renderHome() {
  const stats = overallStats();
  const pct = stats.total ? Math.round((stats.mastered / stats.total) * 100) : 0;
  const view = el(`
    <div>
      <div class="card warning-card">
        <h2>⚠️ Avant de commencer</h2>
        <p>Cette appli est un outil de révision personnel, non affilié ni approuvé officiellement par SSI.
        Pour toute donnée précise (ratios, standards, procédures d'examen), vérifie toujours ton
        SSI Instructor Manual / MySSI et les indications de ton Instructor Trainer.</p>
      </div>

      <div class="card">
        <h2>Bienvenue 🤿</h2>
        <p>Prépare ton monitorat de plongée (parcours SSI) : révise par catégorie, consulte les fiches
        mémo, et suis ta progression au fil des sessions.</p>
      </div>

      <div class="stat-row">
        <div class="stat-box">
          <div class="stat-value">${stats.mastered}/${stats.total}</div>
          <div class="stat-label">Questions maîtrisées</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">${pct}%</div>
          <div class="stat-label">Progression globale</div>
        </div>
      </div>

      <div class="section-title">Réviser par thème</div>
      <div class="cat-grid" id="home-cat-grid"></div>
    </div>
  `);

  const grid = view.querySelector("#home-cat-grid");
  CATEGORIES.forEach((c) => {
    const s = categoryStats(c.id);
    const tile = el(`
      <button class="cat-tile" style="background:${c.color}">
        <span class="cat-icon">${c.icon}</span>
        <span class="cat-label">${c.label}</span>
        <span class="cat-meta">${s.mastered}/${s.total} maîtrisées</span>
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
        <h2>Choisis un thème</h2>
        <p>Chaque session mélange les questions du thème choisi. Réponds, lis l'explication, puis passe à la suivante.</p>
      </div>
      <div class="section-title">Thèmes</div>
      <div class="cat-grid" id="quiz-cat-grid"></div>
      <div class="section-title">Ou</div>
      <button class="btn btn-primary btn-block" id="quiz-all-btn">Session mélangée — toutes catégories</button>
    </div>
  `);

  const grid = view.querySelector("#quiz-cat-grid");
  CATEGORIES.forEach((c) => {
    const s = categoryStats(c.id);
    const tile = el(`
      <button class="cat-tile" style="background:${c.color}">
        <span class="cat-icon">${c.icon}</span>
        <span class="cat-label">${c.label}</span>
        <span class="cat-meta">${s.total} questions</span>
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
  const pool = catId === "all" ? QUESTIONS : QUESTIONS.filter((q) => q.cat === catId);
  const questions = shuffle(pool);
  let index = 0;
  let score = 0;
  const info = catId === "all" ? { label: "Toutes catégories", icon: "🎯" } : catInfo(catId);

  const view = el(`
    <div>
      <button class="back-link" id="quiz-back">← Retour aux thèmes</button>
      <div class="quiz-progress">
        <span>${info.icon} ${info.label}</span>
        <span id="quiz-counter"></span>
      </div>
      <div class="progress-bar-track" style="margin-bottom:16px;">
        <div class="progress-bar-fill" id="quiz-bar" style="width:0%"></div>
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
    const q = questions[index];
    view.querySelector("#quiz-counter").textContent = `${index + 1} / ${questions.length}`;
    view.querySelector("#quiz-bar").style.width = `${(index / questions.length) * 100}%`;

    const card = view.querySelector("#quiz-card");
    card.innerHTML = "";
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
        <strong>${isCorrect ? "✅ Exact." : "❌ Pas tout à fait."}</strong> ${q.explanation}
      </div>
    `));

    const nextBtn = el(`<button class="btn btn-primary btn-block" style="margin-top:14px;">${index + 1 < questions.length ? "Question suivante" : "Voir le résultat"}</button>`);
    nextBtn.addEventListener("click", () => {
      index++;
      renderQuestion();
    });
    card.appendChild(nextBtn);
  }

  function renderResult() {
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
        <div class="result-caption">${pct}% de bonnes réponses sur cette session</div>
      </div>
    `));
    const again = el(`<button class="btn btn-primary btn-block" style="margin-top:12px;">Refaire une session</button>`);
    again.addEventListener("click", () => navigate("quiz-session", params));
    const back = el(`<button class="btn btn-ghost btn-block" style="margin-top:8px;">Retour aux thèmes</button>`);
    back.addEventListener("click", () => navigate("quiz"));
    card.appendChild(again);
    card.appendChild(back);
  }

  if (questions.length === 0) {
    view.querySelector("#quiz-card").innerHTML = `<div class="empty-state">Aucune question dans ce thème pour l'instant.</div>`;
  } else {
    renderQuestion();
  }

  return view;
}

function renderMemo() {
  const view = el(`
    <div>
      <div class="card">
        <h2>Fiches mémo</h2>
        <p>Les points essentiels à retenir, par thème, pour réviser rapidement avant une session.</p>
      </div>
      <div id="memo-list"></div>
    </div>
  `);

  const list = view.querySelector("#memo-list");
  MEMO_CARDS.forEach((m) => {
    const c = catInfo(m.cat);
    const isWarning = m.id === "m-disclaimer";
    const card = el(`
      <div class="card memo-card ${isWarning ? "warning-card" : ""}" ${!isWarning ? `style="border-left-color:${c.color}"` : ""}>
        <h2>${isWarning ? "" : c.icon + " "}${m.title}</h2>
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
        <h2>Ta progression</h2>
        <p>Basée sur les réponses données dans les sessions de révision, enregistrées uniquement sur cet appareil.</p>
      </div>
      <div class="stat-row">
        <div class="stat-box">
          <div class="stat-value">${stats.mastered}/${stats.total}</div>
          <div class="stat-label">Questions maîtrisées</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">${state.progress.sessions || 0}</div>
          <div class="stat-label">Sessions terminées</div>
        </div>
      </div>
      <div class="section-title">Par thème</div>
      <div class="card" id="progress-by-cat"></div>
      <button class="btn btn-ghost btn-block" id="reset-progress" style="margin-top:16px;">Réinitialiser ma progression</button>
    </div>
  `);

  const byCat = view.querySelector("#progress-by-cat");
  CATEGORIES.forEach((c) => {
    const s = categoryStats(c.id);
    const pct = s.total ? Math.round((s.mastered / s.total) * 100) : 0;
    byCat.appendChild(el(`
      <div class="cat-progress-row">
        <span class="cat-dot" style="background:${c.color}"></span>
        <span class="cat-name">${c.icon} ${c.label}</span>
        <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${pct}%;background:${c.color}"></div></div>
        <span class="cat-pct">${pct}%</span>
      </div>
    `));
  });

  view.querySelector("#reset-progress").addEventListener("click", () => {
    if (confirm("Réinitialiser toute ta progression sur cet appareil ?")) {
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
