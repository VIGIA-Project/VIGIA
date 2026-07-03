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
            main: '#19D6C4',
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
            verdeIA: '#19D6C4',
            doradoPremium: '#F2B51F',
            doradoClaro: '#FFD85A',
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
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(13, 92, 207, 0.08)',
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
} as const;

// Gradiente oficial de IA (reutilizable en CSS)
export const vigiaGradient = {
    ia: 'linear-gradient(90deg, #19D6C4 0%, #11A9D6 40%, #0D5CCF 100%)',
    ia45: 'linear-gradient(45deg, #19D6C4 0%, #11A9D6 40%, #0D5CCF 100%)',
} as const;

export default vigiaTheme;