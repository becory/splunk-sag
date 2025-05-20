import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ServerModelOptions } from "./ServerModelOptions";
import { ServerModel } from "../types";

describe("ServerModelOptions Component Tests", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  // test default value
  test("should initialize with default values", () => {
    render(<ServerModelOptions value={[]} />);

    const cpuSelect = screen.getByTestId("server-model-options");
    expect(cpuSelect).toHaveTextContent("No Options");
  });

  test("should render a single server model option", () => {
    const serverModels = [ServerModel.TowerServer];

    render(<ServerModelOptions value={serverModels} />);

    expect(screen.getByText("Server Model Options")).toBeInTheDocument();
    expect(screen.getByText(ServerModel.TowerServer)).toBeInTheDocument();
    expect(screen.queryByText("No Options.")).not.toBeInTheDocument();
  });

  test("should render multiple server model options", () => {
    const serverModels = [
      ServerModel.TowerServer,
      ServerModel.RackServer,
      ServerModel.Mainframe,
    ];

    render(<ServerModelOptions value={serverModels} />);

    expect(screen.getByText(ServerModel.TowerServer)).toBeInTheDocument();
    expect(screen.getByText(ServerModel.RackServer)).toBeInTheDocument();
    expect(screen.getByText(ServerModel.Mainframe)).toBeInTheDocument();

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(3);
  });

  test('should render "No Options" when no server models are available', () => {
    const serverModels: ServerModel[] = [];

    render(<ServerModelOptions value={serverModels} />);

    expect(screen.getByText("No Options.")).toBeInTheDocument();
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  test("should render server models in the provided order", () => {
    const serverModels = [
      ServerModel.Mainframe,
      ServerModel.HighDensityServer,
      ServerModel.TowerServer,
    ];

    render(<ServerModelOptions value={serverModels} />);

    const listItems = screen.getAllByRole("listitem");

    expect(listItems[0]).toHaveTextContent(ServerModel.Mainframe);
    expect(listItems[1]).toHaveTextContent(ServerModel.HighDensityServer);
    expect(listItems[2]).toHaveTextContent(ServerModel.TowerServer);
  });
});
