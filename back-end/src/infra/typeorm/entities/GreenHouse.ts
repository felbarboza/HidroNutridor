import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('greenhouse')
class GreenHouse {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column()
	name: string;
}

export default GreenHouse;