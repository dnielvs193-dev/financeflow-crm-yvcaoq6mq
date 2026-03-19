import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header({ title }: { title: string }) {
  return (
    <header className="h-16 px-4 md:px-6 bg-background border-b border-border flex items-center justify-between z-10 shrink-0">
      <h1 className="text-lg font-semibold tracking-tight hidden md:block">{title}</h1>
      <h1 className="text-lg font-bold text-primary tracking-tight md:hidden">FinanceFlow</h1>

      <div className="flex items-center gap-4 ml-auto">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bell className="w-5 h-5" />
        </Button>
        <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
          <span className="text-sm font-medium text-primary">AD</span>
        </div>
      </div>
    </header>
  )
}
