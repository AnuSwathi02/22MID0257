"use client";

import { useEffect, useState } from "react";
import {
  Container, Typography, Box, CircularProgress,
  ToggleButton, ToggleButtonGroup, Pagination
} from "@mui/material";
import { fetchNotifications, Notification } from "../../lib/notifications";
import NotificationCard from "../../components/NotificationCard";
import { Log } from "../../../logging_middleware";

export default function AllNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [seenIDs, setSeenIDs] = useState<Set<string>>(new Set());
  const LIMIT = 5;

  useEffect(() => {
    Log("frontend", "info", "page", "All Notifications page mounted");
    loadNotifications();
  }, [filter, page]);

  async function loadNotifications() {
    try {
      setLoading(true);
      Log("frontend", "debug", "page", `Loading page ${page} with filter: ${filter}`);

      const data = await fetchNotifications(
        LIMIT,
        page,
        filter === "all" ? undefined : filter
      );

      // Track new vs seen
      const stored = localStorage.getItem("seenNotifications");
const storedIDs: string[] = stored ? JSON.parse(stored) : [];
const seenSet = new Set<string>(storedIDs);
setSeenIDs(seenSet);

const allIDs = data.map((n) => n.ID);
localStorage.setItem("seenNotifications", JSON.stringify([...new Set([...storedIDs, ...allIDs])]));
setNotifications(data);

      Log("frontend", "info", "page", `Loaded ${data.length} notifications`);
    } catch (error) {
      Log("frontend", "error", "page", `Failed to load: ${error}`);
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
      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Filter by Type:</Typography>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_, val) => {
            if (val) {
              setFilter(val);
              setPage(1);
              Log("frontend", "info", "component", `Filter changed to ${val}`);
            }
          }}
          sx={{ flexWrap: "wrap" }}
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

      {/* Pagination */}
      {!loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={10}
            page={page}
            onChange={(_, val) => {
              setPage(val);
              Log("frontend", "info", "component", `Page changed to ${val}`);
            }}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
}