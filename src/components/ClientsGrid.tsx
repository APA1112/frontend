import { useMemo, useState, useEffect } from "react";
import { useClients } from "../hooks/useClients";
import ClientCard from "./ClientCard";
import NewClientModal from "./NewClientModal";
import { FaPlusCircle, FaSearch, FaTimes } from "react-icons/fa";

function ClientsGrid() {
  const { clients, loading, createClient, deleteClient } = useClients();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [showLoader, setShowLoader] = useState(true);
  const [modal, setModal] = useState(false);

  // Responsive items per page
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) setItemsPerPage(5);
      else if (width < 1024) setItemsPerPage(10);
      else setItemsPerPage(15);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredClients = useMemo(() => {
    return clients.filter(
      (client) =>
        client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.dni.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [clients, searchTerm]);

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const toggleModal = () => {
    setModal(!modal);
  };

  // Skeleton Loader Component
  if (loading || showLoader) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="h-10 bg-slate-200 rounded w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(itemsPerPage)].map((_, i) => (
            <div
              key={i}
              className="h-48 bg-slate-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* HEADER & TOOLBAR */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Directorio de Clientes
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Gestionando{" "}
              <span className="text-orange-600">{filteredClients.length}</span>{" "}
              clientes activos
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                placeholder="Buscar por nombre o DNI..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-100 border-transparent focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-100 rounded-xl transition-all outline-none text-sm"
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            <button
              onClick={toggleModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-200 transition-all active:scale-95 font-bold text-sm"
            >
              <FaPlusCircle className="text-lg" />
              <span className="hidden sm:inline">Nuevo Cliente</span>
            </button>
          </div>
        </div>
      </header>

      {/* GRID CONTENT */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1600px] mx-auto">
          {filteredClients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {paginatedClients.map((client) => (
                <ClientCard key={client.dni} client={client} onDelete={deleteClient}/>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-slate-700">
                No hay coincidencias
              </h3>
              <p className="text-slate-500 mb-6">
                Prueba con otros términos o crea un nuevo registro.
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="text-orange-600 font-bold hover:underline"
              >
                Limpiar búsqueda
              </button>
            </div>
          )}
        </div>
      </main>

      {/* PAGINACIÓN FOOTER */}
      {totalPages > 1 && (
        <footer className="bg-white border-t border-slate-200 p-4">
          <div className="flex items-center justify-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
            >
              Anterior
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              // Lógica simple para no mostrar 50 botones si hay muchas páginas
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-bold transition-all ${
                      currentPage === page
                        ? "bg-orange-500 text-white shadow-md scale-110"
                        : "text-slate-600 hover:bg-orange-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              }
              return null;
            })}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
            >
              Siguiente
            </button>
          </div>
        </footer>
      )}
      {/*MODAL CREACIÓN DE CLIENTES*/}
      {modal && (
        <NewClientModal isOpen={modal} onClose={() => setModal(false)} onCreate={createClient}/>
      )}
    </div>
  );
}

export default ClientsGrid;
