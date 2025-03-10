import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';

export default function Navigation() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">TUNEVIEWS</Navbar.Brand>
        <Nav className="me-auto">
          {isLoggedIn && <Nav.Link as={Link} to="/profile">Profil</Nav.Link>}
        </Nav>
        {isLoggedIn ? (
          <Button variant="outline-light" onClick={handleLogout}>Odhlásit</Button>
        ) : (
          <>
            <Button variant="outline-light" as={Link} to="/login">Přihlásit</Button>
            <Button variant="outline-light" as={Link} to="/register" className="ms-2">Registrovat</Button>
          </>
        )}
      </Container>
    </Navbar>
  );
}