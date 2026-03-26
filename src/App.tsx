import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import Clients from './pages/Clients'
import Finance from './pages/Finance'
import Inventory from './pages/Inventory'
import Banks from './pages/Banks'
import Trash from './pages/Trash'
import Resellers from './pages/Resellers'
import Payables from './pages/Payables'
import Settings from './pages/Settings'
import Interactions from './pages/Interactions'
import Billing from './pages/Billing'
import VoiceAssistant from './pages/VoiceAssistant'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import AdminUsers from './pages/AdminUsers'
import Profile from './pages/Profile'
import Layout from './components/Layout'
import { MainStoreProvider } from './stores/useMainStore'
import { FeatureGate } from './components/FeatureGate'
import { AuthProvider, useAuth } from './hooks/use-auth'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return children
}

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <AuthProvider>
      <MainStoreProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Index />} />
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <AdminUsers />
                  </AdminRoute>
                }
              />
              <Route path="/billing" element={<Billing />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/resellers" element={<Resellers />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/trash" element={<Trash />} />
              <Route
                path="/voice"
                element={
                  <FeatureGate feature="voice">
                    <VoiceAssistant />
                  </FeatureGate>
                }
              />
              <Route
                path="/interactions"
                element={
                  <FeatureGate feature="ai_whatsapp">
                    <Interactions />
                  </FeatureGate>
                }
              />
              <Route
                path="/finance"
                element={
                  <FeatureGate feature="finance">
                    <Finance />
                  </FeatureGate>
                }
              />
              <Route
                path="/inventory"
                element={
                  <FeatureGate feature="inventory">
                    <Inventory />
                  </FeatureGate>
                }
              />
              <Route
                path="/banks"
                element={
                  <FeatureGate feature="banks">
                    <Banks />
                  </FeatureGate>
                }
              />
              <Route
                path="/payables"
                element={
                  <FeatureGate feature="payables">
                    <Payables />
                  </FeatureGate>
                }
              />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </MainStoreProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
