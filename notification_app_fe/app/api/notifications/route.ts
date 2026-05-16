import { NextResponse } from "next/server";

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhbnVzd2F0aGkudnIyMDIyQHZpdHN0dWRlbnQuYWMuaW4iLCJleHAiOjE3Nzg5MzQ3MTcsImlhdCI6MTc3ODkzMzgxNywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImY0YTQ4OTU3LTViOWYtNDdhOS1iZjc1LTBkMWYyNjdjOGU0NSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImFudSBzd2F0aGkgdi5yIiwic3ViIjoiMTc3NmFhNTItMGQwYS00YWI4LWJlM2UtYWZhYTQyMTFhZWFlIn0sImVtYWlsIjoiYW51c3dhdGhpLnZyMjAyMkB2aXRzdHVkZW50LmFjLmluIiwibmFtZSI6ImFudSBzd2F0aGkgdi5yIiwicm9sbE5vIjoiMjJtaWQwMjU3IiwiYWNjZXNzQ29kZSI6IlNmRnVXZyIsImNsaWVudElEIjoiMTc3NmFhNTItMGQwYS00YWI4LWJlM2UtYWZhYTQyMTFhZWFlIiwiY2xpZW50U2VjcmV0IjoiYWdudmh6bUJ6UmpBSkdCcCJ9.JfXFiC6e0mBLaNoCXaU8ccl8cJYeqtlI8p3X7elOjRU";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit");
  const page = searchParams.get("page");
  const notification_type = searchParams.get("notification_type");

  const params = new URLSearchParams();
  if (limit) params.append("limit", limit);
  if (page) params.append("page", page);
  if (notification_type) params.append("notification_type", notification_type);

  const response = await fetch(
    `http://4.224.186.213/evaluation-service/notifications?${params}`,
    {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    }
  );

  const data = await response.json();
  return NextResponse.json(data);
}