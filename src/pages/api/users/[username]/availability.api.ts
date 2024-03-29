import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function  handl(req: NextApiRequest, res: NextApiResponse) {
    if(req.method != 'GET'){
        return res.status(405).end()
    }

    const username = String(req.query.username)

    const {date} = req.query // data selecionada

    if(!date){
        return res.status(400).json({message:"Date not provided."})
    }

    const user = await prisma.user.findUnique({
        where:{
            username
        }
    })

    if(!user){
        return res.status(400).json({message:"User does not exist."})
    }

    const referenceDate = dayjs(String(date)) // data selecionada convertida em dayjs
    const isPastDate = referenceDate.endOf('day').isBefore(new Date()) // verifica se a data selecionada se encontra no passado

    if(isPastDate){
        return res.json({possibleTimes:[], availableTimes:[]})
    }

    const userAvailability = await prisma.userTimeInterval.findFirst({ // disponibilidade do usuario
        where:{
            user_id:user.id,
            week_day:referenceDate.get("day")
        }
    })

    if(!userAvailability){
        return res.json({message:"Date not found", possibleTimes:[], availableTimes:[]})
    }

    const {time_start_in_minutes, time_end_in_minutes} = userAvailability

    const startHour = time_start_in_minutes / 60
    const endHour = time_end_in_minutes / 60

    const possibleTimes = Array.from({length: endHour - startHour}).map((_, index)=>{
        return startHour + index
    })


    const blockedTimes = await prisma.scheduling.findMany({
        where:{
            user_id: user.id,
            date:{
                gte:referenceDate.set('hour', startHour).toDate(),
                lte:referenceDate.set('hour', endHour).toDate(),
            }
        }
    })

    const availableTimes = possibleTimes.filter((time)=>{
        return !blockedTimes.some(blockedTime => blockedTime.date.getHours() == time)
    })

    return res.json({possibleTimes, availableTimes})
}