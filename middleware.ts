import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Use the Edge-compatible auth config (without Prisma adapter)
export const { auth: middleware } = NextAuth(authConfig);
export default middleware;

export const config = {
  matcher: [
    // Match all routes except static files and API routes (except auth)
    "/((?!_next/static|_next/image|favicon.ico|api/(?!auth)).*)",
  ],
};
