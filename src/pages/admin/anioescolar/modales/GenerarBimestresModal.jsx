import React, { useState } from 'react';
import { X, Loader2, CheckCircle } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useGenerarBimestresAutomaticos } from '../../../../hooks/queries/useBimestreQueries';
import { usePeriodosEscolares } from '../../../../hooks/queries/usePeriodoEscolarQueries';

const GenerarBimestresModal = ({ isOpen, onClose }) => {
  const [selectedPeriodo, setSelectedPeriodo] = useState('');

  // Hooks
  const { data: periodosData = [], isLoading: loadingPeriodos } = usePeriodosEscolares();
  const generarBimestresMutation = useGenerarBimestresAutomaticos();

  // Extraer periodos del response
  const periodos = periodosData || [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPeriodo) {
      return;
    }

    try {
      await generarBimestresMutation.mutateAsync(selectedPeriodo);
      handleClose();
    } catch (error) {
      console.error('Error generating bimestres:', error);
    }
  };

  const handleClose = () => {
    if (!generarBimestresMutation.isPending) {
      setSelectedPeriodo('');
      onClose();
    }
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
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                    Generar Bimestres
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    disabled={generarBimestresMutation.isPending}
                    className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Selector de Período */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Período Escolar *
                    </label>
                    <select
                      value={selectedPeriodo}
                      onChange={(e) => setSelectedPeriodo(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                      disabled={loadingPeriodos || generarBimestresMutation.isPending}
                    >
                      <option value="">
                        {loadingPeriodos ? 'Cargando períodos...' : 'Seleccione un período'}
                      </option>
                      {periodos.map((periodo) => (
                        <option key={periodo.idPeriodoEscolar} value={periodo.idPeriodoEscolar}>
                          {periodo.descripcion} ({periodo.anioEscolar})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Información del período seleccionado */}
                  {selectedPeriodo && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      {(() => {
                        const periodo = periodos.find(p => p.idPeriodoEscolar === selectedPeriodo);
                        return periodo ? (
                          <div className="text-sm text-blue-800">
                            <p><strong>Año:</strong> {periodo.anioEscolar}</p>
                            <p><strong>Inicio:</strong> {new Date(periodo.fechaInicio + 'T00:00:00').toLocaleDateString('es-ES')}</p>
                            <p><strong>Fin:</strong> {new Date(periodo.fechaFin + 'T00:00:00').toLocaleDateString('es-ES')}</p>
                            <p><strong>Estado:</strong> {periodo.estaActivo ? 'Activo' : 'Inactivo'}</p>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}

                  {/* Botones */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={generarBimestresMutation.isPending}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={generarBimestresMutation.isPending || !selectedPeriodo || loadingPeriodos}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
                    >
                      {generarBimestresMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Generar Bimestres
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

export default GenerarBimestresModal;
