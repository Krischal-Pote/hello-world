import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders, getRequest } from "@tanstack/react-start/server";
import { and, eq, isNull } from "drizzle-orm";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { db } from "@/db";
import { z } from "zod";
import { users } from "@/db/user.schema";
import { auth } from "@/lib/better-auth";

const JWKS = createRemoteJWKSet(
    new URL(`${process.env.BETTER_AUTH_URL}/api/auth/jwks`),
);

export const AuthPayloadSchema = z.object({
    iat: z.number(),
    name: z.string().nullable(),
    email: z.string(),
    emailVerified: z.boolean(),
    image: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    id: z.string(),
    sub: z.string(),
    exp: z.number(),
    iss: z.string(),
    aud: z.string(),
});

export type AuthPayload = z.infer<typeof AuthPayloadSchema>;

export const authenticationMiddleware = createMiddleware().server(
    async ({ next }) => {
        const headers = getRequestHeaders();
        const authHeader = headers.get("authorization") ?? "";
        const token = authHeader.replace("Bearer ", "");

        if (token) {
            console.log("Authentication token found, verifying JWT...");

            let verified: Awaited<ReturnType<typeof jwtVerify>>;
            try {
                verified = await jwtVerify(token, JWKS, {
                    issuer: process.env.BETTER_AUTH_URL,
                    audience: process.env.BETTER_AUTH_URL,
                });
            } catch (error) {
                console.error("JWT verification failed:", error);
                throw redirect({ to: "/", statusCode: 302 });
            }

            const payload = AuthPayloadSchema.parse(verified.payload);

            const user = await db.query.users.findFirst({
                where: and(eq(users.email, payload.email), isNull(users.deletedAt)),
            });

            if (!user?.id) throw redirect({ to: "/", statusCode: 302 });

            return next({
                context: {
                    email: payload.email,
                    userId: user.id,
                    name: payload.name,
                    phone: user.phone,
                    avatarUrl: user.image,
                    role: user.role,
                },
            });
        }

        console.log("No Bearer token, checking session cookie...");

        const request = getRequest();
        const session = await auth.api.getSession({ headers: request.headers });

        if (!session?.user?.email) {
            console.log("No valid session found, redirecting...");
            throw redirect({ to: "/", statusCode: 302 });
        }

        console.log("Session found for:", session.user.email);

        const user = await db.query.users.findFirst({
            where: and(eq(users.email, session.user.email), isNull(users.deletedAt)),
        });

        if (!user?.id) throw redirect({ to: "/", statusCode: 302 });

        return next({
            context: {
                email: user.email,
                userId: user.id,
                name: user.name,
                phone: user.phone,
                avatarUrl: user.image,
                role: user.role,
            },
        });
    },
);

export const checkAdminMiddleware = createMiddleware()
    .middleware([authenticationMiddleware])
    .server(async ({ next, context }) => {
        const ctx = context;
        if (!ctx?.email) throw new Error("Email not found in context");
        if (ctx.role !== "admin") throw new Error("Permission Denied");
        return next();
    });

export const checkStaffMiddleware = createMiddleware()
    .middleware([authenticationMiddleware])
    .server(async ({ next, context }) => {
        const ctx = context;
        if (!ctx?.email) throw new Error("Email not found in context");
        if (ctx.role !== "admin" && ctx.role !== "shopkeeper") {
            throw new Error("Permission Denied");
        }
        return next();
    });