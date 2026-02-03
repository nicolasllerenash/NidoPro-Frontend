import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useAuthStore } from "../../store";
import {
  BarChart3,
  FileText,
  LogOut,
  ChevronRight,
  Menu,
  X,
  CircleUser,
  DollarSign,
  Banknote,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const SecretaryLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const location = useLocation();
  const { logout, user } = useAuthStore();

  const menuItems = [
    {
      path: "/secretaria",
      label: "Panel Principal",
      icon: BarChart3,
      category: "dashboard",
    },
    {
      path: "/secretaria/reportes",
      label: "Reportes",
      icon: FileText,
      category: "reportes",
    },
    {
      path: "/secretaria/caja",
      label: "Caja",
      icon: DollarSign,
      category: "finanzas",
    },
    {
      path: "/secretaria/pensiones",
      label: "Pensiones",
      icon: Banknote,
      category: "finanzas",
    },
  ];

  const getCategoryLabel = (category) => {
    const labels = {
      dashboard: "Dashboard",
      reportes: "Reportes",
      finanzas: "Finanzas",
    };
    return labels[category] || category;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      dashboard: BarChart3,
      reportes: FileText,
      finanzas: DollarSign,
    };
    return icons[category] || BarChart3;
  };

  const handleLogoutClick = () => setIsLogoutModalOpen(true);
  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
  };
  const handleCancelLogout = () => setIsLogoutModalOpen(false);

  return (
    <div className="flex h-screen bg-gray-50 border-r">
      {/* Top Header */}
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="flex w-full">
          <div className="w-full bg-blue-300 border-gray-200 px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center">
                <button
                  className="lg:hidden p-2 text-blue-900 hover:text-blue-700"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className="w-6 h-6" />
                </button>
                <button
                  className="hidden lg:flex p-2 text-blue-900 hover:text-blue-700 transition-colors rounded-md hover:bg-blue-100"
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  title={isSidebarCollapsed ? "Expandir menu" : "Colapsar menu"}
                >
                  {isSidebarCollapsed ? (
                    <PanelLeftOpen className="w-5 h-5" />
                  ) : (
                    <PanelLeftClose className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="flex-1 ml-4">
                <h1 className="text-xl lg:text-2xl font-bold text-black">
                  Panel de Secretaría
                </h1>
                <p className="text-sm text-blue-900/70 mt-1 hidden sm:block">
                  {new Date().toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col leading-tight text-right">
                    <span className="text-blue-900 font-semibold text-sm truncate max-w-[180px]">
                      {user?.nombre || ""} {user?.apellido || ""}
                    </span>
                    <span className="text-xs text-blue-900/70 truncate max-w-[180px]">
                      {user?.email || "correo@ejemplo.com"}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-blue-900/30 bg-white/40 flex items-center justify-center">
                    <CircleUser className="w-5 h-5 text-blue-900" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-blue-50 shadow-lg transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col pt-20 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } ${isSidebarCollapsed ? "lg:w-20" : "lg:w-64"} w-64`}
      >
        <button
          className="lg:hidden absolute right-4 top-4 p-2 text-blue-700 hover:text-blue-600"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X className="w-6 h-6" />
        </button>

        <nav className={`mt-6 flex-1 overflow-y-auto ${isSidebarCollapsed ? "lg:px-2" : "px-3"}`}>
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
                    <div className={`my-4 ${isSidebarCollapsed ? "lg:px-1" : "px-4"}`}>
                      <div className="h-px bg-gray-400"></div>
                      <div
                        className={`text-sm font-bold text-blue-900 uppercase tracking-wider mt-2 mb-1 flex items-center gap-2 transition-opacity duration-200 ${
                          isSidebarCollapsed
                            ? "lg:opacity-0 lg:pointer-events-none"
                            : "lg:opacity-100 lg:delay-150"
                        }`}
                      >
                        {React.createElement(getCategoryIcon(item.category), {
                          className: "w-4 h-4",
                        })}
                        {getCategoryLabel(item.category)}
                      </div>
                      {!isSidebarCollapsed && <div className="h-px bg-gray-400"></div>}
                    </div>
                  )}

                  <Link
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    title={isSidebarCollapsed ? item.label : ""}
                    className={`w-full flex items-center ${isSidebarCollapsed ? "lg:justify-center lg:px-2" : "justify-between px-4"} py-3 mb-1 rounded-lg text-left transition-all duration-200 group hover:translate-x-2 cursor-pointer ${
                      isActive
                        ? "bg-blue-300 text-blue-900"
                        : "text-blue-900/70 hover:bg-blue-100 hover:text-blue-900 active:text-blue-900"
                    }`}
                  >
                    <div className="flex items-center">
                      <IconComponent
                        className={`w-5 h-5 ${
                          isActive
                            ? "text-blue-900"
                            : "text-blue-400 group-hover:text-blue-700"
                        }`}
                      />
                      <span
                        className={`font-medium whitespace-nowrap transition-all duration-200 ${
                          isSidebarCollapsed
                            ? "lg:w-0 lg:opacity-0 lg:overflow-hidden lg:pointer-events-none"
                            : "lg:w-auto lg:opacity-100 lg:ml-3 lg:delay-150"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 transition-all duration-200 ${
                        isSidebarCollapsed
                          ? "lg:w-0 lg:opacity-0 lg:overflow-hidden lg:translate-x-1"
                          : "lg:w-4 lg:opacity-100 lg:delay-150"
                      } ${isActive ? "rotate-90 text-blue-900" : "text-blue-400"}`}
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </nav>

        <div className="mt-auto border-t border-blue-200 p-3">
          <button
            className="w-full flex items-center bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer rounded-lg transition-colors duration-200 space-x-3 px-4 py-3"
            onClick={handleLogoutClick}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden lg:ml-0 pt-20">
        <div className="p-4 lg:p-6 h-full overflow-y-auto">
          <Outlet context={{ isSidebarCollapsed, setIsSidebarCollapsed }} />
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

export default SecretaryLayout;
