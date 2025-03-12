const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const { getAllReleases, addRelease } = require('../controllers/releaseController');

router.post('/', authenticate, addRelease);
router.get('/review/:reviewId', getAllReleases);

module.exports = router;