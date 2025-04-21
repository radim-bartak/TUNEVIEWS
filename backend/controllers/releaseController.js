const db = require('../config/db');
const { get } = require('../routes/authRoutes');
const { searchReleases } = require('../utils/apiHelpers');

const getAllReleases = async (req, res) => {
  try {
    const [releases] = await db.query('SELECT * FROM releases');
    res.json(releases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRelease = async (req, res) => {
  try {
    const { releaseId } = req.params;
    const [releases] = await db.query('SELECT * FROM releases WHERE id = ?', [releaseId]);
    if (releases.length === 0) {
      return res.status(404).json({ error: 'Release not found' });
    }
    res.json(releases[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addRelease = async (req, res) => {
  try {
    const { title, artist, lastfm_id, release_date, cover_image_url, genres } = req.body;
    const [result] = await db.query(
      'INSERT INTO releases (title, artist, lastfm_id, release_date, cover_image_url, genres) VALUES (?, ?, ?, ?, ?, ?)',
      [title, artist, lastfm_id, release_date, cover_image_url, JSON.stringify(genres)]
    );
    res.status(201).json({ message: 'Vydání přidáno', releaseId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchReleasesController = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }
    const releases = await searchReleases(q);
    res.json(releases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const autoSaveRelease = async (req, res) => {
  const { title, artist, lastfm_id, cover, release_date, genres } = req.body;
  try {
    const [existing] = await db.query(
      'SELECT * FROM releases WHERE lastfm_id = ?',
      [lastfm_id]
    );
    if (existing.length > 0) {
      return res.json(existing[0]);
    }

    const [result] = await db.query(
      'INSERT INTO releases (title, artist, lastfm_id, release_date, cover_image_url, genres) VALUES (?, ?, ?, ?, ?, ?)',
      [
        title,
        artist,
        lastfm_id,
        release_date || null,
        cover,
        JSON.stringify(genres || []),
      ]
    );

    const [rows] = await db.query('SELECT * FROM releases WHERE id = ?', [
      result.insertId,
    ]);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addFavourite = async (req, res) => {
  try {
    const userId = req.user.id;
    const releaseId = req.params.releaseId;

    const [existing] = await db.query(
      'SELECT * FROM favourites WHERE user_id = ? AND release_id = ?',
      [userId, releaseId]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: 'This release is already in favourites' });
    }

    await db.query(
      'INSERT INTO favourites (user_id, release_id) VALUES (?, ?)',
      [userId, releaseId]
    );
    res.json({ message: 'Added to favourites' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeFavourite = async (req, res) => {
  try {
    await db.query(
      'DELETE FROM favourites WHERE user_id = ? AND release_id = ?',
      [req.user.id, req.params.releaseId]
    );
    res.json({ message: 'Removed from favourites' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFavourites = async (req, res) => {
  try {
    const userId = req.params.userId ? parseInt(req.params.userId, 10) : req.user.id;
    const [rows] = await db.query(
      `SELECT r.* FROM releases r
       JOIN favourites f ON r.id = f.release_id
       WHERE f.user_id = ?`,
      [userId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const isFavourite = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT 1 FROM favourites WHERE user_id = ? AND release_id = ?',
      [req.user.id, req.params.releaseId]
    );
    res.json({ isFavourite: rows.length > 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNewestReleases = async (req, res) => {
  try {
    const [releases] = await db.query(
      'SELECT * FROM releases ORDER BY created_at DESC LIMIT 9'
    );
    res.json(releases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { 
  getAllReleases, 
  addRelease, 
  getRelease, 
  searchReleasesController, 
  autoSaveRelease,
  addFavourite,
  removeFavourite,
  getFavourites,
  isFavourite,
  getNewestReleases 
};