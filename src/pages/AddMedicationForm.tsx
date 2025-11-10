import { useState } from 'react';
import { medicationService } from '../services/api';

function AddMedicationForm() {
  const [formData, setFormData] = useState({
    name: '',
    dosageMg: '',
    timesPerDay: '',
    schedules: [''],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleAddSchedule = () => {
    setFormData({
      ...formData,
      schedules: [...formData.schedules, ''],
    });
  };

  const handleScheduleChange = (index: number, value: string) => {
    const newSchedules = [...formData.schedules];
    newSchedules[index] = value;
    setFormData({ ...formData, schedules: newSchedules });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await medicationService.create({
        name: formData.name,
        dosageMg: Number(formData.dosageMg),
        timesPerDay: Number(formData.timesPerDay),
        schedules: formData.schedules.filter((s) => s !== ''),
        active: true,
      });
      setSuccess(true);
      // Resetar form
      setFormData({
        name: '',
        dosageMg: '',
        timesPerDay: '',
        schedules: [''],
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao cadastrar medicamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Cadastrar Medicamento</h2>
      
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Nome do medicamento"
        required
      />

      <input
        type="number"
        value={formData.dosageMg}
        onChange={(e) => setFormData({ ...formData, dosageMg: e.target.value })}
        placeholder="Dosagem (mg)"
        required
      />

      <input
        type="number"
        value={formData.timesPerDay}
        onChange={(e) => setFormData({ ...formData, timesPerDay: e.target.value })}
        placeholder="Vezes por dia"
        required
      />

      <div>
        <h3>Horários:</h3>
        {formData.schedules.map((schedule, index) => (
          <input
            key={index}
            type="time"
            value={schedule}
            onChange={(e) => handleScheduleChange(index, e.target.value)}
            required
          />
        ))}
        <button type="button" onClick={handleAddSchedule}>
          + Adicionar horário
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Medicamento cadastrado com sucesso!</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Cadastrando...' : 'Cadastrar'}
      </button>
    </form>
  );
}