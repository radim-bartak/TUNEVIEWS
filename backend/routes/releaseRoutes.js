const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const { getAllReleases, addRelease, getRelease } = require('../controllers/releaseController');
const { searchReleases } = require('../utils/apiHelpers');

router.post('/', authenticate, addRelease);
router.get('/review/:reviewId', getAllReleases);
router.get('/:releaseId', getRelease);
router.get('/search', searchReleases)


module.exports = router;