import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RacesContext } from '@/context/RacesContext';
import RaceForm from '@/components/RaceForm';

const RaceNew = () => {
  const { dispatch, error } = useContext(RacesContext);
  const navigate = useNavigate();

  const [race, setRace] = useState({ name: '', competitors: [] });
  const [saving, setSaving] = useState(false);

  const handleSubmit = () => {
    setSaving(true);
    dispatch({ type: 'ADD_RACE', payload: race });
  };

  useEffect(() => {
    if (saving && !error) {
      navigate('/');
    }
  }, [saving, error, navigate]);

  return <RaceForm race={race} onSubmit={handleSubmit} onChange={setRace} error={error} />;
};

export default RaceNew;