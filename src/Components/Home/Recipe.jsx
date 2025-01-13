import React , {useContext} from "react";
import { Link } from "react-router-dom";
import { UserContext } from "@/Contexts/UserContext";

const Recipe = ({ recipe }) => {

     const { user, setUser } = useContext(UserContext);

  return (
    <div>
      <div className="card-hover">
        <div className="card-hover__content">
          <h3 className="card-hover__title">
            Make your <span>choice</span> right now!
          </h3>
          <p className="card-hover__text">
               {recipe?.title}
          </p>
          <a href="#" className="card-hover__link">
            <span>
               <Link to={
                    user ? `/recipe/${recipe.id}` : '/login'
               }>
               Learn Recipe</Link>
            </span>
            <svg    
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </a>
        </div>
        <div className="card-hover__extra">
          <h4>
          </h4>
        </div>
        <img
          src={recipe.image}
          alt=""
        />
      </div>
    </div>
  );
};

export default Recipe;
