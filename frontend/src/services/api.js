import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Intercepteur pour les requêtes
api.interceptors.request.use(
  (config) => {
    // Ajouter un token si nécessaire
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    
    // Gestion des erreurs globales
    if (error.response?.status === 401) {
      // Redirection vers login si nécessaire
      console.log('Unauthorized')
    } else if (error.response?.status === 500) {
      console.error('Server error')
    }
    
    return Promise.reject(error)
  }
)

export default api