const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const { 
    getAllReleases, 
    addRelease, 
    getRelease, 
    searchReleasesController, 
    autoSaveRelease,
    addFavourite,
    removeFavourite,
    getFavourites,
    isFavourite
 } = require('../controllers/releaseController');

router.post('/', authenticate, addRelease);
router.get('/review/:reviewId', getAllReleases);
router.get('/search', searchReleasesController);
router.get('/:releaseId', getRelease);

router.post('/auto', autoSaveRelease);

router.post('/favourite/:releaseId', authenticate, addFavourite);
router.delete('/favourite/:releaseId', authenticate, removeFavourite);
router.get('/favourite/:userId', getFavourites);
router.get('/favourite', authenticate, getFavourites);
router.get('/favourite/:releaseId/status', authenticate, isFavourite);

module.exports = router;