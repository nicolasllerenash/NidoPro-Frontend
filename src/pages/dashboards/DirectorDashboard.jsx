import React, { useState } from "react";
import { useAuthStore } from "../../store";
import {
  BarChart3,
  Users as UsersIcon,
  GraduationCap,
  UserCheck,
  BookOpen,
  FileText,
  Calendar,
  StickyNote,
  LogOut,
  Bell,
  ChevronRight,
  Menu,
  X,
  Baby,
  CircleUser,
} from "lucide-react";

// Importar componentes académicos
import Estudiantes from "../admin/estudiantes/Estudiantes";
import Matricula from "../admin/matricula/Matricula";
import Trabajadores from "../admin/trabajadores/Trabajadores";
import AsignacionAula from "../admin/aulas/AsignacionAula";
import Aulas from "../admin/aula/Aulas";
import Reportes from "../admin/reportes/Reportes";
import Planificaciones from "../admin/planificaciones/Planificaciones";

const DirectorDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, user } = useAuthStore();

  const menuItems = [
    { id: "overview", label: "Resumen General", icon: BarChart3 },
    { id: "matricula", label: "Matrícula", icon: GraduationCap },
    { id: "trabajadores", label: "Trabajadores", icon: UsersIcon },
    { id: "students", label: "Estudiantes", icon: UsersIcon },
    { id: "asignacion-aula", label: "Asignación de Aulas", icon: BookOpen },
    { id: "aulas", label: "Gestión de Aulas", icon: BookOpen },
    { id: "reports", label: "Reportes", icon: FileText },
    { id: "cronogramas", label: "Cronogramas", icon: Calendar },
    { id: "tareas", label: "Tareas", icon: StickyNote },
    { id: "planificaciones", label: "Planificaciones", icon: FileText },
  ];

  const stats = [
    {
      title: "Total Estudiantes",
      value: "245",
      icon: UsersIcon,
      color: "#3B82F6",
      change: "+12%",
    },
    {
      title: "Profesores Activos",
      value: "28",
      icon: GraduationCap,
      color: "#10B981",
      change: "+3%",
    },
    {
      title: "Aulas Disponibles",
      value: "15",
      icon: BookOpen,
      color: "#F59E0B",
      change: "+2%",
    },
  ];

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
        <div className="flex items-center bg-blue-600 justify-between p-7 border-b border-gray-200 lg:justify-start">
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
        <nav className="mt-6 px-3 flex-1 overflow-y-auto">
          <div className="space-y-1 pb-4">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  className={`w-full flex items-center justify-between px-4 py-3 mb-1 rounded-lg text-left transition-all duration-200 group hover:translate-x-2 cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsMobileMenuOpen(false);
                  }}
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
              );
            })}
          </div>
        </nav>
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
                <span className="text-[10px] text-white bg-blue-600 rounded px-2 py-0.5 mt-1 mb-1 w-fit font-semibold tracking-wide uppercase">
                  {user.role.nombre}
                </span>
              )}
            </div>
          </div>
          <button
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            onClick={logout}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <header className="bg-blue-600 border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1 lg:ml-0 ml-4">
              <h1 className="text-xl lg:text-2xl font-bold text-white">
                Panel de Coordinación Académica
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
            <div className="flex items-center space-x-2 lg:space-x-4">
              <button className="relative p-2 text-white border-white border hover:text-gray-900 hover:bg-white rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
          </div>
        </header>
        <div className="p-4 lg:p-6 h-full overflow-y-auto">
          {activeSection === "overview" && (
            <div className="space-y-6 lg:space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white p-4 lg:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
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
                      </div>
                      <div>
                        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                          {stat.value}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {stat.title}
                        </p>
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {activeSection === "students" && <Estudiantes />}
          {activeSection === "matricula" && <Matricula />}
          {activeSection === "trabajadores" && <Trabajadores />}
          {activeSection === "classes" && <Clases />}
          {activeSection === "asignacionAula" && <AsignacionAula />}
          {activeSection === "aulas" && <Aulas />}
          {activeSection === "reports" && <Reportes />}
          {activeSection === "planificaciones" && <Planificaciones />}
        </div>
      </main>
    </div>
  );
};

export default DirectorDashboard;
