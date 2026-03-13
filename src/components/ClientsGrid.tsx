import React, { useState, useMemo } from "react";
import { useClients } from "../hooks/useClients";
import type { Client } from "../types/classesInterfaces.ts";
import ClientModal from "../components/ClientModal.tsx";
import ClientCard from "./ClientCard.tsx";

const ITEMS_PER_PAGE = 10;

const ClientsGrid = () => {
  const { clients, loading, error } = useClients();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // 1. Lógica de Búsqueda
  const filteredClients = useMemo(() => {
    return clients.filter(
      (client) =>
        client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.dni.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [clients, searchTerm]);

  // 2. Lógica de Paginación
  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  if (loading)
    return (
      <div className="p-10 text-center text-orange-500">
        Cargando clientes...
      </div>
    );

  return (
    <div className="p-6 bg-slate-50 min-h-screen w-full">
      {/* Header con Buscador */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Clientes</h1>
          <p className="text-sm text-slate-500">
            {filteredClients.length} encontrados
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Buscar por nombre o DNI..."
            className="w-full pl-4 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none transition-all"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Grid de Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedClients.map((client) => (
          <ClientCard 
            key={client.dni} 
            client={client} 
            onClick={setSelectedClient} // Pasamos la función para abrir el modal
          />
        ))}
      </div>

      {/* Paginación Simple */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-4 py-2 bg-white border border-slate-300 rounded-md disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="px-4 py-2 text-slate-600 font-medium">
            Página {currentPage} de {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 bg-white border border-slate-300 rounded-md disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Modal Condicional */}
      {selectedClient && (
        <ClientModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )}
    </div>
  );
};

export default ClientsGrid;
