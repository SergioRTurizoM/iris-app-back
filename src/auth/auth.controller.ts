import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-auth.dto';
import { User } from 'src/common/interfaces/users.interface';
import { AuthService } from './auth-service/auth-service.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: CreateUserDto,
  ): Promise<{ access_token: string }> {
    return this.authService.login(loginDto.username, loginDto.password);
  }
}
