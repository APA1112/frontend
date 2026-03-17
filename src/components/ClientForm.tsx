import { useState, useEffect } from "react";
import type { Client } from "../types/classesInterfaces.ts";
import { FaUser, FaIdCard, FaPhone } from "react-icons/fa";
import Swal from "sweetalert2";

interface NewClientProps {
  onClose: () => void;
  // Usamos Omit para no pedir el ID, ya que lo genera la API
  onCreate?: (client: Omit<Client, "id">) => Promise<any>;
  client?: Client;
}

function ClientForm({ onClose, onCreate, client }: NewClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    dni: client?.dni || "",
    fullName: client?.fullName || "",
    phone: client?.phone || "",
  });

  useEffect(() => {
    if (client?.address) {
      const parts = client.address.split(",").map((p) => p.trim());
      const firstPart = parts[0] || "";
      const spaceIndex = firstPart.indexOf(" ");

      const derivedViaType =
        spaceIndex !== -1 ? firstPart.substring(0, spaceIndex) : "Calle";
      const derivedViaName =
        spaceIndex !== -1 ? firstPart.substring(spaceIndex + 1) : firstPart;

      setAddressFields({
        viaType: derivedViaType,
        viaName: derivedViaName,
        number: parts[1] || "",
        floor: parts[2] || "",
        door: "",
        postalCode: parts[3] || "",
        city: parts[4] || "",
        province: "",
      });
    }
  }, [client]);

  const [addressFields, setAddressFields] = useState({
    viaType: "Calle", // Valor por defecto
    viaName: "",
    number: "",
    floor: "",
    door: "",
    postalCode: "",
    province: "",
    city: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (onCreate) {
        const now = new Date();
        const createdAt = now.toISOString().replace("T", " ").split(".")[0];
        const fullAddress = `${addressFields.viaType} ${addressFields.viaName} ${addressFields.number}${addressFields.floor ? ", " + addressFields.floor : ""}${addressFields.door ? addressFields.door : ""}, ${addressFields.postalCode}, ${addressFields.province}, ${addressFields.city}`;

        await onCreate({
          ...formData,
          address: fullAddress,
          createdAt: createdAt,
        });
      }

      onClose();
      setFormData({ dni: "", fullName: "", phone: "" }); // Reset
      setAddressFields({
        viaType: "Calle", // Valor por defecto
        viaName: "",
        number: "",
        floor: "",
        door: "",
        postalCode: "",
        province: "",
        city: "",
      });
      Swal.fire({
        title: "¡Creado!",
        text: "El cliente ha sido actualizado correctamente.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
        toast: true,
        position: "top-end",
      });
    } catch (err) {
      console.error("Error al guardar:", err);
      Swal.fire({
        title: "Ups, hubo un error",
        text: "No se pudo conectar con el servidor. Revisa los datos e intenta de nuevo.",
        icon: "error",
        confirmButtonColor: "#f97316",
        confirmButtonText: "Entendido",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.name === "dni" ? e.target.value.toUpperCase() : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setAddressFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
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
      <div className="pt-2 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">
          Dirección
        </label>

        <div className="space-y-3">
          {/* Fila 1: Tipo y Nombre de vía */}
          <div className="flex gap-2">
            <select
              name="viaType"
              value={addressFields.viaType}
              onChange={handleAddressChange}
              className="w-1/3 p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm"
            >
              <option value="Calle">Calle</option>
              <option value="Avda.">Avda.</option>
              <option value="Plaza">Plaza</option>
              <option value="Ctra.">Ctra.</option>
              <option value="Paseo">Paseo</option>
            </select>
            <input
              required
              name="viaName"
              placeholder="Nombre de la vía"
              value={addressFields.viaName}
              onChange={handleAddressChange}
              className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm"
            />
          </div>

          {/* Fila 2: Número, Piso y Puerta */}
          <div className="grid grid-cols-3 gap-2">
            <input
              required
              name="number"
              placeholder="Nº"
              value={addressFields.number}
              onChange={handleAddressChange}
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm"
            />
            <input
              name="floor"
              placeholder="Piso (opc)"
              value={addressFields.floor}
              onChange={handleAddressChange}
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm"
            />
            <input
              name="door"
              placeholder="Pta (opc)"
              value={addressFields.door}
              onChange={handleAddressChange}
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm"
            />
          </div>

          {/* Fila 3: CP, Provincia y Ciudad */}
          <div className="grid grid-cols-3 gap-2">
            <input
              required
              name="postalCode"
              placeholder="C.P."
              value={addressFields.postalCode}
              onChange={handleAddressChange}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm"
            />
            <input
              required
              name="province"
              placeholder="Provincia"
              value={addressFields.province}
              onChange={handleAddressChange}
              className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm"
            />
            <input
              required
              name="city"
              placeholder="Ciudad"
              value={addressFields.city}
              onChange={handleAddressChange}
              className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm"
            />
          </div>
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
          className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg transition-all cursor-pointer ${
            isSubmitting
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600 active:scale-95 shadow-orange-200"
          }`}
        >
          {isSubmitting ? "Guardando..." : "Guardar Cliente"}
        </button>
      </div>
    </form>
  );
}

export default ClientForm;
