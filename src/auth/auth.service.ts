import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import {
    compareHashDiToken,
    hashDiToken,
    validateUuidDiToken,
} from "./auth.di-tokens";
import { ICompareHash, IHash, IValidateUuid } from "./interfaces/di.interfaces";

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @Inject(hashDiToken) private readonly hash: IHash,
        @Inject(compareHashDiToken) private readonly compareHash: ICompareHash,
        @Inject(validateUuidDiToken)
        private readonly validateUuid: IValidateUuid
    ) {}

    async validateUser(email: string, password: string) {
        const user = await this.usersRepository.findOne({ email });

        if (
            user &&
            (await this.compareHash({ plain: password, hash: user.password }))
        ) {
            return user;
        }

        return null;
    }

    async login(user: User) {
        const payload = { sub: user.id };

        const accessToken = this.generateAccessToken(payload);
        const refreshToken = this.generateRefreshToken(payload);

        user.refreshToken = await this.hash(refreshToken);
        await this.usersRepository.save(user);

        return { accessToken, refreshToken };
    }

    async validateRefreshToken(token: string, userId: string) {
        if (!this.validateUuid(userId)) {
            return false;
        }

        const user = await this.usersRepository.findOne(userId);

        return (
            !!user &&
            user.refreshToken &&
            (await this.compareHash({ plain: token, hash: user.refreshToken }))
        );
    }

    async refresh(userId: string) {
        const payload = { sub: userId };

        return this.generateAccessToken(payload);
    }

    async logout(userId: string) {
        const user = await this.usersRepository.findOne(userId);
        user.refreshToken = null;
        await this.usersRepository.save(user);
    }

    generateAccessToken(payload: any) {
        return this.jwtService.sign(payload, {
            secret: this.configService.get("JWT_ACCESS_TOKEN_SECRET"),
            expiresIn: this.configService.get(
                "JWT_ACCESS_TOKEN_EXPIRATION_TIME"
            ),
        });
    }

    generateRefreshToken(payload: any) {
        return this.jwtService.sign(payload, {
            secret: this.configService.get("JWT_REFRESH_TOKEN_SECRET"),
            expiresIn: this.configService.get(
                "JWT_REFRESH_TOKEN_EXPIRATION_TIME"
            ),
        });
    }
}
