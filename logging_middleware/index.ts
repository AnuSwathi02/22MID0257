const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhbnVzd2F0aGkudnIyMDIyQHZpdHN0dWRlbnQuYWMuaW4iLCJleHAiOjE3Nzg5MjgyNTgsImlhdCI6MTc3ODkyNzM1OCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjQxMmUyYmMwLWE1ZjctNGIxNi1hNmFhLThmNGNkYTgyM2ZmMyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImFudSBzd2F0aGkgdi5yIiwic3ViIjoiMTc3NmFhNTItMGQwYS00YWI4LWJlM2UtYWZhYTQyMTFhZWFlIn0sImVtYWlsIjoiYW51c3dhdGhpLnZyMjAyMkB2aXRzdHVkZW50LmFjLmluIiwibmFtZSI6ImFudSBzd2F0aGkgdi5yIiwicm9sbE5vIjoiMjJtaWQwMjU3IiwiYWNjZXNzQ29kZSI6IlNmRnVXZyIsImNsaWVudElEIjoiMTc3NmFhNTItMGQwYS00YWI4LWJlM2UtYWZhYTQyMTFhZWFlIiwiY2xpZW50U2VjcmV0IjoiYWdudmh6bUJ6UmpBSkdCcCJ9.h6omepSxc47KdLUy-NGPbTyKPSMiOYXxxZL52dg9oEQ";

export async function Log(
  stack: string,
  level: string,
  packageName: string,
  message: string
): Promise<void> {
  try {
    const response = await fetch("http://4.224.186.213/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        stack,
        level,
        package: packageName,
        message,
      }),
    });

    if (!response.ok) {
      console.warn("Log API responded with:", response.status);
      return;
    }

    const data = await response.json();
    console.log("Log created:", data.logID);
  } catch (error) {
    // Silently fail — don't crash the app
    console.warn("Logging skipped:", error);
  }
}