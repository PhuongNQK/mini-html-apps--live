import { I18N, LANGUAGES, LEVELS, CATEGORY_I18N } from "./data/meta.js";
import { TECHNIQUES, GENERAL_COMPARISON_ROWS } from "./data/techniques.js";
import { CONCEPTS, DETAILED_CONCEPT_ROWS } from "./data/concepts.js";

const state = {
  locale: "en",
  theme: "light",
  query: "",
  levelFilter: "all",
  categoryFilter: "all",
  languageFilter: "all"
};

const ui = {
  title: document.getElementById("page-title"),
  subtitle: document.getElementById("page-subtitle"),
  search: document.getElementById("search-input"),
  levelFilterLabel: document.getElementById("level-filter-label"),
  categoryFilterLabel: document.getElementById("category-filter-label"),
  languageFilterLabel: document.getElementById("language-filter-label"),
  levelFilter: document.getElementById("level-filter"),
  categoryFilter: document.getElementById("category-filter"),
  languageFilter: document.getElementById("language-filter"),
  localeBtn: document.getElementById("locale-toggle"),
  themeBtn: document.getElementById("theme-toggle"),
  backToTop: document.getElementById("back-to-top"),
  generalSectionTitle: document.getElementById("general-title"),
  techniquesSectionTitle: document.getElementById("techniques-title"),
  conceptsSectionTitle: document.getElementById("concepts-title"),
  detailLangSectionTitle: document.getElementById("detail-lang-title"),
  detailConceptSectionTitle: document.getElementById("detail-concept-title"),
  generalTable: document.getElementById("general-comparison-table"),
  techniquesContainer: document.getElementById("techniques-container"),
  conceptsTable: document.getElementById("concepts-table"),
  detailedLangTable: document.getElementById("detailed-language-table"),
  detailedConceptTable: document.getElementById("detailed-concept-table")
};

function renderRow(cells, stickyCount = 0, tag = "td") {
  return `<tr>${cells
    .map((content, index) => {
      const classes = [];
      if (index < stickyCount) {
        classes.push("sticky-col", `sticky-col-${index + 1}`);
      }
      const className = classes.length ? ` class="${classes.join(" ")}"` : "";
      return `<${tag}${className}>${content}</${tag}>`;
    })
    .join("")}</tr>`;
}

function t(key) {
  return I18N[state.locale][key] || I18N.en[key] || key;
}

