import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Wallet,
  Box,
  Building2,
  Trash2,
  Network,
  Settings,
  BotMessageSquare,
  CreditCard,
  Mic,
  Receipt,
  UserCog,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import useMainStore from '@/stores/useMainStore'
import { PLANS, FeatureId } from '@/lib/plans'
import { useAuth } from '@/hooks/use-auth'

export function Sidebar() {
  const location = useLocation()
  const { currentPlan } = useMainStore()
  const { user } = useAuth()
  const planFeatures = PLANS[currentPlan].features

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/clients', label: 'Clientes', icon: Users, feature: 'clients' },
    { href: '/resellers', label: 'Revendas', icon: Network, feature: 'resellers' },
    { href: '/finance', label: 'Extrato', icon: Wallet, feature: 'finance' },
    { href: '/inventory', label: 'Estoque & Serviços', icon: Box, feature: 'inventory' },
    { href: '/banks', label: 'Bancos', icon: Building2, feature: 'banks' },
    { href: '/payables', label: 'Contas a Pagar', icon: Receipt, feature: 'payables' },
    { href: '/voice', label: 'Assistente Voz', icon: Mic, feature: 'voice' },
    {
      href: '/interactions',
      label: 'Atendimento IA',
      icon: BotMessageSquare,
      feature: 'ai_whatsapp',
    },
    { href: '/settings', label: 'Configurações', icon: Settings },
    { href: '/billing', label: 'Assinatura', icon: CreditCard },
    { href: '/trash', label: 'Lixeira', icon: Trash2 },
  ]

  const visibleItems = navItems.filter(
    (item) => !item.feature || planFeatures.includes(item.feature as FeatureId),
  )

  if (user?.role === 'admin') {
    visibleItems.splice(visibleItems.length - 1, 0, {
      href: '/admin/users',
      label: 'Gestão de Usuários',
      icon: UserCog,
      feature: undefined as any,
    })
  }

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border h-full">
      <div className="p-6">
        <h1 className="text-xl font-bold text-primary tracking-tight">FinanceFlow</h1>
        <p className="text-xs text-muted-foreground mt-1">CRM Operacional</p>
      </div>
      <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto pb-4">
        {visibleItems.map((item) => {
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
