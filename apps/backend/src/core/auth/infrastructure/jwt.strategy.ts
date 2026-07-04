import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '../domain/user.repository';

export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    name: string;
    mustChangePassword: boolean;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.userRepository.findById(payload.sub);
        if (!user || !user.isActive()) {
            throw new UnauthorizedException('Token inválido o usuario inactivo');
        }
        return {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
            name: payload.name,
            mustChangePassword: payload.mustChangePassword,
        };
    }
}