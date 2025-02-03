import { Module } from '@nestjs/common';
import { EtagereController } from './etagere.controller';
import { EtagereService } from './etagere.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { AdminGuard } from 'src/guards/admin/admin.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [EtagereController],
  imports: [JwtModule.register({})],
  providers: [EtagereService, JwtAuthGuard, AdminGuard]
})
export class EtagereModule {}
