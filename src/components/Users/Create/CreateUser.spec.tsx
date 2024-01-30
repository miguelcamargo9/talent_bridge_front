import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import CreateUser from "./CreateUser";
import { createUser } from "../../../services/usersService";
import { useNavigate } from "react-router-dom";

jest.mock("../../../services/usersService");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("CreateUser component", () => {
  // Mock data and functions
  const mockCreateUser = createUser as jest.Mock;
  const mockNavigate = useNavigate as jest.Mock;

  beforeEach(() => {
    mockCreateUser.mockClear();
    mockNavigate.mockClear();
    render(<CreateUser />);
  });

  it("renders form fields and buttons", () => {
    expect(screen.getByLabelText("Name:")).toBeInTheDocument();
    expect(screen.getByLabelText("Email:")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone:")).toBeInTheDocument();
    expect(screen.getByText("Create")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("updates user state on input change", () => {
    fireEvent.change(screen.getByLabelText("Name:"), {
      target: { value: "User Test" },
    });
    fireEvent.change(screen.getByLabelText("Email:"), {
      target: { value: "user@test.com" },
    });
    expect(screen.getByLabelText("Name:")).toHaveValue("User Test");
    expect(screen.getByLabelText("Email:")).toHaveValue("user@test.com");
  });

  it("shows validation errors for empty fields on submit", async () => {
    fireEvent.click(screen.getByText("Create"));
    await waitFor(() => {
      expect(screen.getByText("The field Name is required")).toBeInTheDocument();
      expect(
        screen.getByText("The field Email is required")
      ).toBeInTheDocument();
    });
  });

  it("calls createUser on form submission with valid data", async () => {
    fireEvent.change(screen.getByLabelText("Name:"), {
      target: { value: "User Test" },
    });
    fireEvent.change(screen.getByLabelText("Email:"), {
      target: { value: "user@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Phone:"), {
      target: { value: "62363263263" },
    });
    fireEvent.click(screen.getByText("Create"));

    await waitFor(() =>
      expect(mockCreateUser).toHaveBeenCalledWith({
        name: "User Test",
        email: "user@test.com",
        phone: "62363263263",
      })
    );
  });

  it("resets form on reset button click", () => {
    fireEvent.change(screen.getByLabelText("Name:"), {
      target: { value: "User Test" },
    })
    fireEvent.click(screen.getByText("Clear"));
    expect(screen.getByLabelText("Name:")).toHaveValue("");
  });
});
