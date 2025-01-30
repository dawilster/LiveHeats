import React from "react";

const RaceStatusBadge = ({ race }) => {
  if (!race || !race.competitors) return null;

  // Check if all placements are empty (i.e., race is upcoming)
  const isUpcoming = race.competitors.every((c) => !c.placement);

  // If not upcoming, the race is completed
  const status = isUpcoming ? "upcoming" : "completed";

  // Assign styles and labels for the badge
  const styles = {
    upcoming: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };

  const labels = {
    upcoming: "Upcoming",
    completed: "Completed",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

export default RaceStatusBadge;