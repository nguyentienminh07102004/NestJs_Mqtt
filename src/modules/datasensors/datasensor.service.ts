import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { DataSensor } from './datasensor.entity';
import {
  DataSensorQueryDto,
  DataSensorRequestDto,
} from './datasensor.requestdto';

@Injectable()
export class DataSensorService {
  @InjectRepository(DataSensor)
  private readonly dataSensorRepository: Repository<DataSensor>;
  @Inject()
  private readonly dataSource: DataSource;

  async createDataSensor(data: DataSensorRequestDto) {
    const dataSensor = this.dataSensorRepository.create(data);
    return await this.dataSensorRepository.save(dataSensor);
  }

  async getAllDataSensors(query: DataSensorQueryDto) {
    if (!query.page || query.page < 1) query.page = 1;
    if (!query.limit || query.limit < 1) query.limit = 10;
    let startTime: Date | null = null;
    let endTime: Date | null = null;
    if (query.time) {
      if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(query.time)) {
        startTime = new Date(query.time);
        endTime = new Date(startTime.getTime() + 999);
      } else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(query.time)) {
        startTime = new Date(query.time + ':00');
        endTime = new Date(startTime.getTime() + 59999);
      } else if (/^\d{4}-\d{2}-\d{2} \d{2}$/.test(query.time)) {
        startTime = new Date(query.time + ':00:00');
        endTime = new Date(startTime.getTime() + 3599999);
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(query.time)) {
        startTime = new Date(query.time + ' 00:00:00');
        endTime = new Date(startTime.getTime() + 86399999);
      }
    }
    if (!query.sort) query.sort = 'createdDate-DESC';
    const [sortBy, sortOrder] = query.sort.split('-');
    // ép kiểu trong postgres
    const res = await this.dataSource.manager.query(
      `
        SELECT *
        FROM datasensors
        WHERE
            ${query.type} = COALESCE(NULLIF($1, ''), ${query.type}) 
            AND createdDate >= COALESCE($2::timestamp, createdDate)
            AND createdDate <= COALESCE($3::timestamp, createdDate)
        ORDER BY ${sortBy} ${sortOrder}
        LIMIT $4 OFFSET $5;
        `,
      [
        query.type,
        startTime,
        endTime,
        query.limit,
        (query.page - 1) * query.limit,
      ],
    );
    console.log(res);
  }
}
