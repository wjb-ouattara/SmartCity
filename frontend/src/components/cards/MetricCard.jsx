import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function MetricCard({ title, value, metric, change, icon: Icon, color = 'cyan' }) {
  const getTrendIcon = () => {
    if (!change) return <Minus className="w-4 h-4" />
    const isPositive = !change.startsWith('-')
    return isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />
  }

  const getTrendColor = () => {
    if (!change) return 'text-gray-400'
    const isPositive = !change.startsWith('-')
    // Pour le trafic/pollution, une hausse est négative
    if (title === 'Trafic' || title === 'Pollution' || title === 'Bruit') {
      return isPositive ? 'text-red-400' : 'text-green-400'
    }
    return isPositive ? 'text-green-400' : 'text-red-400'
  }

  const colorSchemes = {
    cyan: {
      icon: 'bg-cyan-500/10 text-cyan-400',
      border: 'border-cyan-500/20',
      glow: 'hover:shadow-glow-cyan'
    },
    green: {
      icon: 'bg-green-500/10 text-green-400',
      border: 'border-green-500/20',
      glow: 'hover:shadow-glow-cyan'
    },
    yellow: {
      icon: 'bg-yellow-500/10 text-yellow-400',
      border: 'border-yellow-500/20',
      glow: 'hover:shadow-glow-cyan'
    },
    orange: {
      icon: 'bg-orange-500/10 text-orange-400',
      border: 'border-orange-500/20',
      glow: 'hover:shadow-glow-cyan'
    },
    red: {
      icon: 'bg-red-500/10 text-red-400',
      border: 'border-red-500/20',
      glow: 'hover:shadow-glow-cyan'
    }
  }

  const scheme = colorSchemes[color] || colorSchemes.cyan

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`
        glass rounded-2xl p-6 
        border ${scheme.border}
        transition-all duration-300 
        ${scheme.glow}
        card-hover
      `}
    >
      {/* Header avec icône et tendance */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${scheme.icon}`}>
          <Icon className="w-6 h-6" />
        </div>
        
        {change && (
          <div className={`flex items-center gap-1 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="text-sm font-semibold">{change.replace('-', '')}</span>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">
          {title}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-white">
            {value}
          </span>
          {metric && (
            <span className="text-lg text-gray-500 font-medium">
              {metric}
            </span>
          )}
        </div>
      </div>

      {/* Barre de progression optionnelle */}
      <div className="mt-4 h-1 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '70%' }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`h-full bg-gradient-to-r ${
            color === 'green' ? 'from-green-500 to-emerald-500' :
            color === 'yellow' ? 'from-yellow-500 to-amber-500' :
            color === 'orange' ? 'from-orange-500 to-red-500' :
            color === 'red' ? 'from-red-500 to-rose-500' :
            'from-cyan-500 to-blue-500'
          }`}
        />
      </div>
    </motion.div>
  )
}