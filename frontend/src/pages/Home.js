import { useState, useEffect } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import ReleaseCard from '../components/ReleaseCard';
import api from '../Api';

export default function Home() {
  const [query, setQuery] = useState('');
  const [releases, setReleases] = useState([]);

  const searchReleases = async () => {
    if (!query) return;
    try {
      const { data } = await api.searchReleases(query);
      setReleases(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Search</h1>
      <Form onSubmit={(e) => { e.preventDefault(); searchReleases(); }}>
        <Form.Control
          type="text"
          placeholder="Search releases..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button className="mt-2" onClick={searchReleases}>Search</Button>
      </Form>
      
      <Row className="mt-4">
        {releases.map((release) => (
          <Col md={4} key={release.mbid}>
            <ReleaseCard release={release} />
          </Col>
        ))}
      </Row>
    </div>
  );
}
