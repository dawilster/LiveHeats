import { createContext, useReducer, useEffect } from 'react';

// Load races from localStorage
const loadRaces = () => {
  const storedRaces = JSON.parse(localStorage.getItem('races'));

  // Ensure the stored data is always an array
  return Array.isArray(storedRaces) ? storedRaces : [];
};

// Save races to localStorage
const saveRaces = (races) => {
  localStorage.setItem('races', JSON.stringify(races));
};

// ** Consolidated Validation Function **
const validateRace = (race) => {
  if (!race.id || typeof race.id !== 'string' || race.id.trim() === '') {
    return "Race ID is missing or invalid.";
  }

  if (!race.name.trim()) {
    return "Race name cannot be empty.";
  }

  if (race.competitors.length < 2) {
    return "A race must have at least two competitors.";
  }

  const lanes = race.competitors.map((p) => p.lane);
  const hasDuplicateLanes = new Set(lanes).size !== lanes.length;

  if (hasDuplicateLanes) {
    return "Each competitor must have a unique lane.";
  }

  return null; // No errors
};

// Reducer function to manage race actions
const racesReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_RACE': {
      const newRace = {
        ...action.payload,
        id: action.payload.id || Date.now().toString(), // Ensure a unique ID
      };

      const error = validateRace(newRace);
      if (error) {
        return { ...state, error }; // Keep error in state but don't modify races
      }

      const newRaces = [...state.races, newRace];
      saveRaces(newRaces);
      return { races: newRaces, error: null };
    }

    case 'UPDATE_RACE': {
      const error = validateRace(action.payload);
      if (error) {
        return { ...state, error };
      }

      const updatedRaces = state.races.map((race) =>
        race.id === action.payload.id ? action.payload : race
      );

      saveRaces(updatedRaces);
      return { races: updatedRaces, error: null };
    }

    case 'DELETE_RACE': {
      const filteredRaces = state.races.filter((race) => race.id !== action.payload);
      saveRaces(filteredRaces);
      return { races: filteredRaces, error: null };
    }

    default:
      return state;
  }
};
// Context creation
export const RacesContext = createContext();

// Provider component
export const RacesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(racesReducer, { races: loadRaces(), error: null });

  // Only update localStorage when `state.races` changes (not when `error` updates)
  useEffect(() => {
    saveRaces(state.races);
  }, [state.races]);

  return (
    <RacesContext.Provider value={{ races: state.races, error: state.error, dispatch }}>
      {children}
    </RacesContext.Provider>
  );
};