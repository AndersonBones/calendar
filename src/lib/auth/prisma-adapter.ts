/** @return { import("next-auth/adapters").Adapter } */

import { Adapter } from "next-auth/adapters"
import { prisma } from "../prisma"
import { NextApiRequest, NextApiResponse, NextPageContext } from "next"
import { parseCookies, destroyCookie } from "nookies"

export  function PrismaAdapter(req:NextApiRequest | NextPageContext['req'], res:NextApiResponse |  NextPageContext['res']): Adapter {
    return {
      async createUser(user) {
        const {'@calendar:userId':userIdCookie} = parseCookies({req})

        if(!userIdCookie){
          throw new Error('User ID not found on cookies')
        }

        const updatedUser  = await prisma.user.update({
          where:{
            id:userIdCookie
          },
          data:{
            name:user.name,
            username:user.username,
            avatar_url:user.avatar_url,
            email:user.email
          }
        })

        destroyCookie({res}, '@calendar:userId',{
          path:'/'
        })


        return {
          id:updatedUser.id,
          name:updatedUser.name,
          username:updatedUser.username,
          email:updatedUser.email!,
          emailVerified:null,
          avatar_url:updatedUser.avatar_url!
      }
      },

      async getUser(id)  {
        const user = await prisma.user.findUnique({
            where:{
                id
            }
        })

        if(!user){
          return null
        }

        return {
            id:user.id,
            name:user.name,
            username:user.username,
            email:user.email!,
            emailVerified:null,
            avatar_url:user.avatar_url!
        }
      },

      async getUserByEmail(email) {
        const user = await prisma.user.findUnique({
            where:{
                email
            }
        })
        
        if(!user){
          return null
        }

        return {
            id:user.id,
            name:user.name,
            username:user.username,
            email:user.email!,
            emailVerified:null,
            avatar_url:user.avatar_url!
        }
      },

      async getUserByAccount({ providerAccountId, provider }) { // get user by account ~ obtem o usuário daquela conta 
        const account = await prisma.account.findUnique({
            where:{
                provider_provider_account_id:{
                    provider_account_id:providerAccountId,
                    provider
                }
            },
            include:{
                user:true
            }
        })

        if(!account){
          return null
        }

        const {user} = account

        return {
            id:user.id,
            name:user.name,
            username:user.username,
            email:user.email!,
            emailVerified:null,
            avatar_url:user.avatar_url!
        }
      },

      async updateUser(user) { // update user
        const prismaUser = await prisma.user.update({
          where:{
            id:user.id!,
          },

          data:{ // new data
            name:user.name,
            email:user.email,
            avatar_url:user.avatar_url
          }
        })

        return {
            id:prismaUser.id,
            name:prismaUser.name,
            username:prismaUser.username,
            email:prismaUser.email!,
            emailVerified:null,
            avatar_url:prismaUser.avatar_url!
        }
      },

      async deleteUser(userId) {
        await prisma.user.delete({
          where:{
            id:userId
          }
        })

      
      },

      async linkAccount(account) {
        await prisma.account.create({
          data:{
            provider:account.provider,
            provider_account_id:account.providerAccountId,
            type:account.type,
            access_token:account.access_token,
            expires_at:account.expires_at,
            id_token:account.id_token,
            refresh_token:account.refresh_token,
            scope:account.scope,
            session_state:account.session_state,
            user_id:account.userId,
            token_type:account.token_type
          }
        })
      },


      async createSession({ sessionToken, userId, expires }) {
        await prisma.session.create({
          data:{ // new data
            user_id:userId,
            session_token:sessionToken,
            expires
          }
        })

        return {
          expires,
          sessionToken,
          userId
        }
      },

      async getSessionAndUser(sessionToken) { // get session and user ~ obtem a sessão e os dados do usuario conectado a sessão
        const prismaSession = await prisma.session.findUnique({
          where:{
            session_token:sessionToken
          },

          include:{
            user:true
          }
        })
        
        if(!prismaSession){
          return null
        }

        const {user, ...session} = prismaSession

        return {
          session:{
            expires:session.expires,
            sessionToken:session.session_token,
            userId:session.user_id
          },
          user:{
            id:user.id,
            username:user.username,
            name:user.name,
            email:user.email!,
            avatar_url:user.avatar_url!,
            emailVerified:null,
          }
        }
      },
      
      async updateSession({ sessionToken, expires, userId }) {
        const sessionUpdate = await prisma.session.update({
          where:{
            session_token:sessionToken
          },

          data:{
            expires,
            user_id:userId
          }
        })

        return {
          expires:sessionUpdate.expires,
          sessionToken:sessionUpdate.session_token,
          userId:sessionUpdate.user_id
        }
      },

      async deleteSession(sessionToken) {
        await prisma.session.delete({
          where:{
            session_token:sessionToken
          }
        })
      },
    }
  }