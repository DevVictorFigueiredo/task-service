import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { TaskService as ApplicationTaskService } from '../application/task.service';
import { TaskRepository } from '../domain/task.repository';
import * as path from 'path';

const PROTO_PATH = path.join(__dirname, '..', '..', 'task.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const taskProto: any = grpc.loadPackageDefinition(packageDefinition).tasks;

export class GrpcServer {
  private server: grpc.Server;
  private taskService: ApplicationTaskService;

  constructor(taskRepository: TaskRepository) {
    this.server = new grpc.Server();
    this.taskService = new ApplicationTaskService(taskRepository);
    this.addService();
  }

  private addService() {
    this.server.addService(taskProto.TaskService.service, {
      CreateTask: async (call: any, callback: any) => {
        try {
          const { title, description } = call.request;
          const task = await this.taskService.createTask(title, description || undefined);
          callback(null, {
            task: {
              ...task,
              createdAt: task.createdAt?.toISOString(),
              updatedAt: task.updatedAt?.toISOString(),
            },
          });
        } catch (error: any) {
          callback({
            code: grpc.status.INTERNAL,
            details: error.message,
          });
        }
      },
      GetTasks: async (call: any, callback: any) => {
        try {
          const tasks = await this.taskService.getTasks();
          callback(null, {
            tasks: tasks.map((task) => ({
              ...task,
              createdAt: task.createdAt?.toISOString(),
              updatedAt: task.updatedAt?.toISOString(),
            })),
          });
        } catch (error: any) {
          callback({
            code: grpc.status.INTERNAL,
            details: error.message,
          });
        }
      },
      GetTaskById: async (call: any, callback: any) => {
        try {
          const { id } = call.request;
          const task = await this.taskService.getTaskById(id);
          if (!task) {
            return callback({
              code: grpc.status.NOT_FOUND,
              details: 'Task not found',
            });
          }
          callback(null, {
            task: {
              ...task,
              createdAt: task.createdAt?.toISOString(),
              updatedAt: task.updatedAt?.toISOString(),
            },
          });
        } catch (error: any) {
          callback({
            code: grpc.status.INTERNAL,
            details: error.message,
          });
        }
      },
      UpdateTask: async (call: any, callback: any) => {
        try {
          const { id, title, description, completed } = call.request;
          const updatedTask = await this.taskService.updateTask(id, {
            title,
            description,
            completed,
          });
          if (!updatedTask) {
            return callback({
              code: grpc.status.NOT_FOUND,
              details: 'Task not found',
            });
          }
          callback(null, {
            task: {
              ...updatedTask,
              createdAt: updatedTask.createdAt?.toISOString(),
              updatedAt: updatedTask.updatedAt?.toISOString(),
            },
          });
        } catch (error: any) {
          callback({
            code: grpc.status.INTERNAL,
            details: error.message,
          });
        }
      },
      DeleteTask: async (call: any, callback: any) => {
        try {
          const { id } = call.request;
          const success = await this.taskService.deleteTask(id);
          if (!success) {
            return callback({
              code: grpc.status.NOT_FOUND,
              details: 'Task not found',
            });
          }
          callback(null, { success: true });
        } catch (error: any) {
          callback({
            code: grpc.status.INTERNAL,
            details: error.message,
          });
        }
      },
    });
  }

  start(port: string) {
    this.server.bindAsync(
      `0.0.0.0:${port}`,
      grpc.ServerCredentials.createInsecure(),
      (err: Error | null, port: number) => {
        if (err) {
          return;
        }
      }
    );
  }
}