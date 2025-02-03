import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService
  ) {
    
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization.split(' ')[1];
    
    const user = this.jwtService.verify<any>(token, 
      {secret: this.configService.get('SECRET_KEY')}
    )

    const userFromDb = await this.prismaService.user.findUnique({ where: { email: user.email }});
    if(!userFromDb) throw new NotFoundException("Utilisateur non trouve");
    request.user = {...user, role: userFromDb.role}
    
    if (request.user['role'] !== 'ADMIN') return false;
    return true;
  }
}
