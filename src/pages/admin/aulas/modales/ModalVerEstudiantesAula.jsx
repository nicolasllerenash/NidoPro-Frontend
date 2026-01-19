// src/pages/admin/aulas/modales/ModalVerEstudiantesAula.jsx
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Users, Loader2, UserCircle, Phone, Mail, Calendar } from 'lucide-react';
import { useEstudiantesAula } from '../../../../hooks/queries/useEstudiantesAulaQueries';

const ModalVerEstudiantesAula = ({ isOpen, onClose, aula }) => {
  const { data: estudiantes = [], isLoading, error } = useEstudiantesAula(
    aula?.idAula,
    { enabled: isOpen && !!aula?.idAula }
  );

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold text-gray-900"
                      >
                        Estudiantes del Aula
                      </Dialog.Title>
                      {aula && (
                        <p className="text-sm text-gray-500">
                          {aula.idGrado?.nombre} - Sección {aula.seccion} ({aula.anioEscolar})
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="mt-6">
                  {isLoading && (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                      <p className="mt-2 text-sm text-gray-500">Cargando estudiantes...</p>
                    </div>
                  )}

                  {error && (
                    <div className="rounded-lg bg-red-50 p-4">
                      <p className="text-sm text-red-800">
                        Error al cargar estudiantes: {error.message}
                      </p>
                    </div>
                  )}

                  {!isLoading && !error && estudiantes.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Users className="h-12 w-12 text-gray-300" />
                      <p className="mt-2 text-sm text-gray-500">
                        No hay estudiantes matriculados en esta aula
                      </p>
                    </div>
                  )}

                  {!isLoading && !error && estudiantes.length > 0 && (
                    <div className="space-y-4">
                      {/* Resumen */}
                      <div className="rounded-lg bg-blue-50 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Total de estudiantes</p>
                            <p className="text-2xl font-bold text-blue-900">{estudiantes.length}</p>
                          </div>
                          {aula?.capacidad && (
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Capacidad del aula</p>
                              <p className="text-2xl font-bold text-gray-900">{aula.capacidad}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Lista de estudiantes */}
                      <div className="max-h-96 overflow-y-auto rounded-lg border">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50 sticky top-0">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                #
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estudiante
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Documento
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Apoderado
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Contacto
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {estudiantes.map((item, index) => {
                              const estudiante = item.matricula?.idEstudiante || {};
                              const apoderado = item.matricula?.idApoderado || {};

                              return (
                                <tr key={item.idMatriculaAula || index} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {index + 1}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 h-8 w-8">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                          <UserCircle className="h-5 w-5 text-blue-600" />
                                        </div>
                                      </div>
                                      <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">
                                          {estudiante.nombre} {estudiante.apellido}
                                        </p>
                                        {estudiante.fechaNacimiento && (
                                          <p className="text-xs text-gray-500 flex items-center">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {new Date(estudiante.fechaNacimiento).toLocaleDateString('es-PE')}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {estudiante.nroDocumento || '-'}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <p className="text-sm font-medium text-gray-900">
                                      {apoderado.nombre} {apoderado.apellido}
                                    </p>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="space-y-1">
                                      {apoderado.celular && (
                                        <p className="text-xs text-gray-500 flex items-center">
                                          <Phone className="h-3 w-3 mr-1" />
                                          {apoderado.celular}
                                        </p>
                                      )}
                                      {apoderado.email && (
                                        <p className="text-xs text-gray-500 flex items-center">
                                          <Mail className="h-3 w-3 mr-1" />
                                          {apoderado.email}
                                        </p>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-6 flex justify-end border-t pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                  >
                    Cerrar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalVerEstudiantesAula;
