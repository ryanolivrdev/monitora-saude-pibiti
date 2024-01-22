import { Outlet } from 'react-router-dom'

import { Header } from '@/components/header'
import { AuthProvider } from '@/context/useAuth'

export function AppLayout() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col antialiased">
        <Header />

        <div className="flex flex-1 flex-col">
          <Outlet />
        </div>
      </div>
    </AuthProvider>
  )
}
