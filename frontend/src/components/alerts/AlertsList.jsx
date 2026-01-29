import { motion } from 'framer-motion'
import { AlertTriangle, Wind, Volume2, Car, X } from 'lucide-react'
import { useState } from 'react'

export default function AlertsList() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'pollution',
      severity: 'high',
      title: 'Pollution Élevée',
      location: 'Maarif',
      message: 'AQI dépassant 120',
      time: 'Il y a 5 min',
      icon: Wind
    },
    {
      id: 2,
      type: 'noise',
      severity: 'medium',
      title: 'Bruit Excessif',
      location: 'Anfa',
      message: '85 dB détectés',
      time: 'Il y a 15 min',
      icon: Volume2
    },
    {
      id: 3,
      type: 'traffic',
      severity: 'high',
      title: 'Embouteillage',
      location: 'Boulevard Zerktouni',
      message: 'Trafic très dense',
      time: 'Il y a 30 min',
      icon: Car
    }
  ])

  const dismissAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id))
  }

  const getSeverityStyles = (severity) => {
    const styles = {
      high: {
        border: 'border-red-500/30',
        bg: 'bg-red-500/5',
        icon: 'bg-red-500/10 text-red-400',
        badge: 'bg-red-500 text-white'
      },
      medium: {
        border: 'border-orange-500/30',
        bg: 'bg-orange-500/5',
        icon: 'bg-orange-500/10 text-orange-400',
        badge: 'bg-orange-500 text-white'
      },
      low: {
        border: 'border-yellow-500/30',
        bg: 'bg-yellow-500/5',
        icon: 'bg-yellow-500/10 text-yellow-400',
        badge: 'bg-yellow-500 text-white'
      }
    }
    return styles[severity] || styles.medium
  }

  return (
    <div className="glass rounded-2xl p-6 border border-slate-700/50 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/10 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Alertes Actives</h3>
            <p className="text-sm text-gray-400">Notifications en temps réel</p>
          </div>
        </div>
        
        <span className="px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-full animate-pulse">
          {alerts.length}
        </span>
      </div>

      {/* Liste des alertes */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <p className="text-gray-400">Aucune alerte active</p>
          </div>
        ) : (
          alerts.map((alert, index) => {
            const styles = getSeverityStyles(alert.severity)
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  relative p-4 rounded-xl border 
                  ${styles.border} ${styles.bg}
                  hover:bg-slate-800/30 transition-all
                  group
                `}
              >
                {/* Badge de sévérité */}
                <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold ${styles.badge}`}>
                  {alert.severity === 'high' ? 'URGENT' : alert.severity === 'medium' ? 'MOYEN' : 'FAIBLE'}
                </div>

                {/* Bouton de suppression */}
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="absolute bottom-2 right-2 p-1.5 bg-slate-800/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-700"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>

                {/* Contenu */}
                <div className="flex items-start gap-3 pr-16">
                  <div className={`p-2.5 rounded-xl ${styles.icon} flex-shrink-0`}>
                    <alert.icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-sm mb-1 truncate">
                      {alert.title}
                    </h4>
                    <p className="text-xs text-gray-400 mb-2">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        📍 {alert.location}
                      </span>
                      <span className="flex items-center gap-1">
                        🕐 {alert.time}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Footer */}
      {alerts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <button className="w-full py-2.5 text-cyan-400 hover:bg-cyan-500/10 rounded-xl transition-colors text-sm font-semibold">
            Voir toutes les alertes →
          </button>
        </div>
      )}
    </div>
  )
}