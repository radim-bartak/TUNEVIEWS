const db = require('../config/db');

const addReview = async (req, res) => {
  try {
    const { releaseId, rating, content } = req.body;
    const [result] = await db.query(
      'INSERT INTO reviews (user_id, release_id, rating, content) VALUES (?, ?, ?, ?)',
      [req.user.id, releaseId, rating, content]
    );
    res.status(201).json({ message: 'Recenze přidána', reviewId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReviewsByRelease = async (req, res) => {
  try {
    const [reviews] = await db.query(
      `SELECT r.*, u.username 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE release_id = ?`,
      [req.params.releaseId]
    );
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReviewsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const [reviews] = await db.query(
      `SELECT r.*, a.title AS release_title
       FROM reviews r
       JOIN releases a ON r.release_id = a.id
       WHERE r.user_id = ?`,
      [userId]
    );
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addReview, getReviewsByRelease, getReviewsByUser };