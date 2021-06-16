import { Matches } from "class-validator";
import { ValidationOptions } from "src/validation/validation-options";
import { User } from "../entities/user.entity";
import { CodeExists } from "../validation/code-exists";

export class ChangePasswordDto {
    @CodeExists(
        new ValidationOptions({
            id: "INVALID_CODE",
            message:
                "The code is invalid or expired. Please request a new one.",
        })
    )
    code: string;

    @Matches(
        User.passwordRegex,
        new ValidationOptions({
            id: "INVALID_PASSWORD",
            message: "Invalid password.",
        })
    )
    password: string;
}
