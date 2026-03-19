import { useState, useEffect } from "react";
import type { Client, Service } from "../types/classesInterfaces";
import Swal from "sweetalert2";
import WimaxFields from "./WimaxFields";
import FtthFields from "./FtthFields";

interface ServiceFormProps {
  client: Client;
  service?: Service;
  onCreate: (newService: {
    type: string;
    installAddress: string;
    clientId: string | number;
  }) => Promise<void>;
  onclose: () => void;
}

function ServiceForm({ client, onCreate, onclose, service }: ServiceFormProps) {
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
  const [technicalData, setTechnicalData] = useState({
    // Wimax
    antennaIp: "",
    antennaMac: "",
    apName: "",
    signalStrength: "",
    // FTTH
    ontMac: "",
    ponPort: "",
    splitterId: "",
    opticalPower: "",
  });

  const handleTechnicalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTechnicalData((prev) => ({
      ...prev,
      [name]: name === "signalStrength" ? Number(value) : value,
    }));
  };

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
  //UseEffect  para separar la dirección por comas
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
      // El formato guardado fue: "Vía Nombre, Nº, [Piso/Puerta], CP, Provincia, Ciudad"

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

  useEffect(() => {
    if (service) {
      setTechnicalData({
        antennaIp: service.antennaIp || "",
        antennaMac: service.antennaMac || "",
        apName: service.apName || "",
        signalStrength: service.signalStrength || "",
        ontMac: service.ontMac || "",
        ponPort: service.ponPort || "",
        splitterId: service.splitterId || "",
        opticalPower: service.opticalPower || "",
      });
    }
  }, [service]);

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setAddressFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  //Manejo del formulario tras el submit
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

      const specificFields =
        serviceType === "WIMAX"
          ? {
              antennaIp: technicalData.antennaIp,
              antennaMac: technicalData.antennaMac,
              apName: technicalData.apName,
              signalStrength: technicalData.signalStrength,
            }
          : {
              ontMac: technicalData.ontMac,
              ponPort: technicalData.ponPort,
              splitterId: technicalData.splitterId,
              opticalPower: technicalData.opticalPower,
            };

      if (service) {
        await onCreate({
          type: serviceType,
          installAddress: fullAddress,
          clientId: client.id,
          ...specificFields,
        });
      } else {
        await onCreate({
          type: serviceType,
          installAddress: fullAddress,
          clientId: client.id,
        });
      }

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
    <form
      onSubmit={handleSubmit}
      className="p-4 h-full flex flex-col overflow-hidden"
    >
      {/* Contenedor con scroll para evitar el desborde */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4">
        {/* FILA 1: Tipo y Estado (Solo si existe servicio) */}
        <div
          className={`grid ${service ? "grid-cols-2" : "grid-cols-1"} gap-3`}
        >
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
              Tipo
            </label>
            <select
              disabled={!!service}
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className={`w-full p-2 text-sm border rounded-xl outline-none transition-all ${
                !!service
                  ? "bg-slate-100 text-slate-400"
                  : "bg-white border-slate-200 focus:border-orange-500 cursor-pointer"
              }`}
            >
              <option value="WIMAX">Wimax</option>
              <option value="FTTH">Fibra</option>
            </select>
          </div>

          {service && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
                Estado
              </label>
              <select
                value={service.status} // Asegúrate de tener 'status' en technicalData o un estado propio
                name="status"
                className="w-full p-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="Activo">Activo</option>
                <option value="Suspendido">Suspendido</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
          )}
        </div>

        {/* SECCIÓN DIRECCIÓN (Compacta) */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
            Dirección de Instalación
          </label>

          <div className="flex gap-2">
            <select
              name="viaType"
              value={addressFields.viaType}
              onChange={handleAddressChange}
              className="w-24 p-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-500"
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
              className="flex-1 p-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <input
              required
              name="number"
              placeholder="Nº"
              value={addressFields.number}
              onChange={handleAddressChange}
              className="p-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-500"
            />
            <input
              name="floor"
              placeholder="Piso"
              value={addressFields.floor}
              onChange={handleAddressChange}
              className="p-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-500"
            />
            <input
              name="door"
              placeholder="Pta"
              value={addressFields.door}
              onChange={handleAddressChange}
              className="p-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <input
              required
              name="postalCode"
              placeholder="C.P."
              value={addressFields.postalCode}
              onChange={handleAddressChange}
              className="p-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-500"
            />
            <input
              required
              name="city"
              placeholder="Ciudad"
              value={addressFields.city}
              onChange={handleAddressChange}
              className="p-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-500"
            />
            <input
              required
              name="province"
              placeholder="Provincia"
              value={addressFields.province}
              onChange={handleAddressChange}
              className="p-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* SECCIÓN TÉCNICA (Compacta) */}
        {service && (
          <div className="pt-3 border-t border-slate-100">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 block mb-2">
              Detalles {service?.type}
            </label>
            {service?.type === "WIMAX" && (
              <WimaxFields
                data={technicalData}
                onChange={handleTechnicalChange}
              />
            )}
            {service?.type === "FTTH" && (
              <FtthFields
                data={technicalData}
                onChange={handleTechnicalChange}
              />
            )}
          </div>
        )}
      </div>

      {/* BOTONES (Fijos abajo) */}
      <div className="flex gap-3 pt-4 border-t border-slate-100 mt-4">
        <button
          type="button"
          onClick={onclose}
          className="flex-1 py-2.5 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-sm"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-2.5 font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-md disabled:bg-slate-300 transition-all cursor-pointer text-sm"
        >
          {isSubmitting ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}

export default ServiceForm;
