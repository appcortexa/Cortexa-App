import { useEffect, useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import type { GeneratedSession } from "../core/generator/sessionGenerator";
import { scoreTrial } from "../core/evaluation/trialScorer";

type SessionPlayerProps = {
  session: GeneratedSession;
  onFinalize?: () => void;
};

function SessionPlayer({ session, onFinalize }: SessionPlayerProps) {
  const [trialIndex, setTrialIndex] = useState(0);
  const [phase, setPhase] = useState<"stimulus" | "isi" | "finished">(
    session.trials.length > 0 ? "stimulus" : "finished",
  );
  const stimulusStartTimeRef = useRef<number | null>(null);
  const hasInteractedInCurrentTrialRef = useRef(false);

  useEffect(() => {
    if (phase !== "stimulus") {
      stimulusStartTimeRef.current = null;
      hasInteractedInCurrentTrialRef.current = false;
      return;
    }

    stimulusStartTimeRef.current = performance.now();
    hasInteractedInCurrentTrialRef.current = false;
  }, [phase, trialIndex]);

  useEffect(() => {
    if (phase === "finished") {
      return;
    }

    const currentTrial = session.trials[trialIndex];

    if (!currentTrial) {
      setPhase("finished");
      return;
    }

    const duration = phase === "stimulus" ? session.config.stimulusDuration : session.config.isi;
    const timeoutId = window.setTimeout(() => {
      if (phase === "stimulus") {
        if (!hasInteractedInCurrentTrialRef.current && currentTrial) {
          currentTrial.response = false;
          currentTrial.reactionTime = null;
        }

        if (currentTrial && currentTrial.response !== null) {
          currentTrial.result = scoreTrial({
            type: currentTrial.type,
            response: currentTrial.response,
          });
        }

        setPhase("isi");
        return;
      }

      if (trialIndex < session.trials.length - 1) {
        setTrialIndex((current) => current + 1);
        setPhase("stimulus");
        return;
      }

      setPhase("finished");
    }, duration);

    return () => window.clearTimeout(timeoutId);
  }, [phase, trialIndex, session]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (phase !== "stimulus") {
      return;
    }

    const isTouch = event.pointerType === "touch";
    const isLeftMouseClick = event.pointerType === "mouse" && event.button === 0;

    if (!isTouch && !isLeftMouseClick) {
      return;
    }

    if (hasInteractedInCurrentTrialRef.current) {
      return;
    }

    const currentTrial = session.trials[trialIndex];

    if (!currentTrial) {
      return;
    }

    const startTime = stimulusStartTimeRef.current;
    const reactionTime =
      startTime === null ? null : Math.max(0, performance.now() - startTime);

    currentTrial.response = true;
    currentTrial.reactionTime = reactionTime;
    hasInteractedInCurrentTrialRef.current = true;
  };

  return (
    <Box
      onPointerDown={handlePointerDown}
      sx={{
        bgcolor: "#FFFFFF",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {phase === "finished" ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            px: 3,
          }}
        >
          <Typography
            variant="h4"
            component="p"
            sx={{
              color: "text.primary",
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            Evaluación finalizada
          </Typography>

          <Button variant="contained" size="large" onClick={onFinalize}>
            Finalizar
          </Button>
        </Box>
      ) : phase === "stimulus" ? (
        <Box
          component="img"
          src={session.trials[trialIndex]?.stimulus.image}
          alt={session.trials[trialIndex]?.stimulus.id ?? "Estímulo"}
          sx={{
            display: "block",
            width: "auto",
            height: "auto",
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />
      ) : null}
    </Box>
  );
}

export default SessionPlayer;