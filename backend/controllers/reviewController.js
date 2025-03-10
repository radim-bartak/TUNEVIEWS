const db = require('../config/db');

// Přidání recenze
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

// Získání recenzí pro album
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

module.exports = { addReview, getReviewsByRelease };