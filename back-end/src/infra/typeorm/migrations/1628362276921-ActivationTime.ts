import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class ActivationTime1628362276921 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
			new Table({
				name: 'activation_time',
				columns: [
					{
						name: 'id',
						type: 'uuid',
						isPrimary: true,
						generationStrategy: 'uuid',
						default: 'uuid_generate_v4()',
					},
					{
						name: 'greenhouse_id',
						type: 'numeric',
						isNullable: false,
					},
					{
						name: 'hour_time_on',
						type: 'numeric',
						isNullable: false,
					},
					{
						name: 'minute_time_on',
						type: 'numeric',
						isNullable: false,
					},
					{
						name: 'hour_time_off',
						type: 'numeric',
						isNullable: false,
					},
					{
						name: 'minute_time_off',
						type: 'numeric',
						isNullable: false,
					},
				],
			}),
		);

        await queryRunner.createForeignKey(
            'sensor_data',
            new TableForeignKey({
                name: 'GreenHouseActivationTime',
                columnNames: ['greenhouse_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'greenhouse',
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE'
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('activation_time')
    }

}
