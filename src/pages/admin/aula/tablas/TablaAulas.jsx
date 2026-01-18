import React, { useState } from "react";
import { School, User, Calendar, Users, Eye, Edit, Trash2 } from "lucide-react";
import { DataTable } from "../../../../components/common/DataTable";
import ModalAgregarAula from "../modales/ModalAgregarAula";
import ModalVerAula from "../modales/ModalVerAula";
import ModalEditarAula from "../modales/ModalEditarAula";
import ModalEliminarAula from "../modales/ModalEliminarAula";

// Definición de columnas para aulas (GET /aula)
const aulasColumns = [
  {
    accessor: "seccion",
    Header: "Sección",
    sortable: true,
    Cell: ({ row }) => (
      <div className="flex items-center">
        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <School className="w-5 h-5 text-blue-600" />
        </div>
        <div className="ml-3">
          <div className="text-sm font-medium text-gray-900">
            Sección {row.seccion}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessor: "cantidadEstudiantes",
    Header: "Cantidad de Estudiantes",
    sortable: true,
    Cell: ({ row }) => (
      <div className="flex items-center">
        <Users className="w-4 h-4 text-gray-400 mr-2" />
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {row.cantidadEstudiantes || 0} estudiantes
        </span>
      </div>
    ),
  },
  {
    accessor: "idGrado.grado",
    Header: "Grado",
    sortable: true,
    Cell: ({ row }) => (
      <div className="text-sm font-medium text-gray-900">
        {row.idGrado?.grado || "Sin grado"}
      </div>
    ),
  },
  {
    accessor: "idGrado.descripcion",
    Header: "Descripción del Grado",
    sortable: false,
    Cell: ({ row }) => (
      <div className="text-sm text-gray-600">
        {row.idGrado?.descripcion || "Sin descripción"}
      </div>
    ),
  },
];

const TablaAulas = ({
  aulas = [],
  loading = false,
  onAdd,
  onEdit,
  onDelete,
  onView,
  onRefresh,
}) => {
  // Estados para modales
  const [showAulaModal, setShowAulaModal] = useState(false);
  const [showViewAulaModal, setShowViewAulaModal] = useState(false);
  const [showEditAulaModal, setShowEditAulaModal] = useState(false);
  const [showDeleteAulaModal, setShowDeleteAulaModal] = useState(false);
  const [selectedAula, setSelectedAula] = useState(null);

  // Funciones para manejar acciones
  const handleAddAula = () => {
    if (onAdd) onAdd();
    else setShowAulaModal(true);
  };

  const handleEditAula = (aula) => {
    setSelectedAula(aula);
    if (onEdit) onEdit(aula);
    else setShowEditAulaModal(true);
  };

  const handleDeleteAula = (aula) => {
    setSelectedAula(aula);
    if (onDelete) onDelete(aula);
    else setShowDeleteAulaModal(true);
  };

  const handleViewAula = (aula) => {
    setSelectedAula(aula);
    if (onView) onView(aula);
    else setShowViewAulaModal(true);
  };

  const handleRefresh = () => {
    if (onRefresh) onRefresh();
  };

  // Configuración de filtros para la tabla
  const aulasFilters = [
    {
      key: "estado",
      label: "Estado",
      options: [
        { value: "activa", label: "Activa" },
        { value: "inactiva", label: "Inactiva" },
      ],
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <DataTable
        data={aulas}
        columns={aulasColumns}
        loading={loading}
        title="Lista de Aulas"
        icon={School}
        searchPlaceholder="Buscar por sección, ubicación..."
        onAdd={handleAddAula}
        actions={{
          add: true,
          edit: false,
          delete: false,
          view: false,
          import: false,
          export: false,
          refresh: false,
        }}
        filters={aulasFilters}
        addButtonText="Nueva Aula"
        loadingMessage="Cargando aulas..."
        emptyMessage="No hay aulas registradas"
        itemsPerPage={10}
        enablePagination={true}
        enableSearch={true}
        enableSort={true}
      />

      {/* Modales de Aulas */}
      <ModalAgregarAula
        isOpen={showAulaModal}
        onClose={() => setShowAulaModal(false)}
      />

      <ModalVerAula
        isOpen={showViewAulaModal}
        onClose={() => {
          setShowViewAulaModal(false);
          setSelectedAula(null);
        }}
        aula={selectedAula}
      />

      <ModalEditarAula
        isOpen={showEditAulaModal}
        onClose={() => {
          setShowEditAulaModal(false);
          setSelectedAula(null);
        }}
        aula={selectedAula}
      />

      <ModalEliminarAula
        isOpen={showDeleteAulaModal}
        onClose={() => {
          setShowDeleteAulaModal(false);
          setSelectedAula(null);
        }}
        aula={selectedAula}
      />
    </div>
  );
};

export default TablaAulas;
