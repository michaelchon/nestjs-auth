import { IsEmail, Matches } from "class-validator";
import { ValidationOptions } from "src/validation/validation-options";
import { User } from "../entities/user.entity";
import { UserDoesNotExist } from "../validation/user-does-not-exist";

export class RegisterDto {
    @IsEmail(
        {},
        new ValidationOptions({
            id: "INVALID_EMAIL",
            message: "Invalid email.",
        })
    )
    @UserDoesNotExist(
        new ValidationOptions({
            id: "USER_ALREADY_EXISTS",
            message: "User with the same email already exists.",
        })
    )
    email: string;

    @Matches(
        User.passwordRegex,
        new ValidationOptions({
            id: "INVALID_PASSWORD",
            message: "Invalid password.",
        })
    )
    password: string;
}
