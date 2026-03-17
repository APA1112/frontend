import { useState, useEffect } from "react";
import type { Client } from "../types/classesInterfaces";
import Swal from "sweetalert2";

interface ServiceFormProps {
  client: Client;
  onCreate: (newService: {
    type: string;
    installAddress: string;
    clientId: string | number;
  }) => Promise<void>;
  onclose: () => void;
}

function ServiceForm({ client, onCreate, onclose }: ServiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceType, setServiceType] = useState("WIMAX");
  const [addressFields, setAddressFields] = useState({
    viaType: "Calle",
    viaName: "",
    number: "",
    floor: "",
    door: "",
    postalCode: "",
    province: "",
    city: "",
  });

  const resetForm = () => {
    onclose();
    setServiceType("WIMAX");
    setAddressFields({
      viaType: "Calle",
      viaName: "",
      number: "",
      floor: "",
      door: "",
      postalCode: "",
      province: "",
      city: "",
    });
  };
  useEffect(() => {
    if (client?.address) {
      // 1. Limpiamos y separamos por comas
      const parts = client.address.split(",").map((p) => p.trim());

      // 2. Extraemos la primera parte (Tipo vía + Nombre)
      const firstPart = parts[0] || "";
      const spaceIndex = firstPart.indexOf(" ");
      const derivedViaType =
        spaceIndex !== -1 ? firstPart.substring(0, spaceIndex) : "Calle";
      const derivedViaName =
        spaceIndex !== -1 ? firstPart.substring(spaceIndex + 1) : firstPart;

      // 3. Lógica dinámica según el número de partes
      // Suponemos que el formato guardado fue: "Vía Nombre, Nº, [Piso/Puerta], CP, Provincia, Ciudad"

      const hasFloorDoor = parts.length > 5; // Si hay más de 5 partes, es que existe piso/puerta

      setAddressFields({
        viaType: derivedViaType,
        viaName: derivedViaName,
        number: parts[1] || "",
        // Si hay piso, está en la pos 2. Si no, dejamos vacío.
        floor: hasFloorDoor ? parts[2] : "",
        door: "", // Podrías intentar splitear parts[2] si guardas piso y puerta juntos
        // El CP suele ser el antepenúltimo o el que sigue al número
        postalCode: parts[parts.length - 3] || "",
        province: parts[parts.length - 2] || "",
        city: parts[parts.length - 1] || "",
      });
    }
  }, [client]);

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setAddressFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const {
        viaType,
        viaName,
        number,
        floor,
        door,
        postalCode,
        province,
        city,
      } = addressFields;
      const fullAddress = `${viaType} ${viaName}, ${number}${floor ? ", " + floor : ""}${door ? " " + door : ""}, ${postalCode}, ${city}, ${province}`;

      await onCreate({
        type: serviceType,
        installAddress: fullAddress,
        clientId: client.id,
      });

      resetForm();
      Swal.fire({
        title: "¡Creado!",
        text: "Servicio registrado correctamente.",
        icon: "success",
        timer: 2000,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({ title: "Error", text: "No se pudo guardar.", icon: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">
          Tipo de Servicio
        </label>
        <select
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          className="w-full p-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
        >
          <option value="WIMAX">Wimax</option>
          <option value="FTTH">Fibra</option>
        </select>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-200">
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">
          Dirección de Instalación
        </label>
        <div className="flex gap-2">
          <select
            name="viaType"
            value={addressFields.viaType}
            onChange={handleAddressChange}
            className="w-1/3 p-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-orange-500"
          >
            <option value="Calle">Calle</option>
            <option value="Avda.">Avda.</option>
            <option value="Plaza">Plaza</option>
            <option value="Ctra.">Ctra.</option>
          </select>
          <input
            required
            name="viaName"
            placeholder="Nombre de la vía"
            value={addressFields.viaName}
            onChange={handleAddressChange}
            className="flex-1 p-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-orange-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <input
            required
            name="number"
            placeholder="Nº"
            value={addressFields.number}
            onChange={handleAddressChange}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-orange-500"
          />
          <input
            name="floor"
            placeholder="Piso"
            value={addressFields.floor}
            onChange={handleAddressChange}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-orange-500"
          />
          <input
            name="door"
            placeholder="Pta"
            value={addressFields.door}
            onChange={handleAddressChange}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-orange-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <input
            required
            name="postalCode"
            placeholder="C.P."
            value={addressFields.postalCode}
            onChange={handleAddressChange}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-orange-500"
          />
          <input
            required
            name="province"
            placeholder="Provincia"
            value={addressFields.province}
            onChange={handleAddressChange}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-orange-500"
          />
          <input
            required
            name="city"
            placeholder="Ciudad"
            value={addressFields.city}
            onChange={handleAddressChange}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-orange-500"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-6 mt-auto">
        <button
          type="button"
          onClick={onclose}
          className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-200 rounded-2xl transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-2xl shadow-lg shadow-orange-200 disabled:bg-slate-300 transition-all cursor-pointer"
        >
          {isSubmitting ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}

export default ServiceForm;
