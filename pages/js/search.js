let searchTimeout;
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initMobileMenu();
    displayResults(MANGA_DATA);
    document.getElementById('searchInput').addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => performSearch(), 300);
    });
});

function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    let results = MANGA_DATA.filter(m => 
        m.title.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query)
    );
    displayResults(results);
}

function displayResults(results) {
    const grid = document.getElementById('searchResults');
    const count = document.getElementById('resultsCount');
    count.innerHTML = `Found <strong style="color: var(--mango-primary);">${results.length}</strong> manga`;
    grid.innerHTML = results.map(m => createMangaCard(m)).join('');
}