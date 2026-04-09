import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Layout } from "./components/Layout"
import { LandingPage } from "./pages/LandingPage"
import { Dashboard } from "./pages/Dashboard"
import { PredictionEngine } from "./pages/PredictionEngine"
import { Analytics } from "./pages/Analytics"
import { HistoryPage } from "./pages/HistoryPage"
import { AuthPage } from "./pages/AuthPage"
import { useStore } from "./store/useStore"

function AuthGuard({ children, requireAuth = true }: { children: React.ReactNode, requireAuth?: boolean }) {
  const { session } = useStore()
  
  if (requireAuth && !session) {
    return <Navigate to="/login" replace />
  }
  
  if (!requireAuth && session) {
    return <Navigate to="/dashboard" replace />
  }
  
  return <>{children}</>
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={
            <AuthGuard requireAuth={false}>
              <AuthPage mode="login" />
            </AuthGuard>
          } />
          <Route path="/register" element={
            <AuthGuard requireAuth={false}>
              <AuthPage mode="register" />
            </AuthGuard>
          } />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          } />
          <Route path="/predict" element={
            <AuthGuard>
              <PredictionEngine />
            </AuthGuard>
          } />
          <Route path="/analytics" element={
            <AuthGuard>
              <Analytics />
            </AuthGuard>
          } />
          <Route path="/history" element={
            <AuthGuard>
              <HistoryPage />
            </AuthGuard>
          } />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
