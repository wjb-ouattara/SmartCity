import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, TrendingDown, Download, Calendar, Activity } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('all')

  // Mock data
  const weeklyTrends = [
    { day: 'Lun', traffic: 75, pollution: 65, noise: 70, alerts: 8 },
    { day: 'Mar', traffic: 82, pollution: 72, noise: 75, alerts: 12 },
    { day: 'Mer', traffic: 78, pollution: 68, noise: 72, alerts: 10 },
    { day: 'Jeu', traffic: 85, pollution: 75, noise: 78, alerts: 15 },
    { day: 'Ven', traffic: 90, pollution: 82, noise: 85, alerts: 18 },
    { day: 'Sam', traffic: 65, pollution: 55, noise: 80, alerts: 6 },
    { day: 'Dim', traffic: 50, pollution: 45, noise: 75, alerts: 4 },
  ]

  const monthlyComparison = [
    { month: 'Jan', value: 65 },
    { month: 'Fév', value: 68 },
    { month: 'Mar', value: 72 },
    { month: 'Avr', value: 70 },
    { month: 'Mai', value: 75 },
    { month: 'Juin', value: 78 },
  ]

  const zoneDistribution = [
    { name: 'Maarif', value: 35, color: '#ef4444' },
    { name: 'Anfa', value: 20, color: '#10b981' },
    { name: 'Ain Diab', value: 25, color: '#f59e0b' },
    { name: 'Bourgogne', value: 15, color: '#06b6d4' },
    { name: 'Autres', value: 5, color: '#8b5cf6' },
  ]

  const hourlyPattern = [
    { hour: '0h', value: 30 },
    { hour: '3h', value: 20 },
    { hour: '6h', value: 50 },
    { hour: '9h', value: 85 },
    { hour: '12h', value: 75 },
    { hour: '15h', value: 70 },
    { hour: '18h', value: 90 },
    { hour: '21h', value: 60 },
  ]

  const topIssues = [
    { issue: 'Trafic dense heures de pointe', count: 145, trend: '+12%', severity: 'high' },
    { issue: 'Pollution PM2.5 élevée', count: 98, trend: '+8%', severity: 'high' },
    { issue: 'Bruit nocturne zones commerciales', count: 76, trend: '-5%', severity: 'medium' },
    { issue: 'Signalements citoyens non traités', count: 54, trend: '+15%', severity: 'medium' },
    { issue: 'Capteurs défaillants', count: 12, trend: '-20%', severity: 'low' },
  ]

  const performanceMetrics = [
    { label: 'Taux de résolution', value: 78, target: 85, unit: '%' },
    { label: 'Temps de réponse moyen', value: 2.5, target: 2, unit: 'h' },
    { label: 'Satisfaction citoyens', value: 4.2, target: 4.5, unit: '/5' },
    { label: 'Capteurs actifs', value: 98, target: 100, unit: '%' },
  ]

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-500/10'
      case 'medium': return 'text-orange-400 bg-orange-500/10'
      case 'low': return 'text-yellow-400 bg-yellow-500/10'
      default: return 'text-gray-400 bg-gray-500/10'
    }
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
              <span className="gradient-text">Analytics & Rapports</span>
            </h1>
            <p className="text-gray-400 text-lg">Analyse détaillée des données urbaines</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 glass rounded-xl border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="24h">24 heures</option>
              <option value="7d">7 jours</option>
              <option value="30d">30 jours</option>
              <option value="90d">90 jours</option>
            </select>

            <button className="btn-secondary">
              <Download className="w-5 h-5 inline mr-2" />
              Export PDF
            </button>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <section className="section">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Évolution Globale', value: '+8.5%', subtext: 'vs semaine dernière', icon: TrendingUp, color: 'green' },
            { label: 'Alertes Traitées', value: '156', subtext: 'sur 200 signalées', icon: Activity, color: 'cyan' },
            { label: 'Zones Critiques', value: '3', subtext: '-1 vs hier', icon: BarChart3, color: 'orange' },
            { label: 'Score Moyen', value: '68/100', subtext: '+5 points', icon: TrendingUp, color: 'purple' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-2xl p-6 border border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-${stat.color}-500/10 rounded-xl`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                </div>
              </div>
              <h3 className="text-gray-400 text-sm mb-2">{stat.label}</h3>
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.subtext}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Charts */}
      <section className="section">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Trends */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-2xl p-6 border border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Tendances Hebdomadaires</h3>
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="all">Toutes les métriques</option>
                  <option value="traffic">Trafic</option>
                  <option value="pollution">Pollution</option>
                  <option value="noise">Bruit</option>
                </select>
              </div>

              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" stroke="#94a3b8" style={{ fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" style={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="traffic" stroke="#3b82f6" strokeWidth={2} name="Trafic" />
                  <Line type="monotone" dataKey="pollution" stroke="#f59e0b" strokeWidth={2} name="Pollution" />
                  <Line type="monotone" dataKey="noise" stroke="#8b5cf6" strokeWidth={2} name="Bruit" />
                  <Line type="monotone" dataKey="alerts" stroke="#ef4444" strokeWidth={2} name="Alertes" />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Zone Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-6 border border-slate-700/50"
          >
            <h3 className="text-xl font-bold text-white mb-6">Distribution par Zone</h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={zoneDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {zoneDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </section>

      {/* Secondary Charts */}
      <section className="section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 border border-slate-700/50"
          >
            <h3 className="text-xl font-bold text-white mb-6">Évolution Mensuelle</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyComparison}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Hourly Pattern */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 border border-slate-700/50"
          >
            <h3 className="text-xl font-bold text-white mb-6">Pattern Horaire</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyPattern}>
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
                <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-slate-700/50"
        >
          <h3 className="text-xl font-bold text-white mb-6">Indicateurs de Performance</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceMetrics.map((metric, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-400">{metric.label}</h4>
                  <span className={`text-xs ${metric.value >= metric.target ? 'text-green-400' : 'text-orange-400'}`}>
                    Cible: {metric.target}{metric.unit}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">{metric.value}</span>
                  <span className="text-gray-500">{metric.unit}</span>
                </div>

                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${metric.value >= metric.target ? 'bg-green-500' : 'bg-orange-500'} transition-all duration-500`}
                    style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Top Issues */}
      <section className="section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-slate-700/50"
        >
          <h3 className="text-xl font-bold text-white mb-6">Problèmes Principaux</h3>

          <div className="space-y-3">
            {topIssues.map((issue, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all"
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 text-white font-bold text-sm">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-1">{issue.issue}</h4>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getSeverityColor(issue.severity)}`}>
                        {issue.severity === 'high' ? 'Élevé' : issue.severity === 'medium' ? 'Moyen' : 'Faible'}
                      </span>
                      <span className="text-xs text-gray-500">{issue.count} occurrences</span>
                    </div>
                  </div>
                </div>

                <div className={`flex items-center gap-1 ${issue.trend.startsWith('+') ? 'text-red-400' : 'text-green-400'}`}>
                  {issue.trend.startsWith('+') ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="text-sm font-semibold">{issue.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Recommendations */}
      <section className="section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-cyan-500/10 rounded-xl">
              <Activity className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-3">Recommandations IA</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Augmenter la fréquence de collecte des données pendant les heures de pointe (8h-10h, 17h-19h)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Déployer 3 capteurs supplémentaires dans la zone de Bourgogne (zone critique détectée)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Traiter en priorité les signalements citoyens non résolus depuis plus de 48h</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Planifier une maintenance des capteurs défaillants avant fin de semaine</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}