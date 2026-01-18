import React from "react";
import { CreditCard } from "lucide-react";
import {
  DataTable,
  pensionesColumns,
  pensionesFilters,
} from "../../../../components/common/DataTable";

/**
 * Tabla de pensiones refactorizada usando el componente DataTable unificado
 */
const TablaPensiones = ({
  pensiones = [],
  loading = false,
  onAdd,
  onEdit,
  onDelete,
  onView,
  onImport,
  onExport,
}) => {
  return (
    <DataTable
      data={pensiones}
      columns={pensionesColumns}
      loading={loading}
      title="Tabla de Pensiones"
      icon={CreditCard}
      searchPlaceholder="Buscar pensiones..."
      onAdd={onAdd}
      onEdit={onEdit}
      onDelete={onDelete}
      onView={onView}
      onImport={onImport}
      onExport={onExport}
      actions={{
        add: true,
        edit: true,
        delete: true,
        view: true,
        import: true,
        export: true,
      }}
      filters={pensionesFilters}
      addButtonText="Agregar Pensión"
      loadingMessage="Cargando pensiones..."
      emptyMessage="No hay pensiones registradas"
      itemsPerPage={10}
      enablePagination={true}
      enableSearch={true}
      enableSort={true}
    />
  );
};

export default TablaPensiones;
