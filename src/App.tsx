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
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import { MainStoreProvider } from './stores/useMainStore'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <MainStoreProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/resellers" element={<Resellers />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/banks" element={<Banks />} />
            <Route path="/payables" element={<Payables />} />
            <Route path="/trash" element={<Trash />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </MainStoreProvider>
  </BrowserRouter>
)

export default App
