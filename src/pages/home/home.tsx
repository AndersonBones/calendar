import { Heading, Text } from "@ignite-ui/react";
import { Container, Hero, Preview } from "./styles";
import calendarImage from '../../assets/calendar.png'
import Image from "next/image";
import { ClaimUserNameForm } from "./components/ClaimUserNameForm/ClaimUserNameForm";


export default function Home() {
    return (

      
      <Container>
        <Hero>
          <Heading as="h1" size="4xl">Agendamento descomplicado</Heading>

          <Text size="lg">
              Conecte seu calendario e permita que as pessoas marquem agendamentos
              no seu tempo livre.
          </Text>

          <ClaimUserNameForm></ClaimUserNameForm>
        </Hero>

        <Preview>
          <Image src={calendarImage} alt="ilustração de calendário" quality={100} height={400} priority>

          </Image>

        </Preview>
      </Container>
  
    )
  }
  