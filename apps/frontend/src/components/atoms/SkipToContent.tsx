import React from 'react';
import { vigiaColors } from '../../theme/vigia-theme';

export const SkipToContent: React.FC = () => (
  <a
    href="#main-content"
    style={{
      position: 'absolute',
      top: '-100%',
      left: '16px',
      zIndex: 9999,
      padding: '12px 24px',
      backgroundColor: vigiaColors.primary,
      color: '#FFFFFF',
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.85rem',
      fontWeight: 600,
      borderRadius: '0 0 8px 8px',
      textDecoration: 'none',
      transition: 'top 0.2s ease',
    }}
    onFocus={(e) => { e.currentTarget.style.top = '0'; }}
    onBlur={(e) => { e.currentTarget.style.top = '-100%'; }}
  >
    Saltar al contenido principal
  </a>
);

export default SkipToContent;
