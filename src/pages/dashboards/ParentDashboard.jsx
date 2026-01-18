import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store";
import { useParentDashboard } from "../../hooks/useParentDashboard";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  BarChart3,
  FileText,
  BookOpen,
  MessageSquare,
  Users as UsersIcon,
  Calendar,
  LogOut,
  Star,
  CheckCircle,
  User,
  X,
  TrendingUp,
  ChevronRight,
  CircleUser,
  RefreshCw,
  AlertCircle,
  Bot,
  Gamepad2,
  Menu,
  DollarSign,
} from "lucide-react";
import Reportes from "../parent/reportes/Reportes";
import Tareas from "../parent/tareas/Tareas";
import Asistencia from "../parent/asistencia/Asistencia";
import Anotaciones from "../parent/anotaciones/Anotaciones";
import Cronograma from "../parent/cronograma/Cronograma";
import ParentAIChat from "../parent/iachat/ParentAIChat";
import Juegos from "../teacher/juegos/Juegos";
import Pensiones from "../parent/pensiones/Pensiones";

const ParentDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] =
    useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { logout, user, updateUser } = useAuthStore();

  // Hook personalizado para datos del dashboard familiar
  const { dashboardData, loading, error, refreshData, estadisticas } =
    useParentDashboard();

  // Verificar si el usuario necesita cambiar contraseña
  useEffect(() => {
    if (user?.cambioContrasena === false) {
      setIsPasswordChangeModalOpen(true);
    }
  }, [user]);

  const menuItems = [
    // 📊 DASHBOARD
    {
      id: "overview",
      label: "Panel Principal",
      icon: BarChart3,
      category: "dashboard",
    },

    // 🤖 HERRAMIENTAS EDUCATIVAS
    {
      id: "iachat",
      label: "Asistente IA",
      icon: MessageSquare,
      category: "herramientas",
    },
    { id: "games", label: "Juegos", icon: Gamepad2, category: "herramientas" },

    // 📚 TRABAJO ACADÉMICO
    {
      id: "tasks",
      label: "Actividades",
      icon: BookOpen,
      category: "academico",
    },
    {
      id: "cronograma",
      label: "Cronograma",
      icon: Calendar,
      category: "academico",
    },
    {
      id: "anotaciones",
      label: "Anotaciones",
      icon: Bell,
      category: "academico",
    },

    // 👥 GESTIÓN DE ESTUDIANTES
    {
      id: "attendance",
      label: "Asistencia",
      icon: CheckCircle,
      category: "gestion",
    },

    // 💰 GESTIÓN FINANCIERA
    {
      id: "pensiones",
      label: "Pensiones",
      icon: DollarSign,
      category: "financiero",
    },
  ];

  // Función para obtener la etiqueta de categoría
  const getCategoryLabel = (category) => {
    const labels = {
      dashboard: "Dashboard",
      herramientas: "Herramientas Educativas",
      academico: "Trabajo Académico",
      gestion: "Gestión de Estudiantes",
      financiero: "Gestión Financiera",
    };
    return labels[category] || category;
  };

  // Función para obtener el icono de categoría
  const getCategoryIcon = (category) => {
    const icons = {
      dashboard: BarChart3,
      herramientas: Bot,
      academico: BookOpen,
      gestion: UsersIcon,
      financiero: DollarSign,
    };
    return icons[category] || BookOpen;
  };

  // Datos del hijo/estudiante
  const studentData = {
    name: `${user?.nombre || ""} ${user?.apellido || ""}`,
    grade: "Los Pequeños Exploradores",
    photo:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236B7280'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E",
    age: 0,
    teacher: "",
  };

  // Calcular estadísticas dinámicas basadas en datos reales
  const dynamicStats = [
    {
      title: "Total de Tareas",
      value: estadisticas.totalTareas.toString(),
      change: `${estadisticas.tareasCompletadas} completadas`,
      icon: BookOpen,
      color: "#3B82F6",
    },
    {
      title: "Tareas Pendientes",
      value: estadisticas.tareasPendientes.toString(),
      change: `${estadisticas.tareasVencidas} vencidas`,
      icon: CheckCircle,
      color: estadisticas.tareasVencidas > 0 ? "#EF4444" : "#10B981",
    },
    {
      title: "¡Qué bien lo estás haciendo!",
      value:
        estadisticas.promedioCompletitud >= 80
          ? "¡Excelente!"
          : estadisticas.promedioCompletitud >= 60
          ? "¡Muy bien!"
          : "¡Ánimo!",
      change: "¡Sigue así!",
      icon: Star,
      color:
        estadisticas.promedioCompletitud >= 80
          ? "#10B981"
          : estadisticas.promedioCompletitud >= 60
          ? "#F59E0B"
          : "#EF4444",
    },
  ];

  const quickStats = dynamicStats;

  const recentActivities = [
    {
      type: "task",
      title: "Tarea de Matemáticas entregada",
      time: "Hace 2 horas",
      status: "completed",
      icon: CheckCircle,
    },
    {
      type: "grade",
      title: "Calificación en Ciencias: 9.0",
      time: "Ayer",
      status: "excellent",
      icon: Star,
    },
    {
      type: "note",
      title: "Comentario positivo del profesor",
      time: "Hace 2 días",
      status: "positive",
      icon: MessageSquare,
    },
    {
      type: "attendance",
      title: "Asistencia perfecta esta semana",
      time: "Hace 3 días",
      status: "excellent",
      icon: Calendar,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800 border-green-200";
      case "good":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "alert":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Función para cerrar el menú móvil al seleccionar una opción
  const handleMenuItemClick = (sectionId) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  // Función para manejar el logout con confirmación
  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
  };

  const handleCancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await axios.patch(
        `/api/v1/usuario/${user.id}/forzar-cambio-contrasena`,
        {
          nuevaContrasena: newPassword,
          confirmarContrasena: confirmPassword,
        }
      );

      // Actualizar el estado del usuario para indicar que ya cambió la contraseña
      updateUser({ ...user, cambioContrasena: true });

      toast.success("Contraseña cambiada exitosamente");
      setIsPasswordChangeModalOpen(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      toast.error("Error al cambiar la contraseña. Inténtalo de nuevo.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6 lg:space-y-8">
      {/* Información del hijo */}
      <div className="bg-gradient-to-r from-yellow-200 to-yellow-100 rounded-xl p-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full border-4 border-yellow-600 shadow bg-yellow-100 flex items-center justify-center">
          <CircleUser className="w-12 h-12 text-yellow-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">
            {studentData.name}
          </h3>
          <p className="text-blue-600 font-medium">{studentData.grade}</p>
          <p className="text-gray-600"></p>
        </div>
        <div className="text-right">
          <div className="text-3xl mb-1">
            {estadisticas.tareasVencidas === 0
              ? "🌟"
              : estadisticas.tareasVencidas <= 2
              ? "⭐"
              : "⚠️"}
          </div>
          <p className="text-sm font-medium text-gray-700">
            {estadisticas.tareasVencidas === 0
              ? "Excelente"
              : estadisticas.tareasVencidas <= 2
              ? "Bueno"
              : "Atención"}
          </p>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {quickStats.map((stat, index) => {
          const IconComponent = stat.icon;
          // Las primeras dos cards (Total de Tareas y Tareas Pendientes) llevan a la sección de tareas
          const isTaskCard = index < 2;

          return (
            <div
              key={index}
              className={`bg-white p-4 lg:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow ${
                isTaskCard ? "cursor-pointer hover:bg-yellow-50" : ""
              }`}
              onClick={isTaskCard ? () => setActiveSection("tasks") : undefined}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{
                    backgroundColor: `${stat.color}15`,
                    color: stat.color,
                  }}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              {isTaskCard && (
                <div className="mt-3 text-xs text-green-600 font-medium">
                  Click para ver detalles →
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Asistente IA Quick Access */}
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-xl shadow-sm p-4 lg:p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-600 bg-opacity-20 rounded-lg">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Asistente IA Educativo</h3>
              <p className="text-yellow-100">
                ¿Necesitas ayuda con el aprendizaje de tu hijo o consejos
                educativos?
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveSection("iachat")}
            className="bg-white text-yellow-600 hover:bg-yellow-50 px-4 py-2 rounded-lg transition-all duration-200 font-medium"
          >
            Chatear ahora
          </button>
        </div>
      </div>

      {/* Tareas recientes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-100">
          <h3
            className="flex items-center space-x-2 text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => setActiveSection("tasks")}
          >
            <BookOpen className="w-5 h-5 text-yellow-500" />
            <span>Tareas Recientes</span>
          </h3>
          <button
            onClick={refreshData}
            disabled={loading}
            className="flex items-center space-x-2 text-sm text-yellow-600 hover:text-yellow-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Actualizar</span>
          </button>
        </div>
        <div className="p-4 lg:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin text-yellow-600" />
              <span className="ml-2 text-gray-600">Cargando tareas...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <span className="ml-2 text-red-600">
                Error al cargar tareas: {error}
              </span>
            </div>
          ) : dashboardData.tareas && dashboardData.tareas.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.tareas.slice(0, 5).map((tarea, index) => (
                <div
                  key={tarea.id || index}
                  className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                    <span className="text-lg">{tarea.emoji || "📝"}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {tarea.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {tarea.subject} • Vence:{" "}
                      {new Date(tarea.fechaEntrega).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      tarea.status === "completed" || tarea.realizoTarea
                        ? "bg-green-100 text-green-800"
                        : tarea.isOverdue
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {tarea.status === "completed" || tarea.realizoTarea
                      ? "Completada"
                      : tarea.isOverdue
                      ? "Vencida"
                      : "Pendiente"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <BookOpen className="w-8 h-8 text-gray-400" />
              <span className="ml-2 text-gray-600">
                No hay tareas disponibles
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Próximas actividades */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Próximas Actividades
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveSection("tasks")}
            className="bg-white rounded-lg p-4 border border-blue-100 hover:shadow-md transition-all duration-200 cursor-pointer w-full text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">📚</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Revisar Tareas Pendientes
                </p>
                <p className="text-sm text-gray-600">
                  Accede a la sección de Actividades
                </p>
              </div>
            </div>
          </button>
          <button
            onClick={() => setActiveSection("iachat")}
            className="bg-white rounded-lg p-4 border border-purple-100 hover:shadow-md transition-all duration-200 cursor-pointer w-full text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Consultar Asistente IA
                </p>
                <p className="text-sm text-gray-600">
                  Obtén ayuda educativa personalizada
                </p>
              </div>
            </div>
          </button>
          <button
            onClick={() => setActiveSection("games")}
            className="bg-white rounded-lg p-4 border border-green-100 hover:shadow-md transition-all duration-200 cursor-pointer w-full text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">🎮</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Jugar Juegos Educativos
                </p>
                <p className="text-sm text-gray-600">
                  ¡Aprende jugando con diversión!
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return renderOverview();
      case "reports":
        return <Reportes />;
      case "tasks":
        return <Tareas />;
      case "cronograma":
        return <Cronograma />;
      case "anotaciones":
        return <Anotaciones />;
      case "iachat":
        return <ParentAIChat />;
      case "games":
        return <Juegos />;
      case "attendance":
        return <Asistencia />;
      case "pensiones":
        return <Pensiones />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 border-r">
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile close button */}
        <div className="flex items-center bg-yellow-600 justify-between p-7 border-b border-gray-200 lg:justify-start">
          <div className="flex items-center space-x-3 mt-1">
            <span className="text-xl font-bold text-white tracking-wider">
              EDA
            </span>
          </div>
          <button
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* Navigation */}
        <nav className="mt-6 px-3 flex-1 overflow-y-auto">
          <div className="space-y-1 pb-4">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = activeSection === item.id;

              // Determinar si mostrar separador de categoría
              const prevItem = index > 0 ? menuItems[index - 1] : null;
              const showCategorySeparator =
                prevItem && prevItem.category !== item.category;

              return (
                <div key={item.id}>
                  {/* Separador de categoría */}
                  {showCategorySeparator && (
                    <div className="my-4 px-4 ">
                      <div className="h-px bg-gray-400"></div>
                      <div className="text-sm font-bold text-yellow-900 uppercase tracking-wider mt-2 mb-1 flex items-center gap-2">
                        {React.createElement(getCategoryIcon(item.category), {
                          className: "w-4 h-4",
                        })}
                        {getCategoryLabel(item.category)}
                      </div>
                      <div className="h-px bg-gray-400"></div>
                    </div>
                  )}

                  <button
                    className={`w-full flex items-center justify-between px-4 py-3 mb-1 rounded-lg text-left transition-all duration-200 group hover:translate-x-2 cursor-pointer ${
                      isActive
                        ? "bg-yellow-600 text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    onClick={() => handleMenuItemClick(item.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent
                        className={`w-5 h-5 ${
                          isActive
                            ? "text-white"
                            : "text-gray-400 group-hover:text-gray-600"
                        }`}
                      />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isActive ? "rotate-90 text-white" : "text-gray-400"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </nav>
        {/* User Info Card & Logout Button */}
        <div className="mt-auto px-3 pb-6 flex flex-col gap-3">
          {/* User Info */}
          <div className="flex flex-row items-center bg-gray-200 rounded-xl px-3 py-2 mb-2 w-full shadow gap-3 hover:-translate-y-1 transition-all hover:bg-yellow-100 cursor-pointer">
            <div className="w-11 h-11 rounded-full border-2 border-yellow-500 shadow bg-yellow-100 flex items-center justify-center">
              <CircleUser className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-gray-900 text-sm truncate">
                {user?.nombre || ""} {user?.apellido || ""}
              </span>
              <span className="text-xs text-gray-700 truncate">
                {user?.email || "correo@ejemplo.com"}
              </span>
              {user?.role?.nombre && (
                <span className="text-[10px] text-white bg-yellow-500 rounded px-2 py-0.5 mt-1 mb-1 w-fit font-semibold tracking-wide uppercase">
                  {user.role.nombre}
                </span>
              )}
            </div>
          </div>
          {/* Logout Button */}
          <button
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            onClick={handleLogoutClick}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="bg-yellow-600 border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1 lg:ml-0 ml-4">
              <h1 className="text-xl lg:text-2xl font-bold text-white">
                Panel Familiar
              </h1>
              <p className="text-sm text-white mt-1 hidden sm:block">
                {user?.fullName || user?.nombre || user?.username} |{" "}
                {new Date().toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </header>
        {/* Content Area */}
        <div className="p-4 lg:p-6 h-full overflow-y-auto">
          {renderContent()}
        </div>
      </main>

      {/* Modal de confirmación de logout */}
      <Transition appear show={isLogoutModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleCancelLogout}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/20 backdrop-blur-md bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                    <LogOut className="w-6 h-6 text-red-600" />
                  </div>

                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 text-center mb-2"
                  >
                    ¿Cerrar sesión?
                  </Dialog.Title>

                  <div className="mt-2">
                    <p className="text-sm text-gray-500 text-center">
                      ¿Estás seguro de que quieres cerrar sesión? Perderás el
                      acceso a tu cuenta familiar.
                    </p>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <button
                      type="button"
                      className="flex-1 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                      onClick={handleCancelLogout}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="flex-1 inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                      onClick={handleConfirmLogout}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Modal de cambio de contraseña obligatorio */}
      <Transition appear show={isPasswordChangeModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>

                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold text-center text-gray-900 mb-2"
                  >
                    Cambio de Contraseña Requerido
                  </Dialog.Title>

                  <p className="text-sm text-gray-600 text-center mb-6">
                    Por seguridad, debes cambiar tu contraseña antes de
                    continuar usando el sistema.
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handlePasswordChange();
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Nueva Contraseña
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        placeholder="Ingresa tu nueva contraseña"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Confirmar Contraseña
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        placeholder="Repite tu nueva contraseña"
                        required
                      />
                    </div>

                    <div className="mt-6">
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isChangingPassword}
                      >
                        {isChangingPassword ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Cambiando...
                          </>
                        ) : (
                          "Cambiar Contraseña"
                        )}
                      </button>
                    </div>

                    <div className="mt-3 text-xs text-gray-500 text-center">
                      La contraseña debe tener al menos 6 caracteres
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ParentDashboard;
