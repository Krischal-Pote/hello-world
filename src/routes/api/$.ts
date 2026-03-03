import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/lib/better-auth";

export const Route = createFileRoute("/api/$")({
    server: {
        handlers: {
            GET: async ({ request }) => {
                console.log("Social sign-in callback received");
                return await auth.handler(request);
            },
            POST: async ({ request }: { request: Request }) => {
                console.log("Social sign-in callback received via POST");
                return await auth.handler(request);
            },
        },
    },
});
