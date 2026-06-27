const router = require('express').Router();
const ctrl   = require('../controllers/bookController');
const auth   = require('../middleware/authMiddleware');
const role   = require('../middleware/roleMiddleware');

router.get('/',        auth,                        ctrl.getAll);
router.get('/:id',     auth,                        ctrl.getOne);
router.post('/',       auth, role('admin','librarian'), ctrl.create);
router.put('/:id',     auth, role('admin','librarian'), ctrl.update);
router.delete('/:id',  auth, role('admin'),             ctrl.remove);

module.exports = router;
