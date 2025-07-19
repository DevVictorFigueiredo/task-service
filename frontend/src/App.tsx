import React, { useState, useEffect } from 'react';
import './App.css';
import { type Task, getTasks, createTask, updateTask, deleteTask } from './api/taskApi';

function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  );
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
      return err.message;
    }
    
    if (isErrorWithMessage(err)) {
      return err.message;
    }
    return 'Ocorreu um erro inesperado.';
  };

  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedTasks = await getTasks();
        setTasks(fetchedTasks);
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err);
        console.error('Erro ao buscar tarefas:', err);
        setError(`Falha ao buscar tarefas: ${errorMessage}. Verifique sua conexão e o status dos serviços.`);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      alert('O título da tarefa não pode ser vazio!');
      return;
    }
    try {
      setError(null);
      const createdTask = await createTask(newTaskTitle, newTaskDescription || undefined);
      setTasks((prevTasks) => [...prevTasks, createdTask]);
      setNewTaskTitle('');
      setNewTaskDescription('');
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      console.error('Erro ao criar tarefa:', err);
      setError(`Falha ao criar tarefa: ${errorMessage}`);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      setError(null);
      const updated = await updateTask(task.id, { completed: !task.completed });
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === task.id ? updated : t))
      );
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      console.error('Erro ao atualizar tarefa:', err);
      setError(`Falha ao atualizar tarefa: ${errorMessage}`);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      return;
    }
    try {
      setError(null);
      await deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      console.error('Erro ao excluir tarefa:', err);
      setError(`Falha ao excluir tarefa: ${errorMessage}`);
    }
  };

  if (loading) return <div className="app-container">Carregando tarefas...</div>;
  if (error) return <div className="app-container error-message">Erro: {error}</div>;

  return (
    <div className="app-container">
      <h1>Minha Lista de Tarefas</h1>

      <form onSubmit={handleCreateTask} className="task-form">
        <input
          type="text"
          placeholder="Título da tarefa"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Descrição (opcional)"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
        />
        <button type="submit">Adicionar Tarefa</button>
      </form>

      <div className="task-list">
        {tasks.length === 0 ? (
          <p>Nenhuma tarefa ainda! Adicione uma acima.</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task.id} className={task.completed ? 'completed' : ''}>
                <span onClick={() => handleToggleComplete(task)}>
                  <h3>{task.title}</h3>
                  {task.description && <p>{task.description}</p>}
                </span>
                <button onClick={() => handleDeleteTask(task.id)} className="delete-button">
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;