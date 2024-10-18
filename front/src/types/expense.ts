export interface IExpense {
  id: string;
  expense: number;
  category: string;
  date: string;
  year: number;
  month: number;
  comments: string | null;
}
