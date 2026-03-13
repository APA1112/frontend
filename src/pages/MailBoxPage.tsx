import TicketPreview from "../components/TicketPreview";
import TicketsGrid from "../components/TicketsGrid";
import { useActiveTickets } from "../hooks/useActiveTickets";
import { useState, useEffect } from "react";
import type { Ticket } from "../types/classesInterfaces";

function MailBoxPage() {
  const { tickets, loading } = useActiveTickets();
  const [showLoader, setShowLoader] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    // Iniciamos un temporizador de 1 segundo
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer); // Limpieza
  }, []);
  //Cuando la lista filtrada cambie, seleccionamos el primero
  useEffect(() => {
    if (filteredTickets.length > 0) {
      setSelectedTicket(filteredTickets[0]);
    } else {
      setSelectedTicket(null);
    }
  }, [filteredTickets]);

  // Combinamos: Se muestra si el hook dice loading O si no han pasado los 2 segundos
  if (loading || showLoader) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        {/* SVG Animado (Spinner) */}
        <svg
          className="animate-spin h-12 w-12 text-orange-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="text-lg font-medium text-slate-600 animate-pulse">
          Preparando buzón...
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-row w-full h-screen justify-between">
      <div className="flex flex-row gap-4 w-full">
        <TicketsGrid
          tickets={tickets}
          onSelectTicket={setSelectedTicket}
          onFilteredTicketsChange={setFilteredTickets}
        />
      </div>
      <div className="w-full h-full overflow-hidden mt-[-60px] mt-0">
        {selectedTicket ? (
          <TicketPreview ticket={selectedTicket} />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
            Selecciona un ticket para ver los detalles
          </div>
        )}
      </div>
    </div>
  );
}

export default MailBoxPage;
