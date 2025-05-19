import {
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
  FormControl,
} from "@mui/material";
import { CPUModel } from "../../types/types";

interface CPUSelectProps {
  value: CPUModel;
  onChange: (event: SelectChangeEvent<CPUModel>) => void;
}

export const CPUSelect = (props: CPUSelectProps) => {
  const { value, onChange } = props;

  return (
    <FormControl variant="outlined" fullWidth margin="normal">
      <InputLabel id="cpu-select-label">CPU</InputLabel>
      <Select
        labelId="cpu-select-label"
        id="cpu-select"
        value={value}
        label="CPU Model"
        onChange={onChange}
        data-testid="cpu-select"
      >
        {Object.keys(CPUModel).map((item) => (
          <MenuItem value={item} key={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
