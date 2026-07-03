import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { DashboardTemplate } from '../../components/templates';
import { NotificationList } from '../../components/organisms';
import { NotificacionViewDto } from '../../components/molecules/NotificationItem';
import { Severidad } from '@vigia/shared-types';

const MOCK_ALERTAS: NotificacionViewDto[] = [
    {
        alerta_id: 'al-101',
        severidad: Severidad.ALTA,
        mensaje_resumen: 'Acceso denegado reiterado — vehículo PBW-1234 en Acceso Norte',
        causa_origen: '3 intentos fallidos en 10 minutos',
        estado_atencion: 'PENDIENTE',
        hace: 'hace 2h',
    },
    {
        alerta_id: 'al-102',
        severidad: Severidad.ALTA,
        mensaje_resumen: 'Intento de acceso con placa no registrada asociada a su cuenta',
        causa_origen: 'Placa PZZ-9999 no existe en el sistema',
        estado_atencion: 'PENDIENTE',
        hace: 'hace 5h',
    },
    {
        alerta_id: 'al-103',
        severidad: Severidad.MEDIA,
        mensaje_resumen: 'Permiso Temporal próximo a expirar — vehículo PBB-3456',
        causa_origen: 'Vigencia finaliza en 4 horas',
        estado_atencion: 'PENDIENTE',
        hace: 'hace 8h',
    },
    {
        alerta_id: 'al-104',
        severidad: Severidad.MEDIA,
        mensaje_resumen: 'Pase de Acceso Rápido consumido correctamente',
        causa_origen: 'Acceso Sur — PBA-5678',
        estado_atencion: 'LEIDA',
        hace: 'hace 1d',
    },
    {
        alerta_id: 'al-105',
        severidad: Severidad.INFORMATIVA,
        mensaje_resumen: 'Validación biométrica exitosa registrada',
        causa_origen: 'Acceso Norte — PBW-1234',
        estado_atencion: 'LEIDA',
        hace: 'hace 2d',
    },
    {
        alerta_id: 'al-106',
        severidad: Severidad.INFORMATIVA,
        mensaje_resumen: 'Actualización de datos de vehículo registrada',
        causa_origen: 'Cambio de color — PBA-5678',
        estado_atencion: 'ARCHIVADA',
        hace: 'hace 3d',
    },
];

export const AlertasPage: React.FC = () => {
    const [alertas, setAlertas] = useState<NotificacionViewDto[]>(MOCK_ALERTAS);

    const handleMarcarLeida = (alertaId: string) => {
        setAlertas((prev) =>
            prev.map((n) => (n.alerta_id === alertaId ? { ...n, estado_atencion: 'LEIDA' } : n))
        );
    };

    const handleArchivar = (alertaId: string) => {
        setAlertas((prev) =>
            prev.map((n) => (n.alerta_id === alertaId ? { ...n, estado_atencion: 'ARCHIVADA' } : n))
        );
    };

    return (
        <DashboardTemplate
            rol="PROPIETARIO"
            pageTitle="Mis Alertas"
            notificationCount={2}
            userInitials="AC"
        >
            <Typography
                variant="h5"
                sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, color: '#0A2F86', mb: 3 }}
            >
                Centro de Alertas
            </Typography>

            <NotificationList
                notificaciones={alertas}
                onMarcarLeida={handleMarcarLeida}
                onArchivar={handleArchivar}
            />
        </DashboardTemplate>
    );
};

export default AlertasPage;
