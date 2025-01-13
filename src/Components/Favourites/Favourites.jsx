import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '@/Contexts/UserContext';
import axios from 'axios';
import { ApiKey, fetchApi } from '@/Constant';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';

const Favourites = () => {
  const [Recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useContext(UserContext);
  const favourites = user?.favourites;

  useEffect(() => {
    const getFavouriteRecipes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://api.spoonacular.com/recipes/informationBulk?apiKey=${ApiKey}&ids=${favourites.join(',')}`);
        if (response.status === 200) {
          setRecipes(response.data);
          setFilteredRecipes(response.data);
        }
      } catch (error) {
        toast.error("Failed to fetch favourite recipes. Please try again.");
      }
      setLoading(false);
    };
    if (favourites?.length) {
      getFavouriteRecipes();
    }
  }, [favourites]);

  const removeFavorite = async (recipeId) => {
    try {
      const response = await fetchApi("removeFavorite", "POST", {
        userId: user.id,
        recipeId,
      });
      if (response.status === 200) {
        toast.success("Recipe removed from favorites");
        setUser((prevUser) => ({
          ...prevUser,
          favourites: prevUser.favourites.filter((id) => id !== recipeId),
        }));
      }
    } catch (error) {
      toast.error("Error removing recipe from favorites");
    }
  };

  return (
    <div className="container mx-auto md:px-4 px-0 py-8">
      <h1 className="text-3xl font-bold mb-6">Favourite Recipes</h1>
      <div className="flex flex-wrap gap-2 justify-center mt-20">
        {loading ? (
          Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="border p-4 rounded-lg md:w-60 w-44">
              <Skeleton className="w-full md:h-48 h-40 object-cover rounded-lg" />
              <Skeleton className="h-16 mt-4" />
            </div>
          ))
        ) : (
          filteredRecipes.map((pkg) => (
            <div key={pkg.id} className="border p-4 rounded-lg md:w-60 w-44 relative">
              <>
                <MdFavorite
                  className="absolute top-2 right-2 text-red-500 cursor-pointer"
                  size={24}
                  onClick={() => removeFavorite(pkg.id)}
                />
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full md:h-48 h-40 object-cover rounded-lg"
                />
                <Link to={`/recipe/${pkg.id}`}>
                  <h2 className="text-sm text-wrap font-bold mt-4">
                    {pkg?.title}
                  </h2>
                </Link>
              </>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Favourites;