import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Loader2, CheckCircle } from 'lucide-react';
import { useCursos } from '../../../../hooks/useCursos';
import { useGrados } from '../../../../hooks/useGrados';
import { useCreateCursoGrado } from '../../../../hooks/queries/useCursoGradoQueries';

const ModalAgregarCursoGrado = ({ isOpen, onClose, onSuccess, defaultGradoId = '' }) => {
  const [formData, setFormData] = useState({
    idCurso: '',
    idGrado: '',
    fechaAsignacion: ''
  });

  const [errors, setErrors] = useState({});

  // Hooks para obtener datos
  const { data: cursosData = [], isLoading: loadingCursos } = useCursos();
  const { grados = [], isLoading: loadingGrados } = useGrados();

  // Extraer arrays
  const cursos = Array.isArray(cursosData) ? cursosData : cursosData?.cursos || cursosData?.data || [];

  // Hook para crear
  const createMutation = useCreateCursoGrado();

  // Resetear formulario
  useEffect(() => {
    if (isOpen) {
      setFormData({
        idCurso: '',
        idGrado: defaultGradoId || '',
        fechaAsignacion: new Date().toISOString().split('T')[0]
      });
      setErrors({});
    }
  }, [isOpen, defaultGradoId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.idGrado) {
      newErrors.idGrado = 'Debe seleccionar un grado';
    }

    if (!formData.idCurso) {
      newErrors.idCurso = 'Debe seleccionar un curso';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createMutation.mutateAsync({
        ...formData,
        fechaAsignacion: new Date().toISOString().split('T')[0],
        estaActivo: true
      });
      onSuccess();
    } catch (error) {
      console.error('Error al crear curso-grado:', error);
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-lg font-medium text-gray-900">
                    Asignar Curso a Grado
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Grado */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grado Académico *
                    </label>
                    <select
                      name="idGrado"
                      value={formData.idGrado}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.idGrado ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={loadingGrados || !!defaultGradoId}
                    >
                      <option value="">Seleccionar grado</option>
                      {grados.map((grado) => (
                        <option key={grado.idGrado || grado.id} value={grado.idGrado || grado.id}>
                          {grado.grado || grado.nombreGrado} {grado.nivel ? `- ${grado.nivel}` : ''}
                        </option>
                      ))}
                    </select>
                    {errors.idGrado && (
                      <p className="mt-1 text-sm text-red-600">{errors.idGrado}</p>
                    )}
                  </div>

                  {/* Curso */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Curso *
                    </label>
                    <select
                      name="idCurso"
                      value={formData.idCurso}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.idCurso ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={loadingCursos}
                    >
                      <option value="">Seleccionar curso</option>
                      {cursos.map((curso) => (
                        <option key={curso.idCurso || curso.id} value={curso.idCurso || curso.id}>
                          {curso.nombreCurso || curso.nombre}
                        </option>
                      ))}
                    </select>
                    {errors.idCurso && (
                      <p className="mt-1 text-sm text-red-600">{errors.idCurso}</p>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={createMutation.isPending}
                      className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {createMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Asignar Curso
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

export default ModalAgregarCursoGrado;
