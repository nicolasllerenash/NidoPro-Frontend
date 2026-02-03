import React, { useEffect, useMemo, useState } from "react";
import PageHeader from "../../../components/common/PageHeader";
import TablaPensionesSecretaria from "./tabla/TablaPensionesSecretaria";
import secretariaPagosService from "../../../services/secretariaPagosService";
import { useAulasHook } from "../../../hooks/useAulas";

const PensionesSecretaria = () => {
  const { aulas = [], loading: loadingAulas } = useAulasHook();
  const [selectedAula, setSelectedAula] = useState("");
  const [registros, setRegistros] = useState([]);
  const [loadingRegistros, setLoadingRegistros] = useState(false);

  const selectedAulaLabel = useMemo(() => {
    const found = aulas.find((aula) => (aula.idAula || aula.id) === selectedAula);
    if (!found) return "";
    const grado = found.idGrado?.grado || found.grado || "";
    return `${found.seccion}${grado ? ` - ${grado}` : ""}`;
  }, [aulas, selectedAula]);

  const loadRegistros = async () => {
    if (!selectedAula) return;
    try {
      setLoadingRegistros(true);
      const response = await secretariaPagosService.getRegistrosByAula(selectedAula);
      const data = response?.info?.data || response?.data || response?.registros || [];
      setRegistros(Array.isArray(data) ? data : []);
    } catch (error) {
      setRegistros([]);
    } finally {
      setLoadingRegistros(false);
    }
  };

  useEffect(() => {
    loadRegistros();
  }, [selectedAula]);

  return (
    <div className="space-y-6">
      <PageHeader title="Pensiones" />
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Aula
            </label>
            <select
              value={selectedAula}
              onChange={(event) => setSelectedAula(event.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loadingAulas}
            >
              <option value="">
                {loadingAulas ? "Cargando aulas..." : "Seleccione un aula"}
              </option>
              {aulas.map((aula) => (
                <option key={aula.idAula || aula.id} value={aula.idAula || aula.id}>
                  {aula.seccion} - {aula.idGrado?.grado || aula.grado || ""}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <TablaPensionesSecretaria
        registros={registros}
        loading={loadingRegistros}
        aulas={aulas}
        selectedAulaLabel={selectedAulaLabel}
        onRefresh={loadRegistros}
      />
    </div>
  );
};

export default PensionesSecretaria;
