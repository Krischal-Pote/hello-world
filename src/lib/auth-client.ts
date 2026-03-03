import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./better-auth";

const TOKEN_KEY = "auth-jwt";
const baseAuthClient = createAuthClient({
    baseURL: import.meta.env.VITE_BETTER_AUTH_URL || "http://localhost:3000",
    plugins: [jwtClient(), inferAdditionalFields<typeof auth>()],
});

export const { useSession, signUp } = baseAuthClient;

export const getJwtToken = async (): Promise<string> => {
    const cached = localStorage.getItem(TOKEN_KEY);
    if (cached) {
        try {
            const { token, expiresAt } = JSON.parse(cached);
            if (Date.now() < expiresAt) return token;
        } catch {
            localStorage.removeItem(TOKEN_KEY);
        }
    }

    const { data, error } = await baseAuthClient.token();
    if (error || !data?.token) throw new Error("Failed to get token");

    localStorage.setItem(
        TOKEN_KEY,
        JSON.stringify({
            token: data.token,
            expiresAt: Date.now() + 14 * 60 * 1000,
        }),
    );

    return data.token;
};

export const signIn = {
    social: (options: { provider: string }) => {
        sessionStorage.setItem("auth-loading", "true");
        sessionStorage.setItem(
            "post-login-redirect",
            "/fulfillment/items-management",
        );
        return baseAuthClient.signIn.social(options);
    },
};

export const signOut = async () => {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem("post-login-redirect");
    sessionStorage.removeItem("auth-loading");
    await baseAuthClient.signOut();
    window.location.href = "/";
};
