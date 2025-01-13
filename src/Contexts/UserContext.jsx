import React, { createContext, useState, useEffect } from 'react';
import { fetchApi } from '@/Constant';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetchApi('check-auth', 'POST')
      if (response.status === 401){
        localStorage.removeItem('token');
        return setUser(null);
      }
      if (user === null) setUser(response.data);
    };
    const token = localStorage.getItem('token');

    if(token){
    checkAuth();
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};