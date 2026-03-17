import { FaTimes, FaPlusCircle, FaEdit } from "react-icons/fa";
import type { Client } from "../types/classesInterfaces";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { FiEdit } from "react-icons/fi";

interface ViewClientProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
  onDelete: (id: number | string) => Promise<void>;
  onCreate: (newService: {
    type: string;
    installAddress: string;
    clientId: string | number;
  }) => Promise<void>;
}

function ClientModal({
  isOpen,
  onClose,
  client,
  onDelete,
  onCreate,
}: ViewClientProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceType, setServiceType] = useState("WIMAX");
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<
    number | null
  >(null);

  const [addressFields, setAddressFields] = useState({
    viaType: "Calle", // Valor por defecto
    viaName: "",
    number: "",
    floor: "",
    door: "",
    postalCode: "",
    province: "",
    city: "",
  });

  const resetForm = () => {
    setShowForm(false);
    setServiceType("WIMAX");
    setAddressFields({
      viaType: "Calle",
      viaName: "",
      number: "",
      floor: "",
      door: "",
      postalCode: "",
      province: "",
      city: "",
    });
  };

  useEffect(() => {
    if (client?.address) {
      // 1. Separamos el string por comas y limpiamos espacios
      const parts = client.address.split(",").map((p) => p.trim());

      // 2. Extraemos el tipo de vía (primera palabra) y el nombre (resto)
      const firstPart = parts[0] || "";
      const spaceIndex = firstPart.indexOf(" ");

      const derivedViaType =
        spaceIndex !== -1 ? firstPart.substring(0, spaceIndex) : "Calle";
      const derivedViaName =
        spaceIndex !== -1 ? firstPart.substring(spaceIndex + 1) : firstPart;

      // 3. Seteamos el estado para que el formulario se autollene
      setAddressFields({
        viaType: derivedViaType,
        viaName: derivedViaName,
        number: parts[1] || "",
        floor: parts[2] || "",
        door: "", // Si tu string no tiene puerta separada, se deja para el usuario
        postalCode: parts[3] || "",
        city: parts[4] || "",
        province: "", // Se puede rellenar manualmente o por lógica de CP
      });
    }
  }, [client]); // Se ejecuta cada vez que el cliente cambie

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setAddressFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Construcción limpia de la dirección
      const {
        viaType,
        viaName,
        number,
        floor,
        door,
        postalCode,
        province,
        city,
      } = addressFields;
      const fullAddress = `${viaType} ${viaName}, ${number}${floor ? ", " + floor : ""}${door ? " " + door : ""}, ${postalCode}, ${city}, ${province}`;

      // 2. Enviamos solo lo que la API pide + el ID del cliente
      await onCreate({
        type: serviceType,
        installAddress: fullAddress,
        clientId: client.id,
      });

      resetForm();
      onClose();
      Swal.fire({
        title: "¡Creado!",
        text: "El servicio ha sido registrado correctamente.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
        toast: true,
        position: "top-end",
      });
    } catch (err) {
      console.error("Error al guardar:", err);
      Swal.fire({
        title: "Ups, hubo un error",
        text: "No se pudo conectar con el servidor. Revisa los datos e intenta de nuevo.",
        icon: "error",
        confirmButtonColor: "#f97316",
        confirmButtonText: "Entendido",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Vas a eliminar a ${client.fullName}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      setIsDeleting(true);
      try {
        await onDelete(client.id);
        Swal.fire({
          title: "¡Logrado!",
          text: "Cliente eliminado correctamente",
          icon: "success",
          iconColor: "#10b981", // Emerald-500
          confirmButtonColor: "#f97316", // Orange-500
        });
      } catch (err) {
        setIsDeleting(false);
        Swal.fire({
          title: "Error",
          text: "No pudimos procesar la solicitud",
          icon: "error",
          confirmButtonColor: "#f97316",
        });
      }
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-4xl shadow-2xl w-full max-w-2xl min-h-[400px] overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-orange-500 p-8 text-white">
          <div className="flex flex-row justify-between items-center gap-2">
            <div>
              <h2 className="text-xl font-bold">{client.fullName}</h2>
              <p className="text-oragne-100">Ficha del cliente</p>
            </div>
            {/*BOTONES*/}
            <div className="flex flex-col-reverse md:flex-row items-center gap-4">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors text-sm font-bold cursor-pointer"
                title="Eliminar cliente"
              >
                <HiOutlineTrash size={18} />
                Eliminar
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors text-sm font-bold cursor-pointer">
                <FiEdit size={18} />
                Editar
              </button>
              <button
                onClick={onClose}
                className="hover:rotate-90 transition-transform disabled:opacity-50 cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        </div>
        {/*INFORMACIÓN*/}
        <div className="space-y-6 p-4">
          {/* Cabecera: Nombre y DNI */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {client.fullName}
            </h2>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">
              DNI: <span className="text-gray-700">{client.dni}</span>
            </p>
          </div>

          {/* Información de Contacto */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col">
              <span className="text-gray-400 font-semibold uppercase text-[10px]">
                Teléfono
              </span>
              <span className="text-gray-700">{client.phone}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 font-semibold uppercase text-[10px]">
                Fecha de Alta
              </span>
              <span className="text-gray-700">
                {new Date(client.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex flex-col col-span-2">
              <span className="text-gray-400 font-semibold uppercase text-[10px]">
                Dirección facturación
              </span>
              <span className="text-gray-700">{client.address}</span>
            </div>
          </div>

          {/* Sección de Servicios con Cards */}
          <div>
            <div className="flex justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                Servicios
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                  {client.services?.length || 0}
                </span>
              </h3>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 p-2 border rounded-2xl cursor-pointer"
              >
                <FaPlusCircle className="text-lg" />
                Añadir servicio
              </button>
            </div>

            <div className="space-y-3">
              {client.services?.map((service, index) => (
                <div
                  key={index}
                  onClick={() =>
                    setSelectedServiceIndex(
                      selectedServiceIndex === index ? null : index,
                    )
                  }
                  // Cambiamos a flex-col para que los hijos se apilen verticalmente
                  className={`flex flex-col p-3 bg-gray-50 border rounded-4xl hover:bg-gray-100 cursor-pointer active:scale-98 transition-all ${
                    selectedServiceIndex === index ? "border-blue-400" : ""
                  }`}
                >
                  {/* Contenedor Superior: Info y Punto de estado */}
                  <div className="flex items-start justify-between w-full">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">
                        {service.type}
                      </span>
                      <span className="text-xs text-gray-500 font-mono italic">
                        IP antena: {service.antennaIp}
                      </span>
                      <span className="text-xs text-gray-500 font-mono italic">
                        Señal: {service.signalStrength} dBm
                      </span>
                      <span className="text-xs text-gray-500 font-mono italic">
                        SSID Repetidor: {service.apName}
                      </span>
                      <span className="text-xs text-gray-500 font-mono italic">
                        Dirección instalción: {service.installAddress}
                      </span>
                      <span className="text-xs text-gray-500 font-mono italic">
                        Estado: {service.status}
                      </span>
                    </div>

                    <div
                      className={`h-2 w-2 mt-2 rounded-full ${
                        service.status === "Activo"
                          ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                          : service.status === "Suspendido"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      } `}
                      title={service.status}
                    />
                  </div>

                  {/* --- BOTÓN CONDICIONAL (Abajo) --- */}
                  {selectedServiceIndex === index && (
                    <div className="mt-3 pt-3 border-t border-gray-200 flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Evita que el clic dispare el onClick del padre
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors text-sm font-bold cursor-pointer"
                        title="Eliminar cliente"
                      >
                        <HiOutlineTrash size={18} />
                        Eliminar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Evita que el clic dispare el onClick del padre
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors text-sm font-bold cursor-pointer"
                      >
                        <FiEdit size={18} />
                        Editar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/*FORMULARIO NUEVO SERVICIO*/}
            {showForm && (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                      Tipo de servicio
                    </label>
                    <select
                      name="serviceType"
                      value={addressFields.viaType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-1/3 p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm"
                    >
                      <option value="WIMAX">Wimax</option>
                      <option value="FTTH">Fibra</option>
                    </select>
                  </div>

                  {/* Input Dirección */}
                  <div className="pt-2 border-t border-slate-100">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                      Dirección
                    </label>

                    <div className="space-y-3">
                      {/* Fila 1: Tipo y Nombre de vía */}
                      <div className="flex gap-2">
                        <select
                          name="viaType"
                          value={addressFields.viaType}
                          onChange={handleAddressChange}
                          className="w-1/3 p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm"
                        >
                          <option value="Calle">Calle</option>
                          <option value="Avda.">Avda.</option>
                          <option value="Plaza">Plaza</option>
                          <option value="Ctra.">Ctra.</option>
                          <option value="Paseo">Paseo</option>
                        </select>
                        <input
                          required
                          name="viaName"
                          placeholder="Nombre de la vía"
                          value={addressFields.viaName}
                          onChange={handleAddressChange}
                          className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm"
                        />
                      </div>

                      {/* Fila 2: Número, Piso y Puerta */}
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          required
                          name="number"
                          placeholder="Nº"
                          value={addressFields.number}
                          onChange={handleAddressChange}
                          className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm"
                        />
                        <input
                          name="floor"
                          placeholder="Piso (opc)"
                          value={addressFields.floor}
                          onChange={handleAddressChange}
                          className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm"
                        />
                        <input
                          name="door"
                          placeholder="Pta (opc)"
                          value={addressFields.door}
                          onChange={handleAddressChange}
                          className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm"
                        />
                      </div>

                      {/* Fila 3: CP, Provincia y Ciudad */}
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          required
                          name="postalCode"
                          placeholder="C.P."
                          value={addressFields.postalCode}
                          onChange={handleAddressChange}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm"
                        />
                        <input
                          required
                          name="province"
                          placeholder="Provincia"
                          value={addressFields.province}
                          onChange={handleAddressChange}
                          className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm"
                        />
                        <input
                          required
                          name="city"
                          placeholder="Ciudad"
                          value={addressFields.city}
                          onChange={handleAddressChange}
                          className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Botones de acción */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg transition-all cursor-pointer ${
                        isSubmitting
                          ? "bg-slate-400 cursor-not-allowed"
                          : "bg-orange-500 hover:bg-orange-600 active:scale-95 shadow-orange-200"
                      }`}
                    >
                      {isSubmitting ? "Guardando..." : "Guardar Servicio"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientModal;
