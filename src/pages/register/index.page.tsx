import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { Container, Form, Header } from './styles'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { api } from '@/lib/axios'
import { AxiosError } from 'axios'


const registerSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'digite pelo menos 3 caracteres' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'o usuário pode conter apenas letras, numeros e hifens.',
    }),
  name: z
    .string()
    .min(4, { message: 'digite pelo menos 4 letras' })
    .regex(/[a-zA-Z ]+/, {
      message: 'o usuário deve conter letras.',
    }),
})

type TRegister = z.infer<typeof registerSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TRegister>({
    resolver: zodResolver(registerSchema),
  })

  const router = useRouter()

  useEffect(() => {
    if (router.query.username) {
      setValue('username', String(router.query.username))
    }
  }, [router.query?.username, setValue])
  const handleRegister = async (data: TRegister) => {
    try {
      await api.post('/users',{
        name: data.name,
        username: data.username
      })


      await router.push('/register/connect-calendar')

    } catch (error) {
      if(error instanceof AxiosError && error?.response?.data?.message){
        alert(error?.response?.data?.message)
        return
      }
    }
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Fomulário de cadastro</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </Text>

        <MultiStep size={4} currentStep={1} />
      </Header>

      <Form as="form" onSubmit={handleSubmit(handleRegister)}>
        <label>
          <Text size="sm">Seu usuário</Text>
          <TextInput
            {...register('username')}
            prefix="ignite.com/"
            placeholder={'seu-usuario'}
          />

          {errors.username && (
            <span className="text-rose-500 dark:text-rose-400">
              {errors.username?.message}
            </span>
          )}
        </label>

        <label>
          <Text size="sm">Nome completo</Text>
          <TextInput {...register('name')} placeholder={'Nome completo'} />

          {errors.name && (
            <span className="text-rose-500 dark:text-rose-400">
              {errors.name?.message}
            </span>
          )}
        </label>

        <Button
          disabled={isSubmitting}
          variant={'secondary'}
          size="sm"
          type="submit"
        >
          Próximo passo <ArrowRight />
        </Button>
      </Form>
    </Container>
  )
}
