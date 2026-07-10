// src/App.tsx
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { vigiaTheme } from "./theme/vigia-theme";

// ─── Auth, Guards y Átomos ─────────────────────────────────────────────────
import { AuthProvider, useAuth } from "./context";
import { ProtectedRoute, PublicRoute } from "./components/guards";
import {
  SkipToContent,
  SessionExpiredAlert,
  AuthNoticeAlert,
  PageTransition,
} from "./components/atoms";

// ─── Páginas: Home & Login ────────────────────────────────────────────────
import HomePage from "./pages/Home";
import { LoginPage, CambiarPasswordPage } from "./pages/auth";

// ─── Páginas: Propietario ─────────────────────────────────────────────────
import BiometricOnboardingPage from "./pages/propietario/onboarding/BiometricOnboardingPage";
import VehicleOnboardingPage from "./pages/propietario/onboarding/VehicleOnboardingPage";
import { InicioPage } from "./pages/propietario/Inicio";
import { MisVehiculosPage } from "./pages/propietario/MisVehiculos";
import { VehiculoDetallePage } from "./pages/propietario/VehiculoDetallePage";
import { PersonasAutorizadasPage } from "./pages/propietario/PersonasAutorizadas";
import { PersonaDetallePage } from "./pages/propietario/PersonaDetallePage";
import { BiometricCapturePersonaPage } from "./pages/propietario/BiometricCapturePersonaPage";
import { PermisosTemporalesPage } from "./pages/propietario/PermisosTemporales";
import { PasesRapidosPage } from "./pages/propietario/PasesRapidos";
import { AlertasPage } from "./pages/propietario/Alertas";
import { HistorialPage } from "./pages/propietario/Historial";
import { PerfilPage } from "./pages/propietario/Perfil";

// ─── Páginas: Guardia ─────────────────────────────────────────────────────
import { GuardiaInicioPage } from "./pages/guardia/Inicio";
import { ColaEventosPage } from "./pages/guardia/ColaEventos";
import { RevisionManualPage } from "./pages/guardia/RevisionManual";
import { ContingenciaPage } from "./pages/guardia/Contingencia";
import { AlertasGuardiaPage } from "./pages/guardia/AlertasGuardia";

// ─── Páginas: Admin ───────────────────────────────────────────────────────
import LegacyAdminLayout from "./components/templates/LegacyAdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import VehiculosList from "./pages/admin/registry/VehiculosList";
import VehiculoDetail from "./pages/admin/registry/VehiculoDetail";
import VehiculoForm from "./pages/admin/registry/VehiculoForm";
import PersonasList from "./pages/admin/registry/PersonasList";
import PersonaDetail from "./pages/admin/registry/PersonaDetail";
import AutorizacionesPermanentes from "./pages/admin/authorization/AutorizacionesPermanentes";
import PermisosTemporal from "./pages/admin/authorization/PermisosTemporal";
import VistaPorVehiculo from "./pages/admin/authorization/VistaPorVehiculo";
import PerfilesList from "./pages/admin/biometric/PerfilesList";
import RegistroBiometrico from "./pages/admin/biometric/RegistroBiometrico";
import DetallePerfil from "./pages/admin/biometric/DetallePerfil";
import AlertasList from "./pages/admin/alerting/AlertasList";
import AlertaDetail from "./pages/admin/alerting/AlertaDetail";
import Notificaciones from "./pages/admin/alerting/Notificaciones";
import HistorialEventos from "./pages/admin/auditoria/HistorialEventos";
import DetalleHistorico from "./pages/admin/auditoria/DetalleHistorico";
import CuentasList from "./pages/admin/auth/CuentasList";
import Reportes from "./pages/admin/reportes/Reportes";
import RegistroUsuario from "./pages/admin/auth/RegistroUsuario";
import RegistroGuardia from "./pages/admin/auth/RegistroGuardia";

const queryClient = new QueryClient();

