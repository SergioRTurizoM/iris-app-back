import { Module } from '@nestjs/common';
import { DynamoDbClientProvider } from './dynamo.provider';

@Module({
  providers: [DynamoDbClientProvider],
  exports: [DynamoDbClientProvider],
})
export class DynamoModule {}
