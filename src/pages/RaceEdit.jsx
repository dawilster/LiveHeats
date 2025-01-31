import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RacesContext } from '@/context/RacesContext';
import RaceForm from '@/components/RaceForm';
import RaceNotFound from '@/components/RaceNotFound';

const RaceEdit = () => {
  const { races, dispatch, error } = useContext(RacesContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const existingRace = races.find((r) => r.id === id);
  const [race, setRace] = useState(existingRace);
  const [saving, setSaving] = useState(false);

  const handleSubmit = () => {
    setSaving(true);
    dispatch({ type: 'UPDATE_RACE', payload: race });
  };

  useEffect(() => {
    if (saving && !error) {
      navigate('/');
    }
  }, [saving, error, navigate]);

  if (!existingRace) {
    return <RaceNotFound />;
  }

  return <RaceForm race={race} onSubmit={handleSubmit} onChange={setRace} error={error} />;
};

export default RaceEdit;