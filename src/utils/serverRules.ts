import { CPUModel, HardwareConfig, ServerModel } from "../types/types";

/**
 * Decide which server models match the given hardware configuration based on the rules.
 * 
 * 1. When select GPU Accelerator Card, only High Density
 * Server would be available. And the memory must be greater
 * or equal to 524,288MB. And CPU must be ARM.
 * 2. Mainframe can only build with Power CPU, memory size
 * limitation is applied on Rule 4. And Power CPU can build
 * other Server Models except High Density.
 * 3. Memory size greater or equal to 131,072MB can be both 4U
 * Rack Server and Tower Server. Lower than that can only be
 * Tower Server.
 * 4. Any Model must not have a lower than 2,048MB memory.
 * Lower than that would be “No Options”.
 * 5. If there is no Server Model match the input, need to show
 * “No Options”
 * 
 * @param config The hardware configuration to evaluate
 * @returns Array of matching server models or null if none match
 */

export const decideServerModels = (config: HardwareConfig): ServerModel[] | null => {
  const { cpu, memorySize, gpuAccelerator } = config;
  const eligibleModels: ServerModel[] = [];

  // Rule 4: Memory must be at least 2,048MB
  if (memorySize < 2048) {
    return null;
  }
  
  // Rule 1: GPU Accelerator Card case
  if (gpuAccelerator) {
    // GPU needs ARM CPU and at least 524,288MB memory
    if (cpu === CPUModel.ARM && memorySize >= 524288) {
      return [ServerModel.HighDensityServer];
    } else {
      return null;
    }
  }
  
  // Rule 2: Power CPU can build Mainframe and other models except High Density
  if (cpu === CPUModel.Power) {
    eligibleModels.push(ServerModel.Mainframe);
  }
  
  // Rule 3: Memory size determining Tower Server and 4U Rack Server
  if (memorySize >= 131072) {
    eligibleModels.push(ServerModel.TowerServer, ServerModel.RackServer);
  } else {
    eligibleModels.push(ServerModel.TowerServer);
  }
  
  // Rule 5: If no models match, return null
  if (eligibleModels.length === 0) {
    return null;
  }
  
  return eligibleModels;
};