import NextAuth from "next-auth";
import { authOptions } from "@root/src/server/auth";

export default NextAuth(authOptions);
