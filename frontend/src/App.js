import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import ReleaseDetail from './pages/ReleaseDetail';
import MyProfile from './pages/MyProfile';
import Register from './pages/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import EditProfile from './pages/EditProfile';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/release/:mbid" element={<ReleaseDetail />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/user/:userId" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;