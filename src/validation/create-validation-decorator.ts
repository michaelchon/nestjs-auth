import { registerDecorator } from "class-validator";
import { ValidationOptions } from "./validation-options";

export const createValidationDecorator = (validator: any) => {
    return (validationOptions?: ValidationOptions) => {
        return (object: Object, propertyName: string) => {
            registerDecorator({
                target: object.constructor,
                propertyName,
                options: validationOptions,
                constraints: [],
                validator,
            });
        };
    };
};
