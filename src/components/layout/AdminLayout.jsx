import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useAuthStore } from "../../store";
import {
  BarChart3,
  Users as UsersIcon,
  GraduationCap,
  UserCheck,
  BookOpen,
  DollarSign,
  FileText,
  Settings,
  School,
  LogOut,
  Banknote,
  CircleUser,
  Clock,
  ChevronRight,
  Menu,
  X,
  ClipboardList,
  Award,
  MessageCircle,
  Shield,
} from "lucide-react";

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const menuItems = [
    // DASHBOARD PRINCIPAL
    {
      path: "/admin",
      label: "Panel Principal",
      icon: BarChart3,
      category: "dashboard",
    },

    // CONFIGURACIÓN INICIAL (Orden optimizado para setup)
    {
      path: "/admin/pensiones",
      label: "Pensiones",
      icon: Banknote,
      category: "configuracion",
    },
    {
      path: "/admin/grados",
      label: "Grados Académicos",
      icon: School,
      category: "configuracion",
    },
    {
      path: "/admin/aulas",
      label: "Gestión de Aulas",
      icon: School,
      category: "configuracion",
    },
    {
      path: "/admin/anio-escolar",
      label: "Periodo Escolar",
      icon: Clock,
      category: "configuracion",
    },
    {
      path: "/admin/cursos",
      label: "Cursos y Materias",
      icon: BookOpen,
      category: "configuracion",
    },

    // GESTIÓN DE PERSONAS
    {
      path: "/admin/estudiantes",
      label: "Estudiantes",
      icon: CircleUser,
      category: "personas",
    },
    {
      path: "/admin/padres",
      label: "Padres de Familia",
      icon: UserCheck,
      category: "personas",
    },
    {
      path: "/admin/trabajadores",
      label: "Trabajadores",
      icon: UsersIcon,
      category: "personas",
    },
    {
      path: "/admin/roles",
      label: "Roles del Sistema",
      icon: Shield,
      category: "personas",
    },

    // ACADÉMICO
    {
      path: "/admin/matricula",
      label: "Matrícula",
      icon: GraduationCap,
      category: "academico",
    },
    {
      path: "/admin/asignacion-aula",
      label: "Asignación de Aulas",
      icon: BookOpen,
      category: "academico",
    },
    {
      path: "/admin/asignacion-cursos",
      label: "Asignación de Cursos",
      icon: UserCheck,
      category: "academico",
    },
    {
      path: "/admin/planificaciones",
      label: "Planificaciones",
      icon: FileText,
      category: "academico",
    },
    {
      path: "/admin/cronogramas",
      label: "Cronogramas",
      icon: Clock,
      category: "academico",
    },
    {
      path: "/admin/evaluacion-docente",
      label: "Comentario Docente",
      icon: Award,
      category: "academico",
    },
    {
      path: "/admin/bimestral-docente",
      label: "Evaluación Bimestral",
      icon: ClipboardList,
      category: "academico",
    },

    // FINANZAS
    {
      path: "/admin/finanzas",
      label: "Caja y Movimientos",
      icon: DollarSign,
      category: "finanzas",
    },

    // ADMINISTRATIVO
    {
      path: "/admin/contratos",
      label: "Contratos",
      icon: FileText,
      category: "administrativo",
    },
    {
      path: "/admin/planilla",
      label: "Planilla",
      icon: ClipboardList,
      category: "administrativo",
    },
    {
      path: "/admin/seguros",
      label: "Tipos de Seguro",
      icon: Shield,
      category: "administrativo",
    },

    // REPORTES Y HERRAMIENTAS
    {
      path: "/admin/reportes",
      label: "Reportes",
      icon: BarChart3,
      category: "reportes",
    },
    {
      path: "/admin/ai-chat",
      label: "Asistente IA",
      icon: MessageCircle,
      category: "herramientas",
    },

    // USUARIOS Y CONFIGURACIÓN AVANZADA
    {
      path: "/admin/usuarios",
      label: "Usuarios del Sistema",
      icon: UsersIcon,
      category: "usuarios",
    },
    {
      path: "/admin/configuraciones",
      label: "Configuración Avanzada",
      icon: Settings,
      category: "usuarios",
    },
  ];

  const getCategoryLabel = (category) => {
    const labels = {
      dashboard: "Dashboard",
      personas: "Personas",
      academico: "Académico",
      infraestructura: "Infraestructura",
      finanzas: "Finanzas",
      administrativo: "Administrativo",
      reportes: "Reportes",
      herramientas: "Herramientas",
      usuarios: "Usuarios",
      configuracion: "Configuración",
    };
    return labels[category] || category;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      dashboard: BarChart3,
      personas: UsersIcon,
      academico: GraduationCap,
      infraestructura: School,
      finanzas: DollarSign,
      administrativo: FileText,
      reportes: BarChart3,
      herramientas: MessageCircle,
      usuarios: CircleUser,
      configuracion: Settings,
    };
    return icons[category] || GraduationCap;
  };

  const handleLogoutClick = () => setIsLogoutModalOpen(true);
  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
  };
  const handleCancelLogout = () => setIsLogoutModalOpen(false);

  return (
    <div className="flex h-screen bg-gray-50 border-r">
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center bg-blue-800 justify-between p-7 border-b border-gray-200 lg:justify-start">
          <div className="flex items-center space-x-3 mt-1">
            <span className="text-xl font-bold text-white tracking-wider">
              EDA
            </span>
          </div>
          <button
            className="lg:hidden p-2 text-white hover:text-gray-300"
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
              const isActive = location.pathname === item.path;
              const prevItem = index > 0 ? menuItems[index - 1] : null;
              const showCategorySeparator =
                prevItem && prevItem.category !== item.category;

              return (
                <div key={item.path}>
                  {/* Separador de categoría */}
                  {showCategorySeparator && (
                    <div className="my-4 px-4">
                      <div className="h-px bg-gray-400"></div>
                      <div className="text-sm font-bold text-blue-900 uppercase tracking-wider mt-2 mb-1 flex items-center gap-2">
                        {React.createElement(getCategoryIcon(item.category), {
                          className: "w-4 h-4",
                        })}
                        {getCategoryLabel(item.category)}
                      </div>
                      <div className="h-px bg-gray-400"></div>
                    </div>
                  )}

                  <Link
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`w-full flex items-center justify-between px-4 py-3 mb-1 rounded-lg text-left transition-all duration-200 group hover:translate-x-2 cursor-pointer ${
                      isActive
                        ? "bg-blue-800 text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
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
                  </Link>
                </div>
              );
            })}
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="mt-auto p-3 border-t border-gray-200">
          <div className="flex flex-row items-center bg-gray-200 rounded-xl px-3 py-2 mb-3 w-full shadow gap-3 hover:-translate-y-1 transition-all hover:bg-blue-100 cursor-pointer">
            <div className="w-11 h-11 rounded-full border-2 border-blue-500 shadow bg-blue-100 flex items-center justify-center">
              <CircleUser className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-gray-900 text-sm truncate">
                {user?.nombre || ""} {user?.apellido || ""}
              </span>
              <span className="text-xs text-gray-700 truncate">
                {user?.email || "correo@ejemplo.com"}
              </span>
              {user?.role?.nombre && (
                <span className="text-[10px] text-white bg-blue-500 rounded px-2 py-0.5 mt-1 mb-1 w-fit font-semibold tracking-wide uppercase">
                  {user.role.nombre}
                </span>
              )}
            </div>
          </div>
          <button
            className="w-full flex items-center bg-red-50 space-x-3 px-4 py-3 text-red-600 hover:bg-red-100 cursor-pointer rounded-lg transition-colors duration-200"
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
        <header className="bg-blue-800 border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              className="lg:hidden p-2 text-white hover:text-gray-300"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1 lg:ml-0 ml-4">
              <h1 className="text-xl lg:text-2xl font-bold text-white">
                Panel de Administración
              </h1>
              <p className="text-sm text-white mt-1 hidden sm:block">
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
          <Outlet />
        </div>
      </main>

      {/* Logout Modal */}
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
            <div className="fixed inset-0 bg-black/40 backdrop-blur-md" />
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
                      acceso a tu cuenta administrativa.
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
    </div>
  );
};

export default AdminLayout;
