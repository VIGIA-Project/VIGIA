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
import { useQuery } from "@tanstack/react-query";
import { listarTodasPersonas, crearVehiculo } from "../../../services/registry.service";
import { CrearVehiculoDto } from "../../../services/types/registry.types";
import { useEffect, useState } from "react";

export default function VehiculoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const { data: personas = [] } = useQuery({
    queryKey: ['personasParaVehiculos'],
    queryFn: listarTodasPersonas,
  });

  const [form, setForm] = useState<Partial<CrearVehiculoDto>>({
    placa: "",
    marca: "",
    modelo: "",
    anio: undefined,
    color: "",
  });
  const [ownerId, setOwnerId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (isEdit && id) {
      // Editar en desarrollo
    }
  }, [isEdit, id]);

  const handleChange = (field: keyof CrearVehiculoDto, value: any) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    if (!ownerId || !form.placa) {
      alert("La placa y el propietario son obligatorios");
      return;
    }
    try {
      if (isEdit) {
        alert("La edición de vehículos está en desarrollo en el backend");
      } else {
        await crearVehiculo({
          propietarioPersonaId: ownerId,
          placa: form.placa,
          marca: form.marca,
          modelo: form.modelo,
          anio: Number(form.anio) || new Date().getFullYear(),
          color: form.color,
        });
        navigate("/admin/registry/vehiculos");
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al crear el vehículo");
    }
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
                  {/* El campo tipo no es parte del DTO backend actualmente */}
                  <TextField
                    fullWidth
                    label="Tipo"
                    placeholder="Sedan, SUV, etc."
                    disabled
                    value="En desarrollo"
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
                    getOptionLabel={(option) => option.nombreCompleto}
                    value={personas.find((p) => p.personaId === ownerId) || null}
                    onChange={(_e, val) => setOwnerId(val ? val.personaId : undefined)}
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
