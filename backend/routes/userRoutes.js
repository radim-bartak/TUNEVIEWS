const express = require('express');
const router = express.Router();
const { getUserProfile, getCurrentUserProfile, updateUser } = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');

router.get('/me', authenticate, getCurrentUserProfile);
router.get('/:userId', authenticate, getUserProfile)
router.patch('/me', authenticate, updateUser);

module.exports = router;