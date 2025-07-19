import { Task } from './task.entity';

export interface TaskRepository {
  create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task>;
  findAll(): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  update(id: string, task: Partial<Task>): Promise<Task | null>;
  delete(id: string): Promise<boolean>;
}