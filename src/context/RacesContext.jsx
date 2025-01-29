import { createContext, useReducer, useEffect } from 'react';

// Load races from localStorage
const loadRaces = () => {
  const storedRaces = JSON.parse(localStorage.getItem('races'));
  return storedRaces ? storedRaces : [];
};

// Save races to localStorage
const saveRaces = (races) => {
  localStorage.setItem('races', JSON.stringify(races));
};

// ** Consolidated Validation Function **
const validateRace = (race) => {
  if (race.competitors.length < 2) {
    // TODO: Better error handling
    console.error("A race must have at least two competitors.");
    return false;
  }

  const lanes = race.competitors.map((p) => p.lane);
  const hasDuplicateLanes = new Set(lanes).size !== lanes.length;

  if (hasDuplicateLanes) {
    // TODO: Better error handling
    console.error("Each competitor must have a unique lane.");
    return false;
  }

  return true;
};

// Reducer function to manage race actions
const racesReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_RACE': {
      const newRace = action.payload;

      if (!validateRace(newRace)) {
        return state; // Reject invalid race data
      }

      const newRaces = [...state, newRace];
      saveRaces(newRaces);
      return newRaces;
    }

    case 'UPDATE_RACE': {
      const updatedRace = action.payload;

      if (!validateRace(updatedRace)) {
        return state; // Reject invalid race data
      }

      const updatedRaces = state.map((race) =>
        race.id === updatedRace.id ? updatedRace : race
      );

      saveRaces(updatedRaces);
      return updatedRaces;
    }

    case 'DELETE_RACE': {
      const filteredRaces = state.filter((race) => race.id !== action.payload);
      saveRaces(filteredRaces);
      return filteredRaces;
    }

    default:
      return state;
  }
};

// Context creation
export const RacesContext = createContext();

// Provider component
export const RacesProvider = ({ children }) => {
  const [races, dispatch] = useReducer(racesReducer, [], loadRaces);

  // Sync localStorage whenever races change
  useEffect(() => {
    saveRaces(races);
  }, [races]);

  return (
    <RacesContext.Provider value={{ races, dispatch }}>
      {children}
    </RacesContext.Provider>
  );
};