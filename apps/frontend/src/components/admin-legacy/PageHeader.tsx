import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  action?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, breadcrumbs, action }: PageHeaderProps) {
  return (
    <Box sx={{ mb: 3 }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 1 }}
        >
          {breadcrumbs.map((bc, i) => {
            const isLast = i === breadcrumbs.length - 1;
            return isLast || !bc.href ? (
              <Typography key={i} variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                {bc.label}
              </Typography>
            ) : (
              <Link key={i} component={RouterLink} to={bc.href} variant="caption" underline="hover" sx={{ fontWeight: 600 }}>
                {bc.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {action && <Box>{action}</Box>}
      </Box>
    </Box>
  );
}
