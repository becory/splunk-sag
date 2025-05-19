import { Checkbox, FormControl, FormControlLabel } from "@mui/material";

interface GPUCheckboxProps {
  value: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const GPUCheckbox = (props: GPUCheckboxProps) => {
  const { value, onChange } = props;

  return (
    <FormControl variant="outlined" fullWidth margin="normal">
      <FormControlLabel
        control={
          <Checkbox
            data-testid="gpu-checkbox"
            value={value}
            onChange={onChange}
            checked={value}
          />
        }
        label="GPU Accelerator Card"
      />
    </FormControl>
  );
};
