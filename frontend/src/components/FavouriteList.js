import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../Api';
import { Spinner, Image } from 'react-bootstrap';

export default function FavouriteList({ userId }) {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        let response;
        if (userId) {
          response = await api.getFavouritesByUser(userId);
        } else {
          response = await api.getFavourites();
        }
        setFavourites(response.data);
      } catch (err) {
        setFavourites([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFavourites();
  }, [userId]);

  if (loading) return <Spinner animation="border" />;

  if (!favourites.length) return <div>No favourite albums.</div>;

  return (
    <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', padding: '10px 0' }}>
      {favourites.map((release) => (
        <Link
          to={`/release/${release.id}`}
          key={release.id}
          style={{ display: 'inline-block', marginRight: 16, textAlign: 'center', textDecoration: 'none', color: 'inherit' }}
        >
          <Image
            src={release.cover_image_url || release.cover}
            alt={release.title || release.name}
            rounded
            style={{ width: 120, height: 120, objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
          />
          <div style={{ maxWidth: 120, fontSize: 14, marginTop: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {release.title || release.name}
          </div>
          <div style={{ fontSize: 12, color: '#666' }}>
            {release.artist}
          </div>
        </Link>
      ))}
    </div>
  );
}