export default function Footer() {
  return (
    <footer className="mt-12 py-6 border-t border-white/10">
      <div className="px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2026 SmartCity Casablanca - Projet de Veille Technologique Big Data
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">API</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Support</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  )
}