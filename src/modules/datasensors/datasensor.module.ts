import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSensor } from "./datasensor.entity";
import { DataSensorService } from "./datasensor.service";

@Module({
    imports: [TypeOrmModule.forFeature([DataSensor])],
    controllers: [],
    providers: [DataSensorService],
    exports: [DataSensorService],
})
export class DataSensorModule {}