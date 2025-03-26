import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (isPublicRoute(request)) return NextResponse.next();

  const { pathname } = request.nextUrl;
  const role = (await auth()).sessionClaims?.metadata.role.role_name;

  if (pathname === "/") {
    const redirectMap: Record<string, string> = {
      ADMIN: "/admin-dashboard",
      GESTIONNAIRE: "/gestionnaire-dashboard",
      FORMATEUR: "/formateurs-dashboard",
    };
    if (!role) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.redirect(
      new URL(redirectMap[role] || "/dashboard", request.url)
    );
  }
  if (pathname.startsWith("/dashboard") && role !== "ADMIN") {
    console.log("role if dashboard", role);
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
  if (
    pathname.startsWith("/gestionnaire-dashboard") &&
    role !== "GESTIONNAIRE"
  ) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
