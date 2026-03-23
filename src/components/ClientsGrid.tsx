import { useState, useEffect } from "react";
import { useClients } from "../hooks/useClients";
import { useService } from "../hooks/useService";
import ClientCard from "./ClientCard";
import NewClientModal from "./NewClientModal";
import ClientModal from "./ClientModal";
import { FaPlusCircle, FaSearch, FaTimes, FaUsers } from "react-icons/fa";
import type { Client } from "../types/classesInterfaces";

function ClientsGrid() {
  const { clients, loading, createClient, deleteClient, searchClients, updateClient } =
    useClients();
  const { createService, updateService } = useService();
  const [searchTerm, setSearchTerm] = useState("");
  const [modalNewClient, setModalNewClient] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const handleCreateService = async (serviceData: any) => {
    await createService(serviceData, selectedClient!.id);
    // Refrescamos la búsqueda actual para traer los datos actualizados del servidor
    searchClients(searchTerm);
  };
  useEffect(() => {
    if (selectedClient) {
      const updated = clients.find((c) => c.id === selectedClient.id);
      if (updated) {
        setSelectedClient(updated);
      }
    }
  }, [clients]);

  // Umbral para activar la búsqueda
  const isSearching = searchTerm.trim().length >= 3;

  useEffect(() => {
    if (!isSearching) return;
    const timer = setTimeout(() => {
      searchClients(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, searchClients, isSearching]);

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-6 py-8 shadow-sm">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                Directorio de Clientes
              </h1>
              <p className="text-slate-500">
                Busca en la base de datos global de la empresa
              </p>
            </div>
            <button
              onClick={() => setModalNewClient(true)}
              className="hidden md:flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-lg transition-all active:scale-95 font-bold"
            >
              <FaPlusCircle /> Nuevo Registro
            </button>
          </div>

          <div className="relative group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              value={searchTerm}
              placeholder="Escribe un DNI para buscar..."
              className="w-full pl-12 pr-12 py-4 bg-slate-100 border-2 border-transparent focus:bg-white focus:border-orange-500 rounded-2xl transition-all outline-none text-lg shadow-inner"
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <FaTimes size={20} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* CONTENIDO DINÁMICO */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-400 mx-auto h-full">
          {/* CASO 1: No se ha buscado nada aún */}
          {!isSearching && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
                <FaUsers size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-700">
                  Buscador de Clientes
                </h3>
                <p className="text-slate-500">
                  Escribe al menos 3 caracteres para consultar la base de datos.
                </p>
              </div>
            </div>
          )}

          {/* CASO 2: Buscando (Loading) */}
          {isSearching && loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 bg-slate-200 animate-pulse rounded-2xl"
                />
              ))}
            </div>
          )}

          {/* CASO 3: Resultados encontrados */}
          {isSearching && !loading && clients.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {clients.map((client) => (
                <ClientCard
                  key={client.id || client.dni} // Prioriza ID si existe
                  client={client}
                  onClick={() => setSelectedClient(client)}
                />
              ))}
            </div>
          )}

          {/* CASO 4: Búsqueda sin resultados */}
          {isSearching && !loading && clients.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-5xl mb-4">🔎</div>
              <h3 className="text-xl font-bold text-slate-700">
                Sin resultados
              </h3>
              <p className="text-slate-500">
                No encontramos clientes que coincidan con "{searchTerm}"
              </p>
            </div>
          )}
        </div>
      </main>

      {/* MODALES */}
      <NewClientModal
        isOpen={modalNewClient}
        onClose={() => setModalNewClient(false)}
        onCreate={createClient}
      />
      {selectedClient && (
        <ClientModal
          isOpen={!!selectedClient}
          onClose={() => setSelectedClient(null)}
          client={selectedClient}
          onDelete={deleteClient}
          onCreate={handleCreateService}
          onUpdate={updateClient}
          onUpdateService={updateService}
        />
      )}
    </div>
  );
}

export default ClientsGrid;
