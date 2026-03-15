import { useState, useEffect } from "react";
import type { Client } from "../types/classesInterfaces.ts";

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = "https://api.alepaton.dev/api/clients";

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setClients(data);
    } catch (err) {
      setError("Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  };
  // Función para crear un cliente (POST)
  const createClient = async (newClientData: Omit<Client, "id">) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClientData),
      });

      if (!res.ok) throw new Error("Error al crear el cliente");

      const createdClient = await res.json();

      // Actualizamos el estado local para que la UI se refresque sin recargar la página
      setClients((prev) => [...prev, createdClient]);
      return createdClient;
    } catch (err) {
      setError("No se pudo crear el cliente");
      throw err;
    }
  };
  useEffect(() => {
    fetchClients();
  }, []);

  return { clients, loading, error, createClient, refetch: fetchClients };
}
