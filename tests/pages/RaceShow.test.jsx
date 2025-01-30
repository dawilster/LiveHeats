import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import RaceShow from "@/pages/RaceShow";
import { RacesProvider } from "@/context/RacesContext";

// Helper function to render `RaceShow` inside a test router
const renderWithProviders = (route = "/races/1") => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <RacesProvider>
        <Routes>
          <Route path="/races/:id" element={<RaceShow />} />
        </Routes>
      </RacesProvider>
    </MemoryRouter>
  );
};

describe("RaceShow Page", () => {
  beforeEach(() => {
    // Mock race data in localStorage
    localStorage.setItem(
      "races",
      JSON.stringify([
        { id: "1", name: "Test Race", competitors: [{ id: "c1", name: "Alice", lane: 1 }] },
      ])
    );
  });

  it("renders race details when a valid race ID is provided", () => {
    renderWithProviders();

    // Ensure the ResultsCard displays race details
    expect(screen.getByText(/Test Race/)).toBeInTheDocument();
    expect(screen.getByText(/Alice/)).toBeInTheDocument();
    expect(screen.getByText(/Lane 1/)).toBeInTheDocument();
  });

  it("shows 'Race Not Found' when the race ID does not exist", () => {
    renderWithProviders("/races/999");

    expect(screen.getByText(/Race Not Found/)).toBeInTheDocument();
    expect(screen.getByText(/The race you are looking for does not exist./)).toBeInTheDocument();
  });

});