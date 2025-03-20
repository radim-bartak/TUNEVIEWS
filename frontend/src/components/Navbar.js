import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';

export default function Navigation() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token'); 

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">TUNEVIEWS</Navbar.Brand>
        <Nav className="me-auto">

        </Nav>
        {isLoggedIn ? (
          <Button variant="outline-light" as={Link} to="/profile">My Profile</Button>
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