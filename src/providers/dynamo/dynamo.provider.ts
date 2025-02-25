import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export const DynamoDbClientProvider = {
  provide: 'DYNAMO_DB_CLIENT',
  useFactory: (): DynamoDBDocumentClient => {
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION || 'us-east-1',
    });
    return DynamoDBDocumentClient.from(client);
  },
};
