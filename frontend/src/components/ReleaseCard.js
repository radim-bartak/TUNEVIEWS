import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function ReleaseCard({ release }) {
  return (
    <Card className="mb-4">
      <Card.Img variant="top" src={release.cover_image} />
      <Card.Body>
        <Card.Title>{release.name}</Card.Title>
        <Card.Text>{release.artist}</Card.Text>
        <Button as={Link} to={`/release/${release.mbid}`} variant="primary">Detaily</Button>
      </Card.Body>
    </Card>
  );
}