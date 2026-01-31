import React, { useState, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Loader2, CheckCircle, X, ChevronDown, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useAulasSimple } from '../../../../hooks/useAulas';
import { useGradosOptions } from '../../../../hooks/useGrados';
import { trabajadorService } from '../../../../services/trabajadorService';

const ModalAgregarAula = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    idGrado: '',
    seccion: '',
    cantidadEstudiantes: '',
    idTutor: ''
  });
  const [loading, setLoading] = useState(false);
  const { crearAula } = useAulasSimple();
  const { options: gradosOptions, isLoading: loadingGrados, hasGrados } = useGradosOptions();

  // Estado para buscador de tutores
  const [docentes, setDocentes] = useState([]);
  const [loadingDocentes, setLoadingDocentes] = useState(false);
  const [searchTutor, setSearchTutor] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [tutorSeleccionado, setTutorSeleccionado] = useState(null);
  const dropdownRef = useRef(null);

  // Cargar docentes al abrir el modal
  useEffect(() => {
    if (isOpen) {
      const fetchDocentes = async () => {
        setLoadingDocentes(true);
        try {
          const data = await trabajadorService.getDocentes();
          setDocentes(data);
        } catch (error) {
          console.error('Error al cargar docentes:', error);
        } finally {
          setLoadingDocentes(false);
        }
      };
      fetchDocentes();
    }
  }, [isOpen]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtrar docentes por búsqueda
  const docentesFiltrados = docentes.filter((doc) => {
    const nombre = `${doc.nombre || ''} ${doc.apellido || ''}`.toLowerCase();
    return nombre.includes(searchTutor.toLowerCase());
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectTutor = (docente) => {
    setForm((prev) => ({ ...prev, idTutor: docente.idTrabajador }));
    setTutorSeleccionado(docente);
    setSearchTutor(`${docente.nombre} ${docente.apellido}`);
    setShowDropdown(false);
  };

  const handleClearTutor = () => {
    setForm((prev) => ({ ...prev, idTutor: '' }));
    setTutorSeleccionado(null);
    setSearchTutor('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.idGrado) {
      toast.error('Debe seleccionar un grado');
      return;
    }
    if (!form.seccion.trim()) {
      toast.error('La sección es requerida');
      return;
    }
    if (!form.cantidadEstudiantes || Number(form.cantidadEstudiantes) < 0) {
      toast.error('La cantidad de estudiantes debe ser un número válido');
      return;
    }
    if (!form.idTutor) {
      toast.error('Debe seleccionar un tutor');
      return;
    }

    setLoading(true);
    try {
      await crearAula({
        idGrado: form.idGrado,
        seccion: form.seccion.trim(),
        cantidadEstudiantes: Number(form.cantidadEstudiantes),
        idTutor: form.idTutor
      });
      handleClose();
    } catch (error) {
      // El error ya se maneja en el hook
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setForm({ idGrado: '', seccion: '', cantidadEstudiantes: '', idTutor: '' });
      setSearchTutor('');
      setTutorSeleccionado(null);
      setShowDropdown(false);
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                    Crear Nueva Aula
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    disabled={loading}
                    className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Grado */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grado *
                    </label>
                    <div className="relative">
                      <select
                        name="idGrado"
                        value={form.idGrado}
                        onChange={handleChange}
                        required
                        disabled={loading || loadingGrados}
                        className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 appearance-none bg-white"
                      >
                        <option value="">
                          {loadingGrados ? 'Cargando grados...' : 'Seleccione un grado'}
                        </option>
                        {gradosOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    {!hasGrados && !loadingGrados && (
                      <p className="text-xs text-amber-600 mt-1">
                        No hay grados disponibles. Primero debe crear grados.
                      </p>
                    )}
                  </div>

                  {/* Sección y Cantidad */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sección *
                      </label>
                      <input
                        type="text"
                        name="seccion"
                        value={form.seccion}
                        onChange={handleChange}
                        placeholder="Ej: A, B, C"
                        required
                        disabled={loading}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cantidad de Estudiantes *
                      </label>
                      <input
                        type="number"
                        name="cantidadEstudiantes"
                        value={form.cantidadEstudiantes}
                        onChange={handleChange}
                        min="0"
                        placeholder="0"
                        required
                        disabled={loading}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Tutor con buscador */}
                  <div ref={dropdownRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tutor *
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchTutor}
                        onChange={(e) => {
                          setSearchTutor(e.target.value);
                          setShowDropdown(true);
                          if (tutorSeleccionado) {
                            handleClearTutor();
                          }
                        }}
                        onFocus={() => setShowDropdown(true)}
                        placeholder={loadingDocentes ? 'Cargando docentes...' : 'Buscar tutor por nombre...'}
                        disabled={loading || loadingDocentes}
                        className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                      />
                      {tutorSeleccionado && (
                        <button
                          type="button"
                          onClick={handleClearTutor}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Dropdown de resultados */}
                    {showDropdown && !tutorSeleccionado && (
                      <div className="mt-1 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                        {docentesFiltrados.length === 0 ? (
                          <div className="px-4 py-3 text-sm text-gray-500">
                            No se encontraron docentes
                          </div>
                        ) : (
                          docentesFiltrados.map((docente) => (
                            <button
                              key={docente.idTrabajador}
                              type="button"
                              onClick={() => handleSelectTutor(docente)}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium text-gray-900">
                                {docente.nombre} {docente.apellido}
                              </div>
                              {docente.correo && (
                                <div className="text-xs text-gray-500">{docente.correo}</div>
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Botones */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={loading}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !form.idGrado || !form.seccion || !form.cantidadEstudiantes || !form.idTutor}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Crear Aula
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

export default ModalAgregarAula;
