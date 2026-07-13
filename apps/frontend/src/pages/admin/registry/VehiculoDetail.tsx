import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import CircularProgress from "@mui/material/CircularProgress";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PageHeader from "../../../components/admin-legacy/PageHeader";
import StatusChip from "../../../components/admin-legacy/StatusChip";
import DataTable, {
  type Column,
} from "../../../components/admin-legacy/DataTable";
import {
  useVehiculoPorIdAdmin,
  usePermanentesPorVehiculoAdmin,
  usePermisosPorVehiculoAdmin,
  usePersonasAdmin,
} from "../../../hooks/useAdmin";

interface AutorizacionRow {
  id: string;
  persona: string;
  tipo: "Permanente" | "Temporal";
  estado: string;
  vigencia: string;
}

const authCols: Column<AutorizacionRow>[] = [
  {
    id: "persona",
    label: "Persona",
    render: (r) => (
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {r.persona}
      </Typography>
    ),
  },
  { id: "tipo", label: "Tipo", render: (r) => r.tipo },
  {
    id: "estado",
    label: "Estado",
    render: (r) => <StatusChip kind="autorizacion" value={r.estado} />,
  },
  { id: "vigencia", label: "Vigencia", render: (r) => r.vigencia },
];

export default function VehiculoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  const vehiculoQuery = useVehiculoPorIdAdmin(id);
  const vehiculo = vehiculoQuery.data;
  const permanentesQuery = usePermanentesPorVehiculoAdmin(id);
  const temporalesQuery = usePermisosPorVehiculoAdmin(id);
  const personasQuery = usePersonasAdmin();

  const personasById = useMemo(() => {
    const map = new Map<string, string>();
    (personasQuery.data ?? []).forEach((p: any) => map.set(p.personaId, p.nombreCompleto));
    return map;
  }, [personasQuery.data]);

  const autorizaciones: AutorizacionRow[] = useMemo(() => {
    const permanentes = (permanentesQuery.data ?? []).map((a: any) => ({
      id: a.id,
      persona: personasById.get(a.personaId) ?? a.personaId,
      tipo: "Permanente" as const,
      estado: a.estado,
      vigencia: "Indefinida",
    }));
    const temporales = (temporalesQuery.data ?? []).map((p: any) => ({
      id: p.id,
      persona: personasById.get(p.personaId) ?? p.personaId,
      tipo: "Temporal" as const,
      estado: p.estado,
      vigencia: `${new Date(p.vigenciaInicio).toLocaleDateString("es-EC")} → ${new Date(p.vigenciaFin).toLocaleDateString("es-EC")}`,
    }));
    return [...permanentes, ...temporales];
  }, [permanentesQuery.data, temporalesQuery.data, personasById]);

  if (vehiculoQuery.isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (vehiculoQuery.isError || !vehiculo) {
    return <Typography color="error">No se pudo cargar el vehículo.</Typography>;
  }

  return (
    <Box>
      <PageHeader
        title="Detalle de Vehículo"
        breadcrumbs={[
          { label: "Registry" },
          { label: "Vehículos", href: "/admin/registry/vehiculos" },
          { label: vehiculo.placa },
        ]}
        action={
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/admin/registry/vehiculos")}
            >
              Volver
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/admin/registry/vehiculos/${id}/editar`)}
            >
              Editar
            </Button>
          </Box>
        }
      />
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: 2,
                background: "linear-gradient(135deg, #19D6C4 0%, #0D5CCF 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DirectionsCarIcon sx={{ fontSize: 36, color: "#fff" }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {vehiculo.placa}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {vehiculo.marca ?? "—"} {vehiculo.modelo ?? ""} {vehiculo.anio ?? ""} · {vehiculo.color ?? "—"}
              </Typography>
              <StatusChip kind="cuenta" value={vehiculo.estadoRegistro} />
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2 }}>
            <Tab label="Resumen" />
            <Tab label="Autorizaciones" />
          </Tabs>
        </Box>
        <CardContent>
          {tab === 0 && (
            <Grid container spacing={3}>
              {[
                ["Placa", vehiculo.placa],
                ["Marca", vehiculo.marca ?? "—"],
                ["Modelo", vehiculo.modelo ?? "—"],
                ["Año", String(vehiculo.anio ?? "—")],
                ["Color", vehiculo.color ?? "—"],
                ["Propietario", personasById.get(vehiculo.propietarioPersonaId) ?? vehiculo.propietarioPersonaId],
                ["Fecha de registro", new Date(vehiculo.createdAt).toLocaleDateString("es-EC")],
                ["Estado", vehiculo.estadoRegistro],
              ].map(([label, value]) => (
                <Grid key={label} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 600, display: "block" }}
                  >
                    {label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          )}
          {tab === 1 && (
            permanentesQuery.isLoading || temporalesQuery.isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={28} />
              </Box>
            ) : (
              <DataTable
                columns={authCols}
                rows={autorizaciones}
                searchKeys={(r) => r.persona}
              />
            )
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
