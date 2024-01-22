import { onAuthStateChanged } from 'firebase/auth'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

import { Loading } from '@/components/loading'
import { User } from '@/entities/user.entity'
import { auth } from '@/lib/firebase'
import { getUser } from '@/services/userService'

interface AuthProviderProps {
  children: ReactNode
}

interface AuthContextData {
  isLoggedIn: boolean
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userFirestore = await getUser(currentUser.uid)
        setUser({
          id: currentUser.uid,
          name: userFirestore.name,
          email: userFirestore.email,
          picture: userFirestore.picture || '',
          registration: userFirestore.registration,
        })
        setLoading(false)
      } else {
        setLoading(false)
        setUser(null)
        navigate('/sign-in')
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: user !== null,
        user,
        loading,
      }}
    >
      {loading ? <Loading /> : children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined)
    throw new Error('useAuth must be used within a AuthProvider')

  return context
}
