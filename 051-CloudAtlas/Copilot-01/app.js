// Cloud Atlas Application Logic
// Renders all content dynamically from DATA structure

let currentLanguage = localStorage.getItem('language') || 'en';
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeDarkMode();
    renderProviderTable();
    renderServices();
    renderServiceComparison();
    renderBuildingBlocks();
    renderBBComparison();
    renderTakeaways();
});

// ===== DARK MODE FUNCTIONALITY =====
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
    document.body.classList.toggle('dark-mode', isDarkMode);
    updateThemeButton();
}

function initializeDarkMode() {
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
    updateThemeButton();
}

function updateThemeButton() {
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
        const label = isDarkMode ? 'themeBtnLight' : 'themeBtnDark';
        themeBtn.textContent = t(label);
    }
}

// ===== LANGUAGE FUNCTIONALITY =====
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'vi' : 'en';
    localStorage.setItem('language', currentLanguage);
    updateLanguage();
}

function updateLanguage() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });

    // Update button text
    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        langBtn.textContent = t('langBtn');
    }

    // Update search placeholder
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.placeholder = t('searchPlaceholder');
    }

    // Re-render all sections with new language
    renderProviderTable();
    renderServices();
    renderServiceComparison();
    renderBuildingBlocks();
    renderBBComparison();
    renderTakeaways();
}

// ===== TRANSLATION HELPER =====
function t(key) {
    const translations = DATA.translations[currentLanguage];
    return translations[key] || key;
}

// ===== PROVIDER TABLE RENDERING =====
function renderProviderTable() {
    const tbody = document.getElementById('providerTableBody');
    if (!tbody) return;

    tbody.innerHTML = DATA.providers.map(provider => `
        <tr>
            <td><strong>${provider.fullName}</strong></td>
            <td>${provider.founded}</td>
            <td>${provider.origin}</td>
            <td>${provider.targetMarket}</td>
            <td>${provider.marketShare}</td>
            <td>${provider.serviceCategories}</td>
        </tr>
    `).join('');

    // Update section title
    const title = document.getElementById('providerTitle');
    if (title) title.textContent = t('providerTitle');
}

// ===== SERVICE CARDS RENDERING =====
function renderServices() {
    const container = document.getElementById('servicesContainer');
    if (!container) return;

    container.innerHTML = DATA.services.map(service => `
        <div class="card" data-service="${service.id}" data-category="${service.category}" data-searchable="${getSearchableText(service)}">
            <div class="category-label">${service.category}</div>
            <h4>${service.name}</h4>
            
            <div class="info-row">
                <div class="info-label">${t('origin')}</div>
                <div class="info-value">${service.origin}</div>
            </div>

            <div class="info-row">
                <div class="info-label">${t('whatItIs')}</div>
                <div class="info-value">${service.whatItIs}</div>
            </div>

            <div class="info-row">
                <div class="info-label">${t('whenToUse')}</div>
                <div class="info-value">${service.whenToUse}</div>
            </div>

            <div class="info-row">
                <div class="info-label">${t('pros')}</div>
                <div class="info-value">${service.pros}</div>
            </div>

            <div class="info-row">
                <div class="info-label">${t('cons')}</div>
                <div class="info-value">${service.cons}</div>
            </div>

            <div class="info-row">
                <div class="info-label">${t('cost')}</div>
                <div class="info-value">${service.cost}</div>
            </div>

            <div class="bb-section">
                <details>
                    <summary>${t('implementations')}</summary>
                    <div style="margin-top: 0.8rem; padding-left: 1rem;">
                        ${Object.entries(service.implementations).map(([provider, impl]) => `
                            <div style="margin: 0.5rem 0; font-size: 0.95rem;">
                                <strong>${provider.toUpperCase()}:</strong> ${impl}
                            </div>
                        `).join('')}
                    </div>
                </details>
            </div>
        </div>
    `).join('');

    // Update section title
    const title = document.getElementById('servicesTitle');
    if (title) title.textContent = t('servicesTitle');

    const subtitle = document.getElementById('servicesSubtitle');
    if (subtitle) subtitle.textContent = t('servicesSubtitle');
}

// ===== SERVICE COMPARISON TABLE RENDERING =====
function renderServiceComparison() {
    const tbody = document.getElementById('comparisonTableBody');
    if (!tbody) return;

    tbody.innerHTML = DATA.serviceComparisonTable.map(row => `
        <tr data-service="${row.service.toLowerCase().replace(/\s+/g, '-')}" data-searchable="${row.service} ${Object.values(row).join(' ')}">
            <td><strong>${row.service}</strong></td>
            <td>${row.aws}</td>
            <td>${row.azure}</td>
            <td>${row.gcp}</td>
            <td>${row.alibaba}</td>
            <td>${row.ibm}</td>
            <td>${row.oracle}</td>
        </tr>
    `).join('');

    // Update section title
    const title = document.getElementById('comparisonTitle');
    if (title) title.textContent = t('comparisonTitle');
}

