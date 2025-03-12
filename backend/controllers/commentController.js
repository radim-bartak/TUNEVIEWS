const db = require('../config/db');

const addComment = async (req, res) => {
  try {
    const { reviewId, content } = req.body;
    const [result] = await db.query(
      'INSERT INTO comments (user_id, review_id, content) VALUES (?, ?, ?)',
      [req.user.id, reviewId, content]
    );
    res.status(201).json({ message: 'Komentář přidán', commentId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCommentsByReview = async (req, res) => {
  try {
    const [comments] = await db.query(
      `SELECT c.*, u.username 
       FROM comments c 
       JOIN users u ON c.user_id = u.id 
       WHERE review_id = ?`,
      [req.params.reviewId]
    );
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addComment, getCommentsByReview };