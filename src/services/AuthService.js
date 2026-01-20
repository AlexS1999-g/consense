// Simulated Authentication Service using LocalStorage
// Implements basic user management without an external backend

const USERS_KEY = 'consense_users';
const CURRENT_USER_KEY = 'consense_current_user';

export const AuthService = {
    // Register a new user
    register: (username, password) => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');

        if (users.find(u => u.username === username)) {
            throw new Error('Username already exists');
        }

        const newUser = {
            id: crypto.randomUUID(),
            username,
            password, // In a real app, hash this!
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        // Auto login after register
        AuthService.setCurrentUser(newUser);
        return newUser;
    },

    // Login an existing user
    login: (username, password) => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const user = users.find(u => u.username === username && u.password === password);

        if (!user) {
            throw new Error('Invalid credentials');
        }

        AuthService.setCurrentUser(user);
        return user;
    },

    // Logout
    logout: () => {
        localStorage.removeItem(CURRENT_USER_KEY);
    },

    // Check if user is logged in on load
    getCurrentUser: () => {
        const stored = localStorage.getItem(CURRENT_USER_KEY);
        return stored ? JSON.parse(stored) : null;
    },

    // Private helper
    setCurrentUser: (user) => {
        // Don't store password in session
        const { password, ...safeUser } = user;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
    },

    // Helper to get storage key for user data
    getUserDataKey: (user) => {
        if (!user) return null;
        return `consense_data_${user.id}`;
    },

    // Template Management
    getTemplatesKey: (user) => {
        if (!user) return null;
        return `consense_templates_${user.id}`;
    },

    saveTemplate: (user, template) => {
        if (!user) return;
        const key = AuthService.getTemplatesKey(user);
        const templates = JSON.parse(localStorage.getItem(key) || '[]');

        const newTemplate = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            ...template
        };

        templates.push(newTemplate);
        localStorage.setItem(key, JSON.stringify(templates));
        return newTemplate;
    },

    getTemplates: (user) => {
        if (!user) return [];
        const key = AuthService.getTemplatesKey(user);
        return JSON.parse(localStorage.getItem(key) || '[]');
    },

    deleteTemplate: (user, templateId) => {
        if (!user) return;
        const key = AuthService.getTemplatesKey(user);
        const templates = JSON.parse(localStorage.getItem(key) || '[]');
        const filtered = templates.filter(t => t.id !== templateId);
        localStorage.setItem(key, JSON.stringify(filtered));
    }
};
