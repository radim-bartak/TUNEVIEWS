import { useState, useEffect } from 'react';
import { Alert, Image, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import api from '../Api';
import ReviewList from '../components/ReviewList';
import FavouriteList from '../components/FavouriteList';

export default function Profile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

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

    const checkFollowing = async () => {
      try {
        const response = await api.checkFollowStatus(userId);
        setIsFollowing(response.data.isFollowing);
      } catch (err) {
        setIsFollowing(false);
      }
    };

    const fetchFollowerCount = async () => {
      try {
        const response = await api.getFollowerCount(userId);
        setFollowerCount(response.data.count);
      } catch (err) {
        setFollowerCount(0);
      }
    };

    fetchUserProfile();
    fetchUserReviews();
    fetchCurrentUser();
    checkFollowing();
    fetchFollowerCount();
  }, [userId]);

  const handleMakeAdmin = async () => {
    try {
      await api.updateAdmin(user.id, { is_admin: true });
      setUser({ ...user, is_admin: true });
      setSuccess('User granted admin privileges.');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating admin status');
      setSuccess('');
    }
  };

  const handleFollow = async () => {
    try {
      await api.followUser(user.id);
      setIsFollowing(true);
      setSuccess('You are now following this user.');
      setError('');
      setFollowerCount(followerCount + 1);
    } catch (err) {
      setError(err.response?.data?.error || 'Error following user');
      setSuccess('');
    }
  };

  const handleUnfollow = async () => {
    try {
      await api.unfollowUser(user.id);
      setIsFollowing(false);
      setSuccess('You have unfollowed this user.');
      setError('');
      setFollowerCount(followerCount > 0 ? followerCount - 1 : 0);
    } catch (err) {
      setError(err.response?.data?.error || 'Error unfollowing user');
      setSuccess('');
    }
  };

  if (!user) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
      <div className="spinner-border text-primary" role="status" aria-label="Loading">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
  
  return (
    <div className="container mt-4">
      <div className="section">
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div className="d-flex align-items-center">
            {user.avatar_url && (
              <Image 
                src={user.avatar_url} 
                roundedCircle 
                width={150}
                height={150}
                style={{ boxShadow: '0 3px 10px rgba(0,0,0,0.2)' }}
                alt={`${user.username}'s avatar`}
                className="me-3"
              />
            )}
            <h2 className="ms-2">
              {user.username} {user.is_admin ? (
                <span className="text-muted ms-2" style={{ fontSize: '1.1rem' }}>Admin</span>
              ) : null}
            </h2>
          </div>
          <div className="d-flex gap-2">
            {currentUser && currentUser.id !== user.id && (
              isFollowing ? (
                <Button variant="secondary" onClick={handleUnfollow}>Unfollow</Button>
              ) : (
                <Button variant="success" onClick={handleFollow}>Follow</Button>
              )
            )}
            {currentUser?.is_admin && !user.is_admin ? (
              <Button variant="primary" onClick={handleMakeAdmin}>Make Admin</Button>
            ) : null}
          </div>
        </div>

        { success && <Alert variant="success">{success}</Alert> }
        { error && <Alert variant="danger" className="mt-3">{error}</Alert> }

        <div className="mb-4">
          {followerCount} <strong>{followerCount === 1 ? 'Follower' : 'Followers'}</strong>
        </div>

        <div className="mb-2">
          <h4>Bio</h4>
          <p>{user.bio || 'No bio yet.'}</p>
        </div>
      </div>

      <div className="section">
        <h4 className="mb-2">Favourite Albums</h4>
        <FavouriteList userId={userId} />
      </div>

      <div className="section">
        <div className="mb-4">
          {reviews.length > 0 ? (
            <ReviewList reviews={reviews} onError={setError} profileView={true} />
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}