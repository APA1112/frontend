import { FaTimes } from "react-icons/fa";
import type { Client } from "../types/classesInterfaces";

interface ViewClientProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
}

function ClientModal({ isOpen, onClose, client }: ViewClientProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-orange-500 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{client.fullName}</h2>
            <button
              onClick={onClose}
              className="hover:rotate-90 transition-transform disabled:opacity-50"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientModal;
