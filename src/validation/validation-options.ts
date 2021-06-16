import { ValidationOptions as ClassValidatorValidationOptions } from "class-validator";
import { IValidationError } from "./interfaces/validation-error.interface";

export class ValidationOptions implements ClassValidatorValidationOptions {
    constructor(public context: IValidationError) {}
}
