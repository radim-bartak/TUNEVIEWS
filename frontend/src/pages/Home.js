import { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Alert, Spinner, ListGroup, InputGroup, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReleaseCard from '../components/ReleaseCard';
import ReviewList from '../components/ReviewList';
import api from '../Api';

export default function Home() {
  const [query, setQuery] = useState('');
  const [releases, setReleases] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [error, setError] = useState('');
  const [mostActiveUsers, setMostActiveUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [userSearch, setUserSearch] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [userSearchLoading, setUserSearchLoading] = useState(false);

  const [newestReleases, setNewestReleases] = useState([]);
  const [loadingNewest, setLoadingNewest] = useState(true);

  // Follow status for most active users
  const [followStatus, setFollowStatus] = useState({});

  // Fetch follow status for most active users
  useEffect(() => {
    const fetchFollowStatuses = async () => {
      if (mostActiveUsers.length === 0) return;
      const statuses = {};
      for (const user of mostActiveUsers) {
        try {
          const res = await api.checkFollowStatus(user.id);
          statuses[user.id] = res.data.isFollowing;
        } catch {
          statuses[user.id] = false;
        }
      }
      setFollowStatus(statuses);
    };
    fetchFollowStatuses();
  }, [mostActiveUsers]);

  const handleFollow = async (userId) => {
    try {
      await api.followUser(userId);
      setFollowStatus((prev) => ({ ...prev, [userId]: true }));
    } catch {}
  };

  const handleUnfollow = async (userId) => {
    try {
      await api.unfollowUser(userId);
      setFollowStatus((prev) => ({ ...prev, [userId]: false }));
    } catch {}
  };

  const searchReleases = async () => {
    if (!query) return;
    setReleases([]);
    try {
      const { data } = await api.searchReleases(query);
      setReleases(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const { data } = await api.getAllReviews();
        setAllReviews(data);
      } catch (err) {
        setError('Error loading reviews');
      }
    };
    fetchAllReviews();
  }, []);

  useEffect(() => {
    const fetchMostActiveUsers = async () => {
      setLoadingUsers(true);
      try {
        const { data } = await api.getMostActiveUsers();
        setMostActiveUsers(data);
      } catch (err) {
        setMostActiveUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchMostActiveUsers();
  }, []);

  useEffect(() => {
    const fetchNewest = async () => {
      setLoadingNewest(true);
      try {
        const { data } = await api.getNewestReleases();
        setNewestReleases(data);
      } catch {
        setNewestReleases([]);
      } finally {
        setLoadingNewest(false);
      }
    };
    fetchNewest();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (userSearch.length < 2) {
        setUserResults([]);
        return;
      }
      setUserSearchLoading(true);
      try {
        const { data } = await api.searchUsers(userSearch);
        setUserResults(data);
      } catch {
        setUserResults([]);
      } finally {
        setUserSearchLoading(false);
      }
    };
    const timeout = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timeout);
  }, [userSearch]);


  return (
    <div className="container mt-4">
      <div className="d-flex flex-column flex-md-row gap-4 mt-4">
        <section className="flex-fill">
          <div className="section">
            <h1 className="mt-2">Music Search</h1>
            <Form onSubmit={(e) => { e.preventDefault(); searchReleases(); }}>
              <Form.Control
                type="text"
                placeholder="Search for artists, albums, singles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="home-search"
              />
              <Button className="mt-3" onClick={searchReleases}>Search</Button>
            </Form>
            <Row className="mt-4">
              {releases.slice(0, 9).map((release, index) => (
                <Col md={4} key={release.lastfm_id || `${release.name}-${index}`}>
                  <ReleaseCard release={release} />
                </Col>
              ))}
            </Row>
          </div>
          <div className="section mt-4">
            {error && <Alert variant="danger">{error}</Alert>}
            {allReviews.length > 0 ? (
              <ReviewList reviews={allReviews} onError={setError} profileView={true} recent={true} />
            ) : (
              <p>No new reviews.</p>
            )}
          </div>
        </section>

        <div className="container">
        <div className="section" style={{ minWidth: '300px', height: 'fit-content' }}>
            <h4 className="mb-3">Recently Visited Music</h4>
            {loadingNewest ? (
              <Spinner animation="border" />
            ) : (
              <div className="d-grid grid-3x2" style={{ width: '100%' }}>
                {newestReleases.length === 0 && (
                  <div className="text-muted">No releases yet.</div>
                )}
                {newestReleases.map((release) => (
                  <Link
                  to={`/release/${release.id}`}
                  key={release.id}
                  style={{ display: 'inline-block', marginRight: 16, textAlign: 'center', textDecoration: 'none', color: 'inherit' }}
                >
                  <Image
                    src={release.cover_image_url || release.cover}
                    alt={release.title || release.name}
                    rounded
                    style={{ width: 100, height: 100, objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                  />
                  <div style={{ maxWidth: 100, fontSize: 14, marginTop: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {release.title || release.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    {release.artist}
                  </div>
                </Link>
                ))}
              </div>
            )}
          </div>

          <div className="section" style={{ minWidth: '300px', height: 'fit-content' }}>
            <h4 className="mb-3">Most Active Users</h4>
            {loadingUsers ? (
              <Spinner animation="border" />
            ) : (
              <ListGroup>
                {mostActiveUsers.length === 0 && (
                  <ListGroup.Item>No active users yet.</ListGroup.Item>
                )}
                {mostActiveUsers.slice(0, 6).map((user) => (
                  <ListGroup.Item key={user.id} className="d-flex align-items-center justify-content-between">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Link to={`/user/${user.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 12 }}>
                        {user.avatar_url && (
                          <img
                            src={user.avatar_url}
                            alt={user.username}
                            width={50}
                            height={50}
                            style={{
                              borderRadius: '50%',
                              objectFit: 'cover',
                              boxShadow: '0 0 6px rgba(0,0,0,0.2)'
                            }}
                          />
                        )}
                        <span style={{ fontWeight: 600 }}>{user.username}</span>
                      </Link>
                    </div>
                    {followStatus[user.id] ? (
                      <Button size="sm" variant="secondary" onClick={() => handleUnfollow(user.id)}>
                        Unfollow
                      </Button>
                    ) : (
                      <Button size="sm" variant="success" onClick={() => handleFollow(user.id)}>
                        Follow
                      </Button>
                    )}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>

          <div className="section" style={{ minWidth: '300px', height: 'fit-content' }}>
            <h4 className="mb-3">User Search</h4>
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                placeholder="Search users by name..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                autoComplete="off"
                className="home-search"
              />
            </InputGroup>
            {userSearchLoading && <Spinner animation="border" size="sm" />}
            {!userSearchLoading && userSearch.length > 1 && (
              <ListGroup>
                {userResults.length === 0 && (
                  <ListGroup.Item>No users found.</ListGroup.Item>
                )}
                {userResults.map(user => (
                  <ListGroup.Item key={user.id}>
                    <a href={`/user/${user.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 10 }}>
                      {user.avatar_url && (
                        <img
                          src={user.avatar_url}
                          alt={user.username}
                          width={36}
                          height={36}
                          style={{ borderRadius: '50%', objectFit: 'cover' }}
                        />
                      )}
                      <span style={{ fontWeight: 600 }}>{user.username}</span>
                    </a>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}