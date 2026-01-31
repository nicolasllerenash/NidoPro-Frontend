import React, { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useActualizarFechasBimestres } from '../../../../hooks/queries/useBimestreQueries';

const EditarBimestresModal = ({ isOpen, onClose, bimestres, periodo }) => {
  const [bimestresData, setBimestresData] = useState([]);

  const actualizarFechasMutation = useActualizarFechasBimestres();

  // Inicializar datos cuando se abre el modal
  useEffect(() => {
    if (isOpen && bimestres && bimestres.length > 0) {
      setBimestresData(
        bimestres.map(bimestre => ({
          id: bimestre.idBimestre,
          numeroBimestre: bimestre.numeroBimestre,
          nombreBimestre: bimestre.nombreBimestre,
          fechaInicio: bimestre.fechaInicio,
          fechaFin: bimestre.fechaFin,
          fechaLimiteProgramacion: bimestre.fechaLimiteProgramacion
        }))
      );
    }
  }, [isOpen, bimestres]);

  const handleInputChange = (index, field, value) => {
    setBimestresData(prev => prev.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Preparar datos para el endpoint (incluye fechaLimiteProgramacion sin cambios)
      const dataToSend = bimestresData.map(bimestre => ({
        id: bimestre.id,
        fechaInicio: bimestre.fechaInicio,
        fechaFin: bimestre.fechaFin,
        fechaLimiteProgramacion: bimestre.fechaLimiteProgramacion
      }));

      await actualizarFechasMutation.mutateAsync(dataToSend);
      onClose();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleClose = () => {
    if (!actualizarFechasMutation.isPending) {
      onClose();
    }
  };

  if (!isOpen || !bimestres || bimestres.length === 0) return null;

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
              <Dialog.Panel className="w-full max-w-2xl transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                    Editar Fechas de Bimestres
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    disabled={actualizarFechasMutation.isPending}
                    className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {periodo && (
                  <p className="text-sm text-gray-500 mb-4">
                    Período: Año {periodo.anioEscolar} - {periodo.descripcion || 'Sin descripción'}
                  </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {bimestresData.map((bimestre, index) => (
                      <div key={bimestre.id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">
                          {bimestre.numeroBimestre}° Bimestre - {bimestre.nombreBimestre}
                        </h4>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Fecha de Inicio
                            </label>
                            <input
                              type="date"
                              value={bimestre.fechaInicio}
                              onChange={(e) => handleInputChange(index, 'fechaInicio', e.target.value)}
                              disabled={actualizarFechasMutation.isPending}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Fecha de Fin
                            </label>
                            <input
                              type="date"
                              value={bimestre.fechaFin}
                              onChange={(e) => handleInputChange(index, 'fechaFin', e.target.value)}
                              disabled={actualizarFechasMutation.isPending}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Botones */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={actualizarFechasMutation.isPending}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={actualizarFechasMutation.isPending}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
                    >
                      {actualizarFechasMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Actualizando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Actualizar Fechas
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

export default EditarBimestresModal;
