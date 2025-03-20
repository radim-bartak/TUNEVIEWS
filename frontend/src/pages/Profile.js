import { useState, useEffect } from 'react';
import { Button, Image, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from '../Api';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.getProfile();
        setUser(response.data);
      } catch (err) {
        setError('Error loading profile');
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>{user.username}</h2>
      
      <div className="mb-4">
        {user.avatar_url && (
          <Image 
            src={user.avatar_url} 
            roundedCircle 
            width={150}
            height={150}
            className="mb-3"
          />
        )}
      </div>

      <div className="mb-4">
        <h4>Bio</h4>
        <p>{user.bio || 'No bio yet.'}</p>
      </div>
      <div className="d-flex gap-2">
         <Button 
          variant="outline-primary" 
          onClick={() => navigate('/profile/edit')}
          >
          Edit profile
          </Button>
          <Button 
          variant="outline-danger"
          onClick={handleLogout}
        >
          Log out
        </Button>

        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      </div>
    </div>
  );
}