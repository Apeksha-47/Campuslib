-- ─────────────────────────────────────────
--  BIBLIOTHECA — Database Schema
-- ─────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('admin', 'librarian', 'student');
CREATE TYPE loan_status AS ENUM ('active', 'returned', 'overdue');

-- Users (admin + librarians + students all here)
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  role        user_role NOT NULL DEFAULT 'student',
  college_id  VARCHAR(30),          -- roll number / staff ID
  department  VARCHAR(100),
  phone       VARCHAR(15),
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Books
CREATE TABLE books (
  id           SERIAL PRIMARY KEY,
  isbn         VARCHAR(20) UNIQUE,
  title        VARCHAR(255) NOT NULL,
  author       VARCHAR(150) NOT NULL,
  publisher    VARCHAR(150),
  year         SMALLINT,
  genre        VARCHAR(80),
  dewey_class  VARCHAR(20),
  total_copies SMALLINT DEFAULT 1,
  avail_copies SMALLINT DEFAULT 1,
  created_at   TIMESTAMP DEFAULT NOW()
);

-- Loans (checkouts)
CREATE TABLE loans (
  id          SERIAL PRIMARY KEY,
  book_id     INT REFERENCES books(id),
  user_id     INT REFERENCES users(id),
  issued_at   TIMESTAMP DEFAULT NOW(),
  due_date    DATE NOT NULL,
  returned_at TIMESTAMP,
  status      loan_status DEFAULT 'active',
  renewed     BOOLEAN DEFAULT FALSE
);

-- Fines
CREATE TABLE fines (
  id         SERIAL PRIMARY KEY,
  loan_id    INT REFERENCES loans(id),
  user_id    INT REFERENCES users(id),
  amount     NUMERIC(8,2) NOT NULL,
  paid       BOOLEAN DEFAULT FALSE,
  paid_at    TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reservations / Holds
CREATE TABLE reservations (
  id         SERIAL PRIMARY KEY,
  book_id    INT REFERENCES books(id),
  user_id    INT REFERENCES users(id),
  reserved_at TIMESTAMP DEFAULT NOW(),
  is_active  BOOLEAN DEFAULT TRUE
);

-- Indexes for common queries
CREATE INDEX idx_loans_user   ON loans(user_id);
CREATE INDEX idx_loans_book   ON loans(book_id);
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_fines_user   ON fines(user_id);
