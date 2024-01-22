import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { useAuth } from '@/context/useAuth'
import { createSymptoms } from '@/services/symptomsService'

import { Button } from './ui/button'
import { DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

const FormSchema = z.object({
  times_in_bathroom: z
    .string({
      required_error: 'Selecione uma das opções',
    })
    .refine(
      (value) => {
        return ['uma vez', 'duas vezes', 'três ou mais vezes'].includes(value)
      },
      {
        message: 'Selecione uma das opções',
      },
    ),
  time_with_symptoms: z
    .string({
      required_error: 'Selecione uma das opções',
    })
    .refine(
      (value) => {
        return ['1-5 dias', '6-13 dias', '14 dias ou mais'].includes(value)
      },
      {
        message: 'Selecione uma das opções',
      },
    ),
  blood_in_feces: z
    .string({
      required_error: 'Selecione uma das opções',
    })
    .refine(
      (value) => {
        return ['Sim', 'Não'].includes(value)
      },
      {
        message: 'Selecione uma das opções',
      },
    ),
})

export function ReportSymptoms() {
  const { user } = useAuth()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })
  const [loading, setLoading] = useState(false)

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords

          try {
            await createSymptoms({
              ...data,
              blood_in_feces: data.blood_in_feces === 'Sim',
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              user_id_reported: user!.id,
              geolocation: {
                latitude,
                longitude,
              },
            })

            toast('Sintomas reportados com sucesso!')
          } catch (error) {
            console.log(error)
            toast.error('Não foi possível reportar os sintomas')
          } finally {
            setLoading(false)
          }
        },
        () => {
          toast.error('Não foi possível obter a sua localização')
          setLoading(false)
        },
      )
    } else {
      toast.error('Geolocation não é suportado por este navegador', {
        description: 'Por favor, utilize outro navegador',
      })
      setLoading(false)
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Registrar caso de doença</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="times_in_bathroom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Quantas vezes você tem ido ao banheiro evacuar nas ultimas 24
                  horas?
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma das opções" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="uma vez">Uma vez</SelectItem>
                    <SelectItem value="duas vezes">Duas vezes</SelectItem>
                    <SelectItem value="três ou mais vezes">
                      Três ou mais vezes
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time_with_symptoms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>A quanto tempo você está assim?</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma das opções" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1-5 dias">1-5 dias</SelectItem>
                    <SelectItem value="6-13 dias">6-13 dias</SelectItem>
                    <SelectItem value="14 dias ou mais">
                      14 dias ou mais
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="blood_in_feces"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tem saído sangue junto com as fezes?</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma das opções" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Sim">Sim</SelectItem>
                    <SelectItem value="Não">Não</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Por favor, aguarde...
              </>
            ) : (
              'Enviar'
            )}
          </Button>
        </form>
      </Form>
    </DialogContent>
  )
}
