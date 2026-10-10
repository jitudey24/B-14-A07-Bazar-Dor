import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  let session = null;

  try {
    session = await auth.api.getSession({
      headers: request.headers,
    });
  } catch (error) {
    // session check fail korle logged out hishebe dhorbo
    console.error("Session check failed:", error);
  }

  // User logged in na thakle sign-in page e pathao
  if (!session) {
    const signInUrl = new URL("/signin", request.url);

    // User ja dekhte chaichhilo (path + query) mone rakho
    signInUrl.searchParams.set(
      "callbackURL",
      request.nextUrl.pathname + request.nextUrl.search
    );

    return NextResponse.redirect(signInUrl);
  }

  // Logged in user details page dekhte parbe
  return NextResponse.next();
}

export const config = {
  // Duita details page:
  // /category/[categorySlug]  ar  /product/[slug]
  matcher: ["/category/:path*", "/product/:path*", "/profile"],
};
