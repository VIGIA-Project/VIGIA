// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Las fuentes "Exo 2" e "Inter" se cargan globalmente via <link> en index.html
// (ver bloque de fuentes Google Fonts a agregar en el <head>)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);