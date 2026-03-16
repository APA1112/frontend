import { useState, useEffect, useMemo } from "react";
import { useTotalTickets } from "../hooks/useTotalTickets";
import { FaTicketSimple } from "react-icons/fa6";

function HomePage() {
  const { tickets, loading: loadingTickets } = useTotalTickets();
  const [isSimulating, setIsSimulating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsSimulating(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const isLoading = isSimulating || loadingTickets;

  const stats = useMemo(() => {
  if (!tickets) return { total: 0, resueltos: 0, enRevision: 0 };

  return {
    total: tickets.length,
    resueltos: tickets.filter(t => t.status === "CERRADO").length,
    enRevision: tickets.filter(t => 
      t.status === "EN CURSO" || t.status === "BLOQUEADO" || t.status === "ABIERTO"
    ).length
  };
}, [tickets]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-gray-50/50">
      <div className="w-full max-w-4xl">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>
          <p className="text-gray-500 mt-2">
            Resumen general de tu actividad actual
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <StatCard
            label="Tickets registrados"
            value={stats.total}
            loading={isLoading}
            icon={<FaTicketSimple className="w-6 h-6 text-purple-600" />}
            color="bg-purple-50"
          />
          <StatCard
            label="Tickets resueltos"
            value={stats.resueltos}
            loading={isLoading}
            icon={<FaTicketSimple className="w-6 h-6 text-purple-600" />}
            color="bg-purple-50"
          />
          <StatCard
            label="Tickets en revisión"
            value={stats.enRevision}
            loading={isLoading}
            icon={<FaTicketSimple className="w-6 h-6 text-purple-600" />}
            color="bg-purple-50"
          />
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ label, value, loading, icon, color }: any) => {
  if (loading) return <SkeletonCard />;

  return (
    <div className="relative overflow-hidden bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col items-center transition-all hover:scale-[1.02] duration-300">
      {/* Decoración de fondo */}
      <div
        className={`absolute -top-4 -right-4 w-24 h-24 rounded-full ${color} opacity-50`}
      />

      <div className={`p-3 rounded-2xl ${color} mb-4`}>{icon}</div>

      <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
        {label}
      </span>

      <p className="text-7xl font-black text-gray-900 mt-2 animate-in fade-in zoom-in duration-500">
        {value ?? 0}
      </p>

      <div className="mt-6 px-4 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase">
        Actualizado hoy
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center animate-pulse">
    <div className="w-12 h-12 bg-gray-200 rounded-2xl mb-4" />
    <div className="h-4 w-32 bg-gray-200 rounded mb-6" />
    <div className="h-20 w-24 bg-gray-200 rounded-xl" />
    <div className="h-6 w-28 bg-gray-100 rounded-full mt-6" />
  </div>
);

export default HomePage;
