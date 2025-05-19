import React, { useState, useEffect } from "react";
import { InputAdornment, TextField } from "@mui/material";
import { validateMemoryInput, formatWithCommas } from "../../utils/validators";

interface MemoryInputProps {
  value: string | undefined;
  onChange: (value: string, isValid: boolean, numericValue?: number) => void;
}

export const MemoryInput: React.FC<MemoryInputProps> = ({
  value,
  onChange,
}) => {
  const [error, setError] = useState<string>("");
  const [internalValue, setInternalValue] = useState<string | undefined>(value);

  // Format initial value with commas if it's a valid number
  useEffect(() => {
    if (value && !isNaN(Number(value.replace(/,/g, "")))) {
      const numValue = parseInt(value.replace(/,/g, ""), 10);
      setInternalValue(formatWithCommas(numValue));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setInternalValue(input);

    // If input is empty, clear error but mark as invalid
    if (!input.trim()) {
      setError("");
      onChange(input, false);
      return;
    }

    const validation = validateMemoryInput(input);
    setError(validation.errorMessage);
    onChange(input, validation.isValid, validation.value);
  };

  const handleBlur = () => {
    // Format the input with commas when the field is blurred (if valid)
    if (internalValue && !error) {
      const numValue = parseInt(internalValue.replace(/,/g, ""), 10);
      setInternalValue(formatWithCommas(numValue));
    }
  };

  return (
    <TextField
      label="Memory Size (MB)"
      variant="outlined"
      fullWidth
      margin="normal"
      value={internalValue}
      onChange={handleChange}
      onBlur={handleBlur}
      error={!!error}
      helperText={error}
      placeholder="Example: 4,096"
      slotProps={{
        htmlInput: {
          "data-testid": "memory-input",
        },
        input: {
          endAdornment: <InputAdornment position="start">MB</InputAdornment>,
        },
      }}
    />
  );
};
