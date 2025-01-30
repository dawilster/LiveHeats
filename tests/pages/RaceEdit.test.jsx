import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { RacesProvider } from '@/context/RacesContext';
import RaceEdit from '@/pages/RaceEdit';

// Mock `useNavigate`
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// Helper function to render within context
const renderWithProviders = (ui, { route = '/races/1/edit' } = {}) => {
  window.history.pushState({}, 'Test page', route);

  return render(
    <MemoryRouter initialEntries={[route]}>
      <RacesProvider>
        <Routes>
          <Route path="/races/:id/edit" element={ui} />
        </Routes>
        </RacesProvider>
    </MemoryRouter>
  );
};

describe('RaceEdit Page', () => {
  let mockNavigate;

  beforeEach(() => {
    localStorage.setItem(
      'races',
      JSON.stringify([
        { id: '1', name: 'Test Race', competitors: [
          { id: '1', name: 'Alice', lane: 1 },
          { id: '2', name: 'Bob', lane: 2 }
        ] }
      ])
    );

    mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('loads the correct race into the form', () => {
    renderWithProviders(<RaceEdit />);

    expect(screen.getByDisplayValue('Test Race')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Alice')).toBeInTheDocument();
  });

  it('allows updating race details', async () => {
    renderWithProviders(<RaceEdit />);

    // Change the race name
    fireEvent.change(screen.getByLabelText(/Race Name/i), { target: { value: 'Updated Race' } });

    // Change competitor name
    fireEvent.change(screen.getByDisplayValue('Alice'), { target: { value: 'Bob' } });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Save Race/i }));
    });

    // Ensure updates are stored
    expect(JSON.parse(localStorage.getItem('races'))[0].name).toBe('Updated Race');
    expect(JSON.parse(localStorage.getItem('races'))[0].competitors[0].name).toBe('Bob');
  });

  it('navigates back after saving', async () => {
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);

    renderWithProviders(<RaceEdit />);

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Save Race/i }));
    });

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});