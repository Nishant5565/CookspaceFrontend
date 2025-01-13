import axios from "axios";
export const API_URL = import.meta.env.VITE_API_URL;

export const ApiKey = import.meta.env.VITE_API_KEY

export const RECIPE_API = "https://api.spoonacular.com/recipes/complexSearch?apiKey=" + ApiKey;
export const fetchApi = async (url, method, data) => {
     
     const token = localStorage.getItem('token');
     const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
     };
     try {
          const response = await axios({
               method,
               url: API_URL + url,
               data,
               headers
          });
          return response;
     } catch (error) {
     console.log("eror " + error.response);
     return error.response;
     }
};