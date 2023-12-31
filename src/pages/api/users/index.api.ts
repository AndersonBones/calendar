// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import {setCookie} from 'nookies'


export default async function handlerCreateUser(req: NextApiRequest,res: NextApiResponse) {
    if(req.method != 'POST'){
        return res.status(405).end()
    }

    const {name, username} = req.body

    const hasUser = await prisma.user.findUnique({
        where:{
            username
        }
    })

    if(hasUser){
        return res.status(400).json({message:'Já existe um cadastro para esse usuário.'})
    }
    
    const user = await prisma.user.create({
        data:{
            name,
            username
        }
    })


    setCookie({res}, '@calendar:userId', user.id,{
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path:'/'
    })
    return res.status(201).json(user)
}
