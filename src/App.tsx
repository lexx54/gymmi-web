import './App.css'
import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { PrivateRoute } from './components/PrivateRoute'
import { PublicRoute } from './components/PublicRoute'
import { RoleRoute } from './components/RoleRoute'
import { DashboardLayout } from './components/layout/DashboardLayout'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignupPage = lazy(() => import('./pages/SignupPage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))
const ExerciseBuilderPage = lazy(() => import('./pages/ExerciseBuilderPage'))
const ExercisesPage = lazy(() => import('./pages/ExercisesPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const WorkoutLibraryPage = lazy(() => import('./pages/WorkoutLibraryPage'))
const WorkoutsPage = lazy(() => import('./pages/WorkoutsPage'))
const ClientsPage = lazy(() => import('./pages/ClientsPage'))
const TrainersPage = lazy(() => import('./pages/TrainersPage'))
const AdminPermissionsPage = lazy(() => import('./pages/admin/AdminPermissionsPage'))
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'))
const AdminPaymentsPage = lazy(() => import('./pages/admin/AdminPaymentsPage'))
const AdminReportsPage = lazy(() => import('./pages/admin/AdminReportsPage'))
const GymCatalogPage = lazy(() => import('./pages/gym/GymCatalogPage'))
const GymCoachesPage = lazy(() => import('./pages/gym/GymCoachesPage'))
const GymMembersPage = lazy(() => import('./pages/gym/GymMembersPage'))
const GymArticlesPage = lazy(() => import('./pages/gym/GymArticlesPage'))
const ClassificationsPage = lazy(() => import('./pages/classifications/ClassificationsPage'))
const ArticlesPage = lazy(() => import('./pages/ArticlesPage'))
const BillingPage = lazy(() => import('./pages/BillingPage'))

const PageFallback = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
    <div
      style={{
        width: 32,
        height: 32,
        border: '3px solid rgba(255, 255, 255, 0.15)',
        borderTopColor: '#f97316',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    />
  </div>
)

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Suspense fallback={<PageFallback />}>
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/workouts" element={<Navigate to="/workout" replace />} />
          <Route path="/workout" element={<WorkoutLibraryPage />} />
          <Route path="/workout/new" element={<WorkoutsPage />} />
          <Route path="/workout/:id" element={<WorkoutsPage />} />
          <Route path="/workout/:id/edit" element={<WorkoutsPage />} />
          <Route path="/clients" element={<RoleRoute role="Trainer"><ClientsPage /></RoleRoute>} />
          <Route path="/clients/:clientId" element={<RoleRoute role="Trainer"><ClientsPage /></RoleRoute>} />
          <Route path="/classifications" element={<RoleRoute role="Trainer"><ClassificationsPage /></RoleRoute>} />
          <Route path="/trainers" element={<RoleRoute role="Client"><TrainersPage /></RoleRoute>} />
          <Route path="/affiliations" element={<RoleRoute role="Client"><TrainersPage /></RoleRoute>} />
          <Route path="/gym/catalog" element={<RoleRoute role="Gym"><GymCatalogPage /></RoleRoute>} />
          <Route path="/gym/coaches" element={<RoleRoute role="Gym"><GymCoachesPage /></RoleRoute>} />
          <Route path="/gym/members" element={<RoleRoute role="Gym"><GymMembersPage /></RoleRoute>} />
          <Route path="/gym/classifications" element={<RoleRoute role="Gym"><ClassificationsPage /></RoleRoute>} />
          <Route path="/gym/articles" element={<RoleRoute role="Gym"><GymArticlesPage /></RoleRoute>} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/exercises" element={<ExercisesPage />} />
          <Route path="/exercises/new" element={<ExerciseBuilderPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/admin/permissions" element={<RoleRoute role="Admin"><AdminPermissionsPage /></RoleRoute>} />
          <Route path="/admin/users" element={<RoleRoute role="Admin"><AdminUsersPage /></RoleRoute>} />
          <Route path="/admin/payments" element={<RoleRoute role="Admin"><AdminPaymentsPage /></RoleRoute>} />
          <Route path="/admin/reports" element={<RoleRoute role="Admin"><AdminReportsPage /></RoleRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
    </>
  )
}

export default App

