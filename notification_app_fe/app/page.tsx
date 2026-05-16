"use client";

import { useEffect, useState } from "react";
import {
  Container, Typography, Box, Slider, CircularProgress
} from "@mui/material";
import { fetchNotifications, getTopNNotifications, Notification } from "../lib/notifications";
import NotificationCard from "../components/NotificationCard";
import { Log } from "../../logging_middleware";

export default function PriorityInbox() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [topN, setTopN] = useState<number>(10);
  const [loading, setLoading] = useState(true);
  const [seenIDs, setSeenIDs] = useState<Set<string>>(new Set());

  useEffect(() => {
    Log("frontend", "info", "page", "Priority Inbox page mounted");
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      setLoading(true);
      Log("frontend", "debug", "page", "Loading notifications for priority inbox");
      const data = await fetchNotifications();
      setNotifications(data);
      // Mark first load as seen
      setSeenIDs(new Set(data.map((n) => n.ID)));
      Log("frontend", "info", "page", `Loaded ${data.length} notifications successfully`);
    } catch (error) {
      Log("frontend", "error", "page", `Failed to load notifications: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  const topNotifications = getTopNNotifications(notifications, topN);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Priority Inbox
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography gutterBottom>
          Show Top <strong>{topN}</strong> Notifications
        </Typography>
        <Slider
          value={topN}
          min={5}
          max={20}
          step={5}
          marks
          onChange={(_, val) => {
            setTopN(val as number);
            Log("frontend", "info", "component", `Top N changed to ${val}`);
          }}
          sx={{ width: 300 }}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : topNotifications.length === 0 ? (
        <Typography>No notifications found.</Typography>
      ) : (
        topNotifications.map((n) => (
          <NotificationCard
            key={n.ID}
            notification={n}
            isNew={!seenIDs.has(n.ID)}
          />
        ))
      )}
    </Container>
  );
}