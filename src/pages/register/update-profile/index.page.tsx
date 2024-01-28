import { api } from "@/lib/axios"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Container, Form, Header } from "../styles"
import { Button, Heading, MultiStep, TextInput, Text, TextArea, Avatar } from "@ignite-ui/react"
import { ArrowRight } from "phosphor-react"
import { FormAnnotation, ProfileBox } from "./styles"
import { useSession } from "next-auth/react"
import { GetServerSideProps } from "next"
import { buildNextAuthOptions } from "@/pages/api/auth/[...nextauth].api"
import { getServerSession } from "next-auth"

const updateProfileSchema = z.object({
    bio:z.string(),
})
  
type UpdateProfile = z.infer<typeof updateProfileSchema>

  
export default function UpdateProfile(){
    const {
        register,
        handleSubmit,
        setValue,
        formState: { isSubmitting },
      } = useForm<UpdateProfile>({
        resolver: zodResolver(updateProfileSchema),
      })
    
    const router = useRouter()
    
    const session = useSession() // escuta as sessões
   
    
    const handleUpdateProfile = async (data: UpdateProfile) => {
        await api.put('/users/profile',{
          bio:data.bio
        })

        router.push(`/schedule/${session.data?.user.username}`)
    }
    
      return (
        <Container>
          <Header>
            <Heading as="strong">Defina sua disponibilidade</Heading>
            <Text>
              Por último, uma breve descrição e uma foto de perfil.
            </Text>
    
            <MultiStep size={4} currentStep={4} />
          </Header>
    
          <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>

            <label>
                <Text size="sm">Foto de perfil</Text>
                <Avatar src={session.data?.user.avatar_url} alt={session.data?.user.name}></Avatar>
            </label>
            <label>

                <Text size="sm">Sobre você</Text>
                <TextArea {...register('bio')}></TextArea>
                <FormAnnotation>Fale um pouco sobre você. Isto será exibido em sua página pessoal.</FormAnnotation>
           
            </label>

    
            <Button
              disabled={isSubmitting}
              variant={'secondary'}
              size="sm"
              type="submit"
            >
              Finalizar <ArrowRight />
            </Button>
          </ProfileBox>
        </Container>
      )
}

export const getServerSideProps:GetServerSideProps = async ({req, res})=>{
  
  const session = await getServerSession(req, res, buildNextAuthOptions(req, res))

  return {
    
    props:{
      session
    }
  }
}