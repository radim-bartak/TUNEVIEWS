import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function ReleaseCard({ release }) {
  return (
    <Card className="release-card mb-4" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <Card.Img variant="top" src={release.cover} />
      <Card.Body>
        <Card.Title>{release.name}</Card.Title>
        <Card.Text>{release.artist}</Card.Text>
        <Button
          as={Link}
          to={`/release/${release.lastfm_id}`}
          state={{ release }}
          variant="primary"
        >
          Details
        </Button>
      </Card.Body>
    </Card>
  );
}