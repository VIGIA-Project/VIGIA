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
import { registryService, Vehiculo, Persona } from "../../../services/registry.service";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";

export default function VehiculoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<Partial<Vehiculo>>({
    placa: "",
    marca: "",
    modelo: "",
    anio: undefined as any,
    color: "",
  });
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initForm = async () => {
      try {
        setLoading(true);
        const pList = await registryService.getPersonas().catch(() => []);
        setPersonas(pList);

        if (isEdit && id) {
          const v = await registryService.getVehiculoById(id).catch(() => null);
          if (v) {
            setForm(v);
            if (v.propietarioPersonaId) {
              setOwnerId(v.propietarioPersonaId);
            }
          }
        }
      } finally {
        setLoading(false);
      }
    };
    initForm();
  }, [isEdit, id]);

  const handleChange = (field: keyof Vehiculo, value: any) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    if (!ownerId && !isEdit) {
      alert("Por favor selecciona un propietario.");
      return;
    }
    
    try {
      setLoading(true);
      const data = {
        placa: form.placa,
        marca: form.marca || undefined,
        modelo: form.modelo || undefined,
        color: form.color || undefined,
        anio: Number(form.anio) || undefined,
      };

      if (isEdit && id) {
        await registryService.updateVehiculo(id, data);
      } else {
        await registryService.createVehiculo({
          ...data,
          propietarioPersonaId: ownerId,
        });
      }
      navigate("/admin/registry/vehiculos");
    } catch (err) {
      console.error("Error saving vehiculo", err);
      alert("Error al guardar el vehículo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title={isEdit ? "Editar Vehículo" : "Nuevo Vehículo"}
        breadcrumbs={[
          { label: "Registry", href: "/admin/registry/vehiculos" },
          { label: "Vehículos", href: "/admin/registry/vehiculos" },
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
                    getOptionLabel={(option) => `${option.identificacionNumero} - ${option.nombres} ${option.apellidos}`}
                    value={personas.find(p => p.personaId === ownerId) || null}
                    onChange={(_e, val) => setOwnerId(val ? val.personaId : null)}
                    disabled={isEdit}
                    renderInput={(params) => (
                      <TextField {...params} label="Persona propietaria" helperText={isEdit ? "El propietario no puede cambiarse" : ""} />
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
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                onClick={handleSubmit}
                disabled={loading}
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
