import { useEffect, useState } from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import api from '../Api';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Předpokládáme, že backend má endpoint pro získání profilu uživatele
        const userResponse = await api.get('/users/me');
        setUser(userResponse.data);
        
        const reviewsResponse = await api.get('/reviews/user');
        setReviews(reviewsResponse.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  if (!user) return <div>Načítání...</div>;

  return (
    <div className="container mt-4">
      <Card>
        <Card.Body>
          <Card.Title>{user.username}</Card.Title>
          <Card.Text>{user.bio}</Card.Text>
        </Card.Body>
      </Card>

      <h3 className="mt-4">Moje recenze</h3>
      <ListGroup>
        {reviews.map((review) => (
          <ListGroup.Item key={review.id}>
            <h5>{review.release.title}</h5>
            <p>{review.content}</p>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}