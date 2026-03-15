// NewClientModal.tsx
import { useState } from "react";
import type { Client } from "../types/classesInterfaces.ts";
import {
  FaUser,
  FaIdCard,
  FaMapMarkerAlt,
  FaPhone,
  FaTimes,
} from "react-icons/fa";

interface NewClientProps {
  isOpen: boolean;
  onClose: () => void;
  // Usamos Omit para no pedir el ID, ya que lo genera la API
  onCreate: (client: Omit<Client, "id">) => Promise<any>;
}

function NewClientModal({ isOpen, onClose, onCreate }: NewClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    dni: "",
    fullName: "",
    address: "",
    phone: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const now = new Date();
      // Formato: 2025-03-07 00:49:44
      const createdAt = now.toISOString().replace("T", " ").split(".")[0];

      await onCreate({
        ...formData,
        createdAt: createdAt,
      });

      onClose(); // Solo cerramos si la creación fue exitosa
      setFormData({ dni: "", fullName: "", address: "", phone: "" }); // Reset
    } catch (err) {
      console.error("Error al guardar:", err);
      // Aquí podrías mostrar una alerta visual al usuario
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Tip de UX: Si es el DNI, lo pasamos a mayúsculas automáticamente
    const value =
      e.target.name === "dni" ? e.target.value.toUpperCase() : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-orange-500 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Registro de Cliente</h2>
            <button
              onClick={onClose}
              className="hover:rotate-90 transition-transform disabled:opacity-50"
              disabled={isSubmitting}
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Input DNI */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">
              DNI / NIE
            </label>
            <div className="relative">
              <FaIdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                required
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                placeholder="Ej: 12345678Z"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all text-slate-700"
              />
            </div>
          </div>

          {/* Input Nombre */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">
              Nombre Completo
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                required
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Juan Pérez García"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all text-slate-700"
              />
            </div>
          </div>

          {/* Input Dirección */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">
              Dirección
            </label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                required
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Calle, Ciudad, Provincia"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all text-slate-700"
              />
            </div>
          </div>

          {/* Input Teléfono */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">
              Teléfono
            </label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                required
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+34 600 000 000"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all text-slate-700"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl font-bold bg-orange-500 text-white shadow-lg shadow-orange-200 hover:bg-orange-600 active:scale-95 transition-all"
            >
              Guardar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewClientModal;
