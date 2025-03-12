const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const { addReview, getReviewsByRelease, getReviewsByUser } = require('../controllers/reviewController');

router.post('/', authenticate, addReview);
router.get('/release/:releaseId', getReviewsByRelease);
router.get('/user', authenticate, getReviewsByUser);

module.exports = router;