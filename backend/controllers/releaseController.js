const db = require('../config/db');
const { get } = require('../routes/authRoutes');

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

module.exports = { getAllReleases, addRelease, getRelease };