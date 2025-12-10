import { executeQuery } from "../../db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userid, password } = await request.json();

    // Input validation
    if (!userid || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    // First, try to authenticate against hardcoded emergency credentials
    // These work even when the database is down
    if (
      userid === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      return NextResponse.json(
        { success: true, message: "Login successful" },
        { status: 200 }
      );
    }

    // Try to query the database for additional admin users
    try {
      const users = await executeQuery({
        query: "SELECT * FROM users WHERE userid = ? LIMIT 1",
        values: [userid],
      });

      // Check if user exists and password matches
      if (users.length > 0 && users[0].password === password) {
        return NextResponse.json(
          { success: true, message: "Login successful" },
          { status: 200 }
        );
      }
    } catch (dbError) {
      console.warn(
        "Database connection failed, falling back to hardcoded credentials only:",
        dbError.message
      );
      // If database fails, we've already checked hardcoded credentials above
      // So we fall through to the invalid credentials error
    }

    // Invalid credentials
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
