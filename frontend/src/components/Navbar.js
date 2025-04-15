import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, Button, Image } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import api from '../Api';
import logo from '../assets/logo2.png';

export default function Navigation() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token'); 
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchCurrentUserProfile = async () => {
      try {
        const response = await api.getCurrentUserProfile();
        setUserProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (isLoggedIn) {
      fetchCurrentUserProfile();
    }
  }, [isLoggedIn]);

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
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