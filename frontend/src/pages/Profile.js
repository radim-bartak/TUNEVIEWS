import { useState, useEffect } from 'react';
import { Alert, Image, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import api from '../Api';
import ReviewList from '../components/ReviewList';

export default function Profile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.getUserProfile(userId);
        setUser(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Error loading profile');
      }
    };

    const fetchUserReviews = async () => {
      try {
        const response = await api.getUserReviews(userId);
        setReviews(response.data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const response = await api.getCurrentUserProfile();
        setCurrentUser(response.data);
      } catch (err) {
        console.error('Error loading current user:', err);
      }
    };

    fetchUserProfile();
    fetchUserReviews();
    fetchCurrentUser();
  }, [userId]);

  const handleMakeAdmin = async () => {
    try {
      await api.updateAdmin(user.id, { is_admin: true });
      // update user state to reflect admin status
      setUser({ ...user, is_admin: true });
      setSuccess('User granted admin privileges.');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating admin status');
      setSuccess('');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>
        {user.username} {user.is_admin && (<span className="text-muted ms-2" style={{ fontSize: '1.1rem' }}>Admin</span>)}
      </h2>
      
      <div className="mb-4">
        {user.avatar_url && (
          <Image 
            src={user.avatar_url} 
            roundedCircle 
            width={150}
            height={150}
            alt={`${user.username}'s avatar`}
            className="mb-3"
          />
        )}
      </div>

      <div className="mb-4">
        <h4>Bio</h4>
        <p>{user.bio || 'No bio yet.'}</p>
      </div>

      { currentUser && currentUser.is_admin && !user.is_admin && (
        <div className="mb-3">
          <Button variant="primary" onClick={handleMakeAdmin}>
            Make Admin
          </Button>
        </div>
      )}

      { success && <Alert variant="success">{success}</Alert> }
      { error && <Alert variant="danger" className="mt-3">{error}</Alert> }

      <div className="mb-4">
        <h4>Reviews</h4>
        {reviews.length > 0 ? (
          <ReviewList reviews={reviews} onError={setError} profileView={true} />
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
}