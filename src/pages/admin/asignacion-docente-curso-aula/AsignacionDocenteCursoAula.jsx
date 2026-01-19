import React, { useState } from 'react';
import { BookOpen, Users, GraduationCap, Plus } from 'lucide-react';
import { useAsignacionesDocenteCursoAula } from '../../../hooks/queries/useAsignacionDocenteCursoAulaQueries';
import { useAulas } from '../../../hooks/useAulas';
import TablaAsignacionDocenteCursoAula from './tablas/TablaAsignacionDocenteCursoAula';
import ModalAgregarAsignacion from './modales/ModalAgregarAsignacion';
import ModalEditarAsignacion from './modales/ModalEditarAsignacion';
import ModalEliminarAsignacion from './modales/ModalEliminarAsignacion';

const AsignacionDocenteCursoAula = () => {
  // Hook para obtener las asignaciones
  const {
    data: asignacionesData,
    isLoading: loading,
    error,
    refetch: refreshAsignaciones
  } = useAsignacionesDocenteCursoAula();

  // Hook para obtener aulas con sus grados
  const { aulas = [] } = useAulas();

  // Extraer el array de asignaciones
  const asignaciones = Array.isArray(asignacionesData) ? asignacionesData :
                       asignacionesData?.asignaciones ? asignacionesData.asignaciones :
                       asignacionesData?.data ? asignacionesData.data : [];

  // Calcular estadísticas
  const statistics = {
    total: asignaciones.length,
    activas: asignaciones.filter(a => a.estaActivo).length,
    docentes: new Set(asignaciones.map(a => a.idTrabajador?.idTrabajador)).size,
    cursos: new Set(asignaciones.map(a => a.idCurso?.idCurso)).size
  };

  // Estados para modales
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAsignacion, setSelectedAsignacion] = useState(null);

  // Handlers
  const handleAdd = () => {
    setShowModal(true);
  };

  const handleEdit = (asignacion) => {
    setSelectedAsignacion(asignacion);
    setShowEditModal(true);
  };

  const handleDelete = (asignacion) => {
    setSelectedAsignacion(asignacion);
    setShowDeleteModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <BookOpen className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Asignación Docente-Curso-Aula</h1>
              <p className="text-gray-600">Gestiona qué docentes enseñan qué cursos en cada aula</p>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Asignaciones</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Docentes Asignados</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.docentes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <GraduationCap className="w-8 h-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cursos Asignados</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.cursos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <BookOpen className="w-8 h-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Asignaciones Activas</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.activas}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <TablaAsignacionDocenteCursoAula
        asignaciones={asignaciones}
        aulas={aulas}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modales */}
      <ModalAgregarAsignacion
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false);
          refreshAsignaciones();
        }}
      />

      <ModalEditarAsignacion
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedAsignacion(null);
        }}
        asignacion={selectedAsignacion}
        onSuccess={() => {
          setShowEditModal(false);
          setSelectedAsignacion(null);
          refreshAsignaciones();
        }}
      />

      <ModalEliminarAsignacion
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedAsignacion(null);
        }}
        onSuccess={() => {
          setShowDeleteModal(false);
          setSelectedAsignacion(null);
          refreshAsignaciones();
        }}
        asignacion={selectedAsignacion}
      />
    </div>
  );
};

export default AsignacionDocenteCursoAula;
