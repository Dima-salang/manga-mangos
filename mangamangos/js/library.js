document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initMobileMenu();
    loadLibrary();
});

function loadLibrary() {
    const library = JSON.parse(localStorage.getItem('library') || '[]');
    const grid = document.getElementById('libraryGrid');
    const empty = document.getElementById('emptyLibrary');
    
    if (library.length === 0) {
        grid.style.display = 'none';
        empty.style.display = 'block';
    } else {
        grid.style.display = 'grid';
        empty.style.display = 'none';
        const items = library.map(id => MANGA_DATA.find(m => m.id === id)).filter(Boolean);
        grid.innerHTML = items.map(m => `
            <div style="position: relative;">
                ${createMangaCard(m)}
                <button onclick="removeFromLibrary(${m.id})" style="position: absolute; top: 10px; right: 10px; background: var(--danger); color: white; border: none; width: 36px; height: 36px; border-radius: 50%; cursor: pointer;">🗑️</button>
            </div>
        `).join('');
    }
}

function removeFromLibrary(id) {
    if (confirm('Remove from library?')) {
        let library = JSON.parse(localStorage.getItem('library') || '[]');
        library = library.filter(i => i !== id);
        localStorage.setItem('library', JSON.stringify(library));
        loadLibrary();
    }
}