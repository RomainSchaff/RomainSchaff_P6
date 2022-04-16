const express = require('express');
const router = express.Router();

const stuffControllers = require('../controllers/stuff');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/',auth, stuffControllers.getAllSauces);
router.post('/',auth, multer, stuffControllers.createSauce);
router.get('/:id',auth, stuffControllers.getOneSauce);
router.put('/:id',auth, multer, stuffControllers.modifySauce);
router.delete('/:id',auth, stuffControllers.deleteSauce);
router.post('/:id/like',auth, stuffControllers.addLike);

module.exports = router;