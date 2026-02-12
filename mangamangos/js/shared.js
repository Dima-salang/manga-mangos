// Shared Data and Utilities for MangaMangos

// Mock Manga Data
const MANGA_DATA = [
    {
        id: 1,
        title: "One Piece",
        cover: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop",
        rating: 4.8,
        genres: ["Adventure", "Fantasy"],
        description: "Epic pirate adventure following Monkey D. Luffy and his crew as they search for the legendary treasure One Piece to become the Pirate King.",
        status: "Ongoing",
        author: "Eiichiro Oda",
        publisher: "Shueisha",
        publisherUrl: "https://www.shonenjump.com/j/index.html",
        views: 15000,
        chapters: 1090
    },
    {
        id: 2,
        title: "Attack on Titan",
        cover: "https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400&h=600&fit=crop",
        rating: 4.9,
        genres: ["Action", "Drama"],
        description: "Humanity's desperate fight for survival against the mysterious Titans that have brought civilization to the brink of extinction.",
        status: "Completed",
        author: "Hajime Isayama",
        publisher: "Kodansha",
        publisherUrl: "https://kodansha.us/",
        views: 20000,
        chapters: 139
    },
    {
        id: 3,
        title: "Demon Slayer",
        cover: "https://images.unsplash.com/photo-1609743522471-83c84ce23e32?w=400&h=600&fit=crop",
        rating: 4.7,
        genres: ["Action", "Supernatural"],
        description: "A demon slayer's quest for vengeance and redemption after his family is slaughtered by demons and his sister is turned into one.",
        status: "Completed",
        author: "Koyoharu Gotouge",
        publisher: "Shueisha",
        publisherUrl: "https://www.shonenjump.com/j/index.html",
        views: 18000,
        chapters: 205
    },
    {
        id: 4,
        title: "My Hero Academia",
        cover: "https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?w=400&h=600&fit=crop",
        rating: 4.6,
        genres: ["Action", "School"],
        description: "Superhero academy adventures in a world where most people have superpowers called Quirks. Follow Izuku Midoriya's journey.",
        status: "Ongoing",
        author: "Kohei Horikoshi",
        publisher: "Shueisha",
        publisherUrl: "https://www.shonenjump.com/j/index.html",
        views: 12000,
        chapters: 405
    },
    {
        id: 5,
        title: "Jujutsu Kaisen",
        cover: "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=400&h=600&fit=crop",
        rating: 4.8,
        genres: ["Action", "Supernatural"],
        description: "Cursed energy battles and sorcery school adventures in modern-day Japan where curses threaten humanity.",
        status: "Ongoing",
        author: "Gege Akutami",
        publisher: "Shueisha",
        publisherUrl: "https://www.shonenjump.com/j/index.html",
        views: 16000,
        chapters: 245
    },
    {
        id: 6,
        title: "Chainsaw Man",
        cover: "https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=400&h=600&fit=crop",
        rating: 4.7,
        genres: ["Action", "Horror"],
        description: "Devil hunting chaos in a dark world where devils are born from human fears. Follow Denji's brutal journey.",
        status: "Ongoing",
        author: "Tatsuki Fujimoto",
        publisher: "Shueisha",
        publisherUrl: "https://www.shonenjump.com/j/index.html",
        views: 14000,
        chapters: 150
    },
    {
        id: 7,
        title: "Tokyo Ghoul",
        cover: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=600&fit=crop",
        rating: 4.5,
        genres: ["Horror", "Drama"],
        description: "A college student's tragic transformation into a half-ghoul and his struggle to maintain his humanity.",
        status: "Completed",
        author: "Sui Ishida",
        publisher: "Shueisha",
        publisherUrl: "https://www.shonenjump.com/j/index.html",
        views: 11000,
        chapters: 143
    },
    {
        id: 8,
        title: "Naruto",
        cover: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop",
        rating: 4.8,
        genres: ["Adventure", "Action"],
        description: "Ninja warrior's journey to become Hokage and gain recognition from his village. A tale of friendship and perseverance.",
        status: "Completed",
        author: "Masashi Kishimoto",
        publisher: "Shueisha",
        publisherUrl: "https://www.shonenjump.com/j/index.html",
        views: 22000,
        chapters: 700
    }
];

// Mock User Data
const MOCK_USER = {
    email: "user@mangamangos.com",
    username: "MangaFan2024",
    bio: "Passionate manga reader and reviewer who loves shonen and fantasy series",
    interests: ["Shonen", "Fantasy", "Adventure"],
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix"
};

// Utility Functions
function checkAuth() {
    const token = localStorage.getItem('accessToken');
    const expiry = localStorage.getItem('tokenExpiry');
    
    if (!token || !expiry || Date.now() >= parseInt(expiry)) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('tokenExpiry');
        localStorage.removeItem('userEmail');
        window.location.href = 'login.html';
    }
}

function getMangaById(id) {
    return MANGA_DATA.find(manga => manga.id === parseInt(id));
}

function initMobileMenu() {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const navbarMenu = document.getElementById('navbarMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
            menuOverlay.classList.toggle('active');
        });
    }
    
    if (menuOverlay) {
        menuOverlay.addEventListener('click', function() {
            navbarMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
        });
    }
}

function createMangaCard(manga) {
    return `
        <div class="manga-card" onclick="viewMangaDetails(${manga.id})">
            <img src="${manga.cover}" alt="${manga.title}" class="manga-card-image" loading="lazy">
            <div class="manga-card-content">
                <h3 class="manga-card-title">${manga.title}</h3>
                <div class="manga-card-genres">
                    ${manga.genres.map(genre => `<span class="genre-tag">${genre}</span>`).join('')}
                </div>
                <div class="manga-rating">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span>${manga.rating}</span>
                </div>
            </div>
        </div>
    `;
}

function viewMangaDetails(mangaId) {
    window.location.href = `manga-details.html?id=${mangaId}`;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MANGA_DATA,
        MOCK_USER,
        checkAuth,
        logout,
        getMangaById,
        initMobileMenu,
        createMangaCard,
        viewMangaDetails
    };
}
