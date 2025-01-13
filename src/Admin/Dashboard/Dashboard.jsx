import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "@/Contexts/UserContext";
import PackageList from "./PackageList";
import Analytics from "./Analytics";
import Pagination from "./Pagination";
import SearchFilter from "./SearchFilter";
import { fetchApi } from "@/Constant";
import { useNavigate } from "react-router-dom";
import AddPackage from "./AddPackage";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [packages, setPackages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchPackages = async () => {
    const response = await fetchApi("api/packages", "GET");
    setPackages(response.data);
  };

  useEffect(() => {

    fetchPackages();
  }, []);

  useEffect(() => {
     const token = localStorage.getItem("token");
    if (token) {
      if (user?.role == "Customer") {
        navigate("/");
      }
      return;
    }
     navigate("/employer/login");
  }, [user]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredPackages = packages.filter((pkg) =>
    pkg.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container rounded-[20px] overflow-hidden min-h-screen border-2">
      <div className=" flex justify-between items-center bg-gradient-to-r from-[#181818] to-[#000000] mb-6 p-6 rounded-t-[10px]">
      <h2 className="text-2xl text-white">Welcome, {user?.userName}!</h2>
      <h1 className="text-2xl  text-white">Admin Panel</h1>
      </div>
      <div className=" p-4">
      <AddPackage fetchPackages={fetchPackages} />
      {packages.length > 0 && (
        <>
          <SearchFilter onSearch={handleSearch} />
          <PackageList packages={filteredPackages} fetchPackages = {fetchPackages} />
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={filteredPackages.length}
          />
          <Analytics />
        </>
      )}
      </div>
    </div>
  );
};

export default Dashboard;
