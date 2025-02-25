import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { v4 as uuid } from 'uuid';
import { Task } from 'src/common/interfaces/todo.interfaces';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

@Injectable()
export class TodoService {
  private tableName = 'IrisTodoTable';

  constructor(
    @Inject('DYNAMO_DB_CLIENT')
    private readonly docClient: DynamoDBDocumentClient,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<Task> {
    console.log('Creating task with text:', createTodoDto.text);
    const newTodo: Task = {
      id: uuid(),
      text: createTodoDto.text,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: newTodo,
      }),
    );

    console.log('Task created:', newTodo);
    return JSON.parse(JSON.stringify(newTodo)) as Task;
  }

  async findAll(): Promise<Task[]> {
    const result = await this.docClient.send(
      new ScanCommand({ TableName: this.tableName }),
    );
    return result.Items
      ? (result.Items.map((item) => unmarshall(item)) as Task[])
      : [];
  }

  async findOne(id: string): Promise<Task> {
    const result = await this.docClient.send(
      new GetCommand({ TableName: this.tableName, Key: { id } }),
    );
    if (!result.Item) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return unmarshall(result.Item) as Task;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Task> {
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};
    const updateExpressions = [];

    if (updateTodoDto.text !== undefined) {
      expressionAttributeNames['#text'] = 'text';
      expressionAttributeValues[':text'] = updateTodoDto.text;
      updateExpressions.push('#text = :text');
    }
    if (updateTodoDto.completed !== undefined) {
      expressionAttributeValues[':completed'] = updateTodoDto.completed;
      updateExpressions.push('completed = :completed');
    }

    if (updateExpressions.length === 0) {
      throw new Error('No valid fields provided for update.');
    }

    const params: any = {
      TableName: this.tableName,
      Key: { id },
      UpdateExpression: 'set ' + updateExpressions.join(', '),
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW' as const,
    };

    if (Object.keys(expressionAttributeNames).length > 0) {
      params.ExpressionAttributeNames = expressionAttributeNames;
    }

    const result = await this.docClient.send(new UpdateCommand(params));
    if (!result.Attributes) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return JSON.parse(JSON.stringify(result.Attributes)) as Task;
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.docClient.send(
      new DeleteCommand({ TableName: this.tableName, Key: { id } }),
    );
    return { message: 'Todo deleted successfully' };
  }
}
