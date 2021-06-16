import { INestApplication } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { useContainer } from "class-validator";
import { hashDiToken } from "src/auth/auth.di-tokens";
import { AuthModule } from "src/auth/auth.module";
import { AuthService } from "src/auth/auth.service";
import { ConfigValidation } from "src/config/config.validation";
import ormconfig from "src/config/ormconfig";
import { User } from "src/users/entities/user.entity";
import { IHash } from "src/users/interfaces/di.interfaces";
import request from "supertest";
import { Repository } from "typeorm";
import { UrlBuilder } from "./url-builder";

export class AuthTestSuite {
    public urlBuilder: UrlBuilder;

    private module: TestingModule;
    private app: INestApplication;

    public http: request.SuperTest<request.Test>;
    public usersRepository: Repository<User>;
    public authService: AuthService;
    public hash: IHash;

    constructor() {
        this.urlBuilder = new UrlBuilder("/auth");
    }

    async setup() {
        await this.initModule();
        await this.initApp();
        this.initComponents();
    }

    async initModule() {
        this.module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    validationSchema: ConfigValidation.schema,
                    validationOptions: ConfigValidation.options,
                }),
                TypeOrmModule.forRootAsync({
                    useFactory: () => ormconfig,
                }),
                AuthModule,
            ],
        }).compile();
    }

    async initApp() {
        this.app = this.module.createNestApplication();
        useContainer(this.app.select(AuthModule), { fallbackOnErrors: true });
        await this.app.init();
    }

    async initComponents() {
        this.http = request(this.app.getHttpServer());
        this.usersRepository = this.module.get(getRepositoryToken(User));
        this.authService = this.module.get(AuthService);
        this.hash = this.module.get(hashDiToken);
    }

    async teardown() {
        await this.app.close();
    }

    async cleanup() {
        await this.usersRepository.createQueryBuilder().delete().execute();
    }
}
