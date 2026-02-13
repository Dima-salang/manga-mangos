const user = {
    username: 'MangaFan2024',
    email: localStorage.getItem('userEmail') || 'user@mangamangos.com',
    bio: 'Passionate manga reader who loves shonen and fantasy series',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix'
};

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initMobileMenu();
    displayProfile();
    
    document.getElementById('editProfileBtn').addEventListener('click', openEditModal);
    document.getElementById('editForm').addEventListener('submit', function(e) {
        e.preventDefault();
        user.username = document.getElementById('editUsername').value;
        user.bio = document.getElementById('editBio').value;
        displayProfile();
        closeEditModal();
        alert('Profile updated!');
    });
});

function displayProfile() {
    document.getElementById('profileInfo').innerHTML = `
        <h2 style="margin-bottom: 0.5rem;">${user.username}</h2>
        <p style="color: var(--text-secondary); margin-bottom: 1rem;">${user.email}</p>
        <p style="line-height: 1.8;">${user.bio}</p>
    `;
}

function openEditModal() {
    document.getElementById('editUsername').value = user.username;
    document.getElementById('editBio').value = user.bio;
    document.getElementById('editModal').classList.add('show');
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('show');
}