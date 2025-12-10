import { NextResponse } from "next/server";
import { executeQuery } from "../../../../lib/db";

// Whitelist of allowed SQL commands
const ALLOWED_COMMANDS = [
  "SELECT",
  "CREATE",
  "ALTER",
  "DROP",
  "SHOW",
  "INSERT",
  "UPDATE",
  "DELETE",
  "TRUNCATE",
];

const RESTRICTED_TABLES = ["users", "admin_", "system_"];

export async function POST(request) {
  let trimmedQuery = "";
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query is required and must be a string" },
        { status: 400 }
      );
    }

    trimmedQuery = query.trim();

    // Remove SQL comments for validation (but keep original query for execution)
    const queryWithoutComments = trimmedQuery
      .split("\n")
      .filter((line) => !line.trim().startsWith("--"))
      .join("\n")
      .trim();

    // Validate SQL command is allowed
    const firstCommand = queryWithoutComments.split(/\s+/)[0].toUpperCase();
    if (!ALLOWED_COMMANDS.includes(firstCommand)) {
      return NextResponse.json(
        { error: `Command '${firstCommand}' is not allowed` },
        { status: 400 }
      );
    }

    // Check for restricted table operations
    const queryUpper = trimmedQuery.toUpperCase();
    for (const table of RESTRICTED_TABLES) {
      if (queryUpper.includes(table.toUpperCase())) {
        return NextResponse.json(
          { error: `Access to table '${table}*' is restricted` },
          { status: 403 }
        );
      }
    }

    const startTime = Date.now();

    // Split queries by semicolon and execute each one
    const queries = trimmedQuery
      .split(";")
      .map((q) => q.trim())
      .filter((q) => q.length > 0);

    let allResults = [];
    let totalAffectedRows = 0;

    for (const singleQuery of queries) {
      const results = await executeQueryWithTimeout(singleQuery, 30000);
      allResults.push(results);
      if (results.affectedRows) {
        totalAffectedRows += results.affectedRows;
      }
    }

    const executionTime = ((Date.now() - startTime) / 1000).toFixed(2);

    // Log to audit trail
    await logQueryExecution(trimmedQuery, "success", executionTime);

    return NextResponse.json(
      {
        success: true,
        message: `${queries.length} query(ies) executed successfully`,
        execution_time: `${executionTime}s`,
        affected_rows: totalAffectedRows,
        results: allResults,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Query runner error:", error);

    // Log to audit trail
    await logQueryExecution(trimmedQuery, "error", error.message);

    return NextResponse.json(
      {
        success: false,
        error: "Query execution failed",
        message: error.message.substring(0, 200),
      },
      { status: 500 }
    );
  }
}

// Execute query with timeout
function executeQueryWithTimeout(query, timeout) {
  return Promise.race([
    executeQuery({ query, values: [] }),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Query timeout")), timeout)
    ),
  ]);
}

// Log query execution for audit trail
async function logQueryExecution(query, status, details) {
  try {
    const timestamp = new Date().toISOString();
    const logQuery = `
      INSERT INTO query_execution_log 
      (query_text, status, details, executed_at)
      VALUES (?, ?, ?, ?)
    `;

    // Note: This requires a query_execution_log table to exist
    // If it doesn't, the log will silently fail
    try {
      await executeQuery({
        query: logQuery,
        values: [query.substring(0, 500), status, details, timestamp],
      });
    } catch (e) {
      // Silently fail if log table doesn't exist
      console.warn("Query log table not found, skipping audit log");
    }
  } catch (error) {
    console.error("Error logging query execution:", error);
  }
}
