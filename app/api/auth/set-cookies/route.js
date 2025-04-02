// app\api\auth\set-cookies\route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  const { accessToken, refreshToken } = await request.json();

  const response = NextResponse.json({ success: true });

  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 86400,
    path: "/",
  });

  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 2592000,
    path: "/",
  });

  response.cookies.set("auth", "true", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 86400,
    path: "/",
  });

  return response;
}
