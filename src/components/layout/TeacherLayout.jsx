import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useAuthStore } from "../../store";
import {
  BarChart3,
  MessageCircle,
  Calendar,
  Users,
  ClipboardList,
  StickyNote,
  Gamepad2,
  GraduationCap,
  School,
  LogOut,
  ChevronRight,
  Bot,
  Menu,
  X,
  FileText,
  BookOpen,
  CircleUser,
} from "lucide-react";

const TeacherLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const location = useLocation();
  const { logout, user } = useAuthStore();

  const menuItems = [
    // DASHBOARD
    {
      path: "/teacher",
      label: "Panel Principal",
      icon: BarChart3,
      category: "dashboard",
    },

    // HERRAMIENTAS EDUCATIVAS
    {
      path: "/teacher/ai-chat",
      label: "Asistente IA",
      icon: MessageCircle,
      category: "herramientas",
    },
    {
      path: "/teacher/juegos",
      label: "Juegos",
      icon: Gamepad2,
      category: "herramientas",
    },

    // TRABAJO ACADÉMICO
    {
      path: "/teacher/cronograma",
      label: "Cronograma",
      icon: Calendar,
      category: "academico",
    },
    {
      path: "/teacher/asistencia",
      label: "Asistencias",
      icon: ClipboardList,
      category: "academico",
    },
    {
      path: "/teacher/tareas",
      label: "Tareas",
      icon: BookOpen,
      category: "academico",
    },
    {
      path: "/teacher/evaluaciones-estudiantes",
      label: "Evaluaciones Estudiantes",
      icon: FileText,
      category: "academico",
    },
    {
      path: "/teacher/anotaciones",
      label: "Anotaciones",
      icon: StickyNote,
      category: "academico",
    },
    {
      path: "/teacher/planificaciones",
      label: "Planificaciones",
      icon: FileText,
      category: "academico",
    },

    // GESTIÓN DE ESTUDIANTES
    {
      path: "/teacher/aulas",
      label: "Mis Aulas",
      icon: School,
      category: "gestion",
    },

    // EVALUACIONES PERSONALES
    {
      path: "/teacher/evaluaciones",
      label: "Mis Evaluaciones",
      icon: FileText,
      category: "evaluaciones",
    },
  ];

  const getCategoryLabel = (category) => {
    const labels = {
      dashboard: "Dashboard",
      herramientas: "Herramientas Educativas",
      academico: "Trabajo Académico",
      gestion: "Gestión de Estudiantes",
      evaluaciones: "Evaluaciones Personales",
    };
    return labels[category] || category;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      dashboard: BarChart3,
      herramientas: Bot,
      academico: GraduationCap,
      gestion: Users,
      evaluaciones: ClipboardList,
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
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center bg-green-600 justify-between p-7 border-b border-gray-200 lg:justify-start">
          <div className="flex items-center space-x-3 mt-1">
            <span className="text-xl font-bold text-white tracking-wider">
              EDA
            </span>
          </div>
          <button
            className="lg:hidden p-2 text-white hover:text-gray-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

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
                  {showCategorySeparator && (
                    <div className="my-4 px-4">
                      <div className="h-px bg-gray-400"></div>
                      <div className="text-sm font-bold text-green-900 uppercase tracking-wider mt-2 mb-1 flex items-center gap-2">
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
                        ? "bg-green-600 text-white"
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

        <div className="mt-auto p-3 border-t border-gray-300">
          <div className="flex flex-row items-center bg-gray-200 rounded-xl px-3 py-2 mb-3 w-full shadow gap-3 hover:-translate-y-1 transition-all hover:bg-green-100 cursor-pointer">
            <div className="w-11 h-11 rounded-full border-2 border-green-500 shadow bg-green-100 flex items-center justify-center">
              <CircleUser className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-gray-900 text-sm truncate">
                {user?.nombre || ""} {user?.apellido || ""}
              </span>
              <span className="text-xs text-gray-700 truncate">
                {user?.email || "correo@ejemplo.com"}
              </span>
              {user?.role?.nombre && (
                <span className="text-[10px] text-white bg-green-500 rounded px-2 py-0.5 mt-1 mb-1 w-fit font-semibold tracking-wide uppercase">
                  {user.rol}
                </span>
              )}
            </div>
          </div>
          <button
            className="w-full flex items-center bg-red-50 text-red-600 space-x-3 px-4 py-3 hover:bg-red-100 cursor-pointer rounded-lg transition-colors duration-200"
            onClick={handleLogoutClick}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <header className="bg-green-600 border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              className="lg:hidden p-2 text-white hover:text-gray-200"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1 lg:ml-0 ml-4">
              <h1 className="text-xl lg:text-2xl font-bold text-white">
                Panel de Docente
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

        <div className="p-4 lg:p-6 h-full overflow-y-auto">
          <Outlet />
        </div>
      </main>

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
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <LogOut className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 text-center mb-2"
                  >
                    ¿Seguro que quieres salir?
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 text-center">
                      Estás a punto de cerrar sesión en{" "}
                      <span className="font-semibold text-green-600">EDA</span>.
                      ¿Estás seguro de que quieres continuar?
                    </p>
                  </div>
                  <div className="mt-6 flex space-x-3">
                    <button
                      type="button"
                      className="flex-1 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={handleCancelLogout}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="flex-1 inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      onClick={handleConfirmLogout}
                    >
                      Sí, salir
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

export default TeacherLayout;
