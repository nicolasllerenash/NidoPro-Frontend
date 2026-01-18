import React, { useState } from "react";
import { DollarSign, Filter } from "lucide-react";
import {
  DataTable,
  pensionesColumns,
} from "../../../../components/common/DataTable";
import ModalCrearPension from "../modales/ModalCrearPension";

/**
 * Tabla de pensiones usando el componente DataTable unificado
 */
const TablaPensiones = ({
  pensiones = [],
  loading = false,
  // Props para filtro de aulas
  aulas = [],
  selectedAula = "",
  onAulaChange = () => {},
  loadingAulas = false,
}) => {
  const [showModalCrear, setShowModalCrear] = useState(false);
  // Crear elemento personalizado para filtro de aulas
  const customFiltersElement = (
    <>
      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <select
        id="aula-filter-table"
        value={selectedAula}
        onChange={(e) => onAulaChange(e.target.value)}
        className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
        disabled={loadingAulas}
      >
        <option value="">Todas las aulas</option>
        {aulas.map((aula) => (
          <option key={aula.idAula} value={aula.idAula}>
            {aula.seccion} ({aula.cantidadEstudiantes || 0} estudiantes)
          </option>
        ))}
      </select>
    </>
  );

  // Crear configuración de filtros
  const filters = {
    mes: {
      label: "Mes",
      placeholder: "Todos los meses",
      options: [
        { value: "1", label: "Enero" },
        { value: "2", label: "Febrero" },
        { value: "3", label: "Marzo" },
        { value: "4", label: "Abril" },
        { value: "5", label: "Mayo" },
        { value: "6", label: "Junio" },
        { value: "7", label: "Julio" },
        { value: "8", label: "Agosto" },
        { value: "9", label: "Septiembre" },
        { value: "10", label: "Octubre" },
        { value: "11", label: "Noviembre" },
        { value: "12", label: "Diciembre" },
      ],
    },
    montoPension: {
      label: "Monto de Pensión",
      placeholder: "Todos los montos",
      options: [
        { value: "300-349", label: "S/ 300 - 349" },
        { value: "350-399", label: "S/ 350 - 399" },
        { value: "400-449", label: "S/ 400 - 449" },
        { value: "450-499", label: "S/ 450 - 499" },
        { value: "500+", label: "S/ 500 +" },
      ],
    },
  };

  return (
    <>
      <DataTable
        data={pensiones}
        columns={pensionesColumns}
        loading={loading}
        title="Tabla de Pensiones"
        icon={DollarSign}
        searchPlaceholder="Buscar pensiones..."
        filters={filters}
        customFiltersElement={customFiltersElement}
        actions={{
          add: true,
          edit: false,
          delete: false,
          view: false,
          import: false,
          export: true,
        }}
        onAdd={() => setShowModalCrear(true)}
        addButtonText="Nueva Pensión"
        loadingMessage="Cargando pensiones..."
        emptyMessage="No hay pensiones registradas"
        itemsPerPage={10}
        enablePagination={true}
        enableSearch={true}
        enableSort={true}
      />

      {/* Modal para crear nueva pensión */}
      <ModalCrearPension 
        isOpen={showModalCrear}
        onClose={() => setShowModalCrear(false)}
      />
    </>
  );
};

export default TablaPensiones;
