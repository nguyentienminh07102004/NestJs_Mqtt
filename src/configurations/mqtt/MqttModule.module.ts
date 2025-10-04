import { Module } from "@nestjs/common";
import { MqttProvider } from "./mqtt.service";

@Module({
    providers: [MqttProvider],
    exports: [MqttProvider],
    imports: [],
})
export class MqttModule {}