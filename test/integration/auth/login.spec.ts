import { User } from "src/users/entities/user.entity";
import request from "supertest";
import { AuthTestSuite } from "test/utils/auth.test-suite";

describe("login", () => {
    const suite = new AuthTestSuite();
    beforeAll(() => suite.setup());
    afterAll(() => suite.teardown());
    afterEach(() => suite.cleanup());

    const url = suite.urlBuilder.build("/login");

    let dto: { email: string; password: string };

    const exec = () => {
        return suite.http.post(url).send(dto);
    };

    it("should return 401 if email is invalid", async () => {
        dto = { email: "email", password: "password" };

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it("should return 401 if password is invalid", async () => {
        dto = { email: "testaccount@gmail.com", password: "password" };
        await suite.usersRepository.save(
            suite.usersRepository.create({ email: dto.email, password: "pass" })
        );

        const res = await exec();

        expect(res.status).toBe(401);
    });

    describe("if input is valid", () => {
        let res: request.Response;
        let user: User;

        beforeAll(async () => {
            dto = { email: "testaccount@gmail.com", password: "password" };
            await suite.usersRepository.save(
                suite.usersRepository.create({
                    email: dto.email,
                    password: await suite.hash(dto.password),
                })
            );

            res = await exec();

            user = await suite.usersRepository.findOne({ email: dto.email });
        });

        it("should set refresh token on user", () => {
            expect(user.refreshToken).not.toBeNull();
        });

        it("should return 201 and tokens if input is valid", () => {
            expect(res.status).toBe(201);
            expect(res.body).toEqual({
                accessToken: expect.any(String),
                refreshToken: expect.any(String),
            });
        });
    });
});
