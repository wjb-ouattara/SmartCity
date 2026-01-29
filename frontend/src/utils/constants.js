// Zones de Casablanca
export const CASABLANCA_ZONES = {
  maarif: { 
    name: 'Maarif', 
    lat: 33.5731, 
    lon: -7.6298,
    description: 'Quartier commercial et résidentiel'
  },
  anfa: { 
    name: 'Anfa', 
    lat: 33.5822, 
    lon: -7.6394,
    description: 'Quartier huppé'
  },
  ain_diab: { 
    name: 'Ain Diab', 
    lat: 33.5892, 
    lon: -7.6856,
    description: 'Bord de mer'
  },
  bourgogne: { 
    name: 'Bourgogne', 
    lat: 33.5731, 
    lon: -7.5898,
    description: 'Centre ville'
  },
  hay_hassani: { 
    name: 'Hay Hassani', 
    lat: 33.5628, 
    lon: -7.5898,
    description: 'Zone industrielle'
  }
}

// Seuils d'alerte
export const ALERT_THRESHOLDS = {
  traffic: {
    congested: 20, // km/h
    heavy: 35,
    moderate: 50
  },
  pollution: {
    dangerous: 150, // AQI
    unhealthy: 100,
    moderate: 50
  },
  noise: {
    dangerous: 85, // dB
    high: 70,
    moderate: 55
  }
}

// Configuration de la carte
export const MAP_CONFIG = {
  center: [33.5731, -7.5898],
  zoom: 12,
  minZoom: 10,
  maxZoom: 18
}

// Intervalles de rafraîchissement (ms)
export const REFRESH_INTERVALS = {
  realtime: 5000,    // 5 secondes
  normal: 30000,     // 30 secondes
  slow: 60000        // 1 minute
}

// Types de signalements citoyens
export const REPORT_TYPES = [
  { value: 'traffic', label: 'Embouteillage', icon: '🚗' },
  { value: 'noise', label: 'Bruit excessif', icon: '🔊' },
  { value: 'pollution', label: 'Pollution', icon: '🌫️' },
  { value: 'other', label: 'Autre', icon: '📝' }
]