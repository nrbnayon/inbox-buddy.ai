// app\actions\cookieActions.js
"use server";

const { cookies } = require("next/headers");

export const setCookies = async (accessToken, refreshToken) => {
  const cookieStore = await cookies();

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    // secure: process.env.NEXT_PUBLIC_NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 86400,
  });
  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    // secure: process.env.NEXT_PUBLIC_NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 2592000,
  });
};
