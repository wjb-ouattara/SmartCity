import api from './api'

export const trafficService = {
  // Récupérer les données de trafic actuelles
  getCurrent: async () => {
    try {
      const response = await api.get('/traffic/current')
      return response.data
    } catch (error) {
      console.error('Error fetching traffic data:', error)
      throw error
    }
  },

  // Récupérer les données par zone
  getByZone: async (zone) => {
    try {
      const response = await api.get(`/traffic/zone/${zone}`)
      return response.data
    } catch (error) {
      console.error('Error fetching zone traffic:', error)
      throw error
    }
  },

  // Récupérer l'historique
  getHistorical: async (startDate, endDate) => {
    try {
      const response = await api.get('/traffic/historical', {
        params: { start: startDate, end: endDate }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching historical traffic:', error)
      throw error
    }
  },

  // Récupérer les statistiques
  getStats: async () => {
    try {
      const response = await api.get('/traffic/stats')
      return response.data
    } catch (error) {
      console.error('Error fetching traffic stats:', error)
      throw error
    }
  }
}