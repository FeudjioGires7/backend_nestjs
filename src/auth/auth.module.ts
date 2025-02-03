import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { AdminGuard } from 'src/guards/admin/admin.guard';
import { QueueModule } from 'src/queue/Queue.module';

@Module({
 
  controllers: [AuthController],
  imports: [JwtModule.register({}), QueueModule],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, AdminGuard]
})
export class AuthModule {}
