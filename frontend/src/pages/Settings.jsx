import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, User, Bell, Database, Shield, Palette, Save, RefreshCw, AlertCircle } from 'lucide-react'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    // General
    appName: 'SmartCity Casablanca',
    language: 'fr',
    timezone: 'Africa/Casablanca',
    dateFormat: 'DD/MM/YYYY',
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    alertThreshold: 'high',
    notificationSound: true,
    
    // Display
    theme: 'dark',
    accentColor: 'cyan',
    mapStyle: 'dark',
    chartAnimation: true,
    compactMode: false,
    
    // Data
    dataRetention: '90',
    autoRefresh: true,
    refreshInterval: '30',
    enableCache: true,
    
    // Security
    twoFactor: false,
    sessionTimeout: '60',
    ipWhitelist: false,
    apiRateLimit: '1000',
  })

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    console.log('Settings saved:', settings)
    alert('✅ Paramètres sauvegardés avec succès !')
  }

  const handleReset = () => {
    if (confirm('⚠️ Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
      window.location.reload()
    }
  }

  const tabs = [
    { id: 'general', label: 'Général', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'display', label: 'Affichage', icon: Palette },
    { id: 'data', label: 'Données', icon: Database },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'account', label: 'Compte', icon: User },
  ]

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
              <span className="gradient-text">Paramètres</span>
            </h1>
            <p className="text-gray-400 text-lg">Configuration de l'application</p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleReset} className="btn-secondary">
              <RefreshCw className="w-5 h-5 inline mr-2" />
              Réinitialiser
            </button>
            <button onClick={handleSave} className="btn-primary">
              <Save className="w-5 h-5 inline mr-2" />
              Enregistrer
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-4 border border-slate-700/50 sticky top-24"
          >
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                      ${activeTab === tab.id 
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30' 
                        : 'text-gray-400 hover:bg-slate-800/50 hover:text-white'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </motion.div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-8 border border-slate-700/50"
          >
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Paramètres Généraux</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">
                      Nom de l'application
                    </label>
                    <input
                      type="text"
                      value={settings.appName}
                      onChange={(e) => handleChange('appName', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">
                      Langue
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleChange('language', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="fr">Français</option>
                      <option value="ar">العربية</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">
                      Fuseau horaire
                    </label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => handleChange('timezone', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="Africa/Casablanca">Casablanca (GMT+1)</option>
                      <option value="Europe/Paris">Paris (GMT+2)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">
                      Format de date
                    </label>
                    <select
                      value={settings.dateFormat}
                      onChange={(e) => handleChange('dateFormat', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="DD/MM/YYYY">JJ/MM/AAAA</option>
                      <option value="MM/DD/YYYY">MM/JJ/AAAA</option>
                      <option value="YYYY-MM-DD">AAAA-MM-JJ</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Notifications</h2>
                  <p className="text-gray-400">Configurez vos préférences de notification</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl">
                    <div>
                      <h4 className="text-white font-semibold mb-1">Notifications Email</h4>
                      <p className="text-sm text-gray-400">Recevoir les alertes par email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl">
                    <div>
                      <h4 className="text-white font-semibold mb-1">Notifications SMS</h4>
                      <p className="text-sm text-gray-400">Recevoir les alertes critiques par SMS</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.smsNotifications}
                        onChange={(e) => handleChange('smsNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl">
                    <div>
                      <h4 className="text-white font-semibold mb-1">Notifications Push</h4>
                      <p className="text-sm text-gray-400">Notifications dans le navigateur</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications}
                        onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl">
                    <div>
                      <h4 className="text-white font-semibold mb-1">Son des notifications</h4>
                      <p className="text-sm text-gray-400">Jouer un son pour les nouvelles alertes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notificationSound}
                        onChange={(e) => handleChange('notificationSound', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Seuil d'alerte minimum
                  </label>
                  <select
                    value={settings.alertThreshold}
                    onChange={(e) => handleChange('alertThreshold', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="all">Toutes les alertes</option>
                    <option value="medium">Moyenne et supérieure</option>
                    <option value="high">Haute et critique</option>
                    <option value="critical">Critique uniquement</option>
                  </select>
                </div>
              </div>
            )}

            {/* Display Settings */}
            {activeTab === 'display' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Affichage</h2>
                  <p className="text-gray-400">Personnalisez l'apparence de l'interface</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-4">
                      Thème
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {['dark', 'light', 'auto'].map(theme => (
                        <button
                          key={theme}
                          onClick={() => handleChange('theme', theme)}
                          className={`p-4 rounded-xl border transition-all ${
                            settings.theme === theme
                              ? 'border-cyan-500 bg-cyan-500/10'
                              : 'border-slate-700 bg-slate-800/30 hover:bg-slate-800/50'
                          }`}
                        >
                          <div className={`w-full h-16 rounded-lg mb-2 ${
                            theme === 'dark' ? 'bg-slate-900' :
                            theme === 'light' ? 'bg-white' :
                            'bg-gradient-to-r from-slate-900 to-white'
                          }`}></div>
                          <p className="text-white font-semibold capitalize">
                            {theme === 'auto' ? 'Auto' : theme === 'dark' ? 'Sombre' : 'Clair'}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-4">
                      Couleur d'accentuation
                    </label>
                    <div className="grid grid-cols-6 gap-3">
                      {[
                        { name: 'cyan', color: '#06b6d4' },
                        { name: 'blue', color: '#3b82f6' },
                        { name: 'purple', color: '#8b5cf6' },
                        { name: 'pink', color: '#ec4899' },
                        { name: 'green', color: '#10b981' },
                        { name: 'orange', color: '#f59e0b' },
                      ].map(({ name, color }) => (
                        <button
                          key={name}
                          onClick={() => handleChange('accentColor', name)}
                          className={`w-12 h-12 rounded-xl transition-all ${
                            settings.accentColor === name
                              ? 'ring-2 ring-offset-2 ring-offset-slate-900 scale-110'
                              : 'hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                        ></button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">
                      Style de carte
                    </label>
                    <select
                      value={settings.mapStyle}
                      onChange={(e) => handleChange('mapStyle', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="dark">Sombre</option>
                      <option value="light">Clair</option>
                      <option value="satellite">Satellite</option>
                      <option value="streets">Rues</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl">
                    <div>
                      <h4 className="text-white font-semibold mb-1">Animations des graphiques</h4>
                      <p className="text-sm text-gray-400">Activer les animations</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.chartAnimation}
                        onChange={(e) => handleChange('chartAnimation', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Data Settings */}
            {activeTab === 'data' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Données</h2>
                  <p className="text-gray-400">Gestion des données et du cache</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">
                      Rétention des données (jours)
                    </label>
                    <select
                      value={settings.dataRetention}
                      onChange={(e) => handleChange('dataRetention', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="30">30 jours</option>
                      <option value="90">90 jours</option>
                      <option value="180">180 jours</option>
                      <option value="365">1 an</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl">
                    <div>
                      <h4 className="text-white font-semibold mb-1">Rafraîchissement automatique</h4>
                      <p className="text-sm text-gray-400">Mise à jour auto des données</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoRefresh}
                        onChange={(e) => handleChange('autoRefresh', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                  </div>

                  {settings.autoRefresh && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        Intervalle (secondes)
                      </label>
                      <select
                        value={settings.refreshInterval}
                        onChange={(e) => handleChange('refreshInterval', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="5">5 secondes</option>
                        <option value="30">30 secondes</option>
                        <option value="60">1 minute</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Sécurité</h2>
                  <p className="text-gray-400">Protégez votre compte</p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl">
                    <div>
                      <h4 className="text-white font-semibold mb-1">Authentification 2FA</h4>
                      <p className="text-sm text-gray-400">Code OTP supplémentaire</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.twoFactor}
                        onChange={(e) => handleChange('twoFactor', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">
                      Expiration de session (minutes)
                    </label>
                    <select
                      value={settings.sessionTimeout}
                      onChange={(e) => handleChange('sessionTimeout', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 heure</option>
                      <option value="never">Jamais</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Account Settings */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Compte</h2>
                  <p className="text-gray-400">Informations personnelles</p>
                </div>

                <div className="flex items-center gap-6 p-6 bg-slate-800/30 rounded-xl">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">Administrateur</h3>
                    <p className="text-gray-400">admin@smartcity.ma</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">Nom complet</label>
                    <input
                      type="text"
                      defaultValue="Admin SmartCity"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="admin@smartcity.ma"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      defaultValue="+212 6 12 34 56 78"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-700">
                  <h3 className="text-lg font-bold text-white mb-4">Changer le mot de passe</h3>
                  <div className="space-y-4">
                    <input
                      type="password"
                      placeholder="Mot de passe actuel"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <input
                      type="password"
                      placeholder="Nouveau mot de passe"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <input
                      type="password"
                      placeholder="Confirmer le mot de passe"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <button className="btn-primary w-full">
                      Mettre à jour
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}