// ===== BUILDING BLOCKS CARDS RENDERING =====
function renderBuildingBlocks() {
    const container = document.getElementById('bbContainer');
    if (!container) return;

    container.innerHTML = DATA.buildingBlocks.map(bb => `
        <div class="bb-card" data-bb="${bb.id}" data-category="${bb.category}" data-searchable="${getSearchableText(bb)}">
            <div class="bb-label">${bb.category}</div>
            <h4>${bb.name}</h4>

            <div class="info-row">
                <div class="info-label">${t('origin')}</div>
                <div class="info-value">${bb.origin}</div>
            </div>

            <div class="info-row">
                <div class="info-label">${t('whatItIs')}</div>
                <div class="info-value">${bb.whatItIs}</div>
            </div>

            <div class="info-row">
                <div class="info-label">${t('whenToUse')}</div>
                <div class="info-value">${bb.whenToUse}</div>
            </div>

            <div class="info-row">
                <div class="info-label">${t('pros')}</div>
                <div class="info-value">${bb.pros}</div>
            </div>

            <div class="info-row">
                <div class="info-label">${t('cons')}</div>
                <div class="info-value">${bb.cons}</div>
            </div>

            <div class="info-row">
                <div class="info-label">${t('cost')}</div>
                <div class="info-value">${bb.cost}</div>
            </div>

            <div class="bb-section">
                <details>
                    <summary>${t('implementations')}</summary>
                    <div style="margin-top: 0.8rem; padding-left: 1rem;">
                        ${Object.entries(bb.implementations).map(([provider, impl]) => `
                            <div style="margin: 0.5rem 0; font-size: 0.95rem;">
                                <strong>${provider}:</strong> ${impl}
                            </div>
                        `).join('')}
                    </div>
                </details>
            </div>
        </div>
    `).join('');

    // Update section title
    const title = document.getElementById('bbTitle');
    if (title) title.textContent = t('bbTitle');

    const subtitle = document.getElementById('bbSubtitle');
    if (subtitle) subtitle.textContent = t('bbSubtitle');
}

// ===== BUILDING BLOCK COMPARISON TABLE RENDERING =====
function renderBBComparison() {
    const tbody = document.getElementById('bbCompTableBody');
    if (!tbody) return;

    tbody.innerHTML = DATA.bbComparisonTable.map(row => `
        <tr data-bb="${row.bb.toLowerCase().replace(/\s+/g, '-')}" data-searchable="${row.bb} ${Object.values(row).join(' ')}">
            <td><strong>${row.bb}</strong></td>
            <td>${row.aws}</td>
            <td>${row.azure}</td>
            <td>${row.gcp}</td>
            <td>${row.alibaba}</td>
            <td>${row.ibm}</td>
            <td>${row.oracle}</td>
        </tr>
    `).join('');

    // Update section title
    const title = document.getElementById('bbCompTitle');
    if (title) title.textContent = t('bbCompTitle');
}

// ===== TAKEAWAYS RENDERING =====
function renderTakeaways() {
    const grid = document.getElementById('takeawaysGrid');
    if (!grid) return;

    grid.innerHTML = DATA.takeaways.map(takeaway => `
        <div class="provider-card" data-searchable="${takeaway.category} ${takeaway.insights}">
            <h3>${takeaway.category}</h3>
            <p>${takeaway.insights}</p>
        </div>
    `).join('');

    // Update section title
    const title = document.getElementById('takeawaysTitle');
    if (title) title.textContent = t('takeawaysTitle');
}

// ===== SEARCH FUNCTIONALITY =====
function filterServices() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const regex = new RegExp(searchTerm, 'i');

    let hasResults = false;

    // Filter provider table
    document.querySelectorAll('#providerTableBody tr').forEach(row => {
        const text = row.textContent.toLowerCase();
        const match = regex.test(text);
        row.classList.toggle('hidden', !match);
        if (match) hasResults = true;
    });

    // Filter service cards
    document.querySelectorAll('.card[data-service]').forEach(card => {
        const searchable = card.getAttribute('data-searchable');
        const match = regex.test(searchable);
        card.classList.toggle('hidden', !match);
        if (match) hasResults = true;
    });

    // Filter service comparison table
    document.querySelectorAll('#comparisonTableBody tr').forEach(row => {
        const searchable = row.getAttribute('data-searchable');
        const match = regex.test(searchable);
        row.classList.toggle('hidden', !match);
        if (match) hasResults = true;
    });

    // Filter building block cards
    document.querySelectorAll('.bb-card').forEach(card => {
        const searchable = card.getAttribute('data-searchable');
        const match = regex.test(searchable);
        card.classList.toggle('hidden', !match);
        if (match) hasResults = true;
    });

    // Filter building block comparison table
    document.querySelectorAll('#bbCompTableBody tr').forEach(row => {
        const searchable = row.getAttribute('data-searchable');
        const match = regex.test(searchable);
        row.classList.toggle('hidden', !match);
        if (match) hasResults = true;
    });

    // Filter takeaways
    document.querySelectorAll('#takeawaysGrid .provider-card').forEach(card => {
        const searchable = card.getAttribute('data-searchable');
        const match = regex.test(searchable);
        card.classList.toggle('hidden', !match);
        if (match) hasResults = true;
    });

    // Show/hide "no results" message (optional enhancement)
    if (!searchTerm) {
        document.querySelectorAll('.hidden').forEach(el => el.classList.remove('hidden'));
    }
}

// ===== HELPER FUNCTIONS =====
function getSearchableText(item) {
    // Combine all text fields for search
    const fields = [
        item.name,
        item.category,
        item.origin,
        item.whatItIs,
        item.whenToUse,
        item.pros,
        item.cons,
        item.cost
    ];

    if (item.implementations) {
        fields.push(Object.values(item.implementations).join(' '));
    }

    return fields.join(' ');
}

// ===== SMOOTH SCROLL FOR NAVIGATION =====
document.querySelectorAll('.nav-bar a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== CLEAR HIDDEN CLASS ON RENDER =====
function showAll() {
    document.querySelectorAll('.hidden').forEach(el => el.classList.remove('hidden'));
}
