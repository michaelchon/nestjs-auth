import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import bcrypt from "bcrypt";
import { UsersModule } from "src/users/users.module";
import { validate as uuidValidate } from "uuid";
import { AuthController } from "./auth.controller";
import {
    compareHashDiToken,
    hashDiToken,
    validateUuidDiToken,
} from "./auth.di-tokens";
import { AuthService } from "./auth.service";
import { ICompareHash, IHash, IValidateUuid } from "./interfaces/di.interfaces";
import { LocalStrategy } from "./strategies/local.strategy";
import { RefreshTokenStrategy } from "./strategies/refresh-token.strategy";

const hash: IHash = (value) => bcrypt.hash(value, 10);
const compareHash: ICompareHash = ({ plain, hash }) =>
    bcrypt.compare(plain, hash);
const validateUuid: IValidateUuid = uuidValidate;

@Module({
    imports: [UsersModule, PassportModule, JwtModule.register({})],
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy,
        RefreshTokenStrategy,
        { provide: hashDiToken, useValue: hash },
        { provide: compareHashDiToken, useValue: compareHash },
        { provide: validateUuidDiToken, useValue: validateUuid },
    ],
})
export class AuthModule {}
