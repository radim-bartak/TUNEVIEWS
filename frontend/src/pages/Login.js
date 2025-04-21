import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import api from '../Api';
import { UserContext } from '../context/UserContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginExpired, setLoginExpired] = useState('');
  const navigate = useNavigate();
  const { fetchProfile } = useContext(UserContext);

  useEffect(() => {
    const expiredMessage = localStorage.getItem('loginExpired');
    if (expiredMessage) {
      setLoginExpired(expiredMessage);
      localStorage.removeItem('loginExpired');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.login({ username, password });
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('isAdmin', response.isAdmin ? 'true' : 'false')
        await fetchProfile();
        navigate('/');
      } else {
        setError('Error logging in');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid login credentials');
    }
  };
  return (
    <div className="container mt-4">
      <div className="section">
        <h2>Login</h2>
        {loginExpired && <Alert variant="warning">{loginExpired}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3 mt-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">Login</Button>
        </Form>
        <div className="mt-3">
          Don't have an account yet? <Button variant="link" onClick={() => navigate('/register')}>Register</Button>
        </div>
      </div>
    </div>
  );
}