import { Module } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';
import { DynamoModule } from './providers/dynamo/dynamo.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TodoModule, DynamoModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
