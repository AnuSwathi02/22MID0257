import { Log } from "../../logging_middleware";

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhbnVzd2F0aGkudnIyMDIyQHZpdHN0dWRlbnQuYWMuaW4iLCJleHAiOjE3Nzg5MzI1NDEsImlhdCI6MTc3ODkzMTY0MSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjgwNDdhNmFjLTc3ODQtNDg4Yy05ZWIwLThjMzk0ZjBlYTNjZSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImFudSBzd2F0aGkgdi5yIiwic3ViIjoiMTc3NmFhNTItMGQwYS00YWI4LWJlM2UtYWZhYTQyMTFhZWFlIn0sImVtYWlsIjoiYW51c3dhdGhpLnZyMjAyMkB2aXRzdHVkZW50LmFjLmluIiwibmFtZSI6ImFudSBzd2F0aGkgdi5yIiwicm9sbE5vIjoiMjJtaWQwMjU3IiwiYWNjZXNzQ29kZSI6IlNmRnVXZyIsImNsaWVudElEIjoiMTc3NmFhNTItMGQwYS00YWI4LWJlM2UtYWZhYTQyMTFhZWFlIiwiY2xpZW50U2VjcmV0IjoiYWdudmh6bUJ6UmpBSkdCcCJ9.S44txryHV2KRF_RDgTOsOLuxYqUgUcbAJUwEaWcNqMo";

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

    const response = await fetch(`/api/notifications?${params}`);

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