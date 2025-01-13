import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import About from './pages/About'
import { Login, Signup } from './Components/Auth/Auth'; 
import { Toaster } from "@/components/ui/sonner"
import Layout from './pages/Layout'
import Recipes from './Components/Recepies/Recipes'
import SpecificRecipes from './Components/Recepies/SpecificRecipes'
import Favourites from './Components/Favourites/Favourites'

function App() {

  return (

    <Router>
      <Toaster />
      <Routes>
        <Route element={<Layout />} >
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipe/:id" element={<SpecificRecipes />} />
        <Route path="/favourites" element={<Favourites />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
