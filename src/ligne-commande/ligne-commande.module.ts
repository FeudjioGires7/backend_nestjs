import { Module } from '@nestjs/common';
import { LigneCommandeController } from './ligne-commande.controller';
import { LigneCommandeService } from './ligne-commande.service';

@Module({
  controllers: [LigneCommandeController],
  providers: [LigneCommandeService]
})
export class LigneCommandeModule {}
