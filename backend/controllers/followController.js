const db = require('../config/db');

const followUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followeeId = parseInt(req.params.userId, 10);

    if (followerId === followeeId) {
      return res.status(400).json({ error: "You cannot follow yourself." });
    }

    await db.query(
      'INSERT IGNORE INTO followers (follower_id, followee_id) VALUES (?, ?)',
      [followerId, followeeId]
    );
    res.json({ message: "Followed successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followeeId = parseInt(req.params.userId, 10);

    if (followerId === followeeId) {
      return res.status(400).json({ error: "You cannot unfollow yourself." });
    }

    const [result] = await db.query(
      'DELETE FROM followers WHERE follower_id = ? AND followee_id = ?',
      [followerId, followeeId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "You are not following this user." });
    }

    res.json({ message: "Unfollowed successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFollowingReviews = async (req, res) => {
  try {
    const followerId = req.user.id;
    const [reviews] = await db.query(
      `SELECT r.*, u.username, u.avatar_url
       FROM reviews r
       JOIN followers f ON r.user_id = f.followee_id
       JOIN users u ON u.id = r.user_id
       WHERE f.follower_id = ?
       ORDER BY r.created_at DESC`,
      [followerId]
    );
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkFollowStatus = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followeeId = parseInt(req.params.userId, 10);

    const [rows] = await db.query(
      'SELECT 1 FROM followers WHERE follower_id = ? AND followee_id = ? LIMIT 1',
      [followerId, followeeId]
    );

    res.json({ isFollowing: rows.length > 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFollowerCount = async (req, res) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const [[{ count }]] = await db.query(
        'SELECT COUNT(*) as count FROM followers WHERE followee_id = ?',
        [userId]
      );
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = { followUser, unfollowUser, getFollowingReviews, checkFollowStatus, getFollowerCount };