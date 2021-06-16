import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from "class-validator";
import { createValidationDecorator } from "src/validation/create-validation-decorator";
import { Repository } from "typeorm";
import { Code } from "../entities/code.entity";

@ValidatorConstraint({ async: true })
@Injectable()
export class CodeExistsConstraint implements ValidatorConstraintInterface {
    constructor(
        @InjectRepository(Code)
        private readonly codesRepository: Repository<Code>
    ) {}

    async validate(code: string) {
        const codeInDb = await this.codesRepository.findOne({ code });

        return !!codeInDb;
    }
}

export const CodeExists = createValidationDecorator(CodeExistsConstraint);
