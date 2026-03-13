import React from "react";
import type { Client } from "../types/classesInterfaces";
import { HiOutlineUser, HiChevronRight } from "react-icons/hi";

interface ClientCardProps {
  client: Client;
  onClick: (client: Client) => void;
}

function ClientCard({ client, onClick }: ClientCardProps) {
  return (
    <div
      onClick={() => onClick(client)}
      className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-300 cursor-pointer transition-all group flex flex-col h-full"
    >
      {/* Avatar e Info Principal */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold group-hover:bg-orange-500 group-hover:text-white transition-colors flex-shrink-0">
          {client.fullName.charAt(0)}
        </div>
        <div className="overflow-hidden">
          <h3 className="font-bold text-slate-800 truncate group-hover:text-orange-600 transition-colors">
            {client.fullName}
          </h3>
          <p className="text-xs text-slate-500 font-mono tracking-tighter">
            {client.dni}
          </p>
        </div>
      </div>
      {/* Datos de contacto */}
      <div className="space-y-2 flex-grow">
        <div className="flex items-center text-sm text-slate-600 gap-2">
          <span className="opacity-60">📞</span>
          <span>{client.phone}</span>
        </div>
        <div className="flex items-center text-sm text-slate-500 gap-2">
          <span className="opacity-60">📍</span>
          <span className="truncate">{client.address}</span>
        </div>
      </div>

      {/* Footer de la tarjeta */}
      <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center">
        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
          Alta: {new Date(client.createdAt).toLocaleDateString()}
        </span>
        <HiChevronRight className="text-orange-400 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}

export default ClientCard;
