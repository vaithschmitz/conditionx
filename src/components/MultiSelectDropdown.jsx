import { useState, useRef } from 'react';

export default function MultiSelectDropdown({ label, options, selected, onChange, showLabel = true }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleOption = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="relative">
      {showLabel && <label className="block font-medium mb-1">{label}</label>}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="w-full border rounded p-2 cursor-pointer bg-white"
      >
        {selected.length > 0 ? selected.join(', ') : `Select ${label}`}
      </div>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white border rounded shadow"
        >
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggleOption(option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
