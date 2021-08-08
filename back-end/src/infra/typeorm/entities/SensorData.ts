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
	adc_ec: number;

	@Column()
	adc_ph: number;

	@Column()
	conductivity: number;


  @Column()
  greenhouse_id: number;

  @CreateDateColumn()
	created_at: Date;
}

export default SensorData;