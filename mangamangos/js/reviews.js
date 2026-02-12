document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initMobileMenu();
    loadReviews();
});

function loadReviews() {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const list = document.getElementById('reviewsList');
    
    if (reviews.length === 0) {
        list.innerHTML = '<div class="card" style="text-align: center; padding: 4rem;"><h3>No reviews yet</h3><p>Start reviewing manga!</p></div>';
    } else {
        list.innerHTML = reviews.map((r, i) => `
            <div class="card">
                <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                    <h3>${r.mangaTitle}</h3>
                    <button onclick="deleteReview(${i})" style="background: none; border: none; color: var(--danger); cursor: pointer; font-size: 1.5rem;">🗑️</button>
                </div>
                <div style="color: var(--mango-primary); margin-bottom: 0.5rem;">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
                <p style="margin-bottom: 0.5rem;">${r.text}</p>
                <small style="color: var(--text-secondary);">${r.date}</small>
            </div>
        `).join('');
    }
}

function deleteReview(index) {
    if (confirm('Delete this review?')) {
        const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        reviews.splice(index, 1);
        localStorage.setItem('reviews', JSON.stringify(reviews));
        loadReviews();
    }
}