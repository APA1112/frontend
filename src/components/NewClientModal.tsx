import type { Client } from "../types/classesInterfaces.ts";
import { FaTimes } from "react-icons/fa";
import ClientForm from "./ClientForm.tsx";

interface NewClientProps {
  isOpen: boolean;
  onClose: () => void;
  // Usamos Omit para no pedir el ID, ya que lo genera la API
  onCreate: (client: Omit<Client, "id">) => Promise<any>;
}

function NewClientModal({ isOpen, onClose, onCreate }: NewClientProps) {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-orange-500 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Registro de Cliente</h2>
            <button
              onClick={onClose}
              className="hover:rotate-90 transition-transform disabled:opacity-50 cursor-pointer"
            >
              <FaTimes />
            </button>
          </div>
        </div>
        {/* Formulario */}
        <ClientForm
          onCreate={onCreate}
          onClose={onClose}
        />
      </div>
    </div>
  );
}

export default NewClientModal;
