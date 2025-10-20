import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Register from "../src/pages/register/Register";

describe("Register Component", () => {
  const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

  beforeEach(() => renderWithRouter(<Register />));

  test("renderiza formulario de registro", () => {
    expect(
      screen.getByRole("heading", { name: /Crear cuenta/i })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Nombre/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Correo electrónico/i)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Contraseña/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Registrarme/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Volver al inicio/i })
    ).toBeInTheDocument();
  });

  test("Puede redirigirse al inicio de sesion tras registrarse", async () => {
    const nombreInput = screen.getByPlaceholderText(/Nombre/i);
    const emailInput = screen.getByPlaceholderText(/Correo electrónico/i);
    const passwordInput = screen.getByPlaceholderText(/Contraseña/i);

    fireEvent.change(nombreInput, { target: { value: "Julieta" } });
    fireEvent.change(emailInput, { target: { value: "julieta@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "123456" } });

    const registerButton = screen.getByRole("button", { name: /Registrarme/i });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText("inicio sesion"));
    });
    // expect(nombreInput.value).toBe("Julieta");
    // expect(emailInput.value).toBe("julieta@email.com");
    // expect(passwordInput.value).toBe("123456");
  });

  test("Puede iniciar sesion con el usuario recien registrado", async () => {
    const nombreInput = screen.getByPlaceholderText(/Nombre/i);
    const emailInput = screen.getByPlaceholderText(/Correo electrónico/i);
    const passwordInput = screen.getByPlaceholderText(/Contraseña/i);

    fireEvent.change(nombreInput, { target: { value: "Julieta" } });
    fireEvent.change(emailInput, { target: { value: "julieta@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "123456" } });

    const registerButton = screen.getByRole("button", { name: /Registrarme/i });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText("inicio sesion"));
    });
    // expect(nombreInput.value).toBe("Julieta");
    // expect(emailInput.value).toBe("julieta@email.com");
    // expect(passwordInput.value).toBe("123456");
  });

  // test("botón de registro se puede clickear", () => {

  // });
});
