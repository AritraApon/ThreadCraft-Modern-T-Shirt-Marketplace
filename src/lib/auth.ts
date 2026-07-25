import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { dbClient } from "./db";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db('Thread-Craft');

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    // client: dbClient as any,
  }),

trustedOrigins: [
    "https://thread-craft-modern-t-shirt-marketp.vercel.app",
    "https://*.vercel.app"
  ],

   emailAndPassword: {
    enabled: true,
  },


 socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },




    user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "buyer",
        input: true,
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  }

});