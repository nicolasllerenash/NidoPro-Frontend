import React from 'react';
import { DataTable, cursosColumns } from '../../../../components/common/DataTable';

const TablaCursos = ({
  cursos = [],
  loading = false,
  onAdd,
  onEdit,
  onDelete,
  onView
}) => {
  return (
    <DataTable
      data={cursos}
      columns={cursosColumns}
      loading={loading}
      title="Tabla de Cursos"
      searchPlaceholder="Buscar cursos..."
      actions={{
        add: true,
        edit: true,
        delete: false,
        view: false,
        import: false,
        export: false
      }}
      onAdd={onAdd}
      onEdit={onEdit}
      emptyStateConfig={{
        title: 'No hay cursos registrados',
        description: 'Comienza agregando tu primer curso'
      }}
      addButtonText="Crear Curso"
    />
  );
};

export default TablaCursos;
