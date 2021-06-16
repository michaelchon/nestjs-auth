import { Inject, Injectable } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { EmailService } from "src/email/email.service";
import { Repository } from "typeorm";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { RegisterDto } from "./dto/register.dto";
import { SendAccountVerificationDto } from "./dto/send-account-verification.dto";
import { SendPasswordVerificationDto } from "./dto/send-password-verification.dto";
import { VerifyAccountDto } from "./dto/verify-account.dto";
import { Code } from "./entities/code.entity";
import { User } from "./entities/user.entity";
import { IGenerateCode } from "./interfaces/di.interfaces";
import { generateCodeDiToken } from "./users.di-tokens";

@Injectable()
export class UsersService {
    constructor(
        private readonly emailService: EmailService,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(Code)
        private readonly codesRepository: Repository<Code>,
        @Inject(generateCodeDiToken)
        private readonly generateCode: IGenerateCode
    ) {}

    async register(dto: RegisterDto) {
        const createdUser = await this.usersRepository.save(
            this.usersRepository.create(dto)
        );

        await this.sendAccountVerification({ email: dto.email });

        return createdUser;
    }

    async sendAccountVerification(dto: SendAccountVerificationDto) {
        const code = await this.createCode(dto.email);

        const link = `http://localhost:3000/account-verification/${code}`;
        await this.emailService.sendEmail({
            to: dto.email,
            subject: "Account Verification - Todo",
            html: `<p>To verify your account click on this link: <a href="${link}">${link}</a>.</p>
                   <p>If you did not register no further actions are required because your account is not active.</p>`,
        });
    }

    async verifyAccount(dto: VerifyAccountDto) {
        const updatedUser = await this.updateUser(dto.code, (user) => ({
            ...user,
            isActive: true,
        }));

        return updatedUser;
    }

    async sendPasswordVerification(dto: SendPasswordVerificationDto) {
        const code = await this.createCode(dto.email);

        const link = `http://localhost:3000/change-password/${code}`;
        await this.emailService.sendEmail({
            to: dto.email,
            subject: "Change Password - Todo",
            html: `<p>To verify your password click on this link: <a href="${link}">${link}</a>.</p>
                   <p>If you did not request a password change no further actions are required.</p>`,
        });
    }

    async changePassword(dto: ChangePasswordDto) {
        const updatedUser = await this.updateUser(dto.code, (user) => ({
            ...user,
            password: dto.password,
        }));

        return updatedUser;
    }

    async createCode(email: string) {
        const user = await this.usersRepository.findOne({ email });

        const code = this.generateCode();
        await this.codesRepository.save(
            this.codesRepository.create({
                code,
                user,
            })
        );

        return code;
    }

    async updateUser(code: string, update: (user: User) => User) {
        const dbCode = await this.codesRepository.findOne(
            { code },
            { relations: ["user"] }
        );
        await this.codesRepository.remove(dbCode);

        const user = update(dbCode.user);
        const updatedUser = await this.usersRepository.save(user);

        return updatedUser;
    }

    @Interval(1000 * 60 * 10)
    async deleteExpiredCodes() {
        await this.codesRepository
            .createQueryBuilder("code")
            .delete()
            .where(`(NOW() - code."createDate") >= INTERVAL '10 minutes'`)
            .execute();
    }
}
