import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Form } from "../components/Form";
import { CPUModel } from "../types/types";
import { setup } from "../utils/test";

describe("Form Component Tests", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  // test default value
  test("should initialize with default values", () => {
    const mockOnSubmit = jest.fn();
    render(<Form onSubmit={mockOnSubmit} />);

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
    const { user } = setup(<Form onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByText("Submit");
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        memorySize: 0,
      })
    );
  });

  // test Form submit
  test("should call onSubmit with correct hardware configuration when submitted", async () => {
    // render form
    const { user } = setup(<Form onSubmit={mockOnSubmit} />);

    // select CPU
    const cpuSelect = screen.getByLabelText(/CPU/i);
    await user.click(cpuSelect);
    const powerOption = screen.getByText("Power");
    await user.click(powerOption);

    // enter memory size (valid value)
    const memoryInput = screen.getByLabelText(/Memory Size/i);
    await user.type(memoryInput, "4096");

    // select GPU Accelerator option
    const gpuCheckbox = screen.getByLabelText(/GPU Accelerator Card/i);
    await user.click(gpuCheckbox);

    // click submit
    const submitButton = screen.getByText("Submit");
    await user.click(submitButton);

    // validate onSubmit
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith({
      cpu: CPUModel.Power,
      memorySize: 4096,
      gpuAccelerator: true,
    });
  });

  test("should handle a complete user workflow with multiple changes", async () => {
    const { user } = setup(<Form onSubmit={mockOnSubmit} />);

    // 1. select Power CPU
    const cpuSelect = screen.getByLabelText(/CPU/i);
    await user.click(cpuSelect);
    const powerOption = screen.getByText("Power");
    await user.click(powerOption);

    // 2. enter a invalid memory size to display error message.
    const memoryInput = screen.getByLabelText(/Memory Size/i);
    fireEvent.change(memoryInput, { target: { value: "3000" } });
    fireEvent.blur(memoryInput);
    await waitFor(async () => {
      expect(screen.getByText(/multiple of 1024MB/i)).toBeInTheDocument();
    });

    // change to valid memory size
    user.clear(memoryInput);
    await user.type(memoryInput, "4096");

    // 3. checked GPU, unchecked GPU and Checked it again
    const gpuCheckbox = screen.getByLabelText(/GPU Accelerator Card/i);
    await user.click(gpuCheckbox); // checked
    await user.click(gpuCheckbox); // unchecked
    await user.click(gpuCheckbox); // Checked

    // 4. submit form
    const submitButton = screen.getByText("Submit");
    await user.click(submitButton);

    // 5. validate the form value
    expect(mockOnSubmit).toHaveBeenCalledWith({
      cpu: CPUModel.Power,
      memorySize: 4096,
      gpuAccelerator: true,
    });
  });

  test("should handle formatted memory input correctly", async () => {
    const { user } = setup(<Form onSubmit={mockOnSubmit} />);

    const memoryInput = screen.getByLabelText(/Memory Size/i);
    await user.type(memoryInput, "524,288");

    // submit
    const submitButton = screen.getByText("Submit");
    await user.click(submitButton);

    // validate the value type is number
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        memorySize: 524288,
      })
    );
  });
});
