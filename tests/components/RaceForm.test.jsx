import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import RaceForm from '@/components/RaceForm';

// Helper component to manage state in tests
const RaceFormWrapper = ({ initialRace, onSubmit, error }) => {
  const [race, setRace] = useState(initialRace);
  return <RaceForm race={race} onSubmit={onSubmit} onChange={setRace} error={error} />;
};

describe('RaceForm Component', () => {
  const mockOnSubmit = vi.fn();
  const mockOnChange = vi.fn();
  const mockRace = { name: '', competitors: [] };

  it('renders the form fields correctly', () => {
    render(<RaceForm race={mockRace} onSubmit={mockOnSubmit} onChange={mockOnChange} error={null} />);

    expect(screen.getByLabelText(/Race Name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Competitor/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Race/i })).toBeInTheDocument();
  });

  it('allows adding competitors with unique lane assignments', () => {
    render(<RaceFormWrapper initialRace={{ name: '', competitors: [] }} onSubmit={mockOnSubmit} error={null} />);

    // Add first competitor
    fireEvent.click(screen.getByRole('button', { name: /Add Competitor/i }));
    fireEvent.change(screen.getAllByPlaceholderText(/Competitor Name/i)[0], { target: { value: 'Alice' } });
    fireEvent.change(screen.getAllByTestId('lane-input')[0], { target: { value: '1' } });

    // // Add second competitor
    fireEvent.click(screen.getByRole('button', { name: /Add Competitor/i }));
    fireEvent.change(screen.getAllByLabelText(/Competitor Name/i)[1], { target: { value: 'Bob' } });
    fireEvent.change(screen.getAllByTestId('lane-input')[1], { target: { value: '2' } });

    // Ensure both names appear in the list
    expect(screen.getByDisplayValue('Alice')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Bob')).toBeInTheDocument();  
  });

  it('displays validation errors when race name is empty', () => {
    render(<RaceFormWrapper initialRace={{ name: '', competitors: [] }} onSubmit={mockOnSubmit} error="Race name cannot be empty" />);

    expect(screen.getByText(/Race name cannot be empty/i)).toBeInTheDocument();
  });

  it('displays validation errors when there are not enough competitors', () => {
    render(<RaceFormWrapper initialRace={{ name: '', competitors: [] }} onSubmit={mockOnSubmit} error="A race must have at least two competitors." />);

    expect(screen.getByText(/A race must have at least two competitors./i)).toBeInTheDocument();
  });
});