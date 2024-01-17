import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'
import { ArrowRight, Check } from 'phosphor-react'
import { Container, Header } from '../styles'
import { AuthError, ConnectBox, ConnectItem } from './styles'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'


export default function ConnectCalendar() {

    const session = useSession()
    
    const router = useRouter()

    const hasAuthenticated = session.status == 'authenticated'
    const hasAuthError = router.query.error

    const handleSignIn = async() => {
        await signIn('google')
    }

    const handleNextStep = async()=>{
        router.push('/register/time-intervals')
    }

    return (
        <Container>
            <Header>
                <Heading as="strong">Conecte sua agenda!</Heading>
                <Text>
                    Conecte o seu calendário para verificar automaticamente as horas ocupadas e os novos eventos
                    à medida em que são agendados.
                </Text>

                <MultiStep size={4} currentStep={2} />
            </Header>

            <ConnectBox>
                <ConnectItem>
                    <Text>Google Calendar</Text>
                    {hasAuthenticated && (
                        <Button variant={'secondary'} disabled size="sm">Conectado <Check/> </Button>
                    )}

                    {!hasAuthenticated && (
                        <Button onClick={handleSignIn} variant={'secondary'} size="sm">Conectar <ArrowRight/></Button>
                    )}
                    
                </ConnectItem>

                {hasAuthError && (
                    <AuthError size="sm">
                        Falha ao se conectar ao Google, verifique se você habilitou as 
                        permissões de acesso ao Google Calendar.
                    </AuthError>
                )}
                <Button disabled={!hasAuthenticated} onClick={handleNextStep} variant={'secondary'} type="submit">
                    Próximo passo <ArrowRight />
                </Button>
            </ConnectBox>

            


        </Container>
    )
}
