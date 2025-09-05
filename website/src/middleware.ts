// import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
// import { NextResponse } from "next/server";

// export default withAuth(
//   function middleware(request: NextRequestWithAuth) {
//     const { pathname } = request.nextUrl;

//     if (!request.nextauth.token) {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token,
//     },
//   }
// );

// export const config = {
//   matcher: ["/extra/:path*", "/client/:path*", "/dashboard"],
// };

import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    // console.log("url", request.nextUrl.pathname)
    // console.log(request.nextauth.token)
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// export function redirectMiddleware(request: NextRequest) {
// console.log("Hello wrold")
//   return NextResponse.next();
// }

export const config = {
  matcher: ["/dashboard/:path*"],
};
