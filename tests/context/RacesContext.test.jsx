import { render, screen, act } from '@testing-library/react';
import { RacesProvider, RacesContext } from '@/context/RacesContext';
import { useContext, useEffect } from 'react';

// Helper component to consume context for testing
const TestComponent = ({ action }) => {
  const { races, dispatch } = useContext(RacesContext);

  // Use effect to avoid React warning about state updates during render
  useEffect(() => {
    if (action) {
      action(dispatch);
    }
  }, [action, dispatch]);

  return (
    <div>
      <p data-testid="races-count">{races.length}</p>
      {races.map((race) => (
        <p key={race.id} data-testid="race-name">{race.name}</p>
      ))}
    </div>
  );
};

describe('RacesContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads initial races from localStorage', () => {
    const mockRaces = [{ id: '1', name: 'Race 1', competitors: [] }];
    localStorage.setItem('races', JSON.stringify(mockRaces));

    render(
      <RacesProvider>
        <TestComponent />
      </RacesProvider>
    );

    expect(screen.getByTestId('races-count')).toHaveTextContent('1');
    expect(screen.getByText('Race 1')).toBeInTheDocument();
  });

  it('automatically assigns an ID if missing on ADD_RACE', () => {
    render(
      <RacesProvider>
        <TestComponent action={(dispatch) =>
          act(() => dispatch({
            type: 'ADD_RACE',
            payload: {
              name: 'Race Without ID',
              competitors: [
                { id: 'student-1', name: 'Alice', lane: 1, placement: null },
                { id: 'student-2', name: 'Bob', lane: 2, placement: null },
              ],
            },
          }))
        } />
      </RacesProvider>
    );

    // Ensure race is added
    expect(screen.getByTestId('races-count')).toHaveTextContent('1');

    // Retrieve race from localStorage
    const storedRaces = JSON.parse(localStorage.getItem('races'));
    expect(storedRaces.length).toBe(1);

    // Ensure race has an ID assigned automatically
    expect(storedRaces[0].id).toBeDefined();
    expect(typeof storedRaces[0].id).toBe("string");
    expect(storedRaces[0].id.trim()).not.toBe('');
  });

  it('adds a new race only if it has at least two competitors', () => {
    render(
      <RacesProvider>
        <TestComponent action={(dispatch) =>
          act(() => dispatch({
            type: 'ADD_RACE',
            payload: {
              id: '2',
              name: 'Invalid Race',
              competitors: [{ id: 'student-1', name: 'Alice', lane: 1, placement: null }],
            },
          }))
        } />
      </RacesProvider>
    );

    // Race should NOT be added because it only has 1 participant
    expect(screen.getByTestId('races-count')).toHaveTextContent('0');
  });

  it('prevents adding a new race if race name is empty', () => {
    render(
      <RacesProvider>
        <TestComponent action={(dispatch) =>
          act(() => dispatch({
            type: 'ADD_RACE',
            payload: {
              id: '2',
              name: '',
              competitors: [{ id: 'student-1', name: 'Alice', lane: 1, placement: null }],
            },
          }))
        } />
      </RacesProvider>
    );

    // Race should NOT be added because it only has 1 participant
    expect(screen.getByTestId('races-count')).toHaveTextContent('0');
  });


  it('adds a valid race and updates localStorage', () => {
    render(
      <RacesProvider>
        <TestComponent action={(dispatch) =>
          act(() => dispatch({
            type: 'ADD_RACE',
            payload: {
              id: '3',
              name: 'Valid Race',
              competitors: [
                { id: 'student-1', name: 'Alice', lane: 1, placement: null },
                { id: 'student-2', name: 'Bob', lane: 2, placement: null },
              ],
            },
          }))
        } />
      </RacesProvider>
    );

    expect(screen.getByTestId('races-count')).toHaveTextContent('1');
    expect(screen.getByText('Valid Race')).toBeInTheDocument();

    const storedRaces = JSON.parse(localStorage.getItem('races'));
    expect(storedRaces.length).toBe(1);
    expect(storedRaces[0].name).toBe('Valid Race');
  });

  it('prevents adding a race with duplicate lane assignments', () => {
    render(
      <RacesProvider>
        <TestComponent action={(dispatch) =>
          act(() => dispatch({
            type: 'ADD_RACE',
            payload: {
              id: '4',
              name: 'Duplicate Lane Race',
              competitors: [
                { id: 'student-1', name: 'Alice', lane: 1, placement: null },
                { id: 'student-2', name: 'Bob', lane: 1, placement: null }, // Duplicate lane
              ],
            },
          }))
        } />
      </RacesProvider>
    );

    // Race should NOT be added because lane 1 is duplicated
    expect(screen.getByTestId('races-count')).toHaveTextContent('0');
  });

  it('updates an existing race and ensures lane uniqueness', () => {
    const mockRace = {
      id: '5',
      name: 'Race to Update',
      competitors: [
        { id: 'student-1', name: 'Alice', lane: 1, placement: null },
        { id: 'student-2', name: 'Bob', lane: 2, placement: null },
      ],
    };

    localStorage.setItem('races', JSON.stringify([mockRace]));

    render(
      <RacesProvider>
        <TestComponent action={(dispatch) =>
          act(() =>
            dispatch({
              type: 'UPDATE_RACE',
              payload: {
                ...mockRace,
                competitors: [
                  { id: 'student-1', name: 'Alice', lane: 1, placement: null },
                  { id: 'student-3', name: 'Charlie', lane: 1, placement: null }, // Duplicate lane
                ],
              },
            })
          )
        } />
      </RacesProvider>
    );

    const storedRaces = JSON.parse(localStorage.getItem('races'));
    const updatedRace = storedRaces.find((race) => race.id === '5');

    // Ensure lane 1 wasn't duplicated
    const lanes = updatedRace.competitors.map((p) => p.lane);
    expect(new Set(lanes).size).toBe(updatedRace.competitors.length);
  });

  it('deletes a race', () => {
    const mockRace = { id: '6', name: 'Race to Delete', competitors: [] };
    localStorage.setItem('races', JSON.stringify([mockRace]));

    render(
      <RacesProvider>
        <TestComponent action={(dispatch) =>
          act(() => dispatch({ type: 'DELETE_RACE', payload: '6' }))
        } />
      </RacesProvider>
    );

    expect(screen.getByTestId('races-count')).toHaveTextContent('0');
    expect(screen.queryByText('Race to Delete')).not.toBeInTheDocument();

    const storedRaces = JSON.parse(localStorage.getItem('races'));
    expect(storedRaces.length).toBe(0);
  });

});