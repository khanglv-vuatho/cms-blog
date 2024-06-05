// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Assume you have a function to check if the user is authenticated

  const isAuthenticated = checkAuth(request)

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  } else {
    return NextResponse.next()
  }
}

// Define paths to apply middleware to (all paths in this case)
export const config = {
  matcher: '/((?!login|_next/static|favicon.ico).*)'
}

// Example checkAuth function, you should replace this with your actual auth check
function checkAuth(request: NextRequest): boolean {
  // For demonstration, we're using a simple cookie check. Implement your logic here.
  const token = request.cookies.get('access_token')
  return !!token
}
