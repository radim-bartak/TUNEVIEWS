const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const { addReview, getReviewsByRelease, getReviewsByUser, getCurrentUserReviews, updateReview, deleteReview } = require('../controllers/reviewController');

router.post('/', authenticate, addReview);
router.get('/release/:releaseId', getReviewsByRelease);
router.get('/user/:userId', getReviewsByUser);
router.get('/me', authenticate, getCurrentUserReviews);
router.patch('/:reviewId', authenticate, updateReview);
router.delete('/:reviewId', authenticate, deleteReview);

module.exports = router;