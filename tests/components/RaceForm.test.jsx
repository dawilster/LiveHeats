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
    fireEvent.change(screen.getByLabelText(/Competitor Name/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByLabelText(/Lane Number/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Competitor/i }));

    // Add second competitor
    fireEvent.change(screen.getByLabelText(/Competitor Name/i), { target: { value: 'Bob' } });
    fireEvent.change(screen.getByLabelText(/Lane Number/i), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Competitor/i }));

    // Ensure both names appear in the list
    expect(screen.getByText(/Alice - Lane 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Bob - Lane 2/i)).toBeInTheDocument();
  });

  it('removes already assigned lanes from the dropdown', () => {
    render(<RaceFormWrapper initialRace={{ name: '', competitors: [{ id: "1", name: 'Alice', lane: 1 }] }} onSubmit={mockOnSubmit} error={null} />);

    // Try adding a new competitor
    fireEvent.change(screen.getByLabelText(/Competitor Name/i), { target: { value: 'Bob' } });

    // Ensure Lane 1 is disabled in the dropdown
    expect(screen.queryByRole('option', { name: '1' })).not.toBeInTheDocument();
  });

  it('auto-selects the first available lane and updates correctly when competitors are added', () => {
    render(<RaceFormWrapper initialRace={{ name: '', competitors: [] }} onSubmit={mockOnSubmit} error={null} />);

    // Check that Lane 1 is selected by default
    expect(screen.getByLabelText(/Lane Number/i)).toHaveValue("1");

    // Add first competitor (Alice in Lane 1)
    fireEvent.change(screen.getByLabelText(/Competitor Name/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByLabelText(/Lane Number/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Competitor/i }));

    // Ensure next available lane (Lane 2) is auto-selected
    expect(screen.getByLabelText(/Lane Number/i)).toHaveValue("2");

    // Add second competitor (Bob in Lane 2)
    fireEvent.change(screen.getByLabelText(/Competitor Name/i), { target: { value: 'Bob' } });
    fireEvent.change(screen.getByLabelText(/Lane Number/i), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Competitor/i }));

    // Ensure next available lane (Lane 3) is auto-selected
    expect(screen.getByLabelText(/Lane Number/i)).toHaveValue("3");
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