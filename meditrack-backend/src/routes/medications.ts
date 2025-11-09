import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { db } from '../database/db';
import { Medication } from '../types';

export const medicationRouter = Router();

// Todas as rotas requerem autenticação
medicationRouter.use(authMiddleware);

// Listar medicamentos do usuário
medicationRouter.get('/', (req, res) => {
  const userId = req.user!.userId;
  const medications = db.medications.filter(m => m.userId === userId);
  res.json(medications);
});

// Criar medicamento
medicationRouter.post('/', (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { name, dosageMg, timesPerDay, schedules, active } = req.body;

    // Validação
    if (!name || !dosageMg || !timesPerDay || !schedules || schedules.length === 0) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    const medication: Medication = {
      id: Date.now().toString(),
      userId,
      name,
      dosageMg,
      timesPerDay,
      schedules, // Array de horários: ["08:00", "14:00", "20:00"]
      active: active !== undefined ? active : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.medications.push(medication);

    res.status(201).json({
      message: 'Medicamento cadastrado com sucesso',
      medication
    });
  } catch (error) {
    next(error);
  }
});

// Atualizar medicamento
medicationRouter.put('/:id', (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const { name, dosageMg, timesPerDay, schedules, active } = req.body;

    const index = db.medications.findIndex(m => m.id === id && m.userId === userId);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Medicamento não encontrado' });
    }

    db.medications[index] = {
      ...db.medications[index],
      name: name || db.medications[index].name,
      dosageMg: dosageMg || db.medications[index].dosageMg,
      timesPerDay: timesPerDay || db.medications[index].timesPerDay,
      schedules: schedules || db.medications[index].schedules,
      active: active !== undefined ? active : db.medications[index].active,
      updatedAt: new Date().toISOString()
    };

    res.json({
      message: 'Medicamento atualizado com sucesso',
      medication: db.medications[index]
    });
  } catch (error) {
    next(error);
  }
});

// Deletar medicamento
medicationRouter.delete('/:id', (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const index = db.medications.findIndex(m => m.id === id && m.userId === userId);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Medicamento não encontrado' });
    }

    db.medications.splice(index, 1);

    res.json({ message: 'Medicamento deletado com sucesso' });
  } catch (error) {
    next(error);
  }
});

// Obter medicamento específico
medicationRouter.get('/:id', (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const medication = db.medications.find(m => m.id === id && m.userId === userId);
    
    if (!medication) {
      return res.status(404).json({ error: 'Medicamento não encontrado' });
    }

    res.json(medication);
  } catch (error) {
    next(error);
  }
});