const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const { addReview, getReviewsByRelease } = require('../controllers/reviewController');

router.post('/', authenticate, addReview);
router.get('/release/:releaseId', getReviewsByRelease);

module.exports = router;