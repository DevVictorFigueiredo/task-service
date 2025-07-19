import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { TaskGatewayService } from '../application/task.gateway.service';

export class ExpressServer {
  private app: express.Application;
  private port: string;
  private taskGatewayService: TaskGatewayService;

  constructor(port: string, taskGatewayService: TaskGatewayService) {
    this.app = express();
    this.port = port;
    this.taskGatewayService = taskGatewayService;

    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    
    this.app.use(cors());

    this.app.use(express.json());
  }

  private setupRoutes(): void {
    
    this.app.post('/tasks', async (req: Request, res: Response) => {
      try {
        const { title, description } = req.body;
        if (!title) {
          return res.status(400).json({ message: 'Title is required.' });
        }
        const task = await this.taskGatewayService.createTask({ title, description });
        res.status(201).json(task);
      } catch (error: any) {
        
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Internal Server Error', details: error.message });
      }
    });

    this.app.get('/tasks', async (req: Request, res: Response) => {
      try {
        const tasks = await this.taskGatewayService.getTasks();
        res.status(200).json(tasks); 
      } catch (error: any) {
        console.error('Error getting tasks:', error);
        res.status(500).json({ message: 'Internal Server Error', details: error.message });
      }
    });

    this.app.get('/tasks/:id', async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const task = await this.taskGatewayService.getTaskById(id);
        if (!task) {
          return res.status(404).json({ message: 'Task not found.' });
        }
        res.status(200).json(task);
      } catch (error: any) {
        console.error('Error getting task by ID:', error);
        res.status(500).json({ message: 'Internal Server Error', details: error.message });
      }
    });

    this.app.put('/tasks/:id', async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const updates = req.body;
        const updatedTask = await this.taskGatewayService.updateTask(id, updates);
        if (!updatedTask) {
          return res.status(404).json({ message: 'Task not found for update.' });
        }
        res.status(200).json(updatedTask);
      } catch (error: any) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Internal Server Error', details: error.message });
      }
    });

    this.app.delete('/tasks/:id', async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const success = await this.taskGatewayService.deleteTask(id);
        if (!success) {
          return res.status(404).json({ message: 'Task not found for deletion.' });
        }
        res.status(204).send();
      } catch (error: any) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Internal Server Error', details: error.message });
      }
    });
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`API Gateway rodando na porta ${this.port}`);
    });
  }
}