import { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';
import ReleaseCard from '../components/ReleaseCard';
import ReviewList from '../components/ReviewList';
import api from '../Api';

export default function Home() {
  const [query, setQuery] = useState('');
  const [releases, setReleases] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [error, setError] = useState('');

  const searchReleases = async () => {
    if (!query) return;
    setReleases([]);
    try {
      const { data } = await api.searchReleases(query);
      setReleases(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const { data } = await api.getAllReviews();
        setAllReviews(data);
      } catch (err) {
        setError('Error loading reviews');
      }
    };
    fetchAllReviews();
  }, []);

  return (
    <div className="container mt-4">
      <div className="section">
        <h1 className="mt-2">Music Search</h1>
        <Form onSubmit={(e) => { e.preventDefault(); searchReleases(); }}>
          <Form.Control
            type="text"
            placeholder="Search for artists, albums, singles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="home-search"
          />
          <Button className="mt-3" onClick={searchReleases}>Search</Button>
        </Form>
        
        <Row className="mt-4">
          {releases.slice(0, 9).map((release, index) => (
            <Col md={4} key={release.lastfm_id || `${release.name}-${index}`}>
              <ReleaseCard release={release} />
            </Col>
          ))}
        </Row>
      </div>

      <div className="section">
        <div className="mt-2">
          {error && <Alert variant="danger">{error}</Alert>}
          {allReviews.length > 0 ? (
            <ReviewList reviews={allReviews} onError={setError} profileView={true} />
          ) : (
            <p>No new reviews.</p>
          )}
        </div>
      </div>
    </div>
  );
}