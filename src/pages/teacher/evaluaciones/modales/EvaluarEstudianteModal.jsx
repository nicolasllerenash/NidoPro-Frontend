import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, UserCheck, Users, Award, FileText, Save, Bug, Eye } from 'lucide-react';
import { toast } from 'sonner';
import VerEstudiantesEvaluadosModal from './VerEstudiantesEvaluadosModal';

// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api/v1';

// Función de debug para la consola
window.debugAuthStorage = () => {
  const authStorage = localStorage.getItem('auth-storage');
  if (authStorage) {
    const data = JSON.parse(authStorage);
    console.log('=== DEBUG AUTH STORAGE ===');
    console.log('Raw authStorage:', authStorage);
    console.log('Parsed data:', data);
    console.log('Token exists:', !!data.state?.token);
    console.log('User ID:', data.state?.user?.id);
    console.log('Entidad ID (correcto):', data.state?.user?.entidadId);
    console.log('Entidad ID (incorrecto - no existe):', data.state?.entidadId);
    console.log('User Entidad ID:', data.state?.user?.entidadId);
    console.log('Full user object:', data.state?.user);
    return data;
  } else {
    console.log('No auth-storage found in localStorage');
    return null;
  }
};

// Función para probar la API directamente
window.testAulasAPI = async () => {
  const data = window.debugAuthStorage();
  if (!data) return;

  const token = data.state?.token;
  const entidadId = data.state?.user?.entidadId;

  if (!token || !entidadId) {
    console.error('Faltan token o entidadId');
    return;
  }

  console.log('Probando API con entidadId:', entidadId);

  try {
    const response = await fetch(`${API_BASE_URL}/trabajador/aulas/${entidadId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });


    if (response.ok) {
      const result = await response.json();
      console.log('API Response:', result);
      return result;
    } else {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      return { error: errorText };
    }
  } catch (error) {
    console.error('Network error:', error);
    return { error: error.message };
  }
};

const EvaluarEstudianteModal = ({ isOpen, onClose, evaluacion }) => {
  const [formData, setFormData] = useState({
    calificacion: 'A',
    observaciones: '',
    idEvaluacion: '',
    idEstudiante: ''
  });
  const [estudiantes, setEstudiantes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEstudiantes, setIsLoadingEstudiantes] = useState(false);
  const [estudiantesEvaluados, setEstudiantesEvaluados] = useState(new Set());
  const [libretaCalificaciones, setLibretaCalificaciones] = useState([]);
  const [showEvaluadosModal, setShowEvaluadosModal] = useState(false);
  const [currentIdAula, setCurrentIdAula] = useState(null);
  const [errors, setErrors] = useState({});

  // Obtener aula del profesor
  const fetchAulaTrabajador = async () => {
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (!authStorage) {
        console.error('No se encontró auth-storage en localStorage');
        toast.error('No se encontró información de autenticación');
        return null;
      }

      const authData = JSON.parse(authStorage);
      console.log('Auth data:', authData);

      const token = authData.state?.token;
      const entidadId = authData.state?.user?.entidadId;

      console.log('Token:', token ? 'Presente' : 'Ausente');
      console.log('EntidadId:', entidadId);

      if (!token) {
        console.error('No se encontró token');
        toast.error('No se encontró token de autenticación');
        return null;
      }

      if (!entidadId) {
        console.error('No se encontró entidadId');
        toast.error('No se encontró ID de entidad');
        return null;
      }

      const userId = entidadId; // Usar directamente el entidadId
      console.log('UserId a usar (entidadId):', userId);

      // Usar el entidadId directamente
      const endpoint = `${API_BASE_URL}/trabajador/aulas/${userId}`;
      console.log('Endpoint:', endpoint);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });


      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Error al obtener aulas del trabajador');
      }

      const data = await response.json();
      console.log('API Response:', data);

      // Si aún no funciona, mostrar información de debug
      if (!data.success || !data.aulas || data.aulas.length === 0) {
        return null;
      }

      // Extraer el id_aula de la primera aula asignada
      const primeraAula = data.aulas[0];
      const idAula = primeraAula.id_aula;
      console.log('Aula encontrada:', primeraAula);
      console.log('ID del aula a retornar:', idAula);

      // Guardar el idAula para el modal de estudiantes evaluados
      setCurrentIdAula(idAula);

      return idAula;
    } catch (error) {
      console.error('Error en fetchAulaTrabajador:', error);
      toast.error('Error al cargar información del aula');
      return null;
    }
  };

  // Obtener estudiantes del aula
  const fetchEstudiantesAula = async (idAula) => {
    if (!idAula) {
      console.error('No se recibió idAula');
      return;
    }

    console.log('Obteniendo estudiantes del aula:', idAula);
    setIsLoadingEstudiantes(true);
    try {
      const token = localStorage.getItem('auth-storage')
        ? JSON.parse(localStorage.getItem('auth-storage')).state?.token
        : null;

      if (!token) {
        console.error('No se encontró token para estudiantes');
        toast.error('No se encontró token de autenticación');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/estudiante/aula/${idAula}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response estudiantes status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response estudiantes:', errorText);
        throw new Error('Error al obtener estudiantes');
      }

      const data = await response.json();
      console.log('API Response estudiantes:', data);

      if (data.success) {
        console.log('Estudiantes obtenidos:', data.estudiantes || []);
        setEstudiantes(data.estudiantes || []);
      } else {
        console.error('Error en respuesta estudiantes:', data.message);
        toast.error(data.message || 'Error al obtener estudiantes');
      }
    } catch (error) {
      console.error('Error en fetchEstudiantesAula:', error);
      toast.error('Error al cargar estudiantes');
    } finally {
      setIsLoadingEstudiantes(false);
    }
  };

  // Obtener libreta de calificaciones del aula
  const fetchLibretaCalificaciones = async (idAula) => {
    if (!idAula) {
      console.error('No se recibió idAula para libreta');
      return;
    }

    console.log('Obteniendo libreta de calificaciones del aula:', idAula);
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
        // Extraer IDs de estudiantes que ya tienen calificaciones
        const estudiantesConCalificaciones = new Set();
        const libretasCompletas = [];

        data.info.data.libretas.forEach((libreta) => {
          if (libreta.estudiante && libreta.estudiante.idEstudiante) {
            estudiantesConCalificaciones.add(libreta.estudiante.idEstudiante);
            libretasCompletas.push({
              estudiante: libreta.estudiante,
              libreta: libreta.libreta
            });
          }
        });

        console.log('Estudiantes ya evaluados:', Array.from(estudiantesConCalificaciones));
        console.log('Libretas completas:', libretasCompletas);

        setEstudiantesEvaluados(estudiantesConCalificaciones);
        setLibretaCalificaciones(libretasCompletas);

        // Mostrar estadísticas
        const stats = data.info.data.aula;
        console.log(`Estadísticas: ${stats.estudiantesConCalificaciones}/${stats.totalEstudiantes} estudiantes evaluados`);
      }
    } catch (error) {
      console.error('Error en fetchLibretaCalificaciones:', error);
    }
  };

  // Resetear formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen && evaluacion) {
      console.log('Abriendo modal de evaluación para:', evaluacion);
      setFormData({
        calificacion: 'A',
        observaciones: '',
        idEvaluacion: evaluacion.idEvaluacion || '',
        idEstudiante: ''
      });
      setErrors({});
      setEstudiantes([]);
      setEstudiantesEvaluados(new Set());
      setLibretaCalificaciones([]);

      // Obtener aula y estudiantes
      const loadData = async () => {
        console.log('Iniciando carga de datos...');
        const idAula = await fetchAulaTrabajador();
        if (idAula) {
          await fetchEstudiantesAula(idAula);
          await fetchLibretaCalificaciones(idAula);
        } else {
          console.error('No se pudo obtener idAula');
        }
      };

      loadData();
    }
  }, [isOpen, evaluacion]);

  // Función para manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Función para validar el formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.idEstudiante) {
      newErrors.idEstudiante = 'Debe seleccionar un estudiante';
    }

    if (!formData.calificacion) {
      newErrors.calificacion = 'La calificación es requerida';
    }

    if (!formData.observaciones.trim()) {
      newErrors.observaciones = 'Las observaciones son requeridas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor, complete todos los campos requeridos');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('auth-storage')
        ? JSON.parse(localStorage.getItem('auth-storage')).state?.token
        : null;

      if (!token) {
        toast.error('No se encontró token de autenticación');
        return;
      }

      // Preparar los datos para enviar
      const dataToSend = {
        calificacion: formData.calificacion,
        observaciones: formData.observaciones.trim(),
        idEvaluacion: formData.idEvaluacion,
        idEstudiante: formData.idEstudiante
      };

      const response = await fetch('http://localhost:3002/api/v1/nota/kinder', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar la evaluación del estudiante');
      }

      const data = await response.json();

      if (data.success) {
        toast.success('Evaluación del estudiante guardada correctamente');
        onClose();
      } else {
        toast.error(data.message || 'Error al guardar la evaluación del estudiante');
      }
    } catch (error) {
      console.error('Error saving evaluacion estudiante:', error);
      toast.error(error.message || 'Error al guardar la evaluación del estudiante');
    } finally {
      setIsSubmitting(false);
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
              <Dialog.Panel className="w-full max-w-md mx-4 sm:mx-auto transform overflow-hidden rounded-2xl bg-white p-4 sm:p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-base sm:text-lg font-medium leading-6 text-gray-900 flex items-center justify-between"
                >
                  <span className="flex items-center">
                    <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                    <span className="text-sm sm:text-base">Evaluar Estudiante</span>
                  </span>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-600 p-1"
                      onClick={onClose}
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="space-y-4">
                    {/* Estadísticas de evaluación */}
                    {estudiantes.length > 0 && (
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-blue-600 mr-2" />
                            <span className="text-sm font-medium text-blue-700">
                              Estudiantes evaluados: {estudiantesEvaluados.size} de {estudiantes.length}
                            </span>
                          </div>
                          <div className="text-xs text-blue-600">
                            {estudiantesEvaluados.size === estudiantes.length ? '✅ Todos evaluados' : '⏳ Pendientes por evaluar'}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Información de la evaluación */}
                    {evaluacion && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Evaluación:</h4>
                        <p className="text-sm text-gray-600">{evaluacion.descripcion}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Tipo: {evaluacion.tipoEvaluacion} | Fecha: {new Date(evaluacion.fecha).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    )}

                    {/* Botón para ver estudiantes evaluados */}
                    {estudiantesEvaluados.size > 0 && (
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <button
                          onClick={() => setShowEvaluadosModal(true)}
                          className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver {estudiantesEvaluados.size} estudiante{estudiantesEvaluados.size !== 1 ? 's' : ''} ya evaluado{estudiantesEvaluados.size !== 1 ? 's' : ''}
                        </button>
                      </div>
                    )}

                    {/* Estudiante */}
                    <div>
                      <label htmlFor="idEstudiante" className="block text-sm font-medium text-gray-700 mb-1">
                        Estudiante *
                      </label>
                      <div className="relative">
                        <select
                          id="idEstudiante"
                          name="idEstudiante"
                          value={formData.idEstudiante}
                          onChange={handleInputChange}
                          disabled={isLoadingEstudiantes}
                          className={`w-full pl-3 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                            errors.idEstudiante ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">
                            {isLoadingEstudiantes ? 'Cargando estudiantes...' : 'Seleccionar estudiante...'}
                          </option>
                          {estudiantes.map((estudiante) => {
                            const yaEvaluado = estudiantesEvaluados.has(estudiante.idEstudiante);
                            return (
                              <option key={estudiante.idEstudiante} value={estudiante.idEstudiante}>
                                {estudiante.nombre} {estudiante.apellido} {yaEvaluado ? '✓ (Ya evaluado)' : ''}
                              </option>
                            );
                          })}
                        </select>
                        <Users className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.idEstudiante && (
                        <p className="mt-1 text-sm text-red-600">{errors.idEstudiante}</p>
                      )}
                    </div>

                    {/* Calificación */}
                    <div>
                      <label htmlFor="calificacion" className="block text-sm font-medium text-gray-700 mb-1">
                        Calificación *
                      </label>
                      <div className="relative">
                        <select
                          id="calificacion"
                          name="calificacion"
                          value={formData.calificacion}
                          onChange={handleInputChange}
                          className={`w-full pl-3 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                            errors.calificacion ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="A">A - Excelente</option>
                          <option value="B">B - Bueno</option>
                          <option value="C">C - Regular</option>
                          <option value="D">D - Deficiente</option>
                          <option value="F">F - Insuficiente</option>
                        </select>
                        <Award className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.calificacion && (
                        <p className="mt-1 text-sm text-red-600">{errors.calificacion}</p>
                      )}
                    </div>

                    {/* Observaciones */}
                    <div>
                      <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-1">
                        Observaciones *
                      </label>
                      <textarea
                        id="observaciones"
                        name="observaciones"
                        value={formData.observaciones}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          errors.observaciones ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Escribe tus observaciones sobre el desempeño del estudiante..."
                      />
                      {errors.observaciones && (
                        <p className="mt-1 text-sm text-red-600">{errors.observaciones}</p>
                      )}
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isLoadingEstudiantes}
                      className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Evaluar Estudiante
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

      {/* Modal para ver estudiantes evaluados */}
      <VerEstudiantesEvaluadosModal
        isOpen={showEvaluadosModal}
        onClose={() => setShowEvaluadosModal(false)}
        idAula={currentIdAula}
        evaluacion={evaluacion}
      />
    </Transition>
  );
};

export default EvaluarEstudianteModal;