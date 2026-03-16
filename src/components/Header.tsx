import { Bell, Search, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function Header({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/80 px-4 md:px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold hidden md:block">{title}</h1>
        <div className="md:hidden flex items-center gap-2 text-primary font-bold">
          <span className="text-xl">FinanceFlow</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar clientes..."
            className="w-[200px] lg:w-[300px] pl-9 bg-muted/50 border-none rounded-full"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
        >
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
