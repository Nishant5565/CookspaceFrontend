import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { IoMdAdd } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ApiKey, fetchApi } from "@/Constant";
import { MdFavorite } from "react-icons/md";
import { UserContext } from "@/Contexts/UserContext";
import { MdFavoriteBorder } from "react-icons/md";
import { CiStar } from "react-icons/ci";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

const SpecificRecipes = () => {
  const { user, setUser } = useContext(UserContext);
  const favourites = user?.favourites;

  const { id } = useParams();
  const [specificRecipe, setSpecificRecipe] = useState(null);

  const fakeReviews = [
    {
      user: "John Doe",
      rating: 4.5,
      comment: "Amazing recipe! My family loved it.",
      date: "2025-01-12",
    },
    {
      user: "Jane Smith",
      rating: 5,
      comment: "Perfect for a quick dinner. Highly recommend!",
      date: "2025-01-10",
    },
    {
      user: "Mike Johnson",
      rating: 3.5,
      comment: "Good recipe, but a bit too spicy for my taste.",
      date: "2025-01-08",
    },
  ];

  const createFavorite = async (recipeId) => {
    try {
      const response = await fetchApi("createFavorite", "POST", {
        userId: user.id,
        recipeId,
      });
      if (response.status === 200) {
        toast.success("Recipe added to favorites");
        setUser((prevUser) => ({
          ...prevUser,
          favourites: [...prevUser.favourites, recipeId],
        }));
      }
    } catch (error) {
      toast.error("Error adding recipe to favorites");
    }
  };

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

  useEffect(() => {
    const getSpecificRecipe = async () => {
      try {
        const response = await axios.get(
          `https://api.spoonacular.com/recipes/${id}/information?apiKey=`+ApiKey
        );
        if (response.status === 200) {
          setSpecificRecipe(response.data);
        }
      } catch (error) {
        toast.error("Failed to fetch recipe. Please try again.");
      }
    };

    getSpecificRecipe();
  }, [id]);

  if (!specificRecipe) {
    return (
      <div className="text-center text-lg font-semibold text-gray-500">
        Loading...
      </div>
    );
  }

  const {
    title,
    image,
    readyInMinutes,
    servings,
    summary,
    extendedIngredients,
    instructions,
  } = specificRecipe;

  return (
    <div className="flex justify-center">
      <div className="max-w-4xl p-6 bg-gradient-to-r from-white to-gray-100 shadow-xl rounded-3xl space-y-8 relative">
        {user ? (
          <div className="flex absolute right-2">
            {favourites.includes(parseInt(id)) ? (
              <MdFavorite
                title="Remove from favorites"
                className="text-red-500 text-2xl cursor-pointer"
                onClick={() => removeFavorite(id)}
              />
            ) : (
              <MdFavoriteBorder
                title="Add to favorites"
                className="text-red-500 text-2xl cursor-pointer"
                onClick={() => createFavorite(id)}
              />
            )}
          </div>
        ) : (
          <Link to="/login" className="absolute right-2">
            <MdFavoriteBorder
              title="Add to favorites"
              className="text-red-500 text-2xl cursor-pointer"
            />
          </Link>
        )}

        <div className="flex flex-col items-center space-y-6">
          <img
            src={image}
            alt={title}
            className="rounded-2xl shadow-md max-h-80 w-full object-cover"
          />
          <h1 className="text-4xl font-bold text-gray-900 text-center">
            {title}
          </h1>
          <div className="text-gray-700 space-y-1 text-center">
            <p>
              <span className="font-medium">⏱ Ready in:</span> {readyInMinutes}{" "}
              minutes
            </p>
            <p>
              <span className="font-medium">🍴 Servings:</span> {servings}
            </p>
          </div>
          <p
            className="text-gray-600 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: summary }}
          ></p>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-semibold text-gray-800">🛒 Ingredients</h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {extendedIngredients.map((ingredient) => (
              <li
                key={ingredient.id}
                className="bg-gray-50 rounded-lg shadow-md p-4 text-gray-700 text-sm font-medium"
              >
                {ingredient.original}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-semibold text-gray-800">
            📋 Instructions
          </h2>
          <ol className="list-decimal pl-5 space-y-4 text-gray-700 text-sm leading-relaxed">
            {instructions ? (
              <span dangerouslySetInnerHTML={{ __html: instructions }} />
            ) : (
              "No instructions available."
            )}
          </ol>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-semibold text-gray-800">⭐ Reviews</h2>
          <div className="space-y-4">
            {fakeReviews.map((review, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg shadow-md p-4 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  {Array.from({ length: Math.floor(review.rating) }, (_, i) => (
                    <FaStar key={i} className="text-yellow-500 text-lg" />
                  ))}
                  {review.rating % 1 !== 0 && (
                    <FaStarHalfAlt className="text-yellow-500 text-lg" />
                  )}
                  <span className="text-gray-600 text-sm ml-2">
                    {review.rating}/5
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
                <p className="text-gray-500 text-xs">- {review.user}</p>
                <p className="text-gray-400 text-xs">{review.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecificRecipes;
