import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailerModule } from './mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';
import { EmplacementModule } from './emplacement/emplacement.module';
import { EtagereModule } from './etagere/etagere.module';
import { CategorieModule } from './categorie/categorie.module';
import { ProduitModule } from './produit/produit.module';
import { FournisseurModule } from './fournisseur/fournisseur.module';
import { LigneCommandeModule } from './ligne-commande/ligne-commande.module';
import { CommandeModule } from './commande/commande.module';
import { FournisseurOnProduitsModule } from './fournisseur-on-produits/fournisseur-on-produits.module';


@Module({
  imports: [AuthModule, PrismaModule, MailerModule, ConfigModule.forRoot({isGlobal: true}), EmplacementModule, EtagereModule, CategorieModule, ProduitModule, FournisseurModule, LigneCommandeModule, CommandeModule, FournisseurOnProduitsModule ],
  controllers: [],
  providers: [],
})
export class AppModule {

}
