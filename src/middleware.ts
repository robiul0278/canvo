import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function middleware(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  
  const response = NextResponse.next();
  
  if (!session && request.url.includes("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};