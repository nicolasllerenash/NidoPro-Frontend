import React from 'react';
import { Plus, Edit, Trash2, BookOpen, User, School } from 'lucide-react';

const TablaAsignacionDocenteCursoAula = ({ asignaciones, aulas = [], loading, onAdd, onEdit, onDelete }) => {
  // Función helper para obtener el aula completa con su grado
  const getAulaCompleta = (idAula) => {
    return aulas.find(a => (a.idAula || a.id) === idAula) || null;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-500">Cargando asignaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Lista de Asignaciones</h2>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Asignación
          </button>
        </div>
      </div>

      {/* Table */}
      {asignaciones.length === 0 ? (
        <div className="p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">No hay asignaciones registradas</p>
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Crear primera asignación
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Docente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Curso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aula
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Asignación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {asignaciones.map((asignacion) => (
                <tr key={asignacion.idAsignacionDocenteCursoAula} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {asignacion.idTrabajador?.nombre || ''} {asignacion.idTrabajador?.apellido || ''}
                        </div>
                        <div className="text-sm text-gray-500">
                          {asignacion.idTrabajador?.idRol?.nombre || 'Sin rol'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 text-purple-600 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {asignacion.idCurso?.nombreCurso || 'Sin curso'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {asignacion.idCurso?.descripcion || ''}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <School className="w-4 h-4 text-green-600 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {(() => {
                            const aulaCompleta = getAulaCompleta(asignacion.idAula?.idAula);
                            const grado = aulaCompleta?.idGrado?.grado || 'Sin grado';
                            const seccion = asignacion.idAula?.seccion || 'N/A';
                            return `${grado} - Sección ${seccion}`;
                          })()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {asignacion.idAula?.cantidadEstudiantes || 0} estudiantes
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {asignacion.fechaAsignacion ?
                      new Date(asignacion.fechaAsignacion).toLocaleDateString('es-ES') :
                      '-'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {asignacion.estaActivo ? (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Activo
                      </span>
                    ) : (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(asignacion)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(asignacion)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TablaAsignacionDocenteCursoAula;
