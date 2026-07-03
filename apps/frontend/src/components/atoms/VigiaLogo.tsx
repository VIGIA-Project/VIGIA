import React from 'react';

export interface VigiaLogoProps {
    size?: number;
}

export const VigiaLogo: React.FC<VigiaLogoProps> = ({ size = 44 }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 80 80"
        fill="none"
        width={size}
        height={size}
    >
        <defs>
            <linearGradient id="sidebar-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e8d070" />
                <stop offset="50%" stopColor="#c29b38" />
                <stop offset="100%" stopColor="#8a6b1c" />
            </linearGradient>
        </defs>

        {/* Sol UCE — Rayos radiantes */}
        <g stroke="url(#sidebar-gold)" strokeWidth="2.5" strokeLinecap="round" fill="none">
            <line x1="28" y1="40" x2="14" y2="40" />
            <line x1="29" y1="32" x2="16" y2="24" />
            <line x1="32" y1="26" x2="24" y2="14" />
            <line x1="29" y1="48" x2="16" y2="56" />
            <line x1="32" y1="54" x2="24" y2="66" />
        </g>

        {/* Arco dorado del sol (semicírculo izquierdo) */}
        <path
            d="M 34 17 A 23 23 0 0 0 34 63"
            stroke="url(#sidebar-gold)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
        />

        {/* Lente biométrico — anillo exterior */}
        <circle cx="40" cy="40" r="15" stroke="#1d409e" strokeWidth="2" fill="none" />

        {/* Lente biométrico — capas internas */}
        <circle cx="40" cy="40" r="11" fill="#183687" />
        <circle cx="40" cy="40" r="5" fill="#0b1a45" />

        {/* Reflejos de luz */}
        <circle cx="43" cy="36" r="2" fill="#ffffff" opacity="0.85" />
        <circle cx="37" cy="43" r="1" fill="#ffffff" opacity="0.5" />

        {/* Arco de escaneo verde (highlight del lente) */}
        <path
            d="M 40 31 A 9 9 0 0 1 49 40"
            stroke="#4bb6b1"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
        />

        {/* Arcos de escaneo — ondas que emanan */}
        <g strokeLinecap="round" fill="none">
            <path d="M40 22 A18 18 0 0 1 54 30" stroke="#4bb6b1" strokeWidth="1.5" />
            <path d="M40 58 A18 18 0 0 0 54 50" stroke="#4bb6b1" strokeWidth="1.5" />
            <path d="M40 17 A23 23 0 0 1 59 25" stroke="#4bb6b1" strokeWidth="1.3" opacity="0.7" />
            <path d="M40 63 A23 23 0 0 0 59 55" stroke="#4bb6b1" strokeWidth="1.3" opacity="0.7" />
            <path d="M40 12 A28 28 0 0 1 63 20" stroke="#1d409e" strokeWidth="1.3" opacity="0.5" />
            <path d="M40 68 A28 28 0 0 0 63 60" stroke="#1d409e" strokeWidth="1.3" opacity="0.5" />
        </g>

        {/* Ramificaciones (circuitos → nodos) */}
        <g strokeLinecap="round" fill="none">
            <line x1="54" y1="30" x2="62" y2="30" stroke="#4bb6b1" strokeWidth="1.5" />
            <line x1="59" y1="25" x2="68" y2="25" stroke="#4bb6b1" strokeWidth="1.3" />
            <line x1="63" y1="20" x2="72" y2="20" stroke="#1d409e" strokeWidth="1.3" />
            <line x1="55" y1="40" x2="70" y2="40" stroke="#1d409e" strokeWidth="1.5" />
            <line x1="54" y1="50" x2="62" y2="50" stroke="#4bb6b1" strokeWidth="1.5" />
            <line x1="59" y1="55" x2="68" y2="55" stroke="#4bb6b1" strokeWidth="1.3" />
            <line x1="63" y1="60" x2="72" y2="60" stroke="#1d409e" strokeWidth="1.3" />
        </g>

        {/* Nodos terminales */}
        <circle cx="62" cy="30" r="2" fill="#4bb6b1" />
        <circle cx="68" cy="25" r="2" fill="#4bb6b1" />
        <circle cx="72" cy="20" r="2" fill="#1d409e" />
        <circle cx="70" cy="40" r="2" fill="#1d409e" />
        <circle cx="62" cy="50" r="2" fill="#4bb6b1" />
        <circle cx="68" cy="55" r="2" fill="#4bb6b1" />
        <circle cx="72" cy="60" r="2" fill="#1d409e" />

        {/* Detalle dorado — arco de conexión */}
        <path
            d="M40 24 A16 16 0 0 1 52 34"
            stroke="#c29b38"
            strokeWidth="1.3"
            strokeLinecap="round"
            fill="none"
        />
        <line x1="52" y1="34" x2="58" y2="34" stroke="#c29b38" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="58" cy="34" r="1.5" fill="#c29b38" />
    </svg>
);

export default VigiaLogo;