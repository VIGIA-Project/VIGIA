import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { SxProps } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  accent?: 'primary' | 'secondary' | 'warning' | 'error' | 'success' | 'info';
  sx?: SxProps<Theme>;
  path?: string;
}

const accentColors: Record<NonNullable<KpiCardProps['accent']>, string> = {
  primary: '#0D5CCF',
  secondary: '#11A9D6',
  warning: '#E0A82E',
  error: '#C0524A',
  success: '#5B9C5F',
  info: '#4A8EC0',
};

export default function KpiCard({ title, value, subtitle, icon, accent = 'primary', sx, path }: KpiCardProps) {
  const color = accentColors[accent];
  const navigate = useNavigate();
  return (
    <Card 
      onClick={() => path && navigate(path)}
      sx={{ 
        height: '100%', 
        cursor: path ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': path ? {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        } : {},
        ...sx 
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
            {title}
          </Typography>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${color}15`,
              color,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, color, lineHeight: 1.1, mb: 0.5 }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
