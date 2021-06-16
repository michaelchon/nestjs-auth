import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { EmailModule } from "src/email/email.module";
import { Code } from "./entities/code.entity";
import { User } from "./entities/user.entity";
import { IGenerateCode, IHash } from "./interfaces/di.interfaces";
import { HashPasswordPipe } from "./transformation/hash-password.pipe";
import { UsersController } from "./users.controller";
import { generateCodeDiToken, hashDiToken } from "./users.di-tokens";
import { UsersService } from "./users.service";
import { CodeExistsConstraint } from "./validation/code-exists";
import { UserDoesNotExistConstraint } from "./validation/user-does-not-exist";
import { UserDoesNotHaveCodeConstraint } from "./validation/user-does-not-have-code";
import { UserExistsConstraint } from "./validation/user-exists";
import { UserNotVerifiedConstraint } from "./validation/user-not-verified";

const generateCode: IGenerateCode = () =>
    crypto.randomBytes(64).toString("hex");
const hash: IHash = (value) => bcrypt.hash(value, 10);

@Module({
    imports: [TypeOrmModule.forFeature([User, Code]), EmailModule],
    controllers: [UsersController],
    providers: [
        UsersService,
        HashPasswordPipe,
        UserDoesNotExistConstraint,
        UserExistsConstraint,
        UserNotVerifiedConstraint,
        UserDoesNotHaveCodeConstraint,
        CodeExistsConstraint,
        {
            provide: generateCodeDiToken,
            useValue: generateCode,
        },
        { provide: hashDiToken, useValue: hash },
    ],
    exports: [TypeOrmModule],
})
export class UsersModule {}
