import { useState, useEffect } from "react";
import type { Ticket } from "../types/classesInterfaces";

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://api.alepaton.dev/api/tickets/mailbox")
      .then((res) => res.json())
      .then((data) => {
        setTickets(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Detalles del error:", err);
        setError("Error al cargar clientes");
        setLoading(false);
      });
  }, []);
  console.log(tickets)

  return { tickets, loading, error };
}
