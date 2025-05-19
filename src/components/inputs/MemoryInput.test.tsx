import { render, screen } from "@testing-library/react";
import { setup } from "../../utils/test";
import { MemoryInput } from "./MemoryInput";

describe("MemoryInput Component Tests", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders with correct initial state", () => {
    render(<MemoryInput value="" onChange={mockOnChange} />);

    // check rendered
    const inputElement = screen.getByTestId("memory-input");
    expect(inputElement).toBeInTheDocument();
  });

  it("should format initial value with commas", () => {
    render(<MemoryInput value="4096" onChange={mockOnChange} />);

    // Input should show formatted value
    const inputElement = screen.getByTestId("memory-input");
    expect(inputElement).toHaveValue("4,096");
  });

  it("should handle valid input correctly", async () => {
    const { user } = setup(<MemoryInput value="" onChange={mockOnChange} />);

    // Enter a valid memory size
    const inputElement = screen.getByTestId("memory-input");
    await user.type(inputElement, "8192");

    // Should call onChange with valid=true
    expect(mockOnChange).toHaveBeenCalledWith("8192", true, 8192);
  });

  it("should reject input that is not a power of 2", async () => {
    const { user } = setup(<MemoryInput value="" onChange={mockOnChange} />);

    // Enter a valid memory size
    const inputElement = screen.getByTestId("memory-input");
    await user.type(inputElement, "3072");

    // Should call onChange with valid=false
    const lastCall =
      mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1];
    expect(lastCall[0]).toBe("3072");
    expect(lastCall[1]).toBe(false);

    // Error message should be displayed
    expect(screen.getByText(/power of 2/i)).toBeInTheDocument();
  });

  it("should reject input below minimum size", async () => {
    const { user } = setup(<MemoryInput value="" onChange={mockOnChange} />);

    // Enter a memory size below the minimum
    const inputElement = screen.getByTestId("memory-input");
    await user.type(inputElement, "1024");

    const lastCall =
      mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1];
    expect(lastCall[0]).toBe("1024");
    expect(lastCall[1]).toBe(false);

    // Error message should be displayed
    expect(screen.getByText(/at least 2,048MB/i)).toBeInTheDocument();
  });

  it("should reject input that is not a multiple of 1024", async () => {
    const { user } = setup(<MemoryInput value="" onChange={mockOnChange} />);

    // Enter a memory size below the minimum
    const inputElement = screen.getByTestId("memory-input");

    // Enter a memory size that's not a multiple of 1024
    await user.type(inputElement, "5000");

    // Should call onChange with valid=false
    const lastCall =
      mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1];
    expect(lastCall[0]).toBe("5000");
    expect(lastCall[1]).toBe(false);

    // Error message should be displayed
    expect(screen.getByText(/multiple of 1024MB/i)).toBeInTheDocument();
  });
});
