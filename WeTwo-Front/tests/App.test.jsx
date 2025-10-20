import { render, screen, fireEvent } from "@testing-library/react";
import App from "../src/App";

describe("App Component", () => {
  // NO necesitamos BrowserRouter aquí porque App ya lo tiene
  test("se renderiza la landing page correctamente", () => {
    render(<App />);
    expect(
      screen.getByText(/Conectá con tu persona favorita/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Mensajes, juegos y cápsulas del tiempo/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Probar demo/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Ver más/i })
    ).toBeInTheDocument();
  });

  test("los botones de navegación existen y se pueden clickear", () => {
    render(<App />);
    const inicioBtn = screen.getByRole("button", { name: /Inicio/i });
    const galeriaBtn = screen.getByRole("button", { name: /Galería/i });

    expect(inicioBtn).toBeInTheDocument();
    expect(galeriaBtn).toBeInTheDocument();

    fireEvent.click(inicioBtn);
    fireEvent.click(galeriaBtn);
  });
});
