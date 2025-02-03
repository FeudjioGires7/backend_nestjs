import { Module } from '@nestjs/common';
import { FournisseurController } from './fournisseur.controller';
import { FournisseurService } from './fournisseur.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [FournisseurController],
  providers: [FournisseurService],
  imports: [JwtModule.register({})]
})
export class FournisseurModule {}
