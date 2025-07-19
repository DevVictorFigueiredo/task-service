import { GrpcTaskClient } from '../infrastructure/grpc-task.client'; // Importa o cliente gRPC que acabamos de criar

interface CreateTaskDto {
  title: string;
  description?: string;
}

interface UpdateTaskDto {
  title?: string;
  description?: string;
  completed?: boolean;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string; 
  updatedAt: string;
}

export class TaskGatewayService {
  private grpcTaskClient: GrpcTaskClient;

  constructor(grpcTaskClient: GrpcTaskClient) {
    this.grpcTaskClient = grpcTaskClient;
  }

  async createTask(data: CreateTaskDto): Promise<Task> {
    try {
      
      const result = await this.grpcTaskClient.createTask(data.title, data.description);
      
      return result;
    } catch (error) {
      console.error('Erro no TaskGatewayService.createTask:', error);
      throw error; 
    }
  }

  async getTasks(): Promise<Task[]> {
    try {
      const result = await this.grpcTaskClient.getTasks();
      return result;
    } catch (error) {
      console.error('Erro no TaskGatewayService.getTasks:', error);
      throw error;
    }
  }

  async getTaskById(id: string): Promise<Task | null> {
    try {
      const result = await this.grpcTaskClient.getTaskById(id);
      return result; 
    } catch (error) {
      console.error('Erro no TaskGatewayService.getTaskById:', error);
      throw error;
    }
  }

  
  async updateTask(id: string, updates: UpdateTaskDto): Promise<Task | null> {
    try {
      const result = await this.grpcTaskClient.updateTask(id, updates);
      return result;
    } catch (error) {
      console.error('Erro no TaskGatewayService.updateTask:', error);
      throw error;
    }
  }

  async deleteTask(id: string): Promise<boolean> {
    try {
      const result = await this.grpcTaskClient.deleteTask(id);
      return result;
    } catch (error) {
      console.error('Erro no TaskGatewayService.deleteTask:', error);
      throw error;
    }
  }
}