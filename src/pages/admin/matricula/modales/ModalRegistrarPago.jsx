import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, DollarSign, Receipt, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRegistrarPago } from '../../../../hooks/queries/useMatriculaQueries';

const ModalRegistrarPago = ({ isOpen, onClose, matricula, refetch }) => {
  const [numeroComprobante, setNumeroComprobante] = useState('');
  
  const registrarPagoMutation = useRegistrarPago();

  // Obtener ID del usuario actual (trabajador que registra)
  const getUserId = () => {
    try {
      const authData = localStorage.getItem('auth-storage');
      if (authData) {
        const parsedAuth = JSON.parse(authData);
        return parsedAuth.state?.user?.entidadId || parsedAuth.state?.user?.id;
      }
      return null;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  };

  // Generar número de comprobante automático
  const generarNumeroComprobante = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
    
    return `MAT-${year}${month}${day}-${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const registradoPor = getUserId();
    
    if (!registradoPor) {
      toast.error('No se pudo identificar al usuario actual');
      return;
    }

    if (!numeroComprobante) {
      toast.error('Debe ingresar un número de comprobante');
      return;
    }

    try {
      await registrarPagoMutation.mutateAsync({
        idMatricula: matricula.idMatricula,
        registradoPor,
        numeroComprobante
      });
      
      if (refetch) {
        await refetch();
      }
      
      handleClose();
    } catch (error) {
      console.error('Error al registrar pago:', error);
    }
  };

  const handleClose = () => {
    setNumeroComprobante('');
    onClose();
  };

  const handleGenerarComprobante = () => {
    const numero = generarNumeroComprobante();
    setNumeroComprobante(numero);
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
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <Dialog.Title className="text-lg font-semibold text-gray-900">
                        Registrar Pago
                      </Dialog.Title>
                      <p className="text-sm text-gray-500">
                        Paso 3 de 3: Registro en caja
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

                {/* Información de la matrícula */}
                <div className="mb-6 space-y-3">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-900 mb-2">Estudiante</h3>
                    <p className="text-sm text-blue-700">
                      {matricula?.idEstudiante?.nombre} {matricula?.idEstudiante?.apellido}
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="text-sm font-medium text-green-900 mb-2">Monto de Matrícula</h3>
                    <p className="text-2xl font-bold text-green-700">
                      S/. {Number(matricula?.costoMatricula || 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    {/* Número de Comprobante */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de Comprobante *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={numeroComprobante}
                          onChange={(e) => setNumeroComprobante(e.target.value)}
                          placeholder="MAT-260118-12345"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                        <button
                          type="button"
                          onClick={handleGenerarComprobante}
                          className="px-3 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                          title="Generar número automático"
                        >
                          <Receipt className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Haga clic en <Receipt className="w-3 h-3 inline" /> para generar automáticamente
                      </p>
                    </div>

                    {/* Información adicional */}
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs text-yellow-800">
                        <strong>Nota:</strong> Este paso es opcional. Solo registre el pago cuando el apoderado haya pagado efectivamente.
                      </p>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      disabled={registrarPagoMutation.isPending}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={registrarPagoMutation.isPending || !numeroComprobante}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {registrarPagoMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Registrando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Registrar Pago
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

export default ModalRegistrarPago;
