import React, { useState, useEffect } from "react";
import { Users, UserPlus } from "lucide-react";
import { useTrabajadores } from "src/hooks/queries/useTrabajadoresQueries";
import TablaTrabajadores from "./tablas/TablaTrabajadores";
import ModalAgregarTrabajador from "./modales/ModalAgregarTrabajador";
import ModalVerTrabajador from "./modales/ModalVerTrabajador";
import ModalEditarTrabajador from "./modales/ModalEditarTrabajador";
import ModalEliminarTrabajador from "./modales/ModalEliminarTrabajador";

const Trabajadores = () => {
  // Hook personalizado para gestión de trabajadores
  const {
    data: trabajadoresData,
    isLoading: loading,
    error,
    refetch: refreshTrabajadores,
  } = useTrabajadores();

  // Extraer el array de trabajadores
  const trabajadores = Array.isArray(trabajadoresData)
    ? trabajadoresData
    : trabajadoresData?.trabajadores
    ? trabajadoresData.trabajadores
    : trabajadoresData?.data
    ? trabajadoresData.data
    : [];

  // Calcular estadísticas localmente
  const statistics = {
    total: trabajadores.length,
    active: trabajadores.filter((t) => t.estaActivo).length,
  };

  // Estados locales solo para UI
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTrabajador, setSelectedTrabajador] = useState(null);

  // --- Console.log para depuración ---
  console.log("--- Renderizando Componente Trabajadores ---");
  console.log("Estado de carga (loading):", loading);
  console.log("Datos recibidos (trabajadoresData):", trabajadoresData);
  console.log("Trabajadores procesados:", trabajadores);
  console.log("Estadísticas calculadas:", statistics);
  if (error) {
    console.error("Error del hook useTrabajadores:", error);
  }

  // Puedes usar useEffect para ver los cambios en los datos y el estado
  useEffect(() => {
    console.log("El hook useTrabajadores ha actualizado sus datos.");
    console.log("Datos actuales:", trabajadoresData);
    console.log("Trabajadores procesados:", trabajadores);
    console.log("Estadísticas actuales:", statistics);
  }, [trabajadoresData, trabajadores, statistics]);

  // Funciones para manejar las acciones de la tabla
  const handleAdd = () => {
    setShowModal(true);
  };

  const handleEdit = (trabajador) => {
    setSelectedTrabajador(trabajador);
    setShowEditModal(true);
  };

  const handleToggleStatus = (trabajador) => {
    setSelectedTrabajador(trabajador);
    setShowDeleteModal(true);
  };

  const handleView = (trabajador) => {
    setSelectedTrabajador(trabajador);
    setShowViewModal(true);
  };

  const handleImport = () => {
    console.log("Importar trabajadores");
  };

  const handleExport = () => {
    console.log("Exportar trabajadores");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestión de Trabajadores
            </h1>
            <p className="text-gray-600 mt-1">Administra los trabajadores</p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">
                  Total Trabajadores
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {statistics.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <UserPlus className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">
                  Trabajadores Activos
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {statistics.active}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Componente de Tabla de Trabajadores */}
      <TablaTrabajadores
        trabajadores={trabajadores}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleToggleStatus}
        onView={handleView}
        onImport={handleImport}
        onExport={handleExport}
      />

      {/* Modales */}
      <ModalAgregarTrabajador
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false);
          refreshTrabajadores();
        }}
      />
      <ModalVerTrabajador
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedTrabajador(null);
        }}
        trabajador={selectedTrabajador}
      />
      <ModalEditarTrabajador
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTrabajador(null);
        }}
        trabajador={selectedTrabajador}
      />
      <ModalEliminarTrabajador
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedTrabajador(null);
        }}
        onSuccess={() => {
          setShowDeleteModal(false);
          setSelectedTrabajador(null);
          refreshTrabajadores();
        }}
        trabajador={selectedTrabajador}
      />
    </div>
  );
};

export default Trabajadores;
