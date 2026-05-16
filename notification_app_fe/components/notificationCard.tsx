import { Notification } from "../lib/notifications";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";

const TYPE_COLORS: Record<string, "success" | "primary" | "warning"> = {
  Placement: "success",
  Result: "primary",
  Event: "warning",
};

interface Props {
  notification: Notification;
  isNew?: boolean;
}

export default function NotificationCard({ notification, isNew = false }: Props) {
  return (
    <Card
      sx={{
        mb: 2,
        border: isNew ? "2px solid #1976d2" : "1px solid #e0e0e0",
        borderRadius: 2,
        opacity: isNew ? 1 : 0.75,
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Chip
            label={notification.Type}
            color={TYPE_COLORS[notification.Type]}
            size="small"
          />
          {isNew && (
            <Chip label="NEW" color="error" size="small" />
          )}
        </Box>

        <Typography variant="body1" sx={{ mt: 1, fontWeight: isNew ? 600 : 400 }}>
          {notification.Message}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          {new Date(notification.Timestamp).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
}