import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ResultsCard from "@/components/ResultsCard";
import RaceNotFound from '@/components/RaceNotFound';

export default function RaceShow() {
  const { id } = useParams(); // Get race ID from URL
  const [race, setRace] = useState(null);

  useEffect(() => {
    // Load races from localStorage
    const storedRaces = JSON.parse(localStorage.getItem("races")) || [];
    const foundRace = storedRaces.find((r) => r.id === id);
    setRace(foundRace || null);
  }, [id]);

  if (!race) {
    return <RaceNotFound />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">

      <ResultsCard race={race} />
      <div className="flex justify">
        <Link to="/" className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
          Back to Races
        </Link>
      </div>
    </div>
  );
}