import { Module } from "@nestjs/common";
import nodemailer from "nodemailer";
import { createTransportDiToken } from "./email.di-tokens";
import { EmailService } from "./email.service";
import { ICreateTransport } from "./interfaces/create-transport.interface";

const createTransport: ICreateTransport = (email, password) => {
    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: { user: email, pass: password },
    });

    return { sendEmail: transport.sendMail.bind(transport) };
};

@Module({
    providers: [
        EmailService,
        { provide: createTransportDiToken, useValue: createTransport },
    ],
    exports: [EmailService],
})
export class EmailModule {}
