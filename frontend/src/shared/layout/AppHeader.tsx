import { AppBar, Toolbar, Container, Box } from "@mui/material";
import { MKTypography } from "shared/ui/MKTypography";
import { MKButton } from "shared/ui/MKButton";

type NavItem = {
  label: string;
  href?: string;
  onClick?: () => void;
};

type AppHeaderProps = {
  brand?: string;
  navItems?: NavItem[];
  onLogout?: () => void;
  userName?: string;
};

export function AppHeader({ brand = "Todo App", navItems, onLogout, userName }: AppHeaderProps) {
  const items: NavItem[] = [];

  if (navItems && navItems.length > 0) {
    items.push(...navItems);
  }

  if (onLogout) {
    items.push({ label: "Logout", onClick: onLogout });
  }

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={theme => ({
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[3],
        backdropFilter: "saturate(200%) blur(30px)",
      })}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 1,
          }}
        >
          <MKTypography variant="h6" sx={{ fontWeight: 700 }}>
            {brand}
          </MKTypography>
          <Box display="flex" alignItems="center" gap={1.5}>
            {items.map(item => (
              <MKButton
                key={item.label}
                color="info"
                size="small"
                onClick={item.onClick}
                component={item.href ? "a" : undefined}
                href={item.href}
              >
                {item.label}
              </MKButton>
            ))}
            {userName && (
              <MKTypography variant="body2" sx={{ fontWeight: 500 }}>
                {userName}
              </MKTypography>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
