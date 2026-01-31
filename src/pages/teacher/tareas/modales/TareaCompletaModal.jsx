import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  X,
  CheckCircle,
  Clock,
  Users,
  PaperclipIcon,
  FileText,
  AlertCircle,
  Download,
  Eye,
  Calendar,
  Target,
  Loader2,
  GraduationCap,
  Mail,
  ExternalLink,
  User,
  BookOpen,
  Star,
  MessageSquare,
  Upload,
  Edit
} from 'lucide-react';
import { toast } from 'sonner';
import tareaService from '../../../../services/tareaService';

const TareaCompletaModal = ({ isOpen, onClose, tarea }) => {
  const [activeTab, setActiveTab] = useState('detalles');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [entregasRealizadas, setEntregasRealizadas] = useState([]);
  const [entregasPendientes, setEntregasPendientes] = useState([]);

  // Debug: mostrar qué datos llegan
  useEffect(() => {
    if (tarea) {
      console.log('📋 Datos de la tarea en el modal:', tarea);
      console.log('📎 Archivo URL:', tarea.archivoUrl);
      console.log('📎 Archivo URL (alternativo):', tarea.archivo_url);
      console.log('📎 Archivo URL (fileUrl):', tarea.fileUrl);
    }
  }, [tarea]);

  const handleClose = () => {
    setActiveTab('detalles');
    setEntregasRealizadas([]);
    setEntregasPendientes([]);
    setError(null);
    setLoading(false);
    onClose();
  };

  // Función para formatear fechas
  const formatFecha = (fecha) => {
    if (!fecha) return 'No especificada';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para abrir archivo
  const abrirArchivo = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  // Función para descargar archivo
  const descargarArchivo = (url, nombre) => {
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = nombre || 'archivo';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Cargar entregas cuando se abre el modal
  useEffect(() => {
    if (isOpen && tarea) {
      cargarEntregas();
    } else if (!isOpen) {
      // Limpiar datos cuando se cierra el modal
      setEntregasRealizadas([]);
      setEntregasPendientes([]);
      setError(null);
      setActiveTab('detalles');
      setLoading(false);
    }
  }, [isOpen, tarea]);

  const cargarEntregas = async () => {
    if (!tarea) return;

    setLoading(true);
    setError(null);
    try {
      console.log('🔍 Cargando entregas para tarea:', tarea.idTarea);

      // Usar las entregas que ya vienen transformadas en la tarea
      // El hook useTareasTrabajador ya transforma tareaEntregas a entregas
      const entregasData = tarea.entregas || tarea.tareaEntregas || [];
      console.log('📋 Entregas obtenidas de la tarea:', entregasData);

      // Si no hay entregas en la tarea, intentar obtenerlas del servicio
      if (!entregasData.length && tarea.idTarea) {
        console.log('🔄 No hay entregas en la tarea, intentando obtener del servicio...');
        try {
          const response = await tareaService.obtenerEntregasPorTarea(tarea.idTarea);
          console.log('📋 Respuesta completa del servicio:', response);

          // Manejar diferentes formatos de respuesta
          let entregasServicio = [];

          if (Array.isArray(response)) {
            entregasServicio = response;
          } else if (response?.data && Array.isArray(response.data)) {
            entregasServicio = response.data;
          } else if (response?.data?.entregas && Array.isArray(response.data.entregas)) {
            entregasServicio = response.data.entregas;
          } else if (response?.entregas && Array.isArray(response.entregas)) {
            entregasServicio = response.entregas;
          } else if (response?.info?.data && Array.isArray(response.info.data)) {
            entregasServicio = response.info.data;
          } else {
            console.warn('⚠️ Formato de respuesta no reconocido:', response);
            entregasServicio = [];
          }

          console.log('📋 Entregas obtenidas del servicio (procesadas):', entregasServicio);

          // Verificar que sea un array antes de filtrar
          if (!Array.isArray(entregasServicio)) {
            console.error('❌ Las entregas no son un array:', entregasServicio);
            throw new Error('El formato de las entregas no es válido');
          }

          // Transformar entregas del servicio al formato esperado
          const entregasTransformadas = entregasServicio.map(entrega => ({
            idTareaEntrega: entrega.idTareaEntrega,
            idEstudiante: entrega.idEstudiante,
            fechaEntrega: entrega.fechaEntrega,
            archivoUrl: entrega.archivoUrl,
            estado: entrega.estado,
            realizoTarea: entrega.realizoTarea,
            observaciones: entrega.observaciones,
            estudiante: {
              idEstudiante: entrega.idEstudiante2?.idEstudiante || entrega.idEstudiante,
              nombre: entrega.idEstudiante2?.nombre || entrega.estudiante?.nombre,
              apellido: entrega.idEstudiante2?.apellido || entrega.estudiante?.apellido,
              nroDocumento: entrega.idEstudiante2?.nroDocumento || entrega.estudiante?.nroDocumento,
              imagen: entrega.idEstudiante2?.imagen_estudiante || entrega.estudiante?.imagen
            }
          }));

          // Filtrar entregas
          const realizadas = entregasTransformadas.filter(entrega =>
            entrega.realizoTarea === true || entrega.estado === 'entregado'
          );
          const pendientes = entregasTransformadas.filter(entrega =>
            entrega.realizoTarea === false && entrega.estado !== 'entregado'
          );

          setEntregasRealizadas(realizadas);
          setEntregasPendientes(pendientes);
        } catch (serviceError) {
          console.warn('⚠️ Error al obtener entregas del servicio:', serviceError);
          setError(serviceError.message || 'Error al cargar las entregas');
          setEntregasRealizadas([]);
          setEntregasPendientes([]);
        }
      } else {
        // Usar las entregas que ya vienen transformadas en la tarea
        const realizadas = entregasData.filter(entrega =>
          entrega.realizoTarea === true || entrega.estado === 'entregado'
        );
        const pendientes = entregasData.filter(entrega =>
          entrega.realizoTarea === false && entrega.estado !== 'entregado'
        );

        setEntregasRealizadas(realizadas);
        setEntregasPendientes(pendientes);
      }
    } catch (error) {
      console.error('Error al procesar entregas:', error);
      setError(error.message || 'Error al procesar las entregas de la tarea');
      toast.error('Error al procesar las entregas de la tarea');
      setEntregasRealizadas([]);
      setEntregasPendientes([]);
    } finally {
      setLoading(false);
    }
  };

  // Estadísticas
  const totalEstudiantes = entregasRealizadas.length + entregasPendientes.length;
  const totalEntregadas = entregasRealizadas.length;
  const totalPendientes = entregasPendientes.length;
  const porcentajeEntrega = totalEstudiantes > 0 ? Math.round((totalEntregadas / totalEstudiantes) * 100) : 0;

  // Debug logs (solo si el modal está abierto)
  if (isOpen && (entregasRealizadas.length > 0 || entregasPendientes.length > 0)) {
    console.log('🔍 Debug entregas:', {
      total: totalEstudiantes,
      entregasRealizadas: totalEntregadas,
      entregasPendientes: totalPendientes,
      entregas: [...entregasRealizadas, ...entregasPendientes].map(e => ({
        id: e.idTareaEntrega,
        realizoTarea: e.realizoTarea,
        estado: e.estado,
        nombre: e.idEstudiante?.nombre || e.idEstudiante2?.nombre
      }))
    });
  }

  const tabs = [
    { id: 'detalles', label: 'Detalles', icon: FileText },
    { id: 'entregadas', label: 'Entregadas', icon: CheckCircle },
    { id: 'pendientes', label: 'Pendientes', icon: Clock },
    { id: 'info', label: 'Información', icon: AlertCircle }
  ];

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
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm bg-opacity-25" />
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Dialog.Title as="h3" className="text-lg font-semibold text-white mb-2">
                        {tarea?.titulo || 'Detalles de la Tarea'}
                      </Dialog.Title>
                      <div className="flex flex-wrap items-center gap-4 text-green-100">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{tarea?.aulaInfo?.grado || tarea?.aula?.idGrado?.grado || 'Sin grado'} - {tarea?.aulaInfo?.seccion || tarea?.aula?.seccion || 'Sin sección'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Vence: {formatFecha(tarea?.fechaEntrega || tarea?.fechaLimite)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Target className="w-4 h-4" />
                          <span>{totalEntregadas}/{totalEstudiantes} entregas ({porcentajeEntrega}%)</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleClose}
                      className="text-white hover:bg-green-600 hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6" aria-label="Tabs">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      const count = tab.id === 'entregadas' ? totalEntregadas : tab.id === 'pendientes' ? totalPendientes : null;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                            activeTab === tab.id
                              ? 'border-green-500 text-green-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{tab.label}{count !== null ? ` (${count})` : ''}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Content */}
                <div className="px-6 py-6 max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Cargando entregas...</h3>
                      <p className="text-gray-600">Obteniendo información de las entregas de la tarea</p>
                    </div>
                  ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar entregas</h3>
                      <p className="text-gray-600 text-center mb-4">{error}</p>
                      <button
                        onClick={cargarEntregas}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Reintentar
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Estadísticas */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center">
                            <Users className="w-8 h-8 text-blue-600 mr-3" />
                            <div>
                              <p className="text-blue-800 font-semibold text-lg">{totalEstudiantes}</p>
                              <p className="text-blue-600 text-sm">Total estudiantes</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center">
                            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                            <div>
                              <p className="text-green-800 font-semibold text-lg">{totalEntregadas}</p>
                              <p className="text-green-600 text-sm">Entregadas</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="flex items-center">
                            <Clock className="w-8 h-8 text-yellow-600 mr-3" />
                            <div>
                              <p className="text-yellow-800 font-semibold text-lg">{totalPendientes}</p>
                              <p className="text-yellow-600 text-sm">Pendientes</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <div className="flex items-center">
                            <Target className="w-8 h-8 text-purple-600 mr-3" />
                            <div>
                              <p className="text-purple-800 font-semibold text-lg">{porcentajeEntrega}%</p>
                              <p className="text-purple-600 text-sm">Completado</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {activeTab === 'detalles' && (
                    <div className="space-y-6">
                      {/* Información básica */}
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Información de la Tarea</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-500">Título</label>
                              <p className="mt-1 text-sm text-gray-900 font-medium">
                                {tarea?.titulo || 'No especificado'}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Descripción</label>
                              <p className="mt-1 text-sm text-gray-900">
                                {tarea?.descripcion || 'Sin descripción'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Archivo adjunto */}
                      {(tarea?.archivoUrl || tarea?.archivo_url || tarea?.fileUrl) && (
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 mb-4">Archivo Adjunto</h4>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Archivo de la tarea</p>
                                  <p className="text-xs text-gray-600">Archivo adjunto por el profesor</p>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => abrirArchivo(tarea.archivoUrl || tarea.archivo_url || tarea.fileUrl)}
                                  className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-xs"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>Ver</span>
                                </button>
                                <button
                                  onClick={() => descargarArchivo(tarea.archivoUrl || tarea.archivo_url || tarea.fileUrl, `tarea_${tarea.titulo}`)}
                                  className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-xs"
                                >
                                  <Download className="w-3 h-3" />
                                  <span>Descargar</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Estadísticas */}
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Estadísticas</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <p className="text-lg font-semibold text-green-900">{totalEntregadas}</p>
                                <p className="text-xs text-green-600">Entregadas</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                                <Clock className="w-4 h-4 text-yellow-600" />
                              </div>
                              <div>
                                <p className="text-lg font-semibold text-yellow-900">{totalPendientes}</p>
                                <p className="text-xs text-yellow-600">Pendientes</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <Users className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-lg font-semibold text-blue-900">{totalEstudiantes}</p>
                                <p className="text-xs text-blue-600">Total Estudiantes</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'entregadas' && (
                    <div className="space-y-4">
                      {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Cargando entregas...</h3>
                          <p className="text-gray-600">Obteniendo información de las entregas realizadas</p>
                        </div>
                      ) : entregasRealizadas.length > 0 ? (
                        <div className="grid gap-4">
                          {entregasRealizadas.map((entrega) => (
                            <div key={entrega.idTareaEntrega} className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-green-600 font-semibold text-sm">
                                      {entrega.estudiante?.nombre?.charAt(0)}{entrega.estudiante?.apellido?.charAt(0)}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {entrega.estudiante?.nombre} {entrega.estudiante?.apellido}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      DNI: {entrega.estudiante?.nroDocumento}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center text-green-600 mb-1">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    <span className="text-sm font-medium">Entregada</span>
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    {formatFecha(entrega.fechaEntrega)}
                                  </p>
                                </div>
                              </div>

                              {entrega.archivoUrl && (
                                <div className="mt-3 flex items-center justify-between bg-white rounded-lg p-3 border">
                                  <div className="flex items-center text-sm text-gray-600">
                                    <PaperclipIcon className="w-4 h-4 mr-2" />
                                    <span>Archivo adjunto</span>
                                  </div>
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => abrirArchivo(entrega.archivoUrl)}
                                      className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-xs"
                                    >
                                      <Eye className="w-3 h-3" />
                                      <span>Ver</span>
                                    </button>
                                    <button
                                      onClick={() => descargarArchivo(entrega.archivoUrl, `entrega_${entrega.estudiante?.nombre}_${entrega.estudiante?.apellido}`)}
                                      className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-xs"
                                    >
                                      <Download className="w-3 h-3" />
                                      <span>Descargar</span>
                                    </button>
                                  </div>
                                </div>
                              )}

                              {entrega.observaciones && (
                                <div className="mt-3 p-3 bg-white rounded-lg border">
                                  <p className="text-sm font-medium text-gray-700 mb-1">Observaciones:</p>
                                  <p className="text-sm text-gray-600">{entrega.observaciones}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay entregas realizadas</h3>
                          <p className="text-gray-500">Aún ningún estudiante ha entregado esta tarea</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'pendientes' && (
                    <div className="space-y-4">
                      {entregasPendientes.length > 0 ? (
                        <div className="grid gap-4">
                          {entregasPendientes.map((entrega) => (
                            <div key={entrega.idTareaEntrega} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <span className="text-yellow-600 font-semibold text-sm">
                                      {entrega.estudiante?.nombre?.charAt(0)}{entrega.estudiante?.apellido?.charAt(0)}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {entrega.estudiante?.nombre} {entrega.estudiante?.apellido}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      DNI: {entrega.estudiante?.nroDocumento}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center text-yellow-600 mb-1">
                                    <Clock className="w-4 h-4 mr-1" />
                                    <span className="text-sm font-medium">Pendiente</span>
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    Vence: {formatFecha(tarea?.fechaEntrega || tarea?.fechaLimite)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">¡Excelente!</h3>
                          <p className="text-gray-500">Todos los estudiantes han entregado la tarea</p>
                        </div>
                      )}
                    </div>
                  )}

                      {activeTab === 'info' && (
                        <div className="space-y-6">
                          {/* Información del profesor */}
                          <div>
                            <h4 className="text-lg font-medium text-gray-900 mb-4">Información del Profesor</h4>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Nombre</label>
                                  <p className="mt-1 text-sm text-gray-900">
                                    {tarea.trabajadorInfo?.nombre || `${tarea.idTrabajador?.nombre || ''} ${tarea.idTrabajador?.apellido || ''}`.trim() || 'No especificado'}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Correo</label>
                                  <p className="mt-1 text-sm text-gray-900">
                                    {tarea.trabajadorInfo?.correo || tarea.idTrabajador?.correo || 'No especificado'}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Rol</label>
                                  <p className="mt-1 text-sm text-gray-900">
                                    {tarea.trabajadorInfo?.rol || tarea.idTrabajador?.idRol?.nombre || 'No especificado'}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Documento</label>
                                  <p className="mt-1 text-sm text-gray-900">
                                    {tarea.idTrabajador?.tipoDocumento}: {tarea.idTrabajador?.nroDocumento || 'No especificado'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Información del aula */}
                          <div>
                            <h4 className="text-lg font-medium text-gray-900 mb-4">Información del Aula</h4>
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Grado</label>
                                  <p className="mt-1 text-sm text-gray-900">
                                    {tarea.aulaInfo?.grado || tarea.aula?.idGrado?.grado || 'No especificado'}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Sección</label>
                                  <p className="mt-1 text-sm text-gray-900">
                                    {tarea.aulaInfo?.seccion || tarea.aula?.seccion || 'No especificado'}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Cantidad de Estudiantes</label>
                                  <p className="mt-1 text-sm text-gray-900">
                                    {tarea.aulaInfo?.cantidadEstudiantes || tarea.aula?.cantidadEstudiantes || 0} estudiantes
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">ID del Aula</label>
                                  <p className="mt-1 text-xs text-gray-900 font-mono">
                                    {tarea.aulaInfo?.idAula || tarea.aula?.idAula || 'No especificado'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Información técnica de la tarea */}
                          <div>
                            <h4 className="text-lg font-medium text-gray-900 mb-4">Información Técnica</h4>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-500">ID de la Tarea</label>
                                  <p className="mt-1 text-xs text-gray-900 font-mono">
                                    {tarea.idTarea}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Estado Actual</label>
                                  <p className="mt-1 text-sm text-gray-900">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      tarea.estado === 'activa' ? 'bg-green-100 text-green-800' :
                                      tarea.estado === 'vencida' ? 'bg-red-100 text-red-800' :
                                      tarea.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {tarea.estado || 'No especificado'}
                                    </span>
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Fecha de Asignación</label>
                                  <p className="mt-1 text-sm text-gray-900">
                                    {formatFecha(tarea.fechaAsignacion)}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Fecha de Entrega</label>
                                  <p className="mt-1 text-sm text-gray-900">
                                    {formatFecha(tarea.fechaEntrega)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TareaCompletaModal;
