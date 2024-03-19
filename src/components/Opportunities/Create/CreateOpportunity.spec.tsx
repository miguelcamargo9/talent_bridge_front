import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import CreateOpportunity from "./CreateOpportunity";
import { createOpportunity } from "../../../services/opportunitiesService";
import { useNavigate } from "react-router-dom";

jest.mock("../../../services/opportunitysService");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("CreateOpportunity component", () => {
  // Mock data and functions
  const mockCreateOpportunity = createOpportunity as jest.Mock;
  const mockNavigate = useNavigate as jest.Mock;

  beforeEach(() => {
    mockCreateOpportunity.mockClear();
    mockNavigate.mockClear();
    render(<CreateOpportunity />);
  });

  it("renders form fields and buttons", () => {
    expect(screen.getByLabelText("Name:")).toBeInTheDocument();
    expect(screen.getByLabelText("Title:")).toBeInTheDocument();
    expect(screen.getByLabelText("Description:")).toBeInTheDocument();
    expect(screen.getByText("Create")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("updates opportunity state on input change", () => {
    fireEvent.change(screen.getByLabelText("Name:"), {
      target: { value: "Opportunity Test" },
    });
    fireEvent.change(screen.getByLabelText("Title:"), {
      target: { value: "opportunity@test.com" },
    });
    expect(screen.getByLabelText("Name:")).toHaveValue("Opportunity Test");
    expect(screen.getByLabelText("Title:")).toHaveValue("opportunity@test.com");
  });

  it("shows validation errors for empty fields on submit", async () => {
    fireEvent.click(screen.getByText("Create"));
    await waitFor(() => {
      expect(screen.getByText("The field Name is required")).toBeInTheDocument();
      expect(
        screen.getByText("The field Title is required")
      ).toBeInTheDocument();
    });
  });

  it("calls createOpportunity on form submission with valid data", async () => {
    fireEvent.change(screen.getByLabelText("Name:"), {
      target: { value: "Opportunity Test" },
    });
    fireEvent.change(screen.getByLabelText("Title:"), {
      target: { value: "opportunity@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Description:"), {
      target: { value: "62363263263" },
    });
    fireEvent.click(screen.getByText("Create"));

    await waitFor(() =>
      expect(mockCreateOpportunity).toHaveBeenCalledWith({
        name: "Opportunity Test",
        title: "opportunity@test.com",
        description: "62363263263",
      })
    );
  });

  it("resets form on reset button click", () => {
    fireEvent.change(screen.getByLabelText("Name:"), {
      target: { value: "Opportunity Test" },
    })
    fireEvent.click(screen.getByText("Clear"));
    expect(screen.getByLabelText("Name:")).toHaveValue("");
  });
});
