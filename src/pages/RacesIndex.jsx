import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function RacesIndex() {
  const [races, setRaces] = useState([]);

  useEffect(() => {
    // Load races from localStorage
    const storedRaces = JSON.parse(localStorage.getItem("races")) || [];
    setRaces(storedRaces);
  }, []);

  return (
    <div>
      <h1>Races</h1>

      <Link to="/races/new">
        <button>Add Race</button>
      </Link>

      {races.length === 0 ? (
        <p>No races found.</p>
      ) : (
        <ul>
          {races.map((race) => (
            <li key={race.id}>
              <Link to={`/races/${race.id}`}>{race.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}