// Modern Motorcycle Rental Marketplace
// Enhanced with mobile-first design and improved UX

// Sample data
let shops = [
    {
        id: 1,
        name: "Manila Speed Rentals",
        description: "Premium sport bikes and high-performance motorcycles for thrill seekers",
        location: "Makati, Manila",
        logo: "🏁",
        motorcycles: 12,
        rating: 4.8,
        verified: true,
        yearsActive: 5
    },
    {
        id: 2,
        name: "Island Cruisers",
        description: "Classic cruisers and touring bikes for comfortable island adventures",
        location: "Cebu City, Cebu",
        logo: "🏝️",
        motorcycles: 18,
        rating: 4.9,
        verified: true,
        yearsActive: 3
    },
    {
        id: 3,
        name: "Urban Scooter Hub",
        description: "Affordable scooters and commuter bikes for daily city navigation",
        location: "Davao City, Davao",
        logo: "🛵",
        motorcycles: 25,
        rating: 4.7,
        verified: false,
        yearsActive: 2
    }
];

let motorcycles = [
    {
        id: 1,
        name: "Yamaha YZF-R1",
        category: "sport",
        price: 950,
        weeklyPrice: 5500,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        description: "High-performance sport bike with advanced electronics and track-ready performance",
        shopId: 1,
        shopName: "Manila Speed Rentals",
        available: true,
        featured: true
    },
    {
        id: 2,
        name: "Harley Davidson Street 750",
        category: "cruiser",
        price: 850,
        weeklyPrice: 4800,
        image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
        description: "Classic American cruiser perfect for comfortable long-distance touring",
        shopId: 2,
        shopName: "Island Cruisers",
        available: true,
        featured: false
    },
    {
        id: 3,
        name: "Honda Gold Wing",
        category: "touring",
        price: 1000,
        weeklyPrice: 6000,
        image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400",
        description: "Luxury touring motorcycle with premium comfort and advanced features",
        shopId: 2,
        shopName: "Island Cruisers",
        available: true,
        featured: true
    },
    {
        id: 4,
        name: "Vespa Primavera 150",
        category: "scooter",
        price: 400,
        weeklyPrice: 2200,
        image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400",
        description: "Stylish Italian scooter perfect for city commuting and short trips",
        shopId: 3,
        shopName: "Urban Scooter Hub",
        available: true,
        featured: false
    },
    {
        id: 5,
        name: "Kawasaki Ninja 650",
        category: "sport",
        price: 750,
        weeklyPrice: 4200,
        image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400",
        description: "Versatile sport bike ideal for both beginners and experienced riders",
        shopId: 1,
        shopName: "Manila Speed Rentals",
        available: true,
        featured: false
    },
    {
        id: 6,
        name: "Honda PCX 160",
        category: "scooter",
        price: 500,
        weeklyPrice: 2800,
        image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400",
        description: "Modern automatic scooter with excellent fuel efficiency and storage",
        shopId: 3,
        shopName: "Urban Scooter Hub",
        available: true,
        featured: true
    }
];

// Global state
let currentMotorcycle = null;
let currentShop = null;
let userShop = null;
let currentStep = 1;
let currentFilter = 'all';
let isGridView = true;

// DOM Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const closeMobileMenu = document.getElementById('closeMobileMenu');
const homeBtn = document.getElementById('homeBtn');
const shopsBtn = document.getElementById('shopsBtn');
const rentBtn = document.getElementById('rentBtn');
const favoritesBtn = document.getElementById('favoritesBtn');
const loginBtn = document.getElementById('loginBtn');
const searchInput = document.getElementById('searchInput');
const heroSearchBtn = document.querySelector('.hero-search-btn');
const heroInput = document.querySelector('.hero-input');

// Sections
const homeSection = document.getElementById('homeSection');
const shopsSection = document.getElementById('shopsSection');
const shopDetailsSection = document.getElementById('shopDetailsSection');
const rentSection = document.getElementById('rentSection');
const favoritesSection = document.getElementById('favoritesSection');

// Lists and grids
const motorList = document.getElementById('motorList');
const shopsList = document.getElementById('shopsList');
const favoritesList = document.getElementById('favoritesList');
const shopHeader = document.getElementById('shopHeader');
const shopMotorcycles = document.getElementById('shopMotorcycles');

// Filters and controls
const toggleFilters = document.getElementById('toggleFilters');
const advancedFilters = document.getElementById('advancedFilters');
const quickFilters = document.querySelectorAll('.filter-chip');
const resultsCount = document.getElementById('resultsCount');
const gridView = document.getElementById('gridView');
const listView = document.getElementById('listView');
const loadMore = document.getElementById('loadMore');

// Forms
const shopForm = document.getElementById('shopForm');
const bikeForm = document.getElementById('bikeForm');
const pricingForm = document.getElementById('pricingForm');

// Modals
const bookingModal = document.getElementById('bookingModal');
const loginModal = document.getElementById('loginModal');
const successModal = document.getElementById('successModal');

// Mobile Menu
mobileMenuBtn?.addEventListener('click', () => {
    mobileMenuOverlay.classList.remove('hidden');
});

closeMobileMenu?.addEventListener('click', () => {
    mobileMenuOverlay.classList.add('hidden');
});

mobileMenuOverlay?.addEventListener('click', (e) => {
    if (e.target === mobileMenuOverlay) {
        mobileMenuOverlay.classList.add('hidden');
    }
});

// Navigation
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show target section
    const targetSection = document.getElementById(`${sectionName}Section`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
    
    // Update navigation
    updateNavigation(sectionName);
    
    // Close mobile menu
    mobileMenuOverlay?.classList.add('hidden');
    
    // Load section data
    switch(sectionName) {
        case 'home':
            displayMotorcycles();
            break;
        case 'shops':
            displayShops();
            break;
        case 'favorites':
            displayFavorites();
            break;
    }
}

function updateNavigation(activeSection) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[data-section="${activeSection}"]`) || 
                     document.getElementById(`${activeSection}Btn`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// Event Listeners
homeBtn?.addEventListener('click', () => showSection('home'));
shopsBtn?.addEventListener('click', () => showSection('shops'));
rentBtn?.addEventListener('click', () => showSection('rent'));
favoritesBtn?.addEventListener('click', () => showSection('favorites'));

// Mobile nav links
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        if (section) {
            showSection(section);
        }
    });
});

// Category navigation
document.querySelectorAll('.nav-btn[data-category]').forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        filterByCategory(category);
        showSection('home');
    });
});

// Search functionality
searchInput?.addEventListener('input', debounce(handleSearch, 300));
heroInput?.addEventListener('input', debounce(handleHeroSearch, 300));
heroSearchBtn?.addEventListener('click', handleHeroSearch);

function handleSearch() {
    const query = searchInput.value.trim();
    filterMotorcycles({ search: query });
}

function handleHeroSearch() {
    const query = heroInput?.value.trim() || '';
    if (searchInput) {
        searchInput.value = query;
    }
    showSection('home');
    filterMotorcycles({ search: query });
}

// Quick filters
quickFilters.forEach(chip => {
    chip.addEventListener('click', () => {
        // Update active state
        quickFilters.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        
        // Apply filter
        const filter = chip.dataset.filter;
        currentFilter = filter;
        applyQuickFilter(filter);
    });
});

function applyQuickFilter(filter) {
    let filtered = [...motorcycles];
    
    switch(filter) {
        case 'available':
            filtered = filtered.filter(m => m.available);
            break;
        case 'nearby':
            // Mock nearby filter - in real app would use geolocation
            filtered = filtered.filter(m => m.shopId <= 2);
            break;
        case 'budget':
            filtered = filtered.filter(m => m.price < 1000);
            break;
        case 'premium':
            filtered = filtered.filter(m => m.price > 800);
            break;
        case 'all':
        default:
            // Show all
            break;
    }
    
    displayMotorcycles(filtered);
}

// Advanced filters toggle
toggleFilters?.addEventListener('click', () => {
    advancedFilters?.classList.toggle('hidden');
    const icon = toggleFilters.querySelector('.filter-icon');
    if (icon) {
        icon.textContent = advancedFilters?.classList.contains('hidden') ? '⚙️' : '✖️';
    }
});

// View toggle
gridView?.addEventListener('click', () => {
    isGridView = true;
    gridView.classList.add('active');
    listView?.classList.remove('active');
    motorList?.classList.remove('list-view');
});

listView?.addEventListener('click', () => {
    isGridView = false;
    listView.classList.add('active');
    gridView?.classList.remove('active');
    motorList?.classList.add('list-view');
});

// Display functions
function displayMotorcycles(motors = motorcycles) {
    if (!motorList) return;
    
    const count = motors.length;
    if (resultsCount) {
        resultsCount.textContent = `${count} bike${count !== 1 ? 's' : ''} available`;
    }
    
    if (count === 0) {
        motorList.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-icon">🔍</div>
                <h3>No bikes found</h3>
                <p>Try adjusting your search or filters</p>
                <button onclick="resetFilters()" class="cta-btn">Clear Filters</button>
            </div>
        `;
        return;
    }
    
    motorList.innerHTML = motors.map(motor => createBikeCard(motor)).join('');
    
    // Show load more if there are more results
    if (loadMore) {
        loadMore.classList.toggle('hidden', count < 6);
    }
}

function createBikeCard(motor) {
    const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
    const reviews = Math.floor(Math.random() * 50) + 10;
    const stars = '⭐'.repeat(Math.round(rating));
    const shop = shops.find(s => s.id === motor.shopId);
    
    return `
        <div class="bike-card" onclick="openBookingModal(${motor.id})">
            <div class="bike-image">
                <img src="${motor.image}" alt="${motor.name}" 
                     onerror="this.src='https://via.placeholder.com/280x200?text=No+Image'">
                ${motor.featured ? '<div class="bike-badge">Featured</div>' : ''}
                <button class="favorite-btn" onclick="event.stopPropagation(); toggleFavorite(${motor.id})" 
                        data-bike-id="${motor.id}">♡</button>
            </div>
            <div class="bike-info">
                <h3 class="bike-title">${motor.name}</h3>
                <div class="bike-location">📍 ${shop?.location || 'Unknown'}</div>
                <div class="bike-rating">
                    <span class="stars">${stars}</span>
                    <span class="rating-text">${rating} (${reviews})</span>
                </div>
                <div class="bike-price">
                    <div>
                        <span class="price-amount">₱${motor.price.toLocaleString()}</span>
                        <span class="price-period">/day</span>
                    </div>
                    ${motor.weeklyPrice ? `<div class="weekly-price">₱${motor.weeklyPrice.toLocaleString()}/week</div>` : ''}
                </div>
                <button class="book-btn" onclick="event.stopPropagation(); openBookingModal(${motor.id})">
                    Book Now
                </button>
            </div>
        </div>
    `;
}

function displayShops() {
    if (!shopsList) return;
    
    shopsList.innerHTML = shops.map(shop => `
        <div class="shop-card" onclick="viewShop(${shop.id})">
            <div class="shop-banner">
                <div class="shop-logo">${shop.logo}</div>
            </div>
            <div class="shop-info">
                <div class="shop-name">
                    ${shop.name}
                    ${shop.verified ? ' <span style="color: #10b981;">✓</span>' : ''}
                </div>
                <div class="shop-location">📍 ${shop.location}</div>
                <div class="shop-stats">
                    <span>${shop.motorcycles} bikes</span>
                    <span>⭐ ${shop.rating}</span>
                </div>
                <div class="shop-description">${shop.description}</div>
            </div>
        </div>
    `).join('');
}

function displayFavorites() {
    const favorites = getFavorites();
    const favoriteBikes = motorcycles.filter(m => favorites.includes(m.id));
    
    if (!favoritesList) return;
    
    if (favoriteBikes.length === 0) {
        document.getElementById('emptyFavorites')?.classList.remove('hidden');
        favoritesList.innerHTML = '';
        return;
    }
    
    document.getElementById('emptyFavorites')?.classList.add('hidden');
    favoritesList.innerHTML = favoriteBikes.map(motor => createBikeCard(motor)).join('');
}

function viewShop(shopId) {
    currentShop = shops.find(s => s.id === shopId);
    if (!currentShop) return;
    
    const shopBikes = motorcycles.filter(m => m.shopId === shopId);
    
    // Update shop header
    if (shopHeader) {
        shopHeader.innerHTML = `
            <div class="shop-header-content">
                <div class="shop-header-logo">${currentShop.logo}</div>
                <div class="shop-header-info">
                    <h2>${currentShop.name} ${currentShop.verified ? '<span style="color: #10b981;">✓</span>' : ''}</h2>
                    <p>${currentShop.description}</p>
                    <div class="shop-meta">
                        <span>📍 ${currentShop.location}</span>
                        <span>⭐ ${currentShop.rating} rating</span>
                        <span>📞 Contact Shop</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Update shop stats
    document.getElementById('shopBikeCount').textContent = shopBikes.length;
    document.getElementById('shopRating').textContent = currentShop.rating;
    document.getElementById('shopReviews').textContent = Math.floor(Math.random() * 100) + 50;
    document.getElementById('shopYears').textContent = currentShop.yearsActive;
    
    // Display shop motorcycles
    if (shopMotorcycles) {
        shopMotorcycles.innerHTML = shopBikes.map(motor => createBikeCard(motor)).join('');
    }
    
    showSection('shopDetails');
}

// Booking Modal
function openBookingModal(motorId) {
    currentMotorcycle = motorcycles.find(m => m.id === motorId);
    if (!currentMotorcycle) return;
    
    const shop = shops.find(s => s.id === currentMotorcycle.shopId);
    const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
    const reviews = Math.floor(Math.random() * 50) + 10;
    
    // Update booking details
    const bookingDetails = document.getElementById('bookingDetails');
    if (bookingDetails) {
        bookingDetails.innerHTML = `
            <div style="display: flex; gap: 1rem; align-items: center;">
                <img src="${currentMotorcycle.image}" alt="${currentMotorcycle.name}" 
                     style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
                <div>
                    <h4 style="margin: 0 0 0.5rem 0;">${currentMotorcycle.name}</h4>
                    <p style="margin: 0; color: #6b7280;">by ${currentMotorcycle.shopName}</p>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin: 0.5rem 0;">
                        <span>⭐⭐⭐⭐⭐</span>
                        <span style="color: #6b7280; font-size: 0.875rem;">${rating} (${reviews} reviews)</span>
                    </div>
                    <div style="font-size: 1.25rem; font-weight: 600; color: #2563eb;">
                        ₱${currentMotorcycle.price.toLocaleString()}/day
                    </div>
                </div>
            </div>
            <div style="margin-top: 1rem; padding: 1rem; background: #f9fafb; border-radius: 8px;">
                <p style="margin: 0; color: #374151; line-height: 1.5;">${currentMotorcycle.description}</p>
            </div>
        `;
    }
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    if (startDateInput) startDateInput.min = today;
    if (endDateInput) endDateInput.min = today;
    
    bookingModal?.classList.remove('hidden');
    calculateRental();
}

// Close modals
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        modal?.classList.add('hidden');
    });
});

document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
});

// Rental calculation
function calculateRental() {
    const startDate = document.getElementById('startDate')?.value;
    const endDate = document.getElementById('endDate')?.value;
    const rentalDaysEl = document.getElementById('rentalDays');
    const totalCostEl = document.getElementById('totalCost');
    
    if (!startDate || !endDate || !currentMotorcycle) {
        if (rentalDaysEl) rentalDaysEl.textContent = '0 days';
        if (totalCostEl) totalCostEl.textContent = '₱0';
        return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    if (days > 0) {
        const total = days * currentMotorcycle.price;
        if (rentalDaysEl) rentalDaysEl.textContent = `${days} day${days !== 1 ? 's' : ''}`;
        if (totalCostEl) totalCostEl.textContent = `₱${total.toLocaleString()}`;
    } else {
        if (rentalDaysEl) rentalDaysEl.textContent = '0 days';
        if (totalCostEl) totalCostEl.textContent = '₱0';
    }
}

// Date change listeners
document.getElementById('startDate')?.addEventListener('change', calculateRental);
document.getElementById('endDate')?.addEventListener('change', calculateRental);

// Booking form submission
document.getElementById('bookingForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const bookingData = {
        id: Date.now(),
        motorId: currentMotorcycle.id,
        motorName: currentMotorcycle.name,
        shopName: currentMotorcycle.shopName,
        startDate: formData.get('startDate') || document.getElementById('startDate')?.value,
        endDate: formData.get('endDate') || document.getElementById('endDate')?.value,
        renterName: document.getElementById('renterName')?.value,
        renterEmail: document.getElementById('renterEmail')?.value,
        renterPhone: document.getElementById('renterPhone')?.value,
        specialRequests: document.getElementById('specialRequests')?.value,
        paymentMethod: document.querySelector('input[name="payment"]:checked')?.value,
        totalCost: document.getElementById('totalCost')?.textContent,
        status: 'confirmed',
        bookingDate: new Date().toISOString()
    };
    
    // Save booking
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push(bookingData);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Show success
    showSuccess('Booking Confirmed!', 'Your motorcycle rental has been booked successfully. The shop will contact you soon.');
    
    // Close modal and reset form
    bookingModal?.classList.add('hidden');
    document.getElementById('bookingForm')?.reset();
});

// Multi-step form for listing bikes
function nextStep(step) {
    if (validateCurrentStep()) {
        currentStep = step;
        updateStepDisplay();
    }
}

function prevStep(step) {
    currentStep = step;
    updateStepDisplay();
}

function updateStepDisplay() {
    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.toggle('active', index + 1 === currentStep);
    });
    
    // Update step content
    document.querySelectorAll('.form-step').forEach((step, index) => {
        step.classList.toggle('active', index + 1 === currentStep);
    });
}

function validateCurrentStep() {
    const currentStepEl = document.querySelector('.form-step.active');
    const requiredInputs = currentStepEl?.querySelectorAll('input[required], select[required], textarea[required]');
    
    let isValid = true;
    requiredInputs?.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            input.style.borderColor = '';
        }
    });
    
    return isValid;
}

// Form submissions
shopForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateCurrentStep()) {
        nextStep(2);
    }
});

document.getElementById('bikeForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateCurrentStep()) {
        nextStep(3);
    }
});

document.getElementById('pricingForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Create new bike listing
    const newBike = {
        id: Date.now(),
        name: document.getElementById('motorName')?.value,
        category: document.getElementById('motorCategory')?.value,
        price: parseInt(document.getElementById('motorPrice')?.value),
        weeklyPrice: parseInt(document.getElementById('weeklyPrice')?.value) || null,
        image: handleImageUpload('motorImage'),
        description: document.getElementById('motorDescription')?.value,
        shopId: userShop?.id || Date.now() - 1000,
        shopName: document.getElementById('shopName')?.value,
        available: true,
        featured: false
    };
    
    motorcycles.push(newBike);
    localStorage.setItem('motorcycles', JSON.stringify(motorcycles));
    
    showSuccess('Bike Listed Successfully!', 'Your motorcycle is now available for rent on our platform.');
    
    // Reset form and go back to step 1
    currentStep = 1;
    updateStepDisplay();
    document.querySelectorAll('form').forEach(form => form.reset());
    
    setTimeout(() => showSection('home'), 2000);
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function filterMotorcycles(options = {}) {
    let filtered = [...motorcycles];
    
    if (options.search) {
        const query = options.search.toLowerCase();
        filtered = filtered.filter(m => 
            m.name.toLowerCase().includes(query) ||
            m.description.toLowerCase().includes(query) ||
            m.shopName.toLowerCase().includes(query)
        );
    }
    
    if (options.category) {
        filtered = filtered.filter(m => m.category === options.category);
    }
    
    displayMotorcycles(filtered);
}

function filterByCategory(category) {
    filterMotorcycles({ category });
    
    // Update nav
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`)?.classList.add('active');
}

function resetFilters() {
    currentFilter = 'all';
    if (searchInput) searchInput.value = '';
    if (heroInput) heroInput.value = '';
    
    // Reset quick filters
    quickFilters.forEach(chip => chip.classList.remove('active'));
    document.querySelector('[data-filter="all"]')?.classList.add('active');
    
    displayMotorcycles();
}

function handleImageUpload(inputId) {
    const input = document.getElementById(inputId);
    const file = input?.files[0];
    if (file) {
        return URL.createObjectURL(file);
    }
    return 'https://via.placeholder.com/280x200?text=No+Image';
}

// Favorites system
function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
}

function toggleFavorite(bikeId) {
    const favorites = getFavorites();
    const index = favorites.indexOf(bikeId);
    
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(bikeId);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButtons();
}

function updateFavoriteButtons() {
    const favorites = getFavorites();
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const bikeId = parseInt(btn.dataset.bikeId);
        btn.textContent = favorites.includes(bikeId) ? '♥' : '♡';
        btn.style.color = favorites.includes(bikeId) ? '#ef4444' : '#6b7280';
    });
}

// Success modal
function showSuccess(title, message) {
    const successTitle = document.getElementById('successTitle');
    const successMessage = document.getElementById('successMessage');
    
    if (successTitle) successTitle.textContent = title;
    if (successMessage) successMessage.textContent = message;
    
    successModal?.classList.remove('hidden');
}

document.getElementById('successOk')?.addEventListener('click', () => {
    successModal?.classList.add('hidden');
});

// Initialize app
function initApp() {
    // Load saved data
    const savedMotorcycles = localStorage.getItem('motorcycles');
    if (savedMotorcycles) {
        motorcycles = JSON.parse(savedMotorcycles);
    }
    
    const savedShops = localStorage.getItem('shops');
    if (savedShops) {
        shops = JSON.parse(savedShops);
    }
    
    // Set default dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    if (startDateInput) startDateInput.min = today.toISOString().split('T')[0];
    if (endDateInput) endDateInput.min = tomorrow.toISOString().split('T')[0];
    
    // Display initial data
    showSection('home');
    updateFavoriteButtons();
    
    // Update step display
    updateStepDisplay();
}

// Start the app
document.addEventListener('DOMContentLoaded', initApp);

// Export for other modules
window.showSection = showSection;
window.openBookingModal = openBookingModal;
window.viewShop = viewShop;
window.toggleFavorite = toggleFavorite;
window.nextStep = nextStep;
window.prevStep = prevStep;