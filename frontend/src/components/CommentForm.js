import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import api from '../Api';

export default function CommentForm({ reviewId, onCommentAdded, onError }) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.addComment({ reviewId, content });
      setContent('');
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error sending comment';
      if (onError) {
        onError(errorMessage);
      }
      console.error(err);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-3">
      <Form.Group>
        <Form.Control
          as="textarea"
          rows={2}
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </Form.Group>
      <Button variant="primary" size="sm" type="submit" className="mt-2">
        Send
      </Button>
    </Form>
  );
}