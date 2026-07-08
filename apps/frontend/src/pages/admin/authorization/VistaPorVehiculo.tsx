import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PageHeader from '../../../components/admin-legacy/PageHeader';
import StatusChip from '../../../components/admin-legacy/StatusChip';

interface Conductor {
  id: number;
  persona: string;
  tipo: 'Permanente' | 'Temporal';
  estado: 'ACTIVA' | 'INACTIVA' | 'EXPIRADO';
  vigencia: string;
}

const vehiculos = ['ABC-0123', 'PBC-1231', 'GTR-8832', 'XYZ-4567', 'MNL-7788'];

const conductores: Conductor[] = [
  { id: 1, persona: 'María Fernanda López', tipo: 'Permanente', estado: 'ACTIVA', vigencia: 'Indefinida' },
  { id: 2, persona: 'Carlos Andrés Mendoza', tipo: 'Temporal', estado: 'ACTIVA', vigencia: 'Hasta 2024-08-20 18:00' },
  { id: 3, persona: 'Diego Fernando Ramírez', tipo: 'Permanente', estado: 'INACTIVA', vigencia: 'Inactiva desde 2024-06-01' },
];

export default function VistaPorVehiculo() {
  const [vehiculo, setVehiculo] = useState<string | null>('ABC-0123');

  return (
    <Box>
      <PageHeader
        title="Vista por Vehículo"
        subtitle="Consulta contextual: ¿quién puede conducir un vehículo en este momento?"
        breadcrumbs={[{ label: 'Authorization' }, { label: 'Vista por Vehículo' }]}
      />
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Seleccionar Vehículo</Typography>
          <Autocomplete
            options={vehiculos}
            value={vehiculo}
            onChange={(_, v) => setVehiculo(v)}
            sx={{ maxWidth: 400 }}
            renderInput={(params) => <TextField {...params} label="Placa del vehículo" />}
          />
        </CardContent>
      </Card>
      {vehiculo && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 2, background: 'linear-gradient(135deg, #19D6C4 0%, #0D5CCF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DirectionsCarIcon sx={{ color: '#fff' }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{vehiculo}</Typography>
                <Typography variant="caption" color="text.secondary">Toyota Corolla 2022 · Propietario: María Fernanda López</Typography>
              </Box>
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
              Conductores autorizados actualmente
            </Typography>
            <List>
              {conductores.map((c, i) => (
                <Box key={c.id}>
                  <ListItem sx={{ px: 0, gap: 2 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: c.estado === 'ACTIVA' ? 'success.main' : 'grey.400' }}>
                        {c.persona.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{c.persona}</Typography>
                          <Chip label={c.tipo} size="small" variant="outlined" />
                          <StatusChip kind="autorizacion" value={c.estado} />
                        </Box>
                      }
                      secondary={<Typography variant="caption" color="text.secondary">{c.vigencia}</Typography>}
                    />
                  </ListItem>
                  {i < conductores.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
