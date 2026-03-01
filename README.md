# CampusConnect 🎓

**Academic Campus Event & Registration Portal**

A full-stack web application for managing campus events with role-based access control.

- **Admin** — Create events, delete events, view all registrations
- **Faculty** — Create events, view registrations for their own events
- **Student** — Browse events, register for events

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JS (ES6) |
| Backend | Node.js, Express.js (ES Modules) |
| Database | MySQL (XAMPP) |
| Auth | JWT + bcrypt |

---

## Project Structure

```
campusPortal/
├── database/
│   └── schema.sql            # MySQL table definitions
├── backend/
│   ├── server.js             # Express entry point
│   ├── config/db.js          # MySQL pool
│   ├── middleware/            # JWT auth + role checks
│   ├── models/               # Data access layer
│   ├── controllers/          # Business logic
│   ├── routes/               # API route definitions
│   ├── .env                  # Environment variables
│   └── .env.example          # Template
└── frontend/
    ├── index.html            # Landing page
    ├── login.html            # Login
    ├── register.html         # Registration
    ├── dashboard.html        # Role-based dashboard
    ├── css/style.css         # Design system
    └── js/
        ├── auth.js           # Login/register logic
        └── dashboard.js      # Dashboard logic
```

---

## Setup Instructions

### Prerequisites
- **Node.js** v18+
- **XAMPP** with MySQL running

### 1. Create the Database
Open phpMyAdmin (http://localhost/phpmyadmin) or MySQL CLI and run:
```sql
SOURCE D:/campusPortal/database/schema.sql;
```
Or copy-paste the contents of `database/schema.sql` into the SQL tab.

### 2. Configure Environment
Edit `backend/.env` with your MySQL credentials (defaults work with XAMPP):
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=campusconnect
JWT_SECRET=your_secret_key
PORT=3000
```

### 3. Install Dependencies
```bash
cd backend
npm install
```

### 4. Start the Server
```bash
npm run dev
```

### 5. Open the App
Visit **http://localhost:3000** in your browser.

---

## API Endpoints

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| POST | `/api/auth/register` | ✗ | All |
| POST | `/api/auth/login` | ✗ | All |
| GET | `/api/events` | ✗ | All |
| POST | `/api/events` | ✓ | Admin, Faculty |
| DELETE | `/api/events/:id` | ✓ | Admin |
| POST | `/api/register-event` | ✓ | Student |
| GET | `/api/registrations` | ✓ | Admin, Faculty |

---

## License

MIT © 2026 CampusConnect
