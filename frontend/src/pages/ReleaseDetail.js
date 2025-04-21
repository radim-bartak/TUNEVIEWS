import { useState, useEffect, useRef } from 'react';
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
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current && editing) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newReview.content, editing]);

  const [isFavourite, setIsFavourite] = useState(false);

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

    setEditing(false);
    setNewReview({ rating: 5, content: '' });
    
    fetchRelease();
    fetchReviews();
  }, [lastfm_id, location.state, navigate]);

  useEffect(() => {
    const fetchFavouriteStatus = async () => {
      try {
        if (release && release.id) {
          const res = await api.isFavourite(release.id);
          setIsFavourite(res.data.isFavourite);
        }
      } catch {
        setIsFavourite(false);
      }
    };
    fetchFavouriteStatus();
  }, [release]);

  const handleFavourite = async () => {
    try {
      if (!release || !release.id) return;
      if (isFavourite) {
        await api.removeFavourite(release.id);
        setIsFavourite(false);
      } else {
        await api.addFavourite(release.id);
        setIsFavourite(true);
      }
    } catch (err) {
      setError('Error updating favourites');
    }
  };

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

   if (!release) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
      <div className="spinner-border text-primary" role="status" aria-label="Loading">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

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
                <h5>Average Rating: {averageRating/2}/5</h5>
              ) : (
                <h5>No reviews yet</h5>
              )}
              <Button
                variant={isFavourite ? "warning" : "outline-warning"}
                className="mt-3"
                onClick={handleFavourite}
              >
                {isFavourite ? "★ Favourite" : "☆ Add to Favourites"}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      
        <Col md={8}>
        <div className="section">
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
                        rows={1}
                        style={{ resize: 'none', overflow: 'hidden' }}
                        ref={textareaRef}
                        value={newReview.content}
                        onChange={(e) => {
                          setNewReview({ ...newReview, content: e.target.value });
                          e.target.style.height = 'auto';
                          e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit">Update</Button>{' '}
                    <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
                  </Form>
                </>
              ) : (
                <>
                  <h3>My Review</h3>
                  <div className="mb-4 mt-4">
                    <p><strong>Rating:</strong> {userReview.rating/2}/5</p>
                    <p style={{ whiteSpace: 'pre-line' }}>{userReview.content}</p>
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
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <h3>My Review</h3>
              <Form onSubmit={handleSubmitReview} className="mb-4">
                <Form.Group className="mb-3">
                  <Form.Label>Rating (1-5)</Form.Label>
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
                    style={{ resize: 'none', overflow: 'hidden' }}
                    value={newReview.content}
                    onChange={(e) => {
                      setNewReview({ ...newReview, content: e.target.value });
                      e.target.style.height = 'auto';
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">Send</Button>
              </Form>
            </>
          )}
        </div>
        <div className="section">
          {reviews.length > 0 ? (
            <ReviewList reviews={reviews} onError={setError} profileView={true} />
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
        </Col>
      </Row>
    </div>
  );
}