import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import api from '../Api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.login({ email, password });
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId);

        navigate('/');
      } else {
        setError('Nepodařilo se získat přihlašovací token');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Neplatné přihlašovací údaje');
    }
  };
  return (
    <div className="container mt-4">
      <h2>Přihlášení</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Heslo</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">Přihlásit</Button>
      </Form>
      <div className="mt-3">
        Nemáte účet? <Button variant="link" onClick={() => navigate('/register')}>Zaregistrovat se</Button>
      </div>
    </div>
  );
}