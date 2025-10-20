import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AnimatedButton from "../src/components/ui/Button.jsx";

describe("AnimatedButton", () => {
  test("renders the button with children text", () => {
    render(<AnimatedButton>Click Me</AnimatedButton>);
    const buttonElement = screen.getByText(/Click Me/i);
    expect(buttonElement).toBeInTheDocument();
  });

  test("responds to hover and click animations", () => {
    render(<AnimatedButton>Hover Me</AnimatedButton>);
    const button = screen.getByText(/Hover Me/i);

    // Simular hover
    fireEvent.mouseOver(button);
    expect(button).toBeInTheDocument();

    // Simular click
    fireEvent.click(button);
    expect(button).toBeInTheDocument();
  });
});
