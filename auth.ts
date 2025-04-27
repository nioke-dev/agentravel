
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Apple from "next-auth/providers/apple"
import Credentials from "next-auth/providers/credentials"
import { hash, compare } from 'bcrypt'
import { ZodError } from "zod"
import { signInSchema } from "@/app/lib/zod"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [ Google, GitHub, Apple,
    /*
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try  {
          let user = null
          if (typeof credentials?.password !== 'string' || typeof credentials?.email !== 'string') return null
          // validate credentials using zod
          const { email, password } = await signInSchema.parseAsync(credentials);

          // logic to salt and hash password
          // const pwHash = saltAndHashPassword(credentials.password)
          const hashed = await hash(password, 10) // 10 = saltRounds
  
          // logic to verify if the user exists
          // user = await getUserFromDb(credentials.email, pwHash)
          user = await fetch(`/admin/pengguna?username=${ email }&password=${ hashed }`)
            .then(res => res.json())
          ;
          if (user.data.length === 0) {
            // No user found, so this is their first attempt to login
            // Optionally, this is also the place you could do a user registration
            throw new Error("Invalid credentials.")
          }
        
          // return user object with their profile data
          return user.data[0];
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null
          }
        }
      },
    }),
    */
  ],
})
