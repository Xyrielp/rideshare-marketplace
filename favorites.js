// Favorites System
class FavoritesSystem {
    constructor() {
        this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateFavoritesCount();
    }

    setupEventListeners() {
        document.getElementById('favoritesBtn').addEventListener('click', () => this.showFavorites());
    }

    addToFavorites(motorId) {
        if (!authSystem.isLoggedIn()) {
            authSystem.showNotification('Please login to add favorites', 'error');
            authSystem.showLoginModal();
            return;
        }

        const userId = authSystem.getCurrentUser().id;
        const favoriteKey = `${userId}_${motorId}`;
        
        if (!this.favorites.includes(favoriteKey)) {
            this.favorites.push(favoriteKey);
            localStorage.setItem('favorites', JSON.stringify(this.favorites));
            this.updateFavoritesCount();
            authSystem.showNotification('Added to favorites!', 'success');
        }
        this.updateFavoriteButtons();
    }

    removeFromFavorites(motorId) {
        if (!authSystem.isLoggedIn()) return;

        const userId = authSystem.getCurrentUser().id;
        const favoriteKey = `${userId}_${motorId}`;
        
        this.favorites = this.favorites.filter(fav => fav !== favoriteKey);
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        this.updateFavoritesCount();
        this.updateFavoriteButtons();
        authSystem.showNotification('Removed from favorites', 'info');
        
        // Refresh favorites view if currently showing
        if (!document.getElementById('favoritesSection').classList.contains('hidden')) {
            this.displayFavorites();
        }
    }

    isFavorite(motorId) {
        if (!authSystem.isLoggedIn()) return false;
        const userId = authSystem.getCurrentUser().id;
        const favoriteKey = `${userId}_${motorId}`;
        return this.favorites.includes(favoriteKey);
    }

    getUserFavorites() {
        if (!authSystem.isLoggedIn()) return [];
        const userId = authSystem.getCurrentUser().id;
        return this.favorites
            .filter(fav => fav.startsWith(`${userId}_`))
            .map(fav => parseInt(fav.split('_')[1]));
    }

    showFavorites() {
        if (!authSystem.isLoggedIn()) {
            authSystem.showNotification('Please login to view favorites', 'error');
            authSystem.showLoginModal();
            return;
        }

        showSection('favorites');
        this.displayFavorites();
        setActiveNavLink(document.getElementById('favoritesBtn'));
    }

    displayFavorites() {
        const favoriteIds = this.getUserFavorites();
        const favoriteMotors = motorcycles.filter(motor => favoriteIds.includes(motor.id));
        
        const favoritesList = document.getElementById('favoritesList');
        
        if (favoriteMotors.length === 0) {
            favoritesList.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <h3>💔 No favorites yet</h3>
                    <p>Start adding motorcycles to your favorites!</p>
                    <button onclick="showSection('home'); setActiveNavLink(document.getElementById('homeBtn'))" class="browse-btn">
                        Browse Motorcycles
                    </button>
                </div>
            `;
            return;
        }

        favoritesList.innerHTML = favoriteMotors.map(motor => `
            <div class="product-card" onclick="openBookingModal(${motor.id})">
                <div class="product-image">
                    <img src="${motor.image}" alt="${motor.name}" onerror="this.src='https://via.placeholder.com/220x180?text=No+Image'">
                    <div class="product-badge">${motor.category}</div>
                    <button class="favorite-btn active" onclick="event.stopPropagation(); favoritesSystem.removeFromFavorites(${motor.id})">
                        ❤️
                    </button>
                </div>
                <div class="product-info">
                    <div class="product-title">${motor.name}</div>
                    <div class="shop-name-small">by ${motor.shopName}</div>
                    <div class="product-price">
                        <span class="current-price">₱${motor.price}</span>
                        <span class="price-period">/day</span>
                    </div>
                    <div class="product-rating">
                        <span class="stars">⭐⭐⭐⭐⭐</span>
                        <span class="rating-count">(${Math.floor(Math.random() * 50) + 10})</span>
                    </div>
                    <button class="book-btn" onclick="event.stopPropagation(); openBookingModal(${motor.id})">Book Now</button>
                </div>
            </div>
        `).join('');
    }

    updateFavoriteButtons() {
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            const motorId = parseInt(btn.getAttribute('onclick').match(/\d+/)[0]);
            if (this.isFavorite(motorId)) {
                btn.classList.add('active');
                btn.innerHTML = '❤️';
            } else {
                btn.classList.remove('active');
                btn.innerHTML = '🤍';
            }
        });
    }

    updateFavoritesCount() {
        const count = this.getUserFavorites().length;
        const favBtn = document.getElementById('favoritesBtn');
        if (count > 0) {
            favBtn.innerHTML = `❤️ Favorites (${count})`;
        } else {
            favBtn.innerHTML = '❤️ Favorites';
        }
    }

    addFavoriteButton(motorId) {
        return `
            <button class="favorite-btn ${this.isFavorite(motorId) ? 'active' : ''}" 
                    onclick="event.stopPropagation(); favoritesSystem.toggleFavorite(${motorId})">
                ${this.isFavorite(motorId) ? '❤️' : '🤍'}
            </button>
        `;
    }

    toggleFavorite(motorId) {
        if (this.isFavorite(motorId)) {
            this.removeFromFavorites(motorId);
        } else {
            this.addToFavorites(motorId);
        }
    }
}

// Add browse button styles
const favoritesStyle = document.createElement('style');
favoritesStyle.textContent = `
    .browse-btn {
        background: #ee4d2d;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        margin-top: 16px;
        transition: all 0.2s;
    }
    .browse-btn:hover {
        background: #d63384;
        transform: translateY(-1px);
    }
`;
document.head.appendChild(favoritesStyle);

// Initialize favorites system
const favoritesSystem = new FavoritesSystem();