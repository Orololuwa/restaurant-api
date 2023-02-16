import { MigrationInterface, QueryRunner } from "typeorm";

export class devSchema1676587908089 implements MigrationInterface {
    name = 'devSchema1676587908089'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ingredient" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "count" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "ordered_ingredients" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "salad" integer NOT NULL DEFAULT (0), "bacon" integer NOT NULL DEFAULT (0), "cheese" integer NOT NULL DEFAULT (0), "meat" integer NOT NULL DEFAULT (0))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "address" varchar NOT NULL, "password" varchar, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "order" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "price" integer NOT NULL, "deliveryMethod" varchar NOT NULL, "ingredientsId" integer, "userId" integer, CONSTRAINT "REL_6b72c9e5cc2beacd269f939fae" UNIQUE ("ingredientsId"))`);
        await queryRunner.query(`CREATE TABLE "temporary_order" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "price" integer NOT NULL, "deliveryMethod" varchar NOT NULL, "ingredientsId" integer, "userId" integer, CONSTRAINT "REL_6b72c9e5cc2beacd269f939fae" UNIQUE ("ingredientsId"), CONSTRAINT "FK_6b72c9e5cc2beacd269f939faeb" FOREIGN KEY ("ingredientsId") REFERENCES "ordered_ingredients" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_order"("id", "price", "deliveryMethod", "ingredientsId", "userId") SELECT "id", "price", "deliveryMethod", "ingredientsId", "userId" FROM "order"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`ALTER TABLE "temporary_order" RENAME TO "order"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" RENAME TO "temporary_order"`);
        await queryRunner.query(`CREATE TABLE "order" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "price" integer NOT NULL, "deliveryMethod" varchar NOT NULL, "ingredientsId" integer, "userId" integer, CONSTRAINT "REL_6b72c9e5cc2beacd269f939fae" UNIQUE ("ingredientsId"))`);
        await queryRunner.query(`INSERT INTO "order"("id", "price", "deliveryMethod", "ingredientsId", "userId") SELECT "id", "price", "deliveryMethod", "ingredientsId", "userId" FROM "temporary_order"`);
        await queryRunner.query(`DROP TABLE "temporary_order"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "ordered_ingredients"`);
        await queryRunner.query(`DROP TABLE "ingredient"`);
    }

}
