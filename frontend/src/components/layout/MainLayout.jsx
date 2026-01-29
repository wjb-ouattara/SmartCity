import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'
import { motion, AnimatePresence } from 'framer-motion'

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const toggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="min-h-screen relative">
      {/* Navbar */}
      <Navbar 
        toggleSidebar={toggleSidebar} 
        sidebarOpen={sidebarOpen}
      />

      {/* Container principal avec sidebar */}
      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <Sidebar 
              collapsed={sidebarCollapsed}
              toggleCollapse={toggleCollapse}
            />
          )}
        </AnimatePresence>

        {/* Zone de contenu - avec padding adaptatif */}
        <motion.main
          layout
          className={`
            flex-1 pt-20 pb-8 px-6 transition-all duration-300
            ${sidebarOpen && !sidebarCollapsed ? 'ml-64' : sidebarOpen ? 'ml-20' : 'ml-0'}
          `}
        >
          {/* Container avec max-width pour éviter que le contenu soit trop étiré */}
          <div className="max-w-[1920px] mx-auto">
            <Outlet />
          </div>
          
          <Footer />
        </motion.main>
      </div>
    </div>
  )
}