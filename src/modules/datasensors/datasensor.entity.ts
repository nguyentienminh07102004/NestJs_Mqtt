import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('datasensors')
export class DataSensor {
  @PrimaryGeneratedColumn('identity')
  id: number;
  @Column({ nullable: false, type: 'float' })
  temperature: number;
  @Column({ nullable: false, type: 'float' })
  humidity: number;
  @Column({ nullable: false, type: 'float' })
  brightness: number;
  @Column({ nullable: false, default: () => 'NOW()' })
  createdDate: Date;
}