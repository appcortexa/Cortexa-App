import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { LEVELS } from "../core/levels";
import type { StoredResult } from "../services/resultsStorage";

function formatScore(value: number | null): string {
  if (value === null) {
    return "Sin datos";
  }

  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function formatIndicatorValue(value: number | null): string {
  if (value === null) {
    return "Sin datos";
  }

  return Number.isInteger(value) ? String(value) : value.toFixed(2);
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

function formatSessionDate(value: Date): string {
  if (Number.isNaN(value.getTime())) {
    return "Sin datos";
  }

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(value);
}

function formatSessionTime(value: Date): string {
  if (Number.isNaN(value.getTime())) {
    return "Sin datos";
  }

  return new Intl.DateTimeFormat("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(value);
}

function EvaluationResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationState = location.state as
    | {
        result?: StoredResult;
      }
    | undefined;
  const result = navigationState?.result;
  const session = result?.session;
  const analysis = result?.analysis;

  const levelLabel = useMemo(() => {
    if (!session) {
      return "Sin datos";
    }

    return LEVELS[session.level]?.name ?? session.level;
  }, [session]);

  const sessionDate = useMemo(() => {
    if (!session) {
      return "Sin datos";
    }

    return formatSessionDate(new Date(session.createdAt));
  }, [session]);

  const sessionTime = useMemo(() => {
    if (!session) {
      return "Sin datos";
    }

    return formatSessionTime(new Date(session.createdAt));
  }, [session]);

  useEffect(() => {
    if (!result || !session || !analysis) {
      navigate("/results", { replace: true });
    }
  }, [analysis, navigate, result, session]);

  if (!result || !session || !analysis) {
    return null;
  }

  const reconectaGlobalScore = analysis.clinicalIndexes.reconectaGlobalIndex;
  const reconectaGlobalInterpretation = result.interpretations.reconectaGlobalIndex ?? "Sin datos";
  const inhibitoryInterpretation = result.interpretations.inhibitoryControl ?? "Sin datos";
  const sustainedAttentionInterpretation = result.interpretations.sustainedAttention ?? "Sin datos";
  const processingSpeedInterpretation = result.interpretations.processingSpeed ?? "Sin datos";
  const cognitiveConsistencyInterpretation = result.interpretations.cognitiveConsistency ?? "Sin datos";
  const scoreValue = reconectaGlobalScore ?? 0;
  const normalizedScore = Math.max(0, Math.min(100, scoreValue));
  const progressColor = getInterpretationColor(reconectaGlobalInterpretation);
  const trackColor = "#E6ECF2";
  const progressStyle = {
    background: `conic-gradient(${progressColor} ${normalizedScore * 3.6}deg, ${trackColor} ${normalizedScore * 3.6}deg 360deg)`,
  };
  const neurofunctionalProfileCards = [
    {
      title: "Control inhibitorio",
      interpretation: inhibitoryInterpretation,
      score: analysis.clinicalIndexes.inhibitoryControl,
    },
    {
      title: "Atención sostenida",
      interpretation: sustainedAttentionInterpretation,
      score: analysis.clinicalIndexes.sustainedAttention,
    },
    {
      title: "Velocidad de procesamiento",
      interpretation: processingSpeedInterpretation,
      score: analysis.clinicalIndexes.processingSpeed,
    },
    {
      title: "Consistencia cognitiva",
      interpretation: cognitiveConsistencyInterpretation,
      score: analysis.clinicalIndexes.cognitiveConsistency,
    },
  ];
  const clinicalInterpretationText =
    "La interpretación clínica integra el Perfil Neurofuncional presentado en esta evaluación para describir el desempeño cognitivo observado durante la sesión.";
  const scientificIndicators = [
    { label: "Accuracy", value: formatIndicatorValue(analysis.accuracy) },
    { label: "Hit Rate", value: formatIndicatorValue(analysis.hitRate) },
    { label: "False Alarm Rate", value: formatIndicatorValue(analysis.falseAlarmRate) },
    { label: "dPrime", value: formatIndicatorValue(analysis.dPrime) },
    { label: "Criterion C", value: formatIndicatorValue(analysis.criterionC) },
    { label: "Tiempo medio de reacción", value: formatIndicatorValue(analysis.meanReactionTime) },
    { label: "Desviación estándar", value: formatIndicatorValue(analysis.standardDeviationReactionTime) },
    { label: "Coeficiente de variación", value: formatIndicatorValue(analysis.coefficientOfVariationReactionTime) },
    { label: "Hits", value: formatIndicatorValue(analysis.hits) },
    { label: "Misses", value: formatIndicatorValue(analysis.misses) },
    { label: "Correct Rejections", value: formatIndicatorValue(analysis.correctRejections) },
    { label: "False Alarms", value: formatIndicatorValue(analysis.falseAlarms) },
  ];

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
        <Stack spacing={3}>
          <Card elevation={3} sx={{ borderRadius: 4, overflow: "hidden" }}>
            <Box
              sx={{
                px: { xs: 3, sm: 4 },
                py: { xs: 3.5, sm: 4 },
                bgcolor: "#FFFFFF",
                textAlign: "center",
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
                  mx: "auto",
                  mb: 2.5,
                }}
              />

              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 800,
                  color: "primary.main",
                  fontSize: { xs: "1.75rem", sm: "2.1rem" },
                }}
              >
                Evaluación Neurofuncional
              </Typography>

              <Typography
                variant="subtitle2"
                sx={{
                  mt: 1.25,
                  fontWeight: 700,
                  letterSpacing: 0.6,
                  color: "text.secondary",
                  textTransform: "uppercase",
                }}
              >
                Encabezado
              </Typography>
            </Box>

            <Divider />

            <CardContent sx={{ px: { xs: 3, sm: 4 }, py: { xs: 3, sm: 4 } }}>
              <Stack spacing={2.25}>
                <Stack spacing={1.5}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      Expediente
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {session.expediente}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      Fecha
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {sessionDate}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      Hora
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {sessionTime}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      Sustancia
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, textTransform: "capitalize" }}>
                      {session.substance}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      Nivel
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {levelLabel}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card elevation={2} sx={{ borderRadius: 4 }}>
            <CardContent sx={{ px: { xs: 3, sm: 4 }, py: { xs: 3, sm: 4 } }}>
              <Stack spacing={2.25}>
                <Typography
                  variant="h6"
                  sx={{
                    textTransform: "uppercase",
                    letterSpacing: 0.4,
                    fontWeight: 800,
                    color: "primary.main",
                  }}
                >
                  Perfil Neurofuncional
                </Typography>

                <Stack spacing={1.5}>
                  {neurofunctionalProfileCards.map((profile) => (
                    <Card key={profile.title} variant="outlined" sx={{ borderRadius: 3 }}>
                      <CardContent>
                        <Stack
                          direction="row"
                          spacing={1.25}
                          sx={{ alignItems: "center", justifyContent: "space-between" }}
                        >
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 700 }}>
                              {profile.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                              {profile.interpretation}
                            </Typography>
                          </Box>

                          <Typography variant="h5" sx={{ fontWeight: 800 }}>
                            {formatScore(profile.score)}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card elevation={2} sx={{ borderRadius: 4 }}>
            <CardContent sx={{ px: { xs: 3, sm: 4 }, py: { xs: 3, sm: 4 } }}>
              <Stack spacing={2.5} sx={{ alignItems: "center", textAlign: "center" }}>
                <Typography
                  variant="h6"
                  sx={{
                    alignSelf: "flex-start",
                    textTransform: "uppercase",
                    letterSpacing: 0.4,
                    fontWeight: 800,
                    color: "primary.main",
                  }}
                >
                  Resumen Ejecutivo
                </Typography>

                <Card
                  variant="outlined"
                  sx={{
                    width: "100%",
                    borderRadius: 3,
                    borderColor: "divider",
                  }}
                >
                  <CardContent>
                    <Stack spacing={2.25} sx={{ alignItems: "center", textAlign: "center" }}>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        Índice Global Reconecta
                      </Typography>

                      <Box
                        sx={{
                          width: { xs: 170, sm: 190 },
                          height: { xs: 170, sm: 190 },
                          borderRadius: "50%",
                          ...progressStyle,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          boxShadow: "0 16px 36px rgba(17, 24, 39, 0.14)",
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
                          <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1 }}>
                            {formatScore(reconectaGlobalScore)}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="h5" sx={{ fontWeight: 700, color: progressColor }}>
                        {reconectaGlobalInterpretation}
                      </Typography>

                      <Typography variant="body2" sx={{ color: "text.secondary", maxWidth: 420 }}>
                        Este índice resume el desempeño neurofuncional global del paciente durante la evaluación.
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </CardContent>
          </Card>

          <Card elevation={2} sx={{ borderRadius: 4 }}>
            <CardContent sx={{ px: { xs: 3, sm: 4 }, py: { xs: 3, sm: 4 } }}>
              <Stack spacing={2}>
                <Typography
                  variant="h6"
                  sx={{
                    textTransform: "uppercase",
                    letterSpacing: 0.4,
                    fontWeight: 800,
                    color: "primary.main",
                  }}
                >
                  Interpretación Clínica
                </Typography>

                <Typography variant="body1" sx={{ color: "text.primary", lineHeight: 1.75 }}>
                  {clinicalInterpretationText}
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Card elevation={2} sx={{ borderRadius: 4 }}>
            <CardContent sx={{ px: { xs: 3, sm: 4 }, py: { xs: 3, sm: 4 } }}>
              <Stack spacing={2.25}>
                <Typography
                  variant="h6"
                  sx={{
                    textTransform: "uppercase",
                    letterSpacing: 0.4,
                    fontWeight: 800,
                    color: "primary.main",
                  }}
                >
                  Indicadores Científicos
                </Typography>

                <TableContainer>
                  <Table size="small" aria-label="Indicadores científicos">
                    <TableBody>
                      {scientificIndicators.map((indicator) => (
                        <TableRow key={indicator.label}>
                          <TableCell sx={{ fontWeight: 600, pl: 0 }}>{indicator.label}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, pr: 0 }}>
                            {indicator.value}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>
            </CardContent>
          </Card>

          <Button
            fullWidth
            size="large"
            variant="contained"
            onClick={() => navigate("/go-no-go", { replace: true })}
            sx={{ py: 2, borderRadius: 3, fontWeight: 800, fontSize: "1rem" }}
          >
            Finalizar
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

export default EvaluationResultsPage;