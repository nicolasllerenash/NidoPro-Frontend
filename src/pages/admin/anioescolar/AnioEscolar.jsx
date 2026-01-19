import React, { useState } from 'react';
import { Calendar, Plus, Edit } from 'lucide-react';
import CrearPeriodoModal from './modales/CrearPeriodoModal';
import EditarPeriodoModal from './modales/EditarPeriodoModal';
import { usePeriodosEscolares } from '../../../hooks/queries/usePeriodoEscolarQueries';

const AnioEscolar = () => {
  const [modalCrearPeriodo, setModalCrearPeriodo] = useState(false);
  const [modalEditarPeriodo, setModalEditarPeriodo] = useState(false);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState(null);

  // Obtener períodos escolares
  const { data: periodos = [], isLoading: loadingPeriodos, error: errorPeriodos } = usePeriodosEscolares();

  // Handlers para modales
  const handleEditarPeriodo = (periodo) => {
    setPeriodoSeleccionado(periodo);
    setModalEditarPeriodo(true);
  };

  const handleCloseEditarPeriodo = () => {
    setModalEditarPeriodo(false);
    setPeriodoSeleccionado(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Períodos Escolares</h1>
              <p className="text-gray-600">Administra los períodos escolares del sistema</p>
            </div>
          </div>
          <button
            onClick={() => setModalCrearPeriodo(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Crear Período
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {loadingPeriodos ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Cargando períodos escolares...</p>
          </div>
        ) : errorPeriodos ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">Error al cargar los períodos escolares</p>
          </div>
        ) : periodos.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-8 bg-gray-50 rounded-lg">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">No hay períodos escolares registrados</p>
              <button
                onClick={() => setModalCrearPeriodo(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Crear primer período
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {periodos.map((periodo) => (
              <div key={periodo.idPeriodoEscolar} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-gray-50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Año {periodo.anioEscolar}
                      </h3>
                      {periodo.estaActivo && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Activo
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditarPeriodo(periodo)}
                    className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                    title="Editar período"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Inicio:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(periodo.fechaInicio).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fin:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(periodo.fechaFin).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  {periodo.descripcion && (
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-gray-600 text-xs">Descripción:</p>
                      <p className="text-gray-900 font-medium">{periodo.descripcion}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modales */}
      {modalCrearPeriodo && (
        <CrearPeriodoModal
          isOpen={modalCrearPeriodo}
          onClose={() => setModalCrearPeriodo(false)}
        />
      )}

      {modalEditarPeriodo && (
        <EditarPeriodoModal
          isOpen={modalEditarPeriodo}
          onClose={handleCloseEditarPeriodo}
          periodo={periodoSeleccionado}
        />
      )}
    </div>
  );
};

export default AnioEscolar;
