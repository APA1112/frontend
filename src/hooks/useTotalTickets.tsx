import { useState, useEffect } from "react";
import type { Ticket } from "../types/classesInterfaces";

export function useTotalTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //Función para obtener todos los tickets
  useEffect(() => {
    fetch("https://api.alepaton.dev/api/tickets")
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

  return { tickets, loading, error };
}
