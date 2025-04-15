import './App.css';
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
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/release/:lastfm_id" element={<ReleaseDetail />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/user/:userId" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;