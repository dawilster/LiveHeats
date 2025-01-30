import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RaceForm = ({ race, onSubmit, onChange, error }) => {
  const [localError, setLocalError] = useState(null);
  const navigate = useNavigate();

  const addCompetitor = () => {
    const newCompetitor = {
      id: Date.now().toString(),
      name: '',
      lane: '',
      placement: '',
    };

    onChange({ ...race, competitors: [...race.competitors, newCompetitor] });
    setLocalError(null);
  };

  const updateCompetitor = (id, field, value) => {
    const updatedCompetitors = race.competitors.map((competitor) =>
      competitor.id === id ? { ...competitor, [field]: value } : competitor
    );

    onChange({ ...race, competitors: updatedCompetitors });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {race.id ? 'Edit Race' : 'Create New Race'}
          </h2>
        </div>

        <div className="space-y-4">
          {/* Race Name Input */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="race-name" className="text-gray-700 font-medium">
              Race Name
            </label>
            <input
              id="race-name"
              type="text"
              placeholder="Enter race name"
              value={race.name}
              onChange={(e) => onChange({ ...race, name: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Competitor Table */}
          <div className="relative overflow-x-auto border border-gray-300 rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-300">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium text-gray-500">Competitor Name</th>
                  <th scope="col" className="px-6 py-3 font-medium text-gray-500">Lane</th>
                  <th scope="col" className="px-6 py-3 font-medium text-gray-500">Place</th>
                  <th scope="col" className="px-6 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {race.competitors.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      No competitors yet, click <span className="font-medium text-blue-500">"Add Competitor"</span> to add your first.
                    </td>
                  </tr>
                ) : (
                  race.competitors.map((competitor) => (
                    <tr key={competitor.id} className="bg-white">
                      <td className="px-6 py-4">
                        <label htmlFor={`competitor-name-${competitor.id}`} className="sr-only">
                          Competitor Name
                        </label>
                        <input
                          id={`competitor-name-${competitor.id}`}
                          type="text"
                          value={competitor.name}
                          onChange={(e) => updateCompetitor(competitor.id, 'name', e.target.value)}
                          placeholder="Competitor Name"
                          className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          data-testid="lane-input"
                          id={`lane-${competitor.id}`}
                          type="number"
                          min="1"
                          max="100"
                          placeholder="0"
                          value={competitor.lane}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                            updateCompetitor(competitor.id, 'lane', value ? parseInt(value, 10) : '');
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-md w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      {/* Placement Field - Show only if editing a race */}
                      <td className="px-6 py-4">
                        <label htmlFor={`placement-${competitor.id}`} className="sr-only">
                          Placement
                        </label>
                        <input
                          data-testid="place-input"
                          id={`place-${competitor.id}`}
                          type="number"
                          min="1"
                          max="100"
                          placeholder="0"
                          value={competitor.placement || ''}
                          onChange={(e) => updateCompetitor(competitor.id, 'placement', e.target.value)}
                          disabled={!race.id} // ✅ Disables the input when race.id is missing
                          className="px-3 py-2 border border-gray-300 rounded-md w-24 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => onChange({
                            ...race,
                            competitors: race.competitors.filter((c) => c.id !== competitor.id),
                          })}
                          className="px-3 py-1 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Error Messages */}
          {localError && <p className="text-red-500">{localError}</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* Buttons: Add Competitor & Save Race */}
          <div className="flex justify-between items-center">
            {/* Back Button - Aligned to Left */}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Back
            </button>

            {/* Right-aligned buttons (Add Competitor & Save Race) */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={addCompetitor}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Add Competitor
              </button>
              <button
                type="submit"
                onClick={onSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-32"
              >
                Save Race
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaceForm;