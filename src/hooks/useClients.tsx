import { useState, useCallback } from "react";
import type { Client } from "../types/classesInterfaces.ts";

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = "https://api.alepaton.dev/api/clients";

  //Función para obtener el cliente
  const searchClients = useCallback(async (query: string) => {
    if (query.length < 3) {
      setClients([]);
      return;
    }

    setLoading(true);
    try {
      // Fíjate en el cambio de URL: /api/clients/search?q=...
      const res = await fetch(
        `${API_URL}/search?q=${encodeURIComponent(query)}`,
      );
      const data = await res.json();
      setClients(data);
    } catch (err) {
      setError("Error en la búsqueda");
    } finally {
      setLoading(false);
    }
  }, []);

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
  // Función para eliminar un cliente (DELETE)
  const deleteClient = async (id: number | string) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

      if (!res.ok) throw new Error("No se puedo eliminar al cliente");
      // Actualización optimista: filtramos el cliente eliminado del estado local
      setClients((prev) => prev.filter((client) => client.id !== id));
    } catch (err) {
      setError("No se ha podido eliminar el cliente");
      throw err;
    }
  };

  return {
    clients,
    loading,
    error,
    createClient,
    deleteClient,
    searchClients,
    refetch: searchClients,
  };
}
