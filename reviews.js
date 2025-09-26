// Reviews System
class ReviewsSystem {
    constructor() {
        this.reviews = JSON.parse(localStorage.getItem('reviews')) || [];
        this.bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Review form submission
        document.getElementById('reviewForm').addEventListener('submit', (e) => this.handleReviewSubmission(e));
        
        // Star rating interaction
        document.querySelectorAll('.star').forEach(star => {
            star.addEventListener('click', (e) => this.setRating(e.target.dataset.rating));
            star.addEventListener('mouseover', (e) => this.highlightStars(e.target.dataset.rating));
        });

        document.querySelector('.stars-input').addEventListener('mouseleave', () => this.resetStarHighlight());
    }

    canUserReview(motorId) {
        if (!authSystem.isLoggedIn()) return false;
        
        const userId = authSystem.getCurrentUser().id;
        const userBookings = this.bookings.filter(booking => 
            booking.userId === userId && 
            booking.motorId === motorId && 
            booking.status === 'completed'
        );
        
        const userReviews = this.reviews.filter(review => 
            review.userId === userId && 
            review.motorId === motorId
        );

        return userBookings.length > 0 && userReviews.length === 0;
    }

    showReviewModal(motorId) {
        if (!authSystem.isLoggedIn()) {
            authSystem.showNotification('Please login to leave a review', 'error');
            authSystem.showLoginModal();
            return;
        }

        if (!this.canUserReview(motorId)) {
            authSystem.showNotification('You can only review motorcycles you have rented', 'error');
            return;
        }

        const motor = motorcycles.find(m => m.id === motorId);
        document.getElementById('reviewDetails').innerHTML = `
            <div class="review-motor-info">
                <img src="${motor.image}" alt="${motor.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px;">
                <div>
                    <h4>${motor.name}</h4>
                    <p>by ${motor.shopName}</p>
                </div>
            </div>
        `;

        document.getElementById('reviewModal').classList.remove('hidden');
        this.currentReviewMotorId = motorId;
        this.resetReviewForm();
    }

    handleReviewSubmission(e) {
        e.preventDefault();
        
        const rating = this.getCurrentRating();
        const reviewText = document.getElementById('reviewText').value;
        
        if (!rating) {
            authSystem.showNotification('Please select a rating', 'error');
            return;
        }

        const review = {
            id: Date.now(),
            motorId: this.currentReviewMotorId,
            userId: authSystem.getCurrentUser().id,
            userName: authSystem.getCurrentUser().name,
            rating: parseInt(rating),
            text: reviewText,
            date: new Date().toISOString(),
            helpful: 0
        };

        this.reviews.push(review);
        localStorage.setItem('reviews', JSON.stringify(this.reviews));
        
        document.getElementById('reviewModal').classList.add('hidden');
        authSystem.showNotification('Review submitted successfully!', 'success');
        
        // Update motorcycle display if needed
        this.updateMotorcycleRatings();
    }

    setRating(rating) {
        this.currentRating = rating;
        this.updateStarDisplay(rating);
    }

    getCurrentRating() {
        return this.currentRating || 0;
    }

    highlightStars(rating) {
        document.querySelectorAll('.star').forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    resetStarHighlight() {
        this.updateStarDisplay(this.getCurrentRating());
    }

    updateStarDisplay(rating) {
        document.querySelectorAll('.star').forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    resetReviewForm() {
        this.currentRating = 0;
        document.getElementById('reviewText').value = '';
        this.updateStarDisplay(0);
    }

    getMotorcycleReviews(motorId) {
        return this.reviews.filter(review => review.motorId === motorId);
    }

    getAverageRating(motorId) {
        const motorReviews = this.getMotorcycleReviews(motorId);
        if (motorReviews.length === 0) return 4.5; // Default rating
        
        const totalRating = motorReviews.reduce((sum, review) => sum + review.rating, 0);
        return (totalRating / motorReviews.length).toFixed(1);
    }

    getReviewCount(motorId) {
        return this.getMotorcycleReviews(motorId).length;
    }

    updateMotorcycleRatings() {
        // Update all displayed motorcycles with new ratings
        document.querySelectorAll('.product-rating').forEach(ratingElement => {
            const productCard = ratingElement.closest('.product-card');
            const motorId = this.extractMotorIdFromCard(productCard);
            
            if (motorId) {
                const avgRating = this.getAverageRating(motorId);
                const reviewCount = this.getReviewCount(motorId);
                const stars = '⭐'.repeat(Math.round(avgRating));
                
                ratingElement.innerHTML = `
                    <span class="stars">${stars}</span>
                    <span class="rating-count">(${reviewCount || Math.floor(Math.random() * 50) + 10})</span>
                `;
            }
        });
    }

    extractMotorIdFromCard(card) {
        const bookBtn = card.querySelector('.book-btn');
        if (bookBtn) {
            const onclick = bookBtn.getAttribute('onclick');
            const match = onclick.match(/openBookingModal\((\d+)\)/);
            return match ? parseInt(match[1]) : null;
        }
        return null;
    }

    displayReviews(motorId) {
        const reviews = this.getMotorcycleReviews(motorId);
        
        if (reviews.length === 0) {
            return '<p class="no-reviews">No reviews yet. Be the first to review!</p>';
        }

        return reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <div class="reviewer-info">
                        <strong>${review.userName}</strong>
                        <div class="review-rating">${'⭐'.repeat(review.rating)}</div>
                    </div>
                    <div class="review-date">${new Date(review.date).toLocaleDateString()}</div>
                </div>
                <div class="review-text">${review.text}</div>
                <div class="review-actions">
                    <button onclick="reviewsSystem.markHelpful(${review.id})" class="helpful-btn">
                        👍 Helpful (${review.helpful})
                    </button>
                </div>
            </div>
        `).join('');
    }

    markHelpful(reviewId) {
        const review = this.reviews.find(r => r.id === reviewId);
        if (review) {
            review.helpful = (review.helpful || 0) + 1;
            localStorage.setItem('reviews', JSON.stringify(this.reviews));
            authSystem.showNotification('Thanks for your feedback!', 'success');
        }
    }

    addReviewButton(motorId) {
        if (this.canUserReview(motorId)) {
            return `<button onclick="reviewsSystem.showReviewModal(${motorId})" class="review-btn">Write Review</button>`;
        }
        return '';
    }
}

// Add review styles
const reviewStyle = document.createElement('style');
reviewStyle.textContent = `
    .review-motor-info {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 20px;
        padding: 12px;
        background: #f8f9fa;
        border-radius: 8px;
    }
    
    .review-motor-info h4 {
        margin: 0;
        color: #333;
    }
    
    .review-motor-info p {
        margin: 0;
        color: #666;
        font-size: 14px;
    }
    
    .review-item {
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 12px;
        background: white;
    }
    
    .review-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
    }
    
    .reviewer-info strong {
        color: #333;
        margin-right: 8px;
    }
    
    .review-rating {
        font-size: 14px;
    }
    
    .review-date {
        color: #666;
        font-size: 12px;
    }
    
    .review-text {
        color: #333;
        line-height: 1.5;
        margin-bottom: 12px;
    }
    
    .review-actions {
        display: flex;
        gap: 8px;
    }
    
    .helpful-btn, .review-btn {
        background: #f8f9fa;
        border: 1px solid #ddd;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s;
    }
    
    .helpful-btn:hover, .review-btn:hover {
        background: #e9ecef;
    }
    
    .review-btn {
        background: #ee4d2d;
        color: white;
        border-color: #ee4d2d;
    }
    
    .review-btn:hover {
        background: #d63384;
    }
    
    .no-reviews {
        text-align: center;
        color: #666;
        font-style: italic;
        padding: 20px;
    }
`;
document.head.appendChild(reviewStyle);

// Initialize reviews system
const reviewsSystem = new ReviewsSystem();