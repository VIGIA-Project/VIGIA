import React from 'react';
import { Box, Skeleton } from '@mui/material';

interface LoadingSkeletonProps {
  variant?: 'table' | 'cards' | 'detail' | 'inicio' | 'kpis';
  rows?: number;
}

const skeletonSx = {
  bgcolor: 'rgba(13, 92, 207, 0.06)',
  '&::after': {
    background: 'linear-gradient(90deg, transparent, rgba(13, 92, 207, 0.08), transparent)',
  },
};

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ variant = 'table', rows = 4 }) => {
  if (variant === 'kpis') {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 1.5 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={120} sx={{ borderRadius: '8px', ...skeletonSx }} />
        ))}
      </Box>
    );
  }

  if (variant === 'inicio') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Saludo */}
        <Skeleton variant="rounded" width="40%" height={32} sx={{ borderRadius: '6px', ...skeletonSx }} />

        {/* KPIs */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 1.5 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={120} sx={{ borderRadius: '8px', ...skeletonSx }} />
          ))}
        </Box>

        {/* Actividad */}
        <Box>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={48} sx={{ mb: 1, borderRadius: '6px', ...skeletonSx }} />
          ))}
        </Box>

        {/* Dos columnas */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5 }}>
          <Skeleton variant="rounded" height={180} sx={{ borderRadius: '8px', ...skeletonSx }} />
          <Skeleton variant="rounded" height={180} sx={{ borderRadius: '8px', ...skeletonSx }} />
        </Box>
      </Box>
    );
  }

  if (variant === 'cards') {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 1.5 }}>
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={160} sx={{ borderRadius: '8px', ...skeletonSx }} />
        ))}
      </Box>
    );
  }

  if (variant === 'detail') {
    return (
      <Box sx={{ maxWidth: 520, mx: 'auto' }}>
        <Skeleton variant="rounded" height={200} sx={{ borderRadius: '16px', mb: 2, ...skeletonSx }} />
        <Skeleton variant="text" width="60%" height={32} sx={skeletonSx} />
        <Skeleton variant="text" width="80%" sx={skeletonSx} />
        <Skeleton variant="text" width="40%" sx={skeletonSx} />
      </Box>
    );
  }

  // variant === 'table'
  return (
    <Box>
      <Skeleton variant="rounded" height={48} sx={{ mb: 1, borderRadius: '6px', ...skeletonSx }} />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} variant="rounded" height={56} sx={{ mb: 0.5, borderRadius: '6px', ...skeletonSx }} />
      ))}
    </Box>
  );
};

export default LoadingSkeleton;
