import { render, screen } from '@testing-library/react';
import RaceStatusBadge from '@/components/RaceStatusBadge';

describe('RaceStatusBadge Component', () => {
  it('displays "Upcoming" if no competitors have placements', () => {
    const mockRace = {
      id: '1',
      name: 'Test Race',
      competitors: [
        { id: 'c1', name: 'Alice', lane: 1, placement: '' },
        { id: 'c2', name: 'Bob', lane: 2, placement: '' },
      ],
    };

    render(<RaceStatusBadge race={mockRace} />);
    expect(screen.getByText(/Upcoming/i)).toBeInTheDocument();
  });

  it('displays "Upcoming" if some competitors are missing placements', () => {
    const mockRace = {
      id: '2',
      name: 'Test Race 2',
      competitors: [
        { id: 'c1', name: 'Alice', lane: 1, placement: '' },
        { id: 'c2', name: 'Bob', lane: 2, placement: null },
      ],
    };

    render(<RaceStatusBadge race={mockRace} />);
    expect(screen.getByText(/Upcoming/i)).toBeInTheDocument();
  });

  it('displays "Completed" when one competitor has a placement', () => {
    const mockRace = {
      id: '3',
      name: 'Final Race',
      competitors: [
        { id: 'c1', name: 'Alice', lane: 1, placement: 1 },
        { id: 'c2', name: 'Bob', lane: 2, placement: null },
      ],
    };

    render(<RaceStatusBadge race={mockRace} />);
    expect(screen.getByText(/Completed/i)).toBeInTheDocument();
  });
});