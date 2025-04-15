const express = require('express');
const router = express.Router();
const { getUserProfile, getCurrentUserProfile, updateUser, updateAdmin } = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/me', authenticate, getCurrentUserProfile);
router.get('/:userId', authenticate, getUserProfile)
router.patch('/me', authenticate, updateUser);
router.patch('/admin/:userId', authenticate, adminMiddleware, updateAdmin);

module.exports = router;