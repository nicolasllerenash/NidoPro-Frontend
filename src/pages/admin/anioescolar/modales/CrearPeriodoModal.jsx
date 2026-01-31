import React, { useState } from 'react';
import { X, Loader2, CheckCircle } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useCrearPeriodoEscolar } from '../../../../hooks/queries/usePeriodoEscolarQueries';

const CrearPeriodoModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    anioEscolar: new Date().getFullYear(),
    fechaInicio: '',
    fechaFin: '',
    descripcion: ''
  });

  const crearPeriodoMutation = useCrearPeriodoEscolar();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await crearPeriodoMutation.mutateAsync({
        ...formData,
        estaActivo: true
      });
      handleClose();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleClose = () => {
    if (!crearPeriodoMutation.isPending) {
      setFormData({
        anioEscolar: new Date().getFullYear(),
        fechaInicio: '',
        fechaFin: '',
        descripcion: ''
      });
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
                    Crear Período Escolar
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    disabled={crearPeriodoMutation.isPending}
                    className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Año Escolar */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Año Escolar *
                    </label>
                    <input
                      type="number"
                      name="anioEscolar"
                      value={formData.anioEscolar}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                      placeholder="2025"
                      required
                      disabled={crearPeriodoMutation.isPending}
                    />
                  </div>

                  {/* Fechas */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Inicio *
                      </label>
                      <input
                        type="date"
                        name="fechaInicio"
                        value={formData.fechaInicio}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                        required
                        disabled={crearPeriodoMutation.isPending}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Fin *
                      </label>
                      <input
                        type="date"
                        name="fechaFin"
                        value={formData.fechaFin}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                        required
                        disabled={crearPeriodoMutation.isPending}
                      />
                    </div>
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción *
                    </label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      rows={3}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                      placeholder="Descripción del período escolar..."
                      required
                      disabled={crearPeriodoMutation.isPending}
                    />
                  </div>

                  {/* Botones */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={crearPeriodoMutation.isPending}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={crearPeriodoMutation.isPending}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
                    >
                      {crearPeriodoMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Crear Período
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

export default CrearPeriodoModal;