// ─────────────────────────────────────────────────────────────────────────
// Componente interno: accede a useAuth (dentro del AuthProvider) y useLocation
// ─────────────────────────────────────────────────────────────────────────
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  const { sessionExpired, clearSessionExpired, authNotice, setAuthNotice } =
    useAuth();

  return (
    <>
      <SkipToContent />
      <SessionExpiredAlert
        open={sessionExpired}
        onClose={clearSessionExpired}
      />
      <AuthNoticeAlert
        message={authNotice}
        onClose={() => setAuthNotice(null)}
      />
      <div id="main-content" role="main">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* ═══ Rutas Públicas ═══ */}
            <Route
              path="/"
              element={
                <PageTransition>
                  <HomePage />
                </PageTransition>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <PageTransition>
                    <LoginPage />
                  </PageTransition>
                </PublicRoute>
              }
            />

            {/* ═══ Cambio de Contraseña Obligatorio ═══ */}
            <Route
              path="/cambiar-password"
              element={
                <ProtectedRoute requirePasswordChange={true}>
                  <PageTransition>
                    <CambiarPasswordPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />

            {/* ═══ Propietario: Onboarding obligatorio ═══ */}
            <Route
              path="/propietario/onboarding/biometria"
              element={
                <ProtectedRoute requireBiometricOnboarding={true}>
                  <PageTransition>
                    <BiometricOnboardingPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/propietario/onboarding/primer-vehiculo"
              element={
                <ProtectedRoute requireVehicleOnboarding={true}>
                  <PageTransition>
                    <VehicleOnboardingPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />

            {/* ═══ Propietario ═══ */}
            <Route
              path="/propietario/inicio"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <InicioPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/propietario/vehiculos"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <MisVehiculosPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/propietario/vehiculos/:placa"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <VehiculoDetallePage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/propietario/personas"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <PersonasAutorizadasPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/propietario/personas/:id"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <PersonaDetallePage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/propietario/personas/:id/biometria"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <BiometricCapturePersonaPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/propietario/permisos-temporales"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <PermisosTemporalesPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/propietario/pases-rapidos"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <PasesRapidosPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/propietario/alertas"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <AlertasPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/propietario/historial"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <HistorialPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/propietario/perfil"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <PerfilPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />

            {/* ═══ Guardia ═══ */}
            <Route
              path="/guardia/inicio"
              element={
                <ProtectedRoute allowedRoles={["GUARD"]}>
                  <PageTransition>
                    <GuardiaInicioPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/guardia/cola-eventos"
              element={
                <ProtectedRoute allowedRoles={["GUARD"]}>
                  <PageTransition>
                    <ColaEventosPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/guardia/revision-manual"
              element={
                <ProtectedRoute allowedRoles={["GUARD"]}>
                  <PageTransition>
                    <RevisionManualPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/guardia/contingencia"
              element={
                <ProtectedRoute allowedRoles={["GUARD"]}>
                  <PageTransition>
                    <ContingenciaPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/guardia/alertas"
              element={
                <ProtectedRoute allowedRoles={["GUARD"]}>
                  <PageTransition>
                    <AlertasGuardiaPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />

            {/* ═══ Admin ═══ */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <PageTransition>
                    <LegacyAdminLayout>
                      <Dashboard />
                    </LegacyAdminLayout>
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/registry/vehiculos"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <PageTransition>
                    <LegacyAdminLayout>
                      <VehiculosList />
                    </LegacyAdminLayout>
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/registry/vehiculos/nuevo"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <PageTransition>
                    <LegacyAdminLayout>
                      <VehiculoForm />
                    </LegacyAdminLayout>
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/registry/vehiculos/:id"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <PageTransition>
                    <LegacyAdminLayout>
                      <VehiculoDetail />
                    </LegacyAdminLayout>
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/registry/vehiculos/:id/editar"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <PageTransition>
                    <LegacyAdminLayout>
                      <VehiculoForm />
                    </LegacyAdminLayout>
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/registry/personas"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <PageTransition>
                    <LegacyAdminLayout>
                      <PersonasList />
                    </LegacyAdminLayout>
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/registry/personas/:id"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <PageTransition>
                    <LegacyAdminLayout>
                      <PersonaDetail />
                    </LegacyAdminLayout>
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/authorization/permanentes"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <PageTransition>
                    <LegacyAdminLayout>
                      <AutorizacionesPermanentes />
                    </LegacyAdminLayout>
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/authorization/temporales"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <PageTransition>
                    <LegacyAdminLayout>
                      <PermisosTemporal />
                    </LegacyAdminLayout>
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/authorization/por-vehiculo"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <PageTransition>
                    <LegacyAdminLayout>
                      <VistaPorVehiculo />
                    </LegacyAdminLayout>
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/biometric/perfiles"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <PageTransition>
                    <LegacyAdminLayout>
                      <PerfilesList />
                    </LegacyAdminLayout>
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/biometric/perfiles/nuevo"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <PageTransition>
                    <LegacyAdminLayout>
                      <RegistroBiometrico />
                    </LegacyAdminLayout>
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/biometric/perfiles/:id"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <PageTransition>
                    <LegacyAdminLayout>
                      <DetallePerfil />
                    </LegacyAdminLayout>
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/alerting/alertas"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <PageTransition>
                    <LegacyAdminLayout>
                      <AlertasList />
                    </LegacyAdminLayout>
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/alerting/alertas/:id"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <PageTransition>
                    <LegacyAdminLayout>
                      <AlertaDetail />
                    </LegacyAdminLayout>
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/alerting/notificaciones"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <PageTransition>
                    <LegacyAdminLayout>
                      <Notificaciones />
                    </LegacyAdminLayout>
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/usuarios"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <PageTransition>
                    <LegacyAdminLayout>
                      <CuentasList />
                    </LegacyAdminLayout>
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reportes"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <PageTransition>
                    <LegacyAdminLayout>
                      <Reportes />
                    </LegacyAdminLayout>
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/registro/usuario"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <PageTransition>
                    <LegacyAdminLayout>
                      <RegistroUsuario />
                    </LegacyAdminLayout>
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/registro/guardia"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <PageTransition>
                    <LegacyAdminLayout>
                      <RegistroGuardia />
                    </LegacyAdminLayout>
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/auditoria/eventos"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <PageTransition>
                    <LegacyAdminLayout>
                      <HistorialEventos />
                    </LegacyAdminLayout>
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/auditoria/eventos/:id"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <PageTransition>
                    <LegacyAdminLayout>
                      <DetalleHistorico />
                    </LegacyAdminLayout>
                  </PageTransition>
                </ProtectedRoute>
              }
            />

            {/* ═══ Fallback ═══ */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// Raíz de la aplicación
// ─────────────────────────────────────────────────────────────────────────
export const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={vigiaTheme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <AnimatedRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
