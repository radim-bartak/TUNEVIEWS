const db = require('../config/db');

const getUserProfile = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, username, email, avatar_url, bio FROM users WHERE id = ?',
      [req.params.userId]
    );
    if (users.length === 0) return res.status(404).json({ error: 'Uživatel nenalezen' });
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCurrentUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const [users] = await db.query(
      'SELECT id, username, email, avatar_url, bio FROM users WHERE id = ?',
      [userId]
    );
    if (users.length === 0)
      return res.status(404).json({ error: 'Uživatel nenalezen' });

    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUserProfile, getCurrentUserProfile };