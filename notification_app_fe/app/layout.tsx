import type { Metadata } from "next";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";

export const metadata: Metadata = {
  title: "Campus Notifications",
  description: "Campus Notification Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {/* Navigation Bar */}
        <AppBar position="static" color="primary">
          <Toolbar sx={{ flexWrap: "wrap" }}>
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                fontWeight: 700,
                fontSize: { xs: "14px", sm: "20px" },
              }}
            >
              Campus Notifications
            </Typography>
            <Box>
              <Button
                color="inherit"
                href="/"
                sx={{ fontSize: { xs: "11px", sm: "14px" } }}
              >
                Priority Inbox
              </Button>
              <Button
                color="inherit"
                href="/all"
                sx={{ fontSize: { xs: "11px", sm: "14px" } }}
              >
                All Notifications
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box sx={{ px: { xs: 1, sm: 2, md: 4 }, py: 2 }}>
          {children}
        </Box>
      </body>
    </html>
  );
}