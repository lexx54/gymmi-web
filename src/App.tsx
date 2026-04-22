import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { PrivateRoute } from './components/PrivateRoute'
import { PublicRoute } from './components/PublicRoute'
import { DashboardLayout } from './components/layout/DashboardLayout'
import AnalyticsPage from './pages/AnalyticsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import WorkoutsPage from './pages/WorkoutsPage'

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/workouts" element={<WorkoutsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}

export default App
