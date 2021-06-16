import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigValidation } from "./config/config.validation";
import ormconfig from "./config/ormconfig";
import { UsersModule } from "./users/users.module";
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: ConfigValidation.schema,
            validationOptions: ConfigValidation.options,
        }),
        TypeOrmModule.forRootAsync({
            useFactory: () => ormconfig,
        }),
        ScheduleModule.forRoot(),
        UsersModule,
        AuthModule,
    ],
})
export class AppModule {}
