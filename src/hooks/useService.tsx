import { useState } from "react";
import type { Service } from "../types/classesInterfaces";

export function useService() {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const API_URL = "https://api.alepaton.dev/api/clients";

  const createService = async (
    newServiceData: Omit<Service, "id">,
    id: number | string,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/${id}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newServiceData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al crear el servicio");
      }

      const createdService = await res.json();
      // Actualizamos el estado local para que la UI se refresque sin recargar la página
      setServices((prev) => [...prev, createdService]);
      return createdService;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false); // Se ejecuta tanto si sale bien como si sale mal
    }
  };
  return { services, error, isLoading, createService, setServices };
}
