import { VerifyAccountDto } from "src/users/dto/verify-account.dto";
import { Code } from "src/users/entities/code.entity";
import { User } from "src/users/entities/user.entity";
import request from "supertest";
import { UsersTestSuite } from "test/utils/users.test-suite";

describe("verify account", () => {
    const suite = new UsersTestSuite();
    beforeAll(() => suite.setup());
    afterAll(() => suite.teardown());
    afterEach(() => suite.cleanup());

    const url = suite.urlBuilder.build("/account-verification");

    let dto: VerifyAccountDto;

    const exec = () => {
        return suite.http.post(url).send(dto);
    };

    it("should return 400 and error if code is invalid", async () => {
        dto = { code: "asdf" };

        const res = await exec();

        expect(res.status).toBe(400);
        expect(res.body.errors).toContainEqual({
            id: "INVALID_CODE",
            message: expect.any(String),
        });
    });

    describe("if input is valid", () => {
        let res: request.Response;
        let updatedUser: User;
        let code: Code;

        beforeAll(async () => {
            dto = { code: "code" };
            const user = await suite.usersRepository.save(
                suite.usersRepository.create({
                    email: "testaccount@gmail.com",
                    password: "pass",
                })
            );
            await suite.codesRepository.save(
                suite.codesRepository.create({ code: dto.code, user })
            );

            res = await exec();

            updatedUser = await suite.usersRepository.findOne({
                email: user.email,
            });
            code = await suite.codesRepository.findOne({
                user: updatedUser,
            });
        });

        it("should delete code", () => {
            expect(code).toBeUndefined();
        });

        it("should activate user", () => {
            expect(updatedUser.isActive).toBeTruthy();
        });

        it("should return 201 and updated user id", () => {
            expect(res.status).toBe(201);
            expect(res.body).toEqual({ id: updatedUser.id });
        });
    });
});
