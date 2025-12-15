import { Container, Grid } from "@mui/material";
import { MKBox } from "shared/ui/MKBox";
import { MKTypography } from "shared/ui/MKTypography";

export function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <MKBox component="footer" pt={6} pb={3} px={1}>
      <Container maxWidth="lg">
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
            <MKTypography variant="h6" mb={1}>
              Todo App
            </MKTypography>
            <MKTypography variant="body2" color="textSecondary">
              © {year} Todo App. Built with React and Django.
            </MKTypography>
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}
