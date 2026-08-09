import { Box, Container, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/AuthService";
import cortexaLogo from "../../assets/logos/cortexa.png";

function LoginPage() {
  const { authenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const { error } = await authService.signIn(email, password);

      if (error) {
        setErrorMessage("No pudimos iniciar sesión. Revisa tus credenciales e inténtalo de nuevo.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F7F9FC",
        display: "flex",
        alignItems: "center",
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
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 3.5 }}>
            <Box
              component="img"
              src={cortexaLogo}
              alt="Logo de CORTEXA"
              sx={{
                display: "block",
                width: { xs: 180, sm: 220, md: 250 },
                height: "auto",
              }}
            />

            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  mt: 0.5,
                  color: "text.secondary",
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                }}
              >
                Plataforma de Neuromodulación Clínica
              </Typography>
            </Box>

            <Box sx={{ width: "100%", maxWidth: 420 }}>
              <LoginForm onSubmit={handleLogin} loading={isSubmitting} errorMessage={errorMessage} />
            </Box>
          </Box>
        </Paper>

        <Box
          sx={{
            mt: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "center", sm: "flex-start" },
            gap: 0.5,
            color: "text.secondary",
          }}
        >
          <Typography variant="body2">CORTEXA v1.0.0</Typography>
          <Typography variant="body2">Licencia clínica</Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default LoginPage;
