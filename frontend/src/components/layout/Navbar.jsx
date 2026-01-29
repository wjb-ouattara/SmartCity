import { motion } from 'framer-motion'
import { Menu, Search, Bell, Settings, User, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function Navbar({ toggleSidebar, sidebarOpen }) {
  const [notificationCount, setNotificationCount] = useState(3)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
    >
      <div className="flex items-center justify-between h-16 px-6">
        
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🌍</span>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">
                SmartCity
              </h1>
              <p className="text-xs text-gray-400">Casablanca</p>
            </div>
          </div>
        </div>

        <div className="hidden md:block flex-1 max-w-xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une zone, une rue..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Bell className="w-6 h-6 text-white" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {notificationCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-80 glass rounded-xl shadow-2xl border border-white/10 overflow-hidden"
              >
                <div className="p-4 border-b border-white/10">
                  <h3 className="font-semibold text-white">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto custom-scrollbar">
                  <NotificationItem
                    type="alert"
                    title="Alerte Pollution"
                    message="Niveau élevé détecté à Maarif"
                    time="Il y a 5 min"
                  />
                  <NotificationItem
                    type="traffic"
                    title="Embouteillage"
                    message="Trafic dense sur Bd Zerktouni"
                    time="Il y a 15 min"
                  />
                  <NotificationItem
                    type="info"
                    title="Nouveau signalement"
                    message="Un citoyen a signalé du bruit"
                    time="Il y a 1h"
                  />
                </div>
                <div className="p-3 border-t border-white/10 text-center">
                  <button className="text-cyan-400 text-sm hover:underline">
                    Voir toutes les notifications
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Settings className="w-6 h-6 text-white" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="hidden md:block text-white text-sm font-medium">Admin</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-56 glass rounded-xl shadow-2xl border border-white/10 overflow-hidden"
              >
                <div className="p-4 border-b border-white/10">
                  <p className="font-semibold text-white">Administrateur</p>
                  <p className="text-xs text-gray-400">admin@smartcity.ma</p>
                </div>
                <div className="p-2">
                  <ProfileMenuItem icon={User} text="Mon Profil" />
                  <ProfileMenuItem icon={Settings} text="Paramètres" />
                </div>
                <div className="p-2 border-t border-white/10">
                  <button className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    Déconnexion
                  </button>
                </div>
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </motion.nav>
  )
}

function NotificationItem({ type, title, message, time }) {
  const icons = {
    alert: '⚠️',
    traffic: '🚗',
    info: 'ℹ️',
  }

  return (
    <div className="p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icons[type]}</span>
        <div className="flex-1">
          <h4 className="font-semibold text-white text-sm">{title}</h4>
          <p className="text-gray-400 text-xs mt-1">{message}</p>
          <p className="text-gray-500 text-xs mt-2">{time}</p>
        </div>
      </div>
    </div>
  )
}

function ProfileMenuItem({ icon: Icon, text }) {
  return (
    <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-white/5 rounded-lg transition-colors">
      <Icon className="w-4 h-4" />
      <span className="text-sm">{text}</span>
    </button>
  )
}