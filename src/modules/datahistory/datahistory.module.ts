import { Module } from "@nestjs/common";
import { DataHistoryController } from "./datahistory.controller";
import { DataHistoryService } from "./datahistory.service";
import { MqttModule } from "src/configurations/mqtt/MqttModule.module";

@Module({
    providers: [DataHistoryService],
    controllers: [DataHistoryController],
    imports: [MqttModule],
    exports: [],
})
export class DataHistoryModule {}