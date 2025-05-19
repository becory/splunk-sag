import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Form } from "../components/Form";
import { CPUModel } from "../types/types";
import { setup } from "../utils/test";

describe("Form Component Tests", () => {
  const mockOnSubmit = jest.fn();
  const mockSetChanged = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockSetChanged.mockClear();
  });

  // test default value
  test("should initialize with default values", () => {
    render(<Form onSubmit={mockOnSubmit} setChanged={mockSetChanged} />);

    // check CPU default value: X86
    const cpuSelect = screen.getByLabelText(/CPU/i);
    expect(cpuSelect).toHaveTextContent("X86");

    // check GPU Accelerator is not checked
    const gpuCheckbox = screen.getByLabelText(/GPU Accelerator Card/i);
    expect(gpuCheckbox).not.toBeChecked();

    // check memory input is null
    const memoryInput = screen.getByLabelText(/Memory Size/i);
    expect(memoryInput).toHaveValue("");
  });

  test("should submit with memorySize=0 when memory input is empty", async () => {
    const { user } = setup(
      <Form onSubmit={mockOnSubmit} setChanged={mockSetChanged} />
    );

    const submitButton = screen.getByText("Submit");
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        memorySize: 0,
      })
    );
    expect(mockSetChanged).toHaveBeenCalledTimes(1);
  });

  // test Form submit
  test("should call onSubmit with correct hardware configuration when submitted", async () => {
    // render form
    const { user } = setup(
      <Form onSubmit={mockOnSubmit} setChanged={mockSetChanged} />
    );

    // select CPU
    const cpuSelect = screen.getByLabelText(/CPU/i);
    await user.click(cpuSelect);
    const powerOption = screen.getByText("Power");
    await user.click(powerOption);
    expect(mockSetChanged).toHaveBeenCalledTimes(1);

    // enter memory size (valid value)
    const memoryInput = screen.getByLabelText(/Memory Size/i);
    await user.type(memoryInput, "4096");
    expect(mockSetChanged).toHaveBeenCalledTimes(5);

    // select GPU Accelerator option
    const gpuCheckbox = screen.getByLabelText(/GPU Accelerator Card/i);
    await user.click(gpuCheckbox);
    expect(mockSetChanged).toHaveBeenCalledTimes(6);

    // click submit
    const submitButton = screen.getByText("Submit");
    await user.click(submitButton);
    expect(mockSetChanged).toHaveBeenCalledTimes(7);

    // validate onSubmit
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith({
      cpu: CPUModel.Power,
      memorySize: 4096,
      gpuAccelerator: true,
    });
  });

  test("should handle a complete user workflow with multiple changes", async () => {
    const { user } = setup(
      <Form onSubmit={mockOnSubmit} setChanged={mockSetChanged} />
    );

    // 1. select Power CPU
    const cpuSelect = screen.getByLabelText(/CPU/i);
    await user.click(cpuSelect);
    const powerOption = screen.getByText("Power");
    await user.click(powerOption);
    expect(mockSetChanged).toHaveBeenCalledTimes(1);

    // 2. enter a invalid memory size to display error message.
    const memoryInput = screen.getByLabelText(/Memory Size/i);
    await user.type(memoryInput, "3000");
    await waitFor(async () => {
      expect(screen.getByText(/multiple of 1024MB/i)).toBeInTheDocument();
    });
    expect(mockSetChanged).toHaveBeenCalledTimes(5);

    // change to valid memory size
    user.clear(memoryInput);
    await user.type(memoryInput, "4096");
    expect(mockSetChanged).toHaveBeenCalledTimes(10);

    // 3. checked GPU, unchecked GPU and Checked it again
    const gpuCheckbox = screen.getByLabelText(/GPU Accelerator Card/i);
    await user.click(gpuCheckbox); // checked
    await user.click(gpuCheckbox); // unchecked
    await user.click(gpuCheckbox); // Checked
    expect(mockSetChanged).toHaveBeenCalledTimes(13);

    // 4. submit form
    const submitButton = screen.getByText("Submit");
    await user.click(submitButton);

    // 5. validate the form value
    expect(mockOnSubmit).toHaveBeenCalledWith({
      cpu: CPUModel.Power,
      memorySize: 4096,
      gpuAccelerator: true,
    });
    expect(mockSetChanged).toHaveBeenCalledTimes(14);
  });

  test("should handle formatted memory input correctly", async () => {
    const { user } = setup(
      <Form onSubmit={mockOnSubmit} setChanged={mockSetChanged} />
    );

    const memoryInput = screen.getByLabelText(/Memory Size/i);
    await user.type(memoryInput, "524,288");
    expect(mockSetChanged).toHaveBeenCalledTimes(7);

    // submit
    const submitButton = screen.getByText("Submit");
    await user.click(submitButton);

    // validate the value type is number
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        memorySize: 524288,
      })
    );
    expect(mockSetChanged).toHaveBeenCalledTimes(8);
  });
});
