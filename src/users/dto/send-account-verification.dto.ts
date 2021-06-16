import { ValidationOptions } from "src/validation/validation-options";
import { UserDoesNotHaveCode } from "../validation/user-does-not-have-code";
import { UserExists } from "../validation/user-exists";
import { UserNotVerified } from "../validation/user-not-verified";

export class SendAccountVerificationDto {
    @UserExists(
        new ValidationOptions({
            id: "USER_NOT_FOUND",
            message: "User does not exist.",
        })
    )
    @UserNotVerified(
        new ValidationOptions({
            id: "USER_ALREADY_VERIFIED",
            message: "User is already verified.",
        })
    )
    @UserDoesNotHaveCode(
        new ValidationOptions({
            id: "USER_ALREADY_HAS_CODE",
            message:
                "The code has already been sent. Wait until it expires and request a new one.",
        })
    )
    email: string;
}
