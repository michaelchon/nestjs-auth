import { ValidationPipe as NestValidationPipe } from "@nestjs/common";
import { exceptionFactory } from "./exception-factory";

export class ValidationPipe extends NestValidationPipe {
    constructor() {
        super({ transform: true, exceptionFactory });
    }
}
