// import type { NextAuthOptions } from 'next-auth'
import {
  API_SOCIAL_VALIDATION,
  API_USER_VERIFY_OTP,
  USER_LOGIN_URL,
} from "@/src/services/api/endpoints";
import axios from "axios";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials: any) {
        let user = null;
        if (credentials?.otpVerfication) {
          const { email, otp, verifyOtpApi } = credentials;
          const response = await axios
            .post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/${verifyOtpApi}`, {
              email,
              otp: Number(otp),
            })
            .then(({ data }) => {
              return data?.data;
            })
            .catch((error) => {
              throw new Error(error?.response?.data?.message);
            });
          user = response;
        } else if (credentials?.socialLogin) {
          //get(`${API_SOCIAL_VALIDATION}?accessToken=${accessToken}`)
          const { accessToken } = credentials;
          const response = await axios
            .get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/v1/${API_SOCIAL_VALIDATION}?accessToken=${accessToken}`
            )
            .then(({ data }) => {
              return data?.data;
            })
            .catch((error) => {
              throw new Error(error?.response?.data?.message);
            });

          user = response;
        } else {
          const { email_or_phone, password }: any = credentials;

          const response = await axios
            .post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/${USER_LOGIN_URL}`, {
              email_or_phone,
              password,
            })
            .then(({ data }) => {
              return data?.data;
            })
            .catch((error) => {
              throw new Error(error?.response?.data?.message);
            });
          user = response;
        }
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/signout",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    //@ts-ignore
    async jwt({ token, user, session, trigger }) {
      if (user) {
        token = { ...token, ...user };
        token.sub = user.id;
      }
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user) session.user = { ...session.user, ...token };
      return session;
    },
  },
};
