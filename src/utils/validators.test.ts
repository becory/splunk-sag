import { validateMemorySize, validateMemoryInput, formatWithCommas } from '../utils/validators';

describe('Format With Commas Tests', () => {
  test('should format numbers with commas correctly', () => {
    expect(formatWithCommas(1000)).toBe('1,000');
    expect(formatWithCommas(1000000)).toBe('1,000,000');
    expect(formatWithCommas(4096)).toBe('4,096');
    expect(formatWithCommas(524288)).toBe('524,288');
    expect(formatWithCommas(8388608)).toBe('8,388,608');
  });
  
  test('should handle small numbers without commas', () => {
    expect(formatWithCommas(100)).toBe('100');
    expect(formatWithCommas(999)).toBe('999');
  });
}); 
describe('Memory Size Tests', () => {
    test('should invalidate memory size that is less than 2,048MB', () => {
    const result = validateMemorySize(1024);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain("at least 2,048MB");
  });
  
  test('should invalidate memory size that exceeds 8,388,608MB', () => {
    const result = validateMemorySize(16777216); // 16 million
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain("must not exceed");
  });
  
  test('should invalidate memory size that is not a multiple of 1024', () => {
    const result = validateMemorySize(3000);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain("multiple of 1024MB");
  });
  
  test('should invalidate memory size that is not a power of 2', () => {
    const result = validateMemorySize(3072); // 3 * 1024, not a power of 2
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain("power of 2");
  });
  
  test('should accept valid power of 2 values', () => {
    // Test various valid powers of 2
    const validSizes = [2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576, 2097152, 4194304, 8388608];
    
    validSizes.forEach(size => {
      const result = validateMemorySize(size);
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBe("");
    });
  });
});

describe('Memory Input Validation Tests', () => {
  test('should validate properly formatted memory input', () => {
    const result = validateMemoryInput('4,096');
    expect(result.isValid).toBe(true);
    expect(result.value).toBe(4096);
  });
  
  test('should validate memory input without commas', () => {
    const result = validateMemoryInput('4096');
    expect(result.isValid).toBe(true);
    expect(result.value).toBe(4096);
  });
    test('should invalidate memory input with invalid characters', () => {
    const result = validateMemoryInput('4096x');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain("only digits and commas");
  });
  
  test('should invalidate memory input that is not a power of 2', () => {
    const result = validateMemoryInput('3,072');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain("power of 2");
  });
  
  test('should invalidate memory input below the minimum', () => {
    const result = validateMemoryInput('1,024');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain("at least 2,048MB");
  });
});