import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@radix-ui/react-label'
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { auth } from '@/lib/firebase'
import { createUser } from '@/services/userService'

const signInForm = z.object({
  email: z.string({ required_error: 'Digite a senha' }).email('Email inválido'),
  password: z
    .string({ required_error: 'Digite a senha' })
    .min(6, 'Verifique a senha'),
})

type SignInForm = z.infer<typeof signInForm>

export function SignIn() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isLoading },
    setError,
  } = useForm<SignInForm>({ resolver: zodResolver(signInForm) })

  async function handleSignIn({ email, password }: SignInForm) {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        toast.success('Logado com sucesso!')
        navigate('/')
      })
      .catch((error) => {
        let title = error.message

        switch (error.code) {
          case 'auth/invalid-email':
            title = 'E-mail inválido'
            break
          case 'auth/user-disabled':
            title = 'Usuário desabilitado'
            break
          case 'auth/user-not-found':
            title = 'Usuário não encontrado'
            break
          case 'auth/wrong-password':
            title = 'Senha incorreta'
            break
          case 'auth/too-many-requests':
            title = 'Muitas tentativas de login'
            break
          case 'auth/invalid-credential':
            title = 'Senha incorreta'
            setError('password', { message: 'Senha incorreta' })
            break
        }

        toast.error(title)
      })
  }

  async function handleGoogleSignIn() {
    const provider = new GoogleAuthProvider()

    signInWithPopup(auth, provider)
      .then(async (result) => {
        await createUser({
          id: result.user.uid,
          name: result.user.displayName || 'Nome não informado',
          email: result.user.email || 'E-mail não informado',
          picture: result.user.photoURL,
        })
        toast.success('Logado com sucesso!')
        navigate('/')
      })
      .catch((error) => {
        let title = error.message

        switch (error.code) {
          case 'auth/invalid-credential':
            title = 'Senha incorreta'
            setError('password', { message: 'Senha incorreta' })
            break
        }

        toast.error(title)
      })
  }

  useEffect(() => {
    if (errors.email) toast.error(`Erro: ${errors.email?.message}`)
    if (errors.password) toast.error(`Erro: ${errors.password?.message}`)
  }, [errors])

  return (
    <>
      <Helmet title="Login" />
      <div className="p-8 max-md:p-0">
        <Button
          variant="ghost"
          asChild
          className="absolute right-8 top-8"
          disabled={isSubmitting || isLoading}
        >
          <Link to="/sign-up">Crie uma conta</Link>
        </Button>

        <div className="flex w-[350px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Acessar plataforma
            </h1>
            <p className="text-sm text-muted-foreground">Monitore sua saúde</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(handleSignIn)}>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                className={errors.email ? 'border-red-500' : ''}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                className={errors.password ? 'border-red-500' : ''}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password?.message}
                </p>
              )}
            </div>

            <Button
              variant="ghost"
              asChild
              disabled={isSubmitting || isLoading}
            >
              <Link to="/forgot-password">Esqueceu a senha?</Link>
            </Button>

            <Button
              disabled={isSubmitting || isLoading}
              type="submit"
              className="w-full"
            >
              Acessar painel
            </Button>
          </form>

          <p className="text-center">ou</p>

          <Button
            variant="ghost"
            className="w-full gap-2"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting || isLoading}
          >
            <img
              className="h-6 w-6"
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              loading="lazy"
              alt="google logo"
            />
            <span>Entrar com Google</span>
          </Button>
        </div>
      </div>
    </>
  )
}
