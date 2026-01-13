import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string
      role: string // Thêm role vào đây
    } & DefaultSession["user"]
  }

  interface User {
    role: string // Thêm role vào User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
  }
}