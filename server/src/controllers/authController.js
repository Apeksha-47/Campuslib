const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');
const { success, error } = require('../utils/apiResponse');

const signToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { rows } = await db.query('SELECT * FROM users WHERE email=$1 AND is_active=true', [email]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password)))
      return error(res, 'Invalid email or password', 401);
    const token = signToken(user);
    const { password: _, ...safe } = user;
    success(res, { token, user: safe });
  } catch (e) { next(e); }
};

exports.me = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT id,name,email,role,college_id,department,phone FROM users WHERE id=$1',
      [req.user.id]
    );
    success(res, rows[0]);
  } catch (e) { next(e); }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { current, newPass } = req.body;
    const { rows } = await db.query('SELECT password FROM users WHERE id=$1', [req.user.id]);
    if (!(await bcrypt.compare(current, rows[0].password)))
      return error(res, 'Current password is wrong', 400);
    const hashed = await bcrypt.hash(newPass, 10);
    await db.query('UPDATE users SET password=$1 WHERE id=$2', [hashed, req.user.id]);
    success(res, null, 'Password updated');
  } catch (e) { next(e); }
};
