import TicketCard from "./TicketCard";
import type { Ticket } from "../types/classesInterfaces";
import { useMemo, useState, useEffect } from "react";

interface TicketsGridProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
  onFilteredTicketsChange: (tickets: Ticket[]) => void;
}

function TicketsGrid({ tickets, onSelectTicket, onFilteredTicketsChange }: TicketsGridProps) {
  const [filter, setFilter] = useState("ABIERTO");

  const counts = useMemo(() => ({
    ABIERTO: tickets.filter((t) => t.status === "ABIERTO").length,
    "EN CURSO": tickets.filter((t) => t.status === "EN CURSO").length,
    BLOQUEADO: tickets.filter((t) => t.status === "BLOQUEADO").length,
  }), [tickets]);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => ticket.status === filter);
  }, [tickets, filter]);

  useEffect(() => {
    onFilteredTicketsChange(filteredTickets);
  }, [filteredTickets, onFilteredTicketsChange]);

  const tabs = [
    { id: "ABIERTO", label: "Abiertas", color: "text-green-600", bg: "bg-green-100" },
    { id: "EN CURSO", label: "En curso", color: "text-blue-600", bg: "bg-blue-100" },
    { id: "BLOQUEADO", label: "Bloqueadas", color: "text-red-600", bg: "bg-red-100" },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 border-r border-slate-200">
      {/* HEADER DE FILTROS */}
      <div className="p-4 bg-white border-b border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4 px-1">Gestión de Tickets</h2>
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`
                flex flex-1 flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200
                ${filter === tab.id 
                  ? "bg-white shadow-md scale-[1.02] z-10" 
                  : "text-slate-500 hover:bg-slate-200/50"}
              `}
            >
              <span className={`text-lg font-bold ${filter === tab.id ? tab.color : "text-slate-600"}`}>
                {counts[tab.id as keyof typeof counts]}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-tighter">
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* LISTADO DE TICKETS */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <div 
              key={ticket.id} 
              className="transform transition-all hover:-translate-y-1 active:scale-[0.98]"
            >
              <TicketCard
                ticket={ticket}
                onClick={() => onSelectTicket(ticket)}
              />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 opacity-60">
            <span className="text-4xl mb-2">📁</span>
            <p className="font-medium text-sm">No hay tickets {filter.toLowerCase()}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketsGrid;