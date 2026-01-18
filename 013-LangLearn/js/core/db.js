export class Database {
    constructor() {
        this.dbName = 'LangLearnDB';
        this.version = 1;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = (event) => {
                console.error("IndexedDB error:", event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log("Database initialized");
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // User Store
                if (!db.objectStoreNames.contains('users')) {
                    const objectStore = db.createObjectStore('users', { keyPath: 'id' });
                    objectStore.createIndex("name", "name", { unique: false });
                }

                // Progress Store
                if (!db.objectStoreNames.contains('progress')) {
                    const objectStore = db.createObjectStore('progress', { keyPath: ['userId', 'language', 'topic', 'level'] });
                    objectStore.createIndex("userId", "userId", { unique: false });
                }
            };
        });
    }

    async addUser(user) {
        return this._transaction('users', 'readwrite', (store) => store.add(user));
    }

    async updateUser(user) {
        return this._transaction('users', 'readwrite', (store) => store.put(user));
    }

    async getUsers() {
        return this._transaction('users', 'readonly', (store) => store.getAll());
    }

    async getUser(id) {
        return this._transaction('users', 'readonly', (store) => store.get(id));
    }

    async saveProgress(progress) {
        return this._transaction('progress', 'readwrite', (store) => store.put(progress));
    }

    _transaction(storeName, mode, callback) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], mode);
            const store = transaction.objectStore(storeName);
            const request = callback(store);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}
