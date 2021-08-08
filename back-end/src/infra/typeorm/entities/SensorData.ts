import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
  CreateDateColumn
} from 'typeorm';

@Entity('sensor_data')
class SensorData {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	temperature: number;

	@Column()
	ph: number;

	@Column()
	conductivity: number;

	@Column()
	adc_ph: number;

	@Column()
	adc_ec: number;

  @Column()
  greenhouse_id: number;

  @CreateDateColumn()
	created_at: Date;
}

export default SensorData;