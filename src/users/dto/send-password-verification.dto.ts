import { ValidationOptions } from "src/validation/validation-options";
import { UserDoesNotHaveCode } from "../validation/user-does-not-have-code";
import { UserExists } from "../validation/user-exists";

export class SendPasswordVerificationDto {
    @UserExists(
        new ValidationOptions({
            id: "INVALID_EMAIL",
            message: "Invalid email.",
        })
    )
    @UserDoesNotHaveCode(
        new ValidationOptions({
            id: "USER_ALREADY_HAS_CODE",
            message:
                "The code has already been sent. Please wait until it expires and request a new one.",
        })
    )
    email: string;
}
