import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import api from '../Api';

export default function CommentForm({ reviewId }) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.addComment({ reviewId, content });
      setContent('');
      // aktualizovat seznam komentářů (např. přes kontext nebo prop callback)
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-3">
      <Form.Group>
        <Form.Control
          as="textarea"
          rows={2}
          placeholder="Napiš komentář..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </Form.Group>
      <Button variant="outline-primary" size="sm" type="submit" className="mt-2">
        Odeslat
      </Button>
    </Form>
  );
}