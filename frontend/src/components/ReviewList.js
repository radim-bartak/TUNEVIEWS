import { ListGroup } from 'react-bootstrap';
import CommentForm from './CommentForm';

export default function ReviewList({ reviews }) {
  return (
    <ListGroup>
      {reviews.map((review) => (
        <ListGroup.Item key={review.id} className="mb-3">
          <h5>{review.user.username} - {review.rating}/5</h5>
          <p>{review.content}</p>
          
          <div className="ms-4">
            <h6>Komentáře</h6>
            <CommentForm reviewId={review.id} />
            {review.comments?.map((comment) => (
              <div key={comment.id} className="mt-2 p-2 bg-light rounded">
                <strong>{comment.user.username}:</strong> {comment.content}
              </div>
            ))}
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}