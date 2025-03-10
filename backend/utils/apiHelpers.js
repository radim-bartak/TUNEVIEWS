const axios = require('axios');
const LASTFM_API_KEY = process.env.LASTFM_API_KEY;

// Vyhledání alb přes Last.fm
const searchReleases = async (query) => {
  const response = await axios.get('http://ws.audioscrobbler.com/2.0/', {
    params: {
      method: 'album.search',
      album: query,
      api_key: LASTFM_API_KEY,
      format: 'json',
    },
  });
  return response.data.results.albummatches.album;
};

// Získání typu vydání přes MusicBrainz
const getReleaseType = async (mbid) => {
  if (!mbid) return 'unknown';
  try {
    const response = await axios.get(
      `https://musicbrainz.org/ws/2/release-group/${mbid}?fmt=json`
    );
    return response.data['primary-type'] || 'unknown';
  } catch (error) {
    return 'unknown';
  }
};

module.exports = { searchReleases, getReleaseType };