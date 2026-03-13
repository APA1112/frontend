import { NavLink } from "react-router-dom";
import type { Ticket } from "../types/classesInterfaces";

interface TicketPreviwProps {
  ticket: Ticket;
}

function TicketPreview({ ticket }: TicketPreviwProps) {
  const clientName = ticket.service?.client?.fullName;
  return (
    <div className="hidden md:flex h-screen mt-16 text-center w-full flex-col rounded-xl gap-2 p-4">
      <div className="flex flex-col justify-start bg-orange-300 w-full rounded-xl p-4">
        <div className="flex justify-between m-4 p-4">
          <NavLink
            className="underline text-xl"
            to={`clients/${ticket.service.client.fullName}`}
          >
            {clientName}
          </NavLink>
          <p className="text-xl">BLV{ticket.id}</p>
        </div>
        <p className="mr-45">Asunto: {ticket.subject}</p>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <button className="bg-orange-300 w-full rounded-xl p-2 font-semibold cursor-pointer hover:bg-orange-100">
          {ticket.status === "ABIERTO"
            ? "Cambiar estado (en curso)"
            : ticket.status === "EN CURSO"
              ? "Cambiar estado (cerrado)"
              : "Cambiar estado (en curso)"}
        </button>
        <button className="bg-orange-300 w-full rounded-xl p-2 font-semibold cursor-pointer hover:bg-orange-100">
          Añadir comentario
        </button>
      </div>
      <div className="flex">
        {ticket.ticketComments?.map((ticketComment) => (
          <div
            key={ticket.id}
            className="flex flex-col border justify-start items-start p-4 rounded-xl"
          >
            <div>
              <span className="text-xl font-semibold">
                {ticketComment.CreatorUser.email}
              </span>
            </div>
            <div>
              <span>{ticketComment.comment}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">
                {new Date(ticket.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TicketPreview;
