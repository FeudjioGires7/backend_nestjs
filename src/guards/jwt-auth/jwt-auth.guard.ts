import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private readonly configService: ConfigService
  ) {
    
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers['authorization']?.split(' ')[1];
    const match = await this.prismaService.invalidToken.findFirst({ where : {token}})
    
    if (!token || match) return false;
    try {
      const user = this.jwtService.verify<any>(token,
        {secret: this.configService.get('SECRET_KEY')}
      );
      request.user = user;
    }catch (e) {
      throw new UnauthorizedException("Action non autorisee ", e.message);
    }
    
    return true;
  }
}
