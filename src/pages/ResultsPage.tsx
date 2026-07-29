import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { getResultsByExpediente, type StoredResult } from "../services/resultsStorage";

function parseCreatedAt(result: StoredResult): number {
  if (result.createdAt) {
    const parsed = new Date(result.createdAt).getTime();
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  const [day, month, year] = result.fecha.split("/").map((value) => Number(value));
  if (!day || !month || !year) {
    return 0;
  }

  const timeMatch = result.hora
    .trim()
    .match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([ap]\.\s*m\.)?$/i);

  let hour = 0;
  let minute = 0;
  let second = 0;

  if (timeMatch) {
    hour = Number(timeMatch[1]);
    minute = Number(timeMatch[2]);
    second = Number(timeMatch[3] ?? "0");
    const period = timeMatch[4]?.toLowerCase().replace(/\s/g, "");

    if (period === "p.m." && hour < 12) {
      hour += 12;
    }

    if (period === "a.m." && hour === 12) {
      hour = 0;
    }
  }

  return new Date(year, month - 1, day, hour, minute, second).getTime();
}

function formatScore(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "Sin datos";
  }

  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function ResultsPage() {
  const navigate = useNavigate();
  const [expediente, setExpediente] = useState("");
  const [results, setResults] = useState<StoredResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleBack = () => {
    navigate("/go-no-go");
  };

  const handleSearch = () => {
    const foundResults = getResultsByExpediente(expediente);
    const orderedResults = [...foundResults].sort((a, b) => parseCreatedAt(b) - parseCreatedAt(a));

    setHasSearched(true);
    setResults(orderedResults);
  };

  const handleOpenResult = (result: StoredResult) => {
    navigate(result.modo === "evaluation" ? "/evaluation-results" : "/training-results", {
      state: {
        result,
      },
    });
  };

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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: "primary.main", textAlign: "center" }}>
            Consultar resultados
          </Typography>

          <TextField
            fullWidth
            label="Número de expediente"
            value={expediente}
            onChange={(event) => setExpediente(event.target.value)}
          />

          <Button fullWidth variant="contained" size="large" onClick={handleSearch}>
            Buscar
          </Button>

          {hasSearched && results.length === 0 ? (
            <Typography variant="body1" sx={{ color: "text.secondary", textAlign: "center" }}>
              No existen sesiones registradas para este expediente.
            </Typography>
          ) : null}

          {results.length > 0 ? (
            <Stack spacing={1.5}>
              {results.map((storedResult) => {
                const isEvaluation = storedResult.modo === "evaluation";
                const mainTitle = isEvaluation ? "Índice Global Reconecta" : "Control Inhibitorio";
                const score = isEvaluation
                  ? storedResult.clinicalIndexes.reconectaGlobalIndex
                  : storedResult.clinicalIndexes.inhibitoryControl;
                const interpretation = isEvaluation
                  ? storedResult.interpretations.reconectaGlobalIndex
                  : storedResult.interpretations.inhibitoryControl;

                return (
                  <Card key={storedResult.id} variant="outlined">
                    <CardActionArea onClick={() => handleOpenResult(storedResult)}>
                    <CardContent>
                      <Stack spacing={0.75}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          Fecha: {storedResult.fecha}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          Hora: {storedResult.hora}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          Modo: {isEvaluation ? "Evaluación" : "Entrenamiento"}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          {mainTitle}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          Puntaje: {formatScore(score)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          Interpretación: {interpretation ?? "Sin datos"}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
                );
              })}
            </Stack>
          ) : null}

          <Button fullWidth variant="outlined" size="large" onClick={handleBack}>
            Regresar
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default ResultsPage;