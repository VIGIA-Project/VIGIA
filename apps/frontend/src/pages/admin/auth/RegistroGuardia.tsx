import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import PageHeader from "../../../components/admin-legacy/PageHeader";
import { usePersonasAdmin, useCrearUsuarioAdmin } from "../../../hooks/useAdmin";
import { Persona } from "../../../services/types/registry.types";

const generarPasswordTemporal = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let password = "";
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export default function RegistroGuardia() {
  const navigate = useNavigate();
  const personasQuery = usePersonasAdmin();
  const crearUsuarioMutation = useCrearUsuarioAdmin();

  const [correo, setCorreo] = useState("");
  const [persona, setPersona] = useState<Persona | null>(null);
  const [password, setPassword] = useState(generarPasswordTemporal());
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await crearUsuarioMutation.mutateAsync({
        email: correo,
        role: "GUARD",
        temporaryPassword: password,
        personaId: persona?.personaId,
      });
      navigate("/admin/usuarios");
    } catch (err: any) {
      setError(err?.response?.data?.message || "No se pudo crear la cuenta de guardia.");
    }
  };

  return (
    <Box>
      <PageHeader
        title="Registrar Guardia"
        subtitle="Crear cuenta de guardia"
        breadcrumbs={[{ label: "Auth" }, { label: "Registrar Guardia" }]}
      />
      <Box
        component="form"
        sx={{ display: "grid", gap: 2, maxWidth: 560 }}
        onSubmit={submit}
      >
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Correo institucional"
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <Autocomplete
          options={personasQuery.data ?? []}
          loading={personasQuery.isLoading}
          getOptionLabel={(p) => `${p.nombreCompleto} · ${p.identificacionNumero}`}
          isOptionEqualToValue={(a, b) => a.personaId === b.personaId}
          value={persona}
          onChange={(_e, val) => setPersona(val)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Vincular a persona"
              helperText="(Opcional) vincula la cuenta a una persona existente en Registry"
            />
          )}
        />
        <TextField
          label="Contraseña temporal"
          value={password}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setPassword(generarPasswordTemporal())} edge="end" size="small">
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          helperText="El guardia deberá cambiarla en su primer inicio de sesión"
        />
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => navigate("/admin/usuarios")}
          >
            Cancelar
          </Button>
          <Button variant="contained" type="submit" disabled={crearUsuarioMutation.isPending}>
            {crearUsuarioMutation.isPending ? "Creando..." : "Crear Guardia"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
