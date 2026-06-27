const db = require('../config/db');
const { success } = require('../utils/apiResponse');

exports.dashboard = async (req, res, next) => {
  try {
    const [books, members, activeLoans, overdueLoans, unpaidFines] = await Promise.all([
      db.query('SELECT COUNT(*) FROM books'),
      db.query('SELECT COUNT(*) FROM users WHERE role=\'student\' AND is_active=true'),
      db.query('SELECT COUNT(*) FROM loans WHERE status=\'active\''),
      db.query('SELECT COUNT(*) FROM loans WHERE status=\'active\' AND due_date < CURRENT_DATE'),
      db.query('SELECT COALESCE(SUM(amount),0) AS total FROM fines WHERE paid=false'),
    ]);
    success(res, {
      total_books:    parseInt(books.rows[0].count),
      total_members:  parseInt(members.rows[0].count),
      active_loans:   parseInt(activeLoans.rows[0].count),
      overdue_loans:  parseInt(overdueLoans.rows[0].count),
      unpaid_fines:   parseFloat(unpaidFines.rows[0].total),
    });
  } catch (e) { next(e); }
};

exports.popularBooks = async (req, res, next) => {
  try {
    const { rows } = await db.query(`
      SELECT b.id, b.title, b.author, COUNT(l.id) AS borrow_count
      FROM books b LEFT JOIN loans l ON l.book_id=b.id
      GROUP BY b.id ORDER BY borrow_count DESC LIMIT 10
    `);
    success(res, rows);
  } catch (e) { next(e); }
};

exports.monthlyCirculation = async (req, res, next) => {
  try {
    const { rows } = await db.query(`
      SELECT TO_CHAR(issued_at,'Mon YYYY') AS month,
             COUNT(*) AS checkouts,
             COUNT(CASE WHEN status='returned' THEN 1 END) AS returns
      FROM loans
      WHERE issued_at >= NOW() - INTERVAL '6 months'
      GROUP BY month, DATE_TRUNC('month',issued_at)
      ORDER BY DATE_TRUNC('month',issued_at)
    `);
    success(res, rows);
  } catch (e) { next(e); }
};
