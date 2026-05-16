"use client";

import { useEffect, useState } from "react";
import {
  Container, Typography, Box, CircularProgress,
  ToggleButton, ToggleButtonGroup
} from "@mui/material";
import { fetchNotifications, Notification } from "../../lib/notifications";
import NotificationCard from "../../components/NotificationCard";
import { Log } from "../../../logging_middleware";

export default function AllNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [seenIDs, setSeenIDs] = useState<Set<string>>(new Set());

  useEffect(() => {
    Log("frontend", "info", "page", "All Notifications page mounted");
    loadNotifications();
  }, [filter]);

  async function loadNotifications() {
    try {
      setLoading(true);
      Log("frontend", "debug", "page", `Loading notifications with filter: ${filter}`);

      const data = await fetchNotifications(
        undefined,
        undefined,
        filter === "all" ? undefined : filter
      );

      setNotifications(data);
      setSeenIDs(new Set(data.map((n) => n.ID)));
      Log("frontend", "info", "page", `Loaded ${data.length} notifications with filter: ${filter}`);
    } catch (error) {
      Log("frontend", "error", "page", `Failed to load notifications: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        All Notifications
      </Typography>

      {/* Filter Buttons */}
      <Box sx={{ mb: 4 }}>
        <Typography gutterBottom>Filter by Type:</Typography>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_, val) => {
            if (val) {
              setFilter(val);
              Log("frontend", "info", "component", `Filter changed to ${val}`);
            }
          }}
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="Placement">Placement</ToggleButton>
          <ToggleButton value="Result">Result</ToggleButton>
          <ToggleButton value="Event">Event</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Notifications List */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : notifications.length === 0 ? (
        <Typography>No notifications found.</Typography>
      ) : (
        notifications.map((n) => (
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