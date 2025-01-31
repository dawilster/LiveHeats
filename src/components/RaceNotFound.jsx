// src/components/RaceNotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const RaceNotFound = () => (
  <div className="max-w-4xl mx-auto p-4 space-y-4">
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900">Race Not Found</h1>
      <p className="text-gray-500">The race you are looking for does not exist.</p>
      <Link to="/" className="text-blue-500 hover:underline">Back to Races</Link>
    </div>
  </div>
);

export default RaceNotFound;