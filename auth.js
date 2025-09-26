// Authentication System
class AuthSystem {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUI();
        this.setMinDate();
    }

    setupEventListeners() {
        // Login/Register buttons
        document.getElementById('loginBtn').addEventListener('click', () => this.showLoginModal());
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());

        // Auth tabs
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchAuthTab(e.target.dataset.tab));
        });

        // Auth forms
        document.querySelector('#loginForm form').addEventListener('submit', (e) => this.handleLogin(e));
        document.querySelector('#registerForm form').addEventListener('submit', (e) => this.handleRegister(e));

        // Modal close
        document.querySelectorAll('.close').forEach(close => {
            close.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal')));
        });
    }

    setMinDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('availabilityDate').setAttribute('min', today);
        document.getElementById('startDate').setAttribute('min', today);
        document.getElementById('endDate').setAttribute('min', today);
    }

    showLoginModal() {
        document.getElementById('loginModal').classList.remove('hidden');
    }

    closeModal(modal) {
        modal.classList.add('hidden');
    }

    switchAuthTab(tab) {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(f => f.classList.add('hidden'));
        
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        document.getElementById(`${tab}Form`).classList.remove('hidden');
    }

    handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
        const password = formData.get('password') || e.target.querySelector('input[type="password"]').value;

        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.updateUI();
            this.closeModal(document.getElementById('loginModal'));
            this.showNotification('Welcome back!', 'success');
        } else {
            this.showNotification('Invalid email or password', 'error');
        }
    }

    handleRegister(e) {
        e.preventDefault();
        const form = e.target;
        const inputs = form.querySelectorAll('input');
        
        const userData = {
            id: Date.now(),
            name: inputs[0].value,
            email: inputs[1].value,
            phone: inputs[2].value,
            password: inputs[3].value,
            confirmPassword: inputs[4].value,
            joinDate: new Date().toISOString()
        };

        if (userData.password !== userData.confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }

        if (this.users.find(u => u.email === userData.email)) {
            this.showNotification('Email already registered', 'error');
            return;
        }

        delete userData.confirmPassword;
        this.users.push(userData);
        localStorage.setItem('users', JSON.stringify(this.users));
        
        this.currentUser = userData;
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        this.updateUI();
        this.closeModal(document.getElementById('loginModal'));
        this.showNotification('Account created successfully!', 'success');
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateUI();
        this.showNotification('Logged out successfully', 'success');
    }

    updateUI() {
        const loginBtn = document.getElementById('loginBtn');
        const userProfile = document.getElementById('userProfile');
        const userName = document.getElementById('userName');

        if (this.currentUser) {
            loginBtn.classList.add('hidden');
            userProfile.classList.remove('hidden');
            userName.textContent = this.currentUser.name;
        } else {
            loginBtn.classList.remove('hidden');
            userProfile.classList.add('hidden');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
        `;

        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize auth system
const authSystem = new AuthSystem();