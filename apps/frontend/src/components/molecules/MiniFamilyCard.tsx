import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { vigiaColors, vigiaRadius } from '../../theme/vigia-theme';

interface MiniFamilyCardProps {
  nombre: string;
  parentesco: string;
  enrollmentCompletado: boolean;
  onClick?: () => void;
}

export const MiniFamilyCard: React.FC<MiniFamilyCardProps> = ({
  nombre,
  parentesco,
  enrollmentCompletado,
  onClick,
}) => {
  const initials = nombre.split(' ').map((n) => n[0]).join('').slice(0, 2);
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 1.5,
        borderRadius: vigiaRadius.sm,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background-color 0.2s ease',
        '&:hover': onClick ? { backgroundColor: 'rgba(13, 92, 207, 0.03)' } : {},
      }}
    >
      <Avatar
        sx={{
          width: 36,
          height: 36,
          fontSize: '0.75rem',
          fontWeight: 600,
          background: enrollmentCompletado ? vigiaColors.gradientIA : 'rgba(13, 92, 207, 0.1)',
          color: enrollmentCompletado ? vigiaColors.white : vigiaColors.primary,
        }}
      >
        {initials}
      </Avatar>
      <Box>
        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 500, fontSize: '0.85rem', color: vigiaColors.textBody }}>
          {nombre}
        </Typography>
        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.7rem', color: vigiaColors.textTertiary }}>
          {parentesco} · {enrollmentCompletado ? '✅ Enrollment' : '⏳ Pendiente'}
        </Typography>
      </Box>
    </Box>
  );
};

export default MiniFamilyCard;
