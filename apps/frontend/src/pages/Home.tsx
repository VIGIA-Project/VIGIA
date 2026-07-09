import React from 'react';
import { Box } from '@mui/material';
import {
  LandingHeader,
  LandingHero,
  ProblemaSection,
  FuncionamientoSection,
  RolesSection,
  SeguridadSection,
  ConfianzaCtaSection,
  LandingFooter,
} from '../components/organisms/landing';

const HomePage: React.FC = () => (
  <Box sx={{ minHeight: '100vh' }}>
    <LandingHeader />
    <LandingHero />
    <ProblemaSection />
    <FuncionamientoSection />
    <RolesSection />
    <SeguridadSection />
    <ConfianzaCtaSection />
    <LandingFooter />
  </Box>
);

export default HomePage;
