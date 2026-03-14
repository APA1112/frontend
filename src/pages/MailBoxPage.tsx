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
    const timer = setTimeout(() => setShowLoader(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (filteredTickets.length > 0) {
      // Solo auto-seleccionar si no hay uno ya seleccionado o si el seleccionado ya no está en la lista
      if (!selectedTicket || !filteredTickets.find(t => t.id === selectedTicket.id)) {
        setSelectedTicket(filteredTickets[0]);
      }
    } else {
      setSelectedTicket(null);
    }
  }, [filteredTickets]);

  if (loading || showLoader) {
    return (
      <div className="flex h-screen bg-slate-50">
        {/* Skeleton de la barra lateral */}
        <div className="w-1/3 border-r border-slate-200 p-4 space-y-4 bg-white">
          <div className="h-10 bg-slate-200 animate-pulse rounded-lg w-full" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-xl" />
          ))}
        </div>
        {/* Skeleton del detalle */}
        <div className="flex-1 p-8 space-y-6">
          <div className="h-12 bg-slate-200 animate-pulse rounded-lg w-1/2" />
          <div className="h-64 bg-slate-100 animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* PANEL IZQUIERDO: Listado de Tickets (Ancho fijo o proporcional) */}
      <aside className="w-full md:w-[380px] lg:w-[420px] shrink-0 bg-white border-r border-slate-200 shadow-xl z-10">
        <TicketsGrid
          tickets={tickets}
          onSelectTicket={setSelectedTicket}
          onFilteredTicketsChange={setFilteredTickets}
        />
      </aside>

      {/* PANEL DERECHO: Previsualización de Detalle */}
      <main className="flex-1 relative overflow-y-auto bg-slate-100/50">
        {selectedTicket ? (
          <div className="p-6 max-w-5xl mx-auto">
             <TicketPreview ticket={selectedTicket} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full px-4 text-center">
            <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-4 text-4xl">
              📬
            </div>
            <h3 className="text-xl font-bold text-slate-700">Tu bandeja de entrada</h3>
            <p className="text-slate-500 max-w-xs mt-2">
              Selecciona un ticket de la lista de la izquierda para ver su historial y responder.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default MailBoxPage;