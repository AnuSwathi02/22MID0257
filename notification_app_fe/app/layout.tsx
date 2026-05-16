import type { Metadata } from "next";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link";

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
      <body>
        {/* Navigation Bar */}
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
              Campus Notifications
            </Typography>
            <Box>
              <Button color="inherit" component={Link} href="/">
                Priority Inbox
              </Button>
              <Button color="inherit" component={Link} href="/all">
                All Notifications
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        {children}
      </body>
    </html>
  );
}