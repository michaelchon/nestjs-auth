import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUserTable1623748075732 implements MigrationInterface {
    name = 'CreateUserTable1623748075732'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user_account" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "refreshToken" character varying,
                "isActive" boolean NOT NULL DEFAULT false,
                CONSTRAINT "UQ_56a0e4bcec2b5411beafa47ffa5" UNIQUE ("email"),
                CONSTRAINT "PK_6acfec7285fdf9f463462de3e9f" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "user_account"
        `);
    }

}
