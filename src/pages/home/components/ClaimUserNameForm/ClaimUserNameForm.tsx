import { Button, TextInput } from '@ignite-ui/react'
import { Form } from './styles'
import { ArrowRight } from 'phosphor-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'

export const userSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'digite pelo menos 3 caracteres' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'o usuário deve conter letra e numeros e hifens.',
    }),
})

export type TUser = z.infer<typeof userSchema>

export function ClaimUserNameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TUser>({
    resolver: zodResolver(userSchema),
  })

  const router = useRouter()
  async function handlePreRegister(data: TUser) {
    const { username } = data
    await router.push(`/register?username=${username}`)
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handlePreRegister)}>
        <TextInput
          {...register('username')}
          size="sm"
          prefix="ignite.com/"
          placeholder={'seu-usuario'}
        />

        <Button
          disabled={isSubmitting}
          variant={'secondary'}
          size="sm"
          type="submit"
        >
          Reservar usuário
          <ArrowRight />
        </Button>
      </Form>
      {errors.username && (
        <span className="text-rose-500 dark:text-rose-400">
          {errors.username?.message}
        </span>
      )}

      {!errors.username && (
        <span className="text-gray-950">Digite o nome de usuário</span>
      )}
    </>
  )
}
