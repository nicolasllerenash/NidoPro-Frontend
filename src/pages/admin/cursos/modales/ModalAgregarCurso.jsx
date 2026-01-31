import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const ModalAgregarCurso = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombreCurso: '',
    descripcion: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombreCurso.trim()) {
      newErrors.nombreCurso = 'El nombre del curso es obligatorio';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      nombreCurso: '',
      descripcion: ''
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor, corrige los errores en el formulario');
      return;
    }

    try {
      setLoading(true);
      await onSave({
        ...formData,
        estaActivo: true
      });
      resetForm();
    } catch (error) {
      console.error('Error al crear curso:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  const inputClassName = (fieldError) =>
    `w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
      fieldError ? 'border-red-300' : 'border-gray-300'
    }`;

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
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md" />
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
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                    Crear Curso
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    disabled={loading}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Curso *
                    </label>
                    <input
                      type="text"
                      name="nombreCurso"
                      value={formData.nombreCurso}
                      onChange={handleInputChange}
                      placeholder="Ej: Matemáticas"
                      className={inputClassName(errors.nombreCurso)}
                      disabled={loading}
                    />
                    {errors.nombreCurso && (
                      <p className="mt-1 text-sm text-red-600">{errors.nombreCurso}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción *
                    </label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      placeholder="Describe el contenido del curso..."
                      rows={3}
                      className={inputClassName(errors.descripcion)}
                      disabled={loading}
                    />
                    {errors.descripcion && (
                      <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
                    )}
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={loading}
                      className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Crear Curso
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

export default ModalAgregarCurso;
