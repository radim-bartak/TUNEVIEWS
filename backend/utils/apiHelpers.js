const axios = require('axios');
const LASTFM_API_KEY = process.env.LASTFM_API_KEY;

// Last.fm API
const searchReleases = async (query) => {
  const response = await axios.get('http://ws.audioscrobbler.com/2.0/', {
    params: {
      method: 'album.search',
      album: query,
      api_key: LASTFM_API_KEY,
      format: 'json',
    },
  });
  const albums = response.data.results.albummatches.album;

  const albumsWithCover = albums.map(album => {
    const cover = album.image.find(img => img.size === 'extralarge')?.['#text'];
    return { ...album, cover };
  });

  return albumsWithCover;
};


// MusicBrainz API
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