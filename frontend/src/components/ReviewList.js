import { useState } from 'react';
import { ListGroup, Form } from 'react-bootstrap';
import ReviewItem from './ReviewItem';

export default function ReviewList({ reviews, onError, profileView }) {
  const [sortBy, setSortBy] = useState('newest');

  const getLikeCount = (review) => typeof review.likeCount === 'number' ? review.likeCount : (review.likes || 0);

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    if (sortBy === 'oldest') {
      return new Date(a.created_at) - new Date(b.created_at);
    }
    if (sortBy === 'likes') {
      return getLikeCount(b) - getLikeCount(a);
    }
    if (sortBy === 'highest') {
      return Number(b.rating) - Number(a.rating);
    }
    if (sortBy === 'lowest') {
      return Number(a.rating) - Number(b.rating);
    }
    return 0;
  });

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mt-2 mb-3">
        <h4 className="mb-0">Reviews</h4>
        <Form.Select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          size="sm"
          style={{ border: 'none', boxShadow: 'none', maxWidth: 250 }}
        >
          <option value="newest">Sort by Newest</option>
          <option value="oldest">Sort by Oldest</option>
          <option value="likes">Sort by Likes</option>
          <option value="highest">Sort by Highest Rating</option>
          <option value="lowest">Sort by Lowest Rating</option>
        </Form.Select>
      </div>
      <ListGroup>
        {sortedReviews.map((review) => (
          <ReviewItem key={review.id} review={review} onError={onError} profileView={profileView} />
        ))}
      </ListGroup>
    </>
  );
}