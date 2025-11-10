import React from "react";
import { render, screen, waitFor, findByText } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Home from "../src/pages/home/Home";
import Login from "../src/pages/login/Login";
import { API_URL, getAuthHeaders } from "../src/apiConfig";

// 1. SIMULAMOS (MOCK) LAS DEPENDENCIAS EXTERNAS
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => (store[key] = value.toString()),
    removeItem: (key) => delete store[key],
    clear: () => (store = {}),
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

const mockFetch = jest.spyOn(global, "fetch");

// ----------------------------------------------------------------
// 🔹 TEST FUNCIONAL DE RUTA PROTEGIDA
// ----------------------------------------------------------------

describe("Pruebas funcionales del Home (Ruta Protegida)", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockFetch.mockClear();
    localStorageMock.clear();
  });

  // Test 1: Flujo de "Token Inválido" (Este test ya estaba bien)
  test("debe mostrar un error si la llamada a /me falla (token inválido)", async () => {
    // A. ARRANGE
    localStorage.setItem("weTwoToken", "token-falso-invalido");

    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Token inválido" }),
    });

    // B. ACT
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </MemoryRouter>
    );

    // C. ASSERT
    await waitFor(() => {
      // 1. Verificamos que se llamó a la API
      expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/me`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      // 2. Verificamos que renderizó el estado de error
      // (Esto pasa ANTES de que el router procese la redirección, por eso lo podemos "pillar")
      expect(
        screen.getByText(/Error: Usuario no encontrado./i)
      ).toBeInTheDocument();
    });
  });

  // Test 2: Flujo de "Token Válido"
  test("debe mostrar los datos del usuario si la llamada a /me es exitosa", async () => {
    // A. ARRANGE
    localStorage.setItem("weTwoToken", "mi-token-valido");

    const mockUser = {
      user: {
        id: 1,
        nombre: "Julieta",
        email: "julieta@test.com",
        connection_code: "WT-123",
      },
      partner: null,
    };

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockUser,
    });

    // B. ACT
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // C. ASSERT
    const greeting = await screen.findByText(/Hola, Julieta/i);
    expect(greeting).toBeInTheDocument();

    // Ahora podemos verificar las otras cosas de forma segura:
    // 1. ¿Se intentó llamar a la API?
    expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/me`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    // 2. ¿NO se redirigió al login?
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
