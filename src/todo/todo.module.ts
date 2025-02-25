import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { DynamoModule } from 'src/providers/dynamo/dynamo.module';

@Module({
  imports: [DynamoModule],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
