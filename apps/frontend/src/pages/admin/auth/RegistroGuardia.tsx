import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import PageHeader from "../../../components/admin-legacy/PageHeader";

export default function RegistroGuardia() {
  const navigate = useNavigate();
  const personas: { id: string; nombre: string; cedula: string }[] = [];
  const [nombre, setNombre] = useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [correo, setCorreo] = useState("");
  const [area, setArea] = useState("Puesto 1");
  const [personaId, setPersonaId] = useState<string | undefined>(undefined);

  const submit = () => {
    navigate("/admin/usuarios");
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
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <TextField
          label="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <TextField
          label="Identificación"
          value={identificacion}
          onChange={(e) => setIdentificacion(e.target.value)}
          required
        />
        <TextField
          label="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <TextField
          label="Área / Puesto"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
        <TextField
          select
          label="Vincular a persona"
          value={personaId ?? ""}
          onChange={(e) => setPersonaId(e.target.value)}
          helperText="(Opcional) vincula la cuenta a una persona existente"
        >
          <MenuItem value="">Ninguna</MenuItem>
          {personas.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.nombre} · {p.cedula}
            </MenuItem>
          ))}
        </TextField>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => navigate("/admin/usuarios")}
          >
            Cancelar
          </Button>
          <Button variant="contained" type="submit">
            Crear Guardia
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
