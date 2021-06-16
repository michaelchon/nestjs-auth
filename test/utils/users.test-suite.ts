import { INestApplication } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { useContainer } from "class-validator";
import { ConfigValidation } from "src/config/config.validation";
import ormconfig from "src/config/ormconfig";
import { EmailService } from "src/email/email.service";
import { Code } from "src/users/entities/code.entity";
import { User } from "src/users/entities/user.entity";
import { HashPasswordPipe } from "src/users/transformation/hash-password.pipe";
import { UsersModule } from "src/users/users.module";
import { UsersService } from "src/users/users.service";
import request from "supertest";
import { Repository } from "typeorm";
import { UrlBuilder } from "./url-builder";

export class UsersTestSuite {
    public urlBuilder: UrlBuilder;

    private module: TestingModule;
    private app: INestApplication;

    public http: request.SuperTest<request.Test>;
    public usersRepository: Repository<User>;
    public codesRepository: Repository<Code>;
    public emailService: EmailService;
    public usersService: UsersService;
    public hashPasswordPipe: HashPasswordPipe;

    constructor() {
        this.urlBuilder = new UrlBuilder("/users");
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
                UsersModule,
            ],
        }).compile();
    }

    async initApp() {
        this.app = this.module.createNestApplication();
        useContainer(this.app.select(UsersModule), { fallbackOnErrors: true });
        await this.app.init();
    }

    async initComponents() {
        this.http = request(this.app.getHttpServer());
        this.usersRepository = this.module.get(getRepositoryToken(User));
        this.codesRepository = this.module.get(getRepositoryToken(Code));
        this.emailService = this.module.get(EmailService);
        this.usersService = this.module.get(UsersService);
        this.hashPasswordPipe = this.module.get(HashPasswordPipe);
    }

    async teardown() {
        await this.app.close();
    }

    async cleanup() {
        await this.usersRepository.createQueryBuilder().delete().execute();
    }
}
