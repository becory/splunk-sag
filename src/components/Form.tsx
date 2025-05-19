import { Dispatch, SetStateAction, useState } from "react";
import { CPUSelect } from "./inputs/CPUSelect";
import { MemoryInput } from "./inputs/MemoryInput";
import { CPUModel, HardwareConfig } from "../types/types";
import { Stack, Grid, Button } from "@mui/material";
import { GPUCheckbox } from "./inputs/GPUCheckbox";

interface FormProps {
  setChanged: Dispatch<SetStateAction<boolean>>;
  onSubmit: (hardwareConfig: HardwareConfig) => void;
}

export const Form = (props: FormProps) => {
  const { onSubmit, setChanged } = props;
  const [cpu, setCPU] = useState<CPUModel>(CPUModel.X86);
  const [memory, setMemory] = useState<number | undefined>();
  const [gpuAccelerator, setGpuAccelerator] = useState<boolean>(false);

  const handleSubmit = () => {
    onSubmit({ cpu, memorySize: memory ?? 0, gpuAccelerator });
    setChanged(false);
  };

  return (
    <Stack spacing={2}>
      <Grid size={3} display="flex" alignItems="center">
        <CPUSelect
          value={cpu}
          onChange={(event) => {
            setCPU(event.target.value);
            setChanged(true);
          }}
        />
      </Grid>
      <Grid size={3} display="flex" alignItems="center">
        <MemoryInput
          value={memory?.toString()}
          onChange={(value, isValid, numericValue) => {
            setMemory(numericValue);
            setChanged(true);
          }}
        />
      </Grid>
      <Grid size={3} display="flex" alignItems="center">
        <GPUCheckbox
          value={gpuAccelerator}
          onChange={(event) => {
            setGpuAccelerator(event.target.checked);
            setChanged(true);
          }}
        />
      </Grid>
      <Grid>
        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </Grid>
    </Stack>
  );
};
