import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, BadgeDollarSign, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { icon: LayoutDashboard, label: 'Início', path: '/' },
  { icon: Users, label: 'Clientes', path: '/clients' },
  { icon: BadgeDollarSign, label: 'Finanças', path: '/finance' },
  { icon: Building2, label: 'Bancos', path: '/banks' },
]

export function MobileNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 z-50 flex h-16 w-full items-center justify-around border-t bg-background px-2 md:hidden pb-safe">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path
        return (
          <Link
            key={item.path}
            to={item.path}
            className="flex flex-col items-center justify-center w-full h-full space-y-1"
          >
            <item.icon
              className={cn(
                'h-5 w-5 transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground',
              )}
            />
            <span
              className={cn(
                'text-[10px] font-medium',
                isActive ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
