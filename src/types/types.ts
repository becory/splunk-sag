export enum CPUModel {
  X86 = "X86",
  Power = "Power",
  ARM = "ARM"
}

export enum ServerModel {
  TowerServer = "Tower Server",
  RackServer = "4U Rack Server",
  Mainframe = "Mainframe",
  HighDensityServer = "High Density Server"
}

export interface HardwareConfig {
  cpu: CPUModel;
  memorySize: number;
  gpuAccelerator: boolean;
}

export interface ConfigResult {
  matchingModels: ServerModel[] | null;
}