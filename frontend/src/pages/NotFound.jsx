import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-9xl font-bold gradient-text mb-4">404</h1>
      <h2 className="text-3xl font-bold text-white mb-4">Page Non Trouvée</h2>
      <p className="text-gray-400 mb-8">
        Désolé, la page que vous recherchez n'existe pas.
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:scale-105 transition-transform"
      >
        <Home className="w-5 h-5" />
        Retour au Dashboard
      </Link>
    </div>
  )
}