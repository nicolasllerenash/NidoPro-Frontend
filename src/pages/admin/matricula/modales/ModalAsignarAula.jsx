import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, School, Users, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAsignarAula } from '../../../../hooks/queries/useMatriculaQueries';
import { useAulas } from '../../../../hooks/useAulas';

const ModalAsignarAula = ({ isOpen, onClose, matricula, refetch }) => {
  const [selectedAula, setSelectedAula] = useState('');
  const [filtroGrado, setFiltroGrado] = useState('');
  
  const { aulas = [], isLoading: loadingAulas } = useAulas();
  const asignarAulaMutation = useAsignarAula();

  // Filtrar aulas por el grado de la matrícula
  useEffect(() => {
    if (matricula?.idGrado?.idGrado) {
      setFiltroGrado(matricula.idGrado.idGrado);
    }
  }, [matricula]);

  // Filtrar aulas disponibles del mismo grado
  const aulasDelGrado = aulas.filter(aula => {
    const esDelGrado = aula.idGrado?.idGrado === filtroGrado || aula.idGrado?.id === filtroGrado;
    const estaActiva = aula.estaActivo !== false;
    return esDelGrado && estaActiva;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedAula) {
      toast.error('Debe seleccionar un aula');
      return;
    }

    try {
      await asignarAulaMutation.mutateAsync({
        idMatricula: matricula.idMatricula,
        idAula: selectedAula
      });
      
      if (refetch) {
        await refetch();
      }
      
      handleClose();
    } catch (error) {
      console.error('Error al asignar aula:', error);
    }
  };

  const handleClose = () => {
    setSelectedAula('');
    setFiltroGrado('');
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <School className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <Dialog.Title className="text-lg font-semibold text-gray-900">
                        Asignar Aula
                      </Dialog.Title>
                      <p className="text-sm text-gray-500">
                        Paso 2 de 3: Seleccione el aula
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Información del estudiante */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">Estudiante</h3>
                  <p className="text-sm text-blue-700">
                    {matricula?.idEstudiante?.nombre} {matricula?.idEstudiante?.apellido}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Grado: {matricula?.idGrado?.grado || 'No especificado'}
                  </p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    {/* Selector de Aula */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Aula *
                      </label>
                      <select
                        value={selectedAula}
                        onChange={(e) => setSelectedAula(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                        disabled={loadingAulas || aulasDelGrado.length === 0}
                      >
                        <option value="">Seleccione un aula</option>
                        {aulasDelGrado.map((aula) => {
                          const capacidad = aula.capacidad || 25;
                          const ocupados = aula.cantidadEstudiantes || 0;
                          const disponibles = capacidad - ocupados;
                          const porcentaje = (ocupados / capacidad) * 100;
                          
                          return (
                            <option 
                              key={aula.idAula || aula.id} 
                              value={aula.idAula || aula.id}
                              disabled={disponibles <= 0}
                            >
                              {aula.idGrado?.grado} - Sección {aula.seccion} 
                              ({ocupados}/{capacidad} - {disponibles} disponibles)
                            </option>
                          );
                        })}
                      </select>
                      
                      {loadingAulas && (
                        <p className="text-xs text-gray-500 mt-1">Cargando aulas...</p>
                      )}
                      
                      {!loadingAulas && aulasDelGrado.length === 0 && (
                        <p className="text-xs text-red-500 mt-1">
                          No hay aulas disponibles para el grado {matricula?.idGrado?.grado}
                        </p>
                      )}
                      
                      {selectedAula && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>
                              {(() => {
                                const aulaSeleccionada = aulasDelGrado.find(
                                  a => (a.idAula || a.id) === selectedAula
                                );
                                return aulaSeleccionada 
                                  ? `${aulaSeleccionada.cantidadEstudiantes || 0} estudiantes matriculados`
                                  : 'Información no disponible';
                              })()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      disabled={asignarAulaMutation.isPending}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={asignarAulaMutation.isPending || !selectedAula}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {asignarAulaMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Asignando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Asignar Aula
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalAsignarAula;
