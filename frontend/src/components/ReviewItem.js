import { useState, useEffect } from 'react';
import { ListGroup, Button, Collapse, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaRegComment } from 'react-icons/fa';
import CommentForm from './CommentForm';
import api from '../Api';

export default function ReviewItem({ review, onError, profileView }) {
  const [comments, setComments] = useState([]);
  const [open, setOpen] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const fetchComments = async () => {
    try {
      const response = await api.getCommentsByReview(review.id);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments: ', error);
    }
  };

  const fetchLikes = async () => {
    try {
      const res = await api.getReviewLikes(review.id);
      setLikeCount(res.data.count);
      setLiked(res.data.likedByCurrentUser);
    } catch (error) {
      setLikeCount(0);
      setLiked(false);
    }
  };

  useEffect(() => {
    fetchComments();
    fetchLikes();
  }, [review.id]);

  const handleDeleteReview = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await api.deleteReview(review.id);
        window.location.reload();
      } catch (error) {
        onError(error.response?.data?.error || 'Error deleting review');
      }
    }
  };

  const handleLike = async () => {
    try {
      if (liked) {
        await api.unlikeReview(review.id);
        setLikeCount(likeCount - 1);
        setLiked(false);
      } else {
        await api.likeReview(review.id);
        setLikeCount(likeCount + 1);
        setLiked(true);
      }
    } catch (error) {
      onError(error.response?.data?.error || 'Error liking/unliking review');
    }
  };
  
  return (
    <ListGroup.Item className="mb-4" style={{ boxShadow: '0 0 3px rgba(0, 0, 0, 0.1)', borderRadius: '5px' }}>
      <div className="d-flex align-items-center">
        {review.avatar_url && review.cover_image_url ? (
          <Link to={`/release/${review.release_id}`}>
            <Image 
              src={review.cover_image_url} 
              rounded 
              width={70} 
              height={70} 
              className="me-3 mt-2"
              alt="Album cover"
            />
          </Link>
        ) : (
          review.avatar_url && (
            <Link to={`/user/${review.user_id}`}>
              <Image 
                src={review.avatar_url} 
                roundedCircle 
                width={50} 
                height={50} 
                className="me-2"
                alt={`${review.username}'s avatar`}
              />
            </Link>
          )
        )}
        <h5 className="m-0">
          {profileView && review.release_title ? (
            <Link to={`/release/${review.release_id}`} className="text-decoration-none text-dark">
              {review.artist_name} - {review.release_title} - {review.rating}/10
            </Link> 
          ) : (
            <Link to={`/user/${review.user_id}`} className="text-decoration-none text-dark">
              <strong>{review.username || 'Anonymous'}</strong> - {review.rating}/10
            </Link>
          )}
        </h5>
        <small className="text-muted ms-2">{new Date(review.created_at).toLocaleString()}</small>

        {isAdmin && (
          <Button variant="outline-danger" size="sm" onClick={handleDeleteReview} className="ms-auto">
            Delete
          </Button>
        )}
      </div>

      <p className="mt-3" style={{ whiteSpace: 'pre-line' }}>{review.content}</p>
      
      <div className="mt-3 d-flex align-items-center">
        {review.avatar_url && review.cover_image_url ? (
          <Link to={`/user/${review.user_id}`} className="text-decoration-none text-dark">
            <Image 
              src={review.avatar_url} 
              roundedCircle 
              width={35} 
              height={35} 
              className="me-2"
              alt={`${review.username}'s avatar`}
            />
            <strong>{review.username || 'Anonymous'}</strong>
          </Link>
        ) : null }
      </div>

      <div className="mt-4 d-flex align-items-center">
        <Button
          variant="link"
          className="p-0 pb-3"
          style={{
            fontSize: '1.3rem',
            color: liked ? 'red' : 'gray',
            textDecoration: 'none'
          }}
          onClick={handleLike}
          aria-label={liked ? 'Unlike' : 'Like'}
        >
          {liked ? <FaHeart /> : <FaRegHeart />} {likeCount}
        </Button>
      

        <Button
          variant="link"
          className="ms-4 p-0 pb-3"
          style={{ fontSize: '1.3rem', textDecoration: 'none' }}
          onClick={() => setShowReplyForm(!showReplyForm)}
          aria-label="Reply"
        >
          <FaRegComment />
        </Button>
      </div>
      {showReplyForm && (
        <CommentForm
          reviewId={review.id}
          onCommentAdded={fetchComments}
          onError={onError}
        />
      )}

      {comments.length > 0 && (
        <>
          <div className="mt-0">
            <Button
              variant="link"
              style={{ fontSize: '1rem', textDecoration: 'none' }}
              onClick={() => setOpen(!open)}
              aria-controls={`comments-${review.id}`}
              aria-expanded={open}
            >
              {open ? 'Hide Comments' : `Show Comments (${comments.length})`}
            </Button>
          </div>
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