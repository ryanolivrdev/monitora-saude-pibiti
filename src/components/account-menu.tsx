import { signOut } from 'firebase/auth'
import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { useAuth } from '@/context/useAuth'
import { auth } from '@/lib/firebase'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function AccountMenu() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const nameInitials = () => {
    if (user?.name) {
      const names = user?.name.split(' ')

      if (names.length === 1) return names[0].substring(0, 2)

      const firstName = names[0] || ''
      const lastName = names[names.length - 1]

      if (firstName && lastName) {
        return `${firstName.substring(0, 1)}${lastName.substring(0, 1)}`
      }

      return firstName
    }
  }

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/sign-in')
        toast.success('Deslogado com sucesso!')
      })
      .catch(() => {
        toast.error('Erro ao deslogar')
      })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full p-0">
          <Avatar>
            <AvatarImage src={user?.picture ?? ''} />
            <AvatarFallback>{nameInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span>{user?.name}</span>
          <span className="text-xs font-normal text-muted-foreground">
            {user?.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-rose-500 dark:text-rose-400"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
