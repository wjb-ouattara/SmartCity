import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Car,
  Wind,
  Volume2,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from 'lucide-react'

export default function Sidebar({ collapsed, toggleCollapse }) {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', badge: null },
    { icon: Car, label: 'Trafic', path: '/traffic', badge: null },
    { icon: Wind, label: 'Pollution', path: '/pollution', badge: 'Alerte' },
    { icon: Volume2, label: 'Bruit', path: '/noise', badge: null },
    { icon: Users, label: 'Signalements', path: '/reports', badge: '12' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics', badge: null },
    { icon: AlertTriangle, label: 'Alertes', path: '/alerts', badge: '7' },
    { icon: Settings, label: 'Paramètres', path: '/settings', badge: null },
  ]

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0, width: collapsed ? 80 : 256 }}
      exit={{ x: -300 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] glass border-r border-white/10 z-40"
    >
      <div className="flex flex-col h-full">
        
        <button
          onClick={toggleCollapse}
          className="absolute -right-3 top-6 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center hover:bg-cyan-600 transition-colors shadow-lg"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-white" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-white" />
          )}
        </button>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                  isActive 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              
              {!collapsed && (
                <>
                  <span className="flex-1 font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}

              {collapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {!collapsed && (
          <div className="p-4 border-t border-white/10">
            <div className="glass p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-xl">✓</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Système OK</p>
                  <p className="text-gray-400 text-xs">Tous services actifs</p>
                </div>
              </div>
              <div className="space-y-1 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Capteurs:</span>
                  <span className="text-green-400">125/125</span>
                </div>
                <div className="flex justify-between">
                  <span>Données/min:</span>
                  <span className="text-cyan-400">~2.5K</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  )
}