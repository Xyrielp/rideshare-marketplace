// Sample shops data
let shops = [
    {
        id: 1,
        name: "Speed Demons Rental",
        description: "Premium sport bikes and racing motorcycles for thrill seekers",
        location: "Manila, Philippines",
        logo: "🏁",
        motorcycles: 8,
        rating: 4.8
    },
    {
        id: 2,
        name: "Cruise & Ride",
        description: "Classic cruisers and touring bikes for comfortable journeys",
        location: "Cebu, Philippines",
        logo: "🛣️",
        motorcycles: 12,
        rating: 4.6
    },
    {
        id: 3,
        name: "City Scooters Hub",
        description: "Affordable scooters and commuter bikes for daily use",
        location: "Davao, Philippines",
        logo: "🛵",
        motorcycles: 15,
        rating: 4.7
    }
];

// Sample motorcycle data with shop association
let motorcycles = [
    {
        id: 1,
        name: "Yamaha R1",
        category: "sport",
        price: 6000,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        description: "High-performance sport bike perfect for track days",
        shopId: 1,
        shopName: "Speed Demons Rental"
    },
    {
        id: 2,
        name: "Harley Davidson Street 750",
        category: "cruiser",
        price: 4750,
        image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
        description: "Classic cruiser for comfortable long rides",
        shopId: 2,
        shopName: "Cruise & Ride"
    },
    {
        id: 3,
        name: "Honda Gold Wing",
        category: "touring",
        price: 7500,
        image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400",
        description: "Luxury touring bike with all amenities",
        shopId: 2,
        shopName: "Cruise & Ride"
    },
    {
        id: 4,
        name: "Vespa Primavera",
        category: "scooter",
        price: 2250,
        image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400",
        description: "Stylish scooter perfect for city commuting",
        shopId: 3,
        shopName: "City Scooters Hub"
    }
];

let currentMotorcycle = null;
let currentShop = null;
let userShop = null;

// DOM elements
const homeBtn = document.getElementById('homeBtn');
const shopsBtn = document.getElementById('shopsBtn');
const rentBtn = document.getElementById('rentBtn');
const homeSection = document.getElementById('homeSection');
const shopsSection = document.getElementById('shopsSection');
const shopDetailsSection = document.getElementById('shopDetailsSection');
const rentSection = document.getElementById('rentSection');
const motorList = document.getElementById('motorList');
const shopsList = document.getElementById('shopsList');
const shopHeader = document.getElementById('shopHeader');
const shopMotorcycles = document.getElementById('shopMotorcycles');
const backToShops = document.getElementById('backToShops');
const searchInput = document.getElementById('searchInput');
const sortFilter = document.getElementById('sortFilter');
const resultsCount = document.getElementById('resultsCount');
const rentForm = document.getElementById('rentForm');
const shopForm = document.getElementById('shopForm');
const addMotorSection = document.getElementById('addMotorSection');
const bookingModal = document.getElementById('bookingModal');
const bookingForm = document.getElementById('bookingForm');
const closeModal = document.querySelector('.close');
const navLinks = document.querySelectorAll('.nav-link');

// Navigation
homeBtn.addEventListener('click', () => {
    showSection('home');
    setActiveCategory('');
    setActiveNavLink(homeBtn);
});
shopsBtn.addEventListener('click', () => {
    showSection('shops');
    setActiveNavLink(shopsBtn);
});
rentBtn.addEventListener('click', () => showSection('rent'));
backToShops.addEventListener('click', () => {
    showSection('shops');
    setActiveNavLink(shopsBtn);
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (link.dataset.category !== undefined) {
            showSection('home');
            setActiveCategory(link.dataset.category);
            setActiveNavLink(link);
        }
    });
});

function showSection(section) {
    homeSection.classList.add('hidden');
    shopsSection.classList.add('hidden');
    shopDetailsSection.classList.add('hidden');
    rentSection.classList.add('hidden');
    
    switch(section) {
        case 'home':
            homeSection.classList.remove('hidden');
            break;
        case 'shops':
            shopsSection.classList.remove('hidden');
            displayShops();
            break;
        case 'shop-details':
            shopDetailsSection.classList.remove('hidden');
            break;
        case 'rent':
            rentSection.classList.remove('hidden');
            break;
    }
}

function setActiveNavLink(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

function setActiveCategory(category) {
    currentCategory = category;
    filterMotorcycles();
}

let currentCategory = '';

// Display motorcycles
function displayMotorcycles(motors = motorcycles) {
    resultsCount.textContent = `${motors.length} results found`;
    
    if (motors.length === 0) {
        motorList.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <h3>🔍 No motorcycles found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }
    
    motorList.innerHTML = motors.map(motor => `
        <div class="product-card" onclick="openBookingModal(${motor.id})">
            <div class="product-image">
                <img src="${motor.image}" alt="${motor.name}" onerror="this.src='https://via.placeholder.com/220x180?text=No+Image'">
                <div class="product-badge">${motor.category}</div>
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
                    <span>(${Math.floor(Math.random() * 50) + 10})</span>
                </div>
                <button class="book-btn" onclick="event.stopPropagation(); openBookingModal(${motor.id})">Book Now</button>
            </div>
        </div>
    `).join('');
}

// Search and filter
searchInput.addEventListener('input', filterMotorcycles);
sortFilter.addEventListener('change', filterMotorcycles);

function filterMotorcycles() {
    const searchTerm = searchInput.value.toLowerCase();
    const sortBy = sortFilter.value;
    
    let filtered = motorcycles.filter(motor => {
        const matchesSearch = motor.name.toLowerCase().includes(searchTerm) || 
                            motor.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !currentCategory || motor.category === currentCategory;
        return matchesSearch && matchesCategory;
    });
    
    // Sort results
    switch(sortBy) {
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            filtered.sort((a, b) => b.id - a.id);
            break;
    }
    
    displayMotorcycles(filtered);
}

// Shop creation
shopForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    userShop = {
        id: Date.now(),
        name: document.getElementById('shopName').value,
        description: document.getElementById('shopDescription').value,
        location: document.getElementById('shopLocation').value,
        logo: handleImageUpload('shopLogo') || '🏪',
        motorcycles: 0,
        rating: 5.0
    };
    
    shops.push(userShop);
    
    // Show success and reveal motorcycle form
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.innerHTML = '🎉 Shop created successfully! Now add your first motorcycle:';
    document.querySelector('.shop-setup').appendChild(successMsg);
    
    addMotorSection.classList.remove('hidden');
    shopForm.reset();
});

