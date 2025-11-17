// tests/Home.Connect.test.jsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "../src/pages/home/Home";
import { MemoryRouter } from "react-router-dom";

// Mock del navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock de API_URL y getAuthHeaders
jest.mock("../src/apiConfig.js", () => ({
  API_URL: "http://localhost:5000",
  getAuthHeaders: () => ({ Authorization: "Bearer fake" }),
}));

// Evitar errores por CSS
jest.mock("../src/components/styles/home.css", () => ({}));

// Mock de BottomNavBar
jest.mock("../src/components/layout/BottomNavBar", () => () => (
  <div data-testid="bottom-navbar"></div>
));

// FIX GLOBAL: mock alert y reloadPage
global.alert = jest.fn();
global.reloadPage = jest.fn();

describe("Home Page – Conexión cuando NO hay pareja", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("weTwoToken", "fake-token");
  });

  test("Renderiza el widget de conexión cuando el usuario NO tiene pareja", async () => {
    // MOCK del backend: usuario sin pareja
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            usuario: {
              nombre: "Julieta",
              connection_code: "WT-123456",
            },
            partner: null,
          }),
      })
    );

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Hola, Julieta")).toBeInTheDocument();
    });

    expect(screen.getByText("Conéctate con tu pareja")).toBeInTheDocument();

    expect(screen.getByText("WT-123456")).toBeInTheDocument();

    const input = screen.getByPlaceholderText("WT-XXXXXX");
    fireEvent.change(input, { target: { value: "WT-654321" } });

    const connectBtn = screen.getByText("Conectar");

    // Mock de POST /connect
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    );

    fireEvent.click(connectBtn);

    // Verifica que fetch fue llamado
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5000/connect",
        expect.objectContaining({
          method: "POST",
        })
      );
    });

    // Verifica que se llamó alert
    expect(global.alert).toHaveBeenCalled();
  });
});
