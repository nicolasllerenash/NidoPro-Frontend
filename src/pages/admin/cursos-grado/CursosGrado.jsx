import React, { useState } from 'react';
import { BookOpen, GraduationCap, Plus } from 'lucide-react';
import { useCursosGrado } from '../../../hooks/queries/useCursoGradoQueries';
import TablaCursosGrado from './tablas/TablaCursosGrado';
import ModalAgregarCursoGrado from './modales/ModalAgregarCursoGrado';
import ModalEditarCursoGrado from './modales/ModalEditarCursoGrado';
import ModalEliminarCursoGrado from './modales/ModalEliminarCursoGrado';

const CursosGrado = () => {
  // Hook para obtener las asignaciones de curso-grado
  const {
    data: cursosGradoData,
    isLoading: loading,
    error,
    refetch: refreshCursosGrado
  } = useCursosGrado();

  // Extraer el array de asignaciones
  const cursosGrado = Array.isArray(cursosGradoData) ? cursosGradoData :
                      cursosGradoData?.cursosGrado ? cursosGradoData.cursosGrado :
                      cursosGradoData?.data ? cursosGradoData.data : [];

  // Calcular estadísticas
  const statistics = {
    total: cursosGrado.length,
    active: cursosGrado.filter(cg => cg.estaActivo).length
  };

  // Estados para modales
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCursoGrado, setSelectedCursoGrado] = useState(null);

  // Handlers
  const handleAdd = () => {
    setShowModal(true);
  };

  const handleEdit = (cursoGrado) => {
    setSelectedCursoGrado(cursoGrado);
    setShowEditModal(true);
  };

  const handleDelete = (cursoGrado) => {
    setSelectedCursoGrado(cursoGrado);
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
              <h1 className="text-2xl font-bold text-gray-900">Cursos por Grado</h1>
              <p className="text-gray-600">Administra qué cursos se imparten en cada grado académico</p>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <GraduationCap className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Asignaciones Activas</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.active}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <TablaCursosGrado
        cursosGrado={cursosGrado}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modales */}
      <ModalAgregarCursoGrado
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false);
          refreshCursosGrado();
        }}
      />

      <ModalEditarCursoGrado
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCursoGrado(null);
        }}
        cursoGrado={selectedCursoGrado}
        onSuccess={() => {
          setShowEditModal(false);
          setSelectedCursoGrado(null);
          refreshCursosGrado();
        }}
      />

      <ModalEliminarCursoGrado
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCursoGrado(null);
        }}
        onSuccess={() => {
          setShowDeleteModal(false);
          setSelectedCursoGrado(null);
          refreshCursosGrado();
        }}
        cursoGrado={selectedCursoGrado}
      />
    </div>
  );
};

export default CursosGrado;
