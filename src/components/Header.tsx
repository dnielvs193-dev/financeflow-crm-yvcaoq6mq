import { Bell, LogOut, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useNavigate, Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import pb from '@/lib/pocketbase/client'

export function Header({ title }: { title: string }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    signOut()
    navigate('/login')
  }

  const avatarUrl = user?.avatar ? pb.files.getURL(user, user.avatar) : ''

  return (
    <header className="h-16 px-4 md:px-6 bg-background border-b border-border flex items-center justify-between z-10 shrink-0">
      <h1 className="text-lg font-semibold tracking-tight hidden md:block">{title}</h1>
      <h1 className="text-lg font-bold text-primary tracking-tight md:hidden">FinanceFlow</h1>

      <div className="flex items-center gap-4 ml-auto">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bell className="w-5 h-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full ml-1">
              <Avatar className="h-9 w-9 border border-primary/20">
                <AvatarImage src={avatarUrl} alt={user?.name || 'User'} className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                  {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name || 'Usuário'}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                {user?.role === 'admin' && (
                  <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded w-fit mt-1">
                    ADMIN
                  </span>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to="/profile" className="flex w-full items-center">
                <UserIcon className="mr-2 h-4 w-4" /> Meu Perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
