import { createContext, useState, useEffect } from 'react';
import api from '../Api';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [userProfile, setUserProfile] = useState(null);

  const fetchProfile = async () => {
    try {
      const response = await api.getCurrentUserProfile();
      setUserProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetchProfile();
    }
  }, []);

  return (
    <UserContext.Provider value={{ userProfile, setUserProfile, fetchProfile }}>
      {children}
    </UserContext.Provider>
  );
}