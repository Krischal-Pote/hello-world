import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { jwt } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import * as schema from "@/db/schema";
import { db } from "@/db";
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
        schema,
        usePlural: true,
    }),
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "user",
                input: false, // not settable by the user directly
            },
            phone: {
                type: "string",
                required: false,
                input: true,
            },
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            scopes: ["profile", "email"],
            mapProfileToUser: (profile) => {
                return {
                    name: profile.name,
                    email: profile.email,
                    emailVerified: !!profile.email_verified,
                    image: profile.picture,
                };
            },
        },
    },
    plugins: [jwt(), tanstackStartCookies()], // make sure this is the last plugin in the array
    trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],
    baseURL: process.env.BETTER_AUTH_URL,
});