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
  @Column({ nullable: false, type: 'float' })
  rain: number;
  @Column({ nullable: false, type: 'float' })
  windSpeed: number;
  @Column({ nullable: false, type: 'float' })
  pressure: number;
  @Column({ nullable: false, default: () => 'NOW()' })
  timestamp: Date;
}