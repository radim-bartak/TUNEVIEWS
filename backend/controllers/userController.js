const db = require('../config/db');

const getUserProfile = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, username, email, avatar_url, bio FROM users WHERE id = ?',
      [req.params.userId]
    );
    if (users.length === 0) return res.status(404).json({ error: 'User not found' });
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
      return res.status(404).json({ error: 'User not found' });

    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bio, avatar_url } = req.body;

    const [result] = await db.query(
      'UPDATE users SET bio = ?, avatar_url = ? WHERE id = ?',
      [bio, avatar_url, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const [users] = await db.query(
      'SELECT id, username, email, avatar_url, bio FROM users WHERE id = ?',
      [userId]
    );

    res.json(users[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getUserProfile, getCurrentUserProfile, updateUser };