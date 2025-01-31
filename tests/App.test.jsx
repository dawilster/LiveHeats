import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import App from "@/App";

function renderWithRouter(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      {ui}
    </MemoryRouter>
  );
}
describe("App Routing", () => {
  it('renders RacesIndex component for the default route', () => {
    renderWithRouter(<App />);

    expect(screen.getByText(/Race Events/i)).toBeInTheDocument();
  });

  it('renders RaceNew component for /races/new route', () => {
    renderWithRouter(<App />, { route: '/races/new' });

    expect(screen.getByText(/Create New Race/i)).toBeInTheDocument();
  });

  it('renders RaceShow component for /races/:id route', () => {
    renderWithRouter(<App />, { route: '/races/1' });

    expect(screen.getByText(/Race Not Found/i)).toBeInTheDocument();
  });

  it('renders RaceEdit component for /races/:id/edit route', () => {
    renderWithRouter(<App />, { route: '/races/1/edit' });

    expect(screen.getByText(/Race Not Found/i)).toBeInTheDocument();
  });
});