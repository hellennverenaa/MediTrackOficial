export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface Medication {
  id: string;
  userId: string;
  name: string;
  dosageMg: number;
  timesPerDay: number;
  schedules: string[]; // ["08:00", "14:00", "20:00"]
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
