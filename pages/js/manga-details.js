let currentManga = null;
let selectedRating = 0;

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initMobileMenu();
    loadMangaDetails();
});

function loadMangaDetails() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    currentManga = getMangaById(id);
    
    if (!currentManga) {
        window.location.href = 'browse.html';
        return;
    }
    
    const details = document.getElementById('mangaDetails');
    details.innerHTML = `
        <div style="display: grid; grid-template-columns: 300px 1fr; gap: 2rem; margin-bottom: 2rem;">
            <img src="${currentManga.cover}" style="width: 100%; border-radius: 16px; box-shadow: var(--shadow-lg);">
            <div>
                <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">${currentManga.title}</h1>
                <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                    ${currentManga.genres.map(g => `<span class="genre-tag" style="padding: 0.5rem 1rem;">${g}</span>`).join('')}
                </div>
                <div style="margin-bottom: 1.5rem; color: var(--text-secondary);">
                    <div><strong>Author:</strong> ${currentManga.author}</div>
                    <div><strong>Status:</strong> ${currentManga.status}</div>
                    <div><strong>Rating:</strong> ⭐ ${currentManga.rating}</div>
                </div>
                <p style="line-height: 1.8; margin-bottom: 2rem;">${currentManga.description}</p>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <button onclick="addToLibrary()" class="btn btn-primary">Add to Library</button>
                    <button onclick="openReviewModal()" class="btn btn-secondary">Write Review</button>
                    <button onclick="window.open('${currentManga.publisherUrl}', '_blank')" class="btn btn-secondary">Official Publisher</button>
                </div>
            </div>
        </div>
    `;
}

function addToLibrary() {
    const library = JSON.parse(localStorage.getItem('library') || '[]');
    if (!library.includes(currentManga.id)) {
        library.push(currentManga.id);
        localStorage.setItem('library', JSON.stringify(library));
        alert('Added to library!');
    } else {
        alert('Already in library!');
    }
}

function openReviewModal() {
    document.getElementById('reviewModal').classList.add('show');
    const stars = document.querySelectorAll('#starRating span');
    stars.forEach(star => {
        star.onclick = () => {
            selectedRating = parseInt(star.dataset.rating);
            stars.forEach((s, i) => {
                s.textContent = i < selectedRating ? '★' : '☆';
            });
        };
    });
}

function closeReviewModal() {
    document.getElementById('reviewModal').classList.remove('show');
}

document.getElementById('reviewForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const text = document.getElementById('reviewText').value;
    if (selectedRating > 0 && text) {
        const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        reviews.push({
            mangaId: currentManga.id,
            mangaTitle: currentManga.title,
            rating: selectedRating,
            text: text,
            date: new Date().toISOString().split('T')[0]
        });
        localStorage.setItem('reviews', JSON.stringify(reviews));
        alert('Review submitted!');
        closeReviewModal();
    }
});