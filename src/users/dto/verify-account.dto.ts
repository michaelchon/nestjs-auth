import { ValidationOptions } from "src/validation/validation-options";
import { CodeExists } from "../validation/code-exists";

export class VerifyAccountDto {
    @CodeExists(
        new ValidationOptions({
            id: "INVALID_CODE",
            message: "Code is invalid or expired. Request a new one.",
        })
    )
    code: string;
}
