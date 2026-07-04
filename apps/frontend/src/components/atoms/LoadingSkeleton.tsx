import React from 'react';
import { Box, Skeleton } from '@mui/material';

interface LoadingSkeletonProps {
    variant?: 'table' | 'cards' | 'detail';
    rows?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ variant = 'table', rows = 4 }) => {
    if (variant === 'cards') {
        return (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
                {Array.from({ length: rows }).map((_, i) => (
                    <Skeleton key={i} variant="rounded" height={160} sx={{ borderRadius: '8px' }} />
                ))}
            </Box>
        );
    }

    if (variant === 'detail') {
        return (
            <Box sx={{ maxWidth: 520, mx: 'auto' }}>
                <Skeleton variant="rounded" height={200} sx={{ borderRadius: '16px', mb: 2 }} />
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="40%" />
            </Box>
        );
    }

    // variant === 'table'
    return (
        <Box>
            <Skeleton variant="rounded" height={48} sx={{ mb: 1, borderRadius: '4px' }} />
            {Array.from({ length: rows }).map((_, i) => (
                <Skeleton key={i} variant="rounded" height={56} sx={{ mb: 0.5, borderRadius: '4px' }} />
            ))}
        </Box>
    );
};

export default LoadingSkeleton;
