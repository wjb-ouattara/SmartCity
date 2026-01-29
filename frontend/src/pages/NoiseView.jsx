import { useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX, Volume1, TrendingUp, Clock, MapPin } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

export default function NoiseView() {
  const [selectedPeriod, setSelectedPeriod] = useState('day')

  // Mock data
  const currentNoise = {
    level: 82,
    category: 'Élevé',
    color: 'red',
    description: 'Niveau de bruit gênant, risque pour l\'audition sur le long terme'
  }

  const noiseLevels = [
    { range: '< 45 dB', category: 'Silence', color: 'green', zones: 0 },
    { range: '45-55 dB', category: 'Calme', color: 'green', zones: 2 },
    { range: '55-70 dB', category: 'Modéré', color: 'yellow', zones: 3 },
    { range: '70-85 dB', category: 'Élevé', color: 'orange', zones: 4 },
    { range: '> 85 dB', category: 'Très Élevé', color: 'red', zones: 2 },
  ]

  const hourlyData = [
    { hour: '00h', noise: 52, peak: 58 },
    { hour: '02h', noise: 48, peak: 52 },
    { hour: '04h', noise: 45, peak: 50 },
    { hour: '06h', noise: 62, peak: 68 },
    { hour: '08h', noise: 78, peak: 85 },
    { hour: '10h', noise: 72, peak: 78 },
    { hour: '12h', noise: 75, peak: 82 },
    { hour: '14h', noise: 73, peak: 80 },
    { hour: '16h', noise: 76, peak: 83 },
    { hour: '18h', noise: 82, peak: 90 },
    { hour: '20h', noise: 70, peak: 76 },
    { hour: '22h', noise: 58, peak: 65 },
  ]

  const zonesData = [
    { name: 'Maarif', noise: 85, peak: 92, sources: ['Trafic', 'Commerces'], status: 'critical' },
    { name: 'Anfa', noise: 62, peak: 68, sources: ['Trafic'], status: 'moderate' },
    { name: 'Ain Diab', noise: 72, peak: 78, sources: ['Bars', 'Restaurants'], status: 'high' },
    { name: 'Bourgogne', noise: 88, peak: 95, sources: ['Trafic', 'Klaxons'], status: 'critical' },
    { name: 'Hay Hassani', noise: 78, peak: 82, sources: ['Industrie'], status: 'high' },
  ]

  const getNoiseColor = (level) => {
    if (level < 55) return { text: 'text-green-400', bg: 'bg-green-500', border: 'border-green-500' }
    if (level < 70) return { text: 'text-yellow-400', bg: 'bg-yellow-500', border: 'border-yellow-500' }
    if (level < 85) return { text: 'text-orange-400', bg: 'bg-orange-500', border: 'border-orange-500' }
    return { text: 'text-red-400', bg: 'bg-red-500', border: 'border-red-500' }
  }

  const noiseColor = getNoiseColor(currentNoise.level)

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
              <span className="gradient-text">Pollution Sonore</span>
            </h1>
            <p className="text-gray-400 text-lg">Surveillance du bruit urbain en temps réel</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 glass rounded-xl border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="day">Jour (6h-22h)</option>
              <option value="night">Nuit (22h-6h)</option>
              <option value="24h">24 heures</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Current Noise Level */}
      <section className="section">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Gauge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="md:col-span-2 glass rounded-2xl p-8 border border-slate-700/50"
          >
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="16"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="16"
                      strokeDasharray={`${(currentNoise.level / 120) * 502} 502`}
                      strokeLinecap="round"
                      className={noiseColor.text}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Volume2 className={`w-8 h-8 mb-2 ${noiseColor.text}`} />
                    <span className={`text-5xl font-bold ${noiseColor.text}`}>{currentNoise.level}</span>
                    <span className="text-gray-400 text-sm">dB</span>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <h3 className={`text-3xl font-bold mb-3 ${noiseColor.text}`}>{currentNoise.category}</h3>
                <p className="text-gray-400 mb-6">{currentNoise.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${noiseColor.bg} animate-pulse`}></div>
                    <span className="text-sm text-gray-400">Niveau actuel mesuré</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm text-gray-400">Mise à jour il y a 5s</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm text-gray-400">Zone de référence: Centre-ville</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Reference Levels */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-6 border border-slate-700/50"
          >
            <h3 className="text-xl font-bold text-white mb-6">Échelle de Référence</h3>
            
            <div className="space-y-4">
              {[
                { db: '120', desc: 'Concert Rock', icon: '🎸' },
                { db: '100', desc: 'Discothèque', icon: '🎵' },
                { db: '85', desc: 'Trafic Dense', icon: '🚗' },
                { db: '70', desc: 'Restaurant', icon: '🍽️' },
                { db: '55', desc: 'Bureau', icon: '💼' },
                { db: '40', desc: 'Bibliothèque', icon: '📚' },
                { db: '20', desc: 'Chuchotement', icon: '🤫' },
              ].map((ref, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    parseInt(ref.db) === Math.floor(currentNoise.level / 10) * 10
                      ? 'bg-cyan-500/10 border border-cyan-500/30'
                      : 'bg-slate-800/20'
                  }`}
                >
                  <span className="text-2xl">{ref.icon}</span>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">{ref.desc}</p>
                    <p className="text-gray-500 text-xs">{ref.db} dB</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics */}
      <section className="section">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Moyenne 24h', value: '68', unit: 'dB', icon: Volume1, trend: '+3%' },
            { label: 'Pic Maximum', value: '95', unit: 'dB', icon: Volume2, trend: '+12%' },
            { label: 'Zones > 85 dB', value: '2', unit: 'zones', icon: MapPin, trend: '-1' },
            { label: 'Plaintes Citoyens', value: '8', unit: 'nouvelles', icon: TrendingUp, trend: '+2' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-2xl p-6 border border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-cyan-500/10 rounded-xl">
                  <stat.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <span className="text-xs text-gray-400">{stat.trend}</span>
              </div>
              <h3 className="text-gray-400 text-sm mb-2">{stat.label}</h3>
              <p className="text-3xl font-bold text-white">
                {stat.value} <span className="text-lg text-gray-500">{stat.unit}</span>
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Charts */}
      <section className="section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 24h Timeline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-6 border border-slate-700/50"
          >
            <h3 className="text-xl font-bold text-white mb-6">Évolution sur 24h</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="hour" stroke="#94a3b8" style={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: 12 }} label={{ value: 'dB', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
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
                  dataKey="noise"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{ fill: '#06b6d4', r: 4 }}
                  name="Moyenne"
                />
                <Line
                  type="monotone"
                  dataKey="peak"
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Pics"
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
              <BarChart data={zonesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="noise" fill="#06b6d4" radius={[8, 8, 0, 0]} name="Moyenne" />
                <Bar dataKey="peak" fill="#ef4444" radius={[8, 8, 0, 0]} name="Pic" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </section>

      {/* Zones Details */}
      <section className="section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-slate-700/50"
        >
          <h3 className="text-xl font-bold text-white mb-6">Détail par Zone</h3>

          <div className="space-y-4">
            {zonesData.map((zone, idx) => {
              const zoneColor = getNoiseColor(zone.noise)
              return (
                <div
                  key={idx}
                  className="p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <MapPin className={`w-5 h-5 ${zoneColor.text}`} />
                      <div>
                        <h4 className="text-white font-semibold">{zone.name}</h4>
                        <div className="flex gap-2 mt-1">
                          {zone.sources.map((source, i) => (
                            <span key={i} className="text-xs text-gray-400 bg-slate-700/50 px-2 py-0.5 rounded">
                              {source}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${zoneColor.text}`}>{zone.noise} dB</p>
                      <p className="text-xs text-gray-500">Pic: {zone.peak} dB</p>
                    </div>
                  </div>

                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${zoneColor.bg} transition-all duration-500`}
                      style={{ width: `${(zone.noise / 120) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </section>

      {/* Noise Categories */}
      <section className="section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-slate-700/50"
        >
          <h3 className="text-xl font-bold text-white mb-6">Distribution des Niveaux</h3>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {noiseLevels.map((level, idx) => (
              <div key={idx} className="p-4 bg-slate-800/30 rounded-xl text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                  level.color === 'green' ? 'bg-green-500/20' :
                  level.color === 'yellow' ? 'bg-yellow-500/20' :
                  level.color === 'orange' ? 'bg-orange-500/20' :
                  'bg-red-500/20'
                }`}>
                  {level.color === 'green' ? <VolumeX className="w-6 h-6 text-green-400" /> :
                   level.color === 'yellow' ? <Volume1 className="w-6 h-6 text-yellow-400" /> :
                   <Volume2 className={`w-6 h-6 ${level.color === 'orange' ? 'text-orange-400' : 'text-red-400'}`} />}
                </div>
                <h4 className={`font-bold mb-1 ${
                  level.color === 'green' ? 'text-green-400' :
                  level.color === 'yellow' ? 'text-yellow-400' :
                  level.color === 'orange' ? 'text-orange-400' :
                  'text-red-400'
                }`}>{level.category}</h4>
                <p className="text-xs text-gray-400 mb-2">{level.range}</p>
                <p className="text-2xl font-bold text-white">{level.zones}</p>
                <p className="text-xs text-gray-500">zones</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  )
}