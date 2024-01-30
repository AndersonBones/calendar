import { Avatar, Heading, Text } from "@ignite-ui/react";
import { Container, UserHeader } from "./styles";
import { GetStaticPaths, GetStaticProps } from "next";
import { prisma } from "@/lib/prisma";
import { Calendar } from "@/components/Calendar";
import { CalendarStep } from "./ScheduleForm/CalendarStep";
import { ConfirmStep } from "./ScheduleForm/ConfirmStep";


interface ScheduleProps{
    user:{
        username:String,
        bio:String,
        avatar_url:String
    }
  
}
export default function ScheduleUser({user}:ScheduleProps){
    return (
        <Container>
            <UserHeader>
                <Avatar src={user.avatar_url} />
                <Heading>{user.username}</Heading>
                <Text>{user.bio}</Text>
            </UserHeader>

            {/* <ConfirmStep></ConfirmStep> */}
            <CalendarStep></CalendarStep>
        </Container>
    )
}

export const getStaticPaths: GetStaticPaths =async () => {
    return {
        paths:[],
        fallback:"blocking"
    }
}
export const getStaticProps: GetStaticProps = async ({params})=>{
    const username = String(params?.username)

    const user = await prisma.user.findUnique({
        where:{
            username
        }
    })

    if(!user){
        return {
            notFound:true,
        }
    }

    console.log(user.username)

    return{
        props:{
            user:{
                username,
                bio:user.bio,
                avatar_url:user.avatar_url
            }
        },

        revalidate: 60 * 60,
    }
}