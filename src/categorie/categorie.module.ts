import { Module } from '@nestjs/common';
import { CategorieController } from './categorie.controller';
import { CategorieService } from './categorie.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { AdminGuard } from 'src/guards/admin/admin.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [CategorieController],
  imports: [JwtModule.register({})],
  providers: [CategorieService, JwtAuthGuard, AdminGuard]
})
export class CategorieModule {}
