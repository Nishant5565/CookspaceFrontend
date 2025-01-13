import React, { useEffect, useState, useContext } from "react";
import Logo from "../../assets/Images/cookingLogo.png";
import { Link, useNavigate } from "react-router-dom";
import { fetchApi } from "@/Constant";
import { UserContext } from "@/Contexts/UserContext";
const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <nav className="bg-black text-white py-4 px-1 md:px-10 flex justify-between items-center rounded-[20px] mx-2 my-1">
      <div className="flex items-center">
        <img src={Logo} alt="Logo" className="h-10 mr-3 brightness-[1000]" />
        <span className="md:text-2xl text-sm font-bold">Cookscape</span>
      </div>
      <div className="flex space-x-8 text-[13px]">
        {window.location.pathname === "/" ? (
          <Link
            to="/recipes"
            className="hover:text-gray-200 transition duration-300 p-2"
          >
            Recipes
          </Link>
        ) : (
          <Link
            to="/"
            className="hover:text-gray-200 transition duration-300 p-2"
          >
            Home
          </Link>
        )}

        {user ? (
          <div className="flex items-center space-x-4">
            <span>Hi {user.userName} !</span>
            <button
              className="bg-red-500 text-white px-3 py-2 rounded-lg"
              onClick={() => {
                localStorage.removeItem("token");
                setUser(null);
                navigate("/");
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="hover:text-gray-200 transition duration-300 border-2 py-2 px-4 rounded-[8px]"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
