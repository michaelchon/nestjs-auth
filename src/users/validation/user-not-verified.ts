import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from "class-validator";
import { createValidationDecorator } from "src/validation/create-validation-decorator";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";

@ValidatorConstraint({ async: true })
@Injectable()
export class UserNotVerifiedConstraint implements ValidatorConstraintInterface {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>
    ) {}

    async validate(email: string) {
        const user = await this.usersRepository.findOne({ email });

        if (!user) {
            return true;
        }

        return !user.isActive;
    }
}

export const UserNotVerified = createValidationDecorator(
    UserNotVerifiedConstraint
);
