import dotenv from 'dotenv';
import { GrpcTaskClient } from './infrastructure/grpc-task.client'; 
import { TaskGatewayService } from './application/task.gateway.service'; 
import { ExpressServer } from './infrastructure/express.server'; 

dotenv.config();

const API_GATEWAY_PORT = process.env.PORT || '3000';

const TASK_SERVICE_GRPC_URL = process.env.TASK_SERVICE_GRPC_URL || 'localhost:50051';

async function bootstrap() {
  try {
    
    const grpcTaskClient = new GrpcTaskClient(TASK_SERVICE_GRPC_URL);

    const taskGatewayService = new TaskGatewayService(grpcTaskClient);

    const expressServer = new ExpressServer(API_GATEWAY_PORT, taskGatewayService);

    expressServer.start();

    console.log(`API Gateway pronto! Rodando HTTP na porta ${API_GATEWAY_PORT}`);
    console.log(`Conectado ao Task Service gRPC em ${TASK_SERVICE_GRPC_URL}`);

  } catch (error) {
    console.error('Falha ao iniciar o API Gateway:', error);
    process.exit(1);
  }
}

bootstrap();