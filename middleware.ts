import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;
  const { sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role?.role_name;
console.log(sessionClaims)
  // Public route fallback (should be excluded from matcher ideally)
  if (!role) {
    console.log("no role")
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (pathname === "/") {
    if (role === "ADMIN" || role === "GESTIONNAIRE") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (role === "PARTICIPANT") {
      return NextResponse.redirect(new URL("/espace-participant", request.url));
    }
    return NextResponse.redirect(new URL("/espace-formateur", request.url));
  }

  // Role-based route protection
  if (pathname.startsWith("/dashboard") && !["ADMIN", "GESTIONNAIRE"].includes(role)) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
  if (pathname.startsWith("/espace-participant") && role !== "PARTICIPANT") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
  if (pathname.startsWith("/espace-formateur") && role !== "FORMATEUR") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/", // root redirection
    "/dashboard/:path*", // ADMIN & GESTIONNAIRE
    "/espace-participant/:path*", // PARTICIPANT
    "/espace-formateur/:path*", // FORMATEUR
  ],
};
