import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");

  if (host === "botmandesign.com") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.protocol = "https";
    redirectUrl.host = "www.botmandesign.com";
    return NextResponse.redirect(redirectUrl, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2|ttf)$).*)"],
};
