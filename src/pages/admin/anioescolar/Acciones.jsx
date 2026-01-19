import React, { useState } from 'react';
import { DollarSign, Settings, Zap } from 'lucide-react';
import GenerarPensionesModal from './modales/GenerarPensionesModal';
import GenerarBimestresModal from './modales/GenerarBimestresModal';

const Acciones = () => {
  const [modalGenerarPensiones, setModalGenerarPensiones] = useState(false);
  const [modalGenerarBimestres, setModalGenerarBimestres] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-green-100 rounded-lg">
            <Zap className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Acciones Rápidas</h1>
            <p className="text-gray-600">Genera automáticamente datos para períodos escolares</p>
          </div>
        </div>
      </div>

      {/* Acciones Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generar Pensiones - OCULTO TEMPORALMENTE */}
        {false && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-200">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Generar Pensiones</h3>
                  <p className="text-green-50 text-sm">Configura pensiones para un período</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 font-medium">Generación automática</p>
                    <p className="text-xs text-gray-500">Se crearán pensiones para todos los estudiantes matriculados</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 font-medium">Configuración de montos</p>
                    <p className="text-xs text-gray-500">Define el monto de pensión para cada grado académico</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 font-medium">Meses personalizados</p>
                    <p className="text-xs text-gray-500">Selecciona los meses en los que se generarán las pensiones</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setModalGenerarPensiones(true)}
                className="w-full flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                <DollarSign className="w-6 h-6" />
                <span className="font-semibold">Generar Pensiones</span>
              </button>
            </div>
          </div>
        )}

        {/* Generar Bimestres */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-200">
          <div className="bg-gradient-to-r from-purple-500 to-violet-600 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Generar Bimestres</h3>
                <p className="text-purple-50 text-sm">Crea bimestres para un período</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-700 font-medium">División automática</p>
                  <p className="text-xs text-gray-500">El período se dividirá en bimestres de forma equitativa</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-700 font-medium">Fechas ajustables</p>
                  <p className="text-xs text-gray-500">Podrás editar las fechas después de la generación</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-700 font-medium">Límites de programación</p>
                  <p className="text-xs text-gray-500">Se establecerán fechas límite para la planificación docente</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setModalGenerarBimestres(true)}
              className="w-full flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white rounded-lg transition-all duration-200 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              <Settings className="w-6 h-6" />
              <span className="font-semibold">Generar Bimestres</span>
            </button>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
            <Zap className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Información importante</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start space-x-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Asegúrate de tener períodos escolares creados antes de generar bimestres.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Los bimestres generados pueden ser editados posteriormente desde la sección "Bimestres".</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>La generación automática dividirá el período escolar en bimestres de forma equitativa.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modales */}
      {modalGenerarPensiones && (
        <GenerarPensionesModal
          isOpen={modalGenerarPensiones}
          onClose={() => setModalGenerarPensiones(false)}
        />
      )}

      {modalGenerarBimestres && (
        <GenerarBimestresModal
          isOpen={modalGenerarBimestres}
          onClose={() => setModalGenerarBimestres(false)}
        />
      )}
    </div>
  );
};

export default Acciones;
