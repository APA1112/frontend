import type { Client } from "../types/classesInterfaces";

interface ModalProps {
  client: Client;
  onClose: () => void;
}

const ClientModal = ({ client, onClose }: ModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="bg-orange-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-xl"
          >
            ✕
          </button>
          <h2 className="text-xl font-bold">{client.fullName}</h2>
          <p className="opacity-90">{client.dni}</p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs uppercase font-bold text-slate-400">
              Dirección
            </label>
            <p className="text-slate-700">{client.address}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase font-bold text-slate-400">
                Teléfono
              </label>
              <p className="text-slate-700">{client.phone}</p>
            </div>
            <div>
              <label className="text-xs uppercase font-bold text-slate-400">
                Fecha de Alta
              </label>
              <p className="text-slate-700">
                {new Date(client.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div>
            <label className="text-xs uppercase font-bold text-slate-400">
              Servicios Contratados
            </label>
            <div className="flex flex-col gap-3 mt-2">
              {client.services.length > 0 ? (
                client.services.map((servicio, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-orange-600 text-sm italic">
                        {/* Accedemos a 'type', que según tu error existe en el objeto */}
                        {servicio.type || "Servicio"}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${servicio.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"}`}
                      >
                        {servicio.status}
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-1 gap-1 text-xs text-slate-600">
                      <p>
                        <strong>IP:</strong> {servicio.antennaIp}
                      </p>
                      <p>
                        <strong>MAC:</strong> {servicio.antennaMac}
                      </p>
                      <p>
                        <strong>Dirección:</strong> {servicio.installAddress}
                      </p>
                      <p>
                        <strong>Señal:</strong> {servicio.signalStrength} dBm
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400 italic">
                  Sin servicios activos
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientModal;
