import { useState, useEffect } from 'react'
import { Activity, Wind, Volume2, AlertTriangle, TrendingUp, Users } from 'lucide-react'
import MetricCard from '../components/cards/MetricCard'
import OverviewMap from '../components/maps/OverviewMap'
import AlertsList from '../components/alerts/AlertsList'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Simuler le chargement initial
    setLoading(true)
    setTimeout(() => setLoading(false), 500)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner w-16 h-16 mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement du dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="gradient-text">Surveillance Urbaine</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Casablanca • Temps réel • {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 glass rounded-xl border border-green-500/20">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400 font-semibold">Système Actif</span>
            </div>
            <button className="btn-secondary">
              <TrendingUp className="w-5 h-5 inline mr-2" />
              Rapport
            </button>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards Section */}
      <section className="section">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Trafic"
            value="Dense"
            metric="35 km/h"
            change="-12%"
            icon={Activity}
            color="yellow"
          />
          <MetricCard
            title="Pollution"
            value="Modérée"
            metric="AQI 78"
            change="+5%"
            icon={Wind}
            color="orange"
          />
          <MetricCard
            title="Bruit"
            value="Élevé"
            metric="82 dB"
            change="+8%"
            icon={Volume2}
            color="red"
          />
          <MetricCard
            title="Signalements"
            value="12"
            metric="nouveaux"
            change="+3"
            icon={Users}
            color="cyan"
          />
        </div>
      </section>

      {/* Main Content Section - Carte + Alertes */}
      <section className="section">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Carte - 2/3 de l'espace */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <OverviewMap />
            </motion.div>
          </div>

          {/* Alertes - 1/3 de l'espace */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <AlertsList />
            </motion.div> 
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Activité récente */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-6 border border-slate-700/50"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Activité Récente</h3>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            
            <div className="space-y-4">
              {[
                { type: 'success', icon: '✓', text: 'Capteur #125 - Maarif : Données reçues', time: '2s' },
                { type: 'warning', icon: '⚠', text: 'Pollution élevée détectée à Anfa', time: '15s' },
                { type: 'info', icon: 'ℹ', text: 'Nouveau signalement citoyen - Bruit', time: '1m' },
                { type: 'success', icon: '✓', text: 'Capteur #87 - Ain Diab : Données reçues', time: '2m' },
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
                >
                  <span className={`
                    flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                    ${item.type === 'success' ? 'bg-green-500/10 text-green-400' :
                      item.type === 'warning' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-cyan-500/10 text-cyan-400'}
                  `}>
                    {item.icon}
                  </span>
                  <span className="flex-1 text-sm text-gray-300">{item.text}</span>
                  <span className="text-xs text-gray-500">Il y a {item.time}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Zones critiques */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl p-6 border border-slate-700/50"
          >
            <h3 className="text-xl font-bold text-white mb-6">Zones Critiques</h3>
            
            <div className="space-y-4">
              {[
                { zone: 'Maarif', score: 85, color: 'red', issues: ['Trafic dense', 'Pollution'] },
                { zone: 'Anfa', score: 65, color: 'orange', issues: ['Bruit élevé'] },
                { zone: 'Ain Diab', score: 45, color: 'yellow', issues: ['Trafic modéré'] },
                { zone: 'Bourgogne', score: 25, color: 'green', issues: [] },
              ].map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-white font-semibold">{item.zone}</span>
                      {item.issues.length > 0 && (
                        <div className="flex gap-1">
                          {item.issues.map((issue, i) => (
                            <span key={i} className="badge badge-warning text-xs">
                              {issue}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className={`
                      text-sm font-bold
                      ${item.color === 'red' ? 'text-red-400' :
                        item.color === 'orange' ? 'text-orange-400' :
                        item.color === 'yellow' ? 'text-yellow-400' :
                        'text-green-400'}
                    `}>
                      {item.score}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        item.color === 'red' ? 'bg-red-500' :
                        item.color === 'orange' ? 'bg-orange-500' :
                        item.color === 'yellow' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}