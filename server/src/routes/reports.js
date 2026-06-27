const router = require('express').Router();
const ctrl   = require('../controllers/reportController');
const auth   = require('../middleware/authMiddleware');
const role   = require('../middleware/roleMiddleware');

router.get('/dashboard',   auth, role('admin','librarian'), ctrl.dashboard);
router.get('/popular',     auth, role('admin','librarian'), ctrl.popularBooks);
router.get('/circulation', auth, role('admin','librarian'), ctrl.monthlyCirculation);

module.exports = router;
