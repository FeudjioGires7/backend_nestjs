import { Module } from '@nestjs/common';
import { FournisseurOnProduitsController } from './fournisseur-on-produits.controller';
import { FournisseurOnProduitsService } from './fournisseur-on-produits.service';

@Module({
  controllers: [FournisseurOnProduitsController],
  providers: [FournisseurOnProduitsService]
})
export class FournisseurOnProduitsModule {}
