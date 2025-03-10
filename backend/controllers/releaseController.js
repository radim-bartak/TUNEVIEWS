const db = require('../config/db');

const getAllReleases = async (req, res) => {
  try {
    const [releases] = await db.query('SELECT * FROM releases');
    res.json(releases);
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

module.exports = { getAllReleases, addRelease };