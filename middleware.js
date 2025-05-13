// middleware.js - Improved implementation
import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const publicRoutes = [
  "/",
  "/about",
  "/privacy",
  "/connect",
  "/security",
  "/team",
  "/login",
];

const adminPublicRoutes = [
  "/admin/auth",
  "/admin/forgot-pass",
  "/admin/verify-email",
  "/admin/reset-pass",
];

const protectedRoute = "/chat";
const adminRoute = "/admin";

// Helper function to validate JWT token
function isTokenValid(token) {
  try {
    const decoded = jwtDecode(token);
    // Check if token is expired
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Flag variables for route classification
  const isAdminRoute = pathname.startsWith(adminRoute);
  const isAdminPublicRoute = adminPublicRoutes.includes(pathname);
  const isProtectedRoute = pathname.startsWith(protectedRoute);
  const isPublicRoute = publicRoutes.includes(pathname);

  // If no access token exists or token is invalid
  if (!accessToken || !isTokenValid(accessToken)) {
    // For protected routes, redirect to login
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // For admin routes (except public admin routes), redirect to admin auth
    if (isAdminRoute && !isAdminPublicRoute) {
      return NextResponse.redirect(new URL("/admin/auth", request.url));
    }

    // Allow access to public routes
    return NextResponse.next();
  }

  // If token exists and is valid, decode token directly instead of making API call
  try {
    const decodedToken = jwtDecode(accessToken);
    const userRole = decodedToken?.role;

    // Handle admin and super_admin users
    if (["admin", "super_admin"].includes(userRole)) {
      // Redirect away from admin public routes if already authenticated
      if (isAdminPublicRoute) {
        return NextResponse.redirect(new URL(adminRoute, request.url));
      }

      // Redirect from public routes to admin dashboard
      if (isPublicRoute) {
        return NextResponse.redirect(new URL(adminRoute, request.url));
      }

      // Redirect from protected user routes to admin dashboard
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL(adminRoute, request.url));
      }

      // Allow access to admin routes
      if (isAdminRoute) {
        return NextResponse.next();
      }
    }

    // Handle regular users
    if (userRole === "user") {
      // Redirect from public routes to user dashboard
      if (isPublicRoute) {
        return NextResponse.redirect(new URL(protectedRoute, request.url));
      }

      // Redirect from admin routes to user dashboard
      if (isAdminRoute) {
        return NextResponse.redirect(new URL(protectedRoute, request.url));
      }

      // Allow access to protected routes
      if (isProtectedRoute) {
        return NextResponse.next();
      }
    }

    // Handle invalid or undefined roles
    if (!userRole || !["admin", "super_admin", "user"].includes(userRole)) {
      // Clear cookies and redirect to appropriate auth page
      const response = NextResponse.redirect(
        new URL(isAdminRoute ? "/admin/auth" : "/connect", request.url)
      );
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      response.cookies.delete("auth");
      return response;
    }
  } catch (error) {
    console.error("Token validation error:", error);
    // Clear cookies and redirect to appropriate auth page
    const response = NextResponse.redirect(
      new URL(isAdminRoute ? "/admin/auth" : "/connect", request.url)
    );
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    response.cookies.delete("auth");
    return response;
  }

  // Default: allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
