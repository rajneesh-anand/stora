import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default (req, res) =>
  NextAuth(req, res, {
    providers: [
      // Providers.Credentials({
      //   authorize: async (credentials) => {
      //     try {
      //       const data = {
      //         username: credentials.username,
      //         password: credentials.password,
      //       };

      //       const user = await login(data);

      //       if (user) {
      //         return Promise.resolve(user);
      //       } else {
      //         return Promise.resolve(null);
      //       }
      //     } catch (error) {
      //       if (error.response) {
      //         console.log(error.response);
      //         Promise.reject(
      //           new Error("Invalid Username  and Password combination")
      //         );
      //       }
      //     }
      //   },
      // }),

      Providers.Email({
        // server: {
        //   host: process.env.SMTP_HOST,
        //   port: Number(process.env.SMTP_PORT),
        //   auth: {
        //     user: process.env.SMTP_USER,
        //     pass: process.env.SMTP_PASSWORD,
        //   },
        // },
        server: process.env.SMTP_SERVER,
        from: process.env.SMTP_FROM,
      }),

      Providers.GitHub({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      }),
      Providers.Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
      Providers.Facebook({
        clientId: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      }),
    ],
    debug: process.env.NODE_ENV === "development",
    secret: process.env.AUTH_SECRET,
    jwt: {
      secret: process.env.JWT_SECRET,
    },
    session: {
      jwt: true,
      // Seconds - How long until an idle session expires and is no longer valid.
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
      error: "/auth/error",
      verifyRequest: "/auth/verify-loginRequest",
    },
    adapter: Adapters.Prisma.Adapter({ prisma }),
  });

const login = async (data) => {
  const baseUrl = "http://localhost:3000";
  const response = await fetch(baseUrl + "/api/user", {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  console.log("result", result);
  return result;
};
