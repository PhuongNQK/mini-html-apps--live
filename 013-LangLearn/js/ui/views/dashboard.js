import { createElement } from '../../utils/helpers.js';
import { LANGUAGES, TOPICS } from '../../data/languages.js';

export function DashboardView() {
    const user = window.app.store.getState().currentUser;
    const container = createElement('div', 'view-container');

    // Header
    const header = createElement('div', 'dashboard-header');
    header.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <button id="btn-back-welcome" class="btn btn-text">← Back</button>
            <div class="user-info">
                <span class="avatar">${user.avatar}</span>
                <span class="name">${user.name}</span>
            </div>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
            <div class="coins-display">
                🪙 ${user.totalCoins}
            </div>
            <button id="btn-settings" class="btn-icon" style="font-size: 1.5rem; background: none; border: none; cursor: pointer;">⚙️</button>
        </div>
    `;

    // Settings Modal
    const modalOverlay = createElement('div', 'modal-overlay hidden');
    modalOverlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.5); z-index: 1000; display: none;
        justify-content: center; align-items: center;
    `;

    const modalContent = createElement('div', 'modal-content card');
    modalContent.style.cssText = `
        background: white; padding: 20px; border-radius: 15px; width: 90%; max-width: 400px;
        text-align: center; position: relative;
    `;

    // Default language logic
    const currentDefaultLang = user.defaultLanguage || 'en';

    let optionsHtml = '';
    LANGUAGES.forEach(lang => {
        const isSelected = lang.code === currentDefaultLang ? 'selected' : '';
        optionsHtml += `<option value="${lang.code}" ${isSelected}>${lang.flag} ${lang.name}</option>`;
    });

    modalContent.innerHTML = `
        <button id="btn-close-settings" style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 1.2rem; cursor: pointer;">✕</button>
        <h2>Settings</h2>
        <div style="margin: 20px 0; text-align: left;">
            <label style="display: block; margin-bottom: 8px; font-weight: bold;">Default Language</label>
            <select id="select-default-lang" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ddd;">
                ${optionsHtml}
            </select>
        </div>
        <button id="btn-save-settings" class="btn btn-primary" style="width: 100%;">Save</button>
    `;

    modalOverlay.appendChild(modalContent);
    container.appendChild(modalOverlay);

    // Event Listeners for Settings
    const settingsBtn = header.querySelector('#btn-settings');
    const backBtn = header.querySelector('#btn-back-welcome');
    const closeBtn = modalContent.querySelector('#btn-close-settings');
    const saveBtn = modalContent.querySelector('#btn-save-settings');
    const langSelect = modalContent.querySelector('#select-default-lang');

    backBtn.onclick = () => {
        window.app.router.navigate('welcome');
    };

    settingsBtn.onclick = () => {
        modalOverlay.classList.remove('hidden');
        modalOverlay.style.display = 'flex';
    };

    const closeModal = () => {
        modalOverlay.classList.add('hidden');
        modalOverlay.style.display = 'none';
    };

    closeBtn.onclick = closeModal;
    modalOverlay.onclick = (e) => {
        if (e.target === modalOverlay) closeModal();
    };

    saveBtn.onclick = async () => {
        const newDefaultLang = langSelect.value;
        const updatedUser = { ...user, defaultLanguage: newDefaultLang };

        // Save to DB
        try {
            await window.app.db.updateUser(updatedUser);
            // Update Store
            window.app.store.setState({ currentUser: updatedUser });
            alert('Settings saved!');
            closeModal();
        } catch (err) {
            console.error('Failed to save settings:', err);
            alert('Error saving settings.');
        }
    };

    // Language Selector
    const langSection = createElement('div', 'section-container');
    langSection.innerHTML = `<h2>Choose a Language</h2>`;

    const langGrid = createElement('div', 'languages-grid');

    LANGUAGES.forEach(lang => {
        const card = createElement('button', 'card lang-card fade-in');
        card.innerHTML = `<span class="flag">${lang.flag}</span> <span class="lang-name">${lang.name}</span>`;
        card.onclick = () => selectLanguage(lang.code, container);
        langGrid.appendChild(card);
    });

    langSection.appendChild(langGrid);

    // Topics Section (Hidden initially until language selected)
    // For simplicity V1: Show topics immediately after language click? 
    // Or replace view? Let's replace content of container to keep it simple SPA feel.

    container.append(header, langSection);
    return container;
}



// ... (DashboardView generic part remains same, omitting to save tokens if possible, but replace needs context)
// Actually, let's redefine the selectLanguage function completely.

function selectLanguage(langCode, container) {
    // Update Store
    window.app.store.setState({ currentLanguage: langCode });
    // Navigate to Curriculum View
    window.app.router.navigate('curriculum-select');
}
