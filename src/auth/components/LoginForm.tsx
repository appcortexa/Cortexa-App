import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { Alert, Box, Button, CircularProgress, TextField } from "@mui/material";
import PasswordField from "./PasswordField";

type LoginFormValues = {
  email: string;
  password: string;
};

type LoginFormProps = {
  onSubmit?: (email: string, password: string) => Promise<void> | void;
  loading?: boolean;
  errorMessage?: string | null;
};

function LoginForm({ onSubmit, loading = false, errorMessage }: LoginFormProps) {
  const [values, setValues] = useState<LoginFormValues>({
    email: "",
    password: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (onSubmit) {
      await onSubmit(values.email, values.password);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}>
        {errorMessage ? (
          <Alert severity="error">{errorMessage}</Alert>
        ) : null}

        <TextField
          fullWidth
          label="Correo electrónico"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
        />

        <PasswordField
          value={values.password}
          onChange={handleChange}
          label="Contraseña"
          name="password"
          autoComplete="current-password"
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading || !values.email || !values.password}
          sx={{
            py: 1.4,
            borderRadius: 2,
            fontWeight: 700,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : "Iniciar sesión"}
        </Button>
      </Box>
    </Box>
  );
}

export default LoginForm;
