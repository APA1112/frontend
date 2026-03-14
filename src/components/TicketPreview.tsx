import { NavLink } from "react-router-dom";
import type { Ticket } from "../types/classesInterfaces";

interface TicketPreviwProps {
  ticket: Ticket;
}

function TicketPreview({ ticket }: TicketPreviwProps) {
  const clientName = ticket.service?.client?.fullName;

  // Helper para el color del badge de estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ABIERTO":
        return "bg-green-100 text-green-700 border-green-200";
      case "EN CURSO":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="hidden md:flex flex-col w-full max-w-4xl mx-auto my-8 bg-white shadow-lg rounded-2xl overflow-hidden border border-slate-200">
      {/* HEADER: Información principal */}
      <div className="bg-slate-50 p-6 border-b border-slate-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Cliente
            </span>
            <NavLink
              className="block text-2xl font-bold text-slate-800 hover:text-orange-500 transition-colors"
              to={`clients/${ticket.service?.client?.fullName}`}
            >
              {clientName}
            </NavLink>
          </div>
          <div className="text-right">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(ticket.status)}`}
            >
              {ticket.status}
            </span>
            <p className="text-slate-400 text-sm mt-1 font-mono">
              #BLV-{ticket.id}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm">Asunto</p>
          <p className="text-slate-800 font-medium">{ticket.subject}</p>
        </div>
      </div>

      {/* ACCIONES: Botones más intuitivos */}
      <div className="grid grid-cols-2 gap-4 p-6 bg-white">
        <button className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl font-semibold transition-all shadow-md active:scale-95 cursor-pointer">
          <span>🔄</span>
          {ticket.status === "ABIERTO"
            ? "Cambiar en curso"
            : ticket.status === "EN CURSO"
              ? "Cerrar con verficación"
              : "Cambiar en curso"}
        </button>
        <button className="flex items-center justify-center gap-2 border-2 border-slate-200 hover:bg-slate-50 text-slate-600 py-2.5 rounded-xl font-semibold transition-all cursor-pointer">
          <span>💬</span> Añadir Comentario
        </button>
      </div>

      {/* COMENTARIOS: Estilo de burbujas/timeline */}
      <div className="p-6 bg-slate-50 flex-1 overflow-y-auto max-h-[400px]">
        <h4 className="text-slate-700 font-bold mb-4 flex items-center gap-2">
          Comentarios{" "}
          <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full">
            {ticket.ticketComments?.length || 0}
          </span>
        </h4>

        <div className="space-y-4">
          {ticket.ticketComments?.map((comment, index) => (
            <div
              key={index} // Cambiado a index o comment.id para evitar duplicados
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-orange-600">
                  {comment.CreatorUser.email.split("@")[0]}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">
                {comment.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TicketPreview;
