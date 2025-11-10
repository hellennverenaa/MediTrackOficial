import { useState, useEffect } from 'react';
import { medicationService, Medication } from '../services/api';

function MedicationsList() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      const data = await medicationService.getAll();
      setMedications(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar medicamentos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente deletar este medicamento?')) return;

    try {
      await medicationService.delete(id);
      setMedications(medications.filter((m) => m.id !== id));
    } catch (err: any) {
      alert('Erro ao deletar medicamento');
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const updated = await medicationService.toggleActive(id, !currentActive);
      setMedications(medications.map((m) => (m.id === id ? updated : m)));
    } catch (err: any) {
      alert('Erro ao atualizar medicamento');
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Meus Medicamentos</h2>
      {medications.length === 0 ? (
        <p>Nenhum medicamento cadastrado</p>
      ) : (
        <ul>
          {medications.map((med) => (
            <li key={med.id}>
              <h3>{med.name}</h3>
              <p>Dosagem: {med.dosageMg}mg</p>
              <p>Horários: {med.schedules.join(', ')}</p>
              <p>Status: {med.active ? 'Ativo' : 'Inativo'}</p>
              <button onClick={() => handleToggleActive(med.id, med.active)}>
                {med.active ? 'Desativar' : 'Ativar'}
              </button>
              <button onClick={() => handleDelete(med.id)}>Deletar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