function escapeRegExp(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function queryTerms() {
  return [...new Set(normalize(state.query).split(/\s+/).filter(Boolean))];
}

function activeLanguages() {
  if (state.languageFilter === "all") return LANGUAGES;
  return LANGUAGES.filter((lang) => lang.id === state.languageFilter);
}

function levelLabel(levelId) {
  const level = LEVELS.find((l) => l.id === levelId);
  return level ? level[state.locale] : levelId;
}

function textByLocale(value) {
  if (typeof value === "string") return value;
  if (!value) return "";
  return value[state.locale] || value.en || "";
}

function categoryLabel(cat) {
  const entry = CATEGORY_I18N[cat];
  if (!entry) return cat;
  return entry[state.locale] || entry.en || cat;
}

function normalize(text) {
  return String(text || "").toLowerCase();
}

function highlightText(text) {
  const terms = queryTerms();
  let output = escapeHtml(text);
  for (const term of terms.sort((a, b) => b.length - a.length)) {
    output = output.replace(new RegExp(escapeRegExp(term), "gi"), (match) => `<mark class="search-highlight">${match}</mark>`);
  }
  return output;
}

function highlightLocale(value) {
  return highlightText(textByLocale(value));
}

function matchesTechniqueFilters(technique) {
  if (state.levelFilter !== "all" && technique.level !== state.levelFilter) return false;
  if (state.categoryFilter !== "all" && technique.category !== state.categoryFilter) return false;
  if (state.languageFilter !== "all" && !technique.languageDetails[state.languageFilter]) return false;
  return true;
}

function matchesGeneralRowFilters(row) {
  if (state.levelFilter !== "all" && row.level !== state.levelFilter) return false;
  if (state.categoryFilter !== "all" && row.category !== state.categoryFilter) return false;
  if (state.languageFilter !== "all" && !row[state.languageFilter]) return false;
  return true;
}

function matchesConceptFilters(concept) {
  if (state.languageFilter !== "all" && !concept.providerSpecific[state.languageFilter]) return false;
  return true;
}

function allLocales(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return [value.en || "", value.vi || ""].join(" ");
}

function matchesQueryTechnique(technique, q) {
  if (!q) return true;
  const languages = activeLanguages();
  const bag = [
    allLocales(technique.name),
    allLocales(technique.summary),
    technique.category,
    allLocales(technique.origin),
    allLocales(technique.what),
    allLocales(technique.how),
    allLocales(technique.when),
    ...technique.pros.map(allLocales),
    ...technique.cons.map(allLocales),
    ...languages.flatMap((lang) => {
      const detail = technique.languageDetails[lang.id];
      return detail ? [detail.name, detail.specifics, technique.examples[lang.id]] : [];
    })
  ].join(" ");
  return normalize(bag).includes(q);
}

function matchesQueryConcept(concept, q) {
  if (!q) return true;
  const languages = activeLanguages();
  const bag = [
    allLocales(concept.name),
    allLocales(concept.origin),
    allLocales(concept.what),
    allLocales(concept.how),
    allLocales(concept.when),
    ...concept.pros.map(allLocales),
    ...concept.cons.map(allLocales),
    allLocales(concept.complexity),
    ...languages.map((lang) => concept.providerSpecific[lang.id]).filter(Boolean)
  ].join(" ");
  return normalize(bag).includes(q);
}

function renderHeaderTexts() {
  ui.title.textContent = t("pageTitle");
  ui.subtitle.textContent = t("subtitle");
  ui.search.placeholder = t("searchPlaceholder");
  ui.levelFilterLabel.textContent = t("filterLevel");
  ui.categoryFilterLabel.textContent = t("filterCategory");
  ui.languageFilterLabel.textContent = t("filterLanguage");
  ui.generalSectionTitle.textContent = t("generalComparison");
  ui.techniquesSectionTitle.textContent = t("generalizedTechniques");
  ui.conceptsSectionTitle.textContent = t("conceptsTools");
  ui.detailLangSectionTitle.textContent = t("detailedLanguageTable");
  ui.detailConceptSectionTitle.textContent = t("detailedConceptTable");
  ui.localeBtn.textContent = state.locale === "en" ? "VI" : "EN";
  ui.themeBtn.textContent = state.theme === "light" ? "Dark" : "Light";
  ui.backToTop.setAttribute("aria-label", t("backToTop"));
  ui.backToTop.setAttribute("title", t("backToTop"));
}

function setSelectOptions(select, options, selectedValue) {
  select.innerHTML = options
    .map((option) => `<option value="${option.value}"${option.value === selectedValue ? " selected" : ""}>${escapeHtml(option.label)}</option>`)
    .join("");
}

function renderFilters() {
  setSelectOptions(
    ui.levelFilter,
    [{ value: "all", label: t("allLevels") }, ...LEVELS.map((level) => ({ value: level.id, label: level[state.locale] || level.en }))],
    state.levelFilter
  );

  setSelectOptions(
    ui.categoryFilter,
    [
      { value: "all", label: t("allCategories") },
      ...Object.keys(CATEGORY_I18N).map((category) => ({ value: category, label: categoryLabel(category) }))
    ],
    state.categoryFilter
  );

  setSelectOptions(
    ui.languageFilter,
    [{ value: "all", label: t("allLanguages") }, ...LANGUAGES.map((lang) => ({ value: lang.id, label: lang.label }))],
    state.languageFilter
  );
}

function renderGeneralComparison() {
  const q = normalize(state.query);
  const languages = activeLanguages();
  const rows = GENERAL_COMPARISON_ROWS.filter((r) => {
    if (!matchesGeneralRowFilters(r)) return false;
    if (!q) return true;
    const bag = [
      levelLabel(r.level),
      categoryLabel(r.category),
      textByLocale(r.name),
      ...languages.map((lang) => r[lang.id] || "")
    ].join(" ");
    return normalize(bag).includes(q);
  });

  const headers = [
    t("level"),
    t("category"),
    "MPOT",
    ...languages.map((l) => l.label)
  ];

  const stickyCount = Math.min(3, headers.length);
  const thead = `<thead>${renderRow(headers.map(highlightText), stickyCount, "th")}</thead>`;

  const tbodyRows = rows
    .sort((a, b) => a.order - b.order)
    .map((row) => {
      const cells = [
        highlightText(levelLabel(row.level)),
        highlightText(categoryLabel(row.category)),
        highlightLocale(row.name),
        ...languages.map((l) => highlightText(row[l.id] || t("notAvailable")))
      ];
      return renderRow(cells, stickyCount);
    })
    .join("");

  ui.generalTable.innerHTML = `${thead}<tbody>${tbodyRows}</tbody>`;
}

function renderTechniqueCard(technique) {
  const complexity = technique.complexity;
  const languages = activeLanguages();
  const detailsRows = languages.map((lang) => {
    const detail = technique.languageDetails[lang.id];
    if (!detail) {
      return renderRow([highlightText(lang.label), highlightText("-"), highlightText("-")], 1);
    }
    return renderRow([highlightText(lang.label), highlightText(detail.name), highlightText(detail.specifics)], 1);
  }).join("");

  const examplesTabs = languages.map((lang, idx) => {
    const id = `${technique.id}-${lang.id}`;
    const active = idx === 0 ? "active" : "";
    return `<button class="example-tab ${active}" data-tech="${technique.id}" data-target="${id}">${lang.label}</button>`;
  }).join("");

  const examplesPanels = languages.map((lang, idx) => {
    const id = `${technique.id}-${lang.id}`;
    const active = idx === 0 ? "active" : "";
    const code = technique.examples[lang.id] || "-";
    return `<div class="example-panel ${active}" id="${id}"><pre><code>${highlightText(code)}</code></pre></div>`;
  }).join("");

  return `
    <details class="tech-card tech-card-collapsible">
      <summary class="tech-header tech-summary-toggle">
        <div class="tech-header-main">
          <p class="tech-index">Technique ${technique.order}</p>
          <h3>${technique.order}. ${highlightLocale(technique.name)}</h3>
        </div>
        <p class="tech-meta">${highlightText(`${t("level")}: ${levelLabel(technique.level)} | ${t("category")}: ${categoryLabel(technique.category)}`)}</p>
        <p class="tech-summary">${highlightLocale(technique.summary)}</p>
        <span class="tech-toggle" aria-hidden="true"></span>
      </summary>
      <div class="tech-card-body">
      <div class="tech-grid">
        <div class="info-card"><strong>${t("origin")}:</strong><p>${highlightLocale(technique.origin)}</p></div>
        <div class="info-card"><strong>${t("what")}:</strong><p>${highlightLocale(technique.what)}</p></div>
        <div class="info-card"><strong>${t("how")}:</strong><p>${highlightLocale(technique.how)}</p></div>
        <div class="info-card"><strong>${t("when")}:</strong><p>${highlightLocale(technique.when)}</p></div>
      </div>
      <div class="two-col">
        <div class="list-panel list-panel-positive">
          <strong>${t("pros")}:</strong>
          <ul>${technique.pros.map((p) => `<li>${highlightLocale(p)}</li>`).join("")}</ul>
        </div>
        <div class="list-panel list-panel-negative">
          <strong>${t("cons")}:</strong>
          <ul>${technique.cons.map((c) => `<li>${highlightLocale(c)}</li>`).join("")}</ul>
        </div>
      </div>
      <div class="complexity-box">
        <strong>${t("complexity")}:</strong>
        <p>${highlightText(`Time: ${textByLocale(complexity.time)}`)}</p>
        <p>${highlightText(`Space: ${textByLocale(complexity.space)}`)}</p>
        <p>${highlightText(`Cost: ${textByLocale(complexity.cost)}`)}</p>
      </div>
      <div class="building-blocks-box">
        <strong>${t("buildingBlocks")}:</strong>
        <p>${highlightText(technique.buildingBlocks.join(", "))}</p>
      </div>
      ${technique.mermaid ? `<div class="mermaid">${technique.mermaid}</div>` : ""}
      <details class="detail-box">
        <summary>${t("detailedLanguageTable")}</summary>
        <table>
          <thead>${renderRow([t("language"), "Name", t("specifics")].map(highlightText), 1, "th")}</thead>
          <tbody>${detailsRows}</tbody>
        </table>
      </details>
      <section class="examples-section">
        <h4>${t("examples")}</h4>
        <div class="example-tabs">${examplesTabs}</div>
        <div>${examplesPanels}</div>
      </section>
      </div>
    </details>
  `;
}

function renderTechniques() {
  const q = normalize(state.query);
  const items = TECHNIQUES.filter((tch) => matchesTechniqueFilters(tch) && matchesQueryTechnique(tch, q)).sort((a, b) => a.order - b.order);
  ui.techniquesContainer.innerHTML = items.map((item) => renderTechniqueCard(item)).join("\n");
  bindExampleTabs();
  if (window.mermaid && typeof window.mermaid.run === "function") {
    window.mermaid.run();
  }
}

function renderConceptsTable() {
  const q = normalize(state.query);
  const rows = CONCEPTS.filter((concept) => matchesConceptFilters(concept) && matchesQueryConcept(concept, q));

  const headers = [
    "Concept",
    t("origin"),
    t("what"),
    t("how"),
    t("when"),
    t("pros"),
    t("cons"),
    t("complexity")
  ];

  const thead = `<thead>${renderRow(headers.map(highlightText), 1, "th")}</thead>`;
  const tbody = rows
    .map((c) => {
      const cells = [
        highlightLocale(c.name),
        highlightLocale(c.origin),
        highlightLocale(c.what),
        highlightLocale(c.how),
        highlightLocale(c.when),
        highlightText(c.pros.map((p) => textByLocale(p)).join("; ")),
        highlightText(c.cons.map((p) => textByLocale(p)).join("; ")),
        highlightLocale(c.complexity)
      ];
      return renderRow(cells, 1);
    })
    .join("");

  ui.conceptsTable.innerHTML = `${thead}<tbody>${tbody}</tbody>`;
}

function renderDetailedLanguageTable() {
  const q = normalize(state.query);
  const languages = activeLanguages();
  const filtered = TECHNIQUES.filter((tch) => matchesTechniqueFilters(tch) && matchesQueryTechnique(tch, q)).sort((a, b) => a.order - b.order);

  const headers = ["MPOT", ...languages.map((l) => `${l.label} (${t("specifics")})`)];
  const thead = `<thead>${renderRow(headers.map(highlightText), 1, "th")}</thead>`;

  const tbody = filtered
    .map((technique) => {
      const cells = [highlightLocale(technique.name)];
      for (const lang of languages) {
        const detail = technique.languageDetails[lang.id];
        cells.push(detail ? highlightText(`${detail.name} | ${detail.specifics}`) : highlightText("-"));
      }
      return renderRow(cells, 1);
    })
    .join("");

  ui.detailedLangTable.innerHTML = `${thead}<tbody>${tbody}</tbody>`;
}

function renderDetailedConceptTable() {
  const q = normalize(state.query);
  const languages = activeLanguages();
  const filtered = DETAILED_CONCEPT_ROWS.filter((row) => {
    if (state.languageFilter !== "all" && !row[`${state.languageFilter}_provider`] && !row[`${state.languageFilter}_specific`]) {
      return false;
    }
    if (!q) return true;
    const bag = [
      textByLocale(row.conceptName),
      ...languages.flatMap((lang) => [row[`${lang.id}_provider`] || "", row[`${lang.id}_specific`] || ""])
    ].join(" ");
    return normalize(bag).includes(q);
  });

  const headers = [
    "Concept",
    ...languages.flatMap((l) => [`${l.label} ${t("providerName")}`, `${l.label} ${t("specifics")}`])
  ];

  const thead = `<thead>${renderRow(headers.map(highlightText), 1, "th")}</thead>`;

  const tbody = filtered
    .map((row) => {
      const cells = [highlightLocale(row.conceptName)];
      for (const lang of languages) {
        cells.push(highlightText(row[`${lang.id}_provider`] || "-"));
        cells.push(highlightText(row[`${lang.id}_specific`] || "-"));
      }
      return renderRow(cells, 1);
    })
    .join("");

  ui.detailedConceptTable.innerHTML = `${thead}<tbody>${tbody}</tbody>`;
}

function bindExampleTabs() {
  const tabs = document.querySelectorAll(".example-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tech = tab.getAttribute("data-tech");
      const targetId = tab.getAttribute("data-target");

      document
        .querySelectorAll(`.example-tab[data-tech='${tech}']`)
        .forEach((btn) => btn.classList.remove("active"));
      tab.classList.add("active");

      document
        .querySelectorAll(`#techniques-container .example-panel[id^='${tech}-']`)
        .forEach((panel) => panel.classList.remove("active"));
      const panel = document.getElementById(targetId);
      if (panel) panel.classList.add("active");
    });
  });
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function render() {
  document.documentElement.setAttribute("data-theme", state.theme);
  renderHeaderTexts();
  renderFilters();
  renderGeneralComparison();
  renderTechniques();
  renderConceptsTable();
  renderDetailedLanguageTable();
  renderDetailedConceptTable();
  syncScrollUi();
}

function syncScrollUi() {
  ui.backToTop.classList.toggle("visible", window.scrollY > window.innerHeight);
}

function bindEvents() {
  ui.search.addEventListener("input", (e) => {
    state.query = e.target.value;
    render();
  });

  ui.levelFilter.addEventListener("change", (e) => {
    state.levelFilter = e.target.value;
    render();
  });

  ui.categoryFilter.addEventListener("change", (e) => {
    state.categoryFilter = e.target.value;
    render();
  });

  ui.languageFilter.addEventListener("change", (e) => {
    state.languageFilter = e.target.value;
    render();
  });

  ui.localeBtn.addEventListener("click", () => {
    state.locale = state.locale === "en" ? "vi" : "en";
    render();
  });

  ui.themeBtn.addEventListener("click", () => {
    state.theme = state.theme === "light" ? "dark" : "light";
    render();
  });

  ui.backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", syncScrollUi, { passive: true });
}

function boot() {
  bindEvents();
  render();
}

boot();
