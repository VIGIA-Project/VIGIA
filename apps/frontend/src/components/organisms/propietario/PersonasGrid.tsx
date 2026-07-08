// src/components/organisms/propietario/PersonasGrid.tsx
import React, { useMemo, useState } from 'react';
import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AddIcon from '@mui/icons-material/Add';
import { motion, useReducedMotion } from 'framer-motion';
import { staggerContainer } from '../../../config/animations.config';
import { vigiaColors, vigiaRadius, vigiaShadows } from '../../../theme/vigia-theme';
import { PersonaCard } from '../../molecules';
import {
  PersonaAutorizada,
  PERSONAS_FILTERS_COPY,
  RESUMEN_CONFIANZA_COPY,
  REGLAS_VISIBLES_COPY,
  GRUPO_FAMILIAR_TITLE,
  PERSONAS_FRECUENTES_TITLE,
  PERSONAS_EMPTY_COPY,
  PERSONAS_EMPTY_SEARCH,
} from '../../../config/propietario-personas.config';

type FilterKey = 'todas' | 'familia' | 'frecuente' | 'pendiente';

export interface PersonasGridProps {
  personas: PersonaAutorizada[];
  onAdd: () => void;
  onViewDetail: (id: string) => void;
  onRegisterBio: (id: string) => void;
  onRevoke: (persona: PersonaAutorizada) => void;
}

export const PersonasGrid: React.FC<PersonasGridProps> = ({ personas, onAdd, onViewDetail, onRegisterBio, onRevoke }) => {
  const shouldReduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<FilterKey>('todas');
  const [search, setSearch] = useState('');

  const counts = useMemo(
    () => ({
      todas: personas.length,
      familia: personas.filter((p) => p.tipo === 'familia').length,
      frecuente: personas.filter((p) => p.tipo === 'frecuente').length,
      pendiente: personas.filter((p) => p.biometria === 'PENDIENTE' && p.estado === 'ACTIVA').length,
    }),
    [personas]
  );

  const resumen = useMemo(
    () => ({
      activas: personas.filter((p) => p.estado === 'ACTIVA').length,
      pendientes: personas.filter((p) => p.biometria === 'PENDIENTE' && p.estado === 'ACTIVA').length,
      revocadas: personas.filter((p) => p.estado === 'REVOCADA').length,
    }),
    [personas]
  );

  const filters: { key: FilterKey; label: string }[] = [
    { key: 'todas', label: `${PERSONAS_FILTERS_COPY.todas} ${counts.todas}` },
    { key: 'familia', label: `${PERSONAS_FILTERS_COPY.familia} ${counts.familia}` },
    { key: 'frecuente', label: `${PERSONAS_FILTERS_COPY.frecuentes} ${counts.frecuente}` },
    { key: 'pendiente', label: `${PERSONAS_FILTERS_COPY.pendiente} ${counts.pendiente}` },
  ];

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return personas.filter((p) => {
      const matchesSearch = !term || p.nombre.toLowerCase().includes(term);
      const matchesFilter =
        filter === 'todas' ||
        (filter === 'familia' && p.tipo === 'familia') ||
        (filter === 'frecuente' && p.tipo === 'frecuente') ||
        (filter === 'pendiente' && p.biometria === 'PENDIENTE' && p.estado === 'ACTIVA');
      return matchesSearch && matchesFilter;
    });
  }, [personas, filter, search]);

  const grupoFamiliar = filtered.filter((p) => p.tipo === 'familia');
  const frecuentes = filtered.filter((p) => p.tipo === 'frecuente');

  if (personas.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          px: 3,
          borderRadius: vigiaRadius.lg,
          border: '1px solid #E2E8F0',
          background: 'linear-gradient(180deg, rgba(13,92,207,0.04) 0%, rgba(255,255,255,0) 100%)',
        }}
      >
        <PeopleOutlineIcon sx={{ fontSize: 48, color: vigiaColors.primary, mb: 2 }} />
        <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, fontSize: '1.1rem', color: '#0F172A', mb: 1 }}>
          {PERSONAS_EMPTY_COPY.title}
        </Typography>
        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.85rem', color: vigiaColors.textSecondary, mb: 3, maxWidth: 380, mx: 'auto' }}>
          {PERSONAS_EMPTY_COPY.description}
        </Typography>
        <Box
          component="button"
          onClick={onAdd}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            background: vigiaColors.gradientIA,
            border: 'none',
            borderRadius: vigiaRadius.md,
            color: vigiaColors.white,
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            px: 3,
            py: 1.4,
          }}
        >
          <AddIcon sx={{ fontSize: 18 }} />
          {PERSONAS_EMPTY_COPY.cta}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Filtros */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: { xs: 0.5, sm: 0 } }}>
          {filters.map((f) => {
            const isActive = filter === f.key;
            return (
              <Box
                key={f.key}
                component="button"
                onClick={() => setFilter(f.key)}
                sx={{
                  flexShrink: 0,
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: vigiaRadius.sm,
                  px: 1.75,
                  py: 0.75,
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  transition: 'background-color 0.15s ease, color 0.15s ease',
                  backgroundColor: isActive ? '#0D5CCF' : '#F1F5F9',
                  color: isActive ? vigiaColors.white : '#475569',
                }}
              >
                {f.label}
              </Box>
            );
          })}
        </Box>
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={PERSONAS_FILTERS_COPY.searchPlaceholder}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: vigiaColors.textTertiary }} />
              </InputAdornment>
            ),
          }}
          sx={{
            minWidth: { xs: '100%', sm: 220 },
            '& .MuiOutlinedInput-root': {
              height: 44,
              borderRadius: vigiaRadius.sm,
              backgroundColor: vigiaColors.bgCard,
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.85rem',
              '&.Mui-focused fieldset': { borderColor: vigiaColors.greenIA, borderWidth: '2px' },
            },
          }}
        />
      </Box>

      {/* Resumen: 2 paneles */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
        <Box sx={{ borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0', boxShadow: vigiaShadows.sm, p: 2.25 }}>
          <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, fontSize: '0.95rem', color: '#0F172A', mb: 1.5 }}>
            {RESUMEN_CONFIANZA_COPY.title}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <GroupOutlinedIcon sx={{ fontSize: 18, color: '#16A34A' }} />
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.85rem', color: vigiaColors.textBody }}>
                {RESUMEN_CONFIANZA_COPY.activas(resumen.activas)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeOutlinedIcon sx={{ fontSize: 18, color: '#F59E0B' }} />
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.85rem', color: vigiaColors.textBody }}>
                {RESUMEN_CONFIANZA_COPY.pendientes(resumen.pendientes)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HighlightOffOutlinedIcon sx={{ fontSize: 18, color: vigiaColors.textTertiary }} />
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.85rem', color: vigiaColors.textBody }}>
                {RESUMEN_CONFIANZA_COPY.revocadas(resumen.revocadas)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', p: 2.25 }}>
          <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, fontSize: '0.95rem', color: '#0F172A', mb: 1.5 }}>
            {REGLAS_VISIBLES_COPY.title}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            {REGLAS_VISIBLES_COPY.bullets.map((bullet) => (
              <Typography key={bullet} sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.82rem', color: '#64748B' }}>
                • {bullet}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Secciones */}
      {filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.85rem', color: vigiaColors.textSecondary }}>
            {PERSONAS_EMPTY_SEARCH}
          </Typography>
        </Box>
      ) : (
        <>
          {grupoFamiliar.length > 0 && (
            <Box>
              <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, fontSize: '1rem', color: '#0F172A', mb: 1.5 }}>
                {GRUPO_FAMILIAR_TITLE}
              </Typography>
              <motion.div variants={shouldReduceMotion ? undefined : staggerContainer} initial="hidden" animate="visible">
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 1.75 }}>
                  {grupoFamiliar.map((persona) => (
                    <PersonaCard key={persona.id} persona={persona} onViewDetail={onViewDetail} onRegisterBio={onRegisterBio} onRevoke={onRevoke} />
                  ))}
                </Box>
              </motion.div>
            </Box>
          )}

          {frecuentes.length > 0 && (
            <Box>
              <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, fontSize: '1rem', color: '#0F172A', mb: 1.5 }}>
                {PERSONAS_FRECUENTES_TITLE}
              </Typography>
              <motion.div variants={shouldReduceMotion ? undefined : staggerContainer} initial="hidden" animate="visible">
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 1.75 }}>
                  {frecuentes.map((persona) => (
                    <PersonaCard key={persona.id} persona={persona} onViewDetail={onViewDetail} onRegisterBio={onRegisterBio} onRevoke={onRevoke} />
                  ))}
                </Box>
              </motion.div>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default PersonasGrid;
