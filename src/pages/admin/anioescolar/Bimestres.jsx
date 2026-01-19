import React, { useState } from 'react';
import { Table, Plus, Edit, Calendar } from 'lucide-react';
import GenerarBimestresModal from './modales/GenerarBimestresModal';
import EditarBimestresModal from './modales/EditarBimestresModal';
import { usePeriodosEscolares } from '../../../hooks/queries/usePeriodoEscolarQueries';
import { useBimestres } from '../../../hooks/queries/useBimestreQueries';

const Bimestres = () => {
  const [modalGenerarBimestres, setModalGenerarBimestres] = useState(false);
  const [modalEditarBimestres, setModalEditarBimestres] = useState(false);
  const [bimestresSeleccionados, setBimestresSeleccionados] = useState([]);
  const [periodoBimestresSeleccionado, setPeriodoBimestresSeleccionado] = useState(null);

  // Obtener períodos escolares
  const { data: periodos = [], isLoading: loadingPeriodos } = usePeriodosEscolares();

  // Obtener bimestres
  const { data: bimestresData = [], isLoading: loadingBimestres, error: errorBimestres } = useBimestres();

  const handleEditarBimestres = (bimestres, periodo) => {
    setBimestresSeleccionados(bimestres);
    setPeriodoBimestresSeleccionado(periodo);
    setModalEditarBimestres(true);
  };

  const handleCloseEditarBimestres = () => {
    setModalEditarBimestres(false);
    setBimestresSeleccionados([]);
    setPeriodoBimestresSeleccionado(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Table className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Bimestres</h1>
              <p className="text-gray-600">Administra los bimestres de cada período escolar</p>
            </div>
          </div>
          <button
            onClick={() => setModalGenerarBimestres(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Generar Bimestres
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {loadingBimestres || loadingPeriodos ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Cargando bimestres...</p>
          </div>
        ) : errorBimestres ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">Error al cargar los bimestres</p>
          </div>
        ) : !bimestresData?.bimestres || bimestresData.bimestres.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-8 bg-gray-50 rounded-lg">
              <Table className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">No hay bimestres registrados</p>
              <button
                onClick={() => setModalGenerarBimestres(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Generar bimestres
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Agrupar bimestres por período */}
            {periodos.map((periodo) => {
              const bimestresDelPeriodo = bimestresData.bimestres.filter(
                bimestre => bimestre.idPeriodoEscolar === periodo.idPeriodoEscolar
              );

              if (bimestresDelPeriodo.length === 0) return null;

              return (
                <div key={periodo.idPeriodoEscolar} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-purple-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          Año {periodo.anioEscolar}
                        </h3>
                        {periodo.estaActivo && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            Activo
                          </span>
                        )}
                        <span className="text-sm text-gray-600">
                          ({bimestresDelPeriodo.length} bimestre{bimestresDelPeriodo.length !== 1 ? 's' : ''})
                        </span>
                      </div>
                      <button
                        onClick={() => handleEditarBimestres(bimestresDelPeriodo, periodo)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Editar Fechas
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bimestre
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha Inicio
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha Fin
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Límite Programación
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bimestresDelPeriodo.map((bimestre) => (
                          <tr key={bimestre.idBimestre} className="hover:bg-purple-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                  <span className="text-purple-600 font-bold text-sm">
                                    {bimestre.numeroBimestre}
                                  </span>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {bimestre.numeroBimestre}° Bimestre
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {bimestre.nombreBimestre}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(bimestre.fechaInicio).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(bimestre.fechaFin).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(bimestre.fechaLimiteProgramacion).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {bimestre.estaActivo ? (
                                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                  Activo
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                                  Inactivo
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modales */}
      {modalEditarBimestres && (
        <EditarBimestresModal
          isOpen={modalEditarBimestres}
          onClose={handleCloseEditarBimestres}
          bimestres={bimestresSeleccionados}
          periodo={periodoBimestresSeleccionado}
        />
      )}

      {modalGenerarBimestres && (
        <GenerarBimestresModal
          isOpen={modalGenerarBimestres}
          onClose={() => setModalGenerarBimestres(false)}
        />
      )}
    </div>
  );
};

export default Bimestres;
