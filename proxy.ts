import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if(pathname === "/" && session) {
    return NextResponse.redirect(new URL("/protected-dashboard", request.url));
  }else if((pathname === "/protected-dashboard" || pathname === "/user-manager") && !session) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/", "/protected-dashboard/:path*","/user-manager/:path*"],
};
