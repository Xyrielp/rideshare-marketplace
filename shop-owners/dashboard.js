// Sample data for shop owner dashboard
let shopOwnerData = {
    shop: {
        id: 1,
        name: "My Motor Shop",
        description: "Premium motorcycle rentals",
        location: "Manila, Philippines",
        logo: "🏪",
        rating: 5.0
    },
    motorcycles: [
        {
            id: 1,
            name: "Yamaha R1",
            category: "sport",
            price: 6000,
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
            description: "High-performance sport bike",
            status: "available"
        }
    ],
    bookings: [
        {
            id: "BK001",
            motorcycleName: "Yamaha R1",
            customerName: "John Doe",
            customerEmail: "john@example.com",
            startDate: "2024-01-15",
            endDate: "2024-01-17",
            totalAmount: 12000,
            status: "confirmed"
        }
    ],
    stats: {
        totalMotorcycles: 1,
        totalBookings: 1,
        totalEarnings: 12000,
        rating: 5.0
    }
};

// DOM elements
const menuItems = document.querySelectorAll('.menu-item');
const sections = document.querySelectorAll('.dashboard-section');
const addMotorcycleBtn = document.getElementById('addMotorcycleBtn');
const addMotorcycleModal = document.getElementById('addMotorcycleModal');
const addMotorcycleForm = document.getElementById('addMotorcycleForm');
const shopSettingsForm = document.getElementById('shopSettingsForm');
const closeModal = document.querySelector('.close');

// Navigation
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        const section = item.dataset.section;
        showSection(section);
        setActiveMenuItem(item);
    });
});

function showSection(sectionName) {
    sections.forEach(section => section.classList.add('hidden'));
    document.getElementById(sectionName).classList.remove('hidden');
    
    // Load section-specific data
    switch(sectionName) {
        case 'overview':
            loadOverview();
            break;
        case 'motorcycles':
            loadMotorcycles();
            break;
        case 'bookings':
            loadBookings();
            break;
        case 'shop-settings':
            loadShopSettings();
            break;
    }
}

function setActiveMenuItem(activeItem) {
    menuItems.forEach(item => item.classList.remove('active'));
    activeItem.classList.add('active');
}

// Load overview data
function loadOverview() {
    document.getElementById('totalMotorcycles').textContent = shopOwnerData.stats.totalMotorcycles;
    document.getElementById('totalBookings').textContent = shopOwnerData.stats.totalBookings;
    document.getElementById('totalEarnings').textContent = `₱${shopOwnerData.stats.totalEarnings.toLocaleString()}`;
    document.getElementById('shopRating').textContent = shopOwnerData.stats.rating;
    
    // Load recent activity
    const activityList = document.getElementById('activityList');
    const activities = [
        { icon: '🎉', text: 'Welcome to your shop dashboard!', time: 'Just now' },
        { icon: '🏍️', text: 'Yamaha R1 added to inventory', time: '2 hours ago' },
        { icon: '📅', text: 'New booking received', time: '1 day ago' }
    ];
    
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <span class="activity-icon">${activity.icon}</span>
            <span class="activity-text">${activity.text}</span>
            <span class="activity-time">${activity.time}</span>
        </div>
    `).join('');
}

// Load motorcycles
function loadMotorcycles() {
    const motorcyclesList = document.getElementById('motorcyclesList');
    
    if (shopOwnerData.motorcycles.length === 0) {
        motorcyclesList.innerHTML = `
            <div class="empty-state">
                <h3>No motorcycles yet</h3>
                <p>Add your first motorcycle to start earning</p>
            </div>
        `;
        return;
    }
    
    motorcyclesList.innerHTML = shopOwnerData.motorcycles.map(motorcycle => `
        <div class="motorcycle-card">
            <img src="${motorcycle.image}" alt="${motorcycle.name}" onerror="this.src='https://via.placeholder.com/300x180?text=No+Image'">
            <div class="motorcycle-card-info">
                <h4>${motorcycle.name}</h4>
                <div class="motorcycle-card-meta">
                    <span class="motorcycle-category">${motorcycle.category}</span>
                    <span class="motorcycle-card-price">₱${motorcycle.price}/day</span>
                </div>
                <p>${motorcycle.description}</p>
                <div class="motorcycle-card-actions">
                    <button class="edit-btn" onclick="editMotorcycle(${motorcycle.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteMotorcycle(${motorcycle.id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Load bookings
function loadBookings() {
    const bookingsList = document.getElementById('bookingsList');
    
    if (shopOwnerData.bookings.length === 0) {
        bookingsList.innerHTML = `
            <div class="empty-state">
                <h3>No bookings yet</h3>
                <p>Bookings will appear here when customers rent your motorcycles</p>
            </div>
        `;
        return;
    }
    
    bookingsList.innerHTML = shopOwnerData.bookings.map(booking => `
        <div class="booking-card">
            <div class="booking-header">
                <span class="booking-id">Booking #${booking.id}</span>
                <span class="booking-status ${booking.status}">${booking.status}</span>
            </div>
            <div class="booking-details">
                <div><strong>Motorcycle:</strong> ${booking.motorcycleName}</div>
                <div><strong>Customer:</strong> ${booking.customerName}</div>
                <div><strong>Email:</strong> ${booking.customerEmail}</div>
                <div><strong>Dates:</strong> ${booking.startDate} to ${booking.endDate}</div>
                <div><strong>Total:</strong> ₱${booking.totalAmount.toLocaleString()}</div>
            </div>
        </div>
    `).join('');
}

// Load shop settings
function loadShopSettings() {
    document.getElementById('settingsShopName').value = shopOwnerData.shop.name;
    document.getElementById('settingsShopDescription').value = shopOwnerData.shop.description;
    document.getElementById('settingsShopLocation').value = shopOwnerData.shop.location;
    // Note: File inputs cannot be pre-filled for security reasons
}

// Modal handling
addMotorcycleBtn.addEventListener('click', () => {
    addMotorcycleModal.classList.remove('hidden');
});

closeModal.addEventListener('click', () => {
    addMotorcycleModal.classList.add('hidden');
});

addMotorcycleModal.addEventListener('click', (e) => {
    if (e.target === addMotorcycleModal) {
        addMotorcycleModal.classList.add('hidden');
    }
});

// Add motorcycle
addMotorcycleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newMotorcycle = {
        id: Date.now(),
        name: document.getElementById('newMotorName').value,
        category: document.getElementById('newMotorCategory').value,
        price: parseInt(document.getElementById('newMotorPrice').value),
        image: handleImageUpload('newMotorImage'),
        description: document.getElementById('newMotorDescription').value,
        status: 'available'
    };
    
    shopOwnerData.motorcycles.push(newMotorcycle);
    shopOwnerData.stats.totalMotorcycles++;
    
    addMotorcycleForm.reset();
    addMotorcycleModal.classList.add('hidden');
    loadMotorcycles();
    
    alert('Motorcycle added successfully!');
});

// Shop settings
shopSettingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    shopOwnerData.shop.name = document.getElementById('settingsShopName').value;
    shopOwnerData.shop.description = document.getElementById('settingsShopDescription').value;
    shopOwnerData.shop.location = document.getElementById('settingsShopLocation').value;
    shopOwnerData.shop.logo = handleImageUpload('settingsShopLogo') || '🏪';
    
    alert('Shop settings updated successfully!');
});

// Motorcycle actions
function editMotorcycle(id) {
    const motorcycle = shopOwnerData.motorcycles.find(m => m.id === id);
    if (motorcycle) {
        // Pre-fill form with motorcycle data
        document.getElementById('newMotorName').value = motorcycle.name;
        document.getElementById('newMotorCategory').value = motorcycle.category;
        document.getElementById('newMotorPrice').value = motorcycle.price;
        // Note: File inputs cannot be pre-filled for security reasons
        document.getElementById('newMotorDescription').value = motorcycle.description;
        
        // Remove the motorcycle and show modal for editing
        deleteMotorcycle(id);
        addMotorcycleModal.classList.remove('hidden');
    }
}

function deleteMotorcycle(id) {
    if (confirm('Are you sure you want to delete this motorcycle?')) {
        shopOwnerData.motorcycles = shopOwnerData.motorcycles.filter(m => m.id !== id);
        shopOwnerData.stats.totalMotorcycles--;
        loadMotorcycles();
    }
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

// Initialize dashboard
loadOverview();

// Setup image previews
setupImagePreview('newMotorImage', 'newImagePreview');
setupImagePreview('settingsShopLogo', 'logoPreview');