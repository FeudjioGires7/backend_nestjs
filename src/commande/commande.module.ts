import { Module } from '@nestjs/common';
import { CommandeController } from './commande.controller';
import { CommandeService } from './commande.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [CommandeController],
  providers: [CommandeService],
  imports: [JwtModule.register({})]
})
export class CommandeModule {}
