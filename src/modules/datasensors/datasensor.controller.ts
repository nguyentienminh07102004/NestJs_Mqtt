import { Controller, Get, Inject, Query } from "@nestjs/common";
import { DataSensorService } from "./datasensor.service";
import { DataSensorQueryDto } from "./datasensor.requestdto";

@Controller('datasensors')
export class DataSensorController {
    @Inject()
    private readonly dataSensorService: DataSensorService;

    @Get('search')
    async getAllDataSensors(@Query() query: DataSensorQueryDto) {
        await this.dataSensorService.getAllDataSensors(query);
    }
}