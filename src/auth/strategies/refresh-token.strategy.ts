import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import { AuthService } from "../auth.service";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
    Strategy,
    "refresh-token"
) {
    constructor(
        configService: ConfigService,
        private readonly authService: AuthService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField("token"),
            ignoreExpiration: false,
            secretOrKey: configService.get("JWT_REFRESH_TOKEN_SECRET"),
            passReqToCallback: true,
        } as StrategyOptions);
    }

    async validate(req: Request, payload: any) {
        const tokenMatches = await this.authService.validateRefreshToken(
            req.body.token,
            payload.sub
        );

        if (!tokenMatches) {
            throw new UnauthorizedException();
        }

        return { userId: payload.sub };
    }
}
