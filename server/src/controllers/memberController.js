const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { success, error } = require('../utils/apiResponse');

exports.getAll = async (req, res, next) => {
  try {
    const { q } = req.query;
    let sql = `SELECT id,name,email,role,college_id,department,phone,is_active,created_at
               FROM users WHERE role IN ('student','librarian')`;
    const params = [];
    if (q) { params.push(`%${q}%`); sql += ` AND (name ILIKE $1 OR email ILIKE $1 OR college_id ILIKE $1)`; }
    sql += ' ORDER BY name';
    const { rows } = await db.query(sql, params);
    success(res, rows);
  } catch (e) { next(e); }
};

exports.getOne = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT id,name,email,role,college_id,department,phone,is_active FROM users WHERE id=$1',
      [req.params.id]
    );
    if (!rows[0]) return error(res, 'Member not found', 404);
    // active loans
    const loans = await db.query(
      `SELECT l.*,b.title,b.author FROM loans l JOIN books b ON b.id=l.book_id
       WHERE l.user_id=$1 ORDER BY l.issued_at DESC LIMIT 20`,
      [req.params.id]
    );
    success(res, { ...rows[0], loans: loans.rows });
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const { name, email, college_id, department, phone, role: memberRole } = req.body;
    const defaultPass = await bcrypt.hash(college_id || 'library123', 10);
    const { rows } = await db.query(
      `INSERT INTO users (name,email,password,role,college_id,department,phone)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id,name,email,role,college_id,department`,
      [name, email, defaultPass, memberRole || 'student', college_id, department, phone]
    );
    success(res, rows[0], 'Member created. Default password is their College ID.', 201);
  } catch (e) {
    if (e.code === '23505') return error(res, 'Email already registered', 400);
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { name, department, phone, is_active } = req.body;
    const { rows } = await db.query(
      `UPDATE users SET name=$1,department=$2,phone=$3,is_active=$4 WHERE id=$5
       RETURNING id,name,email,department,phone,is_active`,
      [name, department, phone, is_active, req.params.id]
    );
    success(res, rows[0], 'Member updated');
  } catch (e) { next(e); }
};
