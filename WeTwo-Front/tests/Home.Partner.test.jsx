import React from "react";
import { render, screen, waitFor, findByText } from "@testing-library/react";
import Home from "../src/pages/home/Home";
import { MemoryRouter } from "react-router-dom";

// --- Mocks (Simulaciones) ---

// Mock del navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock de API_URL y getAuthHeaders
jest.mock("../src/apiConfig.js", () => ({
  API_URL: "http://localhost:5000",
  getAuthHeaders: () => ({
    "Content-Type": "application/json",
    Authorization: "Bearer fake-token",
  }),
}));

// Mock de CSS y BottomNavBar
jest.mock("../src/components/styles/home.css", () => ({}));
jest.mock("../src/components/layout/BottomNavBar", () => () => (
  <div data-testid="bottom-navbar"></div>
));

// Mock de localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => (store[key] = value.toString()),
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock de fetch
global.fetch = jest.fn();

// --- Fin de Mocks ---

describe("Home Page – Estado de Usuario Conectado", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("weTwoToken", "fake-token");
  });

  test("Renderiza el dashboard de pareja cuando el usuario SÍ tiene pareja", async () => {
    // --- ARRANGE ---

    // MOCK: La llamada a /me devuelve un usuario CON pareja
    global.fetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          usuario: {
            id: "uid-julieta",
            nombre: "Julieta",
            connection_code: "WT-123456",
            partner_id: "uid-alex",
          },
          partner: {
            id: "uid-alex",
            nombre: "Alex",
            connection_code: "WT-654321",
          },
        }),
    });

    // --- ACT ---
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // --- ASSERT ---

    // 1. Esperamos a que el saludo con el nombre de la pareja aparezca
    const subtitle = await screen.findByText("Tu espacio con Alex");
    expect(subtitle).toBeInTheDocument();

    // 2. Ahora podemos verificar (sincrónicamente) el resto de la UI.
    // --- ¡ESTA ES LA CORRECCIÓN! ---
    // Buscamos "Mensaje" en lugar de "Enviar Mensaje"
    expect(screen.getByText("Mensaje")).toBeInTheDocument();
    // ---------------------------------
    expect(screen.getByText("Pregunta del Día")).toBeInTheDocument();

    // 3. (¡El más importante!) ¿Nos aseguramos de que el widget de conexión NO existe?
    expect(
      screen.queryByText("Conéctate con tu pareja")
    ).not.toBeInTheDocument();
  });
});
