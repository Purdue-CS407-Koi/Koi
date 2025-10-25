import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  type SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";

export const BudgetPanel = () => {
  const [value, setValue] = useState("default");

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
  };

  return (
    <div className="flex-2">
      <p className="text-xl font-medium">Budget</p>
      <FormControl fullWidth>
        <InputLabel id="dropdown-label">Choose an option</InputLabel>
        <Select
          labelId="dropdown-label"
          id="dropdown"
          value={value}
          label="Choose an option"
          onChange={handleChange}
        >
          <MenuItem value="default">Default</MenuItem>
          <MenuItem value="option1">Option 1</MenuItem>
          <MenuItem value="option2">Option 2</MenuItem>
          <MenuItem value="option3">Option 3</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};
