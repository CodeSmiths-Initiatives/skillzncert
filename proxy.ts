import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/",
  "/counter",
  "/login",
  "/register",
  "/forgetPassword"
];

// function safeRedirect(path: string | null) {
//   if (!path) return "/applicationLanding";
//   if (!path.startsWith("/")) return "/applicationLanding";
//   if (path.startsWith("//")) return "/applicationLanding";
//   return path;
// }

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const authToken = req.cookies.get("auth_token")?.value;
  const isPublic = PUBLIC_ROUTES.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  console.log(" [MIDDLEWARE] Auth Token:", authToken );
  console.log(" [MIDDLEWARE] Pathname:", pathname );
  console.log(" [MIDDLEWARE] isPublic:", isPublic );
  

  /**
   * 🔐 CASE 0:
   * User manually opens /login (no redirect param)
   * → clear auth cookies
   */
  // if (
  //   pathname === "/login" &&
  //   authToken &&
  //   !searchParams.get("redirect")
  // ) {
  //   const res = NextResponse.next();
  //   res.cookies.delete("auth_token");
  //   res.cookies.delete("auth_user");
  //   return res;
  // }

  /**
   * 🔐 CASE 1:
   * Not logged in & trying protected page
   */
  if (!authToken && !isPublic) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  /**
   * 🔐 CASE 2:
   * Logged in & trying auth pages
   */
//   if (authToken && isPublic) {
//     const redirectUrl = safeRedirect(
//       searchParams.get("redirect")
//     );

//     return NextResponse.redirect(
//       new URL(redirectUrl, req.url)
//     );
//   }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next|favicon.ico|static|images).*)",
  ],
};
