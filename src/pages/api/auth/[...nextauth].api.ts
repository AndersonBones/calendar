import { PrismaAdapter } from "@/lib/auth/prisma-adapter"
import { NextApiRequest, NextApiResponse, NextPageContext } from "next"
import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google"


export  function buildNextAuthOptions(req:NextApiRequest | NextPageContext['req'], res:NextApiResponse |  NextPageContext['res']): NextAuthOptions {
  return {
    adapter: PrismaAdapter(req, res), // recebe req e res

    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        authorization: {
          params: {
            scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar"
          }
        },


        profile(profile:GoogleProfile){
          return {
            id:profile.sub,
            avatar_url:profile.picture,
            email:profile.email,
            username:profile.name,
            name:profile.name
          }
        }
      }),
      // ...add more providers here
    ],

    callbacks: {
      async signIn({ account }) {
        if (!account?.scope?.includes("https://www.googleapis.com/auth/calendar")) { // not permission
          return '/register/connect-calendar?error=permissions'
        }

        return true // permission
      },

      async session({session, user}){
        return{
          ...session,
          user
        }

      }
    }
  }
}



export default async function auth(req:NextApiRequest, res:NextApiResponse){
    return await NextAuth(req, res, buildNextAuthOptions(req, res))
}