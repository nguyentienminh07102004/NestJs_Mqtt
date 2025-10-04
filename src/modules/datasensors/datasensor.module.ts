import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSensor } from "./datasensor.entity";
import { DataSensorService } from "./datasensor.service";
import { DataSensorController } from "./datasensor.controller";

@Module({
    imports: [TypeOrmModule.forFeature([DataSensor])],
    controllers: [DataSensorController],
    providers: [DataSensorService],
    exports: [DataSensorService],
})
export class DataSensorModule {}