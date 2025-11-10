import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../src/App";

// ⭐️ CORRECCIÓN: Mockea BrowserRouter para evitar el conflicto
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  BrowserRouter: ({ children }) => <div>{children}</div>,
}));

describe("Pruebas funcionales de App (Navegación)", () => {
  test("debe navegar a la página de Login al hacer clic en 'Comenzar'", async () => {
    // 1. Renderizar la App.
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // 2. Verificar que empezamos en la Landing Page
    expect(
      screen.getByText(/La distancia no importa cuando hay un verdadero lazo/i)
    ).toBeInTheDocument();

    // 3. Simular el clic
    fireEvent.click(screen.getByRole("button", { name: /Comenzar/i }));

    // 4. Esperar a que la página de Login se cargue
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /Bienvenido de vuelta/i })
      ).toBeInTheDocument();
    });
  });

  test("debe navegar a la página de Registro al hacer clic en 'Crear mi código único'", async () => {
    // 1. Renderizar la App.
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // 2. Verificar que empezamos en la Landing Page
    expect(
      screen.getByText(/La distancia no importa cuando hay un verdadero lazo/i)
    ).toBeInTheDocument();

    // 3. Simular el clic
    fireEvent.click(
      screen.getByRole("button", { name: /Crear mi código único/i })
    );

    // 4. Esperar a que la página de Registro se cargue
    await waitFor(() => {
      // Asumimos que la página de registro tiene este título
      expect(
        screen.getByRole("heading", { name: /Crea tu cuenta/i })
      ).toBeInTheDocument();
    });
  });
});
