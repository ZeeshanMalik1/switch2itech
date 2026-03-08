<<<<<<< HEAD
import React, { useState } from 'react'
=======
import React from 'react'
>>>>>>> 2a59767ebc86eff8928b6b4231a5b60506f46768
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const Layout = () => {
<<<<<<< HEAD
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background overflow-hidden transition-colors duration-300">
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuClick={() => setMobileSidebarOpen((prev) => !prev)} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-1 sm:p-2 md:p-2 lg:p-2 bg-background">
=======
  return (
    <div className="flex h-screen bg-background overflow-hidden transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-10 bg-background">
>>>>>>> 2a59767ebc86eff8928b6b4231a5b60506f46768
          <Outlet />
        </main>
      </div>
    </div>
  )
}

<<<<<<< HEAD
export default Layout
=======
export default Layout
>>>>>>> 2a59767ebc86eff8928b6b4231a5b60506f46768
