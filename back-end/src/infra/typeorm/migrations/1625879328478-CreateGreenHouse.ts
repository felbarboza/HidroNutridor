import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateGreenHouse1625879328478 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
			new Table({
				name: 'greenhouse',
				columns: [
					{
						name: 'id',
						type: 'int',
						isPrimary: true,
						isGenerated: true,
						generationStrategy: 'increment',
					},
					{
						name: 'name',
						type: 'varchar',
						isNullable: false,
					},
				],
			}),
		);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('greenhouse')
    }

}
