export interface Opportunity {
  id: number;
  title: string;
  description: string;
  is_active?: number;
  created_at?: string;
  updatedAt?: string;
  deletedAt?: string;
}