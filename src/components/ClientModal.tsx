import { FaTimes, FaPlusCircle } from "react-icons/fa";
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
    viaType: "Calle",
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
      const parts = client.address.split(",").map((p) => p.trim());
      const firstPart = parts[0] || "";
      const spaceIndex = firstPart.indexOf(" ");

      const derivedViaType =
        spaceIndex !== -1 ? firstPart.substring(0, spaceIndex) : "Calle";
      const derivedViaName =
        spaceIndex !== -1 ? firstPart.substring(spaceIndex + 1) : firstPart;

      setAddressFields({
        viaType: derivedViaType,
        viaName: derivedViaName,
        number: parts[1] || "",
        floor: parts[2] || "",
        door: "",
        postalCode: parts[3] || "",
        city: parts[4] || "",
        province: "",
      });
    }
  }, [client]);

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setAddressFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
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

      await onCreate({
        type: serviceType,
        installAddress: fullAddress,
        clientId: client.id,
      });

      resetForm();
      Swal.fire({
        title: "¡Creado!",
        text: "Servicio registrado correctamente.",
        icon: "success",
        timer: 2000,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({ title: "Error", text: "No se pudo guardar.", icon: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClientDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Vas a eliminar a ${client.fullName}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Sí, eliminar",
    });
    if (result.isConfirmed) {
      setIsDeleting(true);
      try {
        await onDelete(client.id);
        onClose();
      } catch (err) {
        setIsDeleting(false);
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

      <div
        className={`relative flex flex-row bg-white rounded-4xl shadow-2xl w-full transition-all duration-300 overflow-hidden animate-in fade-in zoom-in ${showForm ? "max-w-6xl" : "max-w-2xl"}`}
      >
        {/* COLUMNA IZQUIERDA: INFORMACIÓN Y LISTA */}
        <div className="flex-1 flex flex-col min-h-[500px] max-h-[90vh] overflow-y-auto">
          {/* CABECERA */}
          <div className="bg-orange-500 p-6 text-white sticky top-0 z-20 shadow-md">
            <div className="flex flex-row justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">{client.fullName}</h2>
                <p className="text-orange-100 text-sm">Ficha del cliente</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClientDelete}
                  disabled={isDeleting}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <HiOutlineTrash size={20} />
                </button>
                <button className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                  <FiEdit size={20} />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:rotate-90 transition-transform cursor-pointer"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* INFO CLIENTE */}
            <div className="grid grid-cols-2 gap-6 pb-6 border-b border-slate-100">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  DNI
                </span>
                <span className="text-sm font-medium">{client.dni}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Teléfono
                </span>
                <span className="text-sm font-medium">{client.phone}</span>
              </div>
              <div className="flex flex-col col-span-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Dirección de Facturación
                </span>
                <span className="text-sm font-medium">{client.address}</span>
              </div>
            </div>

            {/* LISTADO SERVICIOS */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  Servicios{" "}
                  <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                    {client.services?.length || 0}
                  </span>
                </h3>
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-600 border border-orange-200 rounded-xl text-sm font-bold hover:bg-orange-100 transition-colors cursor-pointer"
                >
                  <FaPlusCircle /> Añadir
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
                    className={`flex flex-col p-4 bg-slate-50 border rounded-3xl hover:bg-slate-100 cursor-pointer transition-all ${selectedServiceIndex === index ? "border-orange-400 ring-1 ring-orange-400" : "border-slate-200"}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-slate-800">
                          {service.type}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {service.installAddress}
                        </p>
                      </div>
                      <div
                        className={`h-2.5 w-2.5 rounded-full ${service.status === "Activo" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500"}`}
                      />
                    </div>

                    {selectedServiceIndex === index && (
                      <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center animate-in slide-in-from-top-2 duration-200">
                        <div className="text-[10px] text-slate-400 font-mono space-y-0.5">
                          <p>IP: {service.antennaIp}</p>
                          <p>AP: {service.apName}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 text-slate-500 hover:text-orange-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all shadow-sm cursor-pointer"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all shadow-sm cursor-pointer"
                          >
                            <HiOutlineTrash size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: FORMULARIO (BANDEJA) */}
        <div
          className={`bg-slate-50 border-l border-slate-200 transition-all duration-300 ease-in-out ${showForm ? "w-[450px] opacity-100" : "w-0 opacity-0 pointer-events-none"}`}
        >
          <div className="w-[450px] h-full flex flex-col">
            <div className="p-6 border-b border-slate-200 bg-white flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-lg">
                Nuevo Servicio
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-600 p-2 cursor-pointer transition-all hover:rotate-90"
              >
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-6 overflow-y-auto"
            >
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                  Tipo de Servicio
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                >
                  <option value="WIMAX">Wimax</option>
                  <option value="FTTH">Fibra</option>
                </select>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-200">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                  Dirección de Instalación
                </label>
                <div className="flex gap-2">
                  <select
                    name="viaType"
                    value={addressFields.viaType}
                    onChange={handleAddressChange}
                    className="w-1/3 p-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-orange-500"
                  >
                    <option value="Calle">Calle</option>
                    <option value="Avda.">Avda.</option>
                    <option value="Plaza">Plaza</option>
                    <option value="Ctra.">Ctra.</option>
                  </select>
                  <input
                    required
                    name="viaName"
                    placeholder="Nombre de la vía"
                    value={addressFields.viaName}
                    onChange={handleAddressChange}
                    className="flex-1 p-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <input
                    required
                    name="number"
                    placeholder="Nº"
                    value={addressFields.number}
                    onChange={handleAddressChange}
                    className="p-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-orange-500"
                  />
                  <input
                    name="floor"
                    placeholder="Piso"
                    value={addressFields.floor}
                    onChange={handleAddressChange}
                    className="p-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-orange-500"
                  />
                  <input
                    name="door"
                    placeholder="Pta"
                    value={addressFields.door}
                    onChange={handleAddressChange}
                    className="p-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <input
                    required
                    name="postalCode"
                    placeholder="C.P."
                    value={addressFields.postalCode}
                    onChange={handleAddressChange}
                    className="p-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-orange-500"
                  />
                  <input
                    required
                    name="province"
                    placeholder="Provincia"
                    value={addressFields.province}
                    onChange={handleAddressChange}
                    className="p-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-orange-500"
                  />
                  <input
                    required
                    name="city"
                    placeholder="Ciudad"
                    value={addressFields.city}
                    onChange={handleAddressChange}
                    className="p-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6 mt-auto">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-200 rounded-2xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-2xl shadow-lg shadow-orange-200 disabled:bg-slate-300 transition-all cursor-pointer"
                >
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientModal;
