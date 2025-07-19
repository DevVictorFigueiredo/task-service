import { PgTaskRepository } from './infrastructure/pg-task.repository';
import { GrpcServer } from './infrastructure/grpc-server';
import dotenv from 'dotenv';

dotenv.config();


const PORT = process.env.GRPC_PORT || '50051';

async function bootstrap() {
  
  const taskRepository = new PgTaskRepository();
  const grpcServer = new GrpcServer(taskRepository);

  grpcServer.start(PORT);

}

bootstrap();