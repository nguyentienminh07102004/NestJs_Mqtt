import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { DataSensor } from "./datasensor.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSensorRequestDto } from "./datasensor.requestdto";

@Injectable()
export class DataSensorService {
    @InjectRepository(DataSensor)
    private readonly dataSensorRepository: Repository<DataSensor>;

    async createDataSensor(data: DataSensorRequestDto) {
        const dataSensor = this.dataSensorRepository.create(data);
        return await this.dataSensorRepository.save(dataSensor);
    }
}