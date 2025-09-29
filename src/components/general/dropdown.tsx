import { useState } from "react";

interface DropdownProps {
  options: string[];
  selectedOption: string | null;
  setSelectedOption: (option: string) => void;
  customMessage?: string;
  defaultOption?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options, selectedOption, setSelectedOption, customMessage = "Select an option", defaultOption
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-48">
      <button
        onClick={() => setOpen(!open)}
        className="w-full border rounded px-3 py-2 text-left flex justify-between items-center"
      >
        {selectedOption || (defaultOption || customMessage)}
        <span className="ml-2">▼</span>
      </button>

      {open && (
        <ul className="absolute z-10 mt-1 w-full border rounded bg-white shadow-lg">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => {
                setSelectedOption(option);
                setOpen(false);
              }}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}