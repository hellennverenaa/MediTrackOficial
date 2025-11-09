import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { db } from '../database/db';

export const notificationRouter = Router();

notificationRouter.use(authMiddleware);

// Obter próximas notificações do dia
notificationRouter.get('/upcoming', (req, res) => {
  const userId = req.user!.userId;
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const activeMedications = db.medications.filter(m => m.userId === userId && m.active);
  
  const upcoming = activeMedications
    .flatMap(med => 
      med.schedules
        .filter(time => time > currentTime)
        .map(time => ({
          medicationId: med.id,
          medicationName: med.name,
          dosageMg: med.dosageMg,
          scheduledTime: time
        }))
    )
    .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

  res.json(upcoming);
});

// Registrar que medicamento foi tomado
notificationRouter.post('/taken', (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { medicationId, takenAt } = req.body;

    if (!medicationId || !takenAt) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    const medication = db.medications.find(m => m.id === medicationId && m.userId === userId);
    
    if (!medication) {
      return res.status(404).json({ error: 'Medicamento não encontrado' });
    }

    const record = {
      id: Date.now().toString(),
      userId,
      medicationId,
      medicationName: medication.name,
      takenAt,
      createdAt: new Date().toISOString()
    };

    if (!db.takenRecords) {
      db.takenRecords = [];
    }

    db.takenRecords.push(record);

    res.json({
      message: 'Registro salvo com sucesso',
      record
    });
  } catch (error) {
    next(error);
  }
});

// Histórico de medicamentos tomados
notificationRouter.get('/history', (req, res) => {
  const userId = req.user!.userId;
  const { startDate, endDate } = req.query;

  let records = db.takenRecords?.filter(r => r.userId === userId) || [];

  if (startDate) {
    records = records.filter(r => r.takenAt >= startDate);
  }

  if (endDate) {
    records = records.filter(r => r.takenAt <= endDate);
  }

  res.json(records.sort((a, b) => b.takenAt.localeCompare(a.takenAt)));
});
