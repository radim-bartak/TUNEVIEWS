import { useState, useEffect } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import ReleaseCard from '../components/ReleaseCard';
import api from '../Api';

export default function Home() {
  const [query, setQuery] = useState('');
  const [releases, setReleases] = useState([]);

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

  return (
    <div className="container mt-4">
      <h1>Music Search</h1>
      <Form onSubmit={(e) => { e.preventDefault(); searchReleases(); }}>
        <Form.Control
          type="text"
          placeholder="Search for artists, albums, singles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button className="mt-3" onClick={searchReleases}>Search</Button>
      </Form>
      
      <Row className="mt-4">
        {releases.map((release, index) => (
          <Col md={4} key={release.lastfm_id || `${release.name}-${index}`}>
            <ReleaseCard release={release} />
          </Col>
        ))}
      </Row>
    </div>
  );
}