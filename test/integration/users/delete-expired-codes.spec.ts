import { UsersTestSuite } from "test/utils/users.test-suite";

describe("delete expired codes", () => {
    const suite = new UsersTestSuite();
    beforeAll(() => suite.setup());
    afterAll(() => suite.teardown());
    afterEach(() => suite.cleanup());

    it("should delete expired codes", async () => {
        const user1 = await suite.usersRepository.save(
            suite.usersRepository.create({
                email: "email1@gmail.com",
                password: "pass1",
            })
        );
        await suite.codesRepository.save(
            suite.codesRepository.create({
                code: "code1",
                user: user1,
                createDate: new Date(2000, 2),
            })
        );

        const user2 = await suite.usersRepository.save(
            suite.usersRepository.create({
                email: "email2@gmail.com",
                password: "pass2",
            })
        );
        await suite.codesRepository.save(
            suite.codesRepository.create({ code: "code2", user: user2 })
        );

        await suite.usersService.deleteExpiredCodes();

        const code1 = await suite.codesRepository.findOne({ user: user1 });
        expect(code1).toBeUndefined();

        const code2 = await suite.codesRepository.findOne({ user: user2 });
        expect(code2).toBeDefined();
    });
});
