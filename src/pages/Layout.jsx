import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '@/Components/Navbar/Navbar'
import Footer from '@/Components/Footer/Footer'
import ReactLenis, { useLenis } from '@studio-freight/react-lenis'

const Layout = () => {
  return (
    <ReactLenis root >
     <div>
       <Navbar />
       <div className=' px-2 '>
       <Outlet />

       </div>
       <Footer />
     </div>
     </ReactLenis>
  )
}

export default Layout