import RaceStatusBadge from "@/components/RaceStatusBadge";

const ResultsCard = ({ race }) => {
  if (!race) return null;

  // Check if all competitors have empty placements (indicating an upcoming race)
  const isUpcoming = race.competitors.every(c => !c.placement);

  // Sort competitors by placement, placing unranked competitors at the bottom
  const sortedCompetitors = isUpcoming
    ? race.competitors // Keep the original order for upcoming races
    : [...race.competitors].sort((a, b) => {
      if (!a.placement) return 1; // Move unplaced competitors down
      if (!b.placement) return -1; // Move unplaced competitors up
      return a.placement - b.placement;
    });

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {race.name} - <RaceStatusBadge race={race} />
          </h2>
        </div>

        {/* Competitor Table */}
        <div className="relative overflow-x-auto border border-gray-300 rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-300">
              <tr>
                <th className="px-6 py-3 font-medium text-gray-500">Competitor Name</th>
                <th className="px-6 py-3 font-medium text-gray-500">Lane</th>
                <th className="px-6 py-3 font-medium text-gray-500">Placement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {sortedCompetitors.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                    No competitors recorded.
                  </td>
                </tr>
              ) : (
                sortedCompetitors.map((competitor) => (
                  <tr key={competitor.id} className="bg-white">
                    <td className="px-6 py-4 text-gray-900">{competitor.name}</td>
                    <td className="px-6 py-4 text-gray-500">Lane {competitor.lane}</td>
                    <td className="px-6 py-4 text-gray-700 font-semibold">
                      {isUpcoming ? (
                        <span className="text-gray-500">Not yet placed</span>
                      ) : competitor.placement === 1 ? (
                        "1st Place"
                      ) : competitor.placement === 2 ? (
                        "2nd Place"
                      ) : competitor.placement ? (
                        `${competitor.placement}th Place`
                      ) : (
                        <span className="text-gray-500">Not Placed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {isUpcoming && (
          <p className="text-center text-gray-500 mt-4">
            Placements will be recorded after the race.
          </p>
        )}
      </div>
    </div>
  );
};

export default ResultsCard;