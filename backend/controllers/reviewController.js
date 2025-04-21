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

const getAllReviews = async (req, res) => {
  try {
    const [reviews] = await db.query(
      `SELECT r.*, u.username, u.avatar_url,
        a.title AS release_title, a.artist AS artist_name, a.cover_image_url as cover_image_url,
        (SELECT COUNT(*) FROM likes l WHERE l.review_id = r.id) AS likeCount
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       JOIN releases a ON r.release_id = a.id`
    );
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReviewsByRelease = async (req, res) => {
  try {
    const [reviews] = await db.query(
      `SELECT r.*, u.username, u.avatar_url,
        (SELECT COUNT(*) FROM likes l WHERE l.review_id = r.id) AS likeCount
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
      `SELECT r.*, a.title AS release_title, a.artist AS artist_name, a.cover_image_url as cover_image_url, u.username, u.avatar_url,
        (SELECT COUNT(*) FROM likes l WHERE l.review_id = r.id) AS likeCount
       FROM reviews r
       JOIN releases a ON r.release_id = a.id
       JOIN users u ON r.user_id = u.id
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
      `SELECT r.*, a.title AS release_title, a.artist AS artist_name, a.cover_image_url as cover_image_url, u.username, u.avatar_url,
        (SELECT COUNT(*) FROM likes l WHERE l.review_id = r.id) AS likeCount
       FROM reviews r
       JOIN releases a ON r.release_id = a.id
       JOIN users u ON r.user_id = u.id
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

    let query = 'DELETE FROM reviews WHERE id = ?';
    let params = [reviewId];
    if (!req.user.is_admin) {
      query += ' AND user_id = ?';
      params.push(req.user.id);
    }
    const [result] = await db.query(query, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Review not found or not authorized to delete' });
    }
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const likeReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviewId = parseInt(req.params.reviewId, 10);

    const [existing] = await db.query(
      'SELECT * FROM likes WHERE user_id = ? AND review_id = ?',
      [req.user.id, reviewId]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: 'You have already liked this review' });
    }

    await db.query(
      'INSERT INTO likes (review_id, user_id) VALUES (?, ?)',
      [reviewId, userId]
    );
    res.json({ message: 'Review liked' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const unlikeReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviewId = parseInt(req.params.reviewId, 10);

    await db.query(
      'DELETE FROM likes WHERE review_id = ? AND user_id = ?',
      [reviewId, userId]
    );
    res.json({ message: 'Review unliked' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReviewLikes = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviewId = parseInt(req.params.reviewId, 10);

    const [[{ count }]] = await db.query(
      'SELECT COUNT(*) as count FROM likes WHERE review_id = ?',
      [reviewId]
    );

    const [likedRows] = await db.query(
      'SELECT 1 FROM likes WHERE review_id = ? AND user_id = ? LIMIT 1',
      [reviewId, userId]
    );

    res.json({ count, likedByCurrentUser: likedRows.length > 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReviewLikeCount = async (req, res) => {
  try {
    const reviewId = parseInt(req.params.reviewId, 10);

    const [[{ count }]] = await db.query(
      'SELECT COUNT(*) as count FROM likes WHERE review_id = ?',
      [reviewId]
    );

    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addReview,
  getAllReviews,
  getReviewsByRelease,
  getReviewsByUser,
  getCurrentUserReviews,
  updateReview,
  deleteReview,
  likeReview,
  unlikeReview,
  getReviewLikes,
  getReviewLikeCount
};