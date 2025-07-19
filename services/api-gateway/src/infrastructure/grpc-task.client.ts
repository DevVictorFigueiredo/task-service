import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';

interface TaskServiceClient extends grpc.Client {
  
  CreateTask: (request: any, callback: grpc.requestCallback<any>) => grpc.ClientUnaryCall;
  GetTasks: (request: any, callback: grpc.requestCallback<any>) => grpc.ClientUnaryCall;
  GetTaskById: (request: any, callback: grpc.requestCallback<any>) => grpc.ClientUnaryCall;
  UpdateTask: (request: any, callback: grpc.requestCallback<any>) => grpc.ClientUnaryCall;
  DeleteTask: (request: any, callback: grpc.requestCallback<any>) => grpc.ClientUnaryCall;
}

export class GrpcTaskClient {
  private client: TaskServiceClient;

  constructor(taskServiceUrl: string) {
   
    const PROTO_PATH = path.join(__dirname, '..', '..', 'task.proto');

    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    const taskProto: any = grpc.loadPackageDefinition(packageDefinition).tasks;

    this.client = new taskProto.TaskService(
      taskServiceUrl,
      grpc.credentials.createInsecure() 
    ) as TaskServiceClient;
  }

  async createTask(title: string, description?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.CreateTask({ title, description }, (error: grpc.ServiceError | null, response: any) => {
        if (error) {
          return reject(error);
        }
        resolve(response.task);
      });
    });
  }

  async getTasks(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.client.GetTasks({}, (error: grpc.ServiceError | null, response: any) => {
        if (error) {
          return reject(error);
        }
        resolve(response.tasks);
      });
    });
  }

  async getTaskById(id: string): Promise<any | null> {
    return new Promise((resolve, reject) => {
      this.client.GetTaskById({ id }, (error: grpc.ServiceError | null, response: any) => {
        if (error) {
          
          if (error.code === grpc.status.NOT_FOUND) {
            return resolve(null);
          }
          return reject(error);
        }
        resolve(response.task);
      });
    });
  }

  async updateTask(id: string, updates: { title?: string; description?: string; completed?: boolean }): Promise<any | null> {
    return new Promise((resolve, reject) => {
      this.client.UpdateTask({ id, ...updates }, (error: grpc.ServiceError | null, response: any) => {
        if (error) {
          if (error.code === grpc.status.NOT_FOUND) {
            return resolve(null);
          }
          return reject(error);
        }
        resolve(response.task);
      });
    });
  }

  async deleteTask(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.client.DeleteTask({ id }, (error: grpc.ServiceError | null, response: any) => {
        if (error) {
          if (error.code === grpc.status.NOT_FOUND) {
            return resolve(false);
          }
          return reject(error);
        }
        resolve(response.success);
      });
    });
  }
}