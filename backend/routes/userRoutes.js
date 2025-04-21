const express = require('express');
const router = express.Router();
const { getUserProfile, getCurrentUserProfile, updateUser, updateAdmin, getMostActiveUsers, searchUsers } = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/most-active', getMostActiveUsers);
router.get('/search', searchUsers);
router.get('/me', authenticate, getCurrentUserProfile);
router.get('/:userId', getUserProfile);
router.patch('/me', authenticate, updateUser);
router.patch('/admin/:userId', authenticate, adminMiddleware, updateAdmin);

module.exports = router;