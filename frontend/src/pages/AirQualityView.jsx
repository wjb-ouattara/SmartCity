import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wind, Droplets, CloudRain, TrendingUp, AlertTriangle, Info } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { supabase } from '../utils/SupabaseClient'

export default function AirQualityView() {
  const [trafficData, setTrafficData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState('Autre');

  // 1. RÉCUPÉRATION SUPABASE
  useEffect(() => {
    async function fetchAllData() {
      setLoading(true);
      const { data, error } = await supabase
        .from('zone_air_quality')
        .select('*')
        .eq('zone_name', selectedZone)
        .single();

      if (!error && data) {
        setTrafficData(data);
      } else {
        console.error("Erreur ou pas de données:", error);
        setTrafficData(null); 
      }
      setLoading(false);
    }
    fetchAllData();
  }, [selectedZone]);

  
  const getAQIColor = (aqi) => {
    if (aqi <= 25) return { bg: 'from-green-500/20 to-green-600/20', text: 'text-green-400', border: 'border-green-500/30' }
    if (aqi <= 50) return { bg: 'from-yellow-500/20 to-yellow-600/20', text: 'text-yellow-400', border: 'border-yellow-500/30' }
    if (aqi <= 75) return { bg: 'from-orange-500/20 to-orange-600/20', text: 'text-orange-400', border: 'border-orange-500/30' }
    return { bg: 'from-red-500/20 to-red-600/20', text: 'text-red-400', border: 'border-red-500/30' }
  }

  const getPollutantColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'high': 
      return 'text-red-400 bg-red-500/10 border border-red-500/20';
    case 'moderate': 
      return 'text-orange-400 bg-orange-500/10 border border-orange-500/20'; 
    case 'good': 
      return 'text-green-400 bg-green-500/10 border border-green-500/20'; 
    default: 
      return 'text-gray-400 bg-gray-500/10';
  }
}

  
  if (loading) return <div className="p-10 text-white font-mono animate-pulse">📡 Récupération des données de la sonde...</div>;
  if (!trafficData) return (
    <div className="p-10 text-white">
      <p>⚠️ Aucune donnée pour {selectedZone}.</p>
      <button onClick={() => setSelectedZone('Maarif')} className="mt-4 underline">Retourner à Maarif</button>
    </div>
  );

 
  const pmValue = trafficData.total_load_pmx || 0;
  const noxValue = trafficData.total_load_nox || 0;
  const co2Value = trafficData.total_load_co2 || 0;

 
  let calculatedAQI = (pmValue * 0.23) + (noxValue * 0.18) + (co2Value * 0.001);
  
  
  const aqiScore = Math.round(calculatedAQI);
  const aqiColor = getAQIColor(aqiScore);

  const aqiData = {
    current: aqiScore,
    level: aqiScore > 75 ? 'Critique' : (aqiScore > 50 ? 'Mauvais' : (aqiScore > 25 ? 'Modéré' : 'Bon')),
    description: `Charge polluante cumulée de ${trafficData.vehicle_count} véhicules`
  };

  const pollutants = [
    { 
      name: 'PM2.5 (Charge)', 
      value: pmValue, 
      unit: 'mg/m³', 
      limit: 90, 
      status: pmValue > 90 ? 'high' : pmValue > 50 ? 'moderate' : 'good' 
    },
    { 
      name: 'NOx (Charge)', 
      value: noxValue, 
      unit: 'mg/m³', 
      limit: 350, 
      status: noxValue > 350 ? 'high' : noxValue > 250 ? 'moderate' : 'good' 
    },
    { 
      name: 'CO2 (Tonne)', 
      value: co2Value, 
      unit: 'kg', 
      limit: 12000, 
      
      status: co2Value > 12000 ? 'high' : co2Value > 7000 ? 'moderate' : 'good' 
    }, 
  ];
  const historicalData = [
    { time: '00h', aqi: aqiScore - 15, pm25: trafficData.global_avg_pmx - 5 },
    { time: '08h', aqi: aqiScore + 10, pm25: trafficData.global_avg_pmx + 5 },
    { time: '12h', aqi: aqiScore + 20, pm25: trafficData.global_avg_pmx + 10 },
    { time: 'Maintenant', aqi: aqiScore, pm25: trafficData.global_avg_pmx },
  ];

  // Données Radar dynamiques : on compare la zone actuelle à des moyennes fixes
  const zonesComparison = [
    { zone: trafficData.zone_name, pm25: trafficData.global_avg_pmx, pm10: trafficData.global_avg_pmx * 1.5 },
    { zone: 'Moyenne Ville', pm25: 45, pm10: 60 },
    { zone: 'Objectif', pm25: 25, pm10: 40 },
  ];


  return (
    <div className="space-y-8">
      {/* Header avec Sélecteur */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="gradient-text">Qualité de l'Air - {selectedZone}</span>
            </h1>
            
            {/* Petit menu déroulant discret intégré au design */}
            <div className="flex gap-2 mt-2">
                {['Test','Maarif', 'Anfa', 'Ain Diab'].map(zone => (
                    <button 
                        key={zone}
                        onClick={() => setSelectedZone(zone)}
                        className={`px-3 py-1 rounded-full text-xs transition-colors ${selectedZone === zone ? 'bg-cyan-500 text-black font-bold' : 'bg-slate-800 text-gray-400 hover:bg-slate-700'}`}
                    >
                        {zone}
                    </button>
                ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 glass rounded-xl border border-slate-700">
              <Wind className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-gray-300">Trafic: {trafficData.vehicle_count} véh.</span>
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
                    <circle cx="100" cy="100" r="90" fill="none" stroke="#1e293b" strokeWidth="20" />
                    <circle
                      cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="20"
                      strokeDasharray={`${(aqiData.current / 100) * 565} 565`}
                      strokeLinecap="round"
                      className={aqiColor.text}
                      transform="rotate(-90 100 100)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-6xl font-bold ${aqiColor.text}`}>{aqiData.current}</span>
                    <span className="text-gray-400 text-sm mt-1">/ 100</span>
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
                <h4 className="text-white font-semibold text-sm">Sensibles</h4>
              </div>
              <p className="text-gray-400 text-xs">Prudence si sup 50 AQI</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Wind className="w-5 h-5 text-cyan-400" />
                <h4 className="text-white font-semibold text-sm">Général</h4>
              </div>
              <p className="text-gray-400 text-xs">{aqiScore > 60 ? 'Limitez le sport' : 'Air correct'}</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h4 className="text-white font-semibold text-sm">Alerte</h4>
              </div>
              <p className="text-gray-400 text-xs">{aqiScore > 90 ? 'Portez un masque' : 'Pas d\'alerte'}</p>
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
                  {pollutant.status}
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
                    className={`h-full transition-all duration-500 ${
                        pollutant.status === 'good' ? 'bg-green-500' :
                        pollutant.status === 'moderate' ? 'bg-yellow-500' :
                        'bg-orange-500'
                    }`}
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
            <h3 className="text-xl font-bold text-white mb-6">Évolution estimée (24h)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" style={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                <Line type="monotone" dataKey="aqi" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4', r: 4 }} name="AQI" />
                <Line type="monotone" dataKey="pm25" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3 }} name="PM2.5" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Zones Comparison */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-6 border border-slate-700/50"
          >
            <h3 className="text-xl font-bold text-white mb-6">Comparaison vs Moyenne</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={zonesComparison}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="zone" stroke="#94a3b8" />
                <PolarRadiusAxis stroke="#94a3b8" />
                <Radar name="PM2.5" dataKey="pm25" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
                <Radar name="PM10" dataKey="pm10" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </section>

      {/* Sources & Info (Gardé intact) */}
      <section className="section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-slate-700/50"
        >
          <h3 className="text-xl font-bold text-white mb-6">Sources de Pollution Principales</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { icon: '🚗', name: 'Trafic routier', percentage: 70 }, // Modifié pour coller à ton projet
              { icon: '🏭', name: 'Industries', percentage: 15 },
              { icon: '🏗️', name: 'Construction', percentage: 10 },
              { icon: '🔥', name: 'Chauffage', percentage: 5 },
            ].map((source, idx) => (
              <div key={idx} className="p-4 bg-slate-800/30 rounded-xl">
                <div className="text-3xl mb-3">{source.icon}</div>
                <h4 className="text-white font-semibold mb-2">{source.name}</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500" style={{ width: `${source.percentage}%` }} />
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