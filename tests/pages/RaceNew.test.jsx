import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { RacesProvider } from '@/context/RacesContext';
import RaceNew from '@/pages/RaceNew';

// Mocking the `react-router-dom` module to override the `useNavigate` function.
// This ensures that navigation calls in `RaceNew.jsx` are intercepted during testing.
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');

  return {
    // Spread all actual exports to keep existing functionality
    ...actual,

    // Mock `useNavigate` to be a spy function that can track calls
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
  it('renders the race creation form', () => {
    renderWithProviders(<RaceNew />);

    expect(screen.getByLabelText(/Race Name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Competitor/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Race/i })).toBeInTheDocument();
  });

  it('allows adding Competitors with unique lane assignments', () => {
    renderWithProviders(<RaceNew />);

    // Add first Competitor
    fireEvent.change(screen.getByLabelText(/Competitor Name/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByLabelText(/Lane Number/i), { target: { value: '1' } }); 
    fireEvent.click(screen.getByRole('button', { name: /Add Competitor/i }));

    // Add second Competitor
    fireEvent.change(screen.getByLabelText(/Competitor Name/i), { target: { value: 'Bob' } });
    fireEvent.change(screen.getByLabelText(/Lane Number/i), { target: { value: '2' } }); 
    fireEvent.click(screen.getByRole('button', { name: /Add Competitor/i }));
    
    // Ensure both names appear in the list
    expect(screen.getByText(/Alice/i)).toBeInTheDocument();
    expect(screen.getByText(/Bob/i)).toBeInTheDocument();
  });

  it('disables already assigned lanes in the dropdown', () => {
    renderWithProviders(<RaceNew />);

    fireEvent.change(screen.getByLabelText(/Competitor Name/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByLabelText(/Lane Number/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Competitor/i }));

    // Add another Competitor
    fireEvent.change(screen.getByLabelText(/Competitor Name/i), { target: { value: 'Bob' } });

    // Ensure lane 1 is disabled
    expect(screen.getByLabelText(/Lane Number/i)).toHaveTextContent('2');
  });

  it('prevents saving without at least two participants', () => {
    renderWithProviders(<RaceNew />);

    // Add Race Name
    fireEvent.change(screen.getByLabelText(/Race Name/i), { target: { value: "Race #1"} });

    // Click Save with no Competitors added
    fireEvent.click(screen.getByRole('button', { name: /Save Race/i }));

    expect(screen.getByText(/A race must have at least two competitors./i)).toBeInTheDocument();
  });

  it('prevents saving without a race name', () => {
    renderWithProviders(<RaceNew />);

    // Click Save with no Competitors added
    fireEvent.click(screen.getByRole('button', { name: /Save Race/i }));

    expect(screen.getByText(/Race name cannot be empty/i)).toBeInTheDocument();
  });


  it('saves the race to localStorage and navigates back', () => {
    const mockNavigate = vi.fn(); // Create a spy function
    useNavigate.mockReturnValue(mockNavigate); // Assign the mock to `useNavigate`

    renderWithProviders(<RaceNew />);

    // Add Race Name
    fireEvent.change(screen.getByLabelText(/Race Name/i), { target: { value: "Race #1"} });

    // Add two Competitors
    fireEvent.change(screen.getByLabelText(/Competitor Name/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByLabelText(/Lane Number/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Competitor/i }));

    fireEvent.change(screen.getByLabelText(/Competitor Name/i), { target: { value: 'Bob' } });
    fireEvent.change(screen.getByLabelText(/Lane Number/i), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Competitor/i }));

    // Save race
    fireEvent.click(screen.getByRole('button', { name: /Save Race/i }));

    expect(localStorage.getItem('races')).not.toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});