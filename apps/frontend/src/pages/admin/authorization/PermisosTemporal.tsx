import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import PageHeader from "../../../components/admin-legacy/PageHeader";
import PermisosGrid from "../../../components/organisms/propietario/PermisosGrid";
import { useQuery } from '@tanstack/react-query';
import { listarTodosTemporales, revocarPermiso } from '../../../services/authorization.service';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { listarTodasPersonas, listarTodosVehiculos } from '../../../services/registry.service';

export default function PermisosTemporal() {
  const { data: permisos = [], isLoading: loadingPermisos } = useQuery({
    queryKey: ['temporalesAll'],
    queryFn: listarTodosTemporales,
    refetchInterval: 10000,
  });

  const { data: personasData = [], isLoading: loadingPersonas } = useQuery({
    queryKey: ['personas'],
    queryFn: listarTodasPersonas,
  });

  const { data: vehiculosData = [], isLoading: loadingVehiculos } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: listarTodosVehiculos,
  });

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedPermiso, setSelectedPermiso] = useState<any>(null);

  const handleRevoke = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas revocar este permiso temporal?")) {
      try {
        await revocarPermiso(id);
        alert("Permiso revocado exitosamente");
        // We could invalidate queries here, but a window reload or refetch is needed
        window.location.reload(); 
      } catch (e) {
        console.error(e);
        alert("Error al revocar el permiso");
      }
    }
  };

  const handleViewDetail = (id: string) => {
    const p = permisos.find(x => x.id === id);
    if (p) {
      setSelectedPermiso(p);
      setDetailOpen(true);
    }
  };

  const isLoading = loadingPermisos || loadingPersonas || loadingVehiculos;
  return (
    <Box>
      <PageHeader
        title="Permisos Temporales"
        subtitle="Consulta de permisos temporales otorgados (solo lectura para administrador)"
        breadcrumbs={[{ label: "Authorization" }, { label: "Temporales" }]}
      />
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          {
            label: "Permisos Activos",
            value: String(
              permisos.filter((p) => p.estado === "ACTIVO").length,
            ),
            color: "#5B9C5F",
          },
          { label: "Próximos a Expirar", value: "3", color: "#E0A82E" },
          {
            label: "Expirados (mes actual)",
            value: String(
              permisos.filter((p) => p.estado === "EXPIRADO" || p.estado === "REVOCADO").length,
            ),
            color: "#9E9E9E",
          },
        ].map((s) => (
          <Grid key={s.label} size={{ xs: 12, sm: 4 }}>
            <Card>
              <CardContent>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 600 }}
                >
                  {s.label}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: s.color }}
                >
                  {s.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {isLoading ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography>Cargando permisos temporales...</Typography>
        </Box>
      ) : (
        <PermisosGrid
          permisos={permisos.map(p => {
            let estadoMapped = p.estado;
            if (p.estado === 'ACTIVA') estadoMapped = 'ACTIVO';
            if (p.estado === 'EXPIRADA') estadoMapped = 'EXPIRADO';
            if (p.estado === 'REVOCADA') estadoMapped = 'REVOCADO';

            const pData = personasData.find(per => per.personaId === p.personaId);
            const vData = vehiculosData.find(veh => veh.vehiculoId === p.vehiculoId);

            return {
              id: p.id,
              personaId: p.personaId,
              persona: pData ? pData.nombreCompleto : `Usuario ${p.personaId.substring(0, 4)}`,
              cedula: pData ? pData.identificacionNumero : '---',
              estado: estadoMapped,
              vehiculo: {
                marca: vData?.marca || 'Vehículo',
                modelo: vData?.modelo || 'Desconocido',
                placa: vData?.placa || '---'
              },
              fechaInicio: p.vigenciaInicio,
              fechaFin: p.vigenciaFin,
              motivo: p.motivo,
            };
          }) as any}
          onViewDetail={handleViewDetail}
          onRevoke={handleRevoke}
          onCreateClick={() => {
            alert("Para crear un permiso, ve a la pestaña de Autorizaciones (Administración unificada).");
          }}
        />
      )}

      {/* Modal de Detalle */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Detalle del Permiso Temporal</DialogTitle>
        <DialogContent dividers>
          {selectedPermiso && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="body1"><strong>ID:</strong> {selectedPermiso.id}</Typography>
              <Typography variant="body1">
                <strong>Persona:</strong> {personasData.find(per => per.personaId === selectedPermiso.personaId)?.nombreCompleto || selectedPermiso.personaId}
              </Typography>
              <Typography variant="body1">
                <strong>Vehículo (Placa):</strong> {vehiculosData.find(veh => veh.vehiculoId === selectedPermiso.vehiculoId)?.placa || selectedPermiso.vehiculoId}
              </Typography>
              <Typography variant="body1"><strong>Motivo:</strong> {selectedPermiso.motivo}</Typography>
              <Typography variant="body1"><strong>Estado:</strong> {selectedPermiso.estado}</Typography>
              <Typography variant="body1"><strong>Vigencia Inicio:</strong> {new Date(selectedPermiso.vigenciaInicio).toLocaleString()}</Typography>
              <Typography variant="body1"><strong>Vigencia Fin:</strong> {new Date(selectedPermiso.vigenciaFin).toLocaleString()}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
