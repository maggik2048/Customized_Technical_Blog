import { NextRequest, NextResponse }
from "next/server";

export function middleware(
  request: NextRequest
) {

  const pathname =
    request.nextUrl.pathname;

  const allowedPaths = [
    "/enter",
    "/login",
    "/signup",
  ];

  const isAllowedPath =
    allowedPaths.some((path) =>
      pathname.startsWith(path)
    );

  const hasAccessCookie =
    request.cookies.get(
      "site_access"
    );

  if (
    !hasAccessCookie &&
    !isAllowedPath
  ) {

    return NextResponse.redirect(
      new URL(
        "/enter",
        request.url
      )
    );
  }

  return NextResponse.next();
}