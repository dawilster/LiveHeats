import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { RacesProvider } from '@/context/RacesContext';
import RaceNew from '@/pages/RaceNew';

// Mock `useNavigate` to intercept navigation calls
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');

  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// Helper function to render component within context
const renderWithProviders = (ui) => {
  return render(
    <MemoryRouter>
      <RacesProvider>{ui}</RacesProvider>
    </MemoryRouter>
  );
};

describe('RaceNew Page', () => {
  it('renders the RaceForm component with default elements', () => {
    renderWithProviders(<RaceNew />);

    expect(screen.getByLabelText(/Race Name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Competitor/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Race/i })).toBeInTheDocument();
  });

  it('navigates back after saving a valid race', async () => {
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);

    renderWithProviders(<RaceNew />);

    // Fill in race name
    fireEvent.change(screen.getByLabelText(/Race Name/i), { target: { value: 'Test Race' } });

    // Add first competitor
    fireEvent.click(screen.getByRole('button', { name: /Add Competitor/i }));
    fireEvent.change(screen.getAllByPlaceholderText(/Competitor Name/i)[0], { target: { value: 'Alice' } });
    fireEvent.change(screen.getAllByTestId('lane-input')[0], { target: { value: '1' } });

    // // Add second competitor
    fireEvent.click(screen.getByRole('button', { name: /Add Competitor/i }));
    fireEvent.change(screen.getAllByLabelText(/Competitor Name/i)[1], { target: { value: 'Bob' } });
    fireEvent.change(screen.getAllByTestId('lane-input')[1], { target: { value: '2' } });

    // Submit the form inside `act()` to handle async updates
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Save Race/i }));
    });

    // // Ensure navigation happens only after a valid race submission
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});