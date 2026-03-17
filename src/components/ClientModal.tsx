import { FaTimes, FaPlusCircle } from "react-icons/fa";
import type { Client } from "../types/classesInterfaces";
import Swal from "sweetalert2";
import { useState, useMemo } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { FiEdit } from "react-icons/fi";
import ServiceForm from "./ServiceForm";
import ClientForm from "./ClientForm";

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
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);

  const [selectedServiceIndex, setSelectedServiceIndex] = useState<
    number | null
  >(null);
  const [filter, setFilter] = useState("Activo");

  const handleClientDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Vas a eliminar a ${client.fullName}`,
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Sí, eliminar",
    });
    if (result.isConfirmed) {
      setIsDeleting(true);
      Swal.fire({
        title: "¡Eliminado!",
        text: "Cliente eliminado correctamente.",
        icon: "success",
        timer: 2000,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
      });
      try {
        await onDelete(client.id);
        onClose();
      } catch (err) {
        setIsDeleting(false);
      }
    }
  };

  const tabs = [
    {
      id: "Activo",
      label: "Activos",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      id: "Suspendido",
      label: "Suspendidos",
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    { id: "Baja", label: "Bajas", color: "text-red-600", bg: "bg-red-100" },
    {
      id: "Pendiente de Instalación",
      label: "En trámite",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
  ];
  const counts = useMemo(
    () => ({
      Activo: client.services?.filter((s) => s.status === "Activo").length,
      Suspendido: client.services?.filter((s) => s.status === "Suspendido")
        .length,
      Baja: client.services?.filter((s) => s.status === "Baja").length,
      "Pendiente de Instalación": client.services?.filter(
        (s) => s.status === "Pendiente de Instalación",
      ).length,
    }),
    [client.services],
  );

  const filteredServices = useMemo(() => {
    if (!client.services) return [];
    return client.services.filter((service) => service.status === filter);
  }, [client.services, filter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={`relative flex flex-row bg-white rounded-4xl shadow-2xl w-full transition-all duration-300 overflow-hidden animate-in fade-in zoom-in ${showServiceForm || showClientForm ? "max-w-6xl" : "max-w-2xl"}`}
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
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
                >
                  <HiOutlineTrash size={20} />
                </button>
                <button
                  onClick={() => {setShowClientForm(true); setShowServiceForm(false)}}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
                >
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
                  onClick={() => {setShowClientForm(false); setShowServiceForm(true)}}
                  className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-600 border border-orange-200 rounded-xl text-sm font-bold hover:bg-orange-100 transition-colors cursor-pointer"
                >
                  <FaPlusCircle /> Añadir Servicio
                </button>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-xl gap-1 mb-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id)}
                    className={`
                flex flex-1 flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200 cursor-pointer
                ${
                  filter === tab.id
                    ? "bg-white shadow-md scale-[1.02] z-10"
                    : "text-slate-500 hover:bg-slate-200/50"
                }
              `}
                  >
                    <span
                      className={`text-lg font-bold ${filter === tab.id ? tab.color : "text-slate-600"}`}
                    >
                      {counts[tab.id as keyof typeof counts]}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-tighter">
                      {tab.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {filteredServices?.map((service, index) => (
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
                        className={`h-2.5 w-2.5 rounded-full ${service.status === "Activo" ? "bg-green-600 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : service.status === "Suspendido" ? "bg-yellow-600 shadow-[0_0_8px_rgba(250,204,21,0.6)]" : service.status === "Baja" ? "bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.6)]" : "bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]"}`}
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
          className={`bg-slate-50 border-l border-slate-200 transition-all duration-300 ease-in-out ${showServiceForm || showClientForm ? "w-[450px] opacity-100" : "w-0 opacity-0 pointer-events-none"}`}
        >
          <div className="w-[450px] h-full flex flex-col">
            <div className="p-6 border-b border-slate-200 bg-white flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-lg">
                {showClientForm ? "Editar Cliente" : "Nuevo servicio"}
              </h3>
              <button
                onClick={() => {setShowServiceForm(false); setShowClientForm(false)}}
                className="text-slate-400 hover:text-slate-600 p-2 cursor-pointer transition-all hover:rotate-90"
              >
                <FaTimes />
              </button>
            </div>
            {showServiceForm ? (
              <ServiceForm
                client={client}
                onCreate={onCreate}
                onclose={() => setShowServiceForm(false)}
              />
            ) : showClientForm ? (
              <ClientForm onClose={()=> setShowClientForm(false)} client={client}/>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientModal;
