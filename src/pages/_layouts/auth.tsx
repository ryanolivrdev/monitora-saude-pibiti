import { onAuthStateChanged } from 'firebase/auth'
import { HeartHandshake } from 'lucide-react'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { auth } from '@/lib/firebase'

export function AuthLayout() {
  const navigation = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        navigation('/')
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <div className="grid min-h-screen grid-cols-2 max-md:flex max-md:items-center max-md:justify-center">
      <div className="flex h-full flex-col justify-between border-r border-foreground/5 bg-muted p-10 text-muted-foreground max-md:hidden">
        <div className="flex items-center gap-3 text-lg text-foreground">
          <HeartHandshake className="h-5 w-5" />

          <span className="font-semibold">Monitora Saúde</span>
        </div>
        <footer className="text-sm">
          &copy; Monitora Saúde - {new Date().getFullYear()}
        </footer>
      </div>

      <div className="relative flex flex-col items-center justify-center max-md:min-h-screen max-md:w-screen">
        <Outlet />
      </div>
    </div>
  )
}
