import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ResultsCard from '@/components/ResultsCard';

// Helper function to render the ResultsCard inside a router
const renderWithProviders = (ui) => {
  return render(
    <MemoryRouter>{ui}</MemoryRouter>
  );
};

describe('ResultsCard Component', () => {
  const mockRace = {
    id: '1',
    name: 'Championship Finals',
    competitors: [
      { id: 'c1', name: 'Bob', lane: 1, placement: 3 },
      { id: 'c2', name: 'Alice', lane: 5, placement: 1 },
      { id: 'c3', name: 'Kim', lane: 7, placement: 2 },
      { id: 'c4', name: 'Will', lane: 2, placement: 4 }
    ],
  };

  it('renders race name and competitor details', () => {
    renderWithProviders(<ResultsCard race={mockRace} />);

    // Ensure race name is displayed
    expect(screen.getByText(/Championship Finals/)).toBeInTheDocument();

    // Ensure competitor names appear as text
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();

    // Ensure lane and placement are displayed as text
    expect(screen.getByText('Lane 1')).toBeInTheDocument();
    expect(screen.getByText('Lane 2')).toBeInTheDocument();
    expect(screen.getByText('1st Place')).toBeInTheDocument();
    expect(screen.getByText('2nd Place')).toBeInTheDocument();
  });

  it('displays competitors in the correct order based on placement', () => {
    renderWithProviders(<ResultsCard race={mockRace} />);

    // Get all rows in the order they appear
    const rows = screen.getAllByRole('row');

    // Extract competitor names from rows (assuming the name appears first in each row)
    const displayedNames = rows.map(row => row.textContent).filter(text => text.includes('Lane')).map(text => {
      const match = text.match(/(Alice|Bob|Kim|Will)/);
      return match ? match[0] : null;
    }).filter(Boolean);

    // Expected order based on placement
    const expectedOrder = ['Alice', 'Kim', 'Bob', 'Will'];

    // Ensure the displayed order matches the expected order
    expect(displayedNames).toEqual(expectedOrder);
  });

  it('displays "Not yet placed" for upcoming races with no placements', () => {
    const mockUpcomingRace = {
      id: '2',
      name: 'Upcoming Championship',
      competitors: [
        { id: 'c1', name: 'Alice', lane: 1, placement: null },
        { id: 'c2', name: 'Bob', lane: 2, placement: '' },
        { id: 'c3', name: 'Kim', lane: 3, placement: null },
      ],
    };

    renderWithProviders(<ResultsCard race={mockUpcomingRace} />);

    // Ensure "Not yet placed" appears for all competitors
    expect(screen.getAllByText(/Not yet placed/i)).toHaveLength(3);

    // Ensure the message is displayed
    expect(screen.getByText(/Placements will be recorded after the race/i)).toBeInTheDocument();
  });

  it('handles mixed placements correctly (some placed, some not)', () => {
    const mockMixedRace = {
      id: '3',
      name: 'Mixed Placement Race',
      competitors: [
        { id: 'c1', name: 'Alice', lane: 1, placement: 1 },
        { id: 'c2', name: 'Bob', lane: 2, placement: null },
        { id: 'c3', name: 'Kim', lane: 3, placement: 2 },
        { id: 'c4', name: 'Will', lane: 4, placement: '' },
      ],
    };

    renderWithProviders(<ResultsCard race={mockMixedRace} />);

    // Ensure "Not yet placed" appears for unplaced competitors
    expect(screen.getAllByText(/Not placed/i)).toHaveLength(2);
  });
});