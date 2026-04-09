import { useState } from "react";
import type { Service } from "../types/classesInterfaces";

export function useService() {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const API_POST_URL = "https://api.alepaton.dev/api/clients";
  const API_URL = "https://api.alepaton.dev/api/services";

  //Función para crear servicio
  const createService = async (
    newServiceData: Omit<Service, "id">,
    id: number | string,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_POST_URL}/${id}/services`, {
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

  //Función para editar el servicio
  const updateService = async (id: number | string, data: Partial<Service>) => {
    setIsLoading(true);
    setError(null);

    // Limpiamos los campos que gestiona el backend
    const { clientId, type, ...cleanData } = data as any;
    console.log("Datos enviados al backend:", cleanData);

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Error al actualizar el servicio");
      }

      const updatedService: Service = await res.json();

      // Actualizamos solo el servicio modificado en el estado local
      setServices((prev) =>
        prev.map((s) => (s.id === updatedService.id ? updatedService : s)),
      );

      return updatedService;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  //Función para eliminar servicio
  const deleteService = async (id: number | string) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("No se puedo eliminar al cliente");
  };
  return {
    services,
    error,
    isLoading,
    createService,
    setServices,
    deleteService,
    updateService,
  };
}
