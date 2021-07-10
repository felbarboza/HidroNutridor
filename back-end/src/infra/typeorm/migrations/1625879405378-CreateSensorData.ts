import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateSensorData1625879405378 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
			new Table({
				name: 'sensor_data',
				columns: [
					{
						name: 'id',
						type: 'uuid',
						isPrimary: true,
						generationStrategy: 'uuid',
						default: 'uuid_generate_v4()',
					},
					{
						name: 'temperature',
						type: 'numeric',
						isNullable: false,
					},
					{
						name: 'ph',
						type: 'numeric',
						isNullable: false,
					},
					{
						name: 'conductivity',
						type: 'numeric',
						isNullable: false,
					},
                    {
						name: 'greenhouse_id',
						type: 'int',
						isNullable: false,
					},
                    {
						name: 'created_at',
						type: 'timestamp with time zone',
						default: 'now()',
					},
				],
			}),
		);

        await queryRunner.createForeignKey(
            'sensor_data',
            new TableForeignKey({
                name: 'GreenHouseSensor',
                columnNames: ['greenhouse_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'greenhouse',
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE'
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('sensor_data')
    }

}
