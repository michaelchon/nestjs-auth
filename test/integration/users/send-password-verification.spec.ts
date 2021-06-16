import { SendPasswordVerificationDto } from "src/users/dto/send-password-verification.dto";
import { UsersTestSuite } from "test/utils/users.test-suite";

describe("send password verification", () => {
    const suite = new UsersTestSuite();
    beforeAll(() => suite.setup());
    afterAll(() => suite.teardown());
    afterEach(() => suite.cleanup());

    const url = suite.urlBuilder.build("/send-password-verification");

    let dto: SendPasswordVerificationDto;
    let sendEmail: jest.SpyInstance;

    const exec = () => {
        sendEmail = jest.spyOn(suite.emailService, "sendEmail");
        sendEmail.mockImplementation();

        return suite.http.post(url).send(dto);
    };

    it("should return 400 and error if user does not exist", async () => {
        dto = { email: "email" };

        const res = await exec();

        expect(res.status).toBe(400);
        expect(res.body.errors).toContainEqual({
            id: "INVALID_EMAIL",
            message: expect.any(String),
        });
    });

    it("should return 400 and error if user already has code", async () => {
        dto = { email: "testaccount@gmail.com" };
        const user = await suite.usersRepository.save(
            suite.usersRepository.create({
                email: dto.email,
                password: "pass",
            })
        );
        await suite.codesRepository.save(
            suite.codesRepository.create({ code: "code", user })
        );

        const res = await exec();

        expect(res.status).toBe(400);
        expect(res.body.errors).toContainEqual({
            id: "USER_ALREADY_HAS_CODE",
            message: expect.any(String),
        });
    });

    it("should return 201 and send verification", async () => {
        dto = { email: "testaccount@gmail.com" };
        const user = await suite.usersRepository.save(
            suite.usersRepository.create({
                email: dto.email,
                password: "pass",
            })
        );

        const res = await exec();

        expect(res.status).toBe(201);
        expect(res.body).toEqual({});
        const createdCode = await suite.codesRepository.findOne({
            user,
        });
        expect(createdCode).toBeDefined();
        expect(sendEmail.mock.calls[0][0].to).toBe(dto.email);
    });
});
