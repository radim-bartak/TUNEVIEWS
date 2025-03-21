const db = require('../config/db');

const addReview = async (req, res) => {
  try {
    const { releaseId, rating, content } = req.body;
    
    const [existing] = await db.query(
      'SELECT * FROM reviews WHERE user_id = ? AND release_id = ?',
      [req.user.id, releaseId]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: 'You have already reviewed this release' });
    }
    
    const [result] = await db.query(
      'INSERT INTO reviews (user_id, release_id, rating, content) VALUES (?, ?, ?, ?)',
      [req.user.id, releaseId, rating, content]
    );
    res.status(201).json({ message: 'Review added', reviewId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReviewsByRelease = async (req, res) => {
  try {
    const [reviews] = await db.query(
      `SELECT r.*, u.username, u.avatar_url
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
    const [reviews] = await db.query(
      `SELECT r.*, a.title AS release_title, a.artist AS artist_name
       FROM reviews r
       JOIN releases a ON r.release_id = a.id
       WHERE r.user_id = ?`,
      [req.params.userId]
    );
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCurrentUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const [reviews] = await db.query(
      `SELECT r.*, a.title AS release_title, a.artist AS artist_name
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

const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, content } = req.body;
    const [result] = await db.query('UPDATE reviews SET rating = ?, content = ? WHERE id = ?', [rating, content, reviewId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.status(200).json({ message: 'Review updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const [result] = await db.query('DELETE FROM reviews WHERE id = ? AND user_id = ?', [reviewId, req.user.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Review not found or not authorized to delete' });
    }
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addReview, getReviewsByRelease, getReviewsByUser, getCurrentUserReviews, updateReview, deleteReview };