// Add new motorcycle
rentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!userShop) {
        alert('Please create a shop first!');
        return;
    }
    
    const newMotor = {
        id: Date.now(),
        name: document.getElementById('motorName').value,
        category: document.getElementById('motorCategory').value,
        price: parseInt(document.getElementById('motorPrice').value),
        image: handleImageUpload('motorImage'),
        description: document.getElementById('motorDescription').value,
        shopId: userShop.id,
        shopName: userShop.name
    };
    
    motorcycles.push(newMotor);
    userShop.motorcycles++;
    displayMotorcycles();
    rentForm.reset();
    
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.innerHTML = '✅ Motorcycle added to your shop! View in marketplace...';
    addMotorSection.insertBefore(successMsg, rentForm);
    
    setTimeout(() => {
        showSection('home');
        successMsg.remove();
        setActiveNavLink(homeBtn);
    }, 2000);
});

// Booking modal
function openBookingModal(motorId) {
    currentMotorcycle = motorcycles.find(m => m.id === motorId);
    document.getElementById('bookingDetails').innerHTML = `
        <h4>${currentMotorcycle.name}</h4>
        <p>Price: ₱${currentMotorcycle.price}/day</p>
    `;
    bookingModal.classList.remove('hidden');
}

closeModal.addEventListener('click', () => {
    bookingModal.classList.add('hidden');
});

bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
        bookingModal.classList.add('hidden');
    }
});

// Handle booking
bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const total = days * currentMotorcycle.price;
    
    if (days <= 0) {
        alert('Please select valid dates');
        return;
    }
    
    alert(`Booking confirmed!\nMotorcycle: ${currentMotorcycle.name}\nDays: ${days}\nTotal: ₱${total}`);
    bookingModal.classList.add('hidden');
    bookingForm.reset();
});

// Shop functions
function displayShops() {
    shopsList.innerHTML = shops.map(shop => `
        <div class="shop-card" onclick="viewShop(${shop.id})">
            <div class="shop-banner">
                <div class="shop-logo">${shop.logo}</div>
            </div>
            <div class="shop-info">
                <div class="shop-name">${shop.name}</div>
                <div class="shop-location">📍 ${shop.location}</div>
                <div class="shop-stats">
                    <span>${shop.motorcycles} motorcycles</span>
                    <span>⭐ ${shop.rating}</span>
                </div>
                <div class="shop-description">${shop.description}</div>
            </div>
        </div>
    `).join('');
}

function viewShop(shopId) {
    currentShop = shops.find(s => s.id === shopId);
    const shopMotors = motorcycles.filter(m => m.shopId === shopId);
    
    shopHeader.innerHTML = `
        <div class="shop-header-content">
            <div class="shop-header-logo">${currentShop.logo}</div>
            <div class="shop-header-info">
                <h2>${currentShop.name}</h2>
                <p>${currentShop.description}</p>
                <div class="shop-meta">
                    <span>📍 ${currentShop.location}</span>
                    <span>${currentShop.motorcycles} motorcycles</span>
                    <span>⭐ ${currentShop.rating} rating</span>
                </div>
            </div>
        </div>
    `;
    
    shopMotorcycles.innerHTML = shopMotors.map(motor => `
        <div class="product-card" onclick="openBookingModal(${motor.id})">
            <div class="product-image">
                <img src="${motor.image}" alt="${motor.name}" onerror="this.src='https://via.placeholder.com/220x180?text=No+Image'">
                <div class="product-badge">${motor.category}</div>
            </div>
            <div class="product-info">
                <div class="product-title">${motor.name}</div>
                <div class="product-price">
                    <span class="current-price">₱${motor.price}</span>
                    <span class="price-period">/day</span>
                </div>
                <div class="product-rating">
                    <span class="stars">⭐⭐⭐⭐⭐</span>
                    <span>(${Math.floor(Math.random() * 50) + 10})</span>
                </div>
                <button class="book-btn" onclick="event.stopPropagation(); openBookingModal(${motor.id})">Book Now</button>
            </div>
        </div>
    `).join('');
    
    showSection('shop-details');
}

// Image upload handling
function handleImageUpload(inputId) {
    const input = document.getElementById(inputId);
    const file = input.files[0];
    if (file) {
        return URL.createObjectURL(file);
    }
    return null;
}

function setupImagePreview(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    
    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                preview.classList.remove('empty');
            };
            reader.readAsDataURL(file);
        } else {
            preview.innerHTML = 'No image selected';
            preview.classList.add('empty');
        }
    });
    
    // Initialize empty state
    preview.innerHTML = 'No image selected';
    preview.classList.add('empty');
}

// Initialize
displayMotorcycles();

// Setup image previews when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupImagePreview('motorImage', 'motorImagePreview');
    setupImagePreview('shopLogo', 'shopLogoPreview');
});