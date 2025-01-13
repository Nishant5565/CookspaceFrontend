import React from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '@/Contexts/UserContext';
import { useContext } from 'react';
const Footer = () => {
  const { user, setUser } = useContext(UserContext);
  return (
    <footer className={`py-10 mt-6 text-center flex flex-col justify-between h-40 md:flex-row md:justify-center gap-2 md:items-center  text-[12px] mx-2 rounded-[20px] mb-4 text-white bg-black `}>
     
        <p>© 2023 - 2024</p>
        <p>Cookscape® Global Inc.</p>
        <p>Privacy Policy</p>
        
        {!user &&
        <Link to="/login" className="hover:text-gray-200 transition duration-300 p-2 hover:underline">Login</Link>}
    </footer>
  );
}

export default Footer;