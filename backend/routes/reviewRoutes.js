const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const {
  addReview,
  getAllReviews,
  getReviewsByRelease,
  getReviewsByUser,
  getCurrentUserReviews,
  updateReview,
  deleteReview,
  likeReview,
  unlikeReview,
  getReviewLikes,
  getReviewLikeCount
} = require('../controllers/reviewController');

router.post('/', authenticate, addReview);
router.get('/', getAllReviews);
router.get('/release/:releaseId', getReviewsByRelease);
router.get('/user/:userId', getReviewsByUser);
router.get('/me', authenticate, getCurrentUserReviews);
router.patch('/:reviewId', authenticate, updateReview);
router.delete('/:reviewId', authenticate, deleteReview);

router.post('/:reviewId/like', authenticate, likeReview);
router.delete('/:reviewId/like', authenticate, unlikeReview);
router.get('/:reviewId/likes', authenticate, getReviewLikes);
router.get('/:reviewId/like/count', getReviewLikeCount);

module.exports = router;