// src/theme/vigia-theme.ts
import { createTheme, ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Palette {
        vigia: {
            azulPrincipal: string;
            azulProfundo: string;
            azulIntermedio: string;
            verdeIA: string;
            doradoPremium: string;
            doradoClaro: string;
        };
        admin: {
            blueDeep: string;
            bluePrimary: string;
            gold: string;
            blueMid: string;
            greenIa: string;
            bgPage: string;
            textPrimary: string;
            textSecondary: string;
        };
    }
    interface PaletteOptions {
        vigia?: {
            azulPrincipal: string;
            azulProfundo: string;
            azulIntermedio: string;
            verdeIA: string;
            doradoPremium: string;
            doradoClaro: string;
        };
        admin?: {
            blueDeep?: string;
            bluePrimary?: string;
            gold?: string;
            blueMid?: string;
            greenIa?: string;
            bgPage?: string;
            textPrimary?: string;
            textSecondary?: string;
        };
    }
}

const themeOptions: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#0D5CCF',
            dark: '#0A2F86',
            light: '#11A9D6',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#00E5FF',
            contrastText: '#0A2F86',
        },
        warning: {
            main: '#F2B51F',
            light: '#FFD85A',
            contrastText: '#0A2F86',
        },
        success: {
            main: '#2E7D32',
            contrastText: '#FFFFFF',
        },
        error: {
            main: '#C62828',
            contrastText: '#FFFFFF',
        },
        info: {
            main: '#1565C0',
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#FAFBFC',
            paper: '#FFFFFF',
        },
        vigia: {
            azulPrincipal: '#0D5CCF',
            azulProfundo: '#0A2F86',
            azulIntermedio: '#11A9D6',
            verdeIA: '#00E5FF', // Changed from generic green to Electric AI Cyan
            doradoPremium: '#F2B51F',
            doradoClaro: '#FFD85A',
        },
        admin: {
            blueDeep: '#0A2F86',
            bluePrimary: '#0D5CCF',
            gold: '#F2B51F',
            blueMid: '#11A9D6',
            greenIa: '#19D6C4',
            bgPage: '#F8FAFC',
            textPrimary: '#1F2A44',
            textSecondary: '#6B7280',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontFamily: '"Exo 2", sans-serif', fontWeight: 600 },
        h2: { fontFamily: '"Exo 2", sans-serif', fontWeight: 600 },
        h3: { fontFamily: '"Exo 2", sans-serif', fontWeight: 600 },
        h4: { fontFamily: '"Exo 2", sans-serif', fontWeight: 600 },
        h5: { fontFamily: '"Exo 2", sans-serif', fontWeight: 600 },
        h6: { fontFamily: '"Exo 2", sans-serif', fontWeight: 600 },
        body1: { fontFamily: '"Inter", sans-serif' },
        body2: { fontFamily: '"Inter", sans-serif' },
        button: { fontFamily: '"Inter", sans-serif', textTransform: 'none', fontWeight: 600 },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '8px 20px',
                },
            },
        },
        MuiCard: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: {
                    border: '1px solid rgba(13, 92, 207, 0.06)',
                    borderRadius: 16,
                    boxShadow: '0px 10px 30px rgba(13, 92, 207, 0.05), 0px 2px 4px rgba(0, 0, 0, 0.02)',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                        boxShadow: '0px 16px 40px rgba(13, 92, 207, 0.08), 0px 4px 8px rgba(0, 0, 0, 0.03)',
                        transform: 'translateY(-2px)'
                    }
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    fontSize: '0.75rem',
                },
            },
        },
        MuiPaper: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                },
            },
        },
    },
};

export const vigiaTheme = createTheme(themeOptions);

// Paleta semántica de estados del dominio (para chips/lozenges)
export const estadoColors = {
    SUCCESSFUL: { bg: '#E8F5E9', text: '#2E7D32' },
    ACTIVA: { bg: '#E8F5E9', text: '#2E7D32' },
    PENDING_VERIFY: { bg: '#FFF8E1', text: '#EDB200' },
    PROGRAMADO: { bg: '#E3F2FD', text: '#1565C0' },
    DENIED: { bg: '#FFEBEE', text: '#C62828' },
    REVOCADO: { bg: '#FFEBEE', text: '#C62828' },
    MANUAL: { bg: '#E3F2FD', text: '#1565C0' },
    CONTINGENCIA: { bg: '#FFF3E0', text: '#EF6C00' },
    EXPIRADO: { bg: '#F5F5F5', text: '#6B7280' },
    INACTIVA: { bg: '#F5F5F5', text: '#6B7280' },
    ACTIVO: { bg: '#E8F5E9', text: '#2E7D32' },
    CONSUMIDO: { bg: '#E3F2FD', text: '#1565C0' },
    REVOCADA: { bg: '#FFEBEE', text: '#C62828' },
} as const;

// Gradiente oficial de IA (reutilizable en CSS)
export const vigiaGradient = {
    ia: 'linear-gradient(90deg, #19D6C4 0%, #11A9D6 40%, #0D5CCF 100%)',
    ia45: 'linear-gradient(45deg, #19D6C4 0%, #11A9D6 40%, #0D5CCF 100%)',
} as const;

// === DESIGN TOKENS V2 (Refactorización UI/UX) ===
export const vigiaShadows = {
  none: 'none',
  sm: '0 1px 3px rgba(10,47,134,0.06), 0 1px 2px rgba(10,47,134,0.04)',
  md: '0 4px 12px rgba(10,47,134,0.08), 0 2px 4px rgba(10,47,134,0.04)',
  lg: '0 8px 24px rgba(10,47,134,0.12), 0 4px 8px rgba(10,47,134,0.06)',
  xl: '0 16px 48px rgba(10,47,134,0.16), 0 8px 16px rgba(10,47,134,0.08)',
  glow: {
    ia: '0 0 20px rgba(25, 214, 196, 0.15)',
    gold: '0 0 16px rgba(242, 181, 31, 0.12)',
    blue: '0 0 20px rgba(13, 92, 207, 0.12)',
  },
};

export const vigiaSpacing = {
  page: 24,
  section: 20,
  card: 16,
  cardGap: 12,
  element: 8,
};

export const vigiaRadius = {
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

export const vigiaColors = {
  primary: '#0D5CCF',
  deep: '#0A2F86',
  mid: '#11A9D6',
  greenIA: '#00E5FF', // Mantiene el nombre de variable pero ahora es Cyan AI
  gold: '#F2B51F',
  goldLight: '#FFD85A',
  white: '#FFFFFF',
  bgPage: '#F8FAFC',
  bgCard: '#FFFFFF',
  bgCardHover: '#F0F7FF',
  bgSkeleton: 'rgba(13, 92, 207, 0.06)',
  bgSkeletonPulse: 'rgba(13, 92, 207, 0.12)',
  borderSubtle: 'rgba(10, 47, 134, 0.06)',
  textHeading: '#0A2F86',
  textBody: '#1F2A44',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  success: '#2E7D32',
  warning: '#EDB200',
  error: '#C62828',
  gradientIA: 'linear-gradient(90deg, #19D6C4 0%, #11A9D6 40%, #0D5CCF 100%)',
  gradientHero: 'linear-gradient(135deg, #0A2F86 0%, #0D5CCF 35%, #11A9D6 70%, #19D6C4 100%)',
  gradientRoleCard: 'linear-gradient(135deg, #0A2F86 0%, #0D5CCF 100%)',
};

export default vigiaTheme;