// Login Page JavaScript - Frontend only (backend auth integration pending)
// Backend: Replace mock token logic with API call; on success redirect to library.html

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    // Check for existing valid token
    const accessToken = localStorage.getItem('accessToken');
    const tokenExpiry = localStorage.getItem('tokenExpiry');

    if (accessToken && tokenExpiry && Date.now() < parseInt(tokenExpiry)) {
        window.location.href = 'library.html';
        return;
    }

    // Rate limiting
    let loginAttempts = parseInt(localStorage.getItem('loginAttempts') || '0');
    let lockoutTime = parseInt(localStorage.getItem('lockoutTime') || '0');

    if (lockoutTime > Date.now()) {
        const remainingTime = Math.ceil((lockoutTime - Date.now()) / 1000 / 60);
        showError(`Account locked. Try again in ${remainingTime} minute(s).`);
        form.querySelector('button[type="submit"]').disabled = true;
        return;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        errorMessage.classList.remove('show');
        document.querySelectorAll('.form-error').forEach(error => error.classList.remove('show'));

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        let isValid = true;

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showFieldError('email', 'emailError');
            isValid = false;
        }

        if (!password) {
            showFieldError('password', 'passwordError');
            isValid = false;
        }

        if (!isValid) return;

        loginAttempts++;
        localStorage.setItem('loginAttempts', loginAttempts.toString());

        if (loginAttempts >= 5) {
            const lockoutDuration = 5 * 60 * 1000;
            const lockoutUntil = Date.now() + lockoutDuration;
            localStorage.setItem('lockoutTime', lockoutUntil.toString());
            showError('Too many failed attempts. Account locked for 5 minutes.');
            form.querySelector('button[type="submit"]').disabled = true;
            return;
        }

        // Simulate authentication (accept any valid format for demo)
        if (password.length >= 6) {
            localStorage.setItem('loginAttempts', '0');
            localStorage.removeItem('lockoutTime');

            const token = 'token_' + Math.random().toString(36).substr(2) + Date.now();
            const expiry = Date.now() + (remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000);

            localStorage.setItem('accessToken', token);
            localStorage.setItem('tokenExpiry', expiry.toString());
            localStorage.setItem('userEmail', email);

            // Redirect to library (backend auth will replace this mock flow)
            window.location.href = 'library.html';
        } else {
            const remaining = 5 - loginAttempts;
            showError(`Invalid credentials. ${remaining} attempt(s) remaining.`);
        }
    });

    function showError(message) {
        errorText.textContent = message;
        errorMessage.classList.add('show');
    }

    function showFieldError(inputId, errorId) {
        document.getElementById(inputId).style.borderColor = '#d63031';
        document.getElementById(errorId).classList.add('show');
    }
});
