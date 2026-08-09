import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/AuthService";

function LicenseRequiredPage() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await authService.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F7F9FC",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 4, sm: 6, md: 8 },
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            borderRadius: { xs: 3, md: 4 },
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
            p: { xs: 3, sm: 4, md: 5 },
            textAlign: "center",
          }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
            Licencia requerida
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Su licencia de CORTEXA no está activa o ha expirado.
            Contacte al administrador para renovar su licencia.
          </Typography>
          <Button variant="contained" size="large" onClick={handleSignOut}>
            Cerrar sesión
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

export default LicenseRequiredPage;
