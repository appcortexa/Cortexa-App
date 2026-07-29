import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import { generateSession } from "../core/generator/sessionGenerator";

const COUNTDOWN_STEPS = ["3", "2", "1", "¡Comienza!"];
const STEP_DURATION_MS = 1000;

function CountdownPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [stepIndex, setStepIndex] = useState(0);

  const evaluationSetup = location.state as
    | {
        expediente: string;
        sustancia: string;
        nivel: string;
        mode: "evaluation" | "training";
      }
    | undefined;

  useEffect(() => {
    if (!evaluationSetup) {
      navigate("/go-no-go");
      return;
    }

    const isLastStep = stepIndex === COUNTDOWN_STEPS.length - 1;

    const timeoutId = window.setTimeout(() => {
      if (isLastStep) {
        const session = generateSession(
          evaluationSetup.expediente,
          evaluationSetup.sustancia,
          evaluationSetup.nivel,
        );

        navigate("/test", {
          state: {
            session,
            mode: evaluationSetup.mode,
          },
        });
        return;
      }

      setStepIndex((previous) => previous + 1);
    }, STEP_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [evaluationSetup, navigate, stepIndex]);

  return (
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              fontSize: { xs: "1.6rem", sm: "2rem" },
            }}
          >
            La prueba comenzará en...
          </Typography>

          <Typography
            component="p"
            sx={{
              fontWeight: 800,
              color: "primary.main",
              lineHeight: 1,
              letterSpacing: "0.02em",
              fontSize: { xs: "4rem", sm: "5.5rem", md: "6.5rem" },
              minHeight: { xs: "4rem", sm: "5.5rem", md: "6.5rem" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {COUNTDOWN_STEPS[stepIndex]}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default CountdownPage;