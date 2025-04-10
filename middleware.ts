import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
const isAdminRoute = createRouteMatcher([
  "/dashboard/utilisateurs",
  "/dashboard/roles",
  "/dashboard/participants",
  "/dashboard/catalogue",
  "/dashboard/sessions",
  "/dashboard/calendrier",
  "/dashboard/devis",
  "/dashboard/factures",
]);

const isGestionnaireRoute = createRouteMatcher([
  "/dashboard/participants",
  "/dashboard/catalogue",
  "/dashboard/sessions",
  "/dashboard/calendrier",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) return NextResponse.next();

  const { pathname } = request.nextUrl;
  const { sessionClaims } = await auth();
  const role = sessionClaims?.metadata.role?.role_name;

  // Redirect root path to dashboard or sign-in
  if (pathname === "/") {
    if (!role) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Require authentication and role for non-public routes
  if (!role) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Admin route protection
  if (isAdminRoute(request)) {
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // Gestionnaire route protection
  if (isGestionnaireRoute(request)) {
    if (role !== "GESTIONNAIRE") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};