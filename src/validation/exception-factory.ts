import { BadRequestException } from "@nestjs/common";
import { ValidationError } from "class-validator";
import { isValidationError } from "./interfaces/validation-error.interface";

export const exceptionFactory = (errors: ValidationError[]) => {
    const outputErrors = [];

    for (const error of errors) {
        if (!error.contexts) continue;

        for (const context of Object.values(error.contexts)) {
            if (isValidationError(context)) {
                outputErrors.push(context);
            }
        }
    }

    throw new BadRequestException({ errors: outputErrors });
};
