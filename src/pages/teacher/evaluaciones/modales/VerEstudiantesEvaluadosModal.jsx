import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Award, Users, FileText, Eye, CheckCircle } from 'lucide-react';

const VerEstudiantesEvaluadosModal = ({ isOpen, onClose, idAula, evaluacion }) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const [libretaCalificaciones, setLibretaCalificaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [estadisticas, setEstadisticas] = useState(null);

  // Obtener libreta de calificaciones del aula
  const fetchLibretaCalificaciones = async () => {
    if (!idAula) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth-storage')
        ? JSON.parse(localStorage.getItem('auth-storage')).state?.token
        : null;

      if (!token) {
        console.error('No se encontró token para libreta');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/nota/libreta-kinder/aula/${idAula}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response libreta status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response libreta:', errorText);
        return;
      }

      const data = await response.json();
      console.log('API Response libreta:', data);

      if (data.success && data.info?.data?.libretas) {
        const libretasCompletas = [];
        let totalEvaluados = 0;

        data.info.data.libretas.forEach((libreta) => {
          if (libreta.estudiante && libreta.estudiante.idEstudiante) {
            totalEvaluados++;
            libretasCompletas.push({
              estudiante: libreta.estudiante,
              libreta: libreta.libreta
            });
          }
        });

        setLibretaCalificaciones(libretasCompletas);
        setEstadisticas({
          totalEstudiantes: data.info.data.aula.totalEstudiantes,
          estudiantesEvaluados: totalEvaluados,
          estadisticasGenerales: data.info.data.aula.estadisticasGenerales
        });
      }
    } catch (error) {
      console.error('Error en fetchLibretaCalificaciones:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar datos cuando se abre el modal
  useEffect(() => {
    if (isOpen && idAula) {
      fetchLibretaCalificaciones();
    }
  }, [isOpen, idAula]);

  // Función para obtener el color de la calificación
  const getCalificacionColor = (calificacion) => {
    switch (calificacion) {
      case 'A': return 'bg-green-100 text-green-800 border-green-200';
      case 'B': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'C': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'D': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'F': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/20 bg-opacity-25" />
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
              <Dialog.Panel className="w-full max-w-4xl mx-4 sm:mx-auto max-h-[90vh] transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-base sm:text-lg font-medium leading-6 text-gray-900 flex items-center justify-between p-4 sm:p-6 border-b border-gray-200"
                >
                  <span className="flex items-center">
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                    <span className="text-sm sm:text-base">Estudiantes Evaluados - Libreta de Calificaciones</span>
                  </span>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 p-1"
                    onClick={onClose}
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </Dialog.Title>

                <div className="p-4 sm:p-6">
                  {/* Información de la evaluación */}
                  {evaluacion && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Evaluación Actual:</h4>
                      <p className="text-sm text-gray-600 font-medium">{evaluacion.descripcion}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Tipo: {evaluacion.tipoEvaluacion} | Fecha: {new Date(evaluacion.fecha).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  )}

                  {/* Estadísticas */}
                  {estadisticas && (
                    <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 border border-blue-200">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{estadisticas.totalEstudiantes}</div>
                          <div className="text-sm text-blue-700">Total Estudiantes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{estadisticas.estudiantesEvaluados}</div>
                          <div className="text-sm text-green-700">Evaluados</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{estadisticas.estadisticasGenerales.totalLogrados}</div>
                          <div className="text-sm text-purple-700">Logro Esperado</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{estadisticas.estadisticasGenerales.totalEnProceso}</div>
                          <div className="text-sm text-orange-700">En Proceso</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Lista de estudiantes evaluados */}
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-gray-600">Cargando libreta de calificaciones...</p>
                      </div>
                    ) : libretaCalificaciones.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No hay estudiantes evaluados aún</p>
                      </div>
                    ) : (
                      libretaCalificaciones.map((item, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                            <div className="flex items-center mb-2 sm:mb-0">
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2" />
                              <span className="font-medium text-gray-800 text-sm sm:text-lg">
                                {item.estudiante.nombre} {item.estudiante.apellido}
                              </span>
                            </div>
                            <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {item.estudiante.tipoDocumento}: {item.estudiante.nroDocumento}
                            </span>
                          </div>

                          <div className="space-y-3">
                            {item.libreta.areas.map((area, areaIndex) => (
                              <div key={areaIndex} className="bg-gray-50 p-2 sm:p-3 rounded-md border-l-4 border-blue-500">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                                  <span className="font-medium text-gray-700 text-sm sm:text-base mb-1 sm:mb-0">{area.area}</span>
                                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${getCalificacionColor(area.calificacion)}`}>
                                    {area.calificacion}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 mb-2">
                                  <div>
                                    <span className="font-medium">Nivel:</span> {area.nivelLogro}
                                  </div>
                                  <div>
                                    <span className="font-medium">Promedio:</span> {area.promedio}
                                  </div>
                                  <div>
                                    <span className="font-medium">Evaluaciones:</span> {area.totalEvaluaciones}
                                  </div>
                                  <div>
                                    <span className="font-medium">Estado:</span>
                                    <span className={`ml-1 px-1 sm:px-2 py-0.5 rounded text-xs ${
                                      area.nivelLogro === 'Logro esperado' ? 'bg-green-100 text-green-800' :
                                      area.nivelLogro === 'En proceso' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {area.nivelLogro}
                                    </span>
                                  </div>
                                </div>

                                {area.evaluaciones && area.evaluaciones.length > 0 && (
                                  <div className="bg-white p-2 rounded border text-xs sm:text-sm">
                                    <div className="font-medium text-gray-700 mb-1">Última evaluación:</div>
                                    <div className="text-gray-600">
                                      <span className="font-medium">Fecha:</span> {new Date(area.evaluaciones[0].fecha).toLocaleDateString('es-ES')}
                                    </div>
                                    <div className="text-gray-600">
                                      <span className="font-medium">Descripción:</span> {area.evaluaciones[0].descripcion}
                                    </div>
                                    {area.evaluaciones[0].observaciones && (
                                      <div className="text-gray-600 mt-1">
                                        <span className="font-medium">Observaciones:</span> {area.evaluaciones[0].observaciones}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default VerEstudiantesEvaluadosModal;