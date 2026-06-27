const db = require('../config/db');
const { success, error } = require('../utils/apiResponse');

exports.getAll = async (req, res, next) => {
  try {
    const { q, genre, available } = req.query;
    let sql = 'SELECT * FROM books WHERE 1=1';
    const params = [];
    if (q) {
      params.push(`%${q}%`);
      sql += ` AND (title ILIKE $${params.length} OR author ILIKE $${params.length} OR isbn ILIKE $${params.length})`;
    }
    if (genre) { params.push(genre); sql += ` AND genre=$${params.length}`; }
    if (available === 'true') sql += ' AND avail_copies > 0';
    sql += ' ORDER BY title';
    const { rows } = await db.query(sql, params);
    success(res, rows);
  } catch (e) { next(e); }
};

exports.getOne = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM books WHERE id=$1', [req.params.id]);
    if (!rows[0]) return error(res, 'Book not found', 404);
    success(res, rows[0]);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const { isbn, title, author, publisher, year, genre, dewey_class, total_copies } = req.body;
    const copies = total_copies || 1;
    const { rows } = await db.query(
      `INSERT INTO books (isbn,title,author,publisher,year,genre,dewey_class,total_copies,avail_copies)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$8) RETURNING *`,
      [isbn, title, author, publisher, year, genre, dewey_class, copies]
    );
    success(res, rows[0], 'Book added', 201);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const { title, author, publisher, year, genre, dewey_class } = req.body;
    const { rows } = await db.query(
      `UPDATE books SET title=$1,author=$2,publisher=$3,year=$4,genre=$5,dewey_class=$6
       WHERE id=$7 RETURNING *`,
      [title, author, publisher, year, genre, dewey_class, req.params.id]
    );
    if (!rows[0]) return error(res, 'Book not found', 404);
    success(res, rows[0], 'Book updated');
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM loans WHERE book_id=$1 AND status=\'active\'', [req.params.id]);
    if (rows.length) return error(res, 'Cannot delete — book has active loans', 400);
    await db.query('DELETE FROM books WHERE id=$1', [req.params.id]);
    success(res, null, 'Book deleted');
  } catch (e) { next(e); }
};
