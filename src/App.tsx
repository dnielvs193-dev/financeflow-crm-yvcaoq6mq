import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import Layout from './components/Layout'
import { MainStoreProvider } from './stores/useMainStore'
import { FeatureGate } from './components/FeatureGate'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <MainStoreProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
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
  </BrowserRouter>
)

export default App
