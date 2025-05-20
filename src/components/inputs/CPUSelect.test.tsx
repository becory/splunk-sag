import { render, screen, waitFor } from "@testing-library/react";
import { CPUSelect } from "./CPUSelect";
import { CPUModel } from "../../types/types";
import { selectClickTarget, setup } from "../../utils/test";

describe("CPUSelect Component Tests", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders with the correct default value", async () => {
    render(<CPUSelect value={CPUModel.X86} onChange={mockOnChange} />);
    const selectElement = screen.getByTestId("cpu-select");
    expect(selectElement).toBeInTheDocument();
    expect(selectElement).toHaveTextContent(CPUModel.X86);
  });

  it("check all of item in the select dropdown", async () => {
    const { user } = setup(
      <CPUSelect value={CPUModel.X86} onChange={mockOnChange} />
    );

    // Open the select dropdown
    const selectElement = await selectClickTarget("cpu-select");
    user.click(selectElement);

    // Check that all menu items exist
    const menuItems = await screen.findAllByRole("option");
    expect(menuItems).toHaveLength(3);

    const enumValues = Object.values(CPUModel);
    let index = 0;
    for (const value of enumValues) {
      expect(menuItems[index]).toHaveTextContent(value);
      index++;
    }
  });

  it("calls onChange when a different option is selected", async () => {
    const { user } = setup(
      <CPUSelect value={CPUModel.X86} onChange={mockOnChange} />
    );

    // Open the select dropdown
    const selectElement = await selectClickTarget("cpu-select");
    user.click(selectElement);
    // Click on a different option
    const armOption = await screen.findByText(CPUModel.ARM);
    await user.click(armOption);
    // Verify that onChange was called with the correct value
    expect(mockOnChange).toHaveBeenCalledTimes(1);

    await waitFor(async () => {
      // Material UI's Select passes a SelectChangeEvent in the onChange
      expect(mockOnChange.mock.calls[0][0].target.value).toBe(CPUModel.ARM);
    });
  });
});
