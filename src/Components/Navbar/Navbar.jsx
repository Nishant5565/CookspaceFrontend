import React, { useEffect, useState, useContext } from "react";
import Logo from "../../assets/Images/cookingLogo.png";
import { Link, useNavigate } from "react-router-dom";
import { fetchApi } from "@/Constant";
import { UserContext } from "@/Contexts/UserContext";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CiMenuBurger } from "react-icons/ci";

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="bg-black text-white py-4 px-1 md:px-10 flex justify-between items-center rounded-[20px] mx-2 my-1 ">
      <div className="flex items-center">
        <img src={Logo} alt="Logo" className="h-10 mr-3 brightness-[1000]" />
        <span className="md:text-2xl text-sm font-bold">Cookscape</span>
      </div>
      {isMobile ? (
        <Sheet>
          <SheetTrigger>
            <CiMenuBurger className="h-6 w-6 text-white mr-2 " />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-4 text-[16px] items-center h-full justify-around ">
          <div className="flex flex-col gap-10">
          <Link to="/" className="hover:text-gray-200 transition duration-300 p-2 ">
                Home
              </Link>
              <Link to="/recipes" className="hover:text-gray-200 transition duration-300 p-2">
                Recipes
              </Link>
              {user && (
                <Link to="/favourites" className="hover:text-gray-200 transition duration-300 p-2">
                  Favourites
                </Link>
              )}
          </div>
              {
                user && (
                  <div>
                    Hi {user?.userName}
              </div>
                )
              }

              {user ? (
                <div className="flex flex-col space-y-4 justify-center items-center">
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
                <Link to="/login" className="hover:text-gray-200 transition duration-300 border-2 py-2 px-4 rounded-[8px] ">
                  Login
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <div className="flex space-x-8 text-[13px]">
          <Link to="/" className="hover:text-gray-200 transition duration-300 p-2">
            Home
          </Link>
          <Link to="/recipes" className="hover:text-gray-200 transition duration-300 p-2">
            Recipes
          </Link>
          {user && (
            <Link to="/favourites" className="hover:text-gray-200 transition duration-300 p-2">
              Favourites
            </Link>
          )}
          {user ? (
            <div className="flex items-center space-x-4 ">
              <span>Hi {user.userName} !</span>
              <button
                className="bg-red-500 text-white px-3 py-2 rounded-lg "
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
            <Link to="/login" className="hover:text-gray-200 transition duration-300 border-2 py-2 px-4 rounded-[8px] ">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;