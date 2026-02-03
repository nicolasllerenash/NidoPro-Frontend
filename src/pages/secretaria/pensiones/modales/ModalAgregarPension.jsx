import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Save, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import secretariaPagosService from "../../../../services/secretariaPagosService";

const METODOS_PAGO = [
  "Efectivo",
  "Yape",
  "Plin",
  "Transferencia",
  "Depósito",
  "Tarjeta",
];

const ModalAgregarPension = ({ isOpen, onClose, aulas = [], onSuccess }) => {
  const [loadingEstudiantes, setLoadingEstudiantes] = useState(false);
  const [estudiantes, setEstudiantes] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      idAula: "",
      idEstudiante: "",
      horario: "",
      pagoInicialMonto: "",
      pagoInicialFecha: "",
      pagoInicialMetodo: "Efectivo",
    },
  });

  const selectedAula = watch("idAula");

  const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

  const updateHorario = (days) => {
    const horarioText = days.join(" - ");
    setValue("horario", horarioText);
    if (days.length === 0) {
      setError("horario", { type: "manual", message: "Seleccione al menos un día" });
    } else {
      clearErrors("horario");
    }
  };

  useEffect(() => {
    const fetchEstudiantes = async () => {
      if (!selectedAula) {
        setEstudiantes([]);
        setValue("idEstudiante", "");
        return;
      }
      try {
        setLoadingEstudiantes(true);
        const response = await secretariaPagosService.getEstudiantesByAula(
          selectedAula
        );
        const rawData =
          response?.info?.data || response?.data || response?.estudiantes || response || [];
        const normalized = Array.isArray(rawData)
          ? rawData
              .map((item) => {
                if (item?.matricula?.idEstudiante) {
                  return {
                    ...item.matricula.idEstudiante,
                    idEstudiante: item.matricula.idEstudiante.idEstudiante,
                  };
                }
                return item;
              })
              .filter(Boolean)
          : [];
        setEstudiantes(normalized);
        setValue("idEstudiante", "");
      } catch (error) {
        toast.error("Error al cargar estudiantes del aula");
        setEstudiantes([]);
      } finally {
        setLoadingEstudiantes(false);
      }
    };

    fetchEstudiantes();
  }, [selectedAula, setValue]);

  const handleClose = () => {
    if (!submitting) {
      reset();
      setSelectedDays([]);
      setEstudiantes([]);
      onClose();
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const registradoPor = (() => {
        try {
          const authData = localStorage.getItem("auth-storage");
          if (authData) {
            const parsedAuth = JSON.parse(authData);
            return (
              parsedAuth.state?.user?.entidadId ||
              parsedAuth.state?.user?.idTrabajador ||
              parsedAuth.state?.user?.id
            );
          }
          return null;
        } catch (error) {
          return null;
        }
      })();

      if (!registradoPor) {
        toast.error("No se pudo identificar al usuario actual");
        setSubmitting(false);
        return;
      }

      if (selectedDays.length === 0) {
        setError("horario", { type: "manual", message: "Seleccione al menos un día" });
        setSubmitting(false);
        return;
      }

      const payloadRegistro = {
        idEstudiante: data.idEstudiante,
        idAula: data.idAula,
        horario: data.horario,
        pagoInicialMonto: data.pagoInicialMonto
          ? Number(data.pagoInicialMonto)
          : undefined,
        pagoInicialFecha: data.pagoInicialFecha || undefined,
        pagoInicialMetodo: data.pagoInicialMetodo || undefined,
        registradoPor,
      };

      await secretariaPagosService.registrarHorarioPagoInicial(payloadRegistro);

      toast.success("Registro creado correctamente");
      if (onSuccess) onSuccess();
      handleClose();
    } catch (error) {
      toast.error(error.message || "Error al registrar pago");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (fieldError) =>
    `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      fieldError ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
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
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-lg font-semibold text-gray-900">
                    Registrar Pensión
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Aula
                      </label>
                      <select
                        {...register("idAula", { required: "Seleccione un aula" })}
                        className={inputClass(errors.idAula)}
                      >
                        <option value="">Seleccione un aula</option>
                        {aulas.map((aula) => (
                          <option key={aula.idAula || aula.id} value={aula.idAula || aula.id}>
                            {aula.seccion} - {aula.idGrado?.grado || aula.grado || ""}
                          </option>
                        ))}
                      </select>
                      {errors.idAula && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.idAula.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estudiante
                      </label>
                      <select
                        {...register("idEstudiante", {
                          required: "Seleccione un estudiante",
                        })}
                        className={inputClass(errors.idEstudiante)}
                        disabled={!selectedAula || loadingEstudiantes}
                      >
                        <option value="">
                          {loadingEstudiantes
                            ? "Cargando estudiantes..."
                            : "Seleccione un estudiante"}
                        </option>
                        {estudiantes.map((est) => (
                          <option key={est.idEstudiante || est.id} value={est.idEstudiante || est.id}>
                            {est.nombre} {est.apellido}
                          </option>
                        ))}
                      </select>
                      {errors.idEstudiante && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.idEstudiante.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Días de asistencia
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {diasSemana.map((dia) => {
                        const isSelected = selectedDays.includes(dia);
                        return (
                          <button
                            key={dia}
                            type="button"
                            onClick={() => {
                              const next = isSelected
                                ? selectedDays.filter((d) => d !== dia)
                                : [...selectedDays, dia];
                              setSelectedDays(next);
                              updateHorario(next);
                            }}
                            className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                              isSelected
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                            }`}
                          >
                            {dia}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="hidden"
                      {...register("horario")}
                    />
                    {errors.horario && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.horario.message}
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Pago inicial (opcional)
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Monto
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          {...register("pagoInicialMonto")}
                          className={inputClass(errors.pagoInicialMonto)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha
                        </label>
                        <input
                          type="date"
                          {...register("pagoInicialFecha")}
                          className={inputClass(errors.pagoInicialFecha)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Método
                        </label>
                        <select
                          {...register("pagoInicialMetodo")}
                          className={inputClass(errors.pagoInicialMetodo)}
                        >
                          {METODOS_PAGO.map((metodo) => (
                            <option key={metodo} value={metodo}>
                              {metodo}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Guardar
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalAgregarPension;
