import React from 'react';
import { DataTable, matriculaColumns, matriculaFilters } from '../../../../components/common/DataTable';
import { Eye, Edit, Trash2, GraduationCap, School, DollarSign } from 'lucide-react';

/**
 * Tabla de matrícula usando el componente DataTable unificado
 */
const TablaMatricula = ({ 
  matriculas = [], 
  loading = false,
  onAdd, 
  onEdit, 
  onDelete, 
  onView,
  onAsignarAula,
  onRegistrarPago
}) => {
  // Configurar acciones para cada fila
  const actions = [
    {
      icon: Eye,
      label: 'Ver detalles',
      onClick: onView,
      className: 'text-blue-600 hover:text-blue-900'
    },
    {
      icon: School,
      label: 'Asignar aula (Paso 2)',
      onClick: onAsignarAula,
      className: 'text-green-600 hover:text-green-900',
      // Solo mostrar si no tiene aula asignada
      condition: (matricula) => !matricula.idAula
    },
    {
      icon: DollarSign,
      label: 'Registrar pago (Paso 3)',
      onClick: onRegistrarPago,
      className: 'text-purple-600 hover:text-purple-900',
      // Solo mostrar si tiene aula pero no tiene registro en caja
      condition: (matricula) => matricula.idAula && !matricula.pagoRegistrado
    },
    {
      icon: Edit,
      label: 'Editar',
      onClick: onEdit,
      className: 'text-yellow-600 hover:text-yellow-900'
    },
    {
      icon: Trash2,
      label: 'Eliminar',
      onClick: onDelete,
      className: 'text-red-600 hover:text-red-900'
    }
  ];

  return (
    <DataTable
      data={matriculas}
      columns={matriculaColumns}
      loading={loading}
      title="Tabla de Matrícula"
      icon={GraduationCap}
      searchPlaceholder="Buscar por nombre de estudiante..."
      filters={matriculaFilters}
      actions={{
        add: true,
        edit: true,
        delete: false,
        view: true,
        import: false,
        export: false
      }}
      onAdd={onAdd}
      onEdit={onEdit}
      onDelete={onDelete}
      onView={onView}
      emptyStateConfig={{
        title: 'No hay matrículas registradas',
        description: 'Comienza agregando tu primera matrícula'
      }}
      addButtonText="Nueva Matrícula"
    />
  );
};

export default TablaMatricula;
