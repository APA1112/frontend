import { useMemo, useState, useEffect } from "react";
import { useClients } from "../hooks/useClients";
import ClientCard from "./ClientCard";
import { FaPlusCircle } from "react-icons/fa";

function ClientsGrid() {
  const { clients, loading } = useClients();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [showLoader, setShowLoader] = useState(true);

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

  useEffect(() => {
    // Iniciamos un temporizador de 1 segundo
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer); // Limpieza
  }, []);

  // Combinamos: Se muestra si el hook dice loading O si no han pasado los 2 segundos
  if (loading || showLoader) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        {/* SVG Animado (Spinner) */}
        <svg
          className="animate-spin h-12 w-12 text-orange-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="text-lg font-medium text-slate-600 animate-pulse">
          Preparando listado de clientes...
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-screen gap-1 m-4">
      {/* Header con Buscador */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-4">
        <div className="w-full">
          <h1 className="text-2xl font-bold text-slate-800">Clientes</h1>
          <p className="text-sm text-slate-500">
            {filteredClients.length} encontrados
          </p>
        </div>

        <div className="flex flex-row gap-2 relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Buscar por nombre o DNI..."
            className="w-full pl-4 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none transition-all"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <button className="flex items-center justify-center gap-2 p-4 rounded-xl w-full bg-orange-300 hover:bg-orange-100 cursor-pointer">
            <FaPlusCircle />
            <span>Crear cliente</span>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto mt-0 rounded-xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
