import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import getMongoClient from "@lib/db";

const handler = NextAuth({
  adapter: MongoDBAdapter(getMongoClient()),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
        },
      },
    }),
  ],
  secret: process.env.AUTH_SECRET!,
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async session({ session }) {
      if (session.user) {
        session.user.role = "free";
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };