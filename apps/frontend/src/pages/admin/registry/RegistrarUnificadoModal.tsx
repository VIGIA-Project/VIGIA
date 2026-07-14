import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SaveIcon from "@mui/icons-material/Save";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import SchoolIcon from "@mui/icons-material/School";
import KeyIcon from "@mui/icons-material/Key";
import Avatar from "@mui/material/Avatar";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SecurityIcon from "@mui/icons-material/Security";
import { useCrearPersonaAdmin, useCrearUsuarioAdmin } from "../../../hooks/useAdmin";
import { UserRole } from "../../../services/types/admin.types";

interface RegistrarUnificadoModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
  initialData?: any;
}

const generarPasswordTemporal = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let password = "";
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const steps = ["Entidad e Identidad", "Contacto", "Asignación y Credenciales"];

export default function RegistrarUnificadoModal({
  open,
  onClose,
  onSuccess,
  initialData,
}: RegistrarUnificadoModalProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [tipoRegistro, setTipoRegistro] = useState<"USUARIO" | "GUARDIA">(
    "USUARIO",
  );
  const crearPersona = useCrearPersonaAdmin();
  const crearUsuario = useCrearUsuarioAdmin();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    id: undefined as string | undefined,
    tipoId: "Cédula",
    identificacion: "",
    nombres: "",
    apellidos: "",
    correo: "",
    telefono: "",
    direccion: "", // For Guard
    facultad: "", // For User
    carrera: "", // For User
    rol: "Estudiante", // For User
    estado: "ACTIVO",
    password: generarPasswordTemporal(),
  });

  useEffect(() => {
    if (initialData) {
      const names = (initialData.nombre || "").split(" ");
      setTipoRegistro("USUARIO");
      setForm((f) => ({
        ...f,
        id: initialData.id,
        identificacion: initialData.cedula || initialData.identificacion || "",
        nombres: names.shift() || "",
        apellidos: names.join(" ") || "",
        correo: initialData.correo || "",
        telefono: initialData.telefono || "",
        rol: initialData.relacion || initialData.rol || f.rol,
        estado:
          initialData.estado === "ACTIVO" || initialData.estado === "ACTIVA"
            ? "ACTIVO"
            : "INACTIVO",
      }));
    }
  }, [initialData]);

  const handleChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleRegenerarPassword = () => {
    setForm((f) => ({ ...f, password: generarPasswordTemporal() }));
  };

  const handleNext = async () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      setError(null);
      setIsSubmitting(true);
      try {
        let tipoDoc = form.tipoId.toUpperCase();
        if (tipoDoc === "CÉDULA") tipoDoc = "CEDULA";
        
        const nuevaPersona = await crearPersona.mutateAsync({
          identificacionTipo: tipoDoc as any,
          identificacionNumero: form.identificacion,
          nombres: form.nombres,
          apellidos: form.apellidos,
          correoInstitucional: form.correo,
          telefonoContacto: form.telefono,
        });

        let roleToAssign: UserRole = "OWNER";
        if (tipoRegistro === "GUARDIA") roleToAssign = "GUARD";
        else if (form.rol === "Administrador") roleToAssign = "ADMIN";

        await crearUsuario.mutateAsync({
          email: form.correo,
          role: roleToAssign,
          temporaryPassword: form.password,
          personaId: nuevaPersona.personaId,
        });

        onSuccess({ tipoRegistro, ...form });
        handleClose();
      } catch (err: any) {
        setError(err?.response?.data?.message || "Ocurrió un error al registrar en el sistema.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => setActiveStep(0), 300);
  };

  const getInitials = () => {
    if (!form.nombres && !form.apellidos)
      return tipoRegistro === "USUARIO" ? "U" : "G";
    return `${form.nombres.charAt(0)}${form.apellidos.charAt(0)}`.toUpperCase();
  };

  // Theming based on type
  const isUsuario = tipoRegistro === "USUARIO";
  const bgColor = isUsuario ? "#0A2F86" : "#1a1f2c";
  const accentColor = isUsuario ? "#19D6C4" : "#F2B51F";
  const displayRole = isUsuario ? form.rol : "GUARDA DE SEGURIDAD";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
    >
      <DialogContent
        sx={{
          p: 0,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          minHeight: 650,
        }}
      >
        {/* Lado Izquierdo: Vista Previa ID Card Dinámica */}
        <Box
          sx={{
            width: { xs: "100%", md: "35%" },
            bgcolor: bgColor,
            transition: "background-color 0.4s ease",
            position: "relative",
            p: 4,
            display: "flex",
            flexDirection: "column",
            color: "#fff",
            borderRight: "1px solid rgba(0,0,0,0.1)",
          }}
        >
          {/* Decorative background circles */}
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: "50%",
              bgcolor: `rgba(${isUsuario ? "25, 214, 196" : "242, 181, 31"}, 0.1)`,
              pointerEvents: "none",
              transition: "background-color 0.4s ease",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -100,
              left: -50,
              width: 300,
              height: 300,
              borderRadius: "50%",
              bgcolor: "rgba(255, 255, 255, 0.03)",
              pointerEvents: "none",
            }}
          />

          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, zIndex: 1 }}>
            Registro Unificado
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.7)",
              mb: 6,
              zIndex: 1,
              lineHeight: 1.6,
            }}
          >
            {isUsuario
              ? "Creando identidad y credenciales para un usuario del sistema."
              : "Dando de alta a un oficial de seguridad en el sistema VIGIA."}
          </Typography>

          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            {/* ID Card Simulation */}
            <Box
              sx={{
                width: "100%",
                bgcolor: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 4,
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                transition: "all 0.4s ease",
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mb: 2,
                  fontSize: "2rem",
                  bgcolor: accentColor,
                  color: bgColor,
                  fontWeight: 700,
                  transition: "all 0.4s ease",
                  boxShadow: `0 4px 12px ${accentColor}66`,
                }}
              >
                {getInitials()}
              </Avatar>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  textAlign: "center",
                  lineHeight: 1.2,
                  mb: 0.5,
                }}
              >
                {form.nombres || form.apellidos
                  ? `${form.nombres} ${form.apellidos}`
                  : "Nueva Persona"}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: accentColor,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  mb: 2,
                  transition: "color 0.4s ease",
                }}
              >
                {displayRole}
              </Typography>

              <Box
                sx={{
                  width: "100%",
                  bgcolor: "rgba(0,0,0,0.25)",
                  borderRadius: 2,
                  p: 1.5,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    {form.tipoId}
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {form.identificacion || "---"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    Estado
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor:
                          form.estado === "ACTIVO" ? "#4CAF50" : "#F44336",
                      }}
                    />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {form.estado}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Lado Derecho: Formulario Stepper */}
        <Box
          sx={{
            width: { xs: "100%", md: "65%" },
            display: "flex",
            flexDirection: "column",
            bgcolor: "#F8FAFC",
          }}
        >
          <Box
            sx={{
              p: 3,
              pt: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Stepper activeStep={activeStep} alternativeLabel sx={{ flex: 1 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                ml: 2,
                color: "text.secondary",
                alignSelf: "flex-start",
                mt: -1,
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, p: 4, pt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {activeStep === 0 && (
              <Box sx={{ animation: "fadeIn 0.4s ease-in-out" }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    mb: 1.5,
                    color: "text.secondary",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Tipo de Registro
                </Typography>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box
                      onClick={() => setTipoRegistro("USUARIO")}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "2px solid",
                        borderColor: isUsuario ? "primary.main" : "divider",
                        bgcolor: isUsuario
                          ? "rgba(13, 92, 207, 0.05)"
                          : "background.paper",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                        "&:hover": {
                          borderColor: isUsuario
                            ? "primary.main"
                            : "primary.light",
                        },
                      }}
                    >
                      <PersonAddIcon
                        sx={{
                          color: isUsuario ? "primary.main" : "text.secondary",
                          fontSize: 32,
                        }}
                      />
                      <Typography
                        sx={{
                          fontWeight: isUsuario ? 700 : 500,
                          color: isUsuario ? "primary.main" : "text.secondary",
                        }}
                      >
                        Usuario Institucional
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box
                      onClick={() => setTipoRegistro("GUARDIA")}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "2px solid",
                        borderColor: !isUsuario ? "warning.main" : "divider",
                        bgcolor: !isUsuario
                          ? "rgba(242, 181, 31, 0.05)"
                          : "background.paper",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                        "&:hover": {
                          borderColor: !isUsuario
                            ? "warning.main"
                            : "warning.light",
                        },
                      }}
                    >
                      <SecurityIcon
                        sx={{
                          color: !isUsuario ? "warning.main" : "text.secondary",
                          fontSize: 32,
                        }}
                      />
                      <Typography
                        sx={{
                          fontWeight: !isUsuario ? 700 : 500,
                          color: !isUsuario ? "warning.main" : "text.secondary",
                        }}
                      >
                        Guardia de Seguridad
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: "text.secondary",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Datos de Identidad
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Nombres"
                      value={form.nombres}
                      onChange={(e) => handleChange("nombres", e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Apellidos"
                      value={form.apellidos}
                      onChange={(e) =>
                        handleChange("apellidos", e.target.value)
                      }
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Tipo de Documento</InputLabel>
                      <Select
                        value={form.tipoId}
                        label="Tipo de Documento"
                        onChange={(e) => handleChange("tipoId", e.target.value)}
                      >
                        <MenuItem value="Cédula">Cédula</MenuItem>
                        <MenuItem value="Pasaporte">Pasaporte</MenuItem>
                        {isUsuario && <MenuItem value="RUC">RUC</MenuItem>}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Número de Identificación"
                      value={form.identificacion}
                      onChange={(e) =>
                        handleChange("identificacion", e.target.value)
                      }
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeIcon
                              fontSize="small"
                              sx={{ color: "text.secondary" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <FormControl fullWidth>
                      <InputLabel>Estado Inicial</InputLabel>
                      <Select
                        value={form.estado}
                        label="Estado Inicial"
                        onChange={(e) => handleChange("estado", e.target.value)}
                      >
                        <MenuItem value="ACTIVO">ACTIVO</MenuItem>
                        <MenuItem value="INACTIVO">INACTIVO</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeStep === 1 && (
              <Box sx={{ animation: "fadeIn 0.4s ease-in-out" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: isUsuario ? "primary.main" : "#C0524A",
                  }}
                >
                  Datos de Contacto
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Correo electrónico"
                      value={form.correo}
                      onChange={(e) => handleChange("correo", e.target.value)}
                      placeholder={
                        isUsuario ? "usuario@uce.edu.ec" : "guardia@uce.edu.ec"
                      }
                      required
                      type="email"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon
                              fontSize="small"
                              sx={{ color: "text.secondary" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Teléfono / Celular"
                      value={form.telefono}
                      onChange={(e) => handleChange("telefono", e.target.value)}
                      required={!isUsuario}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon
                              fontSize="small"
                              sx={{ color: "text.secondary" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  {!isUsuario && (
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Dirección de Domicilio"
                        value={form.direccion}
                        onChange={(e) =>
                          handleChange("direccion", e.target.value)
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <HomeIcon
                                fontSize="small"
                                sx={{ color: "text.secondary" }}
                              />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}

            {activeStep === 2 && (
              <Box sx={{ animation: "fadeIn 0.4s ease-in-out" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: isUsuario ? "primary.main" : "#C0524A",
                  }}
                >
                  {isUsuario
                    ? "Asignación y Credenciales"
                    : "Credenciales de Acceso"}
                </Typography>

                {isUsuario && (
                  <Box sx={{ mb: 4 }}>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                          <InputLabel>Facultad</InputLabel>
                          <Select
                            value={form.facultad}
                            label="Facultad"
                            onChange={(e) =>
                              handleChange("facultad", e.target.value)
                            }
                            startAdornment={
                              <InputAdornment position="start">
                                <BusinessIcon
                                  fontSize="small"
                                  sx={{ ml: 1, color: "text.secondary" }}
                                />
                              </InputAdornment>
                            }
                          >
                            <MenuItem value="Ingeniería">Ingeniería</MenuItem>
                            <MenuItem value="Ciencias">Ciencias</MenuItem>
                            <MenuItem value="Administración">
                              Administración
                            </MenuItem>
                            <MenuItem value="Arquitectura">
                              Arquitectura
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Carrera o Departamento"
                          value={form.carrera}
                          onChange={(e) =>
                            handleChange("carrera", e.target.value)
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SchoolIcon
                                  fontSize="small"
                                  sx={{ color: "text.secondary" }}
                                />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <FormControl fullWidth>
                          <InputLabel>Rol Asignado</InputLabel>
                          <Select
                            value={form.rol}
                            label="Rol Asignado"
                            onChange={(e) =>
                              handleChange("rol", e.target.value)
                            }
                          >
                            <MenuItem value="Estudiante">Estudiante</MenuItem>
                            <MenuItem value="Docente">Docente</MenuItem>
                            <MenuItem value="Administrativo">
                              Administrativo
                            </MenuItem>
                            <MenuItem value="Personal de Servicio">
                              Personal de Servicio
                            </MenuItem>
                            <MenuItem value="Administrador">
                              Administrador
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                <Alert
                  severity={isUsuario ? "info" : "warning"}
                  sx={{ mb: 4, borderRadius: 2 }}
                >
                  {isUsuario
                    ? "Asegúrate de copiar la contraseña temporal y enviarla al usuario para su primer acceso al sistema."
                    : "El guardia será registrado con rol GUARDA en el sistema. La contraseña temporal debe ser entregada personalmente."}
                </Alert>

                <Grid container spacing={3}>
                  {!isUsuario && (
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Rol Asignado"
                        value="GUARDA DE SEGURIDAD"
                        disabled
                      />
                    </Grid>
                  )}
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Contraseña temporal"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <KeyIcon
                              fontSize="small"
                              sx={{ color: "text.secondary" }}
                            />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              size="small"
                            >
                              {showPassword ? (
                                <VisibilityOffIcon fontSize="small" />
                              ) : (
                                <VisibilityIcon fontSize="small" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Box
                      sx={{
                        mt: 1,
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        variant="text"
                        size="small"
                        onClick={handleRegenerarPassword}
                        sx={{
                          color: isUsuario ? "primary.main" : "warning.main",
                        }}
                      >
                        Generar Nueva
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>

          {/* Footer Actions */}
          <Box
            sx={{
              p: 3,
              bgcolor: "#ffffff",
              borderTop: "1px solid rgba(0,0,0,0.08)",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button onClick={handleClose} color="inherit">
              Cancelar
            </Button>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                startIcon={<NavigateBeforeIcon />}
              >
                Atrás
              </Button>
              <Button
                onClick={handleNext}
                disabled={isSubmitting}
                variant="contained"
                color={isUsuario ? "primary" : "warning"}
                endIcon={
                  isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : activeStep === steps.length - 1 ? (
                    <SaveIcon />
                  ) : (
                    <NavigateNextIcon />
                  )
                }
                sx={{
                  px: 4,
                  borderRadius: 2,
                  color: !isUsuario ? "#fff" : undefined,
                }}
              >
                {activeStep === steps.length - 1
                  ? isSubmitting ? "Guardando..." : "Finalizar Registro"
                  : "Siguiente"}
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
