interface FtthFieldsProps {
  data: {
    ontMac: string;
    ponPort: string;
    splitterId: string;
    opticalPower: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function FtthFields({data, onChange}: FtthFieldsProps) {
  return (
    <div className="space-y-4 pt-4 border-t border-slate-200">
      <label className="text-xs font-bold text-slate-500 uppercase ml-1">
        MAC ONT
      </label>
      <div className="flex gap-2">
        <input
          required
          value={data.ontMac}
          onChange={onChange}
          name="ont_mac"
          placeholder="00:1e:c2:9e:28:6b"
          className="flex-1 p-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-orange-500"
        />
      </div>
      <label className="text-xs font-bold text-slate-500 uppercase ml-1">
        Puerto PON
      </label>
      <div className="flex gap-2">
        <input
          required
          value={data.ponPort}
          onChange={onChange}
          name="pon_port"
          placeholder="PON-XX"
          className="flex-1 p-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-orange-500"
        />
      </div>
      <label className="text-xs font-bold text-slate-500 uppercase ml-1">
        ID Splitter
      </label>
      <div className="flex gap-2">
        <input
          required
          value={data.splitterId}
          onChange={onChange}
          name="splitter_id"
          placeholder="SPL-XXX"
          className="flex-1 p-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-orange-500"
        />
      </div>
      <label className="text-xs font-bold text-slate-500 uppercase ml-1">
        Potencia óptica
      </label>
      <div className="flex gap-2">
        <input
          required
          value={data.opticalPower}
          onChange={onChange}
          name="optical_power"
          placeholder="-18"
          className="flex-1 p-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-orange-500"
        />
      </div>
    </div>
  )
}

export default FtthFields