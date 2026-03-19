import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Wallet, Box, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MobileNav() {
  const location = useLocation()

  const navItems = [
    { href: '/', label: 'Resumo', icon: LayoutDashboard },
    { href: '/clients', label: 'Clientes', icon: Users },
    { href: '/finance', label: 'Extrato', icon: Wallet },
    { href: '/inventory', label: 'Estoque', icon: Box },
    { href: '/banks', label: 'Mais', icon: MoreHorizontal },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border flex items-center justify-around px-2 pb-safe pt-2 z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'flex flex-col items-center justify-center w-16 h-14 text-xs font-medium transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="scale-90">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
