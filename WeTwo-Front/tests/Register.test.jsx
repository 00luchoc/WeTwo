import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Register from "../src/pages/register/Register";
import Login from "../src/pages/login/Login";

global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

function renderWithRouter(initialRoute = "/register") {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </MemoryRouter>
  );
}

test("registro exitoso sin usar backend real", async () => {
  // Simulamos respuesta de backend
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ message: "Registro exitoso" }),
  });

  renderWithRouter();

  fireEvent.change(screen.getByPlaceholderText(/nombre/i), {
    target: { value: "Luciano" },
  });
  fireEvent.change(screen.getByPlaceholderText(/correo electrónico/i), {
    target: { value: "luciano@email.com" },
  });
  fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
    target: { value: "123456" },
  });

  fireEvent.click(screen.getByRole("button", { name: /registrarme/i }));

  await waitFor(() => {
    expect(screen.getByText(/bienvenido de vuelta/i)).toBeInTheDocument();
  });
});
