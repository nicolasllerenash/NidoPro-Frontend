import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import { useGrados } from '../../../hooks/useGrados';

const CursosGrado = () => {
  const navigate = useNavigate();
  const { grados = [], isLoading, isError } = useGrados();

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="Cursos por Grado" />

      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500">Cargando grados...</p>
          </div>
        </div>
      ) : isError ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-red-500 text-lg">Error al cargar los grados</p>
        </div>
      ) : grados.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500 text-lg">No hay grados registrados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grados.map((grado) => {
            const id = grado.idGrado || grado.id;
            const nombre = grado.grado || grado.nombre;
            const pension = grado.idPension?.monto;

            return (
              <button
                key={id}
                type="button"
                onClick={() => navigate(`/admin/cursos-grado/${id}`)}
                className="text-left bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{nombre}</h3>
                    {grado.descripcion && (
                      <p className="text-sm text-gray-500 mt-1">{grado.descripcion}</p>
                    )}
                  </div>
                  {grado.estaActivo && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Activo
                    </span>
                  )}
                </div>
                {pension && (
                  <p className="text-sm text-gray-600 mt-4">
                    Pensión: <span className="font-semibold text-gray-900">S/ {pension}</span>
                  </p>
                )}
                <div className="mt-4">
                  <span className="text-sm font-medium text-blue-600">Ver cursos</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CursosGrado;

