const express = require('express');
const router = express.Router();
const { getCurrentUserProfile } = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');

router.get('/me', authenticate, getCurrentUserProfile);

module.exports = router;