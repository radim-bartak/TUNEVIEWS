const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const { getAllReleases, addRelease, getRelease, searchReleasesController, autoSaveRelease } = require('../controllers/releaseController');

router.post('/', authenticate, addRelease);
router.get('/review/:reviewId', getAllReleases);
router.get('/search', searchReleasesController);
router.get('/:releaseId', getRelease);

router.post('/auto', autoSaveRelease);

module.exports = router;