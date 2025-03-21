import { ListGroup } from 'react-bootstrap';
import ReviewItem from './ReviewItem';

export default function ReviewList({ reviews, onError, profileView }) {
  return (
    <ListGroup>
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} onError={onError} profileView={profileView} />
      ))}
    </ListGroup>
  );
}