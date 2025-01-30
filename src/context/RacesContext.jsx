import { createContext, useReducer, useEffect } from 'react';

// Load races from localStorage
const loadRaces = () => {
  const storedRaces = JSON.parse(localStorage.getItem('races'));
  return Array.isArray(storedRaces) ? storedRaces : [];
};

// Save races to localStorage
const saveRaces = (races) => {
  localStorage.setItem('races', JSON.stringify(races));
};

// ** Extracted Competitor Validation **
const validateCompetitors = (competitors) => {
  if (competitors.length < 2) {
    return "A race must have at least two competitors.";
  }

  if (competitors.some((c) => !c.name.trim())) {
    return "All competitors must have a name.";
  }

  if (competitors.some((c) => c.lane === '' || c.lane === null)) {
    return "All competitors must have a valid lane number.";
  }

  const lanes = competitors.map((c) => c.lane);
  if (new Set(lanes).size !== lanes.length) {
    return "Each competitor must have a unique lane.";
  }

  return null;
};

const validatePlacements = (competitors) => {
  // Extract placement values, convert them to integers, and filter out invalid (non-numeric) values
  const placements = competitors
    .map((c) => parseInt(c.placement, 10)) // Convert placement to integer
    .filter((p) => !isNaN(p)) // Remove invalid placements (null, undefined, empty string, NaN)
    .sort((a, b) => a - b); // Sort placements in ascending order for proper validation

  // If no placements exist, return null (no validation needed)
  if (placements.length === 0) return null;

  let expectedRank = 1; // Start tracking the expected placement rank
  let i = 0; // Iterator to traverse placements array

  while (i < placements.length) {
    // Count how many competitors have the same placement (ties)
    const count = placements.filter(p => p === placements[i]).length;

    // Check if the placement value matches the expected ranking position
    if (placements[i] !== expectedRank) {
      return "Placements must be sequential without gaps, while handling ties correctly.";
    }

    // Adjust expected ranking by skipping the correct number of tied competitors
    expectedRank += count;

    // Move index forward by the number of competitors sharing this placement
    i += count;
  }

  return null; // If all checks pass, return null (valid placements)
};

// ** Consolidated Validation Function **
const validateRace = (race) => {
  if (!race.id || typeof race.id !== 'string' || race.id.trim() === '') {
    return "Race ID is missing or invalid.";
  }

  if (!race.name.trim()) {
    return "Race name cannot be empty.";
  }

  const competitorError = validateCompetitors(race.competitors);
  if (competitorError) return competitorError;

  const placementError = validatePlacements(race.competitors);
  if (placementError) return placementError;

  return null; // No errors
};

// Reducer function to manage race actions
const racesReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_RACE': {
      const newRace = {
        ...action.payload,
        id: action.payload.id || Date.now().toString(),
      };

      const error = validateRace(newRace);
      if (error) {
        return { ...state, error };
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

  useEffect(() => {
    saveRaces(state.races);
  }, [state.races]);

  return (
    <RacesContext.Provider value={{ races: state.races, error: state.error, dispatch }}>
      {children}
    </RacesContext.Provider>
  );
};