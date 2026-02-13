document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initMobileMenu();
    loadTrendingManga();
    loadRecommendedManga();

    document.getElementById('trendingSort').addEventListener('change', function() {
        loadTrendingManga(this.value);
    });
});

function loadTrendingManga(sortBy = 'popularity') {
    const grid = document.getElementById('trendingGrid');
    let sorted = [...MANGA_DATA];

    switch(sortBy) {
        case 'rating':
            sorted.sort((a, b) => b.rating - a.rating);
            break;
        case 'recent':
            sorted.sort((a, b) => b.id - a.id);
            break;
        default:
            sorted.sort((a, b) => b.views - a.views);
    }

    grid.innerHTML = sorted.slice(0, 6).map(manga => createMangaCard(manga)).join('');
}

function loadRecommendedManga() {
    const grid = document.getElementById('recommendedGrid');
    const recommended = MANGA_DATA.filter(m => 
        m.genres.some(g => ['Action', 'Adventure', 'Fantasy'].includes(g))
    );
    grid.innerHTML = recommended.slice(0, 6).map(manga => createMangaCard(manga)).join('');
}
