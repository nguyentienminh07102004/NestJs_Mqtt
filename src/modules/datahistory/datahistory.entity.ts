import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('dataHistories')
export class DataHistory {
  @PrimaryGeneratedColumn('identity')
  id: number;
  @Column({ nullable: false, default: 'ON' })
  status: 'ON' | 'OFF';
  @Column({ nullable: false })
  deviceName: string;
  @Column({ nullable: false, default: () => "NOW()" })
  timestamp: Date;
}