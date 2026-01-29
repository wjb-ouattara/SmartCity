import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Car, TrendingDown, TrendingUp, MapPin, Clock, AlertCircle } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

export default function TrafficView() {
  const [selectedZone, setSelectedZone] = useState('all')
  const [timeRange, setTimeRange] = useState('24h')

  // Mock data - À remplacer par vos vrais appels API
  const zonesData = [
    { name: 'Maarif', speed: 25, congestion: 85, vehicles: 450, trend: -12, status: 'dense' },
    { name: 'Anfa', speed: 55, congestion: 45, vehicles: 180, trend: 5, status: 'fluide' },
    { name: 'Ain Diab', speed: 35, congestion: 65, vehicles: 320, trend: -8, status: 'modéré' },
    { name: 'Bourgogne', speed: 15, congestion: 95, vehicles: 520, trend: -15, status: 'très dense' },
    { name: 'Hay Hassani', speed: 45, congestion: 50, vehicles: 220, trend: 3, status: 'fluide' },
  ]

  const hourlyData = [
    { hour: '00h', speed: 60, vehicles: 120 },
    { hour: '02h', speed: 65, vehicles: 80 },
    { hour: '04h', speed: 70, vehicles: 50 },
    { hour: '06h', speed: 45, vehicles: 250 },
    { hour: '08h', speed: 25, vehicles: 480 },
    { hour: '10h', speed: 35, vehicles: 380 },
    { hour: '12h', speed: 40, vehicles: 320 },
    { hour: '14h', speed: 38, vehicles: 340 },
    { hour: '16h', speed: 30, vehicles: 420 },
    { hour: '18h', speed: 20, vehicles: 520 },
    { hour: '20h', speed: 35, vehicles: 350 },
    { hour: '22h', speed: 50, vehicles: 180 },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'fluide': return 'text-green-400 bg-green-500/10 border-green-500/20'
      case 'modéré': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      case 'dense': return 'text-orange-400 bg-orange-500/10 border-orange-500/20'
      case 'très dense': return 'text-red-400 bg-red-500/10 border-red-500/20'
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
    }
  }

  const getProgressColor = (congestion) => {
    if (congestion >= 80) return 'bg-red-500'
    if (congestion >= 60) return 'bg-orange-500'
    if (congestion >= 40) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="gradient-text">Analyse du Trafic</span>
            </h1>
            <p className="text-gray-400 text-lg">Surveillance en temps réel du trafic urbain</p>
          </div>

          <div className="flex items-center gap-3">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 glass rounded-xl border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="1h">Dernière heure</option>
              <option value="24h">24 heures</option>
              <option value="7d">7 jours</option>
              <option value="30d">30 jours</option>
            </select>
            
            <button className="btn-secondary">
              <Clock className="w-5 h-5 inline mr-2" />
              Historique
            </button>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <section className="section">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 border border-slate-700/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-cyan-500/10 rounded-xl">
                <Car className="w-6 h-6 text-cyan-400" />
              </div>
              <span className="text-green-400 text-sm font-semibold flex items-center gap-1">
                <TrendingDown className="w-4 h-4" />
                -8%
              </span>
            </div>
            <h3 className="text-gray-400 text-sm mb-2">Vitesse Moyenne</h3>
            <p className="text-4xl font-bold text-white">35 <span className="text-lg text-gray-500">km/h</span></p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6 border border-slate-700/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500/10 rounded-xl">
                <AlertCircle className="w-6 h-6 text-orange-400" />
              </div>
              <span className="text-red-400 text-sm font-semibold flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +12%
              </span>
            </div>
            <h3 className="text-gray-400 text-sm mb-2">Taux de Congestion</h3>
            <p className="text-4xl font-bold text-white">68<span className="text-lg text-gray-500">%</span></p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6 border border-slate-700/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Car className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-red-400 text-sm font-semibold flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +5%
              </span>
            </div>
            <h3 className="text-gray-400 text-sm mb-2">Véhicules Actifs</h3>
            <p className="text-4xl font-bold text-white">1,670</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6 border border-slate-700/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/10 rounded-xl">
                <MapPin className="w-6 h-6 text-red-400" />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-2">Zones Critiques</h3>
            <p className="text-4xl font-bold text-white">3</p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Zone Rankings */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-2xl p-6 border border-slate-700/50"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-cyan-400" />
                Classement des Zones
              </h3>

              <div className="space-y-4">
                {zonesData.map((zone, idx) => (
                  <div
                    key={zone.name}
                    className="p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all cursor-pointer"
                    onClick={() => setSelectedZone(zone.name)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 text-white font-bold text-sm">
                          {idx + 1}
                        </span>
                        <div>
                          <h4 className="text-white font-semibold">{zone.name}</h4>
                          <p className="text-gray-500 text-xs">{zone.vehicles} véhicules</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(zone.status)}`}>
                        {zone.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-400">Vitesse</span>
                      <span className="text-white font-semibold">{zone.speed} km/h</span>
                    </div>

                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getProgressColor(zone.congestion)} transition-all duration-500`}
                        style={{ width: `${zone.congestion}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs mt-2">
                      <span className="text-gray-500">Congestion</span>
                      <span className={zone.trend < 0 ? 'text-green-400' : 'text-red-400'}>
                        {zone.trend > 0 ? '+' : ''}{zone.trend}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Speed Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6 border border-slate-700/50"
            >
              <h3 className="text-xl font-bold text-white mb-6">Vitesse Moyenne par Heure</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={hourlyData}>
                  <defs>
                    <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="hour" 
                    stroke="#94a3b8"
                    style={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    style={{ fontSize: 12 }}
                    label={{ value: 'km/h', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                  />
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
                    dataKey="speed"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorSpeed)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Volume Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6 border border-slate-700/50"
            >
              <h3 className="text-xl font-bold text-white mb-6">Volume de Véhicules</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="hour" 
                    stroke="#94a3b8"
                    style={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    style={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar 
                    dataKey="vehicles" 
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Incidents */}
      <section className="section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-slate-700/50"
        >
          <h3 className="text-xl font-bold text-white mb-6">Incidents en Cours</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { type: 'Accident', location: 'Boulevard Zerktouni', time: 'Il y a 15 min', severity: 'high' },
              { type: 'Travaux', location: 'Rue de Fès', time: 'Il y a 1h', severity: 'medium' },
              { type: 'Manifestation', location: 'Place Mohammed V', time: 'Il y a 2h', severity: 'low' },
            ].map((incident, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${
                  incident.severity === 'high' ? 'bg-red-500/5 border-red-500/20' :
                  incident.severity === 'medium' ? 'bg-orange-500/5 border-orange-500/20' :
                  'bg-yellow-500/5 border-yellow-500/20'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-white font-semibold">{incident.type}</h4>
                  <span className={`w-2 h-2 rounded-full ${
                    incident.severity === 'high' ? 'bg-red-500' :
                    incident.severity === 'medium' ? 'bg-orange-500' :
                    'bg-yellow-500'
                  }`}></span>
                </div>
                <p className="text-gray-400 text-sm mb-2">📍 {incident.location}</p>
                <p className="text-gray-500 text-xs">🕐 {incident.time}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  )
}