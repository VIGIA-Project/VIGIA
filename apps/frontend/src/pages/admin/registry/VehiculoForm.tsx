import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PageHeader from "../../../components/admin-legacy/PageHeader";
import { usePersonasAdmin, useVehiculoPorIdAdmin } from "../../../hooks/useAdmin";
import { useCrearVehiculo, useActualizarVehiculo } from "../../../hooks/useRegistry";
import { Persona } from "../../../services/types/registry.types";

interface FormState {
  placa: string;
  marca: string;
  modelo: string;
  anio: number | "";
  color: string;
}

const EMPTY_FORM: FormState = { placa: "", marca: "", modelo: "", anio: "", color: "" };

export default function VehiculoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const vehiculoQuery = useVehiculoPorIdAdmin(isEdit ? id : undefined);
  const personasQuery = usePersonasAdmin();
  const crearMutation = useCrearVehiculo();
  const actualizarMutation = useActualizarVehiculo();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [propietario, setPropietario] = useState<Persona | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && vehiculoQuery.data) {
      const v = vehiculoQuery.data;
      setForm({ placa: v.placa, marca: v.marca ?? "", modelo: v.modelo ?? "", anio: v.anio ?? "", color: v.color ?? "" });
    }
  }, [isEdit, vehiculoQuery.data]);

  const handleChange = (field: keyof FormState, value: string | number) =>
    setForm((f) => ({ ...f, [field]: value }));

  const isSaving = crearMutation.isPending || actualizarMutation.isPending;

  const handleSubmit = async () => {
    setError(null);
    if (!form.placa.trim()) {
      setError("La placa es obligatoria.");
      return;
    }
    if (!isEdit && !propietario) {
      setError("Selecciona la persona propietaria.");
      return;
    }
    try {
      if (isEdit && id) {
        await actualizarMutation.mutateAsync({
          vehiculoId: id,
          dto: { placa: form.placa, marca: form.marca, modelo: form.modelo, color: form.color, anio: form.anio || undefined },
        });
      } else {
        await crearMutation.mutateAsync({
          propietarioPersonaId: propietario!.personaId,
          placa: form.placa,
          marca: form.marca,
          modelo: form.modelo,
          color: form.color,
          anio: form.anio || undefined,
        });
      }
      navigate("/admin/registry/vehiculos");
    } catch (err: any) {
      setError(err?.response?.data?.message || "No se pudo guardar el vehículo.");
    }
  };

  if (isEdit && vehiculoQuery.isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

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
            {error && <Alert severity="error">{error}</Alert>}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Datos del Vehículo
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Placa"
                    placeholder="ABC0123"
                    value={form.placa}
                    disabled={isEdit}
                    onChange={(e) => handleChange("placa", e.target.value.toUpperCase())}
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
                    type="number"
                    value={form.anio}
                    onChange={(e) =>
                      handleChange("anio", e.target.value ? Number(e.target.value) : "")
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
              </Grid>
            </Box>
            {!isEdit && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Propietario
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Autocomplete
                      options={personasQuery.data ?? []}
                      loading={personasQuery.isLoading}
                      getOptionLabel={(p) => `${p.nombreCompleto} · ${p.identificacionNumero}`}
                      isOptionEqualToValue={(a, b) => a.personaId === b.personaId}
                      value={propietario}
                      onChange={(_e, val) => setPropietario(val)}
                      renderInput={(params) => (
                        <TextField {...params} label="Persona propietaria" />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
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
                disabled={isSaving}
              >
                {isSaving ? "Guardando..." : isEdit ? "Guardar Cambios" : "Crear Vehículo"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
