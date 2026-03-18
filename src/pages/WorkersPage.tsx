import { FiEdit } from 'react-icons/fi';
import { HiOutlineTrash } from 'react-icons/hi';
import { FaPlusCircle, FaUsers } from 'react-icons/fa';

// Mock de datos
const MOCK_WORKERS = [
  { id: 1, name: 'Ana García', role: 'Administrador', email: 'ana@empresa.com' },
  { id: 2, name: 'Carlos Ruiz', role: 'SAT', email: 'carlos@empresa.com' },
  { id: 3, name: 'Lucía Fernández', role: 'SAC', email: 'lucia@empresa.com' },
];

function WorkersPage() {
  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans text-slate-900">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                <FaUsers size={24} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
              Gestión de Trabajadores
            </h1>
          </div>
          <p className="text-slate-500 ml-11">
            Panel de control para roles, accesos y permisos del personal.
          </p>
        </div>

        {/* Botón Nuevo Registro Estilo Orange */}
        <button
          onClick={() => console.log("Abrir modal")}
          className="hidden md:flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-200 transition-all active:scale-95 font-bold cursor-pointer"
        >
          <FaPlusCircle /> Nuevo Trabajador
        </button>
      </div>

      {/* Contenedor Principal de la Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Trabajador</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Rol de Acceso</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_WORKERS.map((worker) => (
                <tr key={worker.id} className="group hover:bg-slate-50/80 transition-all">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                            {worker.name.charAt(0)}
                        </div>
                        <div>
                            <div className="font-semibold text-slate-800">{worker.name}</div>
                            <div className="text-xs text-slate-400">{worker.email}</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                        {worker.role}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    {/* Botones de acción Estilo Solicitado */}
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={(e) => { e.stopPropagation(); console.log("Editar"); }}
                        className="p-2 text-slate-500 hover:text-orange-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all shadow-sm cursor-pointer bg-slate-50"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); console.log("Eliminar"); }}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all shadow-sm cursor-pointer bg-slate-50"
                      >
                        <HiOutlineTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer informativo */}
        <div className="bg-slate-50 p-4 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center uppercase tracking-widest font-semibold">
                Módulo de permisos en desarrollo
            </p>
        </div>
      </div>
    </div>
  );
}

export default WorkersPage;