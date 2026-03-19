interface WimaxFieldsProps {
  data: {
    antennaIp: string;
    antennaMac: string;
    apName: string;
    signalStrength: number | string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function WimaxForm({ data, onChange }: WimaxFieldsProps) {
  return (
    <div className="space-y-4 border-t border-slate-200">
      <label className="text-xs font-bold text-slate-500 uppercase ml-1">
        MAC Antena
      </label>
      <div className="flex gap-2">
        <input
          required
          value={data.antennaMac}
          onChange={onChange}
          name="antenna_mac"
          placeholder="00:1e:c2:9e:28:6b"
          className="flex-1 p-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-orange-500"
        />
      </div>
      <label className="text-xs font-bold text-slate-500 uppercase ml-1">
        IP Antena
      </label>
      <div className="flex gap-2">
        <input
          required
          value={data.antennaIp}
          onChange={onChange}
          name="antenna_ip"
          placeholder="10.135.131.68"
          className="flex-1 p-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-orange-500"
        />
      </div>
      <label className="text-xs font-bold text-slate-500 uppercase ml-1">
        SSID Repetidor
      </label>
      <div className="flex gap-2">
        <input
          required
          value={data.apName}
          onChange={onChange}
          name="ap_name"
          placeholder="AP 450 Los Jopos"
          className="flex-1 p-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-orange-500"
        />
      </div>
      <label className="text-xs font-bold text-slate-500 uppercase ml-1">
        Señal
      </label>
      <div className="flex gap-2">
        <input
          required
          value={data.signalStrength}
          onChange={onChange}
          name="signal_strength"
          placeholder="-78"
          className="flex-1 p-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-orange-500"
        />
      </div>
    </div>
  );
}

export default WimaxForm;
