import React, { useState } from "react";
import {
  DataTable,
  pensionesColumns,
} from "../../../../components/common/DataTable";
import ModalCrearPension from "../modales/ModalCrearPension";
import ModalEditarPension from "../modales/ModalEditarPension";

/**
 * Tabla de pensiones usando el componente DataTable unificado
 */
const TablaPensiones = ({
  pensiones = [],
  loading = false,
}) => {
  const [showModalCrear, setShowModalCrear] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [pensionSeleccionada, setPensionSeleccionada] = useState(null);

  const handleEdit = (pension) => {
    setPensionSeleccionada(pension);
    setShowModalEditar(true);
  };

  return (
    <>
      <DataTable
        data={pensiones}
        columns={pensionesColumns}
        loading={loading}
        title="Tabla de Pensiones"
        searchPlaceholder="Buscar pensiones..."
        actions={{
          add: true,
          edit: true,
          delete: false,
          view: false,
          import: false,
          export: false,
        }}
        onAdd={() => setShowModalCrear(true)}
        onEdit={handleEdit}
        addButtonText="Nueva Pensión"
        loadingMessage="Cargando pensiones..."
        emptyMessage="No hay pensiones registradas"
        itemsPerPage={10}
        enablePagination={true}
        enableSearch={true}
        enableSort={true}
      />

      <ModalCrearPension
        isOpen={showModalCrear}
        onClose={() => setShowModalCrear(false)}
      />

      <ModalEditarPension
        isOpen={showModalEditar}
        onClose={() => {
          setShowModalEditar(false);
          setPensionSeleccionada(null);
        }}
        pension={pensionSeleccionada}
      />
    </>
  );
};

export default TablaPensiones;
