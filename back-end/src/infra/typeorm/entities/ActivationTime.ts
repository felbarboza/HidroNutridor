import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
  CreateDateColumn
} from 'typeorm';

@Entity('activation_time')
class ActivationTime {
	@PrimaryGeneratedColumn('uuid')
	id: string;

  @Column()
  greenhouse_id: number;

  @Column()
  hour_time_on: number;

  @Column()
  minute_time_on: number;

  @Column()
  hour_time_off: number;

  @Column()
  minute_time_off: number;
}

export default ActivationTime;