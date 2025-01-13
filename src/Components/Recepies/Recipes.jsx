import React, { useEffect, useState, useCallback } from "react";
import { fetchApi } from "@/Constant";
import { Link } from "react-router-dom";
import { RECIPE_API } from "@/Constant";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CiSearch } from "react-icons/ci";
import debounce from "lodash.debounce";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {toast} from 'sonner';

const Recipes = () => {
  const [Recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [RecipesPerPage, setRecipesPerPage] = useState(12);
  const [searchMode, setSearchMode] = useState("name");
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRecipe = async () => {
      setLoading(true);
      const response = await axios.get(
        `${RECIPE_API}&number=${RecipesPerPage}&offset=${currentPage * RecipesPerPage}`
      );
      if (response.status === 200) {
        setRecipes(response.data?.results);
        setFilteredRecipes(response.data?.results);
        setTotalResults(response.data?.totalResults);
      }
      setLoading(false);
    };

    getRecipe();
  }, [RecipesPerPage, currentPage]);

  const searchRecipes = useCallback(
    debounce(async (term, mode, page = 0) => {
      setLoading(true);
      let response;
      if (mode === "name") {
        response = await axios.get(`${RECIPE_API}&query=${term}&number=${RecipesPerPage}&offset=${page * RecipesPerPage}`);

        if (response.data?.results.length === 0) {
          toast.error("No recipes found" , {description: "Please enter valid recipe name, make sure to check the spelling"});
        }

      } else {
        response = await axios.get(`${RECIPE_API}&ingredients=${term}&number=${RecipesPerPage}&offset=${page * RecipesPerPage}`);

        if (response.data?.results.length === 0) {
          toast.error("No recipes found" , {description: "Please enter valid ingredients, make sure to check the spelling"});
      }
    }
      if (response.status === 200) {
        setFilteredRecipes(response.data?.results);
        setTotalResults(response.data?.totalResults);
      }
      setLoading(false);
    }, 300),
    [RecipesPerPage]
  );

  useEffect(() => {
    if (searchTerm) {
      searchRecipes(searchTerm, searchMode, currentPage);
    } else {
      setFilteredRecipes(Recipes);
    }
  }, [searchTerm, searchMode, Recipes, searchRecipes, currentPage]);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, searchMode]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const totalPage = Math.ceil(totalResults / RecipesPerPage);
  const maxPagesToShow = 5;
  const startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPage, startPage + maxPagesToShow);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto md:px-4 px-0 py-8">
      <h1 className="text-3xl font-bold mb-6">Recipes</h1>
      <div className="mb-4 flex justify-between ">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Recipes..."
            value={searchTerm}
            className="border p-2 rounded-lg w-80 "
            onChange={handleSearchChange}
          />
          <CiSearch
            className={`absolute top-2 right-4 cursor-pointer ${
              searchTerm?.length > 0
                ? " scale-110 text-black transition-all duration-300"
                : " text-gray-400 transition-all duration-300"
            }`}
            size={24}
          />
          <div className="absolute top-12 left-0 bg-white border rounded-lg w-80 flex overflow-hidden">
            <div
              className={`p-2 w-1/2 cursor-pointer ${
                searchMode === "name" ? "bg-black text-white" : ""
              }`}
              onClick={() => setSearchMode("name")}
            >
              By Name
            </div>
            <div
              className={`p-2 cursor-pointer w-1/2  ${
                searchMode === "ingredients" ? "bg-black text-white" : ""
              }`}
              onClick={() => setSearchMode("ingredients")}
            >
              By Ingredients
            </div>
          </div>
        </div>
        <Select onValueChange={(value) => setRecipesPerPage(value)}>
          <SelectTrigger className="border p-2 rounded-lg w-60">
            <SelectValue placeholder="No. of Recipes" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Number</SelectLabel>
              <SelectItem value="18">18</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="30">30</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mt-20">
        {loading ? (
          Array.from({ length: RecipesPerPage }).map((_, index) => (
            <div key={index} className="border p-4 rounded-lg md:w-60 w-44">
              <Skeleton className="w-full md:h-48 h-40 object-cover rounded-lg" />
              <Skeleton className="h-6 mt-4" />
            </div>
          ))
        ) : (
          filteredRecipes.map((pkg) => (
            <div key={pkg.id} className="border p-4 rounded-lg md:w-60 w-44">
              <Link to={`/recipes/${pkg.id}`}>
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full md:h-48 h-40 object-cover rounded-lg"
                />
                <h2 className="text-sm text-wrap font-bold mt-4">
                  {pkg?.title}
                </h2>
              </Link>
            </div>
          ))
        )}
      </div>

      <div className="mt-8">
        <Pagination>
          <PaginationPrevious
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </PaginationPrevious>
          <PaginationContent>
            {Array.from({ length: endPage - startPage }).map((_, index) => {
              const pageNumber = startPage + index;
              return (
                <PaginationItem
                  key={pageNumber}
                  onClick={() => paginate(pageNumber)}
                  className={`${ pageNumber === currentPage ? "bg-black hover:bg-black text-white " : ""} rounded-lg`}
                >

                  <PaginationLink
                    className={`${ pageNumber === currentPage ? "bg-black hover:bg-black text-white" : ""} cursor-pointer`}
                  >{pageNumber + 1}</PaginationLink>
                </PaginationItem>
              );
            })}

            {totalPage > maxPagesToShow && endPage < totalPage && (
              <PaginationEllipsis>
                <span>...</span>
              </PaginationEllipsis>
            )}
          </PaginationContent>
          <PaginationNext
            disabled={currentPage === totalPage - 1}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </PaginationNext>
        </Pagination>
      </div>
    </div>
  );
};

export default Recipes;