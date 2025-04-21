const bcrypt = require('bcrypt');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const email = "";
    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultAvatar = 'https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small_2x/user-profile-icon-free-vector.jpg';
    
    const [result] = await db.query(
      'INSERT INTO users (username, email, password_hash, avatar_url) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, defaultAvatar]
    );
    
    res.status(201).json({ message: 'User account created', userId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid login' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid login' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '6h' }
    );

    res.json({ 
      message: 'login successful',
      token,
      userId: user.id,
      isAdmin: user.is_admin
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login };