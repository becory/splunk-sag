export const validateMemorySize = (memorySize: number): { isValid: boolean; errorMessage: string } => {
  if (isNaN(memorySize)) {
    return { isValid: false, errorMessage: "Memory size must be a number" };
  }

  if (!Number.isInteger(memorySize)) {
    return { isValid: false, errorMessage: "Memory size must be an integer" };
  }

  if (memorySize < 2048) {
    return { isValid: false, errorMessage: "Memory size must be at least 2,048MB" };
  }

  if (memorySize > 8388608) {
    return { isValid: false, errorMessage: "Memory size must not exceed 8,388,608MB" };
  }

  if (memorySize % 1024 !== 0) {
    return { isValid: false, errorMessage: "Memory size must be a multiple of 1024MB" };
  }

  const log2 = Math.log2(memorySize);
  if (!Number.isInteger(log2)) {
    return { isValid: false, errorMessage: "Memory size must be a power of 2" };
  }

  return { isValid: true, errorMessage: "" };
};

export const validateMemoryInput = (input: string): { isValid: boolean; errorMessage: string; value?: number } => {
  const cleanedInput = input.replace(/,/g, "");
  
  if (!/^\d+$/.test(cleanedInput)) {
    return { isValid: false, errorMessage: "Memory size must contain only digits and commas" };
  }
  
  const numericValue = parseInt(cleanedInput, 10);
  const memoryValidation = validateMemorySize(numericValue);
  
  return {
    isValid: memoryValidation.isValid,
    errorMessage: memoryValidation.errorMessage,
    value: memoryValidation.isValid ? numericValue : undefined
  };
};

export const formatWithCommas = (value: number): string => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};