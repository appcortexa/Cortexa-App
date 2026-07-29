import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Card, CardContent, Container, Stack, Typography } from "@mui/material";
import type { StoredResult } from "../services/resultsStorage";

function formatValue(value: number | null): string {
  if (value === null) {
    return "Sin datos";
  }

  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function formatReactionTime(value: number | null): string {
  if (value === null) {
    return "Sin datos";
  }

  return `${Math.round(value)} ms`;
}

function getInterpretationColor(interpretation: string | null | undefined): string {
  const normalized = (interpretation ?? "").trim().toLowerCase();

  switch (normalized) {
    case "excelente":
      return "#2E7D32";
    case "muy bueno":
      return "#81C784";
    case "adecuado":
      return "#1E88E5";
    case "leve alteración":
      return "#FBC02D";
    case "alteración moderada":
      return "#FB8C00";
    case "alteración importante":
      return "#E53935";
    case "alteración severa":
      return "#8E0000";
    default:
      return "#90A4AE";
  }
}

function TrainingResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationState = location.state as
    | {
        result?: StoredResult;
      }
    | undefined;
  const result = navigationState?.result;
  const analysis = result?.analysis;

  useEffect(() => {
    if (!result || !analysis) {
      navigate("/results", { replace: true });
    }
  }, [analysis, navigate, result]);

  if (!result || !analysis) {
    return null;
  }

  const inhibitoryScore = result.clinicalIndexes.inhibitoryControl;
  const inhibitoryInterpretation = result.interpretations.inhibitoryControl ?? "Sin datos";
  const scoreValue = inhibitoryScore ?? 0;
  const normalizedScore = Math.max(0, Math.min(100, scoreValue));
  const progressColor = getInterpretationColor(inhibitoryInterpretation);
  const trackColor = "#E6ECF2";

  const progressStyle = {
    background: `conic-gradient(${progressColor} ${normalizedScore * 3.6}deg, ${trackColor} ${normalizedScore * 3.6}deg 360deg)`,
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F4F7FB",
        display: "flex",
        alignItems: "center",
        py: { xs: 4, sm: 6 },
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={3.5}>
          <Card elevation={3} sx={{ borderRadius: 4 }}>
            <CardContent>
              <Stack spacing={2.5} sx={{ alignItems: "center", textAlign: "center" }}>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{ fontWeight: 800, letterSpacing: 0.2, textTransform: "uppercase" }}
                >
                  🏆 Entrenamiento finalizado
                </Typography>

                <Typography variant="h6" sx={{ fontWeight: 700, color: "text.secondary" }}>
                  Control inhibitorio
                </Typography>

                <Box
                  sx={{
                    width: { xs: 190, sm: 220 },
                    height: { xs: 190, sm: 220 },
                    borderRadius: "50%",
                    ...progressStyle,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0 16px 36px rgba(17, 24, 39, 0.16)",
                  }}
                >
                  <Box
                    sx={{
                      width: "76%",
                      height: "76%",
                      borderRadius: "50%",
                      bgcolor: "#FFFFFF",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Puntaje
                    </Typography>
                    <Typography variant="h2" sx={{ fontWeight: 800, lineHeight: 1 }}>
                      {formatValue(inhibitoryScore)}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 700, color: progressColor }}>
                  {inhibitoryInterpretation}
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Card elevation={2} sx={{ borderRadius: 4 }}>
            <CardContent>
              <Stack spacing={2.5}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Resumen de la sesión
                </Typography>

                <Card variant="outlined" sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Stack
                      direction="row"
                      spacing={1.25}
                      sx={{ alignItems: "center", justifyContent: "space-between" }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        ✓ Aciertos GO
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800 }}>
                        {analysis.hits}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>

                <Card variant="outlined" sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Stack
                      direction="row"
                      spacing={1.25}
                      sx={{ alignItems: "center", justifyContent: "space-between" }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        ✓ Inhibiciones correctas
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800 }}>
                        {analysis.correctRejections}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>

                <Card variant="outlined" sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Stack
                      direction="row"
                      spacing={1.25}
                      sx={{ alignItems: "center", justifyContent: "space-between" }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        ✓ Tiempo medio de reacción
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800 }}>
                        {formatReactionTime(analysis.meanReactionTime)}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </CardContent>
          </Card>

          <Button
            fullWidth
            size="large"
            variant="contained"
            onClick={() => navigate("/go-no-go", { replace: true })}
            sx={{ py: 2, fontWeight: 800, borderRadius: 3, fontSize: "1rem" }}
          >
            Finalizar
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

export default TrainingResultsPage;