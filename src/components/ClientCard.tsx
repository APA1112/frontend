import { useState } from "react";
import type { Client } from "../types/classesInterfaces";
import {
  HiChevronRight,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineTrash
} from "react-icons/hi";

interface ClientCardProps {
  client: Client;
  onDelete: (id: number | string) => Promise<void>;
}

function ClientCard({ client, onDelete }: ClientCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`¿Estás seguro de eliminar a ${client.fullName}? ${client.id}`)) {
      setIsDeleting(true);
      try {
        await onDelete(client.id);
      } catch (err) {
        setIsDeleting(false);
        alert("No se pudo eliminar al cliente");
      }
    }
  };

  return (
    <div className="bg-white w-full p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-orange-100/50 hover:-translate-y-1 cursor-pointer transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
      {/* Botón Eliminar Absoluto */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
        title="Eliminar cliente"
      >
        <HiOutlineTrash size={18} />
      </button>
      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-500 opacity-50" />

      {/* Cabecera: Avatar e Identificación */}
      <div className="flex items-start gap-4 mb-5 relative z-10">
        <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-orange-200 group-hover:rotate-3 transition-transform">
          {client.fullName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-slate-800 text-lg leading-tight truncate group-hover:text-orange-600 transition-colors">
              {client.fullName}
            </h3>
          </div>
          <span className="inline-block px-2 py-0.5 mt-1 bg-slate-100 text-slate-500 text-[10px] font-mono rounded uppercase tracking-wider">
            ID: {client.dni}
          </span>
        </div>
      </div>

      {/* Cuerpo: Información de Contacto con Iconos */}
      <div className="space-y-3 grow relative z-10">
        <div className="flex items-center text-sm text-slate-600 gap-3 group/item hover:text-orange-600 transition-colors">
          <div className="p-2 bg-slate-50 rounded-lg group-hover/item:bg-orange-100 transition-colors">
            <HiOutlinePhone className="text-slate-400 group-hover/item:text-orange-600" />
          </div>
          <span className="font-medium">{client.phone}</span>
        </div>

        <div className="flex items-center text-sm text-slate-600 gap-3">
          <div className="p-2 bg-slate-50 rounded-lg">
            <HiOutlineLocationMarker className="text-slate-400" />
          </div>
          <span className="truncate italic text-slate-500">
            {client.address}
          </span>
        </div>
      </div>

      {/* Footer: Meta-información y Call to Action */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center relative z-10">
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">
            Fecha de Registro
          </span>
          <span className="text-xs text-slate-600 font-medium">
            {new Date(client.createdAt).toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="flex items-center gap-2 bg-orange-50 text-orange-600 py-1.5 px-3 rounded-xl font-bold text-xs group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
          Ficha
          <HiChevronRight className="text-lg group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}

export default ClientCard;
