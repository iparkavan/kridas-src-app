import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "../../../src/utils/axios";
import UserService from "../../../src/services/user-service";

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const response = await axios(UserService.loginUser(credentials));

        if (response.status !== 200) {
          throw new Error("Request failed!");
        }
        const { user, isNewUser } = await response.data;

        return {
          email: user["user_email"],
          name: user["first_name"] + " " + user["last_name"],
          image: user["user_profile_img"],
          userId: user["user_id"],
          isNewUser,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Persist the user id to the token right after signin
      user && (token.user = user);
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an user id from a provider.
      session.user = token.user;
      return session;
    },
  },
  secret: process.env.NEXT_AUTH_SECRET_KEY,
});
