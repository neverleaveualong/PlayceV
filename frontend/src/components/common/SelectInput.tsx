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
      <label className="mb-2 block font-semibold text-mainText">
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
        className="w-full p-2 border rounded-md hover:border-primary5 focus:border-primary5 focus:ring-1 focus:ring-primary1 focus:outline-none"
      >
        <option value="" className="text-mainText">
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
