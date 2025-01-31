import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RaceStatusBadge from "@/components/RaceStatusBadge"; 

export default function RacesIndex() {
  const [races, setRaces] = useState([]);

  useEffect(() => {
    // Load races from localStorage
    const storedRaces = JSON.parse(localStorage.getItem("races")) || [];
    setRaces(storedRaces);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Race Events</h1>
        <Link to="/races/new">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Add Event
          </button>
        </Link>
      </div>

      {/* Show message when there are no races */}
      {races.length === 0 ? (
        <div className="text-center text-gray-500 mt-6">
          <p>No races found.</p>
          <p className="mt-2">Click <span className="font-medium text-blue-500">"Add Race"</span> to create your first race.</p>
        </div>
      ) : (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-500">Total Events</div>
              <div className="text-2xl font-bold">{races.length}</div>
            </div>
          </div>

          {/* Race List */}
          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 font-medium text-gray-500">Event Name</th>
                    <th className="px-6 py-3 font-medium text-gray-500">Date</th>
                    <th className="px-6 py-3 font-medium text-gray-500">Venue</th>
                    <th className="px-6 py-3 font-medium text-gray-500">Competitors</th>
                    <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                    <th className="px-6 py-3 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {races.map((race) => (
                    <tr key={race.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">
                        <Link to={`/races/${race.id}`} className="text-blue-500 hover:underline">
                          {race.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        {race.date ? new Date(race.date).toLocaleDateString() : "TBD"}
                      </td>
                      <td className="px-6 py-4">{race.venue || "Unknown"}</td>
                      <td className="px-6 py-4">{race.competitors?.length || 0}</td>
                      <td className="px-6 py-4"><RaceStatusBadge race={race} /></td>                      
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Link to={`/races/${race.id}`}>
                            <button
                              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                              View Results
                            </button>
                          </Link>
                          <Link to={`/races/${race.id}/edit`}>
                            <button
                              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                              Edit
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}