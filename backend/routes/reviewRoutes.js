const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const { addReview, getReviewsByRelease, getReviewsByUser, updateReview, deleteReview } = require('../controllers/reviewController');

router.post('/', authenticate, addReview);
router.get('/release/:releaseId', getReviewsByRelease);
router.get('/user', authenticate, getReviewsByUser);
router.patch('/:reviewId', authenticate, updateReview);
router.delete('/:reviewId', authenticate, deleteReview);

module.exports = router;