const router = require('express').Router();
const ctrl   = require('../controllers/fineController');
const auth   = require('../middleware/authMiddleware');
const role   = require('../middleware/roleMiddleware');

router.get('/',           auth, role('admin','librarian'), ctrl.getAll);
router.get('/my-fines',   auth,                            ctrl.myFines);
router.put('/:id/pay',    auth, role('admin','librarian'), ctrl.markPaid);
router.put('/:id/waive',  auth, role('admin'),             ctrl.waive);

module.exports = router;
