import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../src/pages/login/Login";

describe("Login Component", () => {
  const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

  beforeEach(() => renderWithRouter(<Login />));

  test("renderiza correctamente todos los elementos", () => {
    expect(
      screen.getByRole("heading", { name: /Bienvenido de vuelta/i })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/tu@email.com/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Ingresa tu contraseña/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Iniciar sesión/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /¿Olvidaste tu contraseña\?/i })
    ).toBeInTheDocument();
  });

  test("puede escribir en los inputs", () => {
    const emailInput = screen.getByPlaceholderText(/tu@email.com/i);
    const passwordInput = screen.getByPlaceholderText(/Ingresa tu contraseña/i);

    fireEvent.change(emailInput, { target: { value: "test@correo.com" } });
    fireEvent.change(passwordInput, { target: { value: "123456" } });

    expect(emailInput.value).toBe("test@correo.com");
    expect(passwordInput.value).toBe("123456");
  });

  test("botón de login se puede clickear", () => {
    const loginButton = screen.getByRole("button", { name: /Iniciar sesión/i });
    fireEvent.click(loginButton);
  });
});
