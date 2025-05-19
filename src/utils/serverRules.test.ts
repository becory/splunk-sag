import { CPUModel, ServerModel } from '../types/types';
import { decideServerModels } from './serverRules';

describe('Server Rules Tests', () => {
  // Rule 4: Any model must not have lower than 2,048MB memory
  test('should return null when memory is less than 2,048MB', () => {
    const config = {
      cpu: CPUModel.X86,
      memorySize: 1024,
      gpuAccelerator: false
    };
    
    const result = decideServerModels(config);
    expect(result).toBeNull();
  });
  
  // Rule 1: GPU Accelerator Card requirements
  test('should return High Density Server when GPU is selected with ARM CPU and sufficient memory', () => {
    const config = {
      cpu: CPUModel.ARM,
      memorySize: 524288,
      gpuAccelerator: true
    };
    
    const result = decideServerModels(config);
    expect(result).toEqual([ServerModel.HighDensityServer]);
  });
  
  test('should return null when GPU is selected but CPU is not ARM', () => {
    const config = {
      cpu: CPUModel.X86,
      memorySize: 524288,
      gpuAccelerator: true
    };
    
    const result = decideServerModels(config);
    expect(result).toBeNull();
  });
  
  test('should return null when GPU is selected with ARM CPU but insufficient memory', () => {
    const config = {
      cpu: CPUModel.ARM,
      memorySize: 262144, // Less than required 524,288MB
      gpuAccelerator: true
    };
    
    const result = decideServerModels(config);
    expect(result).toBeNull();
  });
  
  // Rule 2: Mainframe requirements
  test('should include Mainframe when Power CPU is selected', () => {
    const config = {
      cpu: CPUModel.Power,
      memorySize: 131072,
      gpuAccelerator: false
    };
    
    const result = decideServerModels(config);
    expect(result).toContain(ServerModel.Mainframe);
  });
  
  // Rule 3: Memory size determining Tower Server and 4U Rack Server
  test('should return Tower Server when memory is less than 131,072MB', () => {
    const config = {
      cpu: CPUModel.X86,
      memorySize: 65536, // Less than 131,072MB
      gpuAccelerator: false
    };
    
    const result = decideServerModels(config);
    expect(result).toEqual([ServerModel.TowerServer]);
  });
  
  test('should return Tower Server and 4U Rack Server when memory is at least 131,072MB', () => {
    const config = {
      cpu: CPUModel.X86,
      memorySize: 131072,
      gpuAccelerator: false
    };
    
    const result = decideServerModels(config);
    expect(result).toContain(ServerModel.TowerServer);
    expect(result).toContain(ServerModel.RackServer);
  });
  
  // Test cases from requirements
  test('example 1: Power CPU, 1,024MB memory, no GPU should return No Options', () => {
    const config = {
      cpu: CPUModel.Power,
      memorySize: 1024,
      gpuAccelerator: false
    };
    
    const result = decideServerModels(config);
    expect(result).toBeNull();
  });
  
  test('example 2: Power CPU, 262,144MB memory, no GPU should return Tower Server, 4U Rack, and Mainframe', () => {
    const config = {
      cpu: CPUModel.Power,
      memorySize: 262144,
      gpuAccelerator: false
    };
    
    const result = decideServerModels(config);
    expect(result).toContain(ServerModel.TowerServer);
    expect(result).toContain(ServerModel.RackServer);
    expect(result).toContain(ServerModel.Mainframe);
  });
  
  test('example 3: X86 CPU, 524,288MB memory, no GPU should return Tower Server and 4U Rack Server', () => {
    const config = {
      cpu: CPUModel.X86,
      memorySize: 524288,
      gpuAccelerator: false
    };
    
    const result = decideServerModels(config);
    expect(result).toEqual([ServerModel.TowerServer, ServerModel.RackServer]);
  });
  
  test('example 4: ARM CPU, 524,288MB memory, with GPU should return High Density Server', () => {
    const config = {
      cpu: CPUModel.ARM,
      memorySize: 524288,
      gpuAccelerator: true
    };
    
    const result = decideServerModels(config);
    expect(result).toEqual([ServerModel.HighDensityServer]);
  });
});