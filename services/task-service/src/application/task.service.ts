import { Task } from '../domain/task.entity';
import { TaskRepository } from '../domain/task.repository';

export class TaskService {
  constructor(private taskRepository: TaskRepository) {}

  async createTask(
    title: string,
    description?: string
  ): Promise<Task> {
    const newTask = {
      title,
      description,
      completed: false,
    };
    return this.taskRepository.create(newTask);
  }

  async getTasks(): Promise<Task[]> {
    return this.taskRepository.findAll();
  }

  async getTaskById(id: string): Promise<Task | null> {
    return this.taskRepository.findById(id);
  }

  async updateTask(
    id: string,
    updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Task | null> {
    return this.taskRepository.update(id, updates);
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.taskRepository.delete(id);
  }
}