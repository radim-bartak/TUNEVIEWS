import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Card, ListGroup, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import api from '../Api';
import ReviewList from '../components/ReviewList';
import StarRating from '../components/StarRating';

export default function ReleaseDetail() {
  const { lastfm_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [release, setRelease] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, content: '' });
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchRelease = async () => {
      try {
        const response = await api.getRelease(lastfm_id);
        setRelease(response.data);

        if (String(response.data.id) !== lastfm_id) {
          navigate(`/release/${response.data.id}`, { replace: true });
        }
      } catch (err) {
        if (location.state && location.state.release) {
          try {
            const releaseData = {
              title: location.state.release.name,
              artist: location.state.release.artist,
              lastfm_id: location.state.release.url,
              cover: location.state.release.cover,
              release_date: location.state.release.release_date,
              genres: location.state.release.genres,
            };
            const autoResponse = await api.autoSaveRelease(releaseData);
            setRelease(autoResponse.data);

            navigate(`/release/${autoResponse.data.id}`, { replace: true });
          } catch (autoErr) {
            setError(autoErr.response?.data?.error || 'Error auto-saving release');
          }
        } else {
          setError('Release not found');
        }
      }
    };

    const fetchReviews = async () => {
      try {
        const reviewsResponse = await api.getReviews(lastfm_id);
        setReviews(reviewsResponse.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching reviews');
      }
    };

    fetchRelease();
    fetchReviews();
  }, [lastfm_id, location.state, navigate]);


  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await api.addReview({
        releaseId: release.id,
        ...newReview
      });
      setNewReview({ rating: 5, content: '' });

      const response = await api.getReviews(lastfm_id);
      setReviews(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error submitting review');
    }
  };

  const handleEditReview = async (e) => {
    e.preventDefault();
    try {

      await api.updateReview(userReview.id, newReview);
      setEditing(false);

      const response = await api.getReviews(lastfm_id);
      setReviews(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating review');
    }
  };

  const handleDeleteReview = async () => {
    try {
      await api.deleteReview(userReview.id);

      const response = await api.getReviews(lastfm_id);
      setReviews(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error deleting review');
    }
  };

  const averageRating = reviews.length 
    ? (reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length).toFixed(1)
    : null;

  const userReview = reviews.find(review => review.user_id === Number(currentUserId));

  if (!release) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Col md={4}>
          <Card>
            <Card.Img variant="top" src={release.cover_image_url || release.cover} />
            <Card.Body>
              <Card.Title>{release.title || release.name}</Card.Title>
              <Card.Text>{release.artist}</Card.Text>
              {averageRating ? (
                <h5>Average Rating: {averageRating}/10</h5>
              ) : (
                <h5>No reviews yet</h5>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={8}>
          {userReview ? (
            <>
              {editing ? (
                <>
                  <h3>Edit Review</h3>
                  <Form onSubmit={handleEditReview} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Rating</Form.Label>
                      <StarRating
                        value={newReview.rating}
                        onChange={(val) => setNewReview({ ...newReview, rating: val })}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Review</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={newReview.content}
                        onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit">Update</Button>{' '}
                    <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
                  </Form>
                </>
              ) : (
                <>
                  <h3>My Review</h3>
                  <Card className="mb-4">
                    <Card.Body>
                      <Card.Text>
                        Rating: {userReview.rating}/10
                      </Card.Text>
                      <Card.Text>
                        {userReview.content}
                      </Card.Text>
                      <Button variant="outline-primary" onClick={() => {
                        setEditing(true);
                        
                        setNewReview({
                          rating: userReview.rating,
                          content: userReview.content
                        });
                      }}>
                        Edit
                      </Button>{' '}
                      <Button variant="outline-danger" onClick={handleDeleteReview}>
                        Delete
                      </Button>
                    </Card.Body>
                  </Card>
                </>
              )}
            </>
          ) : (
            <>
              <h3>My Review</h3>
              <Form onSubmit={handleSubmitReview} className="mb-4">
                <Form.Group className="mb-3">
                  <Form.Label>Rating (1-10)</Form.Label>
                  <StarRating
                    value={newReview.rating}
                    onChange={(val) => setNewReview({ ...newReview, rating: val })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Review</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newReview.content}
                    onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">Send</Button>
              </Form>
            </>
          )}
          
          <h3>Reviews</h3>
          <ReviewList reviews={reviews} onError={setError}/>
        </Col>
      </Row>
    </div>
  );
}