import { Controller, Post, Request, UseGuards } from "@nestjs/common";
import { User } from "src/users/entities/user.entity";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { RefreshTokenGuard } from "./guards/refresh-token.guard";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("login")
    @UseGuards(LocalAuthGuard)
    async login(@Request() req: { user: User }) {
        const { accessToken, refreshToken } = await this.authService.login(
            req.user
        );

        return { accessToken, refreshToken };
    }

    @Post("refresh")
    @UseGuards(RefreshTokenGuard)
    async refresh(@Request() req: { userId: string }) {
        const accessToken = await this.authService.refresh(req.userId);

        return { accessToken };
    }

    @Post("logout")
    @UseGuards(RefreshTokenGuard)
    async logout(@Request() req: { userId: string }) {
        await this.authService.logout(req.userId);
    }
}
