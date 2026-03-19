import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Wallet, Box, Building2, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const location = useLocation()

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/clients', label: 'Clientes', icon: Users },
    { href: '/finance', label: 'Extrato', icon: Wallet },
    { href: '/inventory', label: 'Estoque & Serviços', icon: Box },
    { href: '/banks', label: 'Bancos', icon: Building2 },
    { href: '/trash', label: 'Lixeira', icon: Trash2 },
  ]

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border h-full">
      <div className="p-6">
        <h1 className="text-xl font-bold text-primary tracking-tight">FinanceFlow</h1>
        <p className="text-xs text-muted-foreground mt-1">CRM Operacional</p>
      </div>
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
