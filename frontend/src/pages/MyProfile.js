import { useState, useEffect } from 'react';
import { Button, Image, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from '../Api';
import ReviewList from '../components/ReviewList';

export default function MyProfile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.getCurrentUserProfile();
        setUser(response.data);
      } catch (err) {
        setError('Error loading profile');
      }
    };

    const fetchUserReviews = async () => {
      try {
        const response = await api.getCurrentUserReviews();
        setReviews(response.data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };

    const fetchFollowerCount = async () => {
      try {
        const response = await api.getFollowerCount(user.id);
        setFollowerCount(response.data.count);
      } catch (err) {
        setFollowerCount(0);
      }
    };

    fetchProfile();
    fetchUserReviews();
    fetchFollowerCount();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">{user.username}</h2>
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
        </div>
      </div>
      
      <div className="mb-2">
        {user.avatar_url && (
          <Image 
            src={user.avatar_url} 
            roundedCircle 
            width={150}
            height={150}
            className="mb-2"
          />
        )}
      </div>

      <div className="mb-4">
        {followerCount} <strong>{followerCount === 1 ? 'Follower' : 'Followers'}</strong>
      </div>

      <div className="mb-4">
        <h4>Bio</h4>
        <p>{user.bio || 'No bio yet.'}</p>
      </div>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      <div className="mb-4">
        {reviews.length > 0 ? (
          <ReviewList reviews={reviews} onError={setError} profileView={true}/>
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
}