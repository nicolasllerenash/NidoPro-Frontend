import React, { useState } from 'react';
import { DataTable, gradosColumns } from '../../../../components/common/DataTable';
import ModalAgregarGrado from '../modales/ModalAgregarGrado';
import ModalEditarGrado from '../modales/ModalEditarGrado';

const TablaGrados = ({
  grados = [],
  loading = false,
}) => {
  const [showModalCrear, setShowModalCrear] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [gradoSeleccionado, setGradoSeleccionado] = useState(null);

  const handleEdit = (grado) => {
    setGradoSeleccionado(grado);
    setShowModalEditar(true);
  };

  return (
    <>
      <DataTable
        data={grados}
        columns={gradosColumns}
        loading={loading}
        title="Tabla de Grados"
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
        addButtonText="Agregar Grado"
        loadingMessage="Cargando grados..."
        emptyMessage="No hay grados registrados"
        itemsPerPage={10}
        enablePagination={true}
        enableSearch={true}
        enableSort={true}
      />

      <ModalAgregarGrado
        isOpen={showModalCrear}
        onClose={() => setShowModalCrear(false)}
      />

      <ModalEditarGrado
        isOpen={showModalEditar}
        onClose={() => {
          setShowModalEditar(false);
          setGradoSeleccionado(null);
        }}
        grado={gradoSeleccionado}
      />
    </>
  );
};

export default TablaGrados;
