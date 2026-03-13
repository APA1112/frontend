import { useMemo, useState, useEffect } from "react";
import { useClients } from "../hooks/useClients";
import ClientCard from "./ClientCard";

function ClientsGrid() {
  const { clients } = useClients();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) setItemsPerPage(5);
      else if (width < 1024) setItemsPerPage(10);
      else setItemsPerPage(15);
    };

    handleResize(); // Ejecutar al cargar
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //Filtrado de clientes
  const filteredClients = useMemo(() => {
    return clients.filter(
      (client) =>
        client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.dni.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [clients, searchTerm]);

  //Paginación
  const totalPages = Math.ceil(clients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  return (
    <div className="flex flex-col h-screen gap-1 m-4">
      {/* Header con Buscador */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-2 gap-4">
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
      <div className="flex-1 overflow-y-auto mt-6 rounded-xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="grid lg:grid-cols-5 lg:grid-rows-3 md:grid-cols-2 lg:gap-6 md:gap-4 mt-10">
          {paginatedClients.map((client) => (
            <ClientCard key={client.dni} client={client} />
          ))}
        </div>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mb-10">
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
    </div>
  );
}

export default ClientsGrid;
