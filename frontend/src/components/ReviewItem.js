import { useState, useEffect } from 'react';
import { ListGroup, Button, Collapse, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CommentForm from './CommentForm';
import api from '../Api';

export default function ReviewItem({ review, onError, profileView }) {
  const [comments, setComments] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchComments = async () => {
    try {
      const response = await api.getCommentsByReview(review.id);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments: ', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [review.id]);

  return (
    <ListGroup.Item className="mb-3">
      <div className="d-flex align-items-center">
        {review.avatar_url && (
          <Link to={`/user/${review.user_id}`}>
            <Image 
              src={review.avatar_url} 
              roundedCircle 
              width={40} 
              height={40} 
              className="me-2"
              alt={`${review.username}'s avatar`}
            />
          </Link>
        )}
        <h5 className="m-0">
          {profileView && review.release_title ? (
            <Link to={`/release/${review.release_id}`} className="text-decoration-none text-dark">
              {review.artist_name} - {review.release_title} - {review.rating}/10
            </Link>
          ) : (
            <Link to={`/user/${review.user_id}`} className="text-decoration-none text-dark">
              {review.username || 'Anonymous'} - {review.rating}/10
            </Link>
          )}
        </h5>
        <small className="text-muted ms-2">{new Date(review.created_at).toLocaleString()}</small>
      </div>
      <p>{review.content}</p>
      
      <CommentForm
        reviewId={review.id}
        onCommentAdded={fetchComments}
        onError={onError}
      />

      {comments.length > 0 && (
        <>
          <Button
            variant="link"
            onClick={() => setOpen(!open)}
            aria-controls={`comments-${review.id}`}
            aria-expanded={open}
          >
            {open ? 'Hide Comments' : `Show Comments (${comments.length})`}
          </Button>
          <Collapse in={open}>
            <div id={`comments-${review.id}`} className="ms-4">
              {comments.map((comment) => (
                <div key={comment.id} className="mt-2 p-2 bg-light rounded">
                <strong>{comment.username || 'Anonymous'}:</strong> {comment.content}
                </div>
              ))}
            </div>
          </Collapse>
        </>
      )}
    </ListGroup.Item>
  );
}