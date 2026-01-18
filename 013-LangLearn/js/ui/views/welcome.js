import { createElement, generateUUID } from '../../utils/helpers.js';

export async function WelcomeView() {
    const container = createElement('div', 'view-container centered fade-in');

    // Check if there are existing users to show a "Select Profile" screen differently
    // For now, simpler approach: List users if any, plus "New User" button

    const title = createElement('h1', '', 'LangLearn 🌍');
    const subtitle = createElement('p', '', 'Who is learning today?');

    const userList = createElement('div', 'user-list');

    // Get users from DB
    // Note: We need access to the globally initialized app or pass db instance.
    // For simplicity, we'll access window.app.db since it's a small app.
    const users = await window.app.db.getUsers();

    if (users && users.length > 0) {
        users.forEach(user => {
            const userBtn = createElement('button', 'btn btn-secondary user-select-btn');
            userBtn.innerHTML = `
                <span class="user-avatar">${user.avatar || '👤'}</span>
                <span class="user-name">${user.name}</span>
            `;
            userBtn.onclick = () => loginUser(user);
            userList.appendChild(userBtn);
        });
    }

    const newUserBtn = createElement('button', 'btn btn-primary btn-lg');
    newUserBtn.innerText = 'New Player';
    newUserBtn.onclick = () => showCreateUserForm(container);

    container.append(title, subtitle, userList, createElement('br'), newUserBtn);
    return container;
}

function showCreateUserForm(container) {
    container.innerHTML = ''; // Clear view

    const title = createElement('h2', '', 'What is your name?');

    const input = createElement('input', 'input-lg');
    input.placeholder = "Enter your name";
    input.type = "text";

    const saveBtn = createElement('button', 'btn btn-primary btn-lg');
    saveBtn.innerText = "Let's Go!";
    saveBtn.disabled = true;

    input.oninput = () => {
        saveBtn.disabled = input.value.trim().length === 0;
    };

    saveBtn.onclick = async () => {
        const name = input.value.trim();
        if (name) {
            const newUser = {
                id: generateUUID(),
                name: name,
                avatar: '🐼', // Default avatar for now
                totalCoins: 0,
                currentLanguages: []
            };

            await window.app.db.addUser(newUser);
            loginUser(newUser);
        }
    };

    const backBtn = createElement('button', 'btn btn-text');
    backBtn.innerText = "Back";
    backBtn.onclick = () => window.app.router.navigate('welcome');

    container.append(title, input, createElement('br'), saveBtn, createElement('br'), backBtn);
}

function loginUser(user) {
    window.app.store.setState({ currentUser: user });
    window.app.router.navigate('dashboard');
}
