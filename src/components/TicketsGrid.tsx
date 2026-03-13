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

  //Calculamos los tickets que tiene cada estado
  const counts = useMemo(() => {
    return {
      abiertos: tickets.filter((ticket) => ticket.status === "ABIERTO").length,
      enCurso: tickets.filter((ticket) => ticket.status === "EN CURSO").length,
      bloqueados: tickets.filter((ticket) => ticket.status === "BLOQUEADO")
        .length,
    };
  }, [tickets]);

  //Filtramos los tickets por su estado
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => ticket.status === filter);
  }, [tickets, filter]);

  useEffect(() => {
    onFilteredTicketsChange(filteredTickets);
  }, [filteredTickets, onFilteredTicketsChange]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col sm:flex-row justify-between p-4 gap-4 items-center">
        <button
          onClick={() => setFilter("ABIERTO")}
          className={`text-xl p-4 rounded-xl cursor-pointer w-full ${filter === "ABIERTO" ? "bg-orange-300" : "hover:bg-orange-100"}`}
        >
          {counts.abiertos} Abiertas
        </button>
        <button
          onClick={() => setFilter("EN CURSO")}
          className={`text-xl p-4 rounded-xl cursor-pointer w-full ${filter === "EN CURSO" ? "bg-orange-300" : "hover:bg-orange-100"}`}
        >
          {counts.enCurso} En curso
        </button>
        <button
          onClick={() => setFilter("BLOQUEADO")}
          className={`text-xl p-4 rounded-xl cursor-pointer w-full ${filter === "BLOQUEADO" ? "bg-orange-300" : "hover:bg-orange-100"}`}
        >
          {counts.bloqueados} Bloqueadas
        </button>
      </div>
      <div className="w-full h-screen max-h-screen overflow-y-auto flex flex-col gap-4 p-4 rounded-xl">
        {filteredTickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onClick={() => onSelectTicket(ticket)}
          />
        ))}
      </div>
    </div>
  );
}

export default TicketsGrid;
