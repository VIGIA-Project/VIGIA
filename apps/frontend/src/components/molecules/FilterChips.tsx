import React from 'react';
import { Box, Chip } from '@mui/material';
import { vigiaColors, vigiaRadius } from '../../theme/vigia-theme';

interface FilterOption {
  key: string;
  label: string;
}

interface FilterChipsProps {
  options: FilterOption[];
  activeKey: string;
  onChange: (key: string) => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({ options, activeKey, onChange }) => (
  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
    {options.map((option) => (
      <Chip
        key={option.key}
        label={option.label}
        onClick={() => onChange(option.key)}
        sx={{
          fontFamily: '"Inter", sans-serif',
          fontWeight: 500,
          fontSize: '0.8rem',
          borderRadius: vigiaRadius.sm,
          transition: 'all 0.2s ease',
          ...(activeKey === option.key
            ? {
                background: vigiaColors.gradientIA,
                color: vigiaColors.white,
                boxShadow: '0 2px 8px rgba(25, 214, 196, 0.3)',
              }
            : {
                backgroundColor: 'rgba(13, 92, 207, 0.06)',
                color: vigiaColors.textSecondary,
                '&:hover': { backgroundColor: 'rgba(13, 92, 207, 0.12)' },
              }),
        }}
      />
    ))}
  </Box>
);

export default FilterChips;
