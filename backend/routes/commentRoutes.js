const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const { addComment, getCommentsByReview } = require('../controllers/commentController');

router.post('/', authenticate, addComment);
router.get('/review/:reviewId', getCommentsByReview);

module.exports = router;