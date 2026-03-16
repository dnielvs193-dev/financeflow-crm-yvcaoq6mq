import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  BadgeDollarSign,
  Building2,
  Trash2,
  PlusCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Clientes', path: '/clients' },
  { icon: BadgeDollarSign, label: 'Financeiro', path: '/finance' },
  { icon: Building2, label: 'Bancos/Contas', path: '/banks' },
  { icon: Trash2, label: 'Lixeira', path: '/trash' },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="hidden w-64 flex-col border-r bg-card md:flex shadow-sm z-40">
      <div className="flex h-16 items-center px-6 border-b">
        <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          FinanceFlow
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link key={item.path} to={item.path}>
              <span
                className={cn(
                  'group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted transition-all duration-200',
                  isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground',
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5',
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
                  )}
                />
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>

      <div className="p-4 border-t">
        <Button className="w-full justify-start gap-2 shadow-md">
          <PlusCircle className="h-4 w-4" />
          Nova Transação
        </Button>
      </div>
    </aside>
  )
}
