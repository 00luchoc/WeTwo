import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Register from "../src/pages/register/Register";
import { API_URL } from "../src/apiConfig";

// 1. SIMULAMOS (MOCK) LAS DEPENDENCIAS EXTERNAS
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockFetch = jest.spyOn(global, "fetch");

// ----------------------------------------------------------------
// 🔹 PRUEBAS FUNCIONALES DEL REGISTRO
// ----------------------------------------------------------------

describe("Pruebas funcionales del Registro", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockFetch.mockClear();
    window.alert = jest.fn();
  });

  // Test 1: Flujo de "Registro Exitoso"
  test("debe llamar a la API y redirigir a /login en un registro exitoso", async () => {
    // A. ARRANGE
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Usuario registrado con éxito" }),
    });

    // B. ACT
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    // Simulamos al usuario llenando el formulario
    fireEvent.change(screen.getByLabelText(/Nombre/i), {
      target: { value: "Usuario Test" },
    });
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), {
      target: { value: "test@nuevo.com" },
    });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Registrarme/i }));

    // C. ASSERT
    await waitFor(() => {
      // 1. ¿Llamamos a fetch con los datos correctos?
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_URL}/register`,
        expect.objectContaining({
          body: JSON.stringify({
            nombre: "Usuario Test",
            email: "test@nuevo.com",
            contraseña: "password123",
          }),
        })
      );

      // 2. ¿Se llamó al alert de éxito?
      expect(window.alert).toHaveBeenCalledWith(
        "¡Registro exitoso! Ahora inicia sesión."
      );

      // 3. ¿Se redirigió al usuario a /login?
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  // Test 2: Flujo de "Registro Fallido" (ej: email ya existe)
  test("debe mostrar un mensaje de error si el email ya existe", async () => {
    // A. ARRANGE
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: "El email ya está registrado" }),
    });

    // B. ACT
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nombre/i), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), {
      target: { value: "email@existente.com" },
    });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Registrarme/i }));

    // C. ASSERT
    await waitFor(() => {
      // 1. ¿Apareció el mensaje de error?
      expect(
        screen.getByText(/El email ya está registrado/i)
      ).toBeInTheDocument();

      // 2. ¿NO se redirigió?
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});

test("registro exitoso sin usar backend real", async () => {
  // Simular window.alert también para este test
  window.alert = jest.fn();

  // Simulamos respuesta de backend
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ message: "Registro exitoso" }),
  });

  // Se reemplazó 'renderWithRouter()' por el render estándar
  render(
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  );

  fireEvent.change(screen.getByLabelText(/Nombre/i), {
    target: { value: "Luciano" },
  });
  fireEvent.change(screen.getByLabelText(/Correo electrónico/i), {
    target: { value: "luciano@email.com" },
  });
  fireEvent.change(screen.getByLabelText(/Contraseña/i), {
    target: { value: "123456" },
  });

  fireEvent.click(screen.getByRole("button", { name: /registrarme/i }));

  await waitFor(() => {
    // Verificamos que se navega a /login (donde mockNavigate nos lleva)
    // O que se llamó al alert antes de navegar
    expect(window.alert).toHaveBeenCalledWith(
      "¡Registro exitoso! Ahora inicia sesión."
    );
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
