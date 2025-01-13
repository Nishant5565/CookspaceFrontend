import axios from "axios";
export const API_URL = 'http://localhost:5000/api/';

export const ApiKey = "a9d409e7c5da49e7997d6fdf89f6d4a6"

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