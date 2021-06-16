import { ChangePasswordDto } from "src/users/dto/change-password.dto";
import { Code } from "src/users/entities/code.entity";
import { User } from "src/users/entities/user.entity";
import request from "supertest";
import { UsersTestSuite } from "test/utils/users.test-suite";

describe("change password", () => {
    const suite = new UsersTestSuite();
    beforeAll(() => suite.setup());
    afterAll(() => suite.teardown());
    afterEach(() => suite.cleanup());

    const url = suite.urlBuilder.build("/change-password");

    let dto: ChangePasswordDto;

    const exec = () => {
        return suite.http.post(url).send(dto);
    };

    it("should return 400 and error if code is invalid", async () => {
        dto = { code: "asdf", password: "pass" };

        const res = await exec();

        expect(res.status).toBe(400);
        expect(res.body.errors).toContainEqual({
            id: "INVALID_CODE",
            message: expect.any(String),
        });
    });

    it("should return 400 and error if password is invalid", async () => {
        dto = { code: "code", password: "1" };
        const user = await suite.usersRepository.save(
            suite.usersRepository.create({
                email: "testaccount@gmail.com",
                password: "pass",
            })
        );
        await suite.codesRepository.save(
            suite.codesRepository.create({ code: dto.code, user })
        );

        const res = await exec();

        expect(res.status).toBe(400);
        expect(res.body.errors).toContainEqual({
            id: "INVALID_PASSWORD",
            message: expect.any(String),
        });
    });

    describe("if input is valid", () => {
        let res: request.Response;
        let updatedUser: User;
        let code: Code;
        let hash: jest.SpyInstance;

        beforeAll(async () => {
            hash = jest.spyOn<any, any>(suite.hashPasswordPipe, "hash");
            dto = { code: "code", password: "newpassword123" };
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

        it("should hash and change password", async () => {
            expect(hash).toHaveBeenCalledWith(dto.password);
            expect(updatedUser.password).toBe(await hash.mock.results[0].value);
        });

        it("should return 201 and updated user id", () => {
            expect(res.status).toBe(201);
            expect(res.body).toEqual({ id: updatedUser.id });
        });
    });
});
