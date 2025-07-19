import { Pool, QueryResult } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../domain/task.entity';
import { TaskRepository } from '../domain/task.repository';

export class PgTaskRepository implements TaskRepository {
  private pool: Pool;

  constructor() {
    
    this.pool = new Pool({
      user: process.env.DB_USER || 'user',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'todolist_db',
      password: process.env.DB_PASSWORD || 'password',
      port: parseInt(process.env.DB_PORT || '5432', 10),
    });

    this.initTable();
  }

  private async initTable() {
    try {
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS tasks (
          id VARCHAR(36) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          completed BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Tabela de tarefas verificada/criada.');
    } catch (error) {
      console.error('Erro ao inicializar a tabela de tarefas:', error);
    }
  }

  async create(
    task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Task> {
    const id = uuidv4(); 
    const result = await this.pool.query(
      `INSERT INTO tasks (id, title, description, completed) VALUES ($1, $2, $3, $4) RETURNING *`,
      [id, task.title, task.description, task.completed]
    );
    const row = result.rows[0]; 
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      completed: row.completed,
      createdAt: row.created_at, 
      updatedAt: row.updated_at,
    };
  }

  async findAll(): Promise<Task[]> {
    const result = await this.pool.query(`SELECT * FROM tasks ORDER BY created_at DESC`);
    
    return result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      completed: row.completed,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async findById(id: string): Promise<Task | null> {
    const result = await this.pool.query(`SELECT * FROM tasks WHERE id = $1`, [id]);
    const row = result.rows[0];
    if (!row) return null;
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      completed: row.completed,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async update(id: string, task: Partial<Task>): Promise<Task | null> {
   
    const validKeys = Object.keys(task).filter(
      (key) => (task as any)[key] !== undefined && key !== 'id' && key !== 'createdAt' && key !== 'updatedAt'
    );

    if (validKeys.length === 0) {
      
      return this.findById(id);
    }

    const setClause = validKeys
      .map((key, index) => {
        
        const dbColumnName = key.replace(/([A-Z])/g, "_$1").toLowerCase();
        return `${dbColumnName} = $${index + 2}`;
      })
      .join(', ');

    const values = validKeys.map(key => (task as any)[key]);

    const result = await this.pool.query(
      `UPDATE tasks SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      [id, ...values] 
    );

    const row = result.rows[0];
    if (!row) return null; 

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      completed: row.completed,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

async delete(id: string): Promise<boolean> {
  const result: QueryResult = await this.pool.query(`DELETE FROM tasks WHERE id = $1`, [id]);
  return result.rowCount! > 0;
}
}