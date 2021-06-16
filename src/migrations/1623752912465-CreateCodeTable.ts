import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateCodeTable1623752912465 implements MigrationInterface {
    name = 'CreateCodeTable1623752912465'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "code" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "code" character varying NOT NULL,
                "createDate" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid,
                CONSTRAINT "UQ_3aab60cbcf5684b4a89fb46147e" UNIQUE ("code"),
                CONSTRAINT "REL_76c04a353b3639752b096e75ec" UNIQUE ("userId"),
                CONSTRAINT "PK_367e70f79a9106b8e802e1a9825" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "code"
            ADD CONSTRAINT "FK_76c04a353b3639752b096e75ec4" FOREIGN KEY ("userId") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "code" DROP CONSTRAINT "FK_76c04a353b3639752b096e75ec4"
        `);
        await queryRunner.query(`
            DROP TABLE "code"
        `);
    }

}
