import React, { Fragment } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Dialog, Transition } from "@headlessui/react";
import { X, User, Save, UserPlus, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import trabajadorService from "src/services/trabajadorService";

// IDs de roles disponibles
const ROLES = [
  { id: "72dde73a-2c67-4ea5-bbfa-93ec728a7a9d", nombre: "DOCENTE" },
  { id: "751ce416-069d-428a-bef4-3069b18d56c7", nombre: "SECRETARIA" },
  { id: "3bb776ee-5e5a-4539-aaee-d12b5c388773", nombre: "ADMINISTRADOR" },
  { id: "4879c823-96ec-4120-a264-c7e87d1fb755", nombre: "ESPECIALISTA" },
];

// Esquema de validación simplificado
const validationSchema = yup.object({
  nombre: yup.string().required("El nombre es requerido").trim(),
  apellido: yup.string().required("El apellido es requerido").trim(),
  tipoDocumento: yup.string().required("El tipo de documento es requerido"),
  nroDocumento: yup
    .string()
    .required("El número de documento es requerido")
    .trim(),
  idRol: yup.string().required("El rol es requerido"),
  correo: yup.string().email("El correo no es válido").nullable(),
  telefono: yup.string().nullable(),
  direccion: yup.string().nullable(),
  estaActivo: yup.boolean(),
});

// Componente FormField reutilizable
const FormField = ({ label, error, required, children, className = "" }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const ModalAgregarTrabajador = ({ isOpen, onClose, onSuccess }) => {
  const queryClient = useQueryClient();

  // Mutation para crear trabajador simple
  const createMutation = useMutation({
    mutationFn: (data) => trabajadorService.createTrabajadorSimple(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trabajadores"] });
      toast.success("¡Trabajador creado exitosamente!");
      handleClose();
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast.error("Error al crear trabajador", {
        description: error.message,
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      tipoDocumento: "DNI",
      nroDocumento: "",
      correo: "",
      telefono: "",
      direccion: "",
      idRol: "",
      estaActivo: true,
    },
  });

  const onSubmit = async (data) => {
    try {
      console.log("📋 Creando trabajador:", data);

      // Crear trabajador usando la mutation
      await createMutation.mutateAsync(data);
    } catch (error) {
      console.error("❌ Error al crear trabajador:", error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const inputClassName = (fieldError) =>
    `w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
      fieldError ? "border-red-500" : "border-gray-300"
    }`;

  const creating = createMutation.isPending;

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
          <div className="fixed inset-0 bg-black/20 bg-opacity-25" />
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-6 h-6 text-blue-600" />
                    <Dialog.Title className="text-xl font-semibold text-gray-900">
                      Agregar Nuevo Trabajador
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={creating}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="p-6 space-y-6"
                >
                  {/* Información Personal */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      Información Personal
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Nombre"
                        required
                        error={errors.nombre?.message}
                      >
                        <input
                          {...register("nombre")}
                          className={inputClassName(errors.nombre)}
                          placeholder="Ej: Walter Eduardo"
                          disabled={creating}
                        />
                      </FormField>

                      <FormField
                        label="Apellido"
                        required
                        error={errors.apellido?.message}
                      >
                        <input
                          {...register("apellido")}
                          className={inputClassName(errors.apellido)}
                          placeholder="Ej: Martinez Gonzales"
                          disabled={creating}
                        />
                      </FormField>

                      <FormField
                        label="Tipo de Documento"
                        required
                        error={errors.tipoDocumento?.message}
                      >
                        <select
                          {...register("tipoDocumento")}
                          className={inputClassName(errors.tipoDocumento)}
                          disabled={creating}
                        >
                          <option value="DNI">DNI</option>
                          <option value="CE">Carnet de Extranjería</option>
                          <option value="PASAPORTE">Pasaporte</option>
                        </select>
                      </FormField>

                      <FormField
                        label="Número de Documento"
                        required
                        error={errors.nroDocumento?.message}
                      >
                        <input
                          {...register("nroDocumento")}
                          className={inputClassName(errors.nroDocumento)}
                          placeholder="Ej: 24323234"
                          disabled={creating}
                        />
                      </FormField>

                      <FormField
                        label="Rol"
                        required
                        error={errors.idRol?.message}
                        className="md:col-span-2"
                      >
                        <select
                          {...register("idRol")}
                          className={inputClassName(errors.idRol)}
                          disabled={creating}
                        >
                          <option value="">Seleccione un rol</option>
                          {ROLES.map((rol) => (
                            <option key={rol.id} value={rol.id}>
                              {rol.nombre}
                            </option>
                          ))}
                        </select>
                      </FormField>
                    </div>
                  </div>

                  {/* Información de Contacto (Opcional) */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-gray-600" />
                      Información de Contacto{" "}
                      <span className="text-sm text-gray-500 font-normal">
                        (Opcional)
                      </span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Correo Electrónico"
                        error={errors.correo?.message}
                      >
                        <input
                          type="email"
                          {...register("correo")}
                          className={inputClassName(errors.correo)}
                          placeholder="Ej: ejemplo@correo.com"
                          disabled={creating}
                        />
                      </FormField>

                      <FormField
                        label="Teléfono"
                        error={errors.telefono?.message}
                      >
                        <input
                          {...register("telefono")}
                          className={inputClassName(errors.telefono)}
                          placeholder="Ej: 925757151"
                          disabled={creating}
                        />
                      </FormField>

                      <FormField
                        label="Dirección"
                        error={errors.direccion?.message}
                        className="md:col-span-2"
                      >
                        <input
                          {...register("direccion")}
                          className={inputClassName(errors.direccion)}
                          placeholder="Ej: AV. MICHAEL FARADAY NRO. 1060"
                          disabled={creating}
                        />
                      </FormField>

                      <FormField
                        label="Estado"
                        error={errors.estaActivo?.message}
                      >
                        <select
                          {...register("estaActivo")}
                          className={inputClassName(errors.estaActivo)}
                          disabled={creating}
                        >
                          <option value={true}>Activo</option>
                          <option value={false}>Inactivo</option>
                        </select>
                      </FormField>
                    </div>
                  </div>
                </form>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 p-6 bg-gray-50 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={creating}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={creating}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Guardar Trabajador
                      </>
                    )}
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

export default ModalAgregarTrabajador;
