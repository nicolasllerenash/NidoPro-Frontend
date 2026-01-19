import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, UserCheck, School, Calendar } from 'lucide-react';
import { useAulasAsignacion } from '../../../../hooks/useAulasAsignacion';
import { useTrabajadores } from '../../../../hooks/useTrabajadores';

const ModalAsignarDocente = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    idAula: '',
    idTrabajador: '',
    fechaAsignacion: '',
    estadoActivo: true
  });

  const [errors, setErrors] = useState({});

  // Hooks
  const { 
    aulas = [], 
    createAsignacion,
    isCreatingAsignacion,
    refetchAsignaciones 
  } = useAulasAsignacion(true); // true = solo aulas sin asignación
  const { trabajadores = [], isLoading: loadingTrabajadores } = useTrabajadores();

  // Filtrar solo docentes (busca en cargo, idRol.nombre o idRol.nombreRol)
  const docentes = trabajadores.filter(t => {
    const cargo = t.cargo?.toLowerCase() || '';
    const rolNombre = t.idRol?.nombre?.toLowerCase() || '';
    const rolNombreRol = t.idRol?.nombreRol?.toLowerCase() || '';
    
    return cargo.includes('docente') || 
           cargo.includes('profesor') ||
           cargo.includes('auxiliar') ||
           rolNombre.includes('docente') ||
           rolNombre.includes('profesor') ||
           rolNombre.includes('auxiliar') ||
           rolNombreRol.includes('docente') ||
           rolNombreRol.includes('profesor') ||
           rolNombreRol.includes('auxiliar');
  });

  // Debug: Ver todos los trabajadores
  console.log('📊 Total trabajadores:', trabajadores.length);
  console.log('👨‍🏫 Docentes filtrados:', docentes.length);
  console.log('📋 Trabajadores:', trabajadores.map(t => ({ 
    nombre: t.nombre, 
    rol: t.idRol?.nombre,
    cargo: t.cargo 
  })));
  
  // Debug: Ver todas las aulas
  console.log('🏫 Total aulas:', aulas.length);
  console.log('📋 Aulas completas:', aulas);
  console.log('📋 Primer aula detallada:', aulas[0]);
  if (aulas.length > 0) {
    console.log('🔍 Estructura de idGrado:', aulas[0]?.idGrado);
  }

  // Resetear formulario al abrir
  useEffect(() => {
    if (isOpen) {
      setFormData({
        idAula: '',
        idTrabajador: '',
        fechaAsignacion: new Date().toISOString().split('T')[0],
        estadoActivo: true
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.idAula) {
      newErrors.idAula = 'Debe seleccionar un aula';
    }

    if (!formData.idTrabajador) {
      newErrors.idTrabajador = 'Debe seleccionar un docente';
    }

    if (!formData.fechaAsignacion) {
      newErrors.fechaAsignacion = 'La fecha de asignación es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await createAsignacion(formData);
      if (refetchAsignaciones) {
        await refetchAsignaciones();
      }
      onClose();
    } catch (error) {
      console.error('Error al crear asignación:', error);
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md bg-opacity-25" />
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
                  <Dialog.Title className="text-lg font-semibold text-gray-900">
                    Asignar Docente a Aula
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
                  {/* Aula */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <School className="w-4 h-4 inline mr-2" />
                      Aula *
                    </label>
                    <select
                      name="idAula"
                      value={formData.idAula}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.idAula ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Seleccionar aula</option>
                      {aulas.map((aula) => {
                        const grado = aula.idGrado?.grado || aula.idGrado?.nombreGrado || aula.grado || 'Sin grado';
                        return (
                          <option key={aula.idAula || aula.id} value={aula.idAula || aula.id}>
                            {grado} - Sección {aula.seccion} ({aula.cantidadEstudiantes || 0} estudiantes)
                          </option>
                        );
                      })}
                    </select>
                    {errors.idAula && (
                      <p className="mt-1 text-sm text-red-600">{errors.idAula}</p>
                    )}
                    {aulas.length === 0 && (
                      <p className="mt-1 text-sm text-amber-600">
                        No hay aulas disponibles sin asignación. Primero debe crear aulas.
                      </p>
                    )}
                  </div>

                  {/* Docente */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <UserCheck className="w-4 h-4 inline mr-2" />
                      Docente *
                    </label>
                    <select
                      name="idTrabajador"
                      value={formData.idTrabajador}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.idTrabajador ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={loadingTrabajadores}
                    >
                      <option value="">Seleccionar docente</option>
                      {docentes.map((docente) => (
                        <option key={docente.idTrabajador || docente.id} value={docente.idTrabajador || docente.id}>
                          {docente.nombre} {docente.apellido} - {docente.idRol?.nombre || docente.idRol?.nombreRol || docente.cargo || 'Sin rol'}
                        </option>
                      ))}
                    </select>
                    {errors.idTrabajador && (
                      <p className="mt-1 text-sm text-red-600">{errors.idTrabajador}</p>
                    )}
                    {docentes.length === 0 && !loadingTrabajadores && (
                      <p className="mt-1 text-sm text-amber-600">
                        No hay docentes registrados. Primero debe registrar trabajadores con rol docente.
                      </p>
                    )}
                  </div>

                  {/* Fecha Asignación */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Fecha de Asignación *
                    </label>
                    <input
                      type="date"
                      name="fechaAsignacion"
                      value={formData.fechaAsignacion}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.fechaAsignacion ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.fechaAsignacion && (
                      <p className="mt-1 text-sm text-red-600">{errors.fechaAsignacion}</p>
                    )}
                  </div>

                  {/* Estado Activo */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="estadoActivo"
                      checked={formData.estadoActivo}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Asignación activa
                    </label>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isCreatingAsignacion}
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCreatingAsignacion ? 'Asignando...' : 'Asignar Docente'}
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

export default ModalAsignarDocente;
