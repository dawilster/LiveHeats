import { Routes, Route } from 'react-router-dom';
import { RacesProvider } from '@/context/RacesContext';
import RacesIndex from '@/pages/RacesIndex';
import RaceNew from '@/pages/RaceNew';
import RaceEdit from '@/pages/RaceEdit';
import RaceShow from '@/pages/RaceShow';
import './App.css';

function App() {
  return (
    <RacesProvider>
      <Routes>
        <Route path="/" element={<RacesIndex />} />
        <Route path="/races/new" element={<RaceNew />} />
        <Route path="/races/:id" element={<RaceShow />} />
        <Route path="/races/:id/edit" element={<RaceEdit />} />
      </Routes>
    </RacesProvider>
  );
}

export default App;