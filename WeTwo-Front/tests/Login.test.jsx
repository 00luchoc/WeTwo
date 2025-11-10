import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../src/pages/login/Login";
import { API_URL } from "../src/apiConfig";

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
// 🔹 PRUEBAS FUNCIONALES DEL LOGIN
// ----------------------------------------------------------------

describe("Pruebas funcionales del Login", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockFetch.mockClear();
    localStorageMock.clear();
  });

  // Test 1: El flujo de "Login Exitoso"
  test("debe llamar a la API, guardar el token y redirigir al /home en un login exitoso", async () => {
    // A. ARRANGE
    const mockToken = "mi-token-jwt-falso-123";
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        message: "Login exitoso",
        token: mockToken,
        usuario: { id: 1, nombre: "Julieta" },
      }),
    });

    // B. ACT
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), {
      target: { value: "test@usuario.com" },
    });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), {
      target: { value: "contraseña123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Iniciar sesión/i }));

    // C. ASSERT
    await waitFor(() => {
      // 1. ¿Llamamos a fetch? ¿Y a la URL correcta?
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_URL}/login`,
        expect.anything()
      );

      // 2. ¿Enviamos el email y contraseña correctos en el body?
      expect(mockFetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          body: JSON.stringify({
            email: "test@usuario.com",
            contraseña: "contraseña123",
          }),
        })
      );

      // 3. ¿Se guardó el token en localStorage?
      expect(localStorage.getItem("weTwoToken")).toBe(mockToken);

      // 4. ¿Se redirigió al usuario al /home?
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });
  });

  // Test 2: El flujo de "Login Fallido"
  test("debe mostrar un mensaje de error y no redirigir si la contraseña es incorrecta", async () => {
    // A. ARRANGE
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({
        error: "Contraseña incorrecta",
      }),
    });

    // B. ACT
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), {
      target: { value: "test@usuario.com" },
    });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), {
      target: { value: "contraseña-mala" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Iniciar sesión/i }));

    // C. ASSERT
    await waitFor(() => {
      // 1. ¿Apareció el mensaje de error en pantalla?
      expect(screen.getByText(/Contraseña incorrecta/i)).toBeInTheDocument();

      // 2. ¿NO se guardó ningún token?
      expect(localStorage.getItem("weTwoToken")).toBeNull();

      // 3. ¿NO se redirigió al usuario?
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
