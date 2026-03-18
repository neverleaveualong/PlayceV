interface SelectInputProps {
  label: string;
  placeholder: string;
  value: number | "";
  options: { id: number; name: string }[];
  onChange: (id: number, name: string) => void;
  disabled?: boolean;
}

const SelectInput = ({
  label,
  placeholder,
  value,
  options,
  onChange,
  disabled,
}: SelectInputProps) => {
  return (
    <div>
      <label className="block mb-1.5 text-xs font-semibold text-darkgray">
        {label} <span className="text-red-500">*</span>
      </label>
      <select
        value={value}
        onChange={(e) => {
          const selectedId = Number(e.target.value);
          const selectedName =
            options.find((o) => o.id === selectedId)?.name || "";
          onChange(selectedId, selectedName);
        }}
        disabled={disabled}
        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-mainText bg-white hover:border-primary5 focus:border-primary5 focus:ring-2 focus:ring-primary1 focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-400 appearance-none"
      >
        <option value="" className="text-gray-400">
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
