import axios from "axios";
export const API_URL = 'http://localhost:5000/api/';
export const RECIPE_API = "https://api.spoonacular.com/recipes/complexSearch?apiKey=98289306b4724db9a52139c46e3df32b";
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