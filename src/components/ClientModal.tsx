import { FaTimes, FaPlusCircle } from "react-icons/fa";
import type { Client } from "../types/classesInterfaces";
import Swal from "sweetalert2";
import { useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { FiEdit } from "react-icons/fi";

interface ViewClientProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
  onDelete: (id: number | string) => Promise<void>;
}

function ClientModal({ isOpen, onClose, client, onDelete }: ViewClientProps) {
  const [isDeleting, setIsDeleting] = useState(false);
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

      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl min-h-[400px] overflow-hidden animate-in fade-in zoom-in duration-200">
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
        <div className="space-y-6 p-2">
          {/* Cabecera: Nombre y DNI */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {client.fullName}
            </h2>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">
              DNI: <span className="text-gray-700">{client.dni}</span>
            </p>
          </div>

          {/* Información de Contacto (Grid para mejor uso del espacio) */}
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
                Servicios Contratados
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                  {client.services?.length || 0}
                </span>
              </h3>
              <button className="flex items-center gap-2 p-2 border rounded-2xl cursor-pointer">
                <FaPlusCircle className="text-lg" />
                Añadir servicio
              </button>
            </div>

            <div className="space-y-3">
              {client.services?.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">
                      {service.type}
                    </span>
                    <span className="text-xs text-gray-500 font-mono italic">
                      {service.antennaIp}
                    </span>
                    <span className="text-xs text-gray-500 font-mono italic">
                      {service.signalStrength} dBm
                    </span>
                    <span className="text-xs text-gray-500 font-mono italic">
                      {service.apName}
                    </span>
                    <span className="text-xs text-gray-500 font-mono italic">
                      {service.installAddress}
                    </span>
                    <span className="text-xs text-gray-500 font-mono italic">
                      {service.status}
                    </span>
                  </div>
                  <div
                    className={`h-2 w-2 rounded-full ${service.status === "Activo" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : service.status === "Suspendido" ? "bg-yellow-500" : "bg-red-500"} `}
                    title="Activo"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientModal;
