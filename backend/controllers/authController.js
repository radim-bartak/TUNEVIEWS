const bcrypt = require('bcrypt');
const db = require('../config/db');

// Registrace uživatele
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await db.query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    
    res.status(201).json({ message: 'Uživatel zaregistrován', userId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Přihlášení uživatele
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Neplatný email nebo heslo' });
    }
    
    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Neplatný email nebo heslo' });
    }
    
    res.json({ message: 'Přihlášení úspěšné', userId: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login };