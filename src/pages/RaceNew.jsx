import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RacesContext } from '@/context/RacesContext';

const RaceNew = () => {
  const { dispatch, error } = useContext(RacesContext);
  const navigate = useNavigate();

  const [raceName, setRaceName] = useState('');
  const [competitors, setCompetitors] = useState([]);
  const [competitorName, setCompetitorName] = useState('');
  const [laneNumber, setLaneNumber] = useState('');
  const [localError, setLocalError] = useState(null); // Store local errors
  const [saving, setSaving] = useState(false); // Track when "Save Race" is clicked
  const [availableLanes, setAvailableLanes] = useState([]);

  // Auto-selects the first available lane when competitors are updated.
  useEffect(() => {
    // Compute available lanes dynamically
    const updatedAvailableLanes = Array.from({ length: 100 }, (_, i) => i + 1).filter(
      (lane) => !competitors.some((competitor) => competitor.lane === lane)
    );

    setAvailableLanes(updatedAvailableLanes);
    setLaneNumber(updatedAvailableLanes[0] || ''); // Auto-select first available lane
  }, [competitors]);

  const addCompetitor = () => {
    if (!competitorName.trim() || !laneNumber) {
      setLocalError("Competitor name and lane number are required.");
      return;
    }

    setCompetitors((prevCompetitors) => [
      ...prevCompetitors,
      { id: Date.now().toString(), name: competitorName, lane: Number(laneNumber), placement: null }
    ]);

    setCompetitorName('');
    setLocalError(null); // Clear errors on successful add
  };

  const saveRace = () => {
    setSaving(true); // Mark saving state

    const newRace = { id: Date.now().toString(), name: raceName, competitors };
    dispatch({ type: 'ADD_RACE', payload: newRace });
  };

  // Only navigate when "Save Race" was clicked and there are no errors
  useEffect(() => {
    if (saving && !error) {
      navigate('/'); // Navigate only after successfully saving
    }
  }, [saving, error, competitors, navigate]);

  return (
    <div>
      <h2>Create New Race</h2>
      <label>
        Race Name:
        <input type="text" value={raceName} onChange={(e) => setRaceName(e.target.value)} />
      </label>

      <div>
        <h3>Add Competitors</h3>
        <label>
          Competitor Name:
          <input type="text" value={competitorName} onChange={(e) => setCompetitorName(e.target.value)} />
        </label>

        <label>
          Lane Number:
          <select value={laneNumber} onChange={(e) => setLaneNumber(e.target.value)}>
            <option value="" disabled>Select Lane</option>
            {availableLanes.map((lane) => (
              <option key={lane} value={lane}>{lane}</option>
            ))}
          </select>
        </label>

        <button onClick={addCompetitor}>Add Competitor</button>

        {/* Show local validation errors */}
        {localError && <p style={{ color: 'red' }}>{localError}</p>}
      </div>

      <h3>Competitors</h3>
      <ul>
        {competitors.map((competitor) => (
          <li key={competitor.id}>{competitor.name} - Lane {competitor.lane}</li>
        ))}
      </ul>

      {/* Show race validation errors from context */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={saveRace}>Save Race</button>
    </div>
  );
};

export default RaceNew;