import request from "supertest";
import { AuthTestSuite } from "test/utils/auth.test-suite";

describe("refresh", () => {
    const suite = new AuthTestSuite();
    beforeAll(() => suite.setup());
    afterAll(() => suite.teardown());
    afterEach(() => suite.cleanup());

    const url = suite.urlBuilder.build("/refresh");

    let dto: { token: string };

    const exec = () => {
        return suite.http.post(url).send(dto);
    };

    it("should return 401 if token has invalid format", async () => {
        dto = { token: "token" };

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it("should return 401 if user id is not uuid", async () => {
        dto = {
            token: suite.authService.generateRefreshToken({ sub: "id" }),
        };

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it("should return 401 if user not found", async () => {
        dto = {
            token: suite.authService.generateRefreshToken({
                sub: "4f84f282-ea6a-480d-ba97-d1d7ca6d3ccb",
            }),
        };

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it("should return 401 if token does not match", async () => {
        const user = await suite.usersRepository.save(
            suite.usersRepository.create({
                email: "email",
                password: "pass",
                refreshToken: "token",
            })
        );
        dto = {
            token: suite.authService.generateRefreshToken({
                sub: user.id,
            }),
        };

        const res = await exec();

        expect(res.status).toBe(401);
    });

    describe("if input is valid", () => {
        let res: request.Response;

        beforeAll(async () => {
            const user = await suite.usersRepository.save(
                suite.usersRepository.create({
                    email: "email",
                    password: "pass",
                })
            );
            const token = suite.authService.generateRefreshToken({
                sub: user.id,
            });
            user.refreshToken = await suite.hash(token);
            await suite.usersRepository.save(user);
            dto = {
                token,
            };

            res = await exec();
        });

        it("should return 201 and access token", async () => {
            expect(res.status).toBe(201);
            expect(res.body).toEqual({ accessToken: expect.any(String) });
        });
    });
});
