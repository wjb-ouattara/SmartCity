import { MapContainer, TileLayer, Circle, Popup, LayersControl } from 'react-leaflet'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Layers } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

const { BaseLayer, Overlay } = LayersControl

export default function OverviewMap() {
  const [trafficData, setTrafficData] = useState([])
  const [pollutionData, setPollutionData] = useState([])
  const [noiseData, setNoiseData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      // Mock data
      setTrafficData([
        { zone: 'Maarif', latitude: 33.5731, longitude: -7.6298, speed_kmh: 25, vehicle_count: 450, congestion_level: 'dense' },
        { zone: 'Anfa', latitude: 33.5822, longitude: -7.6394, speed_kmh: 55, vehicle_count: 180, congestion_level: 'fluide' },
        { zone: 'Ain Diab', latitude: 33.5892, longitude: -7.6856, speed_kmh: 35, vehicle_count: 320, congestion_level: 'modéré' },
        { zone: 'Bourgogne', latitude: 33.5731, longitude: -7.5898, speed_kmh: 15, vehicle_count: 520, congestion_level: 'très dense' },
        { zone: 'Hay Hassani', latitude: 33.5628, longitude: -7.5898, speed_kmh: 45, vehicle_count: 220, congestion_level: 'fluide' },
      ])
      
      setPollutionData([
        { zone: 'Maarif', latitude: 33.5731, longitude: -7.6298, aqi: 120, pm25: 65, quality: 'Mauvais' },
        { zone: 'Anfa', latitude: 33.5822, longitude: -7.6394, aqi: 45, pm25: 28, quality: 'Bon' },
        { zone: 'Ain Diab', latitude: 33.5892, longitude: -7.6856, aqi: 78, pm25: 42, quality: 'Modéré' },
      ])
      
      setNoiseData([
        { zone: 'Maarif', latitude: 33.5731, longitude: -7.6298, decibels: 85, level: 'Élevé' },
        { zone: 'Anfa', latitude: 33.5822, longitude: -7.6394, decibels: 62, level: 'Modéré' },
        { zone: 'Ain Diab', latitude: 33.5892, longitude: -7.6856, decibels: 72, level: 'Élevé' },
      ])
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="glass rounded-2xl border border-slate-700/50 h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement de la carte...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl border border-slate-700/50 overflow-hidden relative">
      {/* Header de la carte */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex items-center justify-between">
        <div className="glass px-4 py-2 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-white">Carte Interactive</span>
          </div>
        </div>
        
        <div className="glass px-4 py-2 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Temps réel</span>
          </div>
        </div>
      </div>

      {/* Carte */}
      <MapContainer
        center={[33.5731, -7.5898]}
        zoom={12}
        className="h-[600px] w-full"
        zoomControl={true}
      >
        <LayersControl position="topright">
          <BaseLayer checked name="Carte Sombre">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
          </BaseLayer>
          <BaseLayer name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </BaseLayer>

          {/* Couche Trafic */}
          <Overlay checked name="🚗 Trafic">
            <>
              {trafficData.map((point, idx) => (
                <Circle
                  key={`traffic-${idx}`}
                  center={[point.latitude, point.longitude]}
                  radius={300}
                  pathOptions={{
                    color: point.congestion_level === 'très dense' ? '#ef4444' :
                           point.congestion_level === 'dense' ? '#f59e0b' :
                           point.congestion_level === 'modéré' ? '#eab308' : '#10b981',
                    fillOpacity: 0.3,
                    weight: 2
                  }}
                >
                  <Popup className="custom-popup">
                    <div className="p-2">
                      <h3 className="font-bold text-lg mb-2">{point.zone}</h3>
                      <div className="space-y-1 text-sm">
                        <p>🚗 Vitesse: <span className="font-semibold">{point.speed_kmh} km/h</span></p>
                        <p>🚙 Véhicules: <span className="font-semibold">{point.vehicle_count}</span></p>
                        <p>📊 État: <span className={`font-semibold ${
                          point.congestion_level === 'très dense' ? 'text-red-400' :
                          point.congestion_level === 'dense' ? 'text-orange-400' :
                          point.congestion_level === 'modéré' ? 'text-yellow-400' : 'text-green-400'
                        }`}>{point.congestion_level}</span></p>
                      </div>
                    </div>
                  </Popup>
                </Circle>
              ))}
            </>
          </Overlay>

          {/* Couche Pollution */}
          <Overlay name="🌫️ Pollution">
            <>
              {pollutionData.map((point, idx) => (
                <Circle
                  key={`pollution-${idx}`}
                  center={[point.latitude, point.longitude]}
                  radius={400}
                  pathOptions={{
                    color: point.aqi > 150 ? '#ef4444' :
                           point.aqi > 100 ? '#f59e0b' :
                           point.aqi > 50 ? '#eab308' : '#10b981',
                    fillOpacity: 0.2,
                    weight: 2
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-lg mb-2">{point.zone}</h3>
                      <div className="space-y-1 text-sm">
                        <p>🌫️ AQI: <span className="font-semibold">{point.aqi}</span></p>
                        <p>💨 PM2.5: <span className="font-semibold">{point.pm25} µg/m³</span></p>
                        <p>📊 Qualité: <span className={`font-semibold ${
                          point.quality === 'Dangereux' ? 'text-red-400' :
                          point.quality === 'Mauvais' ? 'text-orange-400' :
                          point.quality === 'Modéré' ? 'text-yellow-400' : 'text-green-400'
                        }`}>{point.quality}</span></p>
                      </div>
                    </div>
                  </Popup>
                </Circle>
              ))}
            </>
          </Overlay>

          {/* Couche Bruit */}
          <Overlay name="🔊 Bruit">
            <>
              {noiseData.map((point, idx) => (
                <Circle
                  key={`noise-${idx}`}
                  center={[point.latitude, point.longitude]}
                  radius={350}
                  pathOptions={{
                    color: point.decibels > 85 ? '#ef4444' :
                           point.decibels > 70 ? '#f59e0b' :
                           point.decibels > 55 ? '#eab308' : '#10b981',
                    fillOpacity: 0.25,
                    weight: 2
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-lg mb-2">{point.zone}</h3>
                      <div className="space-y-1 text-sm">
                        <p>🔊 Niveau: <span className="font-semibold">{point.decibels} dB</span></p>
                        <p>📊 Intensité: <span className={`font-semibold ${
                          point.level === 'Très élevé' ? 'text-red-400' :
                          point.level === 'Élevé' ? 'text-orange-400' :
                          point.level === 'Modéré' ? 'text-yellow-400' : 'text-green-400'
                        }`}>{point.level}</span></p>
                      </div>
                    </div>
                  </Popup>
                </Circle>
              ))}
            </>
          </Overlay>
        </LayersControl>
      </MapContainer>

      {/* Légende */}
      <div className="absolute bottom-6 left-6 glass p-4 rounded-xl z-[1000] border border-slate-700/50">
        <h4 className="font-semibold mb-3 text-sm text-white flex items-center gap-2">
          <span>📊</span> Légende
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1.5 bg-green-500 rounded-full"></div>
            <span className="text-gray-300">Bon / Fluide</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1.5 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-300">Modéré</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1.5 bg-orange-500 rounded-full"></div>
            <span className="text-gray-300">Dense / Mauvais</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1.5 bg-red-500 rounded-full"></div>
            <span className="text-gray-300">Très Dense / Dangereux</span>
          </div>
        </div>
      </div>
    </div>
  )
}