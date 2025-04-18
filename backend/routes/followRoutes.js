const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const { followUser, unfollowUser, getFollowingReviews, checkFollowStatus, getFollowerCount } = require('../controllers/followController');

router.post('/:userId', authenticate, followUser);
router.delete('/:userId', authenticate, unfollowUser);
router.get('/reviews', authenticate, getFollowingReviews);
router.get('/:userId/status', authenticate, checkFollowStatus);
router.get('/:userId/count', authenticate, getFollowerCount);

module.exports = router;