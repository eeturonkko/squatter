export interface Week {
  id: string;
  name: string;
  target: "bulk" | "cut";
  startDate: Date;
}

export interface WeightEntry {
  id: string;
  weight: number;
  date: Date;
  weekId: string;
  weekName?: string;
}
