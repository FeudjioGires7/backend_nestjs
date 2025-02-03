import { Module } from '@nestjs/common';
import { EmplacementController } from './emplacement.controller';
import { EmplacementService } from './emplacement.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { AdminGuard } from 'src/guards/admin/admin.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [EmplacementController],
  imports: [JwtModule.register({})],
  providers: [EmplacementService, JwtAuthGuard, AdminGuard]
})
export class EmplacementModule {}
