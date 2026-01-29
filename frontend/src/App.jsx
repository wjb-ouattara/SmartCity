import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Dashboard from './pages/Dashboard'
import TrafficView from './pages/TrafficView'
import AirQualityView from './pages/AirQualityView'
import NoiseView from './pages/NoiseView'
import CitizenReports from './pages/CitizenReports'
import Analytics from './pages/Analytics'
import AlertsView from './pages/AlertsView'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="traffic" element={<TrafficView />} />
          <Route path="pollution" element={<AirQualityView />} />
          <Route path="noise" element={<NoiseView />} />
          <Route path="reports" element={<CitizenReports />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="alerts" element={<AlertsView />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}