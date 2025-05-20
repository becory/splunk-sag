import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import { CPUModel, ServerModel } from "./types";
import * as serverUtils from "./utils";
import { setup } from "./utils/test";

// mock decideServerModels function, control return value
jest.mock("./utils", () => ({
  decideServerModels: jest.fn(),
}));

describe("Main Page Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render initial state correctly", () => {
    render(<App />);

    expect(screen.getByText("Server Composer")).toBeInTheDocument();

    expect(screen.getByLabelText(/CPU/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Memory Size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/GPU Accelerator Card/i)).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();

    expect(screen.queryByText("Server Model Options")).not.toBeInTheDocument();
  });

  test("should display server model options after form submission", async () => {
    // set mock return value
    const mockServerModels = [ServerModel.TowerServer];
    (serverUtils.decideServerModels as jest.Mock).mockReturnValue(
      mockServerModels
    );

    const { user } = setup(<App />);

    // fill in form
    const cpuSelect = screen.getByLabelText(/CPU/i);
    await user.click(cpuSelect);
    const option = screen.getByRole("option", { name: "X86" });
    await user.click(option);

    const memoryInput = screen.getByLabelText(/Memory Size/i);
    await user.type(memoryInput, "4096");

    // submit
    const submitButton = screen.getByText("Submit");
    await user.click(submitButton);

    // wait for result
    await waitFor(() => {
      expect(screen.getByText("Server Model Options")).toBeInTheDocument();
    });

    // check the model display
    expect(screen.getByText(ServerModel.TowerServer)).toBeInTheDocument();

    // check decideServerModels called
    expect(serverUtils.decideServerModels).toHaveBeenCalledWith(
      expect.objectContaining({
        cpu: CPUModel.X86,
        memorySize: 4096,
        gpuAccelerator: false,
      })
    );
  });

  test('should display "No Options" when no server models match', async () => {
    // set mock return value is null
    (serverUtils.decideServerModels as jest.Mock).mockReturnValue(null);

    const { user } = setup(<App />);

    // fill in form
    const cpuSelect = screen.getByLabelText(/CPU/i);
    await user.click(cpuSelect);
    const option = screen.getByRole("option", { name: "ARM" });
    await user.click(option);

    const memoryInput = screen.getByLabelText(/Memory Size/i);
    await user.type(memoryInput, "1024");

    // submit
    const submitButton = screen.getByText("Submit");
    await user.click(submitButton);

    // wait for result
    await waitFor(() => {
      expect(screen.getByText("Server Model Options")).toBeInTheDocument();
    });

    // check "No Options" is display
    expect(screen.getByText("No Options.")).toBeInTheDocument();
  });

  test("should hide server model options when form values change before submission", async () => {
    const mockServerModels = [ServerModel.TowerServer];
    (serverUtils.decideServerModels as jest.Mock).mockReturnValue(
      mockServerModels
    );

    const { user } = setup(<App />);

    // submit form
    const memoryInput = screen.getByLabelText(/Memory Size/i);
    await user.type(memoryInput, "4096");

    const submitButton = screen.getByText("Submit");
    user.click(submitButton);

    // wait for result
    await waitFor(() => {
      expect(screen.getByText("Server Model Options")).toBeInTheDocument();
    });

    // change value
    await user.type(memoryInput, "8192");

    // server model result should be hidden
    expect(screen.queryByText("Server Model Options")).not.toBeInTheDocument();
  });

  test("should update server models when form is submitted multiple times", async () => {
    // first submit
    (serverUtils.decideServerModels as jest.Mock).mockReturnValue([
      ServerModel.TowerServer,
    ]);

    const { user } = setup(<App />);

    // fill in form and submit
    const memoryInput = screen.getByLabelText(/Memory Size/i);
    await user.type(memoryInput, "4096");

    let submitButton = screen.getByText("Submit");
    await user.click(submitButton);

    // wait for first result
    await waitFor(() => {
      expect(screen.getByText("Server Model Options")).toBeInTheDocument();
    });
    expect(screen.getByText(ServerModel.TowerServer)).toBeInTheDocument();

    // second submit
    (serverUtils.decideServerModels as jest.Mock).mockReturnValue([
      ServerModel.Mainframe,
    ]);

    // fill in new value in form and submit
    const cpuSelect = screen.getByLabelText(/CPU/i);
    await user.click(cpuSelect);
    const option = screen.getByText("Power");
    await user.click(option);

    // hide result when user change form
    await waitFor(() => {
      expect(
        screen.queryByText("Server Model Options")
      ).not.toBeInTheDocument();
    });

    await user.click(submitButton);

    // wait for new result
    await waitFor(() => {
      expect(screen.getByText("Server Model Options")).toBeInTheDocument();
    });
    expect(screen.queryByText(ServerModel.TowerServer)).not.toBeInTheDocument();
    expect(screen.getByText(ServerModel.Mainframe)).toBeInTheDocument();
  });

  test("should call decideServerModels with the correct parameters", async () => {
    (serverUtils.decideServerModels as jest.Mock).mockReturnValue([
      ServerModel.HighDensityServer,
    ]);
    const { user } = setup(<App />);

    // select ARM CPU
    const cpuSelect = screen.getByLabelText(/CPU/i);
    await user.click(cpuSelect);
    await user.click(screen.getByText("ARM"));

    // fill in memory size
    const memoryInput = screen.getByLabelText(/Memory Size/i);
    await user.type(memoryInput, "524288");

    // checked GPU
    const gpuCheckbox = screen.getByLabelText(/GPU Accelerator Card/i);
    await user.click(gpuCheckbox);

    // submit form
    const submitButton = screen.getByText("Submit");
    await user.click(submitButton);

    // validate
    expect(serverUtils.decideServerModels).toHaveBeenCalledWith({
      cpu: CPUModel.ARM,
      memorySize: 524288,
      gpuAccelerator: true,
    });

    // wait for result
    await waitFor(() => {
      expect(screen.getByText("Server Model Options")).toBeInTheDocument();
    });

    expect(screen.getByText(ServerModel.HighDensityServer)).toBeInTheDocument();
  });
});
