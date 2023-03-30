import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import { env } from "@root/src/env.mjs";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from '@lib/prisma';
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "@public/lib/crpyt";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60,
	},
  secret: process.env.SECRET,
  providers: [
    CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "email", type: "email" },
				password: { label: "password", type: "password" },
			},
			async authorize(credentials) {
				const possibleUser = await prisma.user.findUnique({
					where: {
						email: credentials?.email
					},
					select: {
						hash: true
					}
				});

				if(!possibleUser) 
					throw Error("No user exists with this email!");

				const isValid = await verifyPassword(credentials?.password ?? "", possibleUser.hash);

				if(!isValid) 
					throw Error("Wrong password for account!");

				const user = await prisma.user.findUnique({
					where: {
						email: credentials?.email
					}
				});

				return user;
			}
		}),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if(user) token.id = user.id;
      return token;
    },
    session: ({ session, token }) => {
      if(token) {
                //@ts-ignore
        session.id = token.id;
                //@ts-ignore
        session.jwt = token;
      }
      
      return session;
    }
  }
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
