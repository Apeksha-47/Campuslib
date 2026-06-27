const db = require('../config/db');
const { success, error } = require('../utils/apiResponse');
const { getDueDate, calculateFine } = require('../utils/dateHelper');

exports.checkout = async (req, res, next) => {
  try {
    const { book_id, user_id } = req.body;

    // Check availability
    const book = await db.query('SELECT * FROM books WHERE id=$1', [book_id]);
    if (!book.rows[0]) return error(res, 'Book not found', 404);
    if (book.rows[0].avail_copies < 1) return error(res, 'No copies available', 400);

    // Check member has no more than 3 active loans
    const active = await db.query(
      'SELECT COUNT(*) FROM loans WHERE user_id=$1 AND status=\'active\'', [user_id]
    );
    if (parseInt(active.rows[0].count) >= 3)
      return error(res, 'Member already has 3 active loans', 400);

    // Check unpaid fines
    const fines = await db.query(
      'SELECT COALESCE(SUM(amount),0) as total FROM fines WHERE user_id=$1 AND paid=false', [user_id]
    );
    if (parseFloat(fines.rows[0].total) > 0)
      return error(res, `Member has unpaid fines of ₹${fines.rows[0].total}`, 400);

    const due = getDueDate();
    const loan = await db.query(
      `INSERT INTO loans (book_id,user_id,due_date) VALUES ($1,$2,$3) RETURNING *`,
      [book_id, user_id, due]
    );
    await db.query('UPDATE books SET avail_copies=avail_copies-1 WHERE id=$1', [book_id]);

    success(res, loan.rows[0], 'Book checked out successfully', 201);
  } catch (e) { next(e); }
};

exports.returnBook = async (req, res, next) => {
  try {
    const { loan_id } = req.body;
    const loanRes = await db.query('SELECT * FROM loans WHERE id=$1', [loan_id]);
    const loan = loanRes.rows[0];
    if (!loan) return error(res, 'Loan not found', 404);
    if (loan.status === 'returned') return error(res, 'Already returned', 400);

    // Calculate fine
    const fine = calculateFine(loan.due_date);
    await db.query(
      `UPDATE loans SET status='returned', returned_at=NOW() WHERE id=$1`, [loan_id]
    );
    await db.query('UPDATE books SET avail_copies=avail_copies+1 WHERE id=$1', [loan.book_id]);

    let fineRecord = null;
    if (fine > 0) {
      const f = await db.query(
        'INSERT INTO fines (loan_id,user_id,amount) VALUES ($1,$2,$3) RETURNING *',
        [loan_id, loan.user_id, fine]
      );
      fineRecord = f.rows[0];
    }

    success(res, { loan_id, fine_amount: fine, fine: fineRecord },
      fine > 0 ? `Returned. Fine of ₹${fine} added.` : 'Returned successfully.');
  } catch (e) { next(e); }
};

exports.renew = async (req, res, next) => {
  try {
    const { loan_id } = req.body;
    const { rows } = await db.query('SELECT * FROM loans WHERE id=$1', [loan_id]);
    const loan = rows[0];
    if (!loan) return error(res, 'Loan not found', 404);
    if (loan.renewed) return error(res, 'Already renewed once — cannot renew again', 400);
    if (loan.status !== 'active') return error(res, 'Loan is not active', 400);

    const newDue = getDueDate();
    await db.query(
      'UPDATE loans SET due_date=$1, renewed=true WHERE id=$2', [newDue, loan_id]
    );
    success(res, { loan_id, new_due_date: newDue }, 'Loan renewed for 14 more days');
  } catch (e) { next(e); }
};

exports.getActiveLoans = async (req, res, next) => {
  try {
    const { rows } = await db.query(`
      SELECT l.id, l.issued_at, l.due_date, l.status, l.renewed,
             b.title, b.author, b.isbn,
             u.name AS member_name, u.college_id, u.email
      FROM loans l
      JOIN books b ON b.id = l.book_id
      JOIN users u ON u.id = l.user_id
      WHERE l.status = 'active'
      ORDER BY l.due_date ASC
    `);
    success(res, rows);
  } catch (e) { next(e); }
};

exports.getOverdue = async (req, res, next) => {
  try {
    const { rows } = await db.query(`
      SELECT l.id, l.due_date, l.issued_at,
             b.title, b.author,
             u.name AS member_name, u.college_id, u.email, u.phone,
             (CURRENT_DATE - l.due_date) AS days_overdue
      FROM loans l
      JOIN books b ON b.id = l.book_id
      JOIN users u ON u.id = l.user_id
      WHERE l.status = 'active' AND l.due_date < CURRENT_DATE
      ORDER BY l.due_date ASC
    `);
    success(res, rows);
  } catch (e) { next(e); }
};

exports.myLoans = async (req, res, next) => {
  try {
    const { rows } = await db.query(`
      SELECT l.id, l.issued_at, l.due_date, l.returned_at, l.status, l.renewed,
             b.title, b.author, b.isbn, b.genre
      FROM loans l JOIN books b ON b.id = l.book_id
      WHERE l.user_id=$1 ORDER BY l.issued_at DESC
    `, [req.user.id]);
    success(res, rows);
  } catch (e) { next(e); }
};
