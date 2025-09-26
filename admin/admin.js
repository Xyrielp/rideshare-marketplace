// Sample admin data
let adminData = {
    shops: [
        { id: 1, name: "Speed Demons Rental", owner: "John Doe", status: "active", motorcycles: 8, revenue: 45000 },
        { id: 2, name: "Cruise & Ride", owner: "Jane Smith", status: "active", motorcycles: 12, revenue: 62000 },
        { id: 3, name: "City Scooters Hub", owner: "Mike Johnson", status: "pending", motorcycles: 15, revenue: 18000 }
    ],
    motorcycles: [
        { id: 1, name: "Yamaha R1", shop: "Speed Demons", category: "sport", price: 6000, status: "available" },
        { id: 2, name: "Harley Davidson", shop: "Cruise & Ride", category: "cruiser", price: 4750, status: "rented" },
        { id: 3, name: "Honda Gold Wing", shop: "Cruise & Ride", category: "touring", price: 7500, status: "available" }
    ],
    bookings: [
        { id: "BK001", motorcycle: "Yamaha R1", customer: "Alice Brown", shop: "Speed Demons", status: "confirmed", amount: 12000 },
        { id: "BK002", motorcycle: "Vespa Primavera", customer: "Bob Wilson", shop: "City Scooters", status: "pending", amount: 4500 }
    ],
    users: [
        { id: 1, name: "Alice Brown", email: "alice@example.com", type: "customer", joinDate: "2024-01-15" },
        { id: 2, name: "John Doe", email: "john@example.com", type: "shop-owner", joinDate: "2024-01-10" }
    ]
};

// DOM elements
const menuItems = document.querySelectorAll('.menu-item');
const sections = document.querySelectorAll('.dashboard-section');

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
    
    switch(sectionName) {
        case 'shops':
            loadShops();
            break;
        case 'motorcycles':
            loadMotorcycles();
            break;
        case 'bookings':
            loadBookings();
            break;
        case 'users':
            loadUsers();
            break;
    }
}

function setActiveMenuItem(activeItem) {
    menuItems.forEach(item => item.classList.remove('active'));
    activeItem.classList.add('active');
}

// Load shops
function loadShops() {
    const shopsList = document.getElementById('shopsList');
    shopsList.innerHTML = `
        <div class="table-header">Shops Management</div>
        ${adminData.shops.map(shop => `
            <div class="table-row">
                <div class="row-info">
                    <div class="row-title">${shop.name}</div>
                    <div class="row-meta">Owner: ${shop.owner} • ${shop.motorcycles} motorcycles • ₱${shop.revenue.toLocaleString()} revenue</div>
                </div>
                <div class="row-actions">
                    <span class="status-badge status-${shop.status}">${shop.status}</span>
                    ${shop.status === 'pending' ? '<button class="action-btn approve-btn" onclick="approveShop(' + shop.id + ')">Approve</button>' : ''}
                    <button class="action-btn suspend-btn" onclick="suspendShop(${shop.id})">Suspend</button>
                    <button class="action-btn view-btn" onclick="viewShop(${shop.id})">View</button>
                </div>
            </div>
        `).join('')}
    `;
}

// Load motorcycles
function loadMotorcycles() {
    const motorcyclesList = document.getElementById('motorcyclesList');
    motorcyclesList.innerHTML = `
        <div class="table-header">All Motorcycles</div>
        ${adminData.motorcycles.map(motorcycle => `
            <div class="table-row">
                <div class="row-info">
                    <div class="row-title">${motorcycle.name}</div>
                    <div class="row-meta">${motorcycle.shop} • ${motorcycle.category} • ₱${motorcycle.price}/day</div>
                </div>
                <div class="row-actions">
                    <span class="status-badge status-${motorcycle.status === 'available' ? 'active' : 'pending'}">${motorcycle.status}</span>
                    <button class="action-btn view-btn" onclick="viewMotorcycle(${motorcycle.id})">View</button>
                </div>
            </div>
        `).join('')}
    `;
}

// Load bookings
function loadBookings() {
    const bookingsList = document.getElementById('bookingsList');
    bookingsList.innerHTML = `
        <div class="table-header">All Bookings</div>
        ${adminData.bookings.map(booking => `
            <div class="table-row">
                <div class="row-info">
                    <div class="row-title">Booking #${booking.id}</div>
                    <div class="row-meta">${booking.customer} • ${booking.motorcycle} • ${booking.shop} • ₱${booking.amount.toLocaleString()}</div>
                </div>
                <div class="row-actions">
                    <span class="status-badge status-${booking.status === 'confirmed' ? 'active' : 'pending'}">${booking.status}</span>
                    <button class="action-btn view-btn" onclick="viewBooking('${booking.id}')">View</button>
                </div>
            </div>
        `).join('')}
    `;
}

// Load users
function loadUsers() {
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = `
        <div class="table-header">User Management</div>
        ${adminData.users.map(user => `
            <div class="table-row">
                <div class="row-info">
                    <div class="row-title">${user.name}</div>
                    <div class="row-meta">${user.email} • ${user.type} • Joined: ${user.joinDate}</div>
                </div>
                <div class="row-actions">
                    <button class="action-btn view-btn" onclick="viewUser(${user.id})">View</button>
                </div>
            </div>
        `).join('')}
    `;
}

// Action functions
function approveShop(shopId) {
    const shop = adminData.shops.find(s => s.id === shopId);
    if (shop) {
        shop.status = 'active';
        loadShops();
        alert(`Shop "${shop.name}" has been approved!`);
    }
}

function suspendShop(shopId) {
    const shop = adminData.shops.find(s => s.id === shopId);
    if (shop && confirm(`Are you sure you want to suspend "${shop.name}"?`)) {
        shop.status = 'suspended';
        loadShops();
        alert(`Shop "${shop.name}" has been suspended.`);
    }
}

function viewShop(shopId) {
    const shop = adminData.shops.find(s => s.id === shopId);
    if (shop) {
        alert(`Viewing shop: ${shop.name}\nOwner: ${shop.owner}\nStatus: ${shop.status}`);
    }
}

function viewMotorcycle(motorcycleId) {
    const motorcycle = adminData.motorcycles.find(m => m.id === motorcycleId);
    if (motorcycle) {
        alert(`Viewing motorcycle: ${motorcycle.name}\nShop: ${motorcycle.shop}\nPrice: ₱${motorcycle.price}/day`);
    }
}

function viewBooking(bookingId) {
    const booking = adminData.bookings.find(b => b.id === bookingId);
    if (booking) {
        alert(`Viewing booking: ${booking.id}\nCustomer: ${booking.customer}\nAmount: ₱${booking.amount}`);
    }
}

function viewUser(userId) {
    const user = adminData.users.find(u => u.id === userId);
    if (user) {
        alert(`Viewing user: ${user.name}\nEmail: ${user.email}\nType: ${user.type}`);
    }
}

// Settings form
document.getElementById('systemSettingsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('System settings saved successfully!');
});

// Initialize
loadShops();