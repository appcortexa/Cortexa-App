import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function LicenseRequiredPage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [confirmingSignOut, setConfirmingSignOut] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setSignOutError(null);

    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch {
      setSignOutError("No fue posible cerrar sesión. Inténtalo de nuevo.");
    } finally {
      setIsSigningOut(false);
    }
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
          <Button variant="contained" size="large" onClick={() => setConfirmingSignOut(true)}>
            Cerrar sesión
          </Button>
        </Paper>
      </Container>
      <Dialog open={confirmingSignOut} onClose={isSigningOut ? undefined : () => setConfirmingSignOut(false)}>
        <DialogTitle>Cerrar sesión</DialogTitle>
        <DialogContent>
          <DialogContentText>¿Quieres cerrar tu sesión en este dispositivo?</DialogContentText>
          {signOutError && <Typography color="error" variant="body2" sx={{ mt: 2 }}>{signOutError}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button disabled={isSigningOut} onClick={() => setConfirmingSignOut(false)}>Cancelar</Button>
          <Button disabled={isSigningOut} onClick={handleSignOut} variant="contained">Cerrar sesión</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default LicenseRequiredPage;
