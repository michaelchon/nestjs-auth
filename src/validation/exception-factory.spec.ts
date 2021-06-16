import { ValidationError } from "class-validator";
import { exceptionFactory } from "./exception-factory";

describe("exception factory", () => {
    it("should generate error", () => {
        expect.hasAssertions();

        const expectedErrors = [
            { id: "INVALID_EMAIL", message: "Invalid email." },
            {
                id: "USER_ALREADY_EXISTS",
                message: "User with the same email already exists.",
            },
            { id: "INVALID_PASSWORD", message: "Invalid password." },
        ];

        const errors: unknown = [
            {
                contexts: {
                    isEmail: expectedErrors[0],
                    userDoesNotExist: expectedErrors[1],
                },
            },
            { contexts: { matches: expectedErrors[2] } },
        ];

        try {
            exceptionFactory(errors as ValidationError[]);
        } catch (e) {
            expect(e.response.errors).toEqual(expectedErrors);
        }
    });

    it("should generate empty array if input errors are not appropriate", () => {
        expect.hasAssertions();

        const errors: unknown = [
            { contexts: { isEmail: "is email context" } },
            { name: "error" },
        ];

        try {
            exceptionFactory(errors as ValidationError[]);
        } catch (e) {
            expect(e.response.errors).toEqual([]);
        }
    });
});
