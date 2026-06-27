const db = require('../config/db');
const { success, error } = require('../utils/apiResponse');

exports.getAll = async (req, res, next) => {
  try {
    const { rows } = await db.query(`
      SELECT f.*, u.name, u.college_id, u.email, b.title
      FROM fines f
      JOIN users u ON u.id = f.user_id
      JOIN loans l ON l.id = f.loan_id
      JOIN books b ON b.id = l.book_id
      ORDER BY f.created_at DESC
    `);
    success(res, rows);
  } catch (e) { next(e); }
};

exports.myFines = async (req, res, next) => {
  try {
    const { rows } = await db.query(`
      SELECT f.*, b.title FROM fines f
      JOIN loans l ON l.id=f.loan_id
      JOIN books b ON b.id=l.book_id
      WHERE f.user_id=$1 ORDER BY f.created_at DESC
    `, [req.user.id]);
    success(res, rows);
  } catch (e) { next(e); }
};

exports.markPaid = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'UPDATE fines SET paid=true,paid_at=NOW() WHERE id=$1 RETURNING *',
      [req.params.id]
    );
    if (!rows[0]) return error(res, 'Fine not found', 404);
    success(res, rows[0], 'Fine marked as paid');
  } catch (e) { next(e); }
};

exports.waive = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'UPDATE fines SET paid=true,paid_at=NOW() WHERE id=$1 RETURNING *',
      [req.params.id]
    );
    if (!rows[0]) return error(res, 'Fine not found', 404);
    success(res, rows[0], 'Fine waived');
  } catch (e) { next(e); }
};
