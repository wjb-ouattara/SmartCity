// Couleurs pour les niveaux de trafic
export const TRAFFIC_COLORS = {
  fluid: {
    bg: 'bg-green-500',
    text: 'text-green-500',
    border: 'border-green-500',
    hex: '#10b981'
  },
  moderate: {
    bg: 'bg-yellow-500',
    text: 'text-yellow-500',
    border: 'border-yellow-500',
    hex: '#f59e0b'
  },
  dense: {
    bg: 'bg-orange-500',
    text: 'text-orange-500',
    border: 'border-orange-500',
    hex: '#fb923c'
  },
  jammed: {
    bg: 'bg-red-500',
    text: 'text-red-500',
    border: 'border-red-500',
    hex: '#ef4444'
  }
}

// Couleurs pour la qualité de l'air
export const AIR_QUALITY_COLORS = {
  good: {
    bg: 'bg-green-500',
    text: 'text-green-500',
    hex: '#10b981',
    label: 'Bon'
  },
  moderate: {
    bg: 'bg-yellow-500',
    text: 'text-yellow-500',
    hex: '#f59e0b',
    label: 'Modéré'
  },
  unhealthy: {
    bg: 'bg-orange-500',
    text: 'text-orange-500',
    hex: '#fb923c',
    label: 'Mauvais'
  },
  dangerous: {
    bg: 'bg-red-500',
    text: 'text-red-500',
    hex: '#ef4444',
    label: 'Dangereux'
  }
}

// Fonction utilitaire pour obtenir la couleur selon la vitesse
export const getTrafficColor = (speed) => {
  if (speed > 50) return TRAFFIC_COLORS.fluid
  if (speed > 30) return TRAFFIC_COLORS.moderate
  if (speed > 15) return TRAFFIC_COLORS.dense
  return TRAFFIC_COLORS.jammed
}

// Fonction utilitaire pour obtenir la couleur selon l'AQI
export const getAQIColor = (aqi) => {
  if (aqi <= 50) return AIR_QUALITY_COLORS.good
  if (aqi <= 100) return AIR_QUALITY_COLORS.moderate
  if (aqi <= 150) return AIR_QUALITY_COLORS.unhealthy
  return AIR_QUALITY_COLORS.dangerous
}

// Fonction utilitaire pour obtenir la couleur selon le niveau de bruit
export const getNoiseColor = (decibels) => {
  if (decibels < 55) return TRAFFIC_COLORS.fluid
  if (decibels < 70) return TRAFFIC_COLORS.moderate
  if (decibels < 85) return TRAFFIC_COLORS.dense
  return TRAFFIC_COLORS.jammed
}