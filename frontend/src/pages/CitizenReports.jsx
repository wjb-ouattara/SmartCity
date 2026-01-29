import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Plus, Filter, Search, MapPin, Clock, Car, Wind, Volume2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export default function CitizenReports() {
  const [showModal, setShowModal] = useState(false)
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data
  const reports = [
    {
      id: 1,
      type: 'traffic',
      title: 'Embouteillage Boulevard Zerktouni',
      description: 'Trafic complètement bloqué depuis 30 minutes',
      location: 'Boulevard Zerktouni, Maarif',
      coordinates: [33.5731, -7.6298],
      reporter: 'Ahmed M.',
      time: 'Il y a 15 min',
      status: 'pending',
      votes: 12,
      images: 1
    },
    {
      id: 2,
      type: 'noise',
      title: 'Bruit excessif discothèque',
      description: 'Musique forte jusqu\'à 2h du matin tous les weekends',
      location: 'Rue de Fès, Anfa',
      coordinates: [33.5822, -7.6394],
      reporter: 'Fatima Z.',
      time: 'Il y a 1h',
      status: 'verified',
      votes: 8,
      images: 0
    },
    {
      id: 3,
      type: 'pollution',
      title: 'Fumée épaisse usine',
      description: 'Fumée noire sortant de la cheminée, forte odeur',
      location: 'Zone Industrielle, Hay Hassani',
      coordinates: [33.5628, -7.5898],
      reporter: 'Youssef K.',
      time: 'Il y a 2h',
      status: 'resolved',
      votes: 5,
      images: 2
    },
    {
      id: 4,
      type: 'traffic',
      title: 'Feu rouge défectueux',
      description: 'Le feu ne fonctionne plus, risque d\'accident',
      location: 'Carrefour Ain Diab',
      coordinates: [33.5892, -7.6856],
      reporter: 'Karim L.',
      time: 'Il y a 3h',
      status: 'pending',
      votes: 15,
      images: 1
    },
    {
      id: 5,
      type: 'noise',
      title: 'Travaux nocturnes',
      description: 'Chantier qui fait du bruit après 22h',
      location: 'Avenue Hassan II',
      coordinates: [33.5731, -7.5898],
      reporter: 'Sara B.',
      time: 'Il y a 5h',
      status: 'verified',
      votes: 20,
      images: 0
    },
  ]

  const getTypeIcon = (type) => {
    switch (type) {
      case 'traffic': return <Car className="w-5 h-5" />
      case 'noise': return <Volume2 className="w-5 h-5" />
      case 'pollution': return <Wind className="w-5 h-5" />
      default: return <AlertCircle className="w-5 h-5" />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'traffic': return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
      case 'noise': return 'text-purple-400 bg-purple-500/10 border-purple-500/20'
      case 'pollution': return 'text-orange-400 bg-orange-500/10 border-orange-500/20'
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'verified': return <CheckCircle className="w-4 h-4" />
      case 'resolved': return <CheckCircle className="w-4 h-4" />
      default: return <XCircle className="w-4 h-4" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-500/10'
      case 'verified': return 'text-cyan-400 bg-cyan-500/10'
      case 'resolved': return 'text-green-400 bg-green-500/10'
      default: return 'text-red-400 bg-red-500/10'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'En attente'
      case 'verified': return 'Vérifié'
      case 'resolved': return 'Résolu'
      default: return 'Rejeté'
    }
  }

  const filteredReports = reports.filter(report => {
    const matchType = filterType === 'all' || report.type === filterType
    const matchStatus = filterStatus === 'all' || report.status === filterStatus
    const matchSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       report.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchType && matchStatus && matchSearch
  })

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    verified: reports.filter(r => r.status === 'verified').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
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
              <span className="gradient-text">Signalements Citoyens</span>
            </h1>
            <p className="text-gray-400 text-lg">Participez à l'amélioration de votre ville</p>
          </div>

          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            <Plus className="w-5 h-5 inline mr-2" />
            Nouveau Signalement
          </button>
        </div>
      </motion.div>

      {/* Statistics */}
      <section className="section">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 border border-slate-700/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-cyan-500/10 rounded-xl">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-2">Total Signalements</h3>
            <p className="text-4xl font-bold text-white">{stats.total}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6 border border-slate-700/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/10 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-2">En Attente</h3>
            <p className="text-4xl font-bold text-white">{stats.pending}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6 border border-slate-700/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-cyan-500/10 rounded-xl">
                <CheckCircle className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-2">Vérifiés</h3>
            <p className="text-4xl font-bold text-white">{stats.verified}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6 border border-slate-700/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-2">Résolus</h3>
            <p className="text-4xl font-bold text-white">{stats.resolved}</p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-slate-700/50"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un signalement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">Tous les types</option>
              <option value="traffic">Trafic</option>
              <option value="noise">Bruit</option>
              <option value="pollution">Pollution</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="verified">Vérifiés</option>
              <option value="resolved">Résolus</option>
            </select>
          </div>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="section">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-2xl overflow-hidden border border-slate-700/50 h-[600px]"
            >
              <MapContainer
                center={[33.5731, -7.5898]}
                zoom={12}
                className="h-full w-full"
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                {filteredReports.map((report) => (
                  <Marker key={report.id} position={report.coordinates}>
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold text-lg mb-2">{report.title}</h3>
                        <p className="text-sm mb-2">{report.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span>{report.location}</span>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </motion.div>
          </div>

          {/* Reports List */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-2xl p-6 border border-slate-700/50"
            >
              <h3 className="text-xl font-bold text-white mb-6">
                Signalements ({filteredReports.length})
              </h3>

              <div className="space-y-4 max-h-[530px] overflow-y-auto custom-scrollbar pr-2">
                {filteredReports.map((report, idx) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg border ${getTypeColor(report.type)}`}>
                        {getTypeIcon(report.type)}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(report.status)}`}>
                        {getStatusIcon(report.status)}
                        {getStatusLabel(report.status)}
                      </span>
                    </div>

                    <h4 className="text-white font-semibold mb-2 text-sm">{report.title}</h4>
                    <p className="text-gray-400 text-xs mb-3 line-clamp-2">{report.description}</p>

                    <div className="space-y-2 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{report.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          <span>{report.time}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {report.images > 0 && (
                            <span className="text-cyan-400">📷 {report.images}</span>
                          )}
                          <span className="text-cyan-400">👍 {report.votes}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* New Report Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="glass rounded-2xl p-8 border border-slate-700/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Nouveau Signalement</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Type de problème</label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { type: 'traffic', label: 'Trafic', icon: Car },
                      { type: 'noise', label: 'Bruit', icon: Volume2 },
                      { type: 'pollution', label: 'Pollution', icon: Wind },
                    ].map(({ type, label, icon: Icon }) => (
                      <button
                        key={type}
                        type="button"
                        className={`p-4 rounded-xl border transition-all ${getTypeColor(type)} hover:bg-slate-800/50`}
                      >
                        <Icon className="w-6 h-6 mx-auto mb-2" />
                        <span className="text-sm font-semibold">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Titre</label>
                  <input
                    type="text"
                    placeholder="Décrivez brièvement le problème"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Description</label>
                  <textarea
                    rows={4}
                    placeholder="Décrivez en détail le problème rencontré..."
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Localisation</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Adresse ou lieu précis"
                      className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Photos (optionnel)</label>
                  <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-cyan-500 transition-colors cursor-pointer">
                    <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-400">Cliquez pour ajouter des photos</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    Envoyer le Signalement
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}