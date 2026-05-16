import { Log } from "../../logging_middleware";

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhbnVzd2F0aGkudnIyMDIyQHZpdHN0dWRlbnQuYWMuaW4iLCJleHAiOjE3Nzg5MjgyNTgsImlhdCI6MTc3ODkyNzM1OCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjQxMmUyYmMwLWE1ZjctNGIxNi1hNmFhLThmNGNkYTgyM2ZmMyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImFudSBzd2F0aGkgdi5yIiwic3ViIjoiMTc3NmFhNTItMGQwYS00YWI4LWJlM2UtYWZhYTQyMTFhZWFlIn0sImVtYWlsIjoiYW51c3dhdGhpLnZyMjAyMkB2aXRzdHVkZW50LmFjLmluIiwibmFtZSI6ImFudSBzd2F0aGkgdi5yIiwicm9sbE5vIjoiMjJtaWQwMjU3IiwiYWNjZXNzQ29kZSI6IlNmRnVXZyIsImNsaWVudElEIjoiMTc3NmFhNTItMGQwYS00YWI4LWJlM2UtYWZhYTQyMTFhZWFlIiwiY2xpZW50U2VjcmV0IjoiYWdudmh6bUJ6UmpBSkdCcCJ9.h6omepSxc47KdLUy-NGPbTyKPSMiOYXxxZL52dg9oEQ";

export interface Notification {
  ID: string;
  Type: "Placement" | "Result" | "Event";
  Message: string;
  Timestamp: string;
}

export async function fetchNotifications(
  limit?: number,
  page?: number,
  notification_type?: string
): Promise<Notification[]> {
  try {
    Log("frontend", "info", "api", "Fetching notifications from server");

    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    if (page) params.append("page", page.toString());
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
    Log("frontend", "debug", "api", `Fetched ${data.notifications.length} notifications`);
    return data.notifications;

  } catch (error) {
    Log("frontend", "error", "api", `Failed to fetch notifications: ${error}`);
    return [];
  }
}

const WEIGHTS: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export function getTopNNotifications(
  notifications: Notification[],
  n: number
): Notification[] {
  Log("frontend", "info", "utils", `Calculating top ${n} priority notifications`);

  return [...notifications]
    .sort((a, b) => {
      const weightDiff = WEIGHTS[b.Type] - WEIGHTS[a.Type];
      if (weightDiff !== 0) return weightDiff;
      return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
    })
    .slice(0, n);
}