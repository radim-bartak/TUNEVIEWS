import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, ListGroup, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import api from '../Api';
import ReviewList from '../components/ReviewList';

export default function ReleaseDetail() {
  const { mbid } = useParams();
  const [release, setRelease] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, content: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Získání detailů alba z vašeho backendu
        const releaseResponse = await api.getRelease(mbid);
        setRelease(releaseResponse.data);
        
        // Získání recenzí
        const reviewsResponse = await api.getReviews(mbid);
        setReviews(reviewsResponse.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [mbid]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await api.addReview({
        releaseId: release.id,
        ...newReview
      });
      setNewReview({ rating: 5, content: '' });
      // Obnovení seznamu recenzí
      const response = await api.getReviews(mbid);
      setReviews(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!release) return <div>Načítání...</div>;

  return (
    <div className="container mt-4">
      <Row>
        <Col md={4}>
          <Card>
            <Card.Img variant="top" src={release.cover_image_url} />
            <Card.Body>
              <Card.Title>{release.title}</Card.Title>
              <Card.Text>{release.artist}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={8}>
          <h3>Recenze</h3>
          <Form onSubmit={handleSubmitReview} className="mb-4">
            <Form.Group className="mb-3">
              <Form.Label>Hodnocení (1-5)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="5"
                value={newReview.rating}
                onChange={(e) => setNewReview({...newReview, rating: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Recenze</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newReview.content}
                onChange={(e) => setNewReview({...newReview, content: e.target.value})}
              />
            </Form.Group>
            <Button variant="primary" type="submit">Přidat recenzi</Button>
          </Form>

          <ReviewList reviews={reviews} />
        </Col>
      </Row>
    </div>
  );
}