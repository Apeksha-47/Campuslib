// Usage: router.get('/path', auth, role('admin','librarian'), controller)
module.exports = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ message: 'Access denied' });
  next();
};
