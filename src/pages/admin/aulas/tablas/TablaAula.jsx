import React, { useState } from 'react';
import { BookOpen, School, User, Calendar, Users } from 'lucide-react';
import { DataTable } from '../../../../components/common/DataTable';
import ModalAsignarDocente from '../modales/ModalAsignarDocente';
import ModalVerAula from '../modales/ModalVerAula';
import ModalEditarAula from '../modales/ModalEditarAula';
import ModalEliminarAula from '../modales/ModalEliminarAula';

// Definición de columnas para asignaciones de aula
const asignacionesColumns = [
  {
    accessor: 'aula',
    Header: 'Aula',
    sortable: true,
    Cell: ({ row }) => (
      <div className="flex items-center">
        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <School className="w-5 h-5 text-blue-600" />
        </div>
        <div className="ml-3">
          <div className="text-sm font-medium text-gray-900">
            Sección {row.idAula?.seccion || 'N/A'}
          </div>
          <div className="text-sm text-gray-500">
            {row.idAula?.cantidadEstudiantes || 0} estudiantes
          </div>
        </div>
      </div>
    )
  },
  {
    accessor: 'docente',
    Header: 'Docente Asignado',
    sortable: true,
    Cell: ({ row }) => (
      <div className="flex items-center">
        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-gray-600" />
        </div>
        <div className="ml-3">
          <div className="text-sm font-medium text-gray-900">
            {row.idTrabajador?.nombre} {row.idTrabajador?.apellido}
          </div>
          <div className="text-sm text-gray-500">
            {row.idTrabajador?.correo}
          </div>
        </div>
      </div>
    )
  },
  {
    accessor: 'fechaAsignacion',
    Header: 'Fecha Asignación',
    sortable: true,
    Cell: ({ row }) => (
      <div className="flex items-center">
        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
        <span className="text-sm text-gray-900">
          {new Date(row.fechaAsignacion).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
      </div>
    )
  },
  {
    accessor: 'cantidadEstudiantes',
    Header: 'Estudiantes',
    sortable: true,
    Cell: ({ row }) => {
      const students = row.idAula?.cantidadEstudiantes || 0;
      const capacity = 30; // Capacidad máxima por defecto
      const occupancyPercentage = Math.round((students / capacity) * 100);
      
      const getOccupancyColor = (percentage) => {
        if (percentage >= 90) return 'bg-red-100 text-red-800';
        if (percentage >= 70) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
      };

      return (
        <div>
          <div className="flex items-center">
            <Users className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-900">
              {students}
            </span>
          </div>
          <div className="mt-1">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getOccupancyColor(occupancyPercentage)}`}>
              {occupancyPercentage}% ocupación
            </span>
          </div>
        </div>
      );
    }
  },
  {
    accessor: 'contacto',
    Header: 'Contacto',
    Cell: ({ row }) => (
      <div>
        <div className="text-sm text-gray-900">
          <span className="font-medium">TELF:</span> {row.idTrabajador?.telefono || 'Sin teléfono'}
        </div>
        <div className="text-sm text-gray-500">
          <span className="font-medium">DNI:</span> {row.idTrabajador?.nroDocumento || 'Sin documento'}
        </div>
      </div>
    )
  },
  {
    accessor: 'estadoActivo',
    Header: 'Estado',
    Cell: ({ row }) => (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        row.estadoActivo
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}>
        {row.estadoActivo ? 'Activo' : 'Inactivo'}
      </span>
    )
  }
];

// Filtros para asignaciones de aula (comentado - solo búsqueda habilitada)
const asignacionesFilters = {
  seccion: {
    label: 'Sección',
    type: 'select',
    options: [
      { value: 'all', label: 'Todas las secciones' },
      { value: 'A', label: 'Sección A' },
      { value: 'B', label: 'Sección B' },
      { value: 'C', label: 'Sección C' }
    ]
  },
  estado: {
    label: 'Estado',
    type: 'select',
    options: [
      { value: 'all', label: 'Todos los estados' },
      { value: 'activo', label: 'Activos' },
      { value: 'inactivo', label: 'Inactivos' }
    ]
  }
};

const TablaAulas = ({ 
  asignaciones = [], 
  loading = false,
  onAdd, 
  onEdit, 
  onDelete, 
  onView,
  onImport,
  onExport,
  onRefresh
}) => {
  // Estados para modales de asignaciones
  const [showAulaModal, setShowAulaModal] = useState(false);
  const [showViewAulaModal, setShowViewAulaModal] = useState(false);
  const [showEditAulaModal, setShowEditAulaModal] = useState(false);
  const [showDeleteAulaModal, setShowDeleteAulaModal] = useState(false);
  const [selectedAsignacion, setSelectedAsignacion] = useState(null);

  // Funciones para asignaciones
  const handleAddAula = () => {
    setShowAulaModal(true);
  };

  const handleEditAula = (asignacion) => {
    setSelectedAsignacion(asignacion);
    setShowEditAulaModal(true);
  };

  const handleDeleteAula = (asignacion) => {
    setSelectedAsignacion(asignacion);
    setShowDeleteAulaModal(true);
  };

  const handleViewAula = (asignacion) => {
    setSelectedAsignacion(asignacion);
    setShowViewAulaModal(true);
  };

  const handleImportAulas = () => {
    console.log('Importar asignaciones');
  };

  const handleExportAulas = () => {
    console.log('Exportar asignaciones');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <DataTable
        data={asignaciones}
        columns={asignacionesColumns}
        loading={loading}
        title="Gestión de Asignaciones de Aula"
        icon={School}
        searchPlaceholder="Buscar por aula, docente o sección..."
        onAdd={handleAddAula}
        onEdit={handleEditAula}
        onDelete={handleDeleteAula}
        onView={handleViewAula}
        onExport={handleExportAulas}
        onRefresh={onRefresh}
        actions={{
          add: true, // Habilitar botón para crear asignaciones
          edit: true,
          delete: true,
          view: true,
          import: false,
          export: true,
          refresh: true
        }}
        addButtonText="Asignar Docente"
        loadingMessage="Cargando asignaciones..."
        emptyMessage="No hay asignaciones de aula registradas"
        itemsPerPage={10}
        enablePagination={true}
        enableSearch={true}
        enableSort={true}
      />

      {/* Modales de Asignaciones */}
      <ModalAsignarDocente
        isOpen={showAulaModal}
        onClose={() => setShowAulaModal(false)}
      />

      <ModalVerAula
        isOpen={showViewAulaModal}
        onClose={() => {
          setShowViewAulaModal(false);
          setSelectedAsignacion(null);
        }}
        asignacion={selectedAsignacion}
      />

      <ModalEditarAula
        isOpen={showEditAulaModal}
        onClose={() => {
          setShowEditAulaModal(false);
          setSelectedAsignacion(null);
        }}
        asignacion={selectedAsignacion}
      />

      <ModalEliminarAula
        isOpen={showDeleteAulaModal}
        onClose={() => {
          setShowDeleteAulaModal(false);
          setSelectedAsignacion(null);
        }}
        asignacion={selectedAsignacion}
      />
    </div>
  );
};

export default TablaAulas;