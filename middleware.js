import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode"; // npm install jwt-decode

const publicRoutes = [
  "/",
  "/about",
  "/connect",
  "/security",
  "/team",
  "/login",
  "/admin/auth", // Still public for unauthenticated access
];
const protectedRoute = "/dashboard";
const adminRoute = "/admin";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  const isAdminRoute = pathname.startsWith(adminRoute);
  const isProtectedRoute = pathname === protectedRoute;

  // If no access token exists
  if (!accessToken) {
    // Block access to protected route and redirect to login
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Block access to admin routes (except /admin/auth) and redirect to admin auth
    if (isAdminRoute && pathname !== "/admin/auth") {
      return NextResponse.redirect(new URL("/admin/auth", request.url));
    }
    // Allow public routes to proceed
    return NextResponse.next();
  }

  // If token exists, decode it and check the role
  if (accessToken) {
    try {
      const decodedToken = jwtDecode(accessToken);
      const userRole = decodedToken?.role;

      // Admin and super_admin routing
      if (["admin", "super_admin"].includes(userRole)) {
        // Redirect away from /admin/auth if authenticated
        if (pathname === "/admin/auth") {
          return NextResponse.redirect(new URL(adminRoute, request.url));
        }
        // Redirect from public routes to admin
        if (publicRoutes.includes(pathname) && pathname !== "/admin/auth") {
          return NextResponse.redirect(new URL(adminRoute, request.url));
        }
        // Block access to protected route (/dashboard) and redirect to admin
        if (isProtectedRoute) {
          return NextResponse.redirect(new URL(adminRoute, request.url));
        }
        // Allow access to admin routes
        if (isAdminRoute) {
          return NextResponse.next();
        }
      }

      // Regular user routing
      if (userRole === "user") {
        if (publicRoutes.includes(pathname)) {
          return NextResponse.redirect(new URL(protectedRoute, request.url));
        }
        if (isAdminRoute) {
          return NextResponse.redirect(new URL(protectedRoute, request.url));
        }
      }

      // If role is invalid or undefined
      if (!userRole || !["admin", "super_admin", "user"].includes(userRole)) {
        if (isAdminRoute && pathname !== "/admin/auth") {
          return NextResponse.redirect(new URL("/admin/auth", request.url));
        }
        return NextResponse.redirect(new URL("/connect", request.url));
      }
    } catch (error) {
      console.error("Token decoding error:", error);
      if (isAdminRoute && pathname !== "/admin/auth") {
        return NextResponse.redirect(new URL("/admin/auth", request.url));
      }
      return NextResponse.redirect(new URL("/connect", request.url));
    }
  }

  // Allow the request to proceed if no redirects are triggered
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
