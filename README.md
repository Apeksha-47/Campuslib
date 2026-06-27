# Campuslib — College Library Management System

Full-stack web app · React + Tailwind · Node.js + Express · PostgreSQL

---

## Roles & Access

| Role       | What they can do |
|------------|-----------------|
| Admin      | Manage books, members, view all reports |
| Librarian  | Checkout/return books, manage fines, view catalog |
| Student    | Search books, view own loans & fines |

---

## Quick Start (5 steps)

### 1. Install dependencies
```bash
cd server && npm install
cd ../client && npm install
```

### 2. Create PostgreSQL database
```bash
createdb library_db
psql library_db < server/schema.sql
```

### 3. Configure environment
```bash
# Server
cp server/.env.example server/.env
# Edit server/.env — fill in DATABASE_URL, JWT_SECRET, SMTP details

# Client
cp client/.env.example client/.env
# VITE_API_URL=http://localhost:5000/api (default)
```

### 4. Seed sample data
```bash
cd server && node seed.js
```

### 5. Run the app
```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Open **http://localhost:3000**

---

## Login Credentials (after seeding)

| Role       | Email                      | Password   |
|------------|----------------------------|------------|
| Admin      | admin@library.edu          | admin123   |
| Librarian  | librarian@library.edu      | lib123     |
| Student    | arjun@student.edu          | CS2021001  |

> New members get their College ID as the default password.

---

## Business Rules
- Loan period: **14 days**
- Grace period: **2 days** (no fine during grace)
- Fine rate: **₹2 / day** after grace period
- Max active loans per member: **3**
- Unpaid fines **block** new checkouts
- Loans can be renewed **once** (adds 14 more days)
- Daily cron at 8 AM: marks overdue, sends email reminders

---

## Project Structure

```
library-management/
├── client/                     ← React + Tailwind frontend
│   └── src/
│       ├── components/
│       │   ├── layout/         Sidebar, Layout wrapper
│       │   └── common/         Badge, Modal, Loader, StatCard
│       ├── pages/
│       │   ├── admin/          Dashboard, ManageBooks, ManageMembers, Reports
│       │   ├── librarian/      Dashboard, Catalog, Circulation, Members, Fines
│       │   └── student/        Dashboard, SearchBooks, MyLoans, MyFines
│       ├── context/            AuthContext (JWT auth)
│       └── services/           API call functions per feature
│
└── server/                     ← Node.js + Express backend
    ├── schema.sql              PostgreSQL schema (run this first)
    ├── seed.js                 Sample data seeder
    └── src/
        ├── app.js              Express app setup
        ├── server.js           Entry point + cron start
        ├── controllers/        auth, books, members, circulation, fines, reports
        ├── routes/             REST API routes
        ├── middleware/         JWT auth, role guard, error handler
        ├── services/           emailService, overdueService (cron)
        ├── utils/              dateHelper (fines/due dates), apiResponse
        └── config/             db.js, env.js
```

---

## API Reference

| Method | Endpoint                    | Role             | Description |
|--------|-----------------------------|------------------|-------------|
| POST   | /api/auth/login             | All              | Login |
| GET    | /api/auth/me                | All              | Current user |
| GET    | /api/books                  | All              | List/search books |
| POST   | /api/books                  | Admin/Librarian  | Add book |
| PUT    | /api/books/:id              | Admin/Librarian  | Update book |
| DELETE | /api/books/:id              | Admin            | Delete book |
| GET    | /api/members                | Admin/Librarian  | List members |
| POST   | /api/members                | Admin/Librarian  | Add member |
| POST   | /api/circulation/checkout   | Admin/Librarian  | Check out book |
| POST   | /api/circulation/return     | Admin/Librarian  | Return book |
| POST   | /api/circulation/renew      | Admin/Librarian  | Renew loan |
| GET    | /api/circulation/active     | Admin/Librarian  | Active loans |
| GET    | /api/circulation/overdue    | Admin/Librarian  | Overdue list |
| GET    | /api/circulation/my-loans   | Student          | Student's own loans |
| GET    | /api/fines                  | Admin/Librarian  | All fines |
| GET    | /api/fines/my-fines         | Student          | Student's fines |
| PUT    | /api/fines/:id/pay          | Admin/Librarian  | Mark fine paid |
| PUT    | /api/fines/:id/waive        | Admin            | Waive fine |
| GET    | /api/reports/dashboard      | Admin/Librarian  | Stats summary |
| GET    | /api/reports/popular        | Admin/Librarian  | Popular books |
| GET    | /api/reports/circulation    | Admin/Librarian  | Monthly chart data |
