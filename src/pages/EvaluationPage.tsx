import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";
import { LEVELS } from "../core/levels";
import type { GeneratedSession } from "../core/generator/sessionGenerator";
import SessionPlayer from "../components/SessionPlayer";

function EvaluationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);

  const session = (location.state as { session?: GeneratedSession } | undefined)?.session;

  const levelLabel = useMemo(() => {
    if (!session) {
      return "";
    }

    return LEVELS[session.level]?.name ?? session.level;
  }, [session]);

  useEffect(() => {
    if (!session) {
      navigate("/");
    }
  }, [navigate, session]);

  if (!session) {
    return null;
  }

  if (isPlaying) {
    return <SessionPlayer session={session} />;
  }

  return (
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        py: { xs: 4, sm: 6 },
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: { xs: 2.5, sm: 3 },
          }}
        >
          <Box
            component="img"
            src="/logo/logo-reconecta.png"
            alt="Reconecta"
            sx={{
              width: { xs: 180, sm: 220 },
              maxWidth: "100%",
              height: "auto",
            }}
          />

          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              fontSize: { xs: "1.8rem", sm: "2.125rem" },
            }}
          >
            Evaluación
          </Typography>

          <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              Expediente: {session.expediente}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              Sustancia: {session.substance}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              Nivel: {levelLabel}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              Total de ensayos: {session.summary.totalTrials}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              Número de GO: {session.summary.go}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              Número de NO_GO: {session.summary.noGo}
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => setIsPlaying(true)}
          >
            Iniciar evaluación
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default EvaluationPage;