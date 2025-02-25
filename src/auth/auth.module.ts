import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth-service/auth-service.service';
import { DynamoModule } from 'src/providers/dynamo/dynamo.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    DynamoModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'iris-todo-app',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
