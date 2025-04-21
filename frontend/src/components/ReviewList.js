import { useState } from 'react';
import { ListGroup, Form, Pagination } from 'react-bootstrap';
import ReviewItem from './ReviewItem';

export default function ReviewList({ reviews, onError, profileView, recent }) {
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const reviewsPerPage = 5;

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

  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
  const pagedReviews = sortedReviews.slice((page - 1) * reviewsPerPage, page * reviewsPerPage);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mt-2 mb-3">
        <h4 className="mb-0">{recent ? "Recent Reviews" : "Reviews"}</h4>
        <Form.Select
          value={sortBy}
          onChange={e => { setSortBy(e.target.value); setPage(1); }}
          size="sm"
          className="sort-select"
        >
          <option value="newest">Sort by Newest</option>
          <option value="oldest">Sort by Oldest</option>
          <option value="likes">Sort by Likes</option>
          <option value="highest">Sort by Highest Rating</option>
          <option value="lowest">Sort by Lowest Rating</option>
        </Form.Select>
      </div>
      <ListGroup>
        {pagedReviews.map((review) => (
          <ReviewItem key={review.id} review={review} onError={onError} profileView={profileView} />
        ))}
      </ListGroup>
      {totalPages > 1 && (
        <Pagination className="mt-3 justify-content-center">
          <Pagination.First onClick={() => handlePageChange(1)} disabled={page === 1} />
          <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 1} />
          {[...Array(totalPages)].map((_, idx) => (
            <Pagination.Item
              key={idx + 1}
              active={page === idx + 1}
              onClick={() => handlePageChange(idx + 1)}
            >
              {idx + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} />
          <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={page === totalPages} />
        </Pagination>
      )}
    </>
  );
}