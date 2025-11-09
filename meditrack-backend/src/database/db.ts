import { User, Medication } from '../types';

interface Database {
  users: User[];
  medications: Medication[];
  takenRecords?: any[];
}

export const db: Database = {
  users: [],
  medications: [],
  takenRecords: []
};