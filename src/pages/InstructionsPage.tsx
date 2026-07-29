import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Card, CardContent, Container, Typography } from "@mui/material";

function InstructionsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const evaluationSetup = location.state as
    | {
        expediente: string;
        sustancia: string;
        nivel: string;
        mode: "evaluation" | "training";
      }
    | undefined;

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
            gap: { xs: 3, sm: 4 },
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
            Instrucciones
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.primary",
              lineHeight: 1.7,
              maxWidth: 620,
              fontSize: { xs: "1rem", sm: "1.05rem" },
            }}
          >
            A continuación aparecerán una serie de imágenes. Toque la pantalla únicamente cuando aparezcan
            imágenes que NO estén relacionadas con la sustancia que consume. No responda cuando aparezcan
            imágenes de la sustancia que consume.
          </Typography>

          <Card
            elevation={0}
            sx={{
              width: "100%",
              bgcolor: "#E3F2FD",
              border: "1px solid #90CAF9",
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2.5 } }}>
              <Typography variant="body1" sx={{ color: "#0D47A1", lineHeight: 1.6, fontWeight: 500 }}>
                La prueba debe realizarse en un lugar tranquilo, sin interrupciones y manteniendo la atención
                durante toda la evaluación.
              </Typography>
            </CardContent>
          </Card>

          <Box sx={{ width: "100%", display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, pt: 1 }}>
            <Button fullWidth variant="outlined" size="large" onClick={() => navigate("/go-no-go")}>
              Regresar
            </Button>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => navigate("/countdown", { state: evaluationSetup })}
            >
              Comenzar
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default InstructionsPage;