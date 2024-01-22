import { Label } from '@radix-ui/react-label'
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { auth } from '@/lib/firebase'
import { createUser } from '@/services/userService'

const signUpForm = z.object({
  name: z.string(),
  password: z
    .string({ required_error: 'Digite a senha' })
    .min(6, 'Verifique a senha'),
  email: z.string().email(),
})

type SignUpForm = z.infer<typeof signUpForm>

export function SignUp() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isLoading },
    setError,
  } = useForm<SignUpForm>()

  async function handleSignUp({ name, email, password }: SignUpForm) {
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (user) => {
        await createUser({
          id: user.user.uid,
          name,
          email,
        })

        toast.success('Cadastrado com sucesso!', {
          action: {
            label: 'Login',
            onClick: () => navigate('/sign-in'),
          },
        })
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
          case 'auth/email-already-in-use':
            title = 'E-mail já cadastrado'
            break
        }

        toast.error('Erro ao fazer cadastro', {
          description: title,
        })
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
        toast.success('Cadastrado com sucesso!', {
          action: {
            label: 'Login',
            onClick: () => navigate('/sign-in'),
          },
        })
        navigate('/')
      })
      .catch((error) => {
        const title = error.message

        toast.error('Erro ao fazer login com o Google', {
          description: title,
        })
      })
  }

  return (
    <>
      <Helmet title="Cadastro" />

      <div className="p-8">
        <Button variant="ghost" asChild className="absolute right-8 top-8">
          <Link to="/sign-in">Fazer login</Link>
        </Button>

        <div className="flex w-[350px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Criar conta grátis
            </h1>
          </div>

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
            <span>Crie uma conta com o Google</span>
          </Button>

          <p className="text-center">ou</p>

          <form className="space-y-4" onSubmit={handleSubmit(handleSignUp)}>
            <div className="space-y-2">
              <Label htmlFor="name">Seu nome</Label>
              <Input id="name" type="text" {...register('name')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" {...register('email')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" {...register('password')} />
            </div>

            <Button disabled={isSubmitting} type="submit" className="w-full">
              Finalizar cadastro
            </Button>

            <p className="px-6 text-center text-sm leading-relaxed text-muted-foreground">
              Ao continuar, você concorda com nossos{' '}
              <a className="underline underline-offset-4" href="">
                Termos de Serviço
              </a>{' '}
              e{' '}
              <a className="underline underline-offset-4" href="">
                Política de Privacidade
              </a>
              .
            </p>
          </form>
        </div>
      </div>
    </>
  )
}
