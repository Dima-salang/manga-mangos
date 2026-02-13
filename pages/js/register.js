// Register Page JavaScript - Frontend only (backend auth integration pending)

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    function showError(message) {
        if (errorText) errorText.textContent = message;
        if (errorMessage) errorMessage.classList.add('show');
    }
    function hideError() {
        if (errorMessage) errorMessage.classList.remove('show');
    }

    // Redirect if already authenticated
    const accessToken = localStorage.getItem('accessToken');
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    if (accessToken && tokenExpiry && Date.now() < parseInt(tokenExpiry)) {
        window.location.href = 'library.html';
        return;
    }
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const strengthBar = document.getElementById('strengthBar');

    passwordInput.addEventListener('input', function() {
        checkPasswordStrength(this.value);
        validatePasswordRequirements(this.value);
    });

    confirmPasswordInput.addEventListener('input', function() {
        const password = passwordInput.value;
        const confirmPassword = this.value;
        const errorDiv = document.getElementById('confirmPasswordError');

        if (password !== confirmPassword) {
            this.style.borderColor = '#d63031';
            errorDiv.classList.add('show');
        } else {
            this.style.borderColor = '#00b894';
            errorDiv.classList.remove('show');
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        hideError();
        document.querySelectorAll('.form-error').forEach(error => error.classList.remove('show'));
        document.querySelectorAll('.form-input').forEach(input => input.style.borderColor = '#e0e0e0');

        let isValid = true;
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;

        if (!firstName) {
            showError('firstName', 'firstNameError');
            isValid = false;
        }

        if (!lastName) {
            showError('lastName', 'lastNameError');
            isValid = false;
        }

        if (username.length < 3) {
            showError('username', 'usernameError');
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('email', 'emailError');
            isValid = false;
        }

        if (!validatePassword(password)) {
            showError('password', 'passwordError');
            isValid = false;
        }

        if (password !== confirmPassword) {
            showError('confirmPassword', 'confirmPasswordError');
            isValid = false;
        }

        if (!terms) {
            alert('Please accept the Terms of Service');
            isValid = false;
        }

        if (isValid) {
            // Simulate successful registration & auto-login (backend will replace this)
            const token = 'token_' + Math.random().toString(36).substr(2) + Date.now();
            const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
            localStorage.setItem('accessToken', token);
            localStorage.setItem('tokenExpiry', expiry.toString());
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', `${firstName} ${lastName}`);
            localStorage.setItem('username', username);

            // Redirect to library page
            window.location.href = 'library.html';
        }
    });

    function checkPasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        strengthBar.classList.remove('weak', 'medium', 'strong');
        if (strength <= 2) {
            strengthBar.classList.add('weak');
        } else if (strength <= 4) {
            strengthBar.classList.add('medium');
        } else {
            strengthBar.classList.add('strong');
        }
    }

    function validatePasswordRequirements(password) {
        const requirements = {
            'req-length': password.length >= 8,
            'req-uppercase': /[A-Z]/.test(password),
            'req-lowercase': /[a-z]/.test(password),
            'req-number': /[0-9]/.test(password)
        };

        for (const [id, isValid] of Object.entries(requirements)) {
            const element = document.getElementById(id);
            if (isValid) {
                element.classList.add('valid');
            } else {
                element.classList.remove('valid');
            }
        }
    }

    function validatePassword(password) {
        return password.length >= 8 &&
               /[A-Z]/.test(password) &&
               /[a-z]/.test(password) &&
               /[0-9]/.test(password);
    }

    function showError(inputId, errorId) {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        input.style.borderColor = '#d63031';
        error.classList.add('show');
    }
});
