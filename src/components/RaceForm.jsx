import { useState, useEffect } from 'react';

const RaceForm = ({ race, onSubmit, onChange, error }) => {
  const [competitorName, setCompetitorName] = useState('');
  const [laneNumber, setLaneNumber] = useState('');
  const [localError, setLocalError] = useState(null);
  const [availableLanes, setAvailableLanes] = useState([]);

  /**
   * Automatically updates the available lanes whenever competitors change.
   * Ensures competitors cannot select an already occupied lane.
   */
  useEffect(() => {
    const updatedAvailableLanes = Array.from({ length: 10 }, (_, i) => i + 1).filter(
      (lane) => !race.competitors.some((competitor) => competitor.lane === lane)
    );

    setAvailableLanes(updatedAvailableLanes); // Store available lanes in state
    setLaneNumber(updatedAvailableLanes[0] || ''); // Auto-select first available lane
  }, [race.competitors]);

  /**
   * Adds a competitor to the race while ensuring validation.
   */
  const addCompetitor = () => {
    if (!competitorName.trim() || !laneNumber) {
      setLocalError("Competitor name and lane number are required.");
      return;
    }

    onChange({
      ...race,
      competitors: [
        ...race.competitors,
        { id: Date.now().toString(), name: competitorName, lane: Number(laneNumber), placement: null }
      ]
    });

    setCompetitorName('');
    setLocalError(null);
  };

  return (
    <form
      role="form" 
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(race);
      }}
    >
      <h2>{race.id ? 'Edit Race' : 'Create New Race'}</h2>

      <label>
        Race Name:
        <input
          type="text"
          value={race.name}
          onChange={(e) => onChange({ ...race, name: e.target.value })}
        />
      </label>

      <div>
        <h3>Add Competitors</h3>
        <label>
          Competitor Name:
          <input
            type="text"
            value={competitorName}
            onChange={(e) => setCompetitorName(e.target.value)}
          />
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

        <button type="button" onClick={addCompetitor}>Add Competitor</button>

        {localError && <p style={{ color: 'red' }}>{localError}</p>}
      </div>

      <h3>Competitors</h3>
      <ul>
        {race.competitors.map((competitor) => (
          <li key={competitor.id}>{competitor.name} - Lane {competitor.lane}</li>
        ))}
      </ul>

      {/* Show race validation errors from context */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit">Save Race</button>
    </form>
  );
};

export default RaceForm;