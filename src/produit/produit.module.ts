import { Module } from '@nestjs/common';
import { ProduitController } from './produit.controller';
import { ProduitService } from './produit.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { AdminGuard } from 'src/guards/admin/admin.guard';

@Module({
  controllers: [ProduitController],
  providers: [ProduitService, JwtAuthGuard, AdminGuard],
  imports: [JwtModule.register({})]
})
export class ProduitModule {}
