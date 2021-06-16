import {
    ArgumentMetadata,
    Inject,
    Injectable,
    PipeTransform,
} from "@nestjs/common";
import { IHash } from "../interfaces/di.interfaces";
import { hashDiToken } from "../users.di-tokens";

@Injectable()
export class HashPasswordPipe implements PipeTransform {
    constructor(
        @Inject(hashDiToken)
        private readonly hash: IHash
    ) {}

    async transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type !== "body" || !value.password) return value;

        return { ...value, password: await this.hash(value.password) };
    }
}
