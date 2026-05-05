import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { PrivateRoute } from './components/PrivateRoute'
import { PublicRoute } from './components/PublicRoute'
import { DashboardLayout } from './components/layout/DashboardLayout'
import AnalyticsPage from './pages/AnalyticsPage'
import ExerciseBuilderPage from './pages/ExerciseBuilderPage'
import ExercisesPage from './pages/ExercisesPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
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
          <Route path="/exercises" element={<ExercisesPage />} />
          <Route path="/exercises/new" element={<ExerciseBuilderPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}

export default App
