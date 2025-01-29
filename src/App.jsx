import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RacesProvider } from '@/context/RacesContext';
import RacesIndex from '@/pages/RacesIndex';
import RaceNew from '@/pages/RaceNew';
import './App.css';

function App() {
  return (
    <RacesProvider> {/* Wrap the entire app */}
      <Router>
        <Routes>
          <Route path="/" element={<RacesIndex />} />
          <Route path="/races/new" element={<RaceNew />} />
        </Routes>
      </Router>
    </RacesProvider>
  );
}

export default App;

