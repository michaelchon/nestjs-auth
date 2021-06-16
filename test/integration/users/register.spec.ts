import { RegisterDto } from "src/users/dto/register.dto";
import { Code } from "src/users/entities/code.entity";
import { User } from "src/users/entities/user.entity";
import request from "supertest";
import { UsersTestSuite } from "test/utils/users.test-suite";

describe("register", () => {
    const suite = new UsersTestSuite();
    beforeAll(() => suite.setup());
    afterAll(() => suite.teardown());
    afterEach(() => suite.cleanup());

    const url = suite.urlBuilder.build("/register");

    let dto: RegisterDto;

    const exec = () => {
        return suite.http.post(url).send(dto);
    };

    it("should return 400 and error if email is invalid", async () => {
        dto = { email: "dasdfasdf", password: "asdfasdfa123123" };

        const res = await exec();

        expect(res.status).toBe(400);
        expect(res.body.errors).toContainEqual({
            id: "INVALID_EMAIL",
            message: expect.any(String),
        });
    });

    it("should return 400 and error if user already exists", async () => {
        dto = {
            email: "email123@gmail.com",
            password: "asdfasdfasdf123123",
        };
        await suite.usersRepository.save(suite.usersRepository.create(dto));

        const res = await exec();

        expect(res.status).toBe(400);
        expect(res.body.errors).toContainEqual({
            id: "USER_ALREADY_EXISTS",
            message: expect.any(String),
        });
    });

    it("should return 400 and error if password is invalid", async () => {
        dto = { email: "email12321@gmail.com", password: "as" };

        const res = await exec();

        expect(res.status).toBe(400);
        expect(res.body.errors).toContainEqual({
            id: "INVALID_PASSWORD",
            message: expect.any(String),
        });
    });

    describe("if input is valid", () => {
        let res: request.Response;
        let hash: jest.SpyInstance;
        let sendEmail: jest.SpyInstance;
        let createdUser: User;
        let createdCode: Code;

        beforeAll(async () => {
            hash = jest.spyOn<any, any>(suite.hashPasswordPipe, "hash");
            sendEmail = jest.spyOn(suite.emailService, "sendEmail");
            sendEmail.mockImplementation();
            dto = {
                email: "testaccount@gmail.com",
                password: "password123",
            };

            res = await exec();

            createdUser = await suite.usersRepository.findOne({
                email: dto.email,
            });
            createdCode = await suite.codesRepository.findOne({
                user: createdUser,
            });
        });

        it("should hash password", async () => {
            expect(hash).toHaveBeenCalledWith(dto.password);
            expect(createdUser.password).toBe(await hash.mock.results[0].value);
        });

        it("should send verification", () => {
            expect(createdCode).toBeDefined();
            expect(sendEmail.mock.calls[0][0].to).toBe(dto.email);
        });

        it("should return 201 and created user id", () => {
            expect(res.status).toBe(201);
            expect(res.body).toEqual({ id: createdUser.id });
        });
    });
});
