import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PageHeader from "../../../components/admin-legacy/PageHeader";
import {
  getVehiculoById,
  upsertVehiculo,
} from "../../../config/propietario-vehiculos.config";
import { PropietarioVehiculo } from "../../../config/propietario-vehiculos.config";
import { useEffect, useState } from "react";

const personas: string[] = [];

export default function VehiculoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<Partial<PropietarioVehiculo>>({
    placa: "",
    marca: "",
    modelo: "",
    anio: undefined,
    color: "",
    tipo: "",
  });
  const [owner, setOwner] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (isEdit && id) {
      const v = getVehiculoById(id as string);
      if (v) setForm(v);
    }
  }, [isEdit, id]);

  const handleChange = (field: keyof PropietarioVehiculo, value: any) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = () => {
    const veh: PropietarioVehiculo = {
      id: form.id ?? `veh-${Date.now()}`,
      placa: form.placa ?? "",
      marca: form.marca ?? "",
      modelo: form.modelo ?? "",
      anio: Number(form.anio) || new Date().getFullYear(),
      color: form.color ?? "",
      tipo: form.tipo ?? "Sedán",
      estado: form.estado ?? "ACTIVO",
      permisosActivos: form.permisosActivos ?? 0,
      alertas: form.alertas ?? 0,
      personasAsignadas: form.personasAsignadas ?? 0,
      personasSinBiometria: form.personasSinBiometria ?? 0,
    };
    upsertVehiculo(veh);
    navigate("/admin/registry/vehiculos");
  };

  return (
    <Box>
      <PageHeader
        title={isEdit ? "Editar Vehículo" : "Nuevo Vehículo"}
        breadcrumbs={[
          { label: "Registry", href: "#/admin/registry/vehiculos" },
          { label: "Vehículos", href: "#/admin/registry/vehiculos" },
          { label: isEdit ? "Editar" : "Nuevo" },
        ]}
        action={
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/admin/registry/vehiculos")}
          >
            Volver
          </Button>
        }
      />
      <Card>
        <CardContent>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Datos del Vehículo
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Placa"
                    placeholder="ABC-0123"
                    value={form.placa}
                    onChange={(e) => handleChange("placa", e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Marca"
                    value={form.marca}
                    onChange={(e) => handleChange("marca", e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Modelo"
                    value={form.modelo}
                    onChange={(e) => handleChange("modelo", e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Año"
                    value={form.anio ?? ""}
                    onChange={(e) =>
                      handleChange("anio", Number(e.target.value))
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Color"
                    value={form.color}
                    onChange={(e) => handleChange("color", e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Tipo"
                    placeholder="Sedan, SUV, etc."
                    value={form.tipo}
                    onChange={(e) => handleChange("tipo", e.target.value)}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Propietario
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Autocomplete
                    options={personas}
                    value={owner ?? ""}
                    onChange={(_e, val) => setOwner(val ?? undefined)}
                    renderInput={(params) => (
                      <TextField {...params} label="Persona propietaria" />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/admin/registry/vehiculos")}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
              >
                {isEdit ? "Guardar Cambios" : "Crear Vehículo"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
