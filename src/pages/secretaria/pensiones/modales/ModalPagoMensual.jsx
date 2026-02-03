import React, { Fragment, useEffect, useMemo, useState } from "react";
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

const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const ModalPagoMensual = ({ isOpen, onClose, registro, onSuccess }) => {
  const [submitting, setSubmitting] = useState(false);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [detalleEstudiante, setDetalleEstudiante] = useState(null);
  const [selectedPagoId, setSelectedPagoId] = useState("");
  const [updatePagoInicial, setUpdatePagoInicial] = useState(false);

  const estudiante =
    registro?.registro?.estudiante ||
    registro?.estudiante ||
    registro?.registro?.idEstudiante ||
    registro?.idEstudiante ||
    null;

  const estudianteId = useMemo(() => {
    if (!estudiante) return null;
    if (typeof estudiante === "string") return estudiante;
    return estudiante.idEstudiante || estudiante.id || null;
  }, [estudiante]);

  const estudianteNombre = useMemo(() => {
    if (!estudiante) return "";
    return `${estudiante.apellido || ""} ${estudiante.nombre || ""}`.trim();
  }, [estudiante]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      mes: new Date().getMonth() + 1,
      anio: new Date().getFullYear(),
      monto: "",
      fechaPago: new Date().toISOString().split("T")[0],
      metodoPago: "Efectivo",
      esParcial: false,
      pagoInicialMonto: "",
      pagoInicialFecha: "",
      pagoInicialMetodo: "Efectivo",
    },
  });

  const handleClose = () => {
    if (!submitting) {
      reset();
      setSelectedPagoId("");
      setDetalleEstudiante(null);
      setUpdatePagoInicial(false);
      onClose();
    }
  };

  const pagosMensuales = useMemo(() => {
    const source =
      detalleEstudiante?.pagosMensuales ||
      detalleEstudiante?.registro?.pagosMensuales ||
      detalleEstudiante?.pagos ||
      detalleEstudiante?.detallePagos ||
      registro?.pagosMensuales ||
      registro?.pagos ||
      registro?.detallePagos ||
      registro?.registro?.pagosMensuales ||
      [];
    return Array.isArray(source) ? source : [];
  }, [detalleEstudiante, registro]);

  const registroBase = useMemo(() => {
    return (
      detalleEstudiante?.registro ||
      detalleEstudiante?.data ||
      detalleEstudiante ||
      registro?.registro ||
      registro ||
      null
    );
  }, [detalleEstudiante, registro]);

  useEffect(() => {
    const fetchDetalle = async () => {
      if (!isOpen || !estudianteId) return;
      try {
        setLoadingDetalle(true);
        const response = await secretariaPagosService.getEstudianteDetalle(estudianteId);
        const raw = response?.info?.data || response?.data || response || null;
        setDetalleEstudiante(raw);
      } catch (error) {
        setDetalleEstudiante(null);
      } finally {
        setLoadingDetalle(false);
      }
    };

    fetchDetalle();
  }, [isOpen, estudianteId]);

  useEffect(() => {
    if (!selectedPagoId) {
      setValue("mes", new Date().getMonth() + 1);
      setValue("anio", new Date().getFullYear());
      setValue("monto", "");
      setValue("fechaPago", new Date().toISOString().split("T")[0]);
      setValue("metodoPago", "Efectivo");
      setValue("esParcial", false);
      return;
    }
    const pago = pagosMensuales.find((item) => item.idPagoMensual === selectedPagoId);
    if (!pago) return;
    setValue("mes", Number(pago.mes));
    setValue("anio", Number(pago.anio));
    setValue("monto", pago.monto ?? "");
    setValue("fechaPago", pago.fechaPago ?? "");
    setValue("metodoPago", pago.metodoPago ?? "Efectivo");
    setValue("esParcial", Boolean(pago.esParcial));
  }, [pagosMensuales, selectedPagoId, setValue]);

  useEffect(() => {
    if (!updatePagoInicial || !registroBase) return;
    setValue("pagoInicialMonto", registroBase.pagoInicialMonto ?? "");
    setValue("pagoInicialFecha", registroBase.pagoInicialFecha ?? "");
    setValue("pagoInicialMetodo", registroBase.pagoInicialMetodo ?? "Efectivo");
  }, [registroBase, setValue, updatePagoInicial]);

  const getPagoExistente = (mes, anio) => {
    return (
      pagosMensuales.find(
        (pago) => Number(pago.mes) === Number(mes) && Number(pago.anio) === Number(anio)
      ) || null
    );
  };

  const onSubmit = async (data) => {
    if (!estudianteId) {
      toast.error("No se encontró el estudiante");
      return;
    }

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
      const payload = {
        idEstudiante: estudianteId,
        mes: Number(data.mes),
        anio: Number(data.anio),
        monto: Number(data.monto),
        fechaPago: data.fechaPago,
        metodoPago: data.metodoPago,
        esParcial: Boolean(data.esParcial),
        registradoPor,
      };

      clearErrors(["monto", "fechaPago"]);

      const shouldSubmitMonthly = Boolean(data.monto);

      if (!shouldSubmitMonthly && !updatePagoInicial) {
        toast.error("Ingresa el monto o activa actualizar pago inicial");
        setSubmitting(false);
        return;
      }

      if (selectedPagoId && !shouldSubmitMonthly) {
        setError("monto", { type: "manual", message: "Monto requerido" });
        setSubmitting(false);
        return;
      }

      if (selectedPagoId && !data.fechaPago) {
        setError("fechaPago", { type: "manual", message: "Fecha requerida" });
        setSubmitting(false);
        return;
      }

      if (shouldSubmitMonthly) {
        if (selectedPagoId) {
          await secretariaPagosService.actualizarPagoMensual(selectedPagoId, {
            mes: payload.mes,
            anio: payload.anio,
            monto: payload.monto,
            fechaPago: payload.fechaPago,
            metodoPago: payload.metodoPago,
            esParcial: payload.esParcial,
            estadoPago: payload.esParcial ? "PARCIAL" : "PAGADO",
          });
          toast.success("Pago mensual actualizado");
        } else {
          try {
            await secretariaPagosService.registrarPagoMensual(payload);
            toast.success("Pago mensual registrado");
          } catch (error) {
            const pagoExistente = getPagoExistente(data.mes, data.anio);
            if (pagoExistente?.idPagoMensual) {
              await secretariaPagosService.actualizarPagoMensual(
                pagoExistente.idPagoMensual,
                {
                  mes: payload.mes,
                  anio: payload.anio,
                  monto: payload.monto,
                  fechaPago: payload.fechaPago,
                  metodoPago: payload.metodoPago,
                  esParcial: payload.esParcial,
                  estadoPago: payload.esParcial ? "PARCIAL" : "PAGADO",
                }
              );
              toast.success("Pago mensual actualizado");
            } else {
              throw error;
            }
          }
        }
      }

      if (updatePagoInicial) {
        const payloadRegistro = {
          idEstudiante: estudianteId,
          idAula: registroBase?.idAula || registroBase?.aula?.idAula,
          horario: registroBase?.horario,
          pagoInicialMonto: data.pagoInicialMonto
            ? Number(data.pagoInicialMonto)
            : undefined,
          pagoInicialFecha: data.pagoInicialFecha || undefined,
          pagoInicialMetodo: data.pagoInicialMetodo || undefined,
          registradoPor,
        };
        await secretariaPagosService.registrarHorarioPagoInicial(payloadRegistro);
        toast.success("Pago inicial actualizado");
      }

      if (onSuccess) onSuccess();
      handleClose();
    } catch (error) {
      toast.error(error.message || "Error al registrar pago mensual");
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Dialog.Title className="text-lg font-semibold text-gray-900">
                      Registrar o editar pago mensual
                    </Dialog.Title>
                    {estudianteNombre && (
                      <p className="text-sm text-gray-500 mt-1">
                        {estudianteNombre}
                      </p>
                    )}
                  </div>
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
                        Editar pago existente
                      </label>
                      <select
                        value={selectedPagoId}
                        onChange={(event) => setSelectedPagoId(event.target.value)}
                        className={inputClass()}
                        disabled={loadingDetalle}
                      >
                        <option value="">Nuevo pago</option>
                        {pagosMensuales.map((pago) => (
                          <option key={pago.idPagoMensual} value={pago.idPagoMensual}>
                            {MESES[Number(pago.mes) - 1]} {pago.anio} - {pago.monto}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2 mt-6">
                      <input
                        type="checkbox"
                        checked={updatePagoInicial}
                        onChange={(event) => setUpdatePagoInicial(event.target.checked)}
                      />
                      <span className="text-sm text-gray-700">Actualizar pago inicial</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mes
                      </label>
                      <select
                        {...register("mes", { required: "Mes requerido" })}
                        className={inputClass(errors.mes)}
                      >
                        {MESES.map((label, index) => (
                          <option key={label} value={index + 1}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Año
                      </label>
                      <input
                        type="number"
                        {...register("anio", { required: "Año requerido" })}
                        className={inputClass(errors.anio)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monto
                      </label>
                      <input
                        type="number"
                        step="0.01"
                          {...register("monto")}
                        className={inputClass(errors.monto)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de pago
                      </label>
                      <input
                        type="date"
                          {...register("fechaPago")}
                        className={inputClass(errors.fechaPago)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Método de pago
                      </label>
                      <select
                        {...register("metodoPago", { required: true })}
                        className={inputClass(errors.metodoPago)}
                      >
                        {METODOS_PAGO.map((metodo) => (
                          <option key={metodo} value={metodo}>
                            {metodo}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2 mt-6">
                      <input type="checkbox" {...register("esParcial")} />
                      <span className="text-sm text-gray-700">Pago parcial</span>
                    </div>
                  </div>

                  {updatePagoInicial && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        Pago inicial
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
                  )}

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

export default ModalPagoMensual;
