import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createTransportDiToken } from "./email.di-tokens";
import { ICreateTransport } from "./interfaces/create-transport.interface";
import { ITransport } from "./interfaces/transport.interface";

@Injectable()
export class EmailService {
    private readonly transport: ITransport;
    private readonly auth: { email: string; password: string };

    constructor(
        configService: ConfigService,
        @Inject(createTransportDiToken) createTransport: ICreateTransport
    ) {
        this.auth = {
            email: configService.get("EMAIL_USER"),
            password: configService.get("EMAIL_PASSWORD"),
        };

        this.transport = createTransport(this.auth.email, this.auth.password);
    }

    async sendEmail(options: { to: string; subject: string; html: string }) {
        await this.transport.sendEmail({
            from: this.auth.email,
            to: options.to,
            subject: options.subject,
            html: options.html,
        });
    }
}
