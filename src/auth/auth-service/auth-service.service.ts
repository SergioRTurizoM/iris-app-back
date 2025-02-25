import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { User } from 'src/common/interfaces/users.interface';
import { CreateUserDto } from '../dto/create-auth.dto';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private userTable = 'Users';

  constructor(
    @Inject('DYNAMO_DB_CLIENT')
    private readonly docClient: DynamoDBDocumentClient,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );
    const newUser: User = {
      id: uuid(),
      username: createUserDto.username,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    await this.docClient.send(
      new PutCommand({
        TableName: this.userTable,
        Item: newUser,
      }),
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword as User;
  }

  async validateUser(username: string, password: string): Promise<User> {
    const result = await this.docClient.send(
      new GetCommand({
        TableName: this.userTable,
        Key: { username },
      }),
    );

    if (!result.Item) {
      throw new UnauthorizedException('User not found');
    }
    const user = result.Item as User;

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(
    username: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.validateUser(username, password);
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
