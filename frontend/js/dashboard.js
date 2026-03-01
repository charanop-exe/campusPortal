// ============================================================
// dashboard.js — Dashboard logic for CampusConnect
// Role-aware rendering: events, creation, registrations
// ============================================================

const API_BASE = window.location.origin;

// ── Auth guard — redirect to login if no token ──
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || 'null');

if (!token || !user) {
    window.location.href = 'login.html';
}

// ── Logout ──
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// ── Utility: Show alert ──
function showAlert(type, message) {
    const alertEl = document.getElementById(type === 'error' ? 'alertError' : 'alertSuccess');
    const hideEl = document.getElementById(type === 'error' ? 'alertSuccess' : 'alertError');
    if (hideEl) { hideEl.classList.remove('show'); hideEl.textContent = ''; }
    if (alertEl) {
        alertEl.textContent = message;
        alertEl.classList.add('show');
        setTimeout(() => { alertEl.classList.remove('show'); }, 5000);
    }
}

// ── Utility: Format date ──
function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

// ── Utility: Auth headers ──
function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
}

// ── Utility: Escape HTML to prevent XSS ──
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ── Initialize Dashboard ──
function initDashboard() {
    document.getElementById('userName').textContent = user.name;
    const badge = document.getElementById('roleBadge');
    badge.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    badge.classList.add(user.role);

    // Show create-event form for admin/faculty
    if (user.role === 'admin' || user.role === 'faculty') {
        document.getElementById('createEventSection').style.display = 'block';
    }

    // Show "My Registrations" section only for students
    if (user.role === 'student') {
        document.getElementById('myRegistrationsSection').style.display = 'block';
        setupRegistrationsTable();
        loadMyRegistrations();
    }

    loadEvents();
}

// ============================================================
// Events
// ============================================================

async function loadEvents() {
    const grid = document.getElementById('eventsGrid');

    try {
        const res = await fetch(`${API_BASE}/api/events`);
        const events = await res.json();

        if (!res.ok) throw new Error('Failed to load events');

        if (events.length === 0) {
            grid.innerHTML = `
                <div class="no-events">
                    <div class="icon">📭</div>
                    <p>No events yet. Check back later!</p>
                </div>`;
            return;
        }

        grid.innerHTML = events.map(event => createEventCard(event)).join('');
    } catch (err) {
        grid.innerHTML = `
            <div class="no-events">
                <div class="icon">⚠️</div>
                <p>Could not load events. Please try again.</p>
            </div>`;
    }
}

function createEventCard(event) {
    const isPast = new Date(event.date) < new Date();
    let actions = '';

    // Student: Register button
    if (user.role === 'student') {
        actions = `
            <button class="btn btn-primary btn-sm" onclick="registerForEvent(${event.id})" ${isPast ? 'disabled' : ''}>
                ${isPast ? 'Event Ended' : '🎟️ Register'}
            </button>`;
    }

    // Admin/Faculty: View Registrants button — opens in new window
    if (user.role === 'admin' || user.role === 'faculty') {
        const count = event.registration_count || 0;
        actions += `
            <button class="btn btn-secondary btn-sm" onclick="viewRegistrants(${event.id})">
                👥 Registrants (${count})
            </button>`;
    }

    // Admin: Delete button
    if (user.role === 'admin') {
        actions += `
            <button class="btn btn-danger btn-sm" onclick="deleteEvent(${event.id})">
                🗑️ Delete
            </button>`;
    }

    return `
        <div class="event-card" id="event-card-${event.id}">
            <h3>${escapeHtml(event.title)}</h3>
            <p class="event-desc">${escapeHtml(event.description || 'No description provided.')}</p>
            <div class="event-meta">
                <span><span class="icon">📅</span> ${formatDate(event.date)}</span>
                <span><span class="icon">📍</span> ${escapeHtml(event.venue)}</span>
                <span><span class="icon">👤</span> By ${escapeHtml(event.creator_name)}</span>
            </div>
            <div class="event-actions">
                ${actions}
            </div>
        </div>`;
}

// ── Open Registrants in New Window (Admin/Faculty) ──
function viewRegistrants(eventId) {
    window.open(`registrants.html?id=${eventId}`, '_blank');
}

// ── Create Event ──
const createEventForm = document.getElementById('createEventForm');
if (createEventForm) {
    createEventForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('eventTitle').value.trim();
        const description = document.getElementById('eventDesc').value.trim();
        const date = document.getElementById('eventDate').value;
        const venue = document.getElementById('eventVenue').value.trim();

        if (!title || !date || !venue) {
            return showAlert('error', 'Title, date, and venue are required.');
        }

        try {
            const res = await fetch(`${API_BASE}/api/events`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({ title, description, date, venue }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            showAlert('success', 'Event created successfully!');
            createEventForm.reset();
            loadEvents();
        } catch (err) {
            showAlert('error', err.message);
        }
    });
}

// ── Register for Event (Student) ──
async function registerForEvent(eventId) {
    try {
        const res = await fetch(`${API_BASE}/api/register-event`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ event_id: eventId }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        showAlert('success', data.message);
        loadEvents();
        loadMyRegistrations();
    } catch (err) {
        showAlert('error', err.message);
    }
}

// ── Delete Event (Admin) ──
async function deleteEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
        const res = await fetch(`${API_BASE}/api/events/${eventId}`, {
            method: 'DELETE',
            headers: authHeaders(),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        showAlert('success', 'Event deleted.');
        loadEvents();
    } catch (err) {
        showAlert('error', err.message);
    }
}

// ============================================================
// My Registrations (Student only)
// ============================================================

function setupRegistrationsTable() {
    const thead = document.querySelector('#myRegistrationsTable thead tr');
    thead.innerHTML = `
        <th>#</th>
        <th>Event</th>
        <th>Date</th>
        <th>Venue</th>
        <th>Organized By</th>
        <th>Registered At</th>`;
}

async function loadMyRegistrations() {
    const tbody = document.getElementById('myRegistrationsBody');
    const noReg = document.getElementById('noMyRegistrations');

    try {
        const res = await fetch(`${API_BASE}/api/registrations`, {
            headers: authHeaders(),
        });
        const regs = await res.json();

        if (!res.ok) throw new Error('Failed to load registrations');

        if (regs.length === 0) {
            tbody.innerHTML = '';
            noReg.style.display = 'block';
            noReg.textContent = "You haven't registered for any events yet.";
            return;
        }

        noReg.style.display = 'none';
        tbody.innerHTML = regs.map((r, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${escapeHtml(r.event_title)}</td>
                <td>${formatDate(r.event_date)}</td>
                <td>${escapeHtml(r.event_venue)}</td>
                <td>${escapeHtml(r.creator_name)}</td>
                <td>${formatDate(r.registered_at)}</td>
            </tr>
        `).join('');
    } catch (err) {
        tbody.innerHTML = '';
        noReg.textContent = 'Failed to load registrations.';
        noReg.style.display = 'block';
    }
}

// ── Boot ──
initDashboard();
