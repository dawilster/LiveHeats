import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ResultsCard from "@/components/ResultsCard";

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
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900">Race Not Found</h1>
          <p className="text-gray-500">The race you are looking for does not exist.</p>
          <Link to="/" className="text-blue-500 hover:underline">Back to Races</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <ResultsCard race={race} />
      <div className="flex justify-start">
        <Link to="/" className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
          Back to Races
        </Link>
      </div>
    </div>
  );
}