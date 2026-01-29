import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Bell, CheckCircle, XCircle, Clock, MapPin, Activity, Filter, Download, Archive } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

export default function AlertsView() {
  const [filterSeverity, setFilterSeverity] = useState('all')
  const [filterStatus, setFilterStatus] = useState('active')
  const [filterType, setFilterType] = useState('all')

  // Mock data
  const alerts = [
    {
      id: 1,
      title: 'Pollution PM2.5 Critique',
      type: 'pollution',
      severity: 'critical',
      status: 'active',
      zone: 'Maarif',
      value: 125,
      threshold: 100,
      unit: 'µg/m³',
      timestamp: '2026-01-18T14:30:00',
      duration: '2h 30min',
      affected: 15000,
      actions: ['Notification envoyée', 'Équipe mobilisée']
    },
    {
      id: 2,
      title: 'Embouteillage Majeur',
      type: 'traffic',
      severity: 'high',
      status: 'active',
      zone: 'Boulevard Zerktouni',
      value: 12,
      threshold: 40,
      unit: 'km/h',
      timestamp: '2026-01-18T13:45:00',
      duration: '3h 15min',
      affected: 5000,
      actions: ['Signalisation modifiée', 'Police informée']
    },
    {
      id: 3,
      title: 'Bruit Nocturne Excessif',
      type: 'noise',
      severity: 'medium',
      status: 'active',
      zone: 'Ain Diab',
      value: 92,
      threshold: 85,
      unit: 'dB',
      timestamp: '2026-01-18T12:00:00',
      duration: '5h',
      affected: 3000,
      actions: ['Inspection programmée']
    },
    {
      id: 4,
      title: 'Pollution CO2 Élevée',
      type: 'pollution',
      severity: 'high',
      status: 'resolved',
      zone: 'Hay Hassani',
      value: 650,
      threshold: 500,
      unit: 'ppm',
      timestamp: '2026-01-18T10:00:00',
      duration: '4h',
      affected: 8000,
      actions: ['Source identifiée', 'Problème résolu']
    },
    {
      id: 5,
      title: 'Trafic Dense Zone Commerciale',
      type: 'traffic',
      severity: 'medium',
      status: 'acknowledged',
      zone: 'Anfa',
      value: 25,
      threshold: 40,
      unit: 'km/h',
      timestamp: '2026-01-18T09:30:00',
      duration: '6h 30min',
      affected: 4500,
      actions: ['En surveillance']
    },
  ]

  const alertStats = {
    total: alerts.length,
    active: alerts.filter(a => a.status === 'active').length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
  }

  const hourlyAlerts = [
    { hour: '00h', count: 2 },
    { hour: '04h', count: 1 },
    { hour: '08h', count: 5 },
    { hour: '12h', count: 8 },
    { hour: '16h', count: 12 },
    { hour: '20h', count: 6 },
  ]

  const alertsByType = [
    { type: 'Pollution', count: 35 },
    { type: 'Trafic', count: 28 },
    { type: 'Bruit', count: 18 },
    { type: 'Autre', count: 5 },
  ]

  const getSeverityConfig = (severity) => {
    const configs = {
      critical: {
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        icon: '🔴',
        label: 'Critique'
      },
      high: {
        color: 'text-orange-400',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/30',
        icon: '🟠',
        label: 'Élevé'
      },
      medium: {
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30',
        icon: '🟡',
        label: 'Moyen'
      },
      low: {
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        border: 'border-green-500/30',
        icon: '🟢',
        label: 'Faible'
      }
    }
    return configs[severity] || configs.medium
  }

  const getStatusConfig = (status) => {
    const configs = {
      active: { color: 'text-red-400', icon: AlertTriangle, label: 'Active' },
      acknowledged: { color: 'text-yellow-400', icon: Clock, label: 'Prise en compte' },
      resolved: { color: 'text-green-400', icon: CheckCircle, label: 'Résolue' },
      dismissed: { color: 'text-gray-400', icon: XCircle, label: 'Ignorée' }
    }
    return configs[status] || configs.active
  }

  const getTypeIcon = (type) => {
    const icons = {
      pollution: '🌫️',
      traffic: '🚗',
      noise: '🔊',
      other: '⚠️'
    }
    return icons[type] || icons.other
  }

  const filteredAlerts = alerts.filter(alert => {
    const matchSeverity = filterSeverity === 'all' || alert.severity === filterSeverity
    const matchStatus = filterStatus === 'all' || alert.status === filterStatus
    const matchType = filterType === 'all' || alert.type === filterType
    return matchSeverity && matchStatus && matchType
  })

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = Math.floor((now - date) / 1000 / 60)
    if (diff < 60) return `Il y a ${diff} min`
    if (diff < 1440) return `Il y a ${Math.floor(diff / 60)}h`
    return `Il y a ${Math.floor(diff / 1440)}j`
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="gradient-text">Centre d'Alertes</span>
            </h1>
            <p className="text-gray-400 text-lg">Gestion et suivi des alertes en temps réel</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="btn-secondary">
              <Archive className="w-5 h-5 inline mr-2" />
              Archiver
            </button>
            <button className="btn-secondary">
              <Download className="w-5 h-5 inline mr-2" />
              Exporter
            </button>
          </div>
        </div>
      </motion.div>

      {/* Statistics */}
      <section className="section">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 border border-slate-700/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-cyan-500/10 rounded-xl">
                <Bell className="w-6 h-6 text-cyan-400" />
              </div>
              <span className="text-xs text-gray-400">Aujourd'hui</span>
            </div>
            <h3 className="text-gray-400 text-sm mb-2">Total Alertes</h3>
            <p className="text-4xl font-bold text-white">{alertStats.total}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6 border border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/10 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-gray-400 text-sm mb-2">Actives</h3>
            <p className="text-4xl font-bold text-white">{alertStats.active}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6 border border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <Activity className="w-6 h-6 text-red-400" />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-2">Critiques</h3>
            <p className="text-4xl font-bold text-white">{alertStats.critical}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6 border border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-2">Résolues</h3>
            <p className="text-4xl font-bold text-white">{alertStats.resolved}</p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-slate-700/50"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Filtres</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Sévérité</label>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">Toutes</option>
                <option value="critical">Critique</option>
                <option value="high">Élevée</option>
                <option value="medium">Moyenne</option>
                <option value="low">Faible</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Statut</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">Tous</option>
                <option value="active">Actives</option>
                <option value="acknowledged">Prises en compte</option>
                <option value="resolved">Résolues</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">Tous</option>
                <option value="pollution">Pollution</option>
                <option value="traffic">Trafic</option>
                <option value="noise">Bruit</option>
              </select>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Alerts List */}
      <section className="section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-slate-700/50"
        >
          <h3 className="text-xl font-bold text-white mb-6">
            Alertes ({filteredAlerts.length})
          </h3>

          <div className="space-y-4">
            {filteredAlerts.map((alert, idx) => {
              const severityConfig = getSeverityConfig(alert.severity)
              const statusConfig = getStatusConfig(alert.status)
              const StatusIcon = statusConfig.icon

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-6 rounded-xl border ${severityConfig.border} ${severityConfig.bg} hover:bg-slate-800/30 transition-all cursor-pointer`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-3xl">{getTypeIcon(alert.type)}</div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-white font-bold text-lg">{alert.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${severityConfig.bg} ${severityConfig.color}`}>
                            {severityConfig.icon} {severityConfig.label}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Zone</p>
                            <p className="text-sm text-white font-semibold flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {alert.zone}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Valeur</p>
                            <p className="text-sm text-white font-semibold">
                              {alert.value} {alert.unit}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Seuil</p>
                            <p className="text-sm text-gray-400">
                              {alert.threshold} {alert.unit}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Durée</p>
                            <p className="text-sm text-white font-semibold flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {alert.duration}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{formatTime(alert.timestamp)}</span>
                            <span>👥 {alert.affected.toLocaleString()} personnes affectées</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span className="text-xs font-semibold">{statusConfig.label}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {alert.actions.length > 0 && (
                    <div className="border-t border-slate-700/50 pt-3 mt-3">
                      <p className="text-xs text-gray-500 mb-2">Actions entreprises :</p>
                      <div className="flex flex-wrap gap-2">
                        {alert.actions.map((action, i) => (
                          <span key={i} className="px-2 py-1 bg-slate-700/50 rounded text-xs text-gray-300">
                            ✓ {action}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="border-t border-slate-700/50 pt-3 mt-3 flex gap-3">
                    {alert.status === 'active' && (
                      <>
                        <button className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg text-sm font-semibold transition-colors">
                          Prendre en charge
                        </button>
                        <button className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-sm font-semibold transition-colors">
                          Marquer résolu
                        </button>
                      </>
                    )}
                    <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-gray-300 rounded-lg text-sm font-semibold transition-colors">
                      Détails →
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </section>

      {/* Charts */}
      <section className="section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hourly Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-6 border border-slate-700/50"
          >
            <h3 className="text-xl font-bold text-white mb-6">Distribution Horaire</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={hourlyAlerts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="hour" stroke="#94a3b8" style={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* By Type */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-6 border border-slate-700/50"
          >
            <h3 className="text-xl font-bold text-white mb-6">Par Type</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={alertsByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="type" stroke="#94a3b8" style={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="count" fill="#06b6d4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </section>
    </div>
  )
}