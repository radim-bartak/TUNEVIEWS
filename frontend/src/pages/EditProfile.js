import { useState, useEffect } from 'react';
import { Form, Button, Alert, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../Api';

export default function EditProfile() {
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.getCurrentUserProfile();
        setBio(response.data.bio || '');
        setAvatarUrl(response.data.avatar_url || '');
      } catch (err) {
        setError('Error loading profile');
        console.log(err);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.updateUserProfile({ bio, avatar_url: avatarUrl });
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating profile');
    }
  };

  return (
    <div className="container mt-4">
      <div className="section">
        <h2>Edit Profile</h2>
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Avatar (URL)</Form.Label>
            <Form.Control
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
            {avatarUrl && (
              <div className="mt-2">
                <Image 
                  src={avatarUrl} 
                  thumbnail 
                  width={100}
                  height={100}
                />
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Bio</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write something about yourself..."
            />
          </Form.Group>

          {error && <Alert variant="danger">{error}</Alert>}
          
          <div className="d-flex gap-2">
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
            <Button variant="secondary" onClick={() => navigate('/profile')}>
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}