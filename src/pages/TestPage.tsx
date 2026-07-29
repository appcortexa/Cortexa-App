import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
} from "@mui/material";
import SessionPlayer from "../components/SessionPlayer";
import { analyzeSession } from "../core/evaluation/sessionAnalyzer";
import type { GeneratedSession } from "../core/generator/sessionGenerator";
import { saveResult } from "../services/resultsStorage";

function TestPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isPlayerStopped, setIsPlayerStopped] = useState(false);

  const navigationState = location.state as
    | {
        session?: GeneratedSession;
        mode?: "evaluation" | "training";
      }
    | undefined;
  const session = navigationState?.session;
  const mode = navigationState?.mode;

  useEffect(() => {
    if (!session || !mode) {
      navigate("/go-no-go");
    }
  }, [mode, navigate, session]);

  if (!session || !mode) {
    return null;
  }

  const handleCloseDialog = () => {
    setIsCancelDialogOpen(false);
  };

  const handleConfirmCancel = () => {
    setIsCancelDialogOpen(false);
    navigate("/reconecta");
  };

  const handleFinalize = () => {
    session.status = "FINISHED";

    const analysis = analyzeSession(session);
    const storedResult = saveResult({
      id: session.id,
      expediente: session.expediente,
      modo: mode,
      sustancia: session.substance,
      nivel: session.level,
      sessionId: session.id,
      createdAt: new Date(session.createdAt).toISOString(),
      session,
      analysis,
      interpretations: analysis.interpretation,
      ...analysis,
    });

    setIsPlayerStopped(true);
    navigate(mode === "evaluation" ? "/evaluation-results" : "/training-results", {
      replace: true,
      state: {
        result: storedResult,
      },
    });
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100vh" }}>
      <IconButton
        aria-label="Cancelar evaluación"
        onClick={() => setIsCancelDialogOpen(true)}
        sx={{
          position: "fixed",
          top: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          zIndex: (theme) => theme.zIndex.modal + 1,
          bgcolor: "error.main",
          color: "common.white",
          boxShadow: 3,
          "&:hover": {
            bgcolor: "error.dark",
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      {!isPlayerStopped ? <SessionPlayer session={session} onFinalize={handleFinalize} /> : null}

      <Dialog
        open={isCancelDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="cancel-evaluation-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="cancel-evaluation-dialog-description">
            ¿Desea cancelar la evaluación? Se perderán todos los datos de esta sesión.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Continuar evaluación
          </Button>
          <Button onClick={handleConfirmCancel} variant="contained" color="error">
            Cancelar evaluación
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TestPage;