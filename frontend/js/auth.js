// ============================================================
// auth.js — Login & Register logic for CampusConnect
// ============================================================

const API_BASE = window.location.origin;

// ── Utility: Show alert messages ──
function showAlert(type, message) {
    const alertEl = document.getElementById(type === 'error' ? 'alertError' : 'alertSuccess');
    const hideEl = document.getElementById(type === 'error' ? 'alertSuccess' : 'alertError');

    if (hideEl) { hideEl.classList.remove('show'); hideEl.textContent = ''; }

    if (alertEl) {
        alertEl.textContent = message;
        alertEl.classList.add('show');
    }
}

function clearAlerts() {
    ['alertError', 'alertSuccess'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.classList.remove('show'); el.textContent = ''; }
    });
}

// ── Login Form Handler ──
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearAlerts();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const btn = document.getElementById('loginBtn');

        if (!email || !password) {
            return showAlert('error', 'Please fill in all fields.');
        }

        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Logging in...';

        try {
            const res = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed.');
            }

            // Store JWT and user info
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            showAlert('success', 'Login successful! Redirecting...');
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
        } catch (err) {
            showAlert('error', err.message);
            btn.disabled = false;
            btn.textContent = 'Login';
        }
    });
}

// ── Register Form Handler ──
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearAlerts();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        const btn = document.getElementById('registerBtn');

        if (!name || !email || !password) {
            return showAlert('error', 'Please fill in all fields.');
        }
        if (password.length < 6) {
            return showAlert('error', 'Password must be at least 6 characters.');
        }

        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Creating account...';

        try {
            const res = await fetch(`${API_BASE}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Registration failed.');
            }

            showAlert('success', 'Account created! Redirecting to login...');
            setTimeout(() => { window.location.href = 'login.html'; }, 1200);
        } catch (err) {
            showAlert('error', err.message);
            btn.disabled = false;
            btn.textContent = 'Create Account';
        }
    });
}
