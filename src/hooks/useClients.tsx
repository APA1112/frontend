import { useState, useEffect } from "react";
import type { Client } from "../types/classesInterfaces.ts";

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://api.alepaton.dev/api/clients") // Ajusta el endpoint real
      .then((res) => res.json())
      .then((data) => {
        setClients(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Detalles del error:", err);
        setError("Error al cargar clientes");
        setLoading(false);
      });
  }, []);

  return { clients, loading, error };
}
