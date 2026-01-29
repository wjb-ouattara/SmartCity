# 🌍 SmartCity Casablanca - Frontend

Système intelligent d'alerte sur la surcharge urbaine (trafic, bruit, pollution)

## 🚀 Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Créer le fichier .env
cp .env.example .env

# 3. Lancer le serveur de développement
npm run dev

# 4. Build pour production
npm run build
```

## 📋 Prérequis

- Node.js 18+
- npm 9+

## 🛠️ Technologies

- **React 18** - Framework UI
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Leaflet** - Cartes interactives
- **Recharts** - Graphiques
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **Socket.IO** - WebSocket

## 📁 Structure

```
src/
├── components/       # Composants réutilisables
│   ├── layout/      # MainLayout, Navbar, Sidebar
│   ├── cards/       # MetricCard, StatCard
│   ├── maps/        # Composants carte
│   ├── charts/      # Graphiques
│   └── alerts/      # Alertes et notifications
├── pages/           # Pages de l'application
├── services/        # Services API
├── utils/           # Utilitaires
├── hooks/           # Custom hooks
└── context/         # Context providers
```

## 🎨 Pages

- `/` - Dashboard principal
- `/traffic` - Vue détaillée trafic
- `/pollution` - Qualité de l'air
- `/noise` - Carte de bruit
- `/reports` - Signalements citoyens
- `/analytics` - Statistiques
- `/alerts` - Alertes actives
- `/settings` - Paramètres

## 🔧 Configuration

Créer un fichier `.env` :

```env
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=http://localhost:5000
```

## 📦 Scripts

```bash
npm run dev      # Serveur de développement
npm run build    # Build production
npm run preview  # Prévisualiser le build
npm run lint     # Linter
```

## 🎯 Fonctionnalités

✅ Dashboard temps réel  
✅ Cartes interactives multi-couches  
✅ Système d'alertes  
✅ Signalements citoyens  
✅ Analytics avancés  
✅ Responsive design  
✅ Dark mode  
✅ Animations fluides  

## 📖 Documentation

Voir `/docs` pour la documentation complète.

## 👥 Auteurs

Projet de Veille Technologique - 4ème année Génie Informatique