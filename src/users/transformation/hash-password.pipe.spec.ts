import { ArgumentMetadata } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hashDiToken } from "../users.di-tokens";
import { HashPasswordPipe } from "./hash-password.pipe";

describe("hash password", () => {
    let pipe: HashPasswordPipe;

    const mockHash = jest.fn().mockResolvedValue("hash");

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers: [
                HashPasswordPipe,
                {
                    provide: hashDiToken,
                    useValue: mockHash,
                },
            ],
        }).compile();

        pipe = module.get(HashPasswordPipe);
    });

    let hash: jest.SpyInstance;
    let value: any;
    let metadata: unknown;

    const exec = () => {
        hash = jest.spyOn<any, any>(pipe, "hash");

        return pipe.transform(value, metadata as ArgumentMetadata);
    };

    it("should hash password if input is valid", async () => {
        value = { email: "email@gmail.com", password: "password123" };
        metadata = { type: "body" };

        const result = await exec();

        expect(hash).toHaveBeenCalledWith(value.password);
        expect(result).toEqual({
            ...value,
            password: await hash.mock.results[0].value,
        });
    });

    it("should return the same value if type is not body", async () => {
        value = { email: "email@gmail.com", password: "password123" };
        metadata = { type: "query" };

        const result = await exec();

        expect(result).toEqual(value);
    });

    it("should return the same value if input does not have password property", async () => {
        value = { email: "email@gmail.com" };
        metadata = { type: "body" };

        const result = await exec();

        expect(result).toEqual(value);
    });
});
