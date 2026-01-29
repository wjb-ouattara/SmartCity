import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wind, Droplets, CloudRain, TrendingUp, AlertTriangle, Info } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

export default function AirQualityView() {
  const [selectedPollutant, setSelectedPollutant] = useState('pm25')

  // data
  const aqiData = {
    current: 78,
    level: 'Modéré',
    color: 'orange',
    description: 'Acceptable pour la plupart, mais sensible pour certains'
  }

  const pollutants = [
    { name: 'PM2.5', value: 45, unit: 'µg/m³', limit: 25, status: 'high', color: 'orange' },
    { name: 'PM10', value: 78, unit: 'µg/m³', limit: 50, status: 'high', color: 'orange' },
    { name: 'O₃', value: 32, unit: 'ppb', limit: 70, status: 'good', color: 'green' },
    { name: 'NO₂', value: 42, unit: 'ppb', limit: 53, status: 'moderate', color: 'yellow' },
    { name: 'SO₂', value: 8, unit: 'ppb', limit: 35, status: 'good', color: 'green' },
    { name: 'CO', value: 0.6, unit: 'ppm', limit: 9, status: 'good', color: 'green' },
  ]

  const historicalData = [
    { time: '00h', aqi: 45, pm25: 28 },
    { time: '04h', aqi: 42, pm25: 25 },
    { time: '08h', aqi: 68, pm25: 42 },
    { time: '12h', aqi: 85, pm25: 52 },
    { time: '16h', aqi: 92, pm25: 58 },
    { time: '20h', aqi: 78, pm25: 48 },
    { time: '24h', aqi: 65, pm25: 38 },
  ]

  const zonesComparison = [
    { zone: 'Maarif', pm25: 65, pm10: 85, o3: 45, no2: 52, so2: 12, co: 0.8 },
    { zone: 'Anfa', pm25: 28, pm10: 42, o3: 35, no2: 38, so2: 6, co: 0.4 },
    { zone: 'Ain Diab', pm25: 42, pm10: 58, o3: 38, no2: 45, so2: 8, co: 0.6 },
  ]

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return { bg: 'from-green-500/20 to-green-600/20', text: 'text-green-400', border: 'border-green-500/30' }
    if (aqi <= 100) return { bg: 'from-yellow-500/20 to-yellow-600/20', text: 'text-yellow-400', border: 'border-yellow-500/30' }
    if (aqi <= 150) return { bg: 'from-orange-500/20 to-orange-600/20', text: 'text-orange-400', border: 'border-orange-500/30' }
    return { bg: 'from-red-500/20 to-red-600/20', text: 'text-red-400', border: 'border-red-500/30' }
  }

  const getPollutantColor = (status) => {
    switch (status) {
      case 'good': return 'text-green-400 bg-green-500/10'
      case 'moderate': return 'text-yellow-400 bg-yellow-500/10'
      case 'high': return 'text-orange-400 bg-orange-500/10'
      case 'critical': return 'text-red-400 bg-red-500/10'
      default: return 'text-gray-400 bg-gray-500/10'
    }
  }

  const aqiColor = getAQIColor(aqiData.current)

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
              <span className="gradient-text">Qualité de l'Air</span>
            </h1>
            <p className="text-gray-400 text-lg">Surveillance de la pollution atmosphérique</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 glass rounded-xl border border-slate-700">
              <Wind className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-gray-300">Vent: 12 km/h NE</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AQI Principal */}
      <section className="section">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`glass rounded-2xl p-8 border ${aqiColor.border} bg-gradient-to-br ${aqiColor.bg}`}
        >
          <div className="text-center">
            <h2 className="text-gray-400 text-lg mb-4 uppercase tracking-wider">Indice de Qualité de l'Air (AQI)</h2>
            <div className="mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 1 }}
                className="inline-block"
              >
                <div className="relative">
                  <svg className="w-48 h-48 mx-auto" viewBox="0 0 200 200">
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="20"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeDasharray={`${(aqiData.current / 200) * 565} 565`}
                      strokeLinecap="round"
                      className={aqiColor.text}
                      transform="rotate(-90 100 100)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-6xl font-bold ${aqiColor.text}`}>{aqiData.current}</span>
                    <span className="text-gray-400 text-sm mt-1">/ 200</span>
                  </div>
                </div>
              </motion.div>
            </div>
            <h3 className={`text-3xl font-bold mb-2 ${aqiColor.text}`}>{aqiData.level}</h3>
            <p className="text-gray-400 max-w-md mx-auto">{aqiData.description}</p>
          </div>

          {/* Recommendations */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-5 h-5 text-cyan-400" />
                <h4 className="text-white font-semibold text-sm">Personnes Sensibles</h4>
              </div>
              <p className="text-gray-400 text-xs">Réduisez les activités extérieures prolongées</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Wind className="w-5 h-5 text-cyan-400" />
                <h4 className="text-white font-semibold text-sm">Général</h4>
              </div>
              <p className="text-gray-400 text-xs">Acceptable pour la plupart des gens</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h4 className="text-white font-semibold text-sm">Précautions</h4>
              </div>
              <p className="text-gray-400 text-xs">Fermez les fenêtres si sensible</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Pollutants Grid */}
      <section className="section">
        <h3 className="text-2xl font-bold text-white mb-6">Polluants Détaillés</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pollutants.map((pollutant, idx) => (
            <motion.div
              key={pollutant.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-2xl p-6 border border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-bold text-lg">{pollutant.name}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPollutantColor(pollutant.status)}`}>
                  {pollutant.status === 'good' ? 'Bon' : 
                   pollutant.status === 'moderate' ? 'Modéré' : 
                   pollutant.status === 'high' ? 'Élevé' : 'Critique'}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">{pollutant.value}</span>
                  <span className="text-gray-400 text-sm">{pollutant.unit}</span>
                </div>
                <p className="text-gray-500 text-xs mt-1">Limite: {pollutant.limit} {pollutant.unit}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Progression</span>
                  <span>{Math.round((pollutant.value / pollutant.limit) * 100)}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      pollutant.status === 'good' ? 'bg-green-500' :
                      pollutant.status === 'moderate' ? 'bg-yellow-500' :
                      pollutant.status === 'high' ? 'bg-orange-500' :
                      'bg-red-500'
                    } transition-all duration-500`}
                    style={{ width: `${Math.min((pollutant.value / pollutant.limit) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Charts Section */}
      <section className="section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Historical Trend */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-6 border border-slate-700/50"
          >
            <h3 className="text-xl font-bold text-white mb-6">Évolution sur 24h</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" style={{ fontSize: 12 }} />
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
                  dataKey="aqi"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{ fill: '#06b6d4', r: 4 }}
                  name="AQI"
                />
                <Line
                  type="monotone"
                  dataKey="pm25"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', r: 3 }}
                  name="PM2.5"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Zones Comparison */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-6 border border-slate-700/50"
          >
            <h3 className="text-xl font-bold text-white mb-6">Comparaison par Zone</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={zonesComparison}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="zone" stroke="#94a3b8" />
                <PolarRadiusAxis stroke="#94a3b8" />
                <Radar name="PM2.5" dataKey="pm25" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
                <Radar name="PM10" dataKey="pm10" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </section>

      {/* Sources & Info */}
      <section className="section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-slate-700/50"
        >
          <h3 className="text-xl font-bold text-white mb-6">Sources de Pollution Principales</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { icon: '🚗', name: 'Trafic routier', percentage: 45 },
              { icon: '🏭', name: 'Industries', percentage: 25 },
              { icon: '🏗️', name: 'Construction', percentage: 20 },
              { icon: '🔥', name: 'Chauffage', percentage: 10 },
            ].map((source, idx) => (
              <div key={idx} className="p-4 bg-slate-800/30 rounded-xl">
                <div className="text-3xl mb-3">{source.icon}</div>
                <h4 className="text-white font-semibold mb-2">{source.name}</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                  <span className="text-cyan-400 text-sm font-bold">{source.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  )
}