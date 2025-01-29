import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RacesIndex from '@/pages/RacesIndex'; // Adjust import path to your file

describe('RacesIndex Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('displays a placeholder message when no races are found', () => {
    render(
      <MemoryRouter>
        <RacesIndex />
      </MemoryRouter>
    );

    expect(screen.getByText(/no races found/i)).toBeInTheDocument();
  });

  it('displays a list of races from localStorage', () => {
    const mockRaces = [
      { id: '1', name: 'Race 1', competitors: [] },
      { id: '2', name: 'Race 2', competitors: [] },
    ];
    localStorage.setItem('races', JSON.stringify(mockRaces));

    render(
      <MemoryRouter>
        <RacesIndex />
      </MemoryRouter>
    );

    // Ensure each race is in the document
    expect(screen.getByText('Race 1')).toBeInTheDocument();
    expect(screen.getByText('Race 2')).toBeInTheDocument();
  });

  it('navigates to the new race page when "Add Race" is clicked', () => {
    render(
      <MemoryRouter>
        <RacesIndex />
      </MemoryRouter>
    );

    const addButton = screen.getByText(/add race/i);
    expect(addButton).toBeInTheDocument();

    expect(addButton.closest('a')).toHaveAttribute('href', '/races/new');
  });

  it('navigates to the correct race details when a race is clicked', () => {
    const mockRaces = [
      { id: '1', name: 'Race 1', competitors: [] },
    ];
    localStorage.setItem('races', JSON.stringify(mockRaces));

    render(
      <MemoryRouter>
        <RacesIndex />
      </MemoryRouter>
    );

    const raceItem = screen.getByText('Race 1');
    expect(raceItem).toBeInTheDocument();

    expect(raceItem.closest('a')).toHaveAttribute('href', '/races/1');
  });
});
