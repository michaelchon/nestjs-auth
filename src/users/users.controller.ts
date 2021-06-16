import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { ValidationPipe } from "src/validation/validation.pipe";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { RegisterDto } from "./dto/register.dto";
import { SendAccountVerificationDto } from "./dto/send-account-verification.dto";
import { SendPasswordVerificationDto } from "./dto/send-password-verification.dto";
import { VerifyAccountDto } from "./dto/verify-account.dto";
import { HashPasswordPipe } from "./transformation/hash-password.pipe";
import { UsersService } from "./users.service";

@Controller("users")
@UsePipes(new ValidationPipe())
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post("register")
    async register(@Body(HashPasswordPipe) dto: RegisterDto) {
        const createdUser = await this.usersService.register(dto);

        return { id: createdUser.id };
    }

    @Post("send-account-verification")
    async sendAccountVerification(@Body() dto: SendAccountVerificationDto) {
        await this.usersService.sendAccountVerification(dto);
    }

    @Post("account-verification")
    async verifyAccount(@Body() dto: VerifyAccountDto) {
        const updatedUser = await this.usersService.verifyAccount(dto);

        return { id: updatedUser.id };
    }

    @Post("send-password-verification")
    async sendPasswordVerification(@Body() dto: SendPasswordVerificationDto) {
        await this.usersService.sendPasswordVerification(dto);
    }

    @Post("change-password")
    async changePassword(@Body(HashPasswordPipe) dto: ChangePasswordDto) {
        const updatedUser = await this.usersService.changePassword(dto);

        return { id: updatedUser.id };
    }
}
