import React, { useState } from "react";
import { DataTable, aulasColumns } from "../../../components/common/DataTable";
import { useAulasAdmin } from "../../../hooks/queries/useAulasQueries";
import ModalAgregarAula from "./modales/ModalAgregarAula";
import ModalEditarAula from "./modales/ModalEditarAula";
import PageHeader from "../../../components/common/PageHeader";

const Aulas = () => {
  const [showModalCrear, setShowModalCrear] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [aulaSeleccionada, setAulaSeleccionada] = useState(null);

  const { data: aulas = [], isLoading } = useAulasAdmin();

  const handleEdit = (aula) => {
    setAulaSeleccionada(aula);
    setShowModalEditar(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Aulas" />

      <DataTable
        data={aulas}
        columns={aulasColumns}
        loading={isLoading}
        title="Tabla de Aulas"
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
        addButtonText="Crear Aula"
        loadingMessage="Cargando aulas..."
        emptyMessage="No hay aulas registradas"
        itemsPerPage={10}
        enablePagination={true}
        enableSearch={true}
        enableSort={true}
      />

      <ModalAgregarAula
        isOpen={showModalCrear}
        onClose={() => setShowModalCrear(false)}
      />

      <ModalEditarAula
        isOpen={showModalEditar}
        onClose={() => {
          setShowModalEditar(false);
          setAulaSeleccionada(null);
        }}
        aula={aulaSeleccionada}
      />
    </div>
  );
};

export default Aulas;
