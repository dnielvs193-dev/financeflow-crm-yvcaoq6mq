import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { MobileNav } from './MobileNav'

const routeTitles: Record<string, string> = {
  '/': 'Dashboard Overview',
  '/clients': 'Módulo de Clientes',
  '/interactions': 'Atendimento Inteligente',
  '/resellers': 'Módulo de Revendas',
  '/finance': 'Módulo Financeiro',
  '/banks': 'Bancos e Contas',
  '/settings': 'Configurações de Mensagens',
  '/trash': 'Lixeira',
}

export default function Layout() {
  const location = useLocation()
  const title = routeTitles[location.pathname] || 'FinanceFlow CRM'

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-primary/20">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={title} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6 animate-fade-in">
          <div className="mx-auto max-w-7xl w-full">
            <Outlet />
          </div>
        </main>
        <MobileNav />
      </div>
    </div>
  )
}
