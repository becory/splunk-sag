import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { GPUCheckbox } from "./GPUCheckbox";
import { setup } from "../../utils/test";

describe("GPUCheckbox Component Tests", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders correctly with initial unchecked state", () => {
    render(<GPUCheckbox value={false} onChange={mockOnChange} />);

    const checkbox = screen.getByTestId("gpu-checkbox");
    expect(checkbox).toBeInTheDocument();

    expect(screen.getByText("GPU Accelerator Card")).toBeInTheDocument();

    expect(checkbox).not.toHaveClass("Mui-checked");
  });

  it("renders correctly with initial checked state", () => {
    render(<GPUCheckbox value={true} onChange={mockOnChange} />);

    const checkbox = screen.getByTestId("gpu-checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveClass("Mui-checked");
  });

  it("calls onChange handler when clicked", async () => {
    const { user } = setup(
      <GPUCheckbox value={false} onChange={mockOnChange} />
    );

    const checkbox = screen.getByTestId("gpu-checkbox");
    await user.click(checkbox);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("passes the correct event object to onChange handler", async () => {
    const { user } = setup(
      <GPUCheckbox value={false} onChange={mockOnChange} />
    );

    const checkbox = screen.getByTestId("gpu-checkbox");
    await user.click(checkbox);

    expect(mockOnChange.mock.calls[0][0]).toHaveProperty("target");
    expect(mockOnChange.mock.calls[0][1]).toBe(true);
  });

  it("clicking on the label triggers the onChange handler", async () => {
    const { user } = setup(
      <GPUCheckbox value={false} onChange={mockOnChange} />
    );

    const label = screen.getByText("GPU Accelerator Card");
    await user.click(label);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("correctly toggles from checked to unchecked", async () => {
    const { user, rerender } = setup(
      <GPUCheckbox value={true} onChange={mockOnChange} />
    );

    const checkbox = screen.getByTestId("gpu-checkbox");
    expect(checkbox).toHaveClass("Mui-checked");

    await user.click(checkbox);

    rerender(<GPUCheckbox value={false} onChange={mockOnChange} />);

    expect(checkbox).not.toHaveClass("Mui-checked");
  });
});
