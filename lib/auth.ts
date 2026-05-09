import { betterAuth } from "better-auth"
import { nextCookies } from "better-auth/next-js"

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL, 
    secret: process.env.BETTER_AUTH_SECRET,
    session: {
        expiresIn: 60 * 60 * 24 * 3, 
        updateAge: 60 * 60 * 24, 
    },
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
            authorization: {
                params: {
                    prompt: "select_account",
                },
            }
        },
    },
    plugins: [
        nextCookies()
    ]
})