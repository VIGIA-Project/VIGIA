// src/components/organisms/landing/ProblemaSection.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../../config/animations.config';
import { vigiaColors, vigiaRadius } from '../../../theme/vigia-theme';
import { LANDING_PROBLEMA } from '../../../config/landing.config';
import { LandingSectionHeading } from '../../molecules/LandingSectionHeading';

export const ProblemaSection: React.FC = () => (
  <Box
    id="problema"
    component="section"
    aria-labelledby="problema-title"
    sx={{ px: { xs: 3, md: 6 }, py: { xs: 5, md: 10 }, backgroundColor: '#F1F5F9' }}
  >
    <Box sx={{ maxWidth: 720, mx: 'auto', textAlign: 'center' }}>
      <LandingSectionHeading eyebrow={LANDING_PROBLEMA.eyebrow} title={LANDING_PROBLEMA.title} />
      <Typography
        sx={{
          fontFamily: '"Inter", sans-serif',
          fontSize: { xs: '0.95rem', md: '1.05rem' },
          color: vigiaColors.textSecondary,
          lineHeight: 1.7,
          mb: 4,
        }}
      >
        {LANDING_PROBLEMA.paragraph}
      </Typography>

      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}>
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
          {LANDING_PROBLEMA.pills.map((pill) => (
            <motion.div key={pill} variants={staggerItem}>
              <Box
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 500,
                  fontSize: '0.85rem',
                  color: vigiaColors.primary,
                  backgroundColor: 'rgba(13, 92, 207, 0.06)',
                  border: '1px solid rgba(13, 92, 207, 0.12)',
                  borderRadius: vigiaRadius.full,
                  px: 2.5,
                  py: 1,
                }}
              >
                {pill}
              </Box>
            </motion.div>
          ))}
        </Box>
      </motion.div>
    </Box>
  </Box>
);

export default ProblemaSection;
