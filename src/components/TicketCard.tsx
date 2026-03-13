import type { Ticket } from "../types/classesInterfaces";

interface TicketCardProps {
  ticket: Ticket;
  onClick: () => void;
}

function TicketCard({ ticket, onClick }: TicketCardProps) {
  // 1. Extraer iniciales para el avatar (ej: "Lola Anaya" -> "LA")
  const clientName = ticket.service?.client?.fullName || "Sin Cliente";
  const initials = clientName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // 2. Obtener el último comentario (si existe)
  const lastComment =
    ticket.ticketComments && ticket.ticketComments.length > 0
      ? ticket.ticketComments[ticket.ticketComments.length - 1].comment
      : "Sin descripción disponible";

  return (
    <div
      onClick={onClick}
      className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-300 cursor-pointer transition-all group flex flex-col h-full w-full"
    >
      {/* INFO CLIENTE */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold group-hover:bg-orange-500 group-hover:text-white transition-colors shrink-0">
          {initials}
        </div>
        <div className="overflow-hidden flex justify-between items-center w-full gap-2">
          <div className="flex flex-col truncate">
            <h3 className="font-bold text-slate-800 truncate group-hover:text-orange-600 transition-colors">
              {clientName}
            </h3>
            <span className="text-xs text-slate-400 truncate">
              {ticket.subject}
            </span>
          </div>
          <h3 className="text-sm text-slate-500 font-mono tracking-tighter shrink-0">
            BLV{ticket.id}
          </h3>
        </div>
      </div>

      {/* PREVISUALIZACIÓN DEL ÚLTIMO COMENTARIO */}
      <div className="space-y-2 grow">
        <p className="text-slate-600 text-sm line-clamp-3 italic">
          "{lastComment}"
        </p>
      </div>

      {/* FECHA CREACION Y TAG ESTADO TICKET */}
      <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded text-black ${ticket.status === "ABIERTO" ? "bg-green-400" : ticket.status === "EN CURSO" ? "bg-blue-400" : "bg-yellow-400"}`}
        >
          {ticket.status}
        </span>
        <span className="text-[10px] text-slate-400">
          {new Date(ticket.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

export default TicketCard;
