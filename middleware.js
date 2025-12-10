import { NextResponse } from "next/server";

export function middleware(request) {
  // Add Server-Timing header
  const response = NextResponse.next();
  const serverTiming = response.headers.get("Server-Timing") || "";
  response.headers.set("Server-Timing", `${serverTiming}total;dur=0`);

  // Add security headers
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; frame-src 'self' https://drive.google.com https://www.google.com https://checkout.razorpay.com https://*.razorpay.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://*.razorpay.com; style-src 'self' 'unsafe-inline' https://*.razorpay.com; img-src 'self' data: https:; font-src 'self' data: https://*.razorpay.com; connect-src 'self' https://checkout.razorpay.com https://api.razorpay.com https://lumberjack.razorpay.com https://*.razorpay.com"
  );

  // Add caching headers for static assets
  const url = request.nextUrl;
  if (
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/clients/") ||
    url.pathname.endsWith(".ico")
  ) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );
  }

  return response;
}
