import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store";

/**
 * Dashboard - Componente de redirección basado en rol
 * Ya no se usa como componente principal, solo como fallback para /dashboard
 * Las rutas principales están en App.jsx con /admin, /teacher, /parent
 */
const Dashboard = () => {
  const { user, isAuthenticated } = useAuthStore();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Obtener el nombre del rol
  const roleName = user.role?.nombre?.toLowerCase();

  // Redirigir según el rol del usuario
  if (roleName === "admin" || roleName === "administrador" || roleName === "directora") {
    return <Navigate to="/admin" replace />;
  }
  
  if (roleName === "secretaria") {
    return <Navigate to="/admin" replace />;
  }
  
  if (roleName === "trabajador" || roleName === "docente" || roleName === "profesor") {
    return <Navigate to="/teacher" replace />;
  }
  
  if (roleName === "padre" || roleName === "parent" || roleName === "estudiante") {
    return <Navigate to="/parent" replace />;
  }
  
  if (roleName === "especialista") {
    // Por ahora redirigir a teacher, más adelante crear SpecialistLayout
    return <Navigate to="/teacher" replace />;
  }

  // Si el rol no es reconocido, mostrar error y permitir logout
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Rol No Reconocido
        </h2>
        <p className="text-gray-600 mb-4">
          El rol <span className="font-semibold text-red-600">{roleName}</span> no está configurado en el sistema.
        </p>
        <div className="space-y-2 text-left bg-gray-50 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-700">
            <strong>Usuario:</strong> {user.nombre} {user.apellido}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Rol:</strong> {user.role?.nombre}
          </p>
        </div>
        <button
          onClick={() => {
            useAuthStore.getState().logout();
          }}
          className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
        >
          Cerrar Sesión
        </button>
        <p className="text-xs text-gray-500 mt-4">
          Por favor, contacta al administrador del sistema.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
;

export default Dashboard;
