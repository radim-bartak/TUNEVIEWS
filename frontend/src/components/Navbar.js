import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { Navbar, Container, Nav, Button, Image, Form, FormControl, ListGroup, Spinner } from 'react-bootstrap';
import { useContext, useState, useRef } from 'react';
import { UserContext } from '../context/UserContext';
import api from '../Api';
import logo from '../assets/logo2.png';

export default function Navigation() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token'); 
  const { userProfile } = useContext(UserContext);

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef();

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.length > 3) {
      setLoading(true);
      try {
        const res = await api.searchReleases(value);
        setSearchResults(res.data.slice(0, 5));
        setShowDropdown(true);
      } catch {
        setSearchResults([]);
        setShowDropdown(false);
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 150);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setShowDropdown(false);
    }
  };

  const handleResultClick = async (release) => {
    setSearch('');
    setShowDropdown(false);
  
    if (release.id) {
      navigate(`/release/${release.id}`);
      return;
    }
  
    try {
      const res = await api.autoSaveRelease({
        title: release.title || release.name,
        artist: release.artist,
        lastfm_id: release.lastfm_id || release.url,
        cover: release.cover_image_url || release.cover,
        release_date: release.release_date,
        genres: release.genres,
      });
      navigate(`/release/${res.data.id}`);
    } catch {
      navigate(`/release/${release.lastfm_id}`);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" style={{ position: 'relative', zIndex: 100 }}>
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img 
            src={logo} 
            alt="TuneViews Logo" 
            height="60" 
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Nav className="me-auto" />

        <div className="search-container">
        <Form className="search-form d-flex me-3" onSubmit={handleSearch} autoComplete="off">
          <span className="search-icon">
            <FaSearch />
          </span>
          <FormControl
              type="search"
              placeholder="Search releases..."
              className="search-input ps-5"
              value={search}
              onChange={handleSearchChange}
              onFocus={() => { if (search.length > 3 && searchResults.length > 0) setShowDropdown(true); }}
              onBlur={handleBlur}
              autoComplete="off"
            />
          </Form>

          {showDropdown && (
            <ListGroup
              ref={dropdownRef}
              className="search-dropdown"
            >
              {loading && (
                <ListGroup.Item className="dropdown-item">
                  <Spinner animation="border" size="sm" /> Loading...
                </ListGroup.Item>
              )}
              {!loading && searchResults.length === 0 && (
                <ListGroup.Item className="dropdown-item">No results</ListGroup.Item>
              )}
              {!loading && searchResults.map(release => (
                <ListGroup.Item
                  key={release.id || release.lastfm_id}
                  action
                  onMouseDown={() => handleResultClick(release)}
                  className="dropdown-item"
                >
                  <img
                    src={release.cover_image_url || release.cover}
                    alt={release.title || release.name}
                   />
                  <span>
                    <strong>{release.title || release.name}</strong>
                    <br />
                    <span style={{ fontSize: 13, color: '#bbb' }}>{release.artist}</span>
                  </span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>

        {isLoggedIn ? (
          userProfile && userProfile.avatar_url ? (
            <Link to="/profile">
              <Image 
                src={userProfile.avatar_url} 
                roundedCircle 
                width={50} 
                height={50}
                alt={`${userProfile.username}'s avatar`}
                className="border border-light p-1"
              />
            </Link>
          ) : (
            <Button variant="outline-light" as={Link} to="/profile">My Profile</Button>
          )
        ) : (
          <>
            <Button variant="outline-light" as={Link} to="/login">Login</Button>
            <Button variant="outline-light" as={Link} to="/register" className="ms-2">Register</Button>
          </>
        )}
      </Container>
    </Navbar>
  );
}