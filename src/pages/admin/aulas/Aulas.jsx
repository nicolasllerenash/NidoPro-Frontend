import React, { useState } from "react";
import {
  Search,
  Edit,
  Plus,
  Users,
  MapPin,
  Settings,
  BookOpen,
  Eye,
} from "lucide-react";
import {
  useAulasAdmin,
  useUpdateAula,
} from "../../../hooks/queries/useAulasQueries";
import ModalEditarAula from "./modales/ModalEditarAula";
import ModalAgregarAula from "./modales/ModalAgregarAula";

const Aulas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalEditarAula, setModalEditarAula] = useState(false);
  const [modalAgregarAula, setModalAgregarAula] = useState(false);
  const [aulaSeleccionada, setAulaSeleccionada] = useState(null);

  // Hook para obtener aulas
  const {
    data: aulas = [],
    isLoading: loadingAulas,
    error: errorAulas,
  } = useAulasAdmin();

  // Hook para actualizar aulas
  const updateAulaMutation = useUpdateAula();

  // Filtrar aulas por búsqueda
  const aulasFiltradas = aulas.filter(
    (aula) =>
      aula.seccion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aula.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aula.ubicacion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditarAula = (aula) => {
    setAulaSeleccionada(aula);
    setModalEditarAula(true);
  };

  const handleCloseEditarAula = () => {
    setModalEditarAula(false);
    setAulaSeleccionada(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestión de Aulas
              </h1>
              <p className="text-gray-600">
                Administra las aulas del centro educativo
              </p>
            </div>
          </div>
          <button
            onClick={() => setModalAgregarAula(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Crear Aula
          </button>
        </div>

        {/* Barra de búsqueda */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar aulas por sección, descripción o ubicación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Tabla de Aulas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loadingAulas ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Cargando aulas...</p>
          </div>
        ) : errorAulas ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">Error al cargar las aulas</p>
            <p className="text-gray-500 text-sm mt-2">{errorAulas.message}</p>
          </div>
        ) : aulasFiltradas.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-8 bg-gray-50 rounded-lg">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">
                {searchTerm
                  ? "No se encontraron aulas con ese criterio de búsqueda"
                  : "No hay aulas registradas"}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setModalAgregarAula(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Crear primera aula
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sección
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad de Estudiantes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {aulasFiltradas.map((aula) => (
                  <tr key={aula.idAula} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            Sección {aula.seccion}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {aula.cantidadEstudiantes || 0} estudiantes
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {aula.idGrado?.grado || "Sin grado"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {aula.idGrado?.descripcion || "Sin descripción"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditarAula(aula)}
                          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors"
                          title="Editar capacidad máxima"
                        >
                          <Edit className="w-4 h-4" />
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

      {/* Modales */}
      {modalEditarAula && (
        <ModalEditarAula
          isOpen={modalEditarAula}
          onClose={handleCloseEditarAula}
          aula={aulaSeleccionada}
        />
      )}

      {modalAgregarAula && (
        <ModalAgregarAula
          isOpen={modalAgregarAula}
          onClose={() => setModalAgregarAula(false)}
        />
      )}
    </div>
  );
};

export default Aulas